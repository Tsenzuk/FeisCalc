'use strict';

/**
 * 
 * @constructor
 */
function Identity() {
    return this;
}
/**
 *
 * @param {Object} obj
 **/
Identity.prototype.update = function (obj) {
    var that = this;
    Object.keys(this).forEach(function (key) {
        if (obj.hasOwnProperty(key)) {
            if ((typeof obj[key] === typeof that[key])) {
                that[key] = obj[key];
            } else if ((typeof that[key] == "boolean") && (obj[key] == "on")) {
                that[key] = true;
            }
        }
    });
};

module.exports = Identity;