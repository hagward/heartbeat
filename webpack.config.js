const webpack = require('webpack')

module.exports = {
    entry: './index.js',
    output: {
        path: __dirname + '/public/dist',
        filename: 'bundle.js'
    }
}
