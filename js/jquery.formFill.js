/**
 * jQuery Form Fill - http://makoto.blog.br/formFill
 * --------------------------------------------------------------------------
 *
 * Licensed under The MIT License
 * 
 * @version     0.1
 * @since       16.06.2010
 * @author      Makoto Hashimoto
 * @link        http://makoto.blog.br/formFill
 * @twitter     http://twitter.com/makoto_vix
 * @license     http://www.opensource.org/licenses/mit-license.php MIT 
 * @package     jQuery Plugins
 * 
 * Usage:
 * --------------------------------------------------------------------------
 * 
 *	$('form#formUser').fill({"name" : "Makoto Hashimoto", "email" : "makoto@makoto.blog.br"});
 *  
 *  <form id="formUser">
 *  	<label>Name:</label>
 *  	<input type="text" name="user.name"/>
 *  	<label>E-mail:</label>
 *  	<input type="text" name="user.email"/>
 *  </form>
 */
(function($){
	
	$.fn.fill = function (obj, settings) {
		
		options = $.extend({}, $.fn.fill.defaults, settings);
		
		$this = $(this);
		
		$this.find("*").each(function(i, item){
			if ($(item).is("input") || $(item).is("select") || $(item).is("textarea")) {
				try {
					var objName;
					var arrayAtribute;
					try {
						
						if (options.styleElementName == "object") {
							// Verificando se é um array
							if ($(item).attr("name").match(/\[[0-9]*\]/i)) {
								objName = $(item).attr("name").replace(/^[a-z]*[0-9]*[a-z]*\./i, 'obj.').replace(/\[[0-9]*\].*/i, "");
								
								arrayAtribute = $(item).attr("name").match(/\[[0-9]*\]\.[a-z0-9]*/i) + "";
								arrayAtribute = arrayAtribute.replace(/\[[0-9]*\]\./i, "");
							} else {
								objName = $(item).attr("name").replace(/^[a-z]*[0-9]*[a-z]*\./i, 'obj.');
							}
						} else if (options.styleElementName == "none") {
							objName = 'obj.' + $(item).attr("name");
						}
						
						var value = eval(objName);
					} catch(e) {
						if (options.debug) {
							debug(e.message);
						}
					}					
					
					switch ($(item).attr("type")) {
						case "hidden":
						case "password":
						case "textarea":
							$(item).val(value);
						break;

						case "text":
							var classe = $(item).attr('class');
							
							if (classe && classe.search("hasDatepicker") != -1) {
								if (value.match(/^[-+]*[0-9]*$/)) {
									$(item).datepicker('setDate', new Date(parseInt(value)));
								} else {
									$(item).datepicker('setDate', new Date(Date.parse(value)));
								}
							} else if ($(item).attr("alt") == "double") {
								$(item).val(value.toFixed(2));
							} else {
								$(item).val(value);
							}
						break;
						
						case "select-one":						
							$(item).val(value).change();
						break;
						case "radio":
							$(item).each(function (i, radio) {
								if ($(radio).val() == value) {
									$(radio).attr("checked", "checked");
								}
							});
						break;
						case "checkbox":
							if ($.isArray(value)) {
								$.each(value, function(i, arrayItem) {
									arrayItemValue = eval("arrayItem." + arrayAtribute);
									if ($(item).val() == arrayItemValue) {
										$(item).attr("checked", "checked");
									}
								}); 
							} else {
								if ($(item).val() == value) {
									$(item).attr("checked", "checked");
								}
							}						
						break;
					}
				} catch(e) {
					if (options.debug) {
						debug(e.message);
					}
				}
				
			}
			
		});
		
	};
	
	$.fn.fill.defaults = {
		styleElementName: 'object',	// object | none
		debug: false
	};
	
	function debug(message) {                                                                                            // Throws error messages in the browser console.
        if (window.console && window.console.log) {
            window.console.log(message);
        }
    };
})(jQuery);