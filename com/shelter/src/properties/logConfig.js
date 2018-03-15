
module.exports = {
  appenders:{
    warnLog:{
      type:"file",
      filename:"shelterWarn.log",
      maxLogSize: 1024*1024
    },
    AllLog:{
      type:"file",
      filename:"shelterInfo.log",
      maxLogSize: 1024*1024*5
    }
  },
  categories:{
    default:{
      appenders:[
        "warnLog"
      ],
      level:"error"
    },
    dev:{
      appenders:[
        "AllLog"
      ],
      level:"debug"
    },
    release:{
      appenders:[
        "warnLog"
      ],
      level:"warn"
    }
  }
}