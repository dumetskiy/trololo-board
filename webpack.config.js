var webpack = require('webpack');

module.exports = {
    entry: ['./assets/js/index.js'],
    output: {
        path: __dirname + '/assets/js',
        publicPath: '../js/',
        filename: 'trololo-bundle.js'
    },
    module:{
        rules:[
            {
                test: /\.(png|jpeg|ttf|...)$/,
                use: [
                    { loader: 'url-loader', options: { limit: 8192 } }
                ]
            },
            {
                test:/\.(scss|sass)$/,
                use:[
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].css',
                            outputPath: '../styles'
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [require('autoprefixer')]
                    }
            },
            {
                loader: 'sass-loader'
            }

        ],
        exclude: /node_modules/
    }
],
}

};