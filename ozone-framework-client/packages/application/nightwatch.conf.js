var seleniumServer = require("selenium-server");
var chromedriver = require("chromedriver");
var geckodriver = require("geckodriver");


// Bugfix for MaxListenersExceededWarning
// Reference: https://github.com/nightwatchjs/nightwatch/issues/408
require("events").EventEmitter.defaultMaxListeners = 100;

module.exports = {

    custom_commands_path: "tests/functional/custom_commands",

    src_folders: [
        // Folders with tests
        "tests/functional"
    ],

    // Where to output the test reports
    output_folder: "reports",

    selenium: {
        // Information for selenium, such as the location of the drivers ect.
        start_process: true,
        server_path: seleniumServer.path,

        // Standard selenium port
        port: 4444,
        cli_args: {
            // "webdriver.chrome.driver": chromedriver.path,
            "webdriver.gecko.driver": geckodriver.path
        }
    },

    test_workers: {
        enabled: false
    },

    test_settings: {

        default: {
            screenshots: {
                enabled: false
            },
            globals: {
                // How long to wait (in milliseconds) before the test times out
                waitForConditionTimeout: 5000
            },
            desiredCapabilities: {
                // The default test
                browserName: "firefox",
                javascriptEnabled: true,
                acceptSslCerts: true,
                nativeEvents: true,
                elementScrollBehavior: 1,
                // chromeOptions: {
                //     w3c: false
                // }
                // "chromeOptions": {
                //     "args": [
                //         "headless",
                //         "disable-web-security",
                //         "ignore-certificate-errors"
                //     ]
                // }
            },
            filter: "*.spec.js"
        },

        // Here, we give each of the browsers we want to test in, and their driver configuration
        // chrome: {
        //     desiredCapabilities: {
        //         browserName: "chrome",
        //         javascriptEnabled: true,
        //         acceptSslCerts: true,
        //         nativeEvents: true,
        //         elementScrollBehavior: 1
        //     }
        // },

        firefox: {
            desiredCapabilities: {
                browserName: "firefox",
                javascriptEnabled: true,
                acceptSslCerts: true,
                nativeEvents: true,
                elementScrollBehavior: 1
            }
        }

    }

};

