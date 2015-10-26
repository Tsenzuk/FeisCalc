var express = require('express');
var Feis = require('../models/feis');
var Person = require('../models/person');
//var sqlite3 = require("sqlite3");
var router = express.Router();
//var db = new sqlite3.Database(':memory:');

/*db.serialize(function () {
    db.run("CREATE TABLE Feises (ID INTEGER, name TEXT, date DATE, address TEXT, description TEXT)");
});*/
router.use(function(req, res, next){
    res.locals.model = new Feis();
    next();
});

/* GET feises page. */
router.get('/', function (req, res, next) {
    res.locals.data = res.app.get("locals").feises;
    res.locals.title = "Feises list";
    next();
    /*db.all("SELECT * From Feises", function (err,feises) {
        if(err){
            res.status(500).send(err);
            return;
        }
        res.locals.data = feises;
        next();
    });*/
}).post('/', function (req, res, next) {
    var feis = new Feis("Auto name for Feis " + (new Date()));
    feis.update(req.body);
    var id = req.app.get("locals").feises.push(feis);
    res.locals.data = feis;
    res.locals.title = "Feis " + id;
    res.locals.id = id;
    next();
}).delete('/', function (req, res, next) {
    req.app.get("locals").feises.length = 0;
    res.locals.data = req.app.get("locals").feises;
    res.locals.title = "Feises list";
    next();
});

router.param('id', function (req, res, next, id) {
    var errors = {
        "404": {
            message: "Feis with id '" + id + "' not found",
            error: {}
        }
    }
    res.locals.title = "Feis " + req.params.id;
    res.locals.id = id;
    delete res.locals.model;
    if (isNaN(id)) {
        req.app.get("locals").feises.forEach(function (feis, index, array) {
            if (feis.name == id) {
                res.locals.feis = req.app.get("locals").feises[index];
                next();
                return true;
            } else if (index == (array.length - 1)) {
                res.status(404).render("error", errors["404"]);
            }
        })
    } else if (id) {
        if (req.app.get("locals").feises[id]) {
            res.locals.feis = req.app.get("locals").feises[id];
            next();
        } else {
            res.status(404).render("error", errors["404"]);
        }
    } else {
        res.status(404).render("error", errors["404"]);
    }
});

/* GET one fies page. */
router.get('/:id', function (req, res, next) {
    res.locals.data = res.locals.feis;
    next();
}).put('/:id', function (req, res, next) {
    res.locals.feis.update(req.body);
    res.locals.data = res.locals.feis;
    next();
}).delete('/:id', function (req, res, next) {
    req.app.get("locals").feises[req.app.get("locals").feises.indexOf(res.locals.feis)] = undefined;
    res.locals.data = req.app.get("locals").feises;
    res.locals.title = "Feises list";
    next();
});

/* GET one fies page. */
router.use('/:id/participants', function (req, res, next) {
    res.locals.model = new Person();
    next();
}).get('/:id/participants', function (req, res, next) {
    res.locals.data = res.locals.feis.participants;
    res.locals.title = "Participants list";
    next();
}).post('/:id/participants', function (req, res, next) {
    var user = new Person("Auto name for Feis " + (new Date()));
    user.update(req.body);
    var id = res.locals.feis.participants.push(user);
    res.locals.data = user;
    res.locals.title = "User " + id;
    res.locals.id = id;
    next();
}).delete('/:id/participants', function (req, res, next) {
    res.locals.feis.participants.length = 0;
    res.locals.data = res.locals.feis.participants;
    res.locals.title = "Participants list";
    next();
});

router.use(function (req, res, next) {
    res.format({
        'text/plain': function () {
            res.render('list', {
                data: res.locals.data
            });
        },
        'text/html': function () {
            res.render('list', {
                data: res.locals.data
            });
        },
        'application/json': function () {
            res.send(res.locals.data);
        },
        'default': function () {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable');
        }
    });
});

module.exports = router;