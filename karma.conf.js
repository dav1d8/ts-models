module.exports = function(config) {
    config.set({

        frameworks: ["jasmine", "karma-typescript"],

        files: [
            'node_modules/babel-polyfill/dist/polyfill.js', //https://stackoverflow.com/questions/29391111/karma-phantomjs-and-es6-promises/31166888
            { pattern: "src/**/*.ts" }
        ],

        client:{
            clearContext: false
        },

        colors: true,

        preprocessors: {
            "src/**/*.ts": ["karma-typescript"]
        },

        karmaTypescriptConfig: {
            compilerOptions: {
                "lib": [
                    "dom",
                    "es2015"
                ],
                "typeRoots": [
                    "./node_modules/@types"
                ],
                "target": "es5",
                "module": "commonjs",
                "moduleResolution": "node",
                "strict": true,
                "sourceMap": true,
                "emitDecoratorMetadata": true,
                "experimentalDecorators": true,
                "stripInternal": true,
                "suppressImplicitAnyIndexErrors": true,
                "noFallthroughCasesInSwitch": true,
                "skipDefaultLibCheck": true,
                "skipLibCheck": true,
                "removeComments": false
            },
            include: ["src/**/*.ts"],
            // reports:
            //     {
            //         "html": "coverage",
            //         "text-summary": ""
            //     }
        },

        // reporters: ["dots", "progress", "kjhtml", "karma-typescript"],
        reporters: ["kjhtml"],

        browsers: ["Chrome"],
        // browsers: ["Chrome", "IE", "Opera", "Firefox", "PhantomJS", "Edge"],

        singleRun: false
    });
};