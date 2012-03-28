(module or {}).exports = @SQL =
    select : (fields, table, whereC) ->
        fields = fields?.split(",") or fields
        @selector = (data) => 
            res=data.results or data 
            (d[f] for f in fields for d in res)
        @done = (data) =>
            if ("string" is typeof data) then data = JSON.parse(data) or data
            @data = data
            console?.info 'Got ' + (data?.results?.length)
            @selector(data)
        if table
            @from(table,whereC) 
        else 
            @
    from : (table,whereC) ->
        (cb) =>
            if require?
                wrapcb = (err,req,data) => cb(err,@done(data))
                parse ?= require('./node/node-parse').init(require('./init'))
                parse.get(table, whereC, wrapcb)
            else if jQuery?
                wrapcb = (data) => cb(@done(data))
                $.parse.get(table, whereC, wrapcb)
            else
                console?.warn "requires jQuery.parse or node-parse"
                @
