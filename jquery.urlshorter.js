
;(function($) {
 	
	
	var pluginName = 'urlShorter';
    // here we go!
    $.urlShorter = function(element, options) {
 
        
        // to avoid confusions, use "plugin" to reference the current
        // instance of the object
        var plugin = this,
 		    URL_BIT_LY = 'http://api.bitly.com/v3/shorten?',
		 	request = {},
			regexpURL = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        // this will hold the merged default, and user-provided options
        // plugin's properties will be available through this object like:
        // plugin.settings.propertyName from inside the plugin or
        // element.data('pluginName').settings.propertyName from outside
        // the plugin, where "element" is the element the plugin is
        // attached to;
        plugin.settings = {}
 
        // reference to the jQuery version of DOM element the plugin is attached to
        var $element = $(element),
             element = element;    // reference to the actual DOM element
 
        // the "constructor" method that gets called when the object is created
        plugin.init = function() {
 
            // the plugin's final properties are the merged default
            // and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options);
			
			initElement();
 
            
 
        }
 
        // public methods
        // these methods can be called like:
        // plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
        // element.data('pluginName').publicMethod(arg1, arg2, ... argn)
        // from outside the plugin, where "element"
        // is the element the plugin is attached to;
 
        // a public method. for demonstration purposes only - remove it!
        plugin.getHashCode = function() {
 
            // code goes here
			if(regexpURL.test(element.value))
				return request.data.hash;
 
        }
		
		plugin.getLongUrl = function(){
				
			if(regexpURL.test(element.value))
				return request.data.long_url;
		}
		
		plugin.destroy = function(){
			
		$element.unbind(plugin.settings.eventFire);
		$element.removeData(pluginName);
		
		}
 
        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)
 
        // a private method. for demonstration purposes only - remove it!
		
		var createLoader = function(){
			
			return $('<span/>',{'class':'url-shorter ' + plugin.settings.loaderClass + ' hidden', css:{ 'height': $element.outerHeight() + 'px' } });
		
		
		}
		
		var initElement = function(){
				
			$element.addClass('url-shorter url-input')
					.bind(plugin.settings.eventFire,function(e){
				
							e.preventDefault();
				
							ajaxRequest(this.value);
				
					})
					
			 	.css('padding','2px 25px 2px 2px')
			 	.wrap('<div class="url-shorter wrapper"/>')
			 	.before(createLoader())
						
			
		}
		
		
		
		
        var ajaxRequest = function(url) {
		
		
		if(regexpURL.test(url)){
				
			var escapeUrl = 'longUrl=' + escape(url);
			var login = 'login=' + plugin.settings.login;
			var apiKey = 'apiKey=' + plugin.settings.apiKey;
			
			$.ajax(URL_BIT_LY + login +'&' + apiKey  + '&' + escapeUrl + '&' + 'format=json',
			{
					type: 'GET',
					dataType: 'jsonp',
					beforeSend :function(jqXHR, settings){  plugin.settings.onBefore(jqXHR, settings); },
					success: function(data, textStatus, jqXHR){ 
								if(data.status_code == 200){
									 request = data;  
									 plugin.settings.onSuccess(data, textStatus, jqXHR);
								}
								else{
									hideShowLoader();
									$.error('bad response error code: ' + data.status_code + ' descripcion: ' + data.status_txt);
									
								}
							},
					complete:function(jqXHR, textStatus){  plugin.settings.onComplete(jqXHR, textStatus); },
					error: function(jqXHR, textStatus, errorThrown){  plugin.settings.onError(jqXHR, textStatus, errorThrown);	}							
			});
		}
		else{
			
			$.error( 'la Url "' +  url + '" no es una url valida');
		}
            // code goes here
 
        }
		
		var applyToElement = function(json, textStatus, jqXHR){
			
			
			$element.attr('title',json.data.long_url).val(json.data.url).css({'text-shadow': "0 1px 1px #ffffcc"}).animate(
            {
                'text-shadow': "0 1px 1px #ffffff"
            }, 100);
			
			
		}
		
		var completeRequest = function(jqXHR, textStatus){
			
			hideShowLoader();
			
		}
		
		var errorRequest = function(jqXHR, textStatus, errorThrown){
			
			hideShowLoader();
		}
		
		var beforeRequest = function(jqXHR, settings){

			hideShowLoader();
		
		}
		
		var hideShowLoader = function(){
			
			$loader =$element.parent().find('.'+ plugin.settings.loaderClass);
			if($loader.hasClass('hidden')){
				$loader.removeClass('hidden');
			}
			else{
				$loader.addClass('hidden');
			}
				
		}
		
 		// plugin's default options
        // this is private property and is  accessible only from inside the plugin
        var defaults = {
 
            login: undefined,
			apiKey: undefined,
 			eventFire : $element.is('input[type=text]') ? 'blur' : 'click',
			loaderClass: 'loader',
            onSuccess: applyToElement,
			onComplete: completeRequest,
			onError: errorRequest,
 			onBefore: beforeRequest
        }
 
        // fire up the plugin!
        // call the "constructor" method
        plugin.init();
 
    }
 
    // add the plugin to the jQuery.fn object
    $.fn.urlShorter = function(options) {
 
        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {
 
            // if plugin has not already been attached to the element
            if (undefined == $(this).data(pluginName)) {
 
                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.urlShorter(this, options);
 
                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data(pluginName, plugin);
 
            }
 
        });
 
    }
 
})(jQuery);