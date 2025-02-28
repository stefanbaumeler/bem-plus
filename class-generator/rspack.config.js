const path = require('path')

module.exports = {
    externalsPresets: {
        node: true
    },
    mode: 'development',
    entry:  {
        index: './src/index.ts',
        module: './src/module.ts'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dist'),
        library: {
            type: 'umd',
        },
        globalObject: 'this'
    }
};
