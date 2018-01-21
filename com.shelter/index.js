var login = require('./dao/Login');
var app;

//引入express 对象
module.exports = function(appL){
   app = appL;
   init();
}

//初始化  只有在引入app对象后才能开启 app路由
var init = function(){

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
                    res.end(JSON.stringify({"status": '001', "error": e.toString()}));
                }
            });
        }catch (e){
            res.end(JSON.stringify({"status": '001', "error": e.toString()}));
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
                    res.end(JSON.stringify({"status": '001', "error": e.toString()}));
                }
            });
        }catch (e){
            res.end(JSON.stringify({"status": '001', "error": e.toString()}));
        }
    });
}
