const express = require("express")
const morgan = require('morgan')
const service = require("./service")
const print = require("./util/log")
const dataMapper = require("./util/dataMapper")

const PORT = process.env.PORT || 8000

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(morgan(`\x1b[33m:method\x1b[0m \x1b[36m:url\x1b[0m :statusColor`));


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

function handleResponce(result, responce) {
    if (result.error) {
        responce.status(400)
    } else {
        responce.status(200)
    }
    responce.send(result)
}


app.listen(PORT, console.debug(`fakeDB Started at ${PORT}`));



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
