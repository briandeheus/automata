var cwd = process.cwd();

module.exports = {
    entry: {
        app: cwd + '/web/src/loader.js',
    },
    output: {
        path: cwd + '/web/dist/',
        filename: '[name].js' // Template based on keys in entry above
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: ['/node_modules/, /web/src/']
            }
        ]
    },
    resolve: {
        root: [cwd + '/frontend', cwd + '/web/src'],
    }
};
