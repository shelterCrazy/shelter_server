/**
 * @主要功能:  匹配机   独立服务
 * @author kenan
 * @Date 2018/10/14 23:21
 * */

//基本js
var http = require('http');
var express = require('express');
var app = express();


//公共服务
var util = require('./util/util');
var connectUtil = require('./util/ConnectUtil');
var loggerUtil = require('./util/logFactroy');
var redisUtil = require('./util/redisUtil');
var config = require('./properties/shelterConfig');


//功能模块
var interceptor = require('./Interceptor/MatcherInterceptor');   //拦截器中间件


/**util 初始化 */
//process是一个全局对象，argv返回的是一组包含命令行参数的数组。
//第一项为”node”，第二项为执行的js的完整路径，后面是附加在命令行后的参数
var args = process.argv.splice(2)
if(args.length == 0){
    args[0] = "dev";
}
//初始化数据库链接
connectUtil.init(args[0]);
//初始化日志配置
loggerUtil.init(args[0]);
var logger = loggerUtil.getInstance();
//初始化redis
redisUtil.init(args[0]);

var port = 3000;
if(args[0] == "dev"){
    port = config.dev.matcherPort;
}else{
    port = config.release.matcherPort;
}
/** util 初始化结束 */




/**  初始化 */
/*express初始化*/
var server = http.Server(app);
server.listen(port);    //必须是 http设置端口   app.listen(port) 并不会将端口给server

//静态资源
app.use(express.static('public'));

//消息状态枚举
var msgEnum= {
    success:200,   //普通消息
    fail:1,     //操作失败消息反馈
    error:2,    //错误消息
}


//拦截器   /matcher拦截规则
interceptor(app);
/** 初始化结束 */



//接口 接收匹配请求
app.post("/matcher/appealMatch", function (req, res) {
    // res.end(JSON.stringify({"host":req.header("host"), "ip":req.ip, "method":req.method}));
    res.json(req.body);
})


/**资源*/
var status = {
    start:1,
    busy:2,
    stop:3
};
var matchPool;



//激活事件
var openEvent = function(){

    //读取redis 匹配请求总量刷新size方便做hash
}


/**
 * 核心方法
 * 哈希/轮询处理  事件触发停止  堆栈计数器  服务转接
 */
var core = function(){

    //

    //redis读取服务列表  在随机取服务器
}

//请求出栈
var pop = function(){

}

//请求入栈
var push = function(){

}


