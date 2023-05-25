const good = {
    plugin: require("good"),
    options: {
        reporters: {
            myConsoleReporter:
                [
                    { module: 'good-console' },
                    'stdout'
                ]
        }
    }
}

module.exports = good;