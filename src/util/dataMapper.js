const fs = require('fs');
const _ = require('lodash');
const print = require("./log")
const state = 'state'

let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));


function getPaths () {
    return Object.keys(data).filter(el => el !== 'state')
}

function getDataInPath (path) {
    return data[path]
}

function init() {
    addIdsIfNeeded()
    let dataChanged = convertFieldNamesToLowerCase()

    console.log(data[state]);
    if (data[state] === undefined) {
        data[state] = {}
        dataChanged = true
    }

    let tmpArray = _.cloneDeep(data)
    getPaths().forEach(el => {
        console.log(data[el].map(el1 => el1.id).sort((a, b) => b - a)[0] + 1 || 1);
        tmpArray[state][el] = {counter: data[el].map(el1 => el1.id).sort((a, b) => b - a)[0] + 1 || 1}
    })

    if (!_.isEqual(data, tmpArray)) {
        data = tmpArray
        dataChanged = true
    }

    if (dataChanged)
        fs.writeFileSync('data.json', JSON.stringify(data))
}

function convertFieldNamesToLowerCase() {
    let dataCopy = _.cloneDeep(data)

    getPaths().forEach(el => {
        tmp = dataCopy[el]
        delete dataCopy[el]
        dataCopy[el.toLowerCase()] = tmp
    })

    if (JSON.stringify(data) === JSON.stringify(dataCopy))
        return false

    data = dataCopy
}

function generateId(path, obj) {
    obj = { ...obj, id: data[state][path].counter }

    data[state][path].counter = data[state][path].counter + 1

    fs.writeFileSync('data.json', JSON.stringify(data))
    
    return obj
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

module.exports = { getPaths, getDataInPath, generateId, isApplicable, entryExists, addIdsIfNeeded, convertFieldNamesToLowerCase, init }