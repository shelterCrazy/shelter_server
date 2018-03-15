/**
 * @主要功能:   日志工厂
 * @author kenan
 * @Date 2018/3/13 15:48
 */
var log4j = require("log4js");
var logConf = require("../properties/logConfig");
var config;

exports.getInstance = function(config){
    log4j.configure(logConf);
    return log4j.getLogger(config);
}


//test
var test = function(){
    log4j.configure(logConf);
    var logger = log4j.getLogger("dev");

    logger.trace('Entering cheese testing');
    logger.debug('Got cheese.');
    logger.info('Cheese is Gouda.');
    logger.warn('Cheese is quite smelly.');
    logger.error('Cheese is too ripe!');
    logger.fatal('Cheese was breeding ground for listeria.');
}

test();