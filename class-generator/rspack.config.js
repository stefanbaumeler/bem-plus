import path from 'path'

const common = {
    externalsPresets: {
        node: true
    },
    mode: 'production',
    entry: './src/index.ts',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            compilerOptions: {
                                module: 'esnext'
                            }
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    }
};

// ESM build
const esmConfig = {
    ...common,
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: 'index.js',
        library: {
            type: 'module'
        },
        clean: false
    },
    experiments: {
        outputModule: true
    }
};

// UMD build
const umdConfig = {
    ...common,
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: 'index.umd.js',
        library: {
            name: '@bem-plus/class-generator',
            type: 'umd'
        },
        globalObject: 'this',
        clean: false
    }
};

export default [esmConfig, umdConfig];
