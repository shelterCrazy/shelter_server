module.exports = {
    dev: {
        applicationPort: 3000,
        matcherPort: 3001,
        serverManagerDelay: 10*1000,
        ip: '127.0.0.1'
    },
    release: {
        applicationPort: 3000,
        matcherPort: 3001,
        serverManagerDelay: 30*1000,
        ip: '47.254.18.39'
    }
}