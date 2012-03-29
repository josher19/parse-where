var log = typeof console !== "undefined" ? console.log.bind(console) : function logger() { jQuery('log').text(JSON.stringify(arguments)); }

var sean  = {"cheatMode":false,"playerName":"Sean Plott","score":73456},
    zhang = {"playerName":"Jang Min Chul","cheatMode":false,"score":80075}
    
var seanId, zhangId;

jQuery.parse.log = function() { log(arguments); return this; }

function cleanup() {
	log("Cleaning up");
	jQuery.parse.select('objectId').from('GameScoreTest', function(results) {
		log("Deleting: " + results);
		for(var i=0; i<results.length; ++i) {
			playerId = results[i];
			jQuery.parse.delete(['GameScoreTest', playerId].join('/'));
		}
		log("Deleted " + results.length + " players");
	});
};

log("Create two new entries")

jQuery.parse.post('GameScoreTest', sean, function(data) {
	seanId = data.objectId;
	log(data);
}).post('GameScoreTest', jang, function(data) {
	zhangId = data.objectId;
	log(data);
})


.log("Select an Object")
.select({'cheatMode':1, 'objectId':1, 'score':true}, 'GameScoreTest', null, function(results) {
    
    log("Results of select objectId and cheatMode (object)");
    log(results);
    results = results.sort(function(a,b) { return a.score - b.score; });
    var cheatMode = selector('cheatMode')(results);
    var ids = selector('objectId')(results);
	
	assert(cheatMode.toString() === "false,false", "wrong cheatMode stored", cheatMode);
	assert(seanId == ids[0], "Two Seans?", seanId, ids[0]);
	assert(zhangId == ids[1], "Two Zhangs?", zhangId, ids[1]);

});

jQuery.parse.log("Select Object where=", sean)
.select(zhang).from('GameScoreTest', sean, function(results) {
	assert(results.length == 1, "More than one result", results);
	
	assert(results[0].playerName === sean.playerName, "Wrong playerName", results, sean);
	
})

.log("Select String: cheatMode")

.select('cheatMode', 'GameScoreTest', function(cheaters) {
    var doCleanup = false;
    
	log(cheaters);
	if (cheaters.length > 2) { cheaters.length = 2; doCleanup = cleanup;}
	assert(cheaters.toString() === "false,false", "wrong data stored", cheaters);
	
    jQuery.parse.delete(['GameScoreTest', seanId].join('/'));
    jQuery.parse.delete(['GameScoreTest', zhangId].join('/'));

	log(["Deleting: ", seanId, zhangId].join(" "));
    if (doCleanup) cleanup();    
})


/*
 * Interesting Google Chrome error:
 * $ === /^\s+/
 * during a breakpoint after failed $.parse.delete, so $.parse is undefined 
 */

function prep(o) { var d = $.extend({}, o); delete d.createdAt; delete d.objectId; delete d.updatedAt; return d; }

var last; // global objects: BAD!
function setLast(data, status, defer) { log(arguments); last = data; }
function getLast() { return last; }

// Looks like we need a way to be able to use $.when to avoid parallel execution problems.
// Perhaps a way to retrieve $.getJSON called by $.parse ?

