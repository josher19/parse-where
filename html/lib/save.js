var m = require('markdown')
var fs=require('fs')
function fixbr(html) { return html.replace(/<br><\/br>/ig, "<br />") }
function writeCover() {
  var html=m.parse(require('fs').readFileSync('cover.md').toString())
  html=fixbr(html);
  fs.writeFile("cover.html", html, "utf8")
  return html;
}
function reset() {var tty=require('tty'); tty.setRawMode(false); tty.setRawMode(true); }
// reset()
// writeCover
