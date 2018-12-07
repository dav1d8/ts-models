module.exports = function(config) {
    config.set({

        frameworks: ["jasmine", "karma-typescript"],

        files: [
            { pattern: "src/**/*.ts" }
        ],

        preprocessors: {
            "src/**/*.ts": ["karma-typescript"]
        },

        karmaTypescriptConfig: {
            compilerOptions: {
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                module: "commonjs",
                moduleResolution: "node",
                sourceMap: true,
                target: "ES5",
                lib: ["DOM", "ES2015"]
            },
            include: ["src/**/*.ts"],
            reports:
                {
                    "html": "coverage",
                    "text-summary": ""
                }
        },

        reporters: ["dots", "karma-typescript"],

        browsers: ["Chrome"],

        singleRun: true
    });
};