var express = require('express');
var app = express();
var wordRouter = express.Router();
const check = require('./check.js')

wordRouter.route('/check').post(function(req, res, next) {
    const msg = req.body.msg;
    const flag = check(msg);
    res.send({
        correct: flag
    });
})

module.exports = wordRouter;