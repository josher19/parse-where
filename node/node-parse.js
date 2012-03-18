/**
 * node-parse.js
 * 
 * Load parse.com using Node.
 * 
 * Based on excellent jQuery-Parse.js 
 * Callback function is node style: data(error, response, body) 
 * rather than jQuery style cb(data)
 * 
 */

(function ($) {
    var request=require('request')
        , extend=require('node.extend')
        , warn = console.warn
        , alert = warn
    
    var ns, _opts, methods;
    
    //Plugin namespace you can change this if you want.. 
    //i.e, ns = "db" = $.db.get/post/put/delete
    ns = "parse";
    
    //default opts
    _opts = {
        base : "https://api.parse.com/1/classes/", 
        // base : "http://localhost:8000/1/classes/", 
        auth : false
    };
    
    //public methods
    methods = {};
    
    function _creds(){
        var error;
        
        if(_opts.app_id && _opts.rest_key){
            return true;
        }
        
        error = "Missing app_id, or rest_key authentication parameters.\n"+
                "Pass these credentials to $."+ns+".init\n"+
                "app_id = Application Id\n"+
                "rest_key = REST API Key";
        alert(error);
        warn(error);
        
        return false;
    }
    
    function _error(){
        //warn("$." + ns +" :" + textStatus +" "+errorThrown);
        warn(arguments);
    }
    
    function defaultCallback(error, response, body) {
		    if (error) console.warn(error);
            if (!error && response.statusCode == 200) {
                console.log(body) // Print the web page response
            }
    }
    
    //TODO JSON.stringify dependency?
    function _http(method, uri, data){
        var req, _data;
        
        if(!_creds()){
            return false;
        }
        
        req = {
            //data
            contentType : "application/json", 
            processData : false, 
            dataType : 'json', 
            
            //action
            url : _opts.base + uri,
            type : method,  
            
            //Credentials 
            //NEW! Parse.com now supports CORS...https://parse.com/docs/rest
            headers : {
                "X-Parse-Application-Id" : _opts.app_id, 
                "X-Parse-REST-API-Key" : _opts.rest_key
            }, 
            error : _error  
        };
        
        //handle data.
        data = typeof data === 'object' ? JSON.stringify(data) : false;
        data = method === 'GET' && data ? "where=" + encodeURIComponent(data) : data;
        req.data = data;
        return req;
    }
    

    function _done(req, cb){
        // return typeof cb === "function" && request(req, cb) // .on('end', cb).on('error', _error);
        return request(req, cb || defaultCallback);
        // return $[ns];
    }
    //exports
        
    methods.init = function(customOpts){
        extend(_opts, typeof customOpts === 'object' ? customOpts : {}, true);
        return $[ns];
    }
    

    ;['GET', 'POST', 'PUT', 'DELETE'].forEach(function(action, i){
        var m = action.toLowerCase();
        
        methods[m] = function(){
            var args, uri, data, cb, req;
            
            args = arguments;
            uri = args[0];
            data = args[1];
            cb = args[2];
            
            if(typeof args[1] === 'function'){
                data = false;
                cb = args[1];
            }
                        
            req = _http(action, uri, data);
            return _done(req, cb);
        };
        
    });
    
    
    $[ns] = methods;
    
    module.exports = $.parse
    
})(this);
