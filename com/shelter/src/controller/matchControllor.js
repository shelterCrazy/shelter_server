/**
 * kenan 游戏匹配模块控制器
 */

var util = require('../util/util');
var loggerUtil = require('../util/logFactroy');
var redis = require("../util/redisUtil");
var index;

//引入express 对象
module.exports = function(indexL){
    index = indexL;
   init();
}

//初始化  只有在引入app对象后才能开启 app路由
var init = function(){
    var logger = loggerUtil.getInstance();


    //战斗社交场景socket
    index.on("connection", function (socket) {
        logger.info("matchControllor socket.io监听connection")


        /**这里有个很严重的问题
         * 重连后socketid 会变   如果匹配期间重连了客户端一定要重新发送申请*/


        socket.on('match', function(data){
            logger.debug('matchControllor match');

            try {
                redis.getClient().sadd('match', util.decode(data.token)+":"+socket.id);
                socket.to(socket.id).emit('msg', {status: '200', msg: '添加匹配成功'});
            }catch(err){
                socket.to(socket.id).emit('msg', {status: '001', msg: '添加匹配失败 error:' + err});
            }

            //返回匹配结果  只有每次新加入人才有可能匹配成功  所以在申请匹配环节处理匹配
            redis.getClient().smembers('match', function(err, list){

                while(true){
                    if(list.length <= 1 || list == null || list == undefined){
                        break;
                    }

                    logger.debug("Number((Math.random()*list.length-1).toFixed(0)" + Number((Math.random()*list.length-1).toFixed(0)));
                    var other = list[Number((Math.random()*list.length-1).toFixed(0))];
                    logger.debug("listNum" + list.length + " other:" + other);
                    var socketId = other.split(":")[1];
                    if(socketId != socket.id){
                        redis.getClient().srem('match', other, util.decode(data.token)+":"+socket.id);  //移除这两个匹配节点

                        var room = "room" + socketId.substring(socketId.length-5, socketId.length-1) + socket.id.substring(socket.id.length-5, socket.id.length-1);
                        socket.to(socketId).emit('matchMsg', {status: '200', 'msg': '匹配成功获取room', room: room});
                        socket.emit('matchMsg', {status: '200', 'msg': '匹配成功获取room', room: room});
                        return;
                    }
                }
            });
        });

    });


}



