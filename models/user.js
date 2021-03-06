'use strict';

var Identity = require("./identity")

/**
 *
 * @param {String} name
 * @constructor
 **/
function Person(name) {
    this.super.apply(this);

    //this.id = null;
    this.name = "";
    this.lastName = "";
    this.date = new Date();
    this.school = "";
    this.city = "";
    this.male = false;
    this.tcrg = false;
    this.tmrf = false;
    this.dances = {
        reel: 0,
        slip: 0,
        single: 0,
        light: 0,
        treble: 0,
        hornpipe: 0,
        set: 0
    };
    this.password = "";
    
    if (typeof name == "string") {
        this.name = name;
    } else if (typeof name == "object") {
        this.update(name)
    }
    
    //return this;
}
Person.prototype = Object.create(Identity.prototype);
Person.prototype.constructor = Person;
Person.prototype.super = Identity;
/*Person.prototype.levels = ["beginner","primary","intermediate","open"];*/

module.exports = Person;