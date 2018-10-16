/**
 * 拦截器/中间件   express中间件
 * session
 * bodyparser  解析post提交  body携带数据
 * http登陆拦截器 /areadly
 * error处理器
 * @type {session}
 */

var session = require('express-session');
var bodyparser = require('body-parser');
var util = require('../util/util.js');
var loggerUtil = require('../util/logFactroy');
var redis = require('../util/redisUtil');
var app;

module.exports = function(appL){
    app = appL;
    init();
}


var init = function(){
    var logger = loggerUtil.getInstance();

    //session中间件
    app.use(session({
        secret: 'kenanCrazy', //secret的值建议使用随机字符串
        cookie: {maxAge: 60 * 1000 * 30} // 过期时间（毫秒）
    }));

    // parse application/x-www-form-urlencoded
    app.use(bodyparser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyparser.json());




    /**匹配机用拦截器
     * 1.matcher请求只接收redis中注册的 serverList
     *
     */
    app.use("/matcher", function (req, res, next) {
        redis.getClient().smembers('serverList', function(err, list) {

            if(err){
                // res.writeHead(200, {'Content-Type': 'application/json'});
                // res.end(JSON.stringify({"status":"001", "msg":"redis获取serverList失败"}));
                res.json({"status":"001", "msg":"redis获取serverList失败"});
                return;
            }
            if (list.length <= 1 || list == null || list == undefined) {
                // res.writeHead(200, {'Content-Type': 'application/json'});
                // res.end(JSON.stringify({"status":"002", "msg":"serverList 没有注册服务"}));
                res.json({"status":"002", "msg":"serverList 没有注册服务"});
                return ;
            }else{

                //获取请求头和注册的list中的服务器地址做对比  非服务不得请求
                var host = req.header("host");
                for (var model in list){
                    //比较
                }
            }
            next();
        });
    });


    //错误处理中间件
    app.use(function(err, req, res, next) {
        logger.error(err.stack);
        res.status(500).send(JSON.stringify({"status":"001", "msg":"发生错误:" + err.stack}));
    });
}