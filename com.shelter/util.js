
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
    }
}