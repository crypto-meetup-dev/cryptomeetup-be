// Dependencies
const log4js = require("log4js")

let SysTime = new Date()
let logTime = SysTime.getFullYear() + "-" + ("0" + (SysTime.getMonth() + 1)).slice(-2) + "-" + ("0" + SysTime.getDate()).slice(-2)
const coreLogFileName = `../logs/CryptomeetupBE-${logTime}.log`

log4js.configure({
    appenders: {
        Core: { type: "file", filename: coreLogFileName },
        console: { type: "console" }
    },
    categories: {
        CryptomeetupBE: { appenders: ["console", "Core"], level: "trace" },
        default: { appenders: ["console"], level: "trace" }
    }
})

let CryptomeetupBELogger = log4js.getLogger("CryptomeetupBE")

function info(log) {
    CryptomeetupBELogger.info(log)
}

function trace(log) {
    CryptomeetupBELogger.trace(log)
}

function debug(log) {
    CryptomeetupBELogger.debug(log)
}

function warning(log) {
    CryptomeetupBELogger.warn(log)
}

function fatal(log) {
    CryptomeetupBELogger.fatal(log)
}

function level(lev) {
    CryptomeetupBELogger.level = lev
}

module.exports = {
    info,
    trace,
    debug,
    warning,
    fatal,
    level
}