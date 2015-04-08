var DEFAULT_OPTION={
	url:{
		paramsSeparator:"/",
		valuesSeparator:"/",
		perfix:"",
	},
	load:{
		way:"Ajax", // could be ajax/webSocket
	},
	nav:{
		menus:[
            {
                key:"ExampleMainMenu",
                title:"Example Main Menu",
                subMenus:[
                  	{
                        key:"ExampleSubMenu",
                        title:"Example Sub Menu",
                        url:"/notAvailable",
                        before:function($element){},
                        complete:function($element){},
                        linkForNavgation:true
                    },
                ],
                default:true
            },
        ],
        titleDiv:"#title",
        subMenuDiv:"#sub-menu",
        main:"#page-content",
	}
};
HL.init=function(option){
	this.option=$.extend(option,DEFAULT_OPTION);
	this.URL=new URLParser(option.url);
	this.URL.init();
	this.navgator=new Nav(option.nav);
};