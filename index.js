module.exports = {
   parse : require('./node/node-parse.js').init(require('./init')),
   sql : require('./parse-query'),
   where : require('./parse-where.js'),
   select : require('./selector')
}
