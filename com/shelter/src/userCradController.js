var userCard = require('./dao/userCardDao');
var util = require('./util.js');
var app;

//引入express 对象
module.exports = function(appL){
    app = appL;
    init();
}


//初始化  只有在引入app对象后才能开启 app路由
var init = function(){


    //获取用户卡牌包信息
    app.get('/areadly/userCrad', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var token = req.param("token");
            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //方法二  回掉函数方式同步
            userCard.getUserCard(userId, function(flag, msg, results){
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


    /**获取用户卡组信息
     * param: token
     */
    app.get('/areadly/getUserDeck', function (req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        try{
            var token = req.param("token");

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //查询用户卡组信息
            userCard.getUserDeck(userId, function(flag, msg, results){
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
            var token = req.param("token");
            var deckId = req.param("deckId");

            if(token == null || deckId == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败 或者 deckId为空"}));
            }
            var userId = util.decode(token);

            //获取用户卡组卡牌
            userCard.getUserDeckCard(userId, deckId, function(flag, msg, results){
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
            var token = req.param("token");

            if(token == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败"}));
            }
            var userId = util.decode(token);

            //获取用户卡组卡牌
            userCard.getUserCardInfo(userId, function(flag, msg, results){
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
            var token = req.param("token");
            var cardId = req.param("cardId");

            if(token == null || cardId == null){
                res.end(JSON.stringify({"status": '002', "msg": "token获取失败 或者 cardId为空"}));
            }
            var userId = util.decode(token);

            //获取用户卡组卡牌
            userCard.getCardInfo(cardId, function(flag, msg, results){
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