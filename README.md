# parse-where

Use functions to create a "where" object that can be used for parse.com

    WHERE key1 <= value AND key1 > value2 AND key3=value3

gets parsed into:

    where('key3').equals('val3').and('k1').gt(1000).and('k1').lte(3000)

which gets converted to:

    ?where={key1:{$lte: value, $gt:value2}, key3:value3}

for passing to $.parse.get

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

For functionional notation, remove the '$'. 
SQL: "WHERE x > 100" 
	becomes Where function: where('x').gt(100) 
	becomes Where Object {"x":{"$gt":100}} 
	becomes query string '?where={"x":{"$gt":100}}'

## Query Constraints

Additional query constraints that can be given at the end of the the Where Clause:
`limit skip order include count`
Also, can be given after order('x').desc() translated to '&limit=-x' appended to the Query String.
Note that these must be appended to the Query String rather than as an object.

### Usage:

    whereQ=where("score").exists();
    whereQ.toString(1) === '{"score":{"$exists":true}}';
    whereQ.toString() === '?where={"score":{"$exists":true}}';
    $.parse.get('GameScore', whereQ, callback);  // ok
    $.parse.get('GameScore' + whereQ, callback); // better
    
    whereLimit=where("score").exists().order("score").desc().limit(10).count();
     $.parse.get('GameScore', whereLimit, callback);  // NOT OK!
     $.parse.get('GameScore' + whereLimit, callback);  // ok

## Summary

Use functions to create "where" objects to send to parse.com
Can also convert to and from a subset of SQL. Sorry, no "OR" or "GROUP BY"!
