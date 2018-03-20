
module.exports = {
  appenders:{
    InfoLog:{
      type:"file",
      filename:"//var/log/shelter_log.d/shelterInfo.log",
      maxLogSize: 1024*1024*10
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
      level:"warn"
    },
    dev:{
      appenders:[
        "AllLog"
      ],
      level:"debug"
    },
    release:{
      appenders:[
        "InfoLog",
      ],
      level:"info"
    }
  }
}