/**
 * @主要功能: 商店信息处理模块
 * @author kenanCrazy
 * @Date 2018/3/1 14:58
 */

var user = require('../dao/userDao');

var util = require('../util/util.js');
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

        }catch (e){
            res.end(JSON.stringify({"status": '001', "msg": e.toString()}));
        }
    });

}