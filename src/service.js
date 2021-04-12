const fs = require('fs');
const _ = require('lodash');
const dataMapper = require('./util/dataMapper')
const print = require("./util/log")
const state = 'state'

let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));


function save(path, obj) {
    let obj2 = { ...obj, id: -1 }

    if (data[path].length === 0 || dataMapper.isApplicable(obj2, data[path])) {
        if (dataMapper.entryExists(obj2, data[path])) {
            return {'error': 'Object already exists'}
        } else {
            data[path].push(dataMapper.generateId(path, obj2))

            data[state] = JSON.parse(fs.readFileSync('data.json', 'utf8'))[state];
            fs.writeFileSync('data.json', JSON.stringify(data))

            return 200
        }
    }
    else 
        return {'error': 'Object type is not applicable'}
}

function findById(path, id) {
    let res = _.cloneDeep(data[path])
        .filter(el => el.id === Number(id))[0]

    return res
}

function put(path, obj, id) {
    for (let i = 0; i < data[path].length; i++) {
        if (data[path][i].id === Number(id)) {
            obj = { ...obj, id: data[path][i].id }

            if (dataMapper.isApplicable(obj, data[path])) {
                data[path][i] = obj
                
                fs.writeFileSync('data.json', JSON.stringify(data))
                return obj
            }
        }
    }

    return { error: 'Object not found' }
}

function deleteById(path, id) {
    let arr = _.cloneDeep(data[path])
    let tmp = null
    
    arr = arr.filter(el => {
        if (el.id !== Number(id))
            return true
        else
            tmp = el
    })

    if (_.isEqual(data[path], arr)) {
        return { error: 'Object not found' }
    } else {
        data[path] = arr

        fs.writeFileSync('data.json', JSON.stringify(data))

        return tmp
    }
}

module.exports = { save, findById, put, deleteById }