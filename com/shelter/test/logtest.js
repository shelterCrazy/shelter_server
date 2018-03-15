/**
 * @主要功能:   日志工厂
 * @author kenan
 * @Date 2018/3/13 15:48
 */
var log4j = require("log4js");
var logConf = require("../src/properties/logConfig");

//process是一个全局对象，argv返回的是一组包含命令行参数的数组。
//第一项为”node”，第二项为执行的js的完整路径，后面是附加在命令行后的参数
var args = process.argv.splice(2)
console.log(args);


exports.getInstance = function(config){
    log4j.configure(logConf);
    return log4j.getLogger(config);
}


var init = function(){
    log4j.configure(logConf);
    var logger = log4j.getLogger(args[0]);

    logger.trace('Entering cheese testing');
    logger.debug('Got cheese.');
    logger.info('Cheese is Gouda.');
    logger.warn('Cheese is quite smelly.');
    logger.error('Cheese is too ripe!');
    logger.fatal('Cheese was breeding ground for listeria.');
}

init();