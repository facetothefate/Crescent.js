var Request=function(){
	this.params={};
	this.url=null;
	this.source=null;
};
//Hash change moniter or History state push
var Router = function(){
	var defaultWay="hash";
	var map = [];
	var params={};
	var runningMidware=null;
	var status=null;
	var j;
	var URLParser=function(url){
		if(!url||url==="") return;
		var urlGroup=url.split('/');
		for(var i=0;i<map.length;i++){
			if(url.length!=urlGroup.length)
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
				var request=new Request();
				request.url=url;
				request.source=runningMidware;
				if(typeof map[i].midware==="function"){
					//support the customize function as a controller.
					map[i].midware(request);
					runningMidware=map[i].midware;
				}else if(typeof map[i].midware==="object"){
					if( map[i].midware instanceof Controller){
						map[i].setRequest(request);
						map[i].midware._run();
						runningMidware=map[i].midware;
					}
					else{

						//support the customize object as a controller.
						if(map[i].midware.run){
							map[i].midware.run(request);
							runningMidware=map[i].midware;
						}
					}
				}
				else{
					throw new Error("No middle ware handle such url:"+url);
				}
				
			}
		}

	};

	if(!history.pushState||defaultWay==="hash"){
		//don't support push state use url hash
		status="hash";
		var getHash = function(){
			return window.location.href.split("#")[1] || "";
		};
		var setHash=function(hash){
			window.location.hash=hash;

		};
		
		//moniter the hash change
		var hashChangeHandler = function(newURL){
			/*for(var i = 0;i < onhashChangeHandlers.length;i++){
					//run all the users hash change handlers
					onhashChangeHandlers[i](newURL);
			}*/
			//the hash not start with ! means this one don't need to route
			if(newURL.indexOf('!')!==0)
				return;
			URLParser(newURL.substring(1));
		};

		//direct input the url, run the right controller
		var hash=getHash();

		if(hash){
			 hashChangeHandler(hash);
		}


		if ("onhashchange" in window){
			//C.addEvent(window,);
			window.onhashchange = function(){
				hashChangeHandler(getHash());
			};
		}else{
			//don't support hashchange event, we simulate it by use settimeout
			var perviousURLHash = "";
			var time = 200;
			var hashChangeSimulater = function(){
				var URLHash = getHash();
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

	}else{
		//support history.pushState later
		status="history";
	}
	

	return {
		route:function(url,midware){
			map.push({url:url.split('/'), midware:midware}); 
		},
		//parameter intercepter
		param:function(name,callback){
			params[name]=callback;
		},
		go:function(url){
			if(status=="hash"){
				url='#!'+url;
				setHash(url);
			}
			
		},
		redirect:function(url){
			// the request will be reload
		},

	};
};
C.router=new Router();
