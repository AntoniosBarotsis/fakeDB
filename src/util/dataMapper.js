const print = require("./log")
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
    fs.writeFileSync('data.json', JSON.stringify(data))
}

function save(path, obj) {
    if (data[path].length === 0 || isApplicable(obj, data[path])) {
        if (entryExists(obj, data[path])) {

            return {'error': 'Object already exists'}
        } else {
            data[path].push(obj)

            fs.writeFileSync('data.json', JSON.stringify(data))
            return 200
        }
    }
    else 
        return {'error': 'Object type is not applicable'}
}

function entryExists(reqObj, dataObj) {
    let res = Object.values(dataObj).filter(el => arraysEqual(Object.values(reqObj), Object.values(el)))

    return res.length > 0
}

// Checks proper field names as well as field types
function isApplicable(reqObj, dataObj) {
    return arraysEqual(Object.keys(reqObj), Object.keys(dataObj[0])) && 
        arraysEqual(Object.values(reqObj).map(el => typeof el), Object.values(dataObj[0]).map(el => typeof el))
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i] && a !== undefined) return false;
    }
    return true;
}

module.exports = { getPaths, getDataInPath, save }