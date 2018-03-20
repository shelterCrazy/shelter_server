/**
 * @主要功能: 商店信息处理模块
 * @author kenanCrazy
 * @Date 2018/3/1 14:58
 */
var userService = require('../service/UserService');
var util = require('../util/util.js');
var logger = require('../util/logFactroy').getInstance();

var app;

//引入express 对象
module.exports = function(appL){
    app = appL;
    init();
}


//初始化
var init = function(){


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