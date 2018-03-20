/**
 * 用户信息服务
 */
var userDao = require('../dao/userDao');
var userCardDao = require('../dao/userCardDao');
var logger = require('../util/logFactroy').getInstance();

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
                slave.release();
                fn(flag, msg, results);
                return ;
            });
        });
    } catch (e) {
        logger.info("查询错误");
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
                slave.release();
                fn(flag, msg);
            });
        });
    } catch (e) {
        logger.info("查询错误");
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
                slave.release();
                fn(flag, msg, results);
            });
        });
    } catch (e) {
        logger.info("查询错误");
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
                master.release();
                fn(flag, "ok");
            });
        });
    } catch (e) {
        logger.info("新增错误");
        fn(false, '新增异常'+e.stack);
    }

}

/**
 * @主要功能:   合成卡牌
 * @author kenan
 * @Date 2018/3/11 19:51
 * @param cardId
 * @param userId
 * @param fn
 */
exports.synthetiseCard = function(cardId, userId, fn){

    try{
        connectUtil.getMaster(function (master) {
            if(master == null){
                fn(false, '获取链接失败');
                return ;
            }

            //开启事务
            master.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }

                //获取用户晶尘数量
                userDao.getUserInfo(master, userId, function (flag, msg, rs) {
                    if(flag){
                        var ashneed = rs[0].ash_number; //晶尘

                        userCardDao.getCardInfo(master, cardId, function (flag, msg, rs) {
                            if(flag){
                                var ashRequired = rs[0].ash_required;

                                //用户晶尘>卡牌合成需求晶尘数量
                                if(Number(ashneed) >= Number(ashRequired)){

                                    //插入用户卡牌列表
                                    userCardDao.addUserCard(master, userId, cardId, function(flag, msg, rs){
                                        if(flag){
                                            //减少用户晶尘数量
                                            userDao.updateUserAsh(master, -Number(ashRequired), userId, function(flag, msg, rs){
                                                if(flag){
                                                    //没问题就提交
                                                    logger.debug("transaction commit");
                                                    master.commit(function(err){
                                                        if(err){
                                                            rollBack(master);
                                                        }
                                                        master.release();
                                                        fn(true, 'OK');
                                                    });
                                                }else{
                                                    rollBack(master);
                                                    master.release();
                                                    fn(false, '合成卡牌异常' + msg);
                                                }
                                            });
                                        }else{
                                            rollBack(master);
                                            master.release();
                                            fn(false, '合成卡牌异常' + msg);
                                        }
                                    });
                                }else{
                                    rollBack(master);
                                    master.release();
                                    fn(false, '晶尘不足');
                                }
                            }else{
                                rollBack(master);
                                master.release();
                                fn(false, '合成卡牌异常' + msg);
                            }
                        });
                    }else{
                        rollBack(master);
                        master.release();
                        fn(false, '合成卡牌异常' + msg);
                    }
                });
            });
        });
    }catch (e){
        logger.info("合成卡牌错误" + e.stack);
        fn(false, '合成卡牌异常' + e.stack);
    }
}


/**
 * @主要功能:   分解卡牌
 * @author kenan
 * @Date 2018/3/12 9:57
 * @param cardId
 * @param userId
 * @param userCardId  用户卡牌列表ID
 * @param fn
 */
exports.decomposeCard = function(cardId, userId, userCardId, fn){
    try{
        connectUtil.getMaster(function (master) {
            if(master == null){
                fn(false, '获取链接失败');
                return ;
            }
            //开启事务
            master.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }

                //查看卡牌信息   获取卡牌晶尘数
                userCardDao.getCardInfo(master, cardId, function (flag, msg, rs) {
                    if(flag) {
                        var ashRequired = rs[0].ash_required;
                        //删除用户卡牌列表中卡牌   where userid cardid usercardid 全部吻合  否则为错误信息没有这张卡牌
                        userCardDao.deleteUserCard(master, userId, cardId, userCardId, function(flag, msg, rs){
                            if(flag){
                                //删除用户卡组卡牌  允许删除行数为0  但不能有异常
                                userCardDao.deleteUserDeckCard(master, userId, cardId, userCardId, function(flag, msg, rs){
                                    if(rs != null && rs != undefined && rs.affectedRows >= 0){
                                        //增加用户晶尘
                                        userDao.updateUserAsh(master, ashRequired, userId, function(flag, msg, rs){
                                            if(flag){
                                                //没问题就提交
                                                logger.debug("transaction commit");
                                                master.commit(function(err){
                                                    if(err){
                                                        rollBack(master);
                                                    }
                                                    master.release();
                                                    fn(true, 'OK',rs);
                                                });
                                            }else{
                                                rollBack(master);
                                                master.release();
                                                fn(false, '合成卡牌异常' + msg);
                                            }
                                        });
                                    }else{
                                        rollBack(master);
                                        master.release();
                                        fn(false, "删除用户卡组卡牌异常" + msg, rs);
                                    }
                                });
                            }else{
                                rollBack(master);
                                master.release();
                                fn(false, "用户没有这张卡", rs);
                            }
                        });
                    }else{
                        rollBack(master);
                        master.release();
                        fn(false, "没有查到卡牌信息", rs);
                    }
                });
            });
        });
    }catch (e){
        logger.info("合成卡牌错误" + e.stack);
        fn(false, '合成卡牌异常' + e.stack);
    }
}



//回滚操作
var rollBack = function(conn){
    logger.info("transaction rollBack");
    conn.rollback(function(err){  //用户卡牌插入失败回滚
        if(err){
            throw err;
        }
    });
}