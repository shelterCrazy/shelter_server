/**
 * 用户信息服务
 */
var userDao = require('../dao/userDao');
var userCardDao = require('../dao/userCardDao');
var loggerUtil = require('../util/logFactroy');
var logger = loggerUtil.getInstance();
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
 * @主要功能:添加卡组
 * @author kenan
 * @Date 2018/6/15 16:42
 * @param deckName
 * @param deckSort
 * @param userId
 * @param fn
 */
exports.addDeck = function(deckName, deckSort, userId, fn){
    try {
        connectUtil.getMaster(function(master) {
            if(master == null){
                fn(false, '获取链接失败');
                return ;
            }
            //开启事务
            master.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                userCardDao.addUserDeck(master, userId, deckName, deckSort, function(flag, msg, rs){
                    if(flag){
                        //没问题就提交
                        logger.debug("transaction commit");
                        master.commit(function(err){
                            if(err){
                                rollBack(master);
                            }
                            master.release();
                            fn(true, '创建卡组成功');
                        });
                    }else{
                        rollBack(master);
                        master.release();
                        fn(false, '创建卡组异常' + msg);
                    }
                });
            });
        });
    } catch (e) {
        logger.info("新增错误");
        fn(false, '新增异常'+e.stack);
    }
}
/**
 * @主要功能:删除卡组
 * @author C14
 * @Date 2018/6/15 23:17
 * @param deckName
 * @param userId
 * @param fn
 */
exports.deleteDeck = function(deckId, userId, fn){
    try {
        connectUtil.getMaster(function(master) {
            if(master == null){
                fn(false, '获取链接失败');
                return ;
            }
            //开启事务
            master.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                userCardDao.deleteUserDeck(master, userId, deckId, function(flag, msg, rs){
                    if(flag){
                        //没问题就提交
                        logger.debug("transaction commit");
                        master.commit(function(err){
                            if(err){
                                rollBack(master);
                            }
                            master.release();
                            fn(true, '删除卡组成功');
                        });
                    }else{
                        rollBack(master);
                        master.release();
                        fn(false, '删除卡组异常' + msg);
                    }
                });
            });
        });
    } catch (e) {
        logger.info("删除错误");
        fn(false, '删除异常'+e.stack);
    }
}
/**
 * @主要功能:删除卡组卡牌
 * @author C14
 * @Date 2018/6/27 15:54
 * @param deckName
 * @param userId
 * @param fn
 */
exports.deleteDeckCards = function(deckId, userId, fn){
    try {
        connectUtil.getMaster(function(master) {
            if(master == null){
                fn(false, '获取链接失败');
                return ;
            }
            //开启事务
            master.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                userCardDao.deleteUserDeckCards(master, userId, deckId, function(flag, msg, rs){
                    if(flag){
                        //没问题就提交
                        logger.debug("transaction commit");
                        master.commit(function(err){
                            if(err){
                                rollBack(master);
                            }
                            master.release();
                            fn(true, '删除卡组卡牌成功');
                        });
                    }else{
                        rollBack(master);
                        master.release();
                        fn(false, '删除卡组卡牌异常' + msg);
                    }
                });
            });
        });
    } catch (e) {
        logger.info("删除错误");
        fn(false, '删除异常'+e.stack);
    }
}
/**
 * @主要功能:添加卡组卡牌
 * @author C14
 * @Date 2018/6/27 16:39
 * @param userId
 * @param deckId
 * @param cardId
 * @param userCardId
 * @param fn
 */
exports.addDeckCard = function(userId, deckId, cardId, userCardId, fn){
    try {
        connectUtil.getMaster(function(master) {
            if(master == null){
                fn(false, '获取链接失败');
                return ;
            }
            //开启事务
            master.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                userCardDao.addUserDeckCard(master, userId, deckId, cardId, userCardId, function(flag, msg, rs){
                    if(flag){
                        //没问题就提交
                        logger.debug("transaction commit");
                        master.commit(function(err){
                            if(err){
                                rollBack(master);
                            }
                            master.release();
                            fn(true, '添加卡组卡牌成功');
                        });
                    }else{
                        rollBack(master);
                        master.release();
                        fn(false, '添加卡组卡牌异常' + msg);
                    }
                });
            });
        });
    } catch (e) {
        logger.info("添加错误");
        fn(false, '添加异常'+e.stack);
    }
}
/**
 * @主要功能:更新用户卡组名称
 * @author C14
 * @Date 2018/6/16 10:18
 * @param deckId
 * @param userId
 * @param newDeckName
 * @param fn
 */
exports.renewDeckName = function(deckId, userId, newDeckName, fn){
    try {
        connectUtil.getMaster(function(master) {
            if(master == null){
                fn(false, '获取链接失败');
                return ;
            }
            //开启事务
            master.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                userCardDao.renewUserDeckName(master, userId, deckId, newDeckName, function(flag, msg, rs){
                    if(flag){
                        //没问题就提交
                        logger.debug("transaction commit");
                        master.commit(function(err){
                            if(err){
                                rollBack(master);
                            }
                            master.release();
                            fn(true, ' 修改卡组名称成功');
                        });
                    }else{
                        rollBack(master);
                        master.release();
                        fn(false, ' 修改卡组名称异常' + msg);
                    }
                });
            });
        });
    } catch (e) {
        logger.info(" 修改错误");
        fn(false, ' 修改异常'+e.stack);
    }
}
/**
 * @主要功能:使用卡包
 * @author C14
 * @Date 2018/6/24 23:02
 * @param deckId
 * @param userId
 * @param newDeckName
 * @param fn
 */
exports.useCardPackage = function(packageId, packageType, userId, fn){
    try {
        connectUtil.getMaster(function(master) {
            if(master == null){
                fn(false, '获取链接失败');
                return ;
            }
            //开启事务
            master.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                //获取卡包的信息
                userCardDao.getCardPackageInfo(master, userId, packageId, function(flag, msg, rs){
                    if(flag){
                        //如果卡包的状态是可以为使用的话
                        if(rs[0].status == 0){
                        //获取卡包不同稀有度卡牌的爆率
                        userCardDao.getCardPackageProbability(master, packageType, function(flag, msg, rs){
                            if(flag){
                                logger.debug("transaction commit");
                                master.commit(function(err){
                                    if(err){
                                        rollBack(master);
                                    }
                                    master.release();
                                    //创建爆率数组
                                    var probability = [];
                                    probability[0] = 0;
                                    //将每一种稀有度的爆率储存到不同的probability中
                                    for(var j = 0; j < 4; j++){
                                        for(var i = 0; i < 4; i++){
                                            if(rs[i].rarity === j + 1){
                                                probability[j + 1] = rs[i].probability;
                                            }
                                        }
                                    }
                                    //叠加不同稀有度到probability中
                                    for(j = 2; j < 5; j++){
                                        probability[j] += probability[j - 1];
                                    }
                                    //创建card数组
                                    var card = [];
                                    for(i = 0; i < 5; i++){
                                        //产生0到1的稀有度
                                        var rand = Math.random();
                                        //如果在爆率范围内，跳出，j就为本牌的稀有度
                                        for(j = 1; j < 5; j++){
                                            if(rand < probability[j] && probability[j - 1] <= rand){
                                                break;
                                            }
                                        }
                                        //通过卡包类型获取卡池中的牌
                                        userCardDao.getCardInfoByPackage(master,  j, packageType, function(flag, msg, rs){
                                            if(flag){
                                                //随机将此稀有度的牌加入到card的后面
                                                card.push(rs[Math.floor(Math.random() * rs.length)]);
                                                //如果卡牌的长度到了5的话
                                                if(card.length == 5){
                                                    //将卡包的状态改为已经开启
                                                    userCardDao.renewCardPackageStatus(master, userId, packageId, function(flag, msg, rs){
                                                        if(flag){
                                                            //console.log( ' 开包标志添加成功' + msg);
                                                            //fn(true, ' 开包标志添加成功' + msg);
                                                        }else{
                                                            rollBack(master);
                                                            master.release();
                                                            //console.log( ' 开包标志添加异常' + msg);
                                                            fn(false, '开包标志添加异常' + msg);
                                                        }
                                                    });
                                                    //将5张card添加到用户卡牌中
                                                    for(i = 0; i < 5; i++){
                                                        //添加一张牌
                                                        userCardDao.addUserCard(master, userId, card[i].id, function(flag, msg, rs){
                                                            if(flag){
                                                                //console.log( ' 添加卡牌成功' + msg);
                                                                //fn(true, ' 添加卡牌成功' + msg);
                                                            }else{
                                                                rollBack(master);
                                                                master.release();
                                                                //console.log( ' 添加卡牌异常' + msg);
                                                                fn(false, '添加卡牌异常' + msg);
                                                            }
                                                        });
                                                    }
                                                    //返回card数组
                                                    fn(true, ' 开包流程成功', card);
                                                }
                                            }else{
                                                rollBack(master);
                                                master.release();
                                                fn(false, '开包异常' + msg);
                                            }
                                        });
                                    }
                                });
                            }else{
                                rollBack(master);
                                master.release();
                                fn(false, ' 获取爆率异常' + msg);
                            }
                        });
                        }else{
                            rollBack(master);
                            master.release();
                            fn(false, ' 卡包已经使用' + msg);
                        }
                    }else{
                    rollBack(master);
                    master.release();
                    fn(false, ' 卡包开启情况异常' + msg);
                    }
                })
            });
        });
    } catch (e) {
        logger.info(" 获取爆率错误");
        fn(false, ' 获取爆率异常'+e.stack);
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