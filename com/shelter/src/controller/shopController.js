/**
 * @主要功能: 商店信息处理模块
 * @author kenanCrazy
 * @Date 2018/3/1 14:58
 */
var userService = require('../service/UserService');
var util = require('../util/util.js');
var loggerUtil = require('../util/logFactroy');
var app;

//引入express 对象
module.exports = function(appL){
    app = appL;
    init();
}


//初始化
var init = function(){
    var logger = loggerUtil.getInstance();

    /**
     * @主要功能:   创建卡组
     * @author C14
     * @Date 2018/6/15 16:42
     * deckName
     * deckSort
     * token
     */
    app.get('/areadly/addDeck', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var deckName = req.param("deckName");
            var deckSort = req.param("deckSort");
            var token = util.getToken(req);

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //合成卡牌服务
            userService.addDeck(deckName, deckSort, userId, function(flag, msg, results){
                if(flag){
                    res.end(JSON.stringify({"status":"200", "msg":"卡组创建成功"}))
                }else{
                    res.end(JSON.stringify({"status": '003', "msg": "卡组创建失败:" + msg}));
                }
            });

        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });
    /**
     * @主要功能:   删除卡组
     * @author C14
     * @Date 2018/6/15 23:17
     * deckId
     * token
     */
    app.get('/areadly/deleteDeck', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var deckId = req.param("deckId");
            var token = util.getToken(req);

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //合成卡牌服务
            userService.deleteDeck(deckId, userId, function(flag, msg, results){
                if(flag){
                    res.end(JSON.stringify({"status":"200", "msg":"卡组删除成功"}))
                }else{
                    res.end(JSON.stringify({"status": '003', "msg": "卡组删除失败:" + msg}));
                }
            });

        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });
    /**
     * @主要功能:   删除某卡组的全部卡牌
     * @author C14
     * @Date 2018/6/15 23:17
     * deckId
     * token
     */
    app.get('/areadly/deleteAllDeckCards', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var deckId = req.param("deckId");
            var token = util.getToken(req);

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //删除卡组卡牌服务
            userService.deleteDeckCards(deckId, userId, function(flag, msg, results){
                if(flag){
                    res.end(JSON.stringify({"status":"200", "msg":"删除卡组全部卡牌成功"}))
                }else{
                    res.end(JSON.stringify({"status": '003', "msg": "删除卡组全部卡牌失败:" + msg}));
                }
            });

        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });
    /**
     * @主要功能:更新卡组名称
     * @author C14
     * @Date 2018/6/15 23:17
     * deckId
     * token
     */
    app.get('/areadly/renameDeck', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var deckId = req.param("deckId");
            var newDeckName = req.param("newDeckName");
            var token = util.getToken(req);

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //合成卡牌服务
            userService.renewDeckName(deckId, userId, newDeckName, function(flag, msg, results){
                if(flag){
                    res.end(JSON.stringify({"status":"200", "msg":"卡组重命名成功"}))
                }else{
                    res.end(JSON.stringify({"status": '003', "msg": "卡组重命名失败:" + msg}));
                }
            });

        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });

    /**
     * @主要功能:更新卡组中的全部卡牌
     * @author C14
     * @Date 2018/6/27 16:33
     * deckId
     * cardId
     * userCardId
     * token
     */
    app.get('/areadly/renewDeckCard', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var data = req.param("data");
            var jsonData = JSON.parse(data);
            var deckId = req.param("deckId");
            var token = util.getToken(req);

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //移除卡组中的全部牌
            userService.deleteDeckCards(deckId, userId, function(flag, msg, results){
                if(flag){
                    //添加卡牌服务
                    var timeflag = 0;
                    for(var i = 0; i < jsonData.data.length; i++){
                        userService.addDeckCard(userId, deckId, jsonData.data[i].cardId, jsonData.data[i].userCardId, function(flag, msg, results){
                            if(flag){
                                timeflag ++;

                                
                                if(timeflag >= jsonData.data.length){
                                    res.end(JSON.stringify({"status": '003', "msg": "更新卡组卡牌成功:" + msg}));
                                }
                            }else{
                                res.end(JSON.stringify({"status": '003', "msg": "更新卡组卡牌失败:" + msg}));
                            }
                        });
                    }
                }else{
                    res.end(JSON.stringify({"status": '003', "msg": "更新卡组卡牌失败:" + msg}));
                }
            });

        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });
    // /**
    //  * @主要功能:从卡组中移除一张卡牌
    //  * @author C14
    //  * @Date 2018/6/27 16:33
    //  * deckId
    //  * cardId
    //  * userCardId
    //  * token
    //  */
    // app.get('/areadly/removeDeckCard', function (req, res) {

    //     res.writeHead(200, {'Content-Type': 'application/json'});
    //     try{
    //         var deckId = req.param("deckId");
    //         var cardId = req.param("cardId");
    //         var userCardId = req.param("userCardId");
    //         var token = util.getToken(req);

    //         if(token == null){
    //             res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
    //         }
    //         var userId = util.decode(token);

    //         //移除卡牌服务
    //         userService.removeDeckCard(userId, deckId, cardId, userCardId, function(flag, msg, results){
    //             if(flag){
    //                 res.end(JSON.stringify({"status":"200", "msg":"从卡组中移除卡牌成功"}))
    //             }else{
    //                 res.end(JSON.stringify({"status": '003', "msg": "从卡组中移除卡牌失败:" + msg}));
    //             }
    //         });

    //     }catch (e){
    //         res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
    //     }
    // });
    /**
     * @主要功能:   使用卡包
     * @author C14
     * @Date 2018/6/24 23:24
     * deckName
     * deckSort
     * token
     */
    app.get('/areadly/useCardPackage', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var packageId = req.param("packageId");
            var packageType = req.param("packageType");
            var token = util.getToken(req);

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //卡包开启服务
            userService.useCardPackage(packageId, packageType, userId, function(flag, msg, results){
                if(flag){
                    res.end(JSON.stringify({"status":"200", "msg":"使用卡包成功: " + msg, "packageCardList":results}))
                }else{
                    res.end(JSON.stringify({"status": '003', "msg": "使用卡包失败:" + msg}));
                }
            });

        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });
    /**
     * @主要功能:   合成卡牌
     * @author kenan
     * @Date 2018/3/1 14:58
     * cardId  卡片Id
     */
    app.get('/areadly/synthetiseCard', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var cardId = req.param("cardId");
            var token = util.getToken(req);

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //合成卡牌服务
            userService.synthetiseCard(cardId, userId, function(flag, msg, results){
                if(flag){
                    res.end(JSON.stringify({"status":"200", "msg":"合成成功"}))
                }else{
                    res.end(JSON.stringify({"status": '003', "msg": "合成失败:" + msg}));
                }
            });

        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });



    /**
     * @主要功能:   分解卡牌
     * @author kenan
     * @Date 2018/3/1 14:58
     * cardId  卡片Id
     */
    app.get('/areadly/decomposeCard', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var cardId = req.param("cardId");
            var userCardId = req.param("userCardId");
            var token = util.getToken(req);

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //合成卡牌服务
            userService.decomposeCard(cardId, userId, userCardId, function(flag, msg, results){
                if(flag){
                    res.end(JSON.stringify({"status":"200", "msg":"分解成功"}))
                }else{
                    res.end(JSON.stringify({"status": '003', "msg": "分解失败:" + msg}));
                }
            });

        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });

}