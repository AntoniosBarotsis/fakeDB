module.exports = { log, warning, error, mapped }

function log(str) {
    console.log("\033[32m[ LOG ]    \033[0m %s", str)
}

function warning(str) {
    console.log("\033[33m[ WARNING ]\033[0m %s", str) 
}

function error(str) {
    console.log("\033[31m[ ROOM ]   \033[0m %s", str)
}

function mapped(str) {
    console.log("\033[36m[ MAPPED ] \033[0m %s", str)
}