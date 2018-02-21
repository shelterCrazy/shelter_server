
//token 池
var tokenPool = [];


module.exports = {

    push(token, id){
        console.log("util.push  token:" + token + "id:" + id);
        if(tokenPool[id] == undefined){
            tokenPool[id] = token;
        }
    },

    get(id){
        console.log("util.get id:" + id);
        if(tokenPool[id] == undefined){
            return null;
        }else{
            return tokenPool[id];
        }
    },

    //加密
    encode : function(str){
        var r = (Math.random()*10).toFixed(0);
        return String(r) + (((parseInt(str) + parseInt(r)) << 1) * 2)
    },

    //解密
    decode : function(str){
        var r = str.substring(0,1);
        var num = str.substring(1);
        return ((num/2) >> 1) - r
    }
}
