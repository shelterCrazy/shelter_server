/**
 * @主要功能:  redis注册服务管理   独立服务
 * @author kenan
 * @Date 2018/10/14 23:21
 * */

//公共服务
var loggerUtil = require('./util/logFactroy');
var redisUtil = require('./util/redisUtil');
var config = require('./properties/shelterConfig');

/**util 初始化 */
var args = process.argv.splice(2)
if(args.length == 0){
    args[0] = "dev";
}
//初始化日志配置
loggerUtil.init(args[0]);
var logger = loggerUtil.getInstance();

//初始化redis
redisUtil.init(args[0]);

var delay = 10*1000;
if(arg[0] == "dev"){
    delay = config.dev.serverManagerDelay;
}else{
    delay = config.release.serverManagerDelay;
}
/** util 初始化结束 */



/** 定时任务轮询检查 redis中 serverList 记录的服务是否正常运行
 * 做服务存活验证 即心跳
 * */
var init = function(){
    var client = redisUtil.getClient();

    //delay秒执行一次  轮询检查服务是否存在
    setInterval(function(){
        client.smembers('serverList', function (err, list) {
            if(err){
                logger.error("ServerManager-redisError" + err);
                return ;
            }
            for (serverUrl in list){

                //发送请求验证
                if(false){
                    client.srem('serverList', serverUrl);  //移除这个服务
                }
            }
        });
    }, delay);
}

init();