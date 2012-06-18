# parse-where

Use functions to create a "where" object that can be used for parse.com.

Starting with a SQL string:

```SQL
    WHERE key1 <= value AND key1 > value2 AND key3=value3
```

gets parsed into (using `fromSQL`):

```javascript
    where("key1").lte("value").and("key1").gt("value2").and("key3").equals("value3")
```

which gets converted to (using `parseWhereQuery` or evil `eval`):

	?where={"key1":{"$lte":value,"$gt":value2},"key3":value3}

for passing to $.parse.get

## Requirements

* Client Side: jQuery and jQuery-Parse    
* _~ OR ~_ Server Side: NodeJS

## Other Operators

<pre>
$op 	Name
=== 	====
:   	Equal To
$lt 	Less Than
$lte	Less Than Or Equal To
$gt 	Greater Than
$gte	Greater Than Or Equal To
$ne 	Not Equal To
$in 	Contained In
$nin	Not Contained in
$exists	A value is set for the key
$regex	Regular Expressions
</pre>

For functional notation, remove the '$'. 

SQL: "WHERE x > 100" 

* becomes **Where Function Chain**: where('x').gt(100) 
* becomes **WhereClause Object**: {"x":{"$gt":100}} 
* becomes **Query String**: '?where={"x":{"$gt":100}}'

## Query Constraints

Additional query constraints that can be given at the end of the the Where Clause: `limit skip order include count`.

Also, `desc` can be given after `order`. So `order('x').desc()` becomes '&limit=-x' appended to the Query String.
Note this must be appended to the Query String (1st argument of $.parse.get) rather sent as an object (2nd argument of $.parse.get)

### Usage:

```javascript

    whereQ=where("score").exists();
    whereQ.toString(1) === '{"score":{"$exists":true}}';
    whereQ.toString() === '?where={"score":{"$exists":true}}';
    $.parse.get('GameScore', whereQ, callback);  // ok
    $.parse.get('GameScore' + whereQ, callback); // better
    
    whereLimit=where("score").exists().order("score").desc().limit(10).count();
     $.parse.get('GameScore', whereLimit, callback);  // NOT OK!
     $.parse.get('GameScore' + whereLimit, callback);  // ok

```

## Summary

Use functions to create "where" objects to send to the parse.com server.
Can also convert to and from a subset of SQL. Sorry, no "_OR_" or "_GROUP BY_"!

## NOTE

This [repo](https://github.com/josher19/parse-where/) was created **before** parse.com came out with their new 
[Javascript Guide](https://www.parse.com/docs/js_guide).

Definitely worth looking at, especially if you are a Backbone.js fan or 
want to do User Signup & Login, though there are currently 
some [typos and errors](https://github.com/josher19/parse-where/wiki/Parse.com-Javascript-Guide) in the sample code.

