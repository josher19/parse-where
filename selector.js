function _allresults(data) { return data.results || data; }

/**
 * Extract SQL SELECT style fields from gotdata, calling (optional) callback fn on results.
 * If gotdata is null or undefined, returns a function to call on data.
 * 
 * @argument fields String, Array, or Object
 *     '*' or null: return gotdata object wtihout changes
 *     Object : return Array of Objects using keys from fields
 *              // Object {"score":1,"objectId":1} ==> Array of Objects : [{score:score1, objectId:id1}, {score:score2, objectId:id2} ...]
 *     String : 'score' ==> Array : [score1, score2, score3, ...]
 *              If fields contains a comma (","), split into an Array and return Array of Arrays instead.
 *     Array : ["score","objectId"] ==> Array of Arrays : [ [score1, id1], [score2, id2], ...]
 * @argument fn Function callback on final results (optional)
 * @argument gotdata Array or Object with 'results' Array (optional)
 */
function selector(fields, fn, gotdata) { 
    if (null != gotdata) { return selector(fields, fn)(gotdata); }
    if ("function" === typeof fn) { return function(d) { return fn(selector(fields)(d)); }}
    if ("function" === typeof fields) { return fields } // use function to find fields to show
    if ("undefined" === typeof gotdata && fn && "object" === typeof fn) { return selector(fields)(fn); }
    if ("string" === typeof fields) { fields = fields.split(/\s*,\s*/); } // Strings : "score,objectId" --> Array of Strings : ["score","objectId"]
    if (null == fields || "*" === fields[0]) {  // "*" --> Everything
        return _allresults;
    }
    if (fields.length === 1) { // String "score" --> flat Array : [score1, score2, score3, ...]
        return function(data) { return $.map(_allresults(data), function(it,n) { return it[fields[0]]; }); };         
    } 
    if (fields.map) { // Array : ["score","objectId"] ==> Array of Arrays : [ [score1, id1], [score2, id2], ...]
        return function(data) { 
            return _allresults(data).map( function(d,n) { return $.map(fields, function(attr) {return d[attr];}); });         
        }; 
    }
    if ("object" === typeof fields) { // Object {"score":1,"objectId":1} ==> Array of Objects : [{score:score1, objectId:id1}, {score:score2, objectId:id2} ...]
        return function(data) { 
            return $.map(_allresults(data), function(d) { 
                obj = {};
                for(key in fields) {
                    if (fields.hasOwnProperty(key)) {
                        obj[key] = d[key];
                    }
                }
                return obj;
            });
        };
    }
    return _allresults;  
}

var getter = $.parse.get;

/**
 * Select fields from a remote table. Can also do: selectFields(fields).from(table,whereK,cb);
 * @argument fields String,Array,or Object fields to select, such as "objectId,createdAt,updatedAt"
 * @argument table String name of remote table
 * @argument whereK Object or String 
 * @argument cb function to call with selected data
 */
function selectFields(fields, table, whereK, cb) { 
	var getFields; 
	if (arguments.length === 1) return {from:function(table,whereK,cb) { return selectFields(fields, table, whereK, cb); }};
	if ("function"===typeof whereK) {
		var noWhere=cb;cb=whereK;whereK=noWhere; // switch cb and whereK
	} 
	else if ("function"===typeof table) {
		cb=table; table=fields; fields="*"; // ('GameScore', callback, whereK) ==> ('*', 'GameScore', whereK, callback)
	}; 
	getFields=selector(fields, cb); // will eventually call: cb(selector(fields)(data.results));
	if (whereK && String(whereK).charAt(0) !== "?") whereK = "?where=" + JSON.stringify(whereK); // convert to Query String
	return getter(table + (whereK || ""), getFields);
}

if ("undefined" !== typeof $ && "undefined" !== typeof $.parse) { $.parse.select = selectFields; getter = $.parse.get; }
