/*! Crescent - v0.1.0 - Released: 2015-04-23 */
!function(){
	"use strict";
	var C={version:"0.1.0"};



var Controller=function(_option){
    var option=_option;
    var before=null;
    var after=null;
    var request=null;
    var params={};
    return{
        _run:function(){
            if(before){
                if(typeof before === "function")
                    before();
                else if(before instanceof Controller)
                    // Dangous if we run _run function here
                    before.run();

            }
            run();
            if(after){
                if(typeof after === "function")
                    after();
                else if(after instanceof Controller)
                    after.run();
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
    };
};
C.controller=Controller;
var Model=function(_option){
	var option=_option;
	var datasource={};
	return {
		create:function(){},
		save:function(){},
		update:function(){},
		del:function(){},
	};
};

var Request=function(){
	this.params={};
	this.url=null;
	this.source=null;
};
//Hash change moniter or History state push
var URLMoniter=function(){
	this.init=function(changeCallback){};
	this.getURL=function(){};
	this.setURL=function(){};
};
var URLMoniterHash= new URLMoniter();
	URLMoniterHash.getURL=function(){
		return window.location.href.split("#")[1] || "";
	};
	URLMoniterHash.setURL=function(url){
		window.location.hash="#!"+url;
	};
	URLMoniterHash.init=function(changeCallback){
		var that=this;
		var hashChangeHandler = function(newURL){
			/*for(var i = 0;i < onhashChangeHandlers.length;i++){
					//run all the users hash change handlers
					onhashChangeHandlers[i](newURL);
			}*/
			//the hash not start with ! means this one don't need to route
			if(newURL.indexOf('!')!==0)
				return;
			changeCallback(newURL.substring(1));
		};
		if ("onhashchange" in window){
			//C.addEvent(window,);
			window.onhashchange = function(){
				hashChangeHandler(that.getURL());
			};
		}else{
			//don't support hashchange event, we simulate it by use settimeout
			var perviousURLHash = "";
			var time = 200;
			var hashChangeSimulater = function(){
				var URLHash = that.getURL();
				if(perviousURL != URLHash){
					 hashChangeHandler(URLHash);
				}
				perviousURLHash = URLHash;
			};
			//run the simulater again and again;
			setTimeout(function(){
                hashChangeSimulater();        
                setTimeout(arguments.callee,time);
            },time);
		}
	};
//support history pushstate next release
var URLMoniterHistory= new URLMoniter();
var Router = function(){
	var URLMoniter=null;
	var defaultWay="hash";
	var map = [];
	var params={};
	var runningMidware=null;
	var status=null;
	var j;
	var URLParser=function(url){
		if(!url||url==="") return;
		var urlGroup=url.split('/');
		var request=new Request();
			request.url=url;
			request.source=runningMidware;
		for(var i=0;i<map.length;i++){
			if(map[i].url.length!=urlGroup.length)
				continue;
			for( j=0;j<map[i].url.length;j++){
				if(map[i].url[j]!=urlGroup[j]){
					if(map[i].url[j].indexOf(':')===0){
						var key=map[i].url[j].substr(1);
						var value=urlGroup[j];
						if(params[key]){
							var temp=params[key](value);
							value=temp?temp:value;
						}
						request.params[key]=value;
					}else{
						break;
					}
					
				}
			}

			//call the controller or other middle ware
			if(j==map[i].url.length){
				call(map[i].midware,request);
			}
		}

	};
	var call=function(midware,request){
		if(typeof midware==="function"){
			//support the customize function as a controller.
			midware(request);
			runningMidware=midware;
		}else if(typeof midware==="object"){
			if( midware instanceof Controller){
				midware.setRequest(request);
				midware._run();
				runningMidware=midware;
			}
			else{

				//support the customize object as a controller.
				if(midware.run){
					midware.run(request);
					runningMidware=midware;
				}
			}
		}
		else{
			throw new Error("No middle ware handle such url:"+url);
		}
	};
	if(!history.pushState||defaultWay==="hash"){
		//don't support push state use url hash
		status="hash";
		URLMoniter=URLMoniterHash;

	}else{
		//support history.pushState later
		status="history";
		URLMoniter=URLMoniterHistory;
	}
	URLMoniter.init(URLParser);

	return {
		route:function(url,midware){
			map.push({url:url.split('/'), midware:midware}); 
		},
		//parameter intercepter
		param:function(name,callback){
			params[name]=callback;
		},
		go:function(url){
			URLMoniter.setURL(url);
		},
		redirect:function(url){
			// the request will be reload
		},

	};
};
C.router=new Router();

C.addEvent = function ( obj, type, fn ) {
	if ( obj.attachEvent ) {
		obj['e'+type+fn] = fn;
		obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
		obj.attachEvent( 'on'+type, obj[type+fn] );
	} else
		obj.addEventListener( type, fn, false );
};
C.removeEvent = function( obj, type, fn ) {
	if ( obj.detachEvent ) {
		obj.detachEvent( 'on'+type, obj[type+fn] );
		obj[type+fn] = null;
	} else
		obj.removeEventListener( type, fn, false );
};
//handle the user's own hashchange function;
var onhashChangeFuntions=[];
C.bindHashChange=function(callback){
	this.onhashChangeFuntions.push(callback);
};


	window.C=C;
}();