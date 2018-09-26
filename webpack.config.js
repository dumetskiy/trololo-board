const path = require('path'),
    webpack = require('webpack'),
    HtmlWebPackPlugin = require('html-webpack-plugin');

let HTMLWebpackPluginConfig = new HtmlWebPackPlugin({
    template: __dirname + '/assets/index.html',
    filename: 'index.html',
});

module.exports = {
    entry: {
        app: ['./assets/js/index.tsx','react', 'react-dom'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].trololo.bundle.js',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(png|jpeg|ttf|...)$/,
                use: [
                    {loader: 'url-loader', options: {limit: 8192}}
                ]
            },
            {
                test: /\.(scss|sass)$/,
                use: [
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
                            plugins: [require('autoprefixer')]
                        }
                    },
                    {
                        loader: 'sass-loader'
                    },

                ],
                exclude: /node_modules/
            },
            {
                test: /\.(ts|tsx)$/,
                loader: 'awesome-typescript-loader'
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
        ],
    },
    plugins: [
        HTMLWebpackPluginConfig,
        new webpack.ProvidePlugin({
            "React": "react",
            "ReactDOM": "react-dom",
        }),
    ]
};