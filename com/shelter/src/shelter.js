/**
 * kenan shelter项目主流程 入口
 * 1.加载http拦截器
 * 2.加载各种http 功能模块
 * 3.加载各种socket功能模块
 * 4.创建全局参数
 */
//基本js
var http = require('http');
var express = require('express');
var app = express();
var socket = require('socket.io');
var os = require('os');


//公共服务
var util = require('./util/util');
var connectUtil = require('./util/ConnectUtil');
var loggerUtil = require('./util/logFactroy');
var redisUtil = require('./util/redisUtil');
var config = require('./properties/shelterConfig');


/** 启动参数*/
//process是一个全局对象，argv返回的是一组包含命令行参数的数组。
//第一项为”node”，第二项为执行的js的完整路径，后面是附加在命令行后的参数
var args = process.argv.splice(2)
if(args.length == 0){
    args[0] = "dev";
    args[1] = config.dev.ip;
}
console.log(args);


/** util初始化*/
//引入外界js的方式分流书写app功能
//初始化数据库链接
connectUtil.init(args[0]);
//初始化日志配置
loggerUtil.init(args[0]);
var logger = loggerUtil.getInstance();
//初始化redis
redisUtil.init(args[0]);

var port = 3000;
if(args[0] == "dev"){
    port = config.dev.applicationPort;
}else{
    port = config.release.applicationPort;
}
/** util 初始化结束 */


//功能模块
var indexControllor = require('./controller/indexControllor');  //登陆注册
var userCard = require('./controller/userCardController');  //用户卡牌
var interceptor = require('./Interceptor/LoginInterceptor');   //拦截器中间件
var shop = require('./controller/shopController'); //商店相关
//var match = require('./controller/matchControllor'); //匹配相关   使用匹配机matcher


//业务服务
var userService = require('./service/UserService');  //用户服务




/**  初始化 */
/*express初始化*/
var server = http.Server(app);
server.listen(port);    //必须是 http设置端口   app.listen(port) 并不会将端口给server


/*socket.io 初始化*/
var io =  socket(server,{
    pingTimeout: 6000,
    pingInterval: 10000
});
var index = io.of("/index"); //index 空间

//静态资源
app.use(express.static('public'));

/*全局变量  常量*/
//房间信息记录
var roomsInfo = []
//消息状态枚举
var msgEnum= {
    success:200,   //普通消息
    fail:1,     //操作失败消息反馈
    error:2,    //错误消息
}


/*controller 初始化*/
//拦截器
interceptor(app);
//注册登陆功能信息
indexControllor(app);
//用户卡牌包-卡牌信息
userCard(app);
//商店相关
shop(app);
//匹配相关   作废 使用匹配机
//match(index);

/** 初始化结束 */




//启动注册服务
var regist = function(){
    let client = redisUtil.getClient();
    console.log("args[1]" + args[1]);
    client.sadd('serverList', args[1], function(err){
        client.smembers('serverList', function(err, list){
            console.log("client.smembers('serverList')\n" + JSON.stringify(list));
        });
    });
}
regist();


//探测服务
app.post("/detect", function (req, res) {
    res.end(JSON.stringify({"host":req.header("host"), "ip":req.ip, "method":req.method}));
})


//io中间件
// index.use(function(socket, next){
//     logger.debug("nameSpace.use");
//     next();
// });


//战斗社交场景socket
index.on("connection", function (socket) {
    logger.info("socket.io监听connection")

    //登陆拦截器  socket中间件
    socket.use(function(packet, next){
        logger.debug("packet:" + packet[0] + "packet.length:" + packet.length);
        if(packet[0] == 'login' || packet[0] == 'close' || packet[0] == 'disconnect'){
            return next();
        }else if(packet.length > 1){
            try{
                var id = util.decode(packet[1].token);
                logger.debug("id:" + id + " util.get(id):" + util.get(id));
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
        logger.warn("socket.error");
        socket.emit('error',{'status': msgEnum.error, 'msg':'error:' + error});
    });

    //链接断开
    socket.on('disconnect', function(data){
        logger.info('socket.disconnect');
    });


    //第一次建立链接后登陆操作
    socket.on('login', function(data){
        var userName = data.userName;
        var password = data.password;

        //查询用户服务
        userService.loginBack(userName, password, function (flag, msg, results) {
            if(flag){
                logger.debug('local socket.id ' + socket.id)
                var token = util.encode(results[0].id);
                socket.emit('loginResult',{'status':msgEnum.success,'msg':msg, 'results': token});

                //登陆token加入token池
                util.push(token, results[0].id);
            }else{
                logger.info('local socket.id ' + socket.id)
                socket.emit('loginResult',{'status':msgEnum.fail,'msg':msg});
            }
        });
    });

    //广播信息
    socket.on('broadcastMsg', function(data){
        socket.broadcast.emit('msg', {'status': msgEnum.success, 'msg':'socket.id:'+ socket.id + ' 发送了广播消息:' + data.msg});
    });

    //私聊信息
    socket.on('msg', function(data){
        logger.debug(data.id);
        socket.to(data.id).emit('msg', {'status': msgEnum.success, 'from:': socket.id + ' to:' + data.id + ' 发送了消息:' + data.msg});
    });


    //进入房间
    socket.on('join', function(data){
        console.log('join');
        if(data.type != null && data.type != ""){
            socket.join(data.room);
            // 将用户昵称加入房间名单中
            if (!roomsInfo[data.room]) {
                roomsInfo[data.room] = [];
            }
            roomsInfo[data.room].push(util.decode(data.token));

            //发送反馈消息
            //CEO的代码 socket.to(socket.id).emit('msg', {status:msgEnum.success, 'msg':'ok'});
            socket.to(socket.id).emit('msg', {status:msgEnum.success, 'msg':'ok'});
        }else{
            socket.to(socket.id).emit('msg', {status:msgEnum.fail, 'msg':'fail'});
        }
    });


    //room消息广播
    socket.on('roomMsg', function(data){
        if(data.room != null && data.room != ""){
            socket.to(data.room).emit(event, {'status':200, 'msg':data.msg});
        }else{
            socket.to(socket.id).emit('msg', {status:msgEnum.fail, 'msg':'no room'});
        }
    });


    //离开房间
    socket.on('leaveRoom', function(data){
        if(data.room != null && data.room != ""){
            socket.leaveRoom(data.room);

            // 用户离开room房间
            if (!roomsInfo[data.room]) {  //room 没了当作成功
                socket.to(socket.id).emit('msg', {status:msgEnum.success, 'msg':'ok'});
                return;
            }
            roomsInfo[data.room].pop(util.decode(data.token));
            socket.to(socket.id).emit('msg', {status:msgEnum.success, 'msg':'ok'});
        }else{
            socket.to(socket.id).emit('msg', {status:msgEnum.fail, 'msg':'fail'});
        }
    });


    //room消息广播    作废
    // socket.on('room', function(data){
    //     console.log("room内消息广播");
    //     if(data.type != null && data.type != ""){
    //         var type = data.type;
    //         var room = data.room;
    //         var leaveFlag = data.leaveFlag;
    //
    //         var event;
    //         switch (type){   //不同房间不同事件
    //             case 'roomChat': event = 'roomChat'; break;
    //             case 'roomHit': event = 'roomHit'; break;
    //             default:
    //                 break;
    //         }
    //         if(leaveFlag){
    //         }else{
    //             socket.join(room);
    //             socket.to(room).emit(event, {'status':200, 'msg':data.msg});
    //         }
    //     }else{
    //         new Error('进入room失败')
    //     }
    // });
});