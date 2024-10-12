const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const routeCounter = require('./router/counter.js')

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/counter', routeCounter);

module.exports = app
