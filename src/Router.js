//Hash change moniter or History state push
var Router=function(){
	var URL=null;
	var map={};
	var getHash=function(){
		return window.location.href.split("#")[1]||"";
	};
	var URLMoniter=function(){

	};
	return {
		route:function(url,callback){

		},
		param:function(name,callback){

		}
	};
};
C.router=new Router();
