const print = require("./log")
const fs = require('fs');
const _ = require('lodash');

let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
addIdsIfNeeded()
convertFieldNamesToLowerCase()


function getPaths () {
    return Object.keys(data)
}

function getDataInPath (path) {
    return data[path]
}

function convertFieldNamesToLowerCase() {
    let dataCopy = _.cloneDeep(data)

    getPaths().forEach(el => {
        tmp = dataCopy[el]
        delete dataCopy[el]
        dataCopy[el.toLowerCase()] = tmp
    })

    if (JSON.stringify(data) === JSON.stringify(dataCopy))
        return

    data = dataCopy
    fs.writeFileSync('data.json', JSON.stringify(data))
}

function save(path, obj) {
    let obj2 = generateId(path, obj)

    if (data[path].length === 0 || isApplicable(obj2, data[path])) {
        if (entryExists(obj2, data[path])) {

            return {'error': 'Object already exists'}
        } else {
            data[path].push(obj2)

            fs.writeFileSync('data.json', JSON.stringify(data))
            return 200
        }
    }
    else 
        return {'error': 'Object type is not applicable'}
}

function generateId(path, obj) {
    return obj = { ...obj, id: data[path].length + 1}
}

function addIdsIfNeeded() {
    let dataCopy = _.cloneDeep(data)
    getPaths().forEach(path => {
        for (let i = 0; i < dataCopy[path].length; i++) {
            if (!dataCopy[path][i].id) {
                dataCopy[path][i] = generateId(path, dataCopy[path][i])
            }
        }
    })

    if (_.isEqual(data, dataCopy))
        return

    data = dataCopy
    fs.writeFileSync('data.json', JSON.stringify(data))
}

function entryExists(reqObj, dataObj) {
    let res = Object.values(dataObj).filter(el => {
        obj1 = _.cloneDeep(reqObj)
        obj2 = _.cloneDeep(el)

        delete obj1.id
        delete obj2.id

        return _.isEqual(obj1, obj2)
    })

    return res.length > 0
}

// Checks proper field names as well as field types
function isApplicable(reqObj, dataObj) {
    return _.isEqual(Object.keys(reqObj), Object.keys(dataObj[0])) && 
        _.isEqual(Object.values(reqObj).map(el => typeof el), Object.values(dataObj[0]).map(el => typeof el))
}

module.exports = { getPaths, getDataInPath, save }