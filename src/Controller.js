
var Controller=function(option){
    var option=option;
    var before=null;
    var after=null;
    var request=null;
    var params={};
    return{
        _run:function(){
            if(before){
                if(typeof before ==="function")
                    before();

            }
        },
        run:function(){},
        runBefore:function(_controller){
            before=_controller;
            return this;
        },
        runAfter:function(_controller){
            after=_controller;
            return this;
        },
        setParam:function(name,value){
            params[name]=value;
            return this;
        },
        setRequest:function(request){
            request=request;
            params=request.params;
        },
        //user Event
        onCreate:function(){},
        onResume:function(){},
        onDestory:function(){}
    }
};
C.controller=Controller;