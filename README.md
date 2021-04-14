[![NPM License](https://img.shields.io/npm/l/all-contributors.svg?style=flat)](https://github.com/AntoniosBarotsis/fakeDB/blob/master/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@antoniosbarotsis/fake-db?style=flat)](https://www.npmjs.com/package/@antoniosbarotsis/fake-db)
[![NPM Downloads](https://img.shields.io/npm/dt/@antoniosbarotsis/fake-db)](https://www.npmjs.com/package/@antoniosbarotsis/fake-db)

# Fake-DB

## What is it ?

Fake-DB reads in a json file and automatically creates various endpoints
on an express server. The point of this is for it to be used as an API
mock to aid front-end development.

## Installation and Start-Up

Install the package with `npm i @antoniosbarotsis/fake-db`.

Make sure to create a `data.json` file at the root of
your project.

To use it you just have to import it and run `start()`

```js
const db = require('@antoniosbarotsis/fake-db')

db.start(8000) // Starts the server
```

Alternatively you can do the following:

```js
const { start } = require('@antoniosbarotsis/fake-db')

start(8000)
```

The `start` method takes in the port and filename as an arguments. If no port is specified then
`process.env.PORT` will be used. If that is also undefined then `8000` will be picked. The default
file name is `data.json`.

## Usage

The package picks up the objects you input at the
`data.json` file and automatically creates endpoints for them.

If we for example have the following in the file:

```json
{
  "users": [
    {
      "name": "Tony"
    }
  ]
}
```

Once we run the application endpoints will be generated under the
path `http://localhost:8000/users`.

The file will be modified by now to this:

```json
{
  "users": [{
      "name": "Tony",
      "id": 1
  }],
  "state": {
      "users": {
        "counter": 1
      }
  }
}
```

You'll see that our user has a new generated `id` attribute. In
addition a new state object has appeared which is used to keep track of
certain data that is neededbehind the scenes (as of now
it only keeps track of the counters needed
for id generation).

## Endpoints

This might change in the future but for now for every entry in the json
file the following endpoints are created (using `users` as an example):

- GET /users
- GET /users/:id
- POST /users
- PUT /users/:id
- DELETE /users/:id

In other words you can:
Get all users, get a specific user by his id, add a new user (needs
request body) update a user by id (also requires request body) and
delete a user by id.

For now the PUT request needs all of the fields a user normally has
(minus the id) but in the future that might change to any number of
fields.
