const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const generateCopyPlugin = () => {
    return new CopyWebpackPlugin({
        patterns: [
            { from: './src/resources', to: './' }
        ]
    })
}

const clientConfig = {
    entry: './src/client.ts',
    mode: 'production',
    // optimization: {
    //     minimize: false,
    //     usedExports: true,
    // },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'bundle',
        publicPath: './'
    },
    plugins: [generateCopyPlugin()]
}

const serverConfig = {
    entry: './src/server.ts',
    mode: 'development',
    optimization: {
        minimize: false
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'bundle',
        publicPath: './'
    }
}

module.exports = env => {
    if (env.type == 'client') return clientConfig
    if (env.type == 'server') return serverConfig
}
