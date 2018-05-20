/**
 * @主要功能:  redis池
 * @author kenan
 * @Date 2018/5/20 1:04
 */

var redisConfig = require("../properties/redisConfig");
var redis = require("redis");
var client;

module.exports = {
    init: function (args) {
        if(args == "release"){
            client = redis.createClient(redisConfig.release);
        }else {
            client = redis.createClient(redisConfig.dev);
        }
    },
    getClient: function(){
        return client;
    }
}
