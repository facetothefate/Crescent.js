var Nav=function(_option,_URLParser){
    var option=_option;
    var $curLink=null;
    var $perLink=null;
    var $curSubLink=null;
    var $perSubLink=null;
    var menus={};
    var defaultMain=null;
    var URL=_URLParser;
    var handleParameters=function(main,sub,addtionalParameters){
        var parameters=[
            {
                key:"m",
                value:main,
            },
            {
                key:"s",
                value:sub,
            }
        ];
        if(addtionalParameters){
            for(var w=0;w<addtionalParameters.length;w++){
                if(addtionalParameters[w].key)
                    parameters.push(addtionalParameters[w]);
            }
        }
        return parameters;
    }
    for(var i=0;i<option.menus.length;i++){
        var key=option.menus[i].key;
        menus[key]={};
        menus[key].$subMenuLinks=[];
        menus[key].option=option.menus[i];
        if(option.menus[i]["default"]===true)
            defaultMain=key;
        if(option.menus[i].subMenus){
            for(var j=0;j<option.menus[i].subMenus.length;j++){
                //var parameters='#m='+key+'&s='+j;
                var parameters=handleParameters(key,j,option.menus[i].subMenus[j].addtionalParameters);
                var href=null;
                if(option.menus[i].subMenus[j].linkForNavgation)
                    href='href="'+URL.getPath(parameters)+'"';
                else
                    href='href="javascript:void(0)"';
                var $a=$('<a '+href+'>'+option.menus[i].subMenus[j].title+'</a>').attr('data-menu',key).attr('data-submenu',j);                
                    $a.attr('data-nav',option.menus[i].subMenus[j].linkForNavgation);
                menus[key].$subMenuLinks.push($a);
            }
        }
    }
    if(!defaultMain)
        defaultMain=option.menus[0].key;
    var $title=$(option.titleDiv);
    var $subMenuDiv=$(option.subMenuDiv);
    var $main=$(option.main);
    var go=function(main,sub,addtionalParameters){
        var parameters=handleParameters(main,sub,addtionalParameters);
        URL.set(parameters);
        if(menus[main].option.subMenus[sub].before)
            menus[main].option.subMenus[sub].before();
        $perSubLink=$curSubLink;
        $curSubLink=menus[main].$subMenuLinks[sub];
        if($perSubLink)
            $perSubLink.removeClass('active');
        $curSubLink.addClass('active');
        var subConfiguration=menus[main].option.subMenus[sub];
        if(subConfiguration.url==="") return; 
        $.ajax({
            "url":subConfiguration.url,
            "dataType":"html",
            "success":function(data, textStatus, jqXHR){
                $main.html(data);
                if(subConfiguration.complete)
                    subConfiguration.complete();
            },
            "error":function(xhr,textStatus,error){
                //console.log(xhr);
                $main.html(xhr.responseText);
            }
        });
    };
    var showSub=function(key){
        $subMenuDiv.children('ul').remove();
        var $ul=$('<ul class="nav navbar-nav">');
        for(i=0;i<menus[key].$subMenuLinks.length;i++){
            var $li=$('<li></li>');
                $li.append(menus[key].$subMenuLinks[i]);
                $li.appendTo($ul);
        }
        $ul.hide().appendTo($subMenuDiv).show('slide',200,function(){
            $(option.subMenuDiv+" a").click(function(){
                var $a=$(this);
                if($a.attr('data-nav')=="true")
                    go($a.attr('data-menu'),$a.attr('data-submenu'));
            });
        });
    };
    return{
        switchMainMenu:function(key){
            if($curLink===menus[key].$link)
                return;
            else{
                $perLink=$curLink;
                $curLink=menus[key].$link;
                if($perLink)
                    $perLink.removeClass('active');
                $curLink.addClass('active');
            }
            $title.text(menus[key].option.title);
            if($subMenuDiv.children('ul').length>0){
                $subMenuDiv.children('ul').hide('slide',200,function(){
                    showSub(key);
                });
            }else{
                showSub(key);
            }
        },
        bind:function($div,key){
            var that=this;
            menus[key].$link=$div;
            $div.click(function(){
                that.switchMainMenu(key);
            });
        },
        goDefalut:function(){
            if(!defaultMain) return;
            this.switchMainMenu(defaultMain);
            go(defaultMain,0);
        },
        go:function(main,sub,addtionalParameters){
            go(main,sub,addtionalParameters);
        }
    };
};