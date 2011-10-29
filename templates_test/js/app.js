var ustreamSys = (function (window, undefined) {
	
	var document = window.document,
		navigator =	window.navigator,
		location  = window.location,
		$ = jQuery = window.jQuery;

    var ustreamData = null, 
		$main = $('#main'),
		key = '50EC15554E84B273E8B74C72174B43DA',
		user = {"username":['NASAtelevision','CNETLive','easports','Hot97Live']};
	
	
	
	
	var getUrlService = function(type,entity,method,vars,getVars){
		
		var baseUrl = "http://api.ustream.tv/json";

		return baseUrl +'/'+ type +'/'+ entity + '/'+ method +'/'+ vars +'?key='+ key +'&'+getVars; 
		
	};

    var getWSData = function (url, success,beforeSend,complete) {
		console.log(url);

        return $.ajax(url, {

            type: 'GET',
            dataType: 'jsonp',
            beforeSend: beforeSend || function (jqXHR, settings) {

			$('.ui-loader').fadeIn('fast');

            },
            success: success,

			complete: complete || function(){
				$('.ui-loader').fadeOut('fast');
			}

        });
    };
	

	
	var render = function(template,data){
		
		 $.tmpl(template, data).appendTo($main);
	
	};
	
	var handleEventToElement = function (parent, child, event, callback) {
		
		$(parent).undelegate(child,event);
		
        $(parent).delegate(child, event, callback);

    };
	
	var createElement = function(type, atributes,wrapTo){
		
		$(type,atributes).appendTo(wrapTo);
		
	};
	
	var loadColorboxOnDemand = function (el) {
		
		var options = {
							innerWidth: 640,
							innerHeight: 400,
							inline: true,
							href: el,
							opacity: 0.5,
							onCleanup: function () {
		
								$(el).empty();
		
							}
                	 };
		
		var callPlugin = function () { $.colorbox(options);};
		
		
        if (typeof ($.fn.colorbox) === "undefined") {
			
			createElement('<link/>',{"rel": "stylesheet", "href": "colorbox/colorbox.css", "type": "text/css"},'head');
			
            $.getScript("js/jquery.colorbox-min.js", callPlugin );

        }
        else {

           callPlugin();

        }



    };
	

	
    var processChannelsData = function (data) {

        var arr = [];
		
		
		
        for (i in data) {

            var dataItem = {};
            dataItem["id"] = data[i].id;
            dataItem["title"] = data[i].title;
            dataItem["description"] = data[i].description;
            dataItem["embedTag"] = data[i].embedTag;
            dataItem["imageUrl"] = data[i].imageUrl;
            dataItem["rating"] = data[i].rating;
            dataItem["status"] = data[i].status;
            dataItem["totalViews"] = data[i].totalViews;
            dataItem["viewersNow"] = data[i].viewersNow;
			dataItem["user"] = data[i].user;
            arr.push(dataItem);



        }
	
     	ustreamData = arr;

    };
	


 
    var processembedTagData = function (data) {
        var arr = [];
        var dataItem = {};
		

        dataItem["embedTag"] = data;

        arr.push(dataItem);

        ustreamData = arr;

    };
	



    var getStreamByChannel = function (e) {
        e.preventDefault();
        var id = $(this).attr("href").replace("#", "");
        $.when(getWSData(getUrlService('channel', id ,'getCustomEmbedTag','','params=autoplay:true;mute:false;height:390;width:640'), processembedTagData)).then(function () {

            $.tmpl($("#embedTagTmpl").template(), ustreamData).appendTo('#embedTag' + id);
            loadColorboxOnDemand('#embedTag' + id + ' div');

        });


    };
	

	var LoadContent = function(hash){
		
			var total =  user.username.length;
			var channelsGroups = [];
			
			for( var i = 0; i < total; i++){
						
				$.when(getWSData(getUrlService('channel','all','search','username:eq:'+user.username[i]  ,''), processChannelsData)).then(function (a) {
					
					
					if(a){
						console.log(a);
						render($("#indexTmpl").template(), a);
					}
					
					
						
           				
						
					
					
				});  
			}
			
			
			
			
			handleEventToElement("#main", ".item-image a", "click", getStreamByChannel);

				
	
	};

    var init = $(function () {
		
          LoadContent();    
			     
    });




})(window);