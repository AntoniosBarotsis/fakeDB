const fs = require('fs');

let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
convertFieldNamesToLowerCase()

function getPaths () {
    return Object.keys(data)
}

function getDataInPath (path) {
    return data[path]
}

function convertFieldNamesToLowerCase() {
    let dataCopy = {...data}
    getPaths().forEach(el => {
        tmp = data[el]
        delete data[el]
        data[el.toLowerCase()] = tmp
    })

    if (JSON.stringify(data) === JSON.stringify(dataCopy))
        return
    fs.writeFileSync('data.json', JSON.stringify(data));
}

module.exports = { getPaths, getDataInPath }