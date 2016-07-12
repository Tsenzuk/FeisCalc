var Feis = require('./feis');
var Person = require('./user');

var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var fileDb = "./db/feises.db";

var existsFileDb = fs.existsSync(fileDb);
if(!existsFileDb) {
  console.log("Creating DB file.");
  fs.openSync(fileDb, "w");
}
var db = new sqlite3.Database(fileDb);

db.serialize(function () {
	if (!existsFileDb) {
		db.run("CREATE TABLE Feises (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date DATE, address TEXT, description TEXT)");
		db.run("CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, lastName TEXT, date DATE, school TEXT, city TEXT, male BOOLEAN, password TEXT)");
		db.run("CREATE TABLE Participants (id INTEGER PRIMARY KEY AUTOINCREMENT, feis_id INTEGER NOT NULL, user_id INTEGER NOT NULL, FOREIGN KEY (feis_id) REFERENCES feises(id), FOREIGN KEY (user_id) REFERENCES users(id))");
	}
});

var dbWrapper = {
	feises: {
		/**
		 * 
		 * @param {Feis|object}   obj
		 * @param {number}        id
		 * @param {function}      [callback]
		 */
		set: function (obj, id) {
			var callback = arguments[arguments.length - 1];
			if (typeof callback != "function") {
				callback = function () { };
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
						callback(err, new Feis(obj));
					});
				});
			} else {
				//console.log(obj);
				obj = new Feis(obj);
				db.run("INSERT OR REPLACE INTO Feises (" + keysArr.join(",") + ") VALUES (" + keysArr.map(function (k) {
					return ("'" + obj[k] + "'") || "NULL"
				}).join(",") + ")", function (err) {
					if (err) {
						callback(err);
						return;
					}
					var id = this.lastID;
					db.get("SELECT * From Feises WHERE id = " + id, function (err, obj) {
						callback(err, new Feis(obj));
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
				callback = function () { };
			}
			var arr = [];
			if (!id) {
				db.each("SELECT * FROM Feises", function (err, data) {
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
				db.get("SELECT * FROM Feises WHERE name=?", id, function (err, obj) {
					callback(err, new Feis(obj))
				});
			} else {
				db.get("SELECT * FROM Feises WHERE id=?", id, function (err, obj) {
					callback(err, new Feis(obj))
				});
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
				callback = function () { };
			}
			if (isNaN(id)) {
				db.run("DELETE FROM Feises WHERE name=?", id, callback);
			} else {
				db.run("DELETE FROM Feises WHERE id=?", id, callback);
			}
		}
	},
	users: {
		/**
		 * 
		 * @param {Person|object}   obj
		 * @param {number}        id
		 * @param {function}      [callback]
		 */
		set: function (obj, id) {
			var callback = arguments[arguments.length - 1];
			if (typeof callback != "function") {
				callback = function () { };
			}
			if (isNaN(id)) {
				id = undefined;
			}
			var keysArr = Object.keys(obj);
			if (id) {
				db.run("UPDATE Users SET " + keysArr.map(function (k) {
					return k + "='" + obj[k] + "'"
				}).join(",") + " WHERE id=" + id, function (err) {
					if (err) {
						callback(err);
						return;
					}
					db.get("SELECT * From Users WHERE id=" + id, function (err, obj) {
						callback(err, new Person(obj));
					});
				});
			} else {
				db.run("INSERT OR REPLACE INTO Users (" + keysArr.join(",") + ") VALUES (" + keysArr.map(function (k) {
					return ("'" + obj[k] + "'") || "NULL"
				}).join(",") + ")", function (err) {
					if (err) {
						callback(err);
						return;
					}
					var id = this.lastID;
					db.get("SELECT * From Users WHERE id=" + id, function (err, obj) {
						callback(err, new Person(obj));
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
				callback = function () { };
			}
			var arr = [];
			if (!id) {
				db.each("SELECT * FROM Users", function (err, data) {
					if (err) {
						callback(err);
						return;
					}
					arr[data.id] = new Person(data);
				}, function (err, rows) {
					callback(err, arr);
				});
			} else if (isNaN(id)) {
				db.get("SELECT * FROM Users WHERE lastName=?", id, function (err, obj) {
					callback(err, new Person(obj));
				});
			} else {
				db.get("SELECT * FROM Users WHERE id=?", id, function (err, obj) {
					callback(err, new Person(obj));
				});
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
				callback = function () { };
			}
			if (isNaN(id)) {
				db.run("DELETE FROM Users WHERE lastName=?", id, callback);
			} else {
				db.run("DELETE FROM Users WHERE id=?", id, callback);
			}
		}
	},
	participants: {
		/**
		 * 
		 * @param {Person|object}   obj
		 * @param {number}        id
		 * @param {function}      [callback]
		 */
		set: function (feis_id, user_id) {
			var callback = arguments[arguments.length - 1];
			if (typeof callback != "function") {
				callback = function () { };
			}
			if (isNaN(feis_id) || isNaN(user_id)) {
				callback({
					status: "Provide numeric IDs instead of feis_id='" + feis_id + "' and user_id='" + user_id + "'"
				})
				return;
			}
			db.run("INSERT OR REPLACE INTO Participants (feis_id, user_id) VALUES (?, ?)", [feis_id, user_id], function (err) {
				if (err) {
					callback(err);
					return;
				}
				//var id = this.lastID;
				dbWrapper.users.get(user_id, callback);
			});
		},
		/**
		 * 
		 * @param {number|string} [id]         value to search in Fesies table (id or name)
		 * @param {function}      [callback]
		 */
		get: function (feis_id) {
			var callback = arguments[arguments.length - 1];
			if (typeof callback != "function") {
				callback = function () { };
			}
			var arr = [];
			if (!feis_id) {
				db.each("SELECT * FROM Users", function (err, data) {
					if (err) {
						callback(err);
						return;
					}
					arr[data.id] = new Person(data);
				}, function (err, rows) {
					callback(err, arr);
				});
			} else if (isNaN(feis_id)) {
				callback({
					status: "Provide numeric feis_id instead of '" + feis_id + "'"
				})
			} else {
				db.each("SELECT u.* FROM Users u INNER JOIN Participants p ON p.user_id=u.id WHERE p.feis_id=?", feis_id, function (err, data) {
					if (err) {
						callback(err);
						return;
					}
					arr[data.id] = new Person(data);
				}, function (err, rows) {
					callback(err, arr.sort(function (a, b) {
						a = (a.date) ? a.date.getTime() : (new Date());
						b = (b.date) ? b.date.getTime() : (new Date());
						return b - a;
					}));
				});
			}
		},
		/**
		 * 
		 * @param {number|string} id         value to search in Fesies table (id or name)
		 * @param {function}      [callback]
		 */
		del: function (participant_id) {
			var callback = arguments[arguments.length - 1];
			if (typeof callback != "function") {
				callback = function () { };
			}
			if (isNaN(participant_id)) {
				callback({
					status: "Provide numeric participant id instead of '" + participant_id + "'"
				})
			} else {
				db.run("DELETE FROM Participants WHERE id=?", participant_id, callback);
			}
		}
	}
};

module.exports = dbWrapper;
