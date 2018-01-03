var http = require('http');
var express = require('express');
var app = express();
var socket = require('socket.io');
var login = require('./dao/Login');


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


//展示socketio demo页面
app.get('/socketIndex/:fileName', function(req, res){
    var fileName = req.params.fileName;

    res.sendFile(__dirname + '/view/' + fileName, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).send("产生错误:" + err).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });
});

//express web方式自动路由方式
app.get('/queryAllUser', function (req, res) {

    res.writeHead(200, {'Content-Type': 'application/json'});
    try{
        //方法二  回掉函数方式同步
        login.userBack(function(flag, results){
            if(flag){
                res.write(JSON.stringify(results));
                res.end();
            }else{
                res.end(JSON.stringify({"status": 001, "error": e.toString()}));
            }
        });
    }catch (e){
        res.end(JSON.stringify({"status": 001, "error": e.toString()}));
    }
});


//登陆
app.get('/login', function (req, res) {

    res.writeHead(200, {'Content-Type': 'application/json'});
    try{
        var userName = req.param("userName");
        var password = req.param("password");

        //方法二  回掉函数方式同步
        login.loginBack(userName, password, function(flag, msg, results){
            if(flag){
                res.write(JSON.stringify(map));
                res.end();
            }else{
                res.end(JSON.stringify({"status": 001, "error": e.toString()}));
            }
        });
    }catch (e){
        res.end(JSON.stringify({"status": 001, "error": e.toString()}));
    }
});



var index = io.of("/index");

//io中间件
index.use(function(socket, next){
    console.log("nameSpace.use");
    next();
});

var rooms = []

index.on("connection", function (socket) {
    console.log("socket.io监听connection")

    //登陆拦截器  socket中间件
    socket.use(function(packet, next){
        console.log("socket.use:packet" + packet[0]);
        if(packet[0] == 'login' || packet[1].token != null){
            return next();
        }
        next(new Error("请登陆"));
    });

    //error事件处理器
    socket.on('error', function(error){
        console.log("socket.error");
        socket.emit('error',{'status': 001, 'msg':'error:' + error});
    });


    //第一次建立链接后登陆操作
    socket.on('login', function(data){
        var userName = data.userName;
        var password = data.password;

        //方法一  事件方式同步
        // login.login(userName, password);
        //
        // console.log(socket.id)
        // console.log(socket.rooms);

        //这种方法  socket会广播发送
        // login.emitter.on('loginUser', function (data) {
        //     if(data.flag){
        //         console.log('local socket.id ' + socket.id)
        //         socket.emit('loginResult',{'status':200,'msg':data.msg}); //.to(/* another socket id */) 私聊
        //     }else{
        //         console.log('local socket.id ' + socket.id)
        //         socket.emit('loginResult',{'status':001,'msg':data.msg});
        //     }
        // })


        //方法二  回掉函数方式同步
        login.loginBack(userName, password, function(flag, msg, results){
            if(flag){
                console.log('local socket.id ' + socket.id)
                socket.emit('loginResult',{'status':200,'msg':msg, 'results': results[0].id});
            }else{
                console.log('local socket.id ' + socket.id)
                socket.emit('loginResult',{'status':001,'msg':msg});
            }
        })
    });

    //广播信息
    socket.on('broadcastMsg', function(data){
        socket.broadcast.emit('msg', {'status': 200, 'socket.id:': socket.id + ' 发送了广播消息:' + data.msg});
    });

    //私聊信息
    socket.on('msg', function(data){
        console.log(data.id);
        socket.to(data.id).emit('msg', {'status': 200, 'from:': socket.id + ' to:' + data.id + ' 发送了消息:' + data.msg});
    });

    //room消息广播
    socket.on('room', function(data){
        if(data.room != null && data.room != ""){
            var room = data.room;
            var event;
            switch (room){   //不同房间不同事件
                case 'roomChat': event = 'roomChat'; break;
                case 'roomHit': event = 'roomHit'; break;
                default:
                    break;
            }
            socket.join(room);
            socket.to(room).emit(event, {'status':200, 'msg':data.msg});
        }else{
            new Error('进入room失败')
        }
    });


});