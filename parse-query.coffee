@PQ = 
    select : (fields, @from) ->
        @fields = fields.split(",")
        @selector = (data) => 
            res=data.results or data 
            (res[f] for f in @fields)
        @done = (data) =>
            @data = data
            @selector(data)
        @from(@done)
    from : (@table,@where) ->
        (@cb) =>
            $.parse.get(@table, @where, @cb)
