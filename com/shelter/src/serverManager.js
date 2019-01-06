/**
 * @主要功能:  redis注册服务管理   独立服务
 * @author kenan
 * @Date 2018/10/14 23:21
 * */

//公共服务
var loggerUtil = require('./util/logFactroy');
var redisUtil = require('./util/redisUtil');
var config = require('./properties/shelterConfig');
var http = require('http');
var queryString = require('querystring');


/** 初始化 */
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
var port;
if(args[0] == "dev"){
    delay = config.dev.serverManagerDelay;
    port = config.dev.applicationPort;
}else{
    delay = config.release.serverManagerDelay;
    port = config.release.applicationPort;
}
/** 初始化结束 */






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
            console.log("serverList：" + JSON.stringify(list));

            for (i in list){
                var serverUrl = list[i];
                console.log(`serverUrl:${serverUrl}`);

                //请求响应处理
                createOptions.host = serverUrl;
                var req = http.request(createOptions, function(resp){
                    response(resp);
                });



                //error服务失效处理
                req.on('error', (e) => {
                    /**
                     * 如果连接出错，则以下事件会被依次触发：
                     * 'socket' 事件。
                     * 'error' 事件。
                     * 'close' 事件。
                     */
                    console.error(`探测遇到问题: ${e.message}`);
                    logger.warn(`探测遇到问题: ${e.message}`)
                    //服务失效移除服务
                    client.srem('serverList', serverUrl);  //移除这个服务
                });


                // 写入数据到请求主体
                req.write(postData);
                // 发送请求
                req.end();
            }
        });
    }, delay);
}

init();






/**
 *  构建探测数据
 */
const postData = queryString.stringify({
    'msg' : 'Hello World!'
});


var createOptions = {
    host: '',
    port: port,
    path: '/detect',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive'
    }
}


//请求响应处理
var response = function(resp){

    /** 如果请求成功，http.ClientRequest对象的以下事件会被依次触发
     * 'socket' 事件。
     * 'response' 事件。
     *      'data' 多次触发 res 对象的 'data' 事件（如果响应主体为空，则不会触发 'data' 事件，比如重定向）。
     *      'end'  res 对象的 'end' 事件。
     * 'close' 事件。
     */
    //response 处理
    resp.on('data', (chunk)=>{
        //响应报文体
        console.log(`response${chunk}`);
    });

    //响应结束
    resp.on('end', () => {
        console.log('响应结束');
        //说明响应成功了
    });
}