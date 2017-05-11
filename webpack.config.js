const webpack = require('webpack')

module.exports = {
    entry: './index.js',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    }
}
