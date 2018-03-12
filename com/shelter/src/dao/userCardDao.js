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


/**
 * 查询用户卡牌包信息
 * @param userId
 * @param fn
 */
exports.getUserCard = function(connection, userId, fn){
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


/**
 * 查询用户卡组信息
 * @param userId
 * @param fn
 */
exports.getUserDeck = function(connection, userId, fn){
    try {
        connection.query('select d.* from user_deck d where d.user_id = ?', userId,
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


/**
 * 查询用户卡组卡牌列表
 * @param userId
 * @param deckId
 * @param fn
 */
exports.getUserDeckCard = function(connection, userId, deckId, fn){
    try {
        connection.query('select t.* from user_deck_card t where t.deck_id = ? and t.user_id = ?', [deckId, userId],
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


/**
 * 查询用户拥有的所有卡牌
 * @param cardId
 * @param fn
 */
exports.getUserCardInfo = function(connection, userId, fn){
    try {
        connection.query('select t.* from user_card t where t.user_id = ?', [userId],
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


/**
 * 查询某张卡牌信息
 * @param cardId
 * @param fn
 */
exports.getCardInfo = function(connection, cardId, fn){
    try {
        connection.query('select t.* from card_info t where t.id = ?', [cardId],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.length > 0) {
                    console.log(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    console.log("查询卡牌无结果");
                    fn(false, '查询卡牌无结果', results);
                }
            });
    } catch (e) {
        console.log("查询卡牌信息异常" + e.stack);
        fn(false, '查询卡牌信息异常'+e.stack);
    }
}


/**
 * @主要功能:   用户新增一张卡牌
 * @author kenan
 * @Date 2018/3/11 22:22
 * @param connection
 * @param userId
 * @param cardId
 * @param fn
 */
exports.addUserCard = function(connection, userId, cardId, fn){
    try {
        connection.query('insert into user_card(user_id,card_id,create_date)values(?,?,?)', [userId,cardId,new Date()],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.insertId != 0) {
                    console.log(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    console.log("用户新增卡牌失败");
                    fn(false, '用户新增卡牌失败', results);
                }
            });
    } catch (e) {
        console.log("用户新增卡牌失败" + e.stack);
        fn(false, '用户新增卡牌失败'+e.stack);
    }
}