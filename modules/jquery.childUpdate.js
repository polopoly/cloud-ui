define(['./jquery-ui-support'], function($) {

     var settings = {
         keyColumnIndex: 0,
         deletechild: function() {
             var child = this;
             function removeElement() {
                 child.remove();
             }
             setTimeout(removeElement, 5000);
         }
     };

     var childUpdate = {
         init : function(options) {
             var options = $.extend({}, settings, options);
             return this.data('childUpdate.options', options);
         },
         elements: function(elements) {

             var options = this.data('childUpdate.options'), jqElements = $(elements);
             function resolveKey(element) {
                 return element.attr('key');
             }

             var newElements = {};
             if (jqElements) {
                 jqElements.each(function(_, element) {
                     newElements[resolveKey(element)] = element;
                 });
                 $(this).children().each(function(_, element) {
                     var jqElement = $(element);
                     var key = resolveKey(jqElement);
                     if (key != undefined) {
                         if (newElements[key]) {
                             if (!jqElement.hasClass('deleted')) {
                                 jqElement.replaceWith(newElements[key]);
                                 delete newElements[key];
                             }
                         } else {
                             jqElement.addClass('deleted');
                             options.deletechild.call(jqElement);
                         }
                     }
                 });

                 for (var key in newElements) {
                     newElements[key].appendTo(this);
                 }
             }
             return this;
         }
     };

     $.fn.childUpdate = function(method) {
         if (childUpdate[arguments[0]]) {
             return childUpdate[method].apply(this, Array.prototype.slice.call(arguments, 1));
         } else if (typeof method === 'object' || !method) {
             return childUpdate.init.apply(this, arguments);
         } else {
             $.error('Method ' +  method + ' does not exist on jQuery.tooltip');
         }
         return this;
     };
});