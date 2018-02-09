var login = require('./dao/Login');
var session = require('express-session');
var bodyparser = require('body-parser');
var app;

//引入express 对象
module.exports = function(appL){
   app = appL;
   init();
}

//初始化  只有在引入app对象后才能开启 app路由
var init = function(){

    app.use(session({
        secret: 'kenanCrazy', //secret的值建议使用随机字符串
        cookie: {maxAge: 60 * 1000 * 30} // 过期时间（毫秒）
    }));

    // parse application/x-www-form-urlencoded
    app.use(bodyparser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyparser.json());


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
                    return;
                }else{
                    res.end(JSON.stringify({"status": '001', "error": e.toString()}));
                    return;
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
                    res.write(JSON.stringify(results));
                    res.end();
                    return;
                }else{
                    res.end(JSON.stringify({"status": '001', "error": e.toString()}));
                    return;
                }
            });
        }catch (e){
            res.end(JSON.stringify({"status": '001', "error": e.toString()}));
        }
    });


    //用户名查重
    app.get('/login/nameReCheck', function(req, res){
        res.writeHead(200, {'Content-Type': 'application/json'});
        console.log("进入/login/nameReCheck");

        try{
            var userName = req.param("userName");
            login.userNameReCheck(userName, function(flag, msg){
                res.end(JSON.stringify({"status": '200', "flag": flag, "msg": msg}));
                return;
            });
        }catch(e){
            res.end(JSON.stringify({"status": '001', "error": e.toString()}));
        }
    });


    //获取验证码
    app.get('/login/captcha', function(req, res){
        res.writeHead(200, {'Content-Type': 'application/json'});

        var x = Math.ceil(Math.random()*10);
        var y = Math.ceil(Math.random()*10);

        req.session.captcha = x + y;

        res.end(JSON.stringify({"status": '200', "x": x, "y": y}));
        return;
    });



    //注册
    app.post('/login/register', function(req, res){
        var cap = req.session.captcha;
        var captcha = req.body.captcha;
        var userName = req.body.userName;
        var password = req.body.password;

        res.writeHead(200, {'Content-Type': 'application/json'});

        try{
            //检验验证码
            if(captcha != cap){
                res.end(JSON.stringify({'status': '001', 'msg': '验证码错误'}));
                return;
            }
            //注册
            login.register(userName,password, function(flag){
                res.end(JSON.stringify({'status': '200', 'msg': '添加成功'}));
                return;
            });

        }catch(e){
            res.end(JSON.stringify({'status': '002', 'msg': '添加用户错误'}));
            return;
        }
    });
}
