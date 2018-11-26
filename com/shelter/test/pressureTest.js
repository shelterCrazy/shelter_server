//公共服务
var http = require('http');

var createOptions = {
    host: '47.254.18.39',
    port: '3000',
    path: '/queryAllUser',
    method: 'get',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive'
    }
}

//请求次数
var total = 50000;
//统计并发数
var count = 0;



//出栈
var pop = function(){
    count--;
    console.log("pop操作 并发数：", count);
}

//入栈
var push = function(){
    count++;
    console.log("push操作 并发数：", count);
}


//1000次快速访问 约等于并发
for(var i=0; i<total; i++){
    //请求响应处理
    var req = http.request(createOptions, function(resp){
        //response 处理
        resp.on('data', (chunk)=>{
            //响应报文体
            // console.log(`response${chunk}`);
        });

        //响应结束
        resp.on('end', () => {
            //说明响应成功了
            pop();
        });
    });

    //error服务失效处理
    req.on('error', (e) => {
        console.error(`探测遇到问题: ${e.message}`);
        pop();
    });

    // 发送请求
    req.end();
    push();
}


