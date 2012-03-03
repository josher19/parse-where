	/**
	 * parse-where
	 * for creating where objects for use with parse.com website and libraries
	 *
	 * @version 0.3
	 *
	 * @author Joshua S. Weinstein
	 * http://about.me/joshuaweinstein/
	 */

	(function(GLOBALS){

		var _key, _twit=false, AMP="&"
		    , mapSQL = {"$exists":" EXISTS ","$lt":"<","$lte":"<=","$gt":">","$gte":">=","$ne":"<>","$in":" IN ","$nin":" NOT IN "}
		// var _end=[]
		// var AMP = "&";
		
		function toSql() { var w=this,k,v,t,res=[]; for(k in w) { v=w[k], t="object" === typeof v && !v.join; if (w.hasOwnProperty(k)) res.push(!t ? [k,v].join(" = ") : toSqlProp(k,v)) }; return "WHERE " + res.join(" AND ").replace(/ EXISTS false/ig, " NOT EXISTS").replace(/ EXISTS true/ig, " EXISTS").replace(/(\S*)>=(\S*) and \1<=/ig, "$1 BETWEEN $2 and "); }
		function toSqlProp(k,o) { var v, res=[]; for(v in o) { res.push(k + mapSQL[v] + (typeof o[v]==="string"?o[v]:JSON.stringify(o[v]))); } return res.join(" and ") }

		var Sql2fcn = {"^WHERE ":"where("," BETWEEN ":").betwixt("," AND ":").and(","=":").equals("," NOT EXISTS":").notexists(","!=":").ne("," EXISTS ":").exists(","<":").lt(","<=":").lte(",">":").gt(",">=":").gte(","<>":").ne("," IN ":").in("," NOT IN ":").nin(", " LIMIT ":" ).limit( ", " ORDER BY ":" ).order( ", " COUNT ":" ).count( ", " ASC ": " ).asc( ", " DESC ": " ).desc( "};
		var fromSQL = function(wh) {wh = wh + " "; var r,n,keyz = Object.keys(Sql2fcn).sort(function(a,b) { return b.length - a.length }) ; for(n in keyz) {r=keyz[n]; wh=wh.replace(new RegExp(r, "ig"), Sql2fcn[r]) }; return (wh + ")").replace(/\((\s*)([^()]+?)\s*\)/g, function(m,s,a) { return (a && !isFinite(a) && a[0] && a[0] != '"' && a[0] != "[") ? m.replace(a, JSON.stringify(a)) : m } ).replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');};
		function dedot(str) { return str.replace(/\w+\./g, "") }
		
		var ops = { 
			toSQL: toSql,
			notin: function(ra)  { return this.nin(ra); },
			equals: function(v)  { this[_key]=v; return this}, 
			eq:     function(v)  { this[_key]=v; return this}, 
			between:function(a,b){ return this.gte(a).lte(b); },
			betwixt:function(a)  { _twit=true; return this.gte(a); },
			notexists: function(){ return this.op('$exists', false); },
			exists: function(v)  { return this.op('$exists', null==v?true:!!v); },
			addCon:function(con,val) { return new QueryConstraint(this,con,val); }, // now a QueryConstraint, not a WhereClause
			//addCon:function(con,val) { this['$limits'] = (this['$limits'] || "") + (AMP+con+"="+val); return this;},
			//addCon:function(con,val) { _end.push(con+"="+val); return this; },
			//constraints:function() { return _end.length ? AMP + _end.join(AMP) : ""; },
			toObject:function()  { return this.toString = Object.prototype.toString; }, // or copy it?
			op: function($op,v)  { var t=this[_key]; if(null==t) t=this[_key]={}; t[$op]=v; return this;},
			and:   function(k2)  { if (_twit) { _twit=false; return this.lte(k2); } if(null!=k2)_key=k2; return this;},
			/* there is a more efficient way to do this */
			//toString:function(t) { var cons=this['$limits']; delete this['$limits']; var str=(null!=t?"":"where=")+JSON.stringify(this) + (cons||""); if (null != cons) this['$limits']=cons; return str;}
			toString:function(t) { return (null!=t?"":"where=")+JSON.stringify(this);}
			/* TODO: NOT BETWEEN */
		}; 

		function dequote(json, toSingle) { var q = json.replace(/\\"/g, '"'); if (toSingle) q=q.replace(/"/g, "'"); return q; }	

		function QueryConstraint(wh,op,val,nomore) {
			// will put Query Constraints such as limit, skip, order, include, and count.
			if (!nomore && QueryConstraint != this.constructor) new QueryConstraint(wh,op,val,true);
			this.whereC = wh;
			this.cons = [op+"="+val]; 
			return this;
		}
		
		QueryConstraint.prototype = {		
			 add: function (op, val) { this.cons.push(op+"="+val); return this; }
			 // want JSON.parse(o) -> {'k':{'$op':'val'}}&count=n&limit=m but not valid JSON, so unlikely.
			// ,toJSON: function () { return dequote(this.whereC.toString(1)) + '&' + this.cons.join('&'); }
			// ,toJSON: function () { return this.whereC } // warning: drops constraints
			,toString: function () { return '?' + this.whereC.toString() + '&' + this.cons.join('&'); }
			/* TODO: DESC */
			,asc: function() { return this; }
			,desc: function() { 
				var con, i; 
				for(i=0; i<this.cons.length; ++i) { 
					con=this.cons[i].split("="); 
					if (GLOBALS.verbose) console.log(con);
					if(con[0]==="order" && con[1] && "-" != con[1].charAt(0)) { 
						this.cons[i] = "order=-" + con[1] 
					}
					if (GLOBALS.verbose) console.log(con);
				} 
				return this;
			}
		}

		//"<,<=,>,>=,<>,IN,NOT IN"
		"lt lte gt gte ne in nin regex".split(" ").forEach(  function(o,n){ops[o]=function(v) { return this.op('$'+o,v)} }); 
		"limit skip order include count".split(" ").forEach( function(o,n){
			ops[o]=function(v) { return this.addCon(o,v)} ;
			QueryConstraint.prototype[o]=function(v) { return this.add(o,v)} ;
		 }); 

		function WhereClause(k) { 
			_key = k;
			// _end = new Array();
		}	

		// return ops; 
		// var me, WhereClause=function(){};

		var me=new WhereClause();  
		WhereClause.prototype=ops; 
		// me=new WhereClause();  
		// me.fromSQL = fromSQL;
		// return me;

		function jparse(word) { return ("string"==typeof word) ? JSON.parse(word) : word; } // "{json:val}" -> {json:val}
		function parseWord(word) { var fv=word.split("("), fcn=fv[0], val=jparse(fv[1]);  return [fcn,val] }	// fcn("val") -> [fcn, val]
		function parser(cmdText) { return String(cmdText).replace(/\)$/, "").split(/\)\./g).map(parseWord); } // format: where(val).fcn1("val1").fcn2(val2)...fcnX(valX) -> [["where", val], ["fcn1", val1], ..., ["fcnX", valX]]
		function execList(p) { p[0][0]='where'; var i, obj=this, len=p.length; for(i=0;i<len;++i) { obj=obj[p[i][0]](p[i][1]); }; return obj; } // executes where(val).fcn1("val1").fcn2(val2)...fcnX(valX) for functions & values in list
		
		/** Convert from parse-where Query String to a WhereClause object. Or just eval it if it starts with where('v')... */
		function parseWhere(cmdText) { return execList(parser(cmdText)); } // or just eval it

		var where = function(k) { return new WhereClause(k); };

		GLOBALS.where = where;
		GLOBALS['fromSQL'] = fromSQL;
		GLOBALS['parseWhereQuery'] = parseWhere;
		GLOBALS['parseWhereObj'] = jparse;
		
		if (GLOBALS.console && console.assert) {
			console.info("Running tests for QueryConstraint ...");
			console.assert( fromSQL("WHERE ascending<'nowhere' AND discount>30 ORDER BY nowhere ASC") ===
					'where("ascending").lt("\'nowhere\'").and("discount").gt(30).order("nowhere").asc()'
					, "fromSQL should not convert SQL keywords inside variables"
			);
			console.assert( fromSQL("WHERE ascending<=nowhere AND discount>30 ORDER BY nowhere ASC COUNT").toString()
					!== 'where("ascending").lte("nowhere").and("discount").gt(30).order("nowhere ASC").count()'
					, "fromSQL should handle COUNT properly")
			console.assert( where('x').lt(100).order('x').asc().limit(10).toString() ===
					'?where={"x":{"$lt":100}}&order=x&limit=10'
					, "For QueryConstraint::asc want .order('x').asc() to not change x ->  '&order=x' ");
			console.assert( where('x').lt(100).order('x').desc().limit(10).toString() === 
					'?where={"x":{"$lt":100}}&order=-x&limit=10'
					, 'For QueryConstraint::desc want order("x").desc() to change x to negative--> "&order=-x"'  );				
			console.assert( where('x').lt(100).order('-x').desc().limit(10).toString() === 
					'?where={"x":{"$lt":100}}&order=-x&limit=10'
					, 'For QueryConstraint::desc want order("-x").desc() to not change x --> "&order=-x"'  );				
			console.assert( where('x').lt(100).order('x').desc().desc().limit(10).toString() === 
					'?where={"x":{"$lt":100}}&order=-x&limit=10'
					, 'For QueryConstraint::desc want order("x").desc().desc() change x once --> "&order=-x"'  );				
			console.info("Done testing QueryConstraint");
		}

	})(window);

	/*

	w=where('key3').equals('val3').and('k1').gt(1000).and().lt(2000).and('k4').gte(3).and('k5').equals(3000).and('k6').notin([1,2,3,4]).and('k7').exists(false) 
	=== 
	'{"key3":"val3","k1":{"$gt":1000,"$lt":2000},"k4":{"$gte":3},"k5":3000,"k6":{"$nin":[1,2,3,4]},"k7":{"$exists":false}}'

	w.toSQL() 
	===
	"WHERE key3 = val3 AND k1>1000 and k1<2000 AND k4>=3 AND k5 = 3000 AND k6 NOT IN [1,2,3,4] AND k7 NOT EXISTS AND k8 BETWEEN 10 and 100"

	where.fromSQL(w.toSQL()) == w

	fromSQL("where x<10 andy >= 30") ===
	'where("x").lt("10 andy" ).gte( 30)' // parse error

	fromSQL("where x<10 and y>=30") ===
	'where("x").lt(10).and("y").gte(30)'

	fromSQL('where x<10 and y="n30" and y between 2 and 6 and q in ["a","b","c","d"]') ===
	'where("x").lt(10).and("y").equals("n30").and("y").betwixt(2).and(6).and("q").in(["a","b","c","d"])'

	f=where('arrayKey').eq(2).and('y').exists().limit(100).count(50);
	g=where('arrayKey').eq(3).limit(20);
	f.toString() ===
	'where={"arrayKey":2,"y":{"$exists":true}}&limit=100&count=50' &&
	g.toString() ===
	'where={"arrayKey":3}&limit=20' &&
	f.toString() ===
	'where={"arrayKey":2,"y":{"$exists":true}}&limit=100&count=50'

	var sqlTest = fromSQL('where x<10 and y="n30" and y between 2 and 6 and q in ["a","b","c","d"]')
	var p=parser(sqlTest)
	execList(p).toString() === eval(sqlTest).toString()

	======= Constraints (limit, count, etc)

	$.parse.get('tasks?' + ['where='+JSON.stringify({'createdAt':{'$exists':true}}),'limit=3','count=1'].join("&"), cb)

	var qtasks = new QueryConstraint( where('createdAt').exists() , 'limit', 3).add('count', 1)

	$.parse.get('tasks' + qtasks, cb)
	// 3 tasks with count

	var notasks = new QueryConstraint( where('createdAtx').exists() , 'limit', 3).add('count', 1)

	$.parse.get('tasks' + notasks, cb)
	// 0 tasks with count=0.

	======= 


	*/
