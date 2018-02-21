var userCard = require('./dao/userCardDao');
var util = require('./util.js');
var app;

//引入express 对象
module.exports = function(appL){
    app = appL;
    init();
}


//初始化  只有在引入app对象后才能开启 app路由
var init = function(){


    //登陆
    app.get('/areadly/userCrad', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var token = req.param("token");
            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //方法二  回掉函数方式同步
            userCard.getUserCard(userId, function(flag, msg, results){
                if(flag){
                    res.write(JSON.stringify({"status": '200', "userCardList":results}));
                    res.end();
                    return;
                }else{
                    res.end(JSON.stringify({"status": '001', "msg": "没有数据"}));
                    return;
                }
            });
        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });

}