var pw = this, out1, out2, out3, out4, out5;
if ("undefined" != typeof require) pw=require('./parse-where')

out1=pw.where('x').lt('10').gt(3).and('y').betwixt(1,10)  // incorrect
console.assert(out1.y.$gte === 1, "y >= 1", out1)
console.assert(out1.x.$lt == '10', "x < 10", out1)
console.assert(out1.x.$gt === 3,  "x > 3", out1)
out2=pw.where('a').lt('10').gt(3).and('b').betwixt(2).and(10) 
console.assert(out2.b.$gte === 2, "b >= 2, betwixt", out2)
out3=pw.where('c').lt('10').gt(3).and('d').betwixt(3).and(10) 
console.assert(out3.d.$lte === 10, "d <= 10", out3)
out4=pw.where('x').lt('10').gt(3).and('y').between(4,11) 
console.assert(out4.y.$lte === 11, "y <= 11, between", out4)
// console.info(out1, out4);
out5=pw.where('d').lt('10').gt(3).and('e').between(5,12)  // incorrect
console.assert(out5.e.$lte === 12, "e <= 5, between", out5)
