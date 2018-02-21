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
exports.getUserCard = function(userId, fn){
    try {
        connection.query('select p.* from user_card_package p where p.user_id = ?', userId,
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.length > 0) {
                    console.log(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    console.log("查询无结果");
                    fn(false, '查询异常', results);
                }
            });
    } catch (e) {
        console.log("查询错误");
        fn(false, '查询异常'+e.stack);
    }
}
