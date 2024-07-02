const path = require("node:path");
const fs = require("fs");
const webpack = require("webpack");
const pkg = require("./package.json");
const pluginConfig = require("./src/config.json");
pluginConfig.version = pkg.version;

const meta = (() => {
    const lines = ["/**"];
    for (const key in pluginConfig) {
        lines.push(` * @${key} ${pluginConfig[key]}`);
    }
    lines.push(" */");
    return lines.join("\n");
})();

module.exports = {
    mode: "development",
    target: "node",
    devtool: false,
    entry: "./src/index.ts",
    output: {
        filename: "quinchs-discord.plugin.js",
        path: path.join(__dirname, "dist"),
        libraryTarget: "commonjs2",
        libraryExport: "default",
        compareBeforeEmit: false
    },
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    externalsType: 'var',
    externals: {
        'react': 'BdApi.React',
        'react-dom' : 'BdApi.ReactDOM',
        'zerespluginlibrary': 'ZeresPluginLibrary'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    plugins: [
        new webpack.BannerPlugin({raw: true, banner: meta}),
        {
            apply: (compiler) => {
                compiler.hooks.assetEmitted.tap("quinchs-discord", (filename, info) => {
                    const userConfig = (() => {
                        if (process.platform === "win32") return process.env.APPDATA;
                        if (process.platform === "darwin") return path.join(process.env.HOME, "Library", "Application Support");
                        if (process.env.XDG_CONFIG_HOME) return process.env.XDG_CONFIG_HOME;
                        return path.join(process.env.HOME, "Library", ".config");
                    })();
                    const bdFolder = path.join(userConfig, "BetterDiscord");
                    fs.copyFileSync(info.targetPath, path.join(bdFolder, "plugins", filename));
                    console.log(`\n\n✅ Copied to BD folder\n`);
                });
            }
        }
    ]
};