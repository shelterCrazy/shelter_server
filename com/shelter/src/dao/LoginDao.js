var mysql = require('mysql');
var json = require('../properties/mysql.json');
var fs = require('fs');
var json = JSON.parse(fs.readFileSync(__dirname + "/../properties/mysql.json"));

var connection = mysql.createConnection({
    host     : json.host,
    user     : json.user,
    password : json.password,
    database : json.database
});
connection.connect();


//登陆查询  回掉函数方式
exports.loginBack = function(userName, password, fn){
    try {
        connection.query('select * from user where user_name="' + userName + '" and password="' + password + '"',
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.length > 0) {
                    console.log(JSON.stringify(results))
                    fn(true, '登陆成功', results);
                } else {
                    console.log("查询无结果");
                    fn(false, '登陆失败，请检查用户名密码', results);
                }
            });
    } catch (e) {
        console.log("查询错误");
        fn(false, '查询异常'+e.stack);
    }
}


//检查用户名是否重复
exports.userNameReCheck = function(userName, fn){
    try {
        connection.query('select id from user where user_name="' + userName + '"',
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.length > 0) {
                    console.log(JSON.stringify(results))
                    fn(false, '用户名存在');
                } else {
                    console.log("查询无结果");
                    fn(true, '用户名不存在,可以使用');
                }
            });
    } catch (e) {
        console.log("查询错误");
        fn(false, '查询异常'+e.stack);
    }
}


//获取所有用户信息  回掉函数方式
exports.userBack = function(fn){
    try {
        connection.query('select * from user',
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.length > 0) {
                    console.log(JSON.stringify(results))
                    fn(true, results);
                }
            });
    } catch (e) {
        console.log("查询错误");
        fn(false, '查询异常'+e.stack);
    }
}


//注册用户
exports.register = function(userName, password, fn){
    try {
        connection.query('insert into user(user_name,password)values(?,?)', [userName, password],
            function (error, results) {
                if (error) throw error;

                if (results != null && results.insertId != 0) {
                    console.log(JSON.stringify(results))
                    fn(true);
                }else{
                    fn(false);
                }
            });
    } catch (e) {
        console.log("查询错误");
        fn(false, '查询异常'+e.stack);
    }
}