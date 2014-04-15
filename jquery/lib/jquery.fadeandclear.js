;(function ($, window, document, undefined) {


    // Plugin definition.
    $.fn.fadeAndClear = function( options ) {
        var opts = $.extend( {}, $.fn.fadeAndClear.defaults, options );
        var self = this;
        setTimeout(function(){
            self.fadeOut(function(){
                self.text('').fadeIn();
            });
        }, opts.delay);
    };
    //Plugin defaults
    $.fn.fadeAndClear.defaults = {
        delay: 1500
    };

})(jQuery, window, document);