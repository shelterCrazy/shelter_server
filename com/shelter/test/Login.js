var http = require('http');
var app = require('express')();
var login = require('../src/dao/userDao');

//http连接
// http.createServer(function (request, response) {
//
//     // 发送 HTTP 头部
//     // HTTP 状态值: 200 : OK
//     // 内容类型: text/plain
//     response.writeHead(200, {'Content-Type': 'application/json'});
//
//     // 发送响应数据 "Hello World"
//     response.end('Hello World\n' + query.toString());
// }).listen(3000);
//
// // 终端打印如下信息
// console.log('Server running at http://127.0.0.1:3000/');


//express web方式自动路由方式
app.get('/queryAllUser', function (req, res) {

    res.writeHead(200, {'Content-Type': 'application/json'});
    try{
        connection.query('select * from user', function (error, results, fields) {
            if (error) throw error;

            var map = {};
            map.result = results;
            map.status = 200;
            if(results != null && results.length > 0){
                map.result = results;
                map.status = '200';
            }else{
                map.status = '002';
                map.msg = "登陆失败，用户名或密码错误";
            }
            res.write(JSON.stringify(map));
            res.end();
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



var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
