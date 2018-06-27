/**
 * 1.获取卡牌信息
 * 2.获取用户卡组/卡组卡牌/卡牌信息
 */
var deckService = require('../service/DeckService');
var util = require('../util/util.js');
var loggerUtil = require('../util/logFactroy');
var app;

//引入express 对象
module.exports = function(appL){
    app = appL;
    init();
}


//初始化  只有在引入app对象后才能开启 app路由
var init = function(){
    var logger = loggerUtil.getInstance();


    //获取用户卡牌包信息
    app.get('/areadly/userCard', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var token = util.getToken(req);
            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //方法二  回掉函数方式同步
            deckService.getUserCard(userId, function(flag, msg, results){
                if(flag){
                    res.write(JSON.stringify({"status": '200', "userCardList":results}));
                    res.end();
                    return;
                }else{
                    res.end(JSON.stringify({"status": '001', "msg": "没有数据" + msg}));
                    return;
                }
            });
        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });


    /**获取用户卡组信息
     * param: token
     */
    app.get('/areadly/getUserDeck', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var token = util.getToken(req);

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //查询用户卡组信息
            deckService.getUserDeck(userId, function(flag, msg, results){
                if(flag){
                    res.write(JSON.stringify({"status": '200', "userDeckList":results}));
                    res.end();
                    return;
                }else{
                    res.end(JSON.stringify({"status": '001', "msg": "没有数据"}));
                    return;
                }
            });
        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });


    /**
     * 获取用户卡组卡牌信息
     */
    app.get('/areadly/getUserDeckCard', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var token = util.getToken(req);
            var deckId = req.param("deckId");

            if(token == null || deckId == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败 或者 deckId为空"}));
            }
            var userId = util.decode(token);

            //获取用户卡组卡牌
            deckService.getUserDeckCard(userId, deckId, function(flag, msg, results){
                if(flag){
                    res.write(JSON.stringify({"status": '200', "userDeckCardList":results}));
                    res.end();
                    return;
                }else{
                    res.end(JSON.stringify({"status": '001', "msg": "没有数据"}));
                    return;
                }
            });
        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });



    /**
     * 获取用户所有卡牌列表
     */
    app.get('/areadly/getUserCardInfo', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var token = util.getToken(req);

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //获取用户卡组卡牌
            deckService.getUserCardInfo(userId, function(flag, msg, results){
                if(flag){
                    res.write(JSON.stringify({"status": '200', "userCardList":results}));
                    res.end();
                    return;
                }else{
                    res.end(JSON.stringify({"status": '001', "msg": "没有数据"}));
                    return;
                }
            });
        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });




    /**
     * 获取卡牌信息
     */
    app.get('/areadly/getCardInfo', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var token = util.getToken(req);
            var cardId = req.param("cardId");

            if(token == null || cardId == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败 或者 cardId为空"}));
            }
            var userId = util.decode(token);

            //获取用户卡组卡牌
            deckService.getCardInfo(cardId, function(flag, msg, results){
                if(flag){
                    res.write(JSON.stringify({"status": '200', "cardInfo":results}));
                    res.end();
                    return;
                }else{
                    res.end(JSON.stringify({"status": '001', "msg": "没有数据"}));
                    return;
                }
            });
        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });
}