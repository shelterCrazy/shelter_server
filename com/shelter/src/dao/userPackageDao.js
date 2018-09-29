/**
 * 用户卡包信息查询
 */

// var mysql = require('mysql');
// var fs = require('fs');
// var json = JSON.parse(fs.readFileSync(__dirname + "/../properties/mysql.json"));
//
// var connection = mysql.createConnection({
//     host     : json.host,
//     user     : json.user,
//     password : json.password,
//     database : json.database
// });
// connection.connect();
var loggerUtil = require('../util/logFactroy');
var logger = loggerUtil.getInstance();

/**
 * 查询卡牌包信息
 * @param packageType
 * @param fn
 */
exports.getPackageInfo = function(connection, packageType, fn){
    try {
        connection.query('select p.* from card_package_type p where p.package_type = ?', packageType,
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.length > 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("查询无结果");
                    fn(false, '查询异常', results);
                }
            });
    } catch (e) {
        logger.info("查询错误" + e.stack);
        fn(false, '查询异常'+e.stack);
    }
}
/**
 * 查询卡牌包信息
 * @param packageType
 * @param fn
 */
exports.addUserPackage = function(connection, userId, packageName, packageType, fn){
    try {
        connection.query('insert into user_card_package(user_id,package_name,package_type,create_date,status)values(?,?,?,?,?)', [userId,packageName,packageType,new Date(),0],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.insertId != 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("用户新增卡包失败");
                    fn(false, '用户新增卡包失败', results);
                }
            });
    } catch (e) {
        logger.info("用户新增卡包失败" + e.stack);
        fn(false, '用户新增卡包失败'+e.stack);
    }
}
/**
 * 查询卡牌包信息
 * @param packageType
 * @param fn
 */
exports.addUserPackages = function(connection, userId, packageName, packageType, packageNum, fn){
    try {
        var values = [];
        for(var i = 0;i < packageNum; i++){
            values[i] = [userId,packageName,packageType,new Date(),0];
        }
        connection.query('insert into user_card_package(user_id,package_name,package_type,create_date,status) VALUES ?', [values],
            function (error, results, fields) {
                console.log(error);
                if (error) throw error;
                if (results != null && results.insertId != 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("用户新增卡包失败");
                    fn(false, '用户新增卡包失败', results);
                }
            });
    } catch (e) {
        logger.info("用户新增卡包失败" + e.stack);
        fn(false, '用户新增卡包失败'+e.stack);
    }
}

