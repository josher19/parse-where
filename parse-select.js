var Select, Users, fields, info, plucker, ss, table, toSelect, toSelect_test,
  __hasProp = Object.prototype.hasOwnProperty;

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

if (typeof $ === "undefined" || $ === null) $ = {};

$.parse = {
  get: function(t, w, cb) {
    console.log(arguments);
    if ("function" === typeof w && !cb) {
      cb = w;
      w = null;
    }
    cb(Users);
    return this;
  }
  /*
  Select = (@fields) ->
          @fields = fields.split(",") if fields.split
          @selector = (data) => 
              res=data.results or data 
              (res[f] for own f in @fields)
          @done = (data) =>
              @selector(data)
          @last = => return data
          @from = (table, where, cb) =>
              whendone = @done
              if cb then whendone = (data) -> cb(@done(data)) 
              if ("string" == typeof where) 
                 table += where
                 where = null
              $.parse.get(table, where, whendone)
              @   
          @    
  
  
  s = new Select(['name']).from 'tasks' , '?where={}'
  console.log s.selector(Users)
  */
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
  return console.assert(JSON.stringify(expected) === JSON.stringify(actual), "not the same ", expected, actual);
};

/*
	logme = -> 
			   console.assert "undefined" == typeof _this, "global _this", @_this 
			   console.assert r.data, "r.data not defined", r
			   console.info r, r.data, $.parse.get.data, this.data, @, $.parse.data
			   console.assert typeof @data is "undefined", "@data=", @data
			   return

	setTimeout logme, 0
*/

if ((typeof console !== "undefined" && console !== null) && console.log) {
  toSelect_test;
}

if (this.data != null) delete this.data;

console.log("deleted data:", this.data);

console.info('===========');

Select = function(fields, from, where) {
  var noop,
    _this = this;
  this.from = from;
  this.where = where;
  this.filt = toSelect(fields);
  noop = function(data) {
    return data;
  };
  this.commit = function(cb) {
    var wrap;
    if (cb == null) cb = noop;
    wrap = function(data) {
      return cb(plucker(_this.filt, _this.last = data));
    };
    $.parse.get(_this.from, _this.where, wrap);
    return _this;
  };
  return this;
};

ss = new Select("name", 'tasks', "?where={name:{$exists:true}}");

info = function() {
  return console.info(arguments);
};

console.log(ss, ss.commit(info), ss.last);

if (typeof where === "undefined" || where === null) {
  where = function() {
    return arguments;
  };
}

info('===========', "SELECT fields FROM table WHERE conditions");

info(new Select(fields = "age", table = "tasks", where("conditions...")).commit(info));
