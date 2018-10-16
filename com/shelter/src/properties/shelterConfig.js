module.exports = {
    dev: {
        applicationPort: 3000,
        matcherPort: 3001,
        serverManagerDelay: 10*1000
    },
    release: {
        applicationPort: 3000,
        matcherPort: 3001,
        serverManagerDelay: 30*1000
    }
}