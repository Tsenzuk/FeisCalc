var Feis = require('./feis');
var Person = require('./person');

var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var fileDb = "../db/feises.db";

var existsFileDb = fs.existsSync(fileDb);
var db = new sqlite3.Database(fileDb);

db.serialize(function () {
    if (!existsFileDb) {
        db.run("CREATE TABLE Feises (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date DATE, address TEXT, description TEXT)");
    }
});

dbWrapper = {
    feises: {
        /**
         * 
         * @param {Feis|object}   obj
         * @param {number}        id
         * @param {function}      [callback]
         */
        set: function (obj, id, callback) {
            var callback = arguments[arguments.length - 1];
            if (typeof callback != "function") {
                callback = function () {};
            }
            if (isNaN(id)) {
                id = undefined;
            }
            var keysArr = Object.keys(obj);
            if (id) {
                db.run("UPDATE Feises SET " + keysArr.map(function (k) {
                    return k + "='" + obj[k] + "'"
                }).join(",") + " WHERE id=" + id, function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    db.get("SELECT * From Feises WHERE id=" + id, function (err, obj) { 
                        callback(err, obj);
                    });
                });
            } else {
                db.run("INSERT OR REPLACE INTO Feises (" + keysArr.join(",") + ") VALUES (" + keysArr.map(function (k) {
                    return ("'" + obj[k] + "'") || "NULL"
                }).join(",") + ")", function (err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    console.log(this);
                    var id = this.lastID;
                    db.get("SELECT * From Feises WHERE id = " + id, function (err, obj) {
                        callback(err, obj);
                    });
                });
            }
        },
        /**
         * 
         * @param {number|string} [id]         value to search in Fesies table (id or name)
         * @param {function}      [callback]
         */
        get: function (id) {
            var callback = arguments[arguments.length - 1];
            if (typeof callback != "function") {
                callback = function () {};
            }
            var arr = [];
            if (!id) {
                db.each("SELECT * FROM Feises",function(err,data){
                    if (err) {
                        callback(err);
                        return;
                    }
                    arr[data.id] = new Feis(data);
                }, function (err, rows) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(err, arr);
                })
            } else if (isNaN(id)) {
                db.get("SELECT * FROM Feises WHERE name=?", id, callback);
            } else {
                db.get("SELECT * FROM Feises WHERE id=?", id, callback);
            }
        },
        /**
         * 
         * @param {number|string} id         value to search in Fesies table (id or name)
         * @param {function}      [callback]
         */
        del: function (id) {
            var callback = arguments[arguments.length - 1];
            if (typeof callback != "function") {
                callback = function () {};
            }
            if (isNaN(id)) {
                db.run("DELETE FROM Feises WHERE name=?", id, callback);
            } else {
                db.run("DELETE FROM Feises WHERE id=?", id, callback);
            }
        }
    }
};

module.exports = dbWrapper;