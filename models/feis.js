'use strict';

var Identity = require("./identity")

/**
 *
 * @param {String} name
 * @constructor
 **/
function Feis(name) {
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

module.exports = Feis;