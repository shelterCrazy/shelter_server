/**
 * 用户卡组相关服务
 */
var userCardDao = require('../dao/userCardDao');
var connectUtil = require('../util/ConnectUtil');
var util = require('../util/util');



/**
 * 查询用户卡牌包信息
 * @param userId
 * @param fn
 */
exports.getUserCard = function(userId, fn){
    try {
        connectUtil.getSlave(function(slave){
            if(slave == null){
                fn(false, '获取链接失败');
                return ;
            }
            userCardDao.getUserCard(slave, userId, function(flag, msg, results){
                if(slave != null && slave != undefined){
                    slave.release();
                }
                fn(flag, msg, results);
            });
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
exports.getUserDeck = function(userId, fn){
    try {
        connectUtil.getSlave(function(slave){
            if(slave == null){
                fn(false, '获取链接失败');
                return ;
            }
            userCardDao.getUserDeck(slave, userId, function(flag, msg, results){
                if(slave != null && slave != undefined){
                    slave.release();
                }
                fn(flag, msg, results);
            });
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
exports.getUserDeckCard = function(userId, deckId, fn){
    try {
        connectUtil.getSlave(function(slave){
            if(slave == null){
                fn(false, '获取链接失败');
                return ;
            }
            userCardDao.getUserDeckCard(slave, userId, deckId, function(flag, msg, results){
                if(slave != null && slave != undefined){
                    slave.release();
                }
                fn(flag, msg, results);
            });
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
exports.getUserCardInfo = function(userId, fn){
    try {
        connectUtil.getSlave(function(slave){
            if(slave == null){
                fn(false, '获取链接失败');
                return ;
            }
            userCardDao.getUserCardInfo(slave, userId, function(flag, msg, results){
                if(slave != null && slave != undefined){
                    slave.release();
                }
                fn(flag, msg, results);
            });
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
exports.getCardInfo = function(cardId, fn){
    try {
        connectUtil.getSlave(function(slave){
            if(slave == null){
                fn(false, '获取链接失败');
                return ;
            }
            userCardDao.getCardInfo(slave, cardId, function(flag, msg, results){
                if(slave != null && slave != undefined){
                    slave.release();
                }
                fn(flag, msg, results);
            });
        });
    } catch (e) {
        console.log("查询错误");
        fn(false, '查询异常'+e.stack);
    }
}