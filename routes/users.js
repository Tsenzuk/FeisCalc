var express = require('express');
var Person = require('../models/user');

var router = express.Router();

router.use(function(req, res, next){
    res.locals.model = new Person();
    next();
});

/* GET users page. */
router.get('/', function (req, res, next) {
    
    res.app.get("locals").db.users.get(null, function (err, data) {
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
        res.locals.title = "Users list";
        next();
    });
    
    /*res.locals.data = req.app.get("locals").users;
    res.locals.title = "Persons list";
    next();*/
}).post('/', function (req, res, next) {
    
    res.app.get("locals").db.users.set(req.body, function (err, data) {
        if (err) {
            res.locals.error = {
                message: "",
                error: err,
                code: 500
            };
            next();
            return;
        }
        res.locals.data = data;
        res.locals.title = "Feis " + data.id; //TODO: return id with model
        res.locals.id = data.id;
        next();
    });
    
    /*var user = new Person("Jane " + (new Date()).getTime());
    user.update(req.body);
    var id = req.app.get("locals").users.push(user);
    res.locals.data = user;
    res.locals.title = "Person " + id;
    res.locals.id = id;
    next();*/
})/*.delete('/', function (req, res, next) {
    req.app.get("locals").users.length = 0;
    res.locals.data = req.app.get("locals").users;
    res.locals.title = "Persons list";
    next();
})*/;

router.param('id', function (req, res, next, id) {
    res.locals.title = "Feis " + req.params.id;
    res.locals.id = id;
    delete res.locals.model;
    next();
    
    /*var errors = {
        "404": {
            message: "User with id '" + id + "' not found",
            error: {}
        }
    }
    res.locals.title = "Person " + id;
    res.locals.id = id;
    delete res.locals.model;
    if (isNaN(id)) {
        req.app.get("locals").users.forEach(function (user, index, array) {
            if (user.name == id) {
                res.locals.user = req.app.get("locals").users[index];
                next();
                return true;
            } else if (index == (array.length - 1)) {
                res.status(404).render("error", errors["404"]);
            }
        })
    } else if (id) {
        if (req.app.get("locals").users[id]) {
            res.locals.user = req.app.get("locals").users[id];
            next();
        } else {
            res.status(404).render("error", errors["404"]);
        }
    } else {
        res.status(404).render("error", errors["404"]);
    }*/
});

/* GET one fies page. */
router.get('/:id', function (req, res, next) {
    res.app.get("locals").db.users.get(res.locals.id, function (err, user) {
        if (err) {
            res.locals.error = {
                message: "User with id " + res.locals.id,
                error: err,
                code: 500
            }
            next();
            return;
        } else if (!user) {
            res.locals.error = {
                message: "User with id " + res.locals.id,
                error: {
                    status: "Not found"
                },
                code: 404
            };
            next();
            return;
        }
        res.locals.data = user;
        res.locals.title = "User " + res.locals.id;
        //res.locals.id = res.locals.id;
        req.body.id = res.locals.id;
        next();
    });
    /*res.locals.data = res.locals.user;
    next();*/
}).put('/:id', function (req, res, next) {
    res.app.get("locals").db.users.set(req.body, res.locals.id, function (err, user) {
        if (err) {
            res.locals.error = {
                message: "User with id " + res.locals.id,
                error: err,
                code: 500
            };
            next();
            return;
        }
        res.locals.data = user;
        res.locals.title = "User " + res.locals.id;
        //res.locals.id = res.locals.id;
        next();
    });
    /*res.locals.user.update(req.body);
    res.locals.data = res.locals.user;
    next();*/
}).delete('/:id', function (req, res, next) {
    res.app.get("locals").db.users.del(res.locals.id, function (err) {
        if (err) {
            res.locals.error = {
                message: "User with id " + res.locals.id,
                error: err,
                code: 500
            };
            next();
            return;
        }
        res.locals.error = {
            message: "User with id " + res.locals.id,
            error: {
                status: "Is deleted"
            },
            code: 200
        };
        next();
    })
    /*req.app.get("locals").users[req.app.get("locals").users.indexOf(res.locals.user)] = undefined;
    res.locals.data = req.app.get("locals").users;
    res.locals.title = "Persons list";
    next();*/
});

/* GET one fies page. */
/*router.get('/:id/dances', function (req, res, next) {
    res.locals.data = res.locals.user.dances;
    next();
}).put('/:id/dances', function (req, res, next) {
    Object.keys(res.locals.user.dances).forEach(function (dance,i,a) {
        var levels = res.locals.user.levels;
        if (req.body.hasOwnProperty(dance)) {
            if (levels.indexOf(req.body[dance]) > -1) {
                res.locals.user.dances[dance] = levels(req.body[dance]);
            } else if ((req.body[dance] < levels.length) && (req.body[dance] > 0)) {
                res.locals.user.dances[dance] = req.body[dance];
            }
        }
    })
    res.locals.data = res.locals.user.dances;
    next();
}).delete('/:id/dances', function (req, res, next) {
    for(var dance in res.locals.user.dances){
        res.locals.user.dances[dance] = 0;
    }
    res.locals.data = res.locals.user;
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