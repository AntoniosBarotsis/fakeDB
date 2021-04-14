const express = require("express")
const morgan = require('morgan')
const print = require("./util/log")

const PORT = process.env.PORT || 8000

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(morgan(`\x1b[33m:method\x1b[0m \x1b[36m:url\x1b[0m :statusColor`));

function handleResponce(result, responce) {
    if (result.error) {
        responce.status(400)
    } else {
        responce.status(200)
    }
    responce.send(result)
}



// Morgan config
morgan.token('statusColor', (req, res, args) => {
    // get the status code if response written
    var status = (typeof res.headersSent !== 'boolean' ? Boolean(res.header) : res.headersSent)
        ? res.statusCode
        : undefined

    // get status color
    var color = status >= 500 ? 31 // red
        : status >= 400 ? 33 // yellow
            : status >= 300 ? 36 // cyan
                : status >= 200 ? 32 // green
                    : 0; // no color

    return '\x1b[' + color + 'm ' + status + '\x1b[0m';
});

/**
 * Starts the server.
 * 
 * @param {Number?} port The server port. Defaults to process.env.PORT || 8000
 * @param {String?} fileName The json file with the data. Defaults to 'data.json'
 */
 function start(port, fileName) {
    let actualPort = port || PORT
    
    if (!fileName)
        fileName = 'data.json'

    process.env.FILENAME = fileName

    const service = require("./service")
    const dataMapper = require("./util/dataMapper")

    // Create routes
    const mappings = dataMapper.getPaths().map(el => `/${el}`)
    const mappingsWithID = mappings.map(el => `${el}/:id`)

    app.get(mappings, (req, res) => {
        let url = req.url.replace(/^\//, '')

        res.send(dataMapper.getDataInPath(url));
    });

    app.get(mappingsWithID, (req, res) => {
        let url = req.url.replace(/^\//, '').replace(/\/[0-9]*/, '')

        res.send(service.findById(url, req.params.id))
    });

    app.post(mappings, (req, res) => {
        let result = service.save(req.url.replace(/^\//, ''), req.body)

        handleResponce(result, res)
    });

    app.put(mappingsWithID, (req, res) => {
        let url = req.url.replace(/^\//, '').replace(/\/[0-9]*/, '')

        let result = service.put(url, req.body, req.params.id)

        handleResponce(result, res)
    });

    app.delete(mappingsWithID, (req, res) => {
        let url = req.url.replace(/^\//, '').replace(/\/[0-9]*/, '')

        let result = service.deleteById(url, req.params.id)

        handleResponce(result, res)
    });

    // Log created routes
    let routes = app._router.stack
    .map(el => el.route)
    .filter(el => el !== undefined)
    .map(el => ({
        path: el.path,
        method: el.methods
    }))
    .map(el => `${Object.keys(el.method).map(el => `\x1b[33m${el.toUpperCase()}\x1b[0m`)} - ${el.path.join(', ')}`)


    routes.forEach(el => print.mapped(el))

    app.listen(actualPort, console.debug(`fakeDB Started at ${actualPort}`))
}

module.exports = { start }