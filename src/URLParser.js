
var URLParser=function(option){
	//use #! to support the search engine
	var perfix=option.perfix;
	var hash=HL.getHash();
	var params=hash.split(option.paramsSeparator);
	var paramsHashMap={};
	var option=option;
	var init=function(){
		if(option.paramsSeparator==option.valuesSeparator){
			for(var i=0;i<params.length;i+=2){
				if(i+1<params.length)
					paramsHashMap[params[i]]=params[i+1];
			}
		}else{
			for(var i=0;i<params.length;i++){
				var paramPair=params[i].split(HL.option.valuesSeparator);
				paramsHashMap[paramPair[0]]=paramPair[1];
			}
		}
	};
	var getHash=function(){
		return (window.location.href.split("#")[1].substr(perfix.length+1)||"");//perfix.length+1 because we have the "!"
	};
	var updateHash=function(){
		var hash='!'+perfix;
		for(var i in paramsHashMap){
			hash+=option.paramsSeparator+i+option.valuesSeparator+paramsHashMap[i];
		}
		window.location.href=hash;
	};
	return{
		init:function(){
			init();
		},
		get:function(param){
			return paramsHashMap[param];
		},
		place:function(params){
			if(typeof params == "object"){
				for(var i=0;i<params.length;i++){
					paramsHashMap={};
					if(params[i].key&&params.value)
						paramsHashMap[params[i].key]=param[i].value;
				}
				updateHash();
			}
		},
		set:function(){
			//set(key,value)
			if(arguments.length==2)
				paramsHashMap[arguments[0]]=arguments[1];
			//set([{key:1,value:1},{key:2,value:2}])
			if(arguments.length==1){
				for(var i=0;i<arguments[0].length;i++){
					if(arguments[0][i].key&&arguments[0][i].value)
						paramsHashMap[arguments[0][i].key]=arguments[0][i].value;
				}
			}
			updateHash();
		},
		getPath:function(params){
			var path='#!'+perfix;
			for(var i=0;i<params.length;i++){
				path+=option.paramsSeparator+params.key+option.valuesSeparator+params.value;
			}
			return path;
		}
	};
};