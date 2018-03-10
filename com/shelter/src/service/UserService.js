/**
 * 用户信息服务
 */
var userDao = require('../dao/userDao');
var connectUtil = require('../util/ConnectUtil');
var util = require('../util/util');


//登陆查询  回掉函数方式
exports.loginBack = function(userName, password, fn){
    try {
        connectUtil.getSlave(function(slave){
            if(slave == null){
                fn(false, '获取链接失败');
                return ;
            }
            userDao.loginBack(slave, userName, password, function(flag, msg, results){
                if(slave != null && slave != undefined){
                    slave.release();
                }
                fn(flag, msg, results);
                return ;
            });
        });
    } catch (e) {
        console.log("查询错误");
        fn(false, '查询异常'+e.stack);
    }
}


//检查用户名是否重复
exports.userNameReCheck = function(userName, fn){
    try {
        connectUtil.getSlave(function(slave) {
            if(slave == null){
                fn(false, '获取链接失败');
                return ;
            }
            userDao.userNameReCheck(slave, userName, function (flag, msg) {
                if (slave != null && slave != undefined) {
                    slave.release();
                }
                fn(flag, msg);
            });
        });
    } catch (e) {
        console.log("查询错误");
        fn(false, '查询异常'+e.stack);
    }
}


//获取所有用户信息  回掉函数方式
exports.userBack = function(fn){
    try {
        connectUtil.getSlave(function(slave) {
            if(slave == null){
                fn(false, '获取链接失败');
                return ;
            }
            userDao.userBack(slave, function (flag, msg, results) {
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


//注册用户
exports.register = function(userName, password, fn){
    try {
        connectUtil.getMaster(function(master) {
            if(master == null){
                fn(false, '获取链接失败');
                return ;
            }
            userDao.register(master, function (flag) {
                if(master != null && master != undefined){
                    master.release();
                }
                fn(flag, "ok");
            });
        });
    } catch (e) {
        console.log("新增错误");
        fn(false, '新增异常'+e.stack);
    }

}

/**
 * 
 * @param cardId
 * @param userId
 * @param fn
 */
exports.synthetiseCard = function(cardId, userId, fn){
    //获取用户晶尘数量

    //插入用户卡牌列表

    //减少用户晶尘数量
}