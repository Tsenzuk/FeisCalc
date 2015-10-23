var express = require('express');
var Feis = require('feis');
var router = express.Router();

var feises = [];

/* GET feises page. */
router.get('/', function(req, res, next) {
    res.locals.data = feises;
    next();
});

/* POST feises page. */
router.post('/', function(req, res, next) {
    var feis = new Feis("Auto name for Feis " + (new Date()));
    feis.update(req.body);
    feises.push(feis);
    res.locals.data = feis;
    next();
});

/* DELETE all feises. */
router.delete('/', function(req, res, next) {
    feises = [];
    res.locals.data = feises;
    next();
});

router.param('id',function(req, res, next, id){
    var errors = {"404":{message:"Feis with id '" + id + "' not found",error:{}}}
    if(isNaN(id)){
        feises.forEach(function(feis, index, array){
            if(feis.name == id){
                res.locals.feis = feises[index];
                next();
                return true;
            }else if (index == (array.length - 1)){
                res.status(404).render("error",errors["404"]);
            }
        })
    }else if(id){
        if(feises[id]){
            res.locals.feis = feises[id];
            next();
        }else{
            res.status(404).render("error",errors["404"]);
        }
    }else{
        res.status(404).render("error",errors["404"]);
    }
});

/* GET one fies page. */
router.get('/:id', function(req, res, next) {
    res.locals.data = res.locals.feis;
    next();
});

/* PUT one fies page. */
router.put('/:id', function(req, res, next) {
    res.locals.feis.update(req.body);
    res.locals.data = res.locals.feis;
    next();
});

/* DELETE one fies page. */
router.delete('/:id', function(req, res, next) {
    feises[feises.indexOf(res.locals.feis)] = undefined;
    res.locals.data = feises;
    next();
});

router.use(function(req,res,next){
    res.format({
        'text/plain': function(){
            res.render('list', { data: res.locals.data });
        },
        'text/html': function(){
            res.render('list', { data: res.locals.data });
        },
        'application/json': function(){
            res.send(res.locals.data);
        },
        'default': function() {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable');
        }
    });
});

module.exports = router;


/**
 *
 * @param name {String}
 * @constructor
 **/
/*function Feis (name){
    this.super.apply(this);
    
    this.name = name;
    this.date = new Date();
    this.address = "";
    this.description = "";
    this.participants = [];
    this.judges = [];
    return this;
}
Feis.prototype = Object.create(Identity.prototype);
Feis.prototype.constructor = Feis;
Feis.prototype.super = Identity;



/**
 *
 * @constructor
 **/
/*function Identity(){
    return this;
}
/**
 *
 * @param obj {Object}
 **/
/*Identity.prototype.update = function(obj){
    var that = this;
    Object.keys(this).forEach(function(key){
        if(obj.hasOwnProperty(key)){
            if(typeof obj[key] == typeof that[key]){
                that[key] = obj[key];
            }
        }
    })
}*/