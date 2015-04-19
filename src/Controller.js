var Controller=function(){
    var before=null;
    var after=null;
    var params={};
    return{
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
        //user Event
        onCreate:function(){},
        onResume:function(){},
        onDestory:function(){}
    }
};
C.controller=Controller;