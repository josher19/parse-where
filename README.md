# parse-where

Use functions to create a "where" object that can be used for parse.com

    WHERE key1 <= value AND key1 > value2 AND key3=value3

gets parsed into:

    where('key3').equals('val3').and('k1').gt(1000).and('k1').lte(3000)

which gets converted to:

    ?where={key1:{$lte: value, $gt:value2}, key3:value3}

for passing to $.parse.get


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


Use functions to create "where" objects to send to parse.com
Can also convert to and from a subset of SQL. Sorry, no "OR" or "GROUP BY"!
