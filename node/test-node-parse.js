var parse=require('./node-parse')

parse.init(require('./init'))

var g=parse.get('tasks' + '?count=1', function() { g.last=arguments; console.info(String(arguments[0]), String(arguments[1]), arguments[2]);})

exports = g
