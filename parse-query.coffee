(module or {}).exports = @SQL =
    select : (fields, table, whereC) ->
        fields = fields?.split(",") or fields
        @selector = (data) => 
            res=data.results or data 
            (d[f] for f in fields for d in res)
        @done = (data) =>
            @data = data
            console?.info 'Got ' + (data?.results.length)
            @selector(data)
        if table
            @from(table,whereC) 
        else 
            @
    from : (table,whereC) ->
        (cb) =>
            wrapcb = (data) -> cb(@done(data))
            $.parse.get(table, whereC, wrapcb)
