const {resolve} = require("path");
module.exports = {
    entry: './src/main.ts',
    mode: "development",
    devtool: "source-map",
    devServer: {
        static: './dist'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            buffer: require.resolve("buffer/")
        }
    },
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'dist'),
    },
};