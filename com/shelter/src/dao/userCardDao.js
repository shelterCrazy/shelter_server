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
                
                //这里就是改为允许读取一个空的卡组
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
 * 删除用户卡牌列表 卡牌
 * @param cardId
 * @param fn
 */
exports.deleteUserCard = function(connection, userId, cardId, userCardId, fn){
    try {
        connection.query('delete from user_card where id=? and user_id=? and card_id=?', [userCardId,userId,cardId],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.affectedRows != 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("删除数据行数0 userId" + userId + " cardId" + cardId + " userCardId" + userCardId);
                    fn(false, '删除数据行数0', results);
                }
            });
    } catch (e) {
        logger.info("删除数据错误" + e.stack);
        fn(false, '删除数据异常'+e.stack);
    }
}

/**
 * 删除用户 全部卡组中全部的 某 卡牌 
 * @param cardId
 * @param fn
 */
exports.deleteUserDeckCard = function(connection, userId, cardId, userCardId, fn){
    try {
        connection.query('delete from user_deck_card where user_id=? and card_id=? and user_card_id=?', [userId,cardId,userCardId],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.affectedRows >= 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("删除数据行数0 userId" + userId + " cardId" + cardId + " userCardId" + userCardId);
                    fn(false, '删除数据行数0', results);
                }
            });
    } catch (e) {
        logger.info("删除数据错误" + e.stack);
        fn(false, '删除数据异常'+e.stack);
    }
}
/**
 * 删除用户 某卡组 全部卡牌
 * @param deckId
 * @param fn
 */
exports.deleteUserDeckCards = function(connection, userId, deckId, fn){
    try {
        connection.query('delete from user_deck_card where user_id=? and deck_id=?', [userId,deckId],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.affectedRows >= 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("删除数据行数0 userId" + userId + " deckId" + deckId);
                    fn(false, '删除数据行数0', results);
                }
            });
    } catch (e) {
        logger.info("删除数据错误" + e.stack);
        fn(false, '删除数据异常'+e.stack);
    }
}
/**
 * 添加用户卡组
 * @param cardId
 * @param fn
 */
exports.addUserDeck = function(connection, userId, deck_name, deck_sort, deck_type, fn){
    try {
        connection.query('insert into user_deck(user_id,deck_name,deck_sort,deck_type)values(?,?,?,?)', [userId,deck_name,deck_sort, deck_type],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.insertId != 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("用户新增卡组失败");
                    fn(false, '用户新增卡组失败', results);
                }
            });
    } catch (e) {
        logger.info("用户新增卡组失败" + e.stack);
        fn(false, '用户新增卡组失败'+e.stack);
    }
}

/**
 * 删除用户卡组
 * @param connection
 * @param userId
 * @param deckId
 * @param fn
 */
exports.deleteUserDeck = function(connection, userId, deckId, fn){
    try {
        connection.query('DELETE FROM user_deck where user_id=? and id=?', [userId,deckId],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.affectedRows != 0) {
                    logger.debug(JSON.stringify(results));
                    fn(true, '用户删除卡组成功', results);
                } else {
                    logger.debug("用户删除卡组失败");
                    fn(false, '用户删除卡组失败', results);
                }
            });
    } catch (e) {
        logger.info("用户删除卡组失败" + e.stack);
        fn(false, '用户删除卡组失败'+e.stack);
    }
}
/**
 * 更新用户卡组名称
 * @param userId
 * @param deckId
 * @param newDeckName
 * @param fn
 */
exports.renewUserDeckName = function(connection, userId, deckId, newDeckName, fn){
    try {
        connection.query('UPDATE user_deck SET deck_name = ? WHERE user_id = ? and id = ?', [newDeckName,userId,deckId],
            function (error, results, fields) {
                if (error) throw error;

                //if (results != null && results.insertId != 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'OK，用户卡组名称修改成功', results);
                // } else {
                //     logger.debug("用户卡组名称修改失败");
                //     fn(false, '用户卡组名称修改失败', results);
                // }
            });
    } catch (e) {
        logger.info("用户卡组名称修改失败" + e.stack);
        fn(false, '用户卡组名称修改失败'+e.stack);
    }
}
/**
 * 更新用户卡包状态为开启完成
 * @param cardId
 * @param fn
 */
exports.renewCardPackageStatus = function(connection, userId, userCardPackageId, fn){
    try {
        connection.query('UPDATE user_card_package SET status = ?, use_date = ? WHERE id = ?', [1,new Date(),userCardPackageId],
            function (error, results, fields) {
                if (error) throw error;

                // if (results != null && results.affectedRows != 0) {
                    logger.debug(JSON.stringify(results));
                    fn(true, 'Ok', results);
                // } else {
                //     logger.debug("bi数据行数0 userId" + userId + " cardId" + cardId + " userCardId" + userCardId);
                //     fn(false, '删除数据行数0', results);
                // }
            });
    } catch (e) {
        logger.info("卡包状态变更错误" + e.stack);
        fn(false, '卡包状态变更异常'+e.stack);
    }
}

/**
 * 查询单个卡包信息
 * @param userId
 * @param userCardPackageId
 * @param fn
 */
exports.getCardPackageInfo = function(connection, userId, userCardPackageId, fn){
    try {
        connection.query('select t.* from user_card_package t where t.id = ?', [userCardPackageId],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.length > 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("查询卡包使用无结果");
                    fn(false, '查询卡包使用无结果', results);
                }
            });
    } catch (e) {
        logger.info("查询卡包使用错误" + e.stack);
        fn(false, '查询卡包使用异常'+e.stack);
    }
}
/**
 * 查询卡包爆率信息
 * @param packageType
 * @param fn
 */
exports.getCardPackageProbability = function(connection, packageType, fn){
    try {
        connection.query('select t.* from card_package_probability t where t.package_type = ?', [packageType],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.length > 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("查询卡包类型爆率无结果");
                    fn(false, '查询卡包类型爆率无结果', results);
                }
            });
    } catch (e) {
        logger.info("查询卡包类型爆率信息异常" + e.stack);
        fn(false, '查询卡包类型爆率信息异常'+e.stack);
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
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("查询卡牌无结果");
                    fn(false, '查询卡牌无结果', results);
                }
            });
    } catch (e) {
        logger.info("查询卡牌信息异常" + e.stack);
        fn(false, '查询卡牌信息异常'+e.stack);
    }
}
/**
 * 查询某张卡牌信息
 * @param cardId
 * @param cardRarity
 * @param cardPackage
 * @param fn
 */
exports.getCardInfoByPackage = function(connection, cardRarity, cardPackage, fn){
    try {
        connection.query('select t.* from card_info t where t.rarity = ? and t.card_package_type = ?', [cardRarity, cardPackage],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.length > 0) {
                    logger.debug(JSON.stringify(results));
                    fn(true, 'Ok', results);
                    //return {'flag':true, 'msg':'OK', 'rs':results};
                } else {
                    logger.debug("查询卡牌无结果");
                    fn(false, '查询卡牌无结果', results);
                }
            });
    } catch (e) {
        logger.info("查询卡牌信息异常" + e.stack);
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
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("用户新增卡牌失败");
                    fn(false, '用户新增卡牌失败', results);
                }
            });
    } catch (e) {
        logger.info("用户新增卡牌失败" + e.stack);
        fn(false, '用户新增卡牌失败'+e.stack);
    }
}

/**
 * @主要功能:用户卡组新增一张卡牌
 * @author C14
 * @Date 2018/6/27 16:44
 * @param connection
 * @param userId
 * @param deckId
 * @param cardId
 * @param userCardId
 * @param fn
 */
exports.addUserDeckCard = function(connection, userId, deckId, cardId, userCardId, fn){
    try {
        connection.query('insert into user_deck_card(user_id,deck_id,card_id,user_card_id)values(?,?,?,?)', [userId, deckId, cardId, userCardId],
            function (error, results, fields) {
                if (error) throw error;

                if (results != null && results.insertId != 0) {
                    logger.debug(JSON.stringify(results))
                    fn(true, 'Ok', results);
                } else {
                    logger.debug("用户卡组新增卡牌失败");
                    fn(false, '用户卡组新增卡牌失败', results);
                }
            });
    } catch (e) {
        logger.info("用户卡组新增卡牌失败" + e.stack);
        fn(false, '用户卡组新增卡牌失败'+e.stack);
    }
}
