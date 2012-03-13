var __hasProp = Object.prototype.hasOwnProperty;

(function(global, $) {
  var Select, Users, info, plucker, ss, toSelect, toSelect_test, _base;
  plucker = function(map, results) {
    var eachItem, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = results.length; _i < _len; _i++) {
      eachItem = results[_i];
      _results.push(map.call(eachItem));
    }
    return _results;
  };
  Users = [
    {
      name: 'Shane',
      age: 40
    }, {
      name: 'Robin',
      age: 39
    }, {
      name: 'Carmela',
      age: 3
    }, {
      name: 'Nate',
      age: 1
    }, {
      name: 'Faye',
      age: 80
    }
  ];
  if ($ == null) $ = {};
  $.parse = {
    get: function(t, w, cb) {
      console.log("$.parse.get");
      console.log.apply(console, arguments);
      if ("function" === typeof w && !cb) {
        cb = w;
        w = null;
      }
      setTimeout((function() {
        return cb({
          results: Users
        });
      }), 300);
      cb(Users);
      return this;
    }
  };
  toSelect = function(fields) {
    if ("function" === typeof fields) return fields;
    if (fields.split) fields = fields.split(",");
    if (fields.map) {
      return function() {
        var f, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          f = fields[_i];
          _results.push(this[f]);
        }
        return _results;
      };
    } else {
      return function() {
        var k, obj;
        obj = {};
        for (k in fields) {
          if (!__hasProp.call(fields, k)) continue;
          obj[k] = this[k];
        }
        return obj;
      };
    }
  };
  toSelect_test = function() {
    var actual, expected, fromDb;
    expected = plucker(function() {
      return [this.name, this.age];
    }, Users);
    console.log(expected);
    fromDb = function(data) {
      return plucker(toSelect(["name", "age"]), data);
    };
    actual = fromDb(Users);
    console.log(actual);
    console.assert(JSON.stringify(expected) === JSON.stringify(actual), ["not the same ", expected, actual].join(" "));
    fromDb = function(data) {
      return plucker(toSelect("name,age"), data);
    };
    actual = fromDb(Users);
    console.assert(JSON.stringify(expected) === JSON.stringify(actual), "not the same ", expected, actual);
    fromDb = function(data) {
      return plucker(toSelect({
        "name": 1,
        "age": 1
      }), data);
    };
    actual = fromDb(Users);
    expected = plucker(function() {
      return {
        name: this.name,
        age: this.age
      };
    }, Users);
    console.log(expected);
    console.assert(JSON.stringify(expected) === JSON.stringify(actual), "not the same ", expected, actual);
    fromDb = function(data) {
      return plucker(toSelect(function() {
        return {
          name: this.name,
          age: this.age
        };
      }), data);
    };
    actual = fromDb(Users);
    expected = plucker(function() {
      return {
        name: this.name,
        age: this.age
      };
    }, Users);
    console.log(expected);
    console.assert(JSON.stringify(expected) === JSON.stringify(actual), "not the same ", expected, actual);
    fromDb = function(data) {
      return plucker(toSelect("name"), data);
    };
    actual = fromDb(Users);
    console.log(actual);
    expected = "Shane,Robin,Carmela,Nate,Faye";
    console.log(expected);
    return console.assert(expected === String(actual), "not the same ", expected, actual);
  };
  /*
      #	logme = -> 
      #			   console.assert "undefined" == typeof _this, "global _this", @_this 
      #			   console.assert r.data, "r.data not defined", r
      #			   console.info r, r.data, $.parse.get.data, this.data, @, $.parse.data
      #			   console.assert typeof @data is "undefined", "@data=", @data
      #			   return
      #
      #	setTimeout logme, 0
  */
  if ((typeof console !== "undefined" && console !== null) && console.assert) {
    toSelect_test();
  }
  console.log("deleted data:", this.data);
  info = function() {
    return console.info.apply(console, arguments);
  };
  info('===========');
  Select = function(fields, fromTable, where) {
    this.fields = fields;
    this.fromTable = fromTable;
    this.where = where;
    return this;
  };
  Select.prototype = {
    from: function(table, wh) {
      if (table != null) {
        this.fromTable = table + (wh || "");
        this.last = null;
        return this;
      } else {
        return this.fromTable;
      }
    },
    get: function(fields, cb) {
      if (cb == null) cb = this.noop;
      return cb(plucker(toSelect(fields), this.last.results || this.last));
    },
    noop: function(data) {
      return data;
    },
    commit: function(cb) {
      var wrap,
        _this = this;
      if (cb == null) cb = this.noop;
      wrap = function(data) {
        _this.last = data;
        return _this.get(_this.fields);
      };
      $.parse.get(this.fromTable, this.where, wrap);
      return this;
    }
  };
  info('parse.select');
  if ((_base = $.parse).select == null) {
    _base.select = function(fields, table, conds) {
      return new Select(fields, table, conds);
    };
  }
  ss = new Select("name", 'tasks', "?where={name:{$exists:true}}");
  info($.parse.select("id").from("GameScore").commit().get("id", info));
  console.log(ss, ss.commit(info), ss.last);
  if (typeof where === "undefined" || where === null) {
    where = function() {
      return arguments;
    };
  }
  info('===========');
  info("SELECT age,name FROM tasks WHERE conditions...");
  return info(new Select("age,name", "tasks", where("conditions...")).commit(info));
})(this, this.jQuery);
