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
