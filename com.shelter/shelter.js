var http = require('http');
var express = require('express');
var app = express();
var socket = require('socket.io');
var login = require('./dao/Login');
var index = require('./index');
var util = require('./util.js');

//应用监听端口
var port = 3000;
var server = http.Server(app);
server.listen(port);    //必须是 http设置端口   app.listen(port) 并不会将端口给server
var io =  socket(server,{
    pingTimeout: 6000,
    pingInterval: 10000
});
//静态资源
app.use(express.static('public'));



//房间信息记录
var roomsInfo = []
//战斗申请池
var fightSeq = []
//消息状态枚举
var msgEnum= {
    success:200,   //普通消息
    fail:1,     //操作失败消息反馈
    error:2,    //错误消息
}


//引入外界js的方式分流书写app功能
index(app);


//初始化/index 空间
var index = io.of("/index");
//io中间件
index.use(function(socket, next){
    console.log("nameSpace.use");
    next();
});

index.on("connection", function (socket) {
    console.log("socket.io监听connection")

    //登陆拦截器  socket中间件
    socket.use(function(packet, next){
        console.log("packet:" + packet[0] + "packet.length:" + packet.length);
        if(packet[0] == 'login' || packet[0] == 'close' || packet[0] == 'disconnect'){
            return next();
        }else if(packet.length > 1){
            try{
                var id = decode(packet[1].token);
                console.log("id:" + id + " util.get(id):" + util.get(id));
                if(util.get(id) != null){
                    return next();
                }else{
                    next(new Error("请登陆"));
                }
            }catch (e){
                next(new Error("请登陆"));
            }
        }
        next(new Error("请登陆"));
    });

    //error事件处理器
    socket.on('error', function(error){
        console.log("socket.error");
        socket.emit('error',{'status': msgEnum.error, 'msg':'error:' + error});
    });

    //链接断开
    socket.on('disconnect', function(data){
        console.log('socket.disconnect');
    });


    //第一次建立链接后登陆操作
    socket.on('login', function(data){
        var userName = data.userName;
        var password = data.password;


        //回掉函数方式同步
        login.loginBack(userName, password, function(flag, msg, results){
            if(flag){
                console.log('local socket.id ' + socket.id)
                var token = encode(results[0].id);
                socket.emit('loginResult',{'status':msgEnum.success,'msg':msg, 'results': token});

                util.push(token, results[0].id);
            }else{
                console.log('local socket.id ' + socket.id)
                socket.emit('loginResult',{'status':msgEnum.fail,'msg':msg});
            }
        })
    });

    //广播信息
    socket.on('broadcastMsg', function(data){
        socket.broadcast.emit('msg', {'status': msgEnum.success, 'msg':'socket.id:'+ socket.id + ' 发送了广播消息:' + data.msg});
    });

    //私聊信息
    socket.on('msg', function(data){
        console.log(data.id);
        socket.to(data.id).emit('msg', {'status': msgEnum.success, 'from:': socket.id + ' to:' + data.id + ' 发送了消息:' + data.msg});
    });


    //进入房间
    socket.on('join', function(data){
        if(data.room != null && data.room != ""){
            socket.join(data.room);
            // 将用户昵称加入房间名单中
            if (!roomsInfo[data.room]) {
                roomsInfo[data.room] = [];
            }
            roomsInfo[data.room].push(data.token);

            //发送反馈消息
            socket.to(socket.id).emit('msg', {status:msgEnum.success, })
        }else{
            socket.to(socket.id).emit('msg', {status:msgEnum.fail, })
        }
    });

    //room消息广播
    socket.on('room', function(data){
        if(data.room != null && data.room != ""){
            var room = data.room;
            var leaveFlag = data.leaveFlag;

            var event;
            switch (room){   //不同房间不同事件
                case 'roomChat': event = 'roomChat'; break;
                case 'roomHit': event = 'roomHit'; break;
                default:
                    break;
            }
            if(leaveFlag){
                socket
            }else{
                socket.join(room);
                socket.to(room).emit(event, {'status':200, 'msg':data.msg});
            }
        }else{
            new Error('进入room失败')
        }
    });


});



//加密
var encode = function(str){
    var r = (Math.random()*10).toFixed(0);
    return String(r) + (((parseInt(str) + parseInt(r)) << 1) * 2)
}
//解密
var decode = function(str){
    var r = str.substring(0,1);
    var num = str.substring(1);
    return ((num/2) >> 1) - r
}