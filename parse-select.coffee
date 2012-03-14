( (global, $) ->

    plucker = (map, results) -> map.call eachItem for eachItem in results
    # FROM   = (list, reduce) -> fromItem for fromItem in list when reduce fromItem
    # WHERE  = (reducer)       -> (whereItem) -> reducer.call whereItem


    Users = [ 
        { name: 'Shane', age:40 }
        { name: 'Robin', age:39 }
        { name: 'Carmela', age:3 }
        { name: 'Nate', age:1 }
        { name: 'Faye', age:80 }
    ]

    # Find users between the age of 18 and 64
    # names = SELECT -> @name, 
    # FROM   Users, 
    # WHERE  -> 18 < @age < 64

    # console.log names

    $ ?= {}
    $.parse.get ?= (t,w,cb) -> 
           console.log("$.parse.get")
           console.log(arguments...)
           if ("function" is typeof w and !cb) then cb=w; w=null
           setTimeout((-> cb({results:Users})), 300)
           cb(Users)
           @

    toSelect = (fields) ->
        if ("function" is typeof fields) then return fields
        fields = fields.split(",") if fields.split
    #    if fields.length == 1 and this.map
    #       -> this[fields]
        if (fields.map)
           -> (this[f] for own f in fields) 
           # [@name, @age]
           # [this[fields[0]], this[fields[1]]]
        else 
           -> 
               obj = {}
               for own k of fields
                  obj[k]=this[k] 
               obj
               # {@name, @age}

    toSelect_test = -> 

        expected = plucker -> [@name , @age],
        Users
        console.log expected

        fromDb = (data) -> 
            plucker toSelect(["name","age"]),
            data

        actual = fromDb Users
        console.log actual

        console.assert( JSON.stringify(expected) == JSON.stringify(actual), ["not the same ", expected, actual].join(" ") )
        fromDb = (data) -> 
            plucker toSelect("name,age"),
            data

        actual = fromDb Users
        # console.log actual

        console.assert( JSON.stringify(expected) == JSON.stringify(actual), "not the same ", expected, actual )

        fromDb = (data) -> 
            plucker toSelect({"name":1,"age":1}),
            data

        actual = fromDb Users
        # console.log actual

        expected = plucker -> {@name, @age},
        Users
        console.log expected

        console.assert( JSON.stringify(expected) == JSON.stringify(actual), "not the same ", expected, actual )

        fromDb = (data) -> 
            plucker toSelect(-> {@name, @age}),
            data

        actual = fromDb Users
        # console.log actual

        expected = plucker -> {@name, @age},
        Users
        console.log expected

        console.assert( JSON.stringify(expected) == JSON.stringify(actual), "not the same ", expected, actual )

        fromDb = (data) -> 
            plucker toSelect("name"),
            data

        actual = fromDb Users
        console.log actual

        expected = "Shane,Robin,Carmela,Nate,Faye"
        console.log expected

        console.assert( expected == String(actual), "not the same ", expected, actual )

        # end test 

    ###
    #	logme = -> 
    #			   console.assert "undefined" == typeof _this, "global _this", @_this 
    #			   console.assert r.data, "r.data not defined", r
    #			   console.info r, r.data, $.parse.get.data, this.data, @, $.parse.data
    #			   console.assert typeof @data is "undefined", "@data=", @data
    #			   return
    #
    #	setTimeout logme, 0
    ###

    toSelect_test() if console? and console.assert

    # From = (@table, @where) ->
    #   if "string" is typeof @where
    #      @table += @where
    #      @where = null
    #   @save = (@data) => data
    #   @select = (cb) =>
    #      $.parse.get(@table, @where, cb || @save)
    #      @
    #   @
    #         
    #From_test = ->
    #
    #f = new From("tasks", "?where={}")
    #
    # console.assert f.table == undefined, f.where == undefined, "undefined where, table in fromify", f
    #console.assert f.table != undefined, f.where != undefined, "defined where, table in From", f
    #
    #console.assert "object" is typeof f, f
    #console.assert @ isnt f, "should not return window", @, f
    #console.assert "function" is typeof f.select, "From.select", f.select


    # delete @data if @data?

    # r = f.select((data) -> blob = JSON.stringify(data)).select(fromDb).select()


    console.log "deleted data:", @data


    info = -> console.info(arguments...)

    info '==========='

    Select = (@fields, @fromTable, @where) ->
        @

    Select:: =    
       from : (table, wh) -> 
              if table? 
                @fromTable = table + (wh||"")
                @last = null
                @
              else @fromTable
        get : (fields, cb=@noop) -> cb plucker toSelect(fields), @last.results || @last
        noop : (data) -> data;
        commit : (cb=@noop) -> 
            # wrap = (data) => cb plucker toSelect(@fields), @last=data
            wrap = (data) => @last=data; @get(@fields);
            $.parse.get(@fromTable, @where, wrap)
            @

    info 'parse.select'

    $.parse.select ?= (fields,table,conds) -> new Select(fields,table,conds)

    ss = new Select "name", 'tasks' , "?where={name:{$exists:true}}"

#    info $.parse.select("id").from("GameScore").commit().get("id", info)

    info pp=$.parse.select("id").from("GameScore").commit(info)

    if (pp && pp.last) then pp.get("createdAt", info)

    console.log  ss, ss.commit(info), ss.last # , SELECT ss.filt, Users

    where ?= -> arguments

    info '==========='

    info "SELECT age,name FROM tasks WHERE conditions..."

    info new Select("age,name", "tasks", where("conditions...")).commit(info)

)(this, this.jQuery)
