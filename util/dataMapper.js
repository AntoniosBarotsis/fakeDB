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

    if (isApplicable(obj, data[path])) {
        data[path].push(obj)
        console.log(data);

        fs.writeFileSync('data.json', JSON.stringify(data))
        return 200
    }
    else 
        return {'error': 400}
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
      if (a[i] !== b[i]) return false;
    }
    return true;
}

module.exports = { getPaths, getDataInPath, save }