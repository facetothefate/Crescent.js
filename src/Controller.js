var Controller=function(){
    var before=null;
    var after=null;
    return{
        run:function(){},
        runBefore:function(_controller){
            this.before=_controller;
        },
        runAfter:function(_controller){
            this.after=_controller;
        },
        //user Event
        onCreate:function(){},
        onResume:function(){},
        onDestory:function(){}
    }
};
C.controller=Controller;