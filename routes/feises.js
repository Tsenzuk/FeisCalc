var express = require('express');
var Feis = require('../models/feis');
var Person = require('../models/user');

var router = express.Router();

router.use(function (req, res, next) {
    res.locals.model = new Feis();
    next();
});

/* GET feises page. */
router.get('/', function (req, res, next) {
    res.app.get("locals").db.feises.get(null, function (err, data) {
        if (err) {
            res.locals.error = {
                message: "",
                error: err,
                code: 500
            };
            next();
            return;
        }
        res.locals.data = data
        res.locals.title = "Feises list";
        next();
    });
}).post('/', function (req, res, next) {
    res.app.get("locals").db.feises.set(req.body, function (err, data) {
        res.locals.data = data;
        res.locals.title = "Feis " + data.id; //TODO: return id with model
        res.locals.id = data.id;
        next();
    });
});

router.param('id', function (req, res, next, id) {
    res.locals.title = "Feis " + req.params.id;
    res.locals.id = id;
    delete res.locals.model;
    next();
});

/* GET one fies page. */
router.get('/:id', function (req, res, next) {
    res.app.get("locals").db.feises.get(res.locals.id, function (err, feis) {
        if (err) {
            res.locals.error = {
                message: "Feis with id " + res.locals.id,
                error: err,
                code: 500
            }
            next();
            return;
        } else if (!feis) {
            res.locals.error = {
                message: "Feis with id " + res.locals.id,
                error: {
                    status: "Not found"
                },
                code: 404
            };
            next();
            return;
        }
        res.locals.data = feis;
        res.locals.title = "Feis " + res.locals.id;
        //res.locals.id = res.locals.id;
        req.body.id = res.locals.id;
        next();
    })
}).put('/:id', function (req, res, next) {
    res.app.get("locals").db.feises.set(req.body, res.locals.id, function (err, feis) {
        if (err) {
            res.locals.error = {
                message: "Feis with id " + res.locals.id,
                error: err,
                code: 500
            };
            next();
            return;
        }
        res.locals.data = feis;
        res.locals.title = "Feis " + res.locals.id;
        //res.locals.id = res.locals.id;
        next();
    });
}).delete('/:id', function (req, res, next) {
    res.app.get("locals").db.feises.del(res.locals.id, function (err) {
        if (err) {
            res.locals.error = {
                message: "Feis with id " + res.locals.id,
                error: err,
                code: 500
            };
            next();
            return;
        }
        res.locals.error = {
            message: "Feis with id " + res.locals.id,
            error: {
                status: "Is deleted"
            },
            code: 200
        };
        next();
    })
});

/* GET one fies page. */
/*router.use('/:id/participants', function (req, res, next) {
    res.locals.model = new Person();
    next();
}).get('/:id/participants', function (req, res, next) {
    res.locals.data = res.locals.feis.participants;
    res.locals.title = "Participants list";
    next();
}).post('/:id/participants', function (req, res, next) {
    var user = new Person("Auto name for Feis " + (new Date()).getTime());
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
});*/

router.use(function (req, res, next) {
    if (res.locals.error) {
        res.status(res.locals.error.code).render("error", res.locals.error);
        return;
    }
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