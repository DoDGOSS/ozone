import java.nio.charset.Charset
import grails.util.Environment

// Configuration variables
def LOG_PATH = "./logs"

// Status listener to display changes to the logging configuration
// statusListener(OnConsoleStatusListener)

// Enable periodically scanning the logging configuration for changes
scan("30 seconds")

// Console appender
appender("CONSOLE", ConsoleAppender) {
    encoder(PatternLayoutEncoder) {
        charset = Charset.forName("UTF-8")
        pattern = "%d{yyyy-MM-dd HH:mm:ss.SSS} %level [%logger] %msg%n"
    }
}

if (Environment.getCurrent() == Environment.TEST) {
    root(ERROR, ["CONSOLE"])
} else {
    // File appender
    appender("FILE", RollingFileAppender) {
        append = true
        encoder(PatternLayoutEncoder) {
            charset = Charset.forName("UTF-8")
            pattern = "%d{yyyy-MM-dd HH:mm:ss.SSS} %level [%logger] %msg%n"
        }
        rollingPolicy(TimeBasedRollingPolicy) {
            FileNamePattern = "${LOG_PATH}/ozone-framework_%d.log"
        }
    }

    // Default root logging level
    root(ERROR, ["CONSOLE", "FILE"])
}


// Logging for the Ozone namespaces -- set to INFO or DEBUG for more verbose logging
logger("ozone", WARN)
logger("org.ozoneplatform", WARN)

// Logging for all AJAX requests
logger("ozone.owf.grails.controllers.RequestLogInterceptor", INFO)
