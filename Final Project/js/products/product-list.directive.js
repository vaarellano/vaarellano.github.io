angular
.module('productList')
.directive('show', function(){
	return{
		restirct: 'A',
		scope: {},
		link: function(scope, element, attrs){
			// element.addClass('box');

			var show = $(document).find('#show');
			var imageContainer = $(document).find('.products .image');

			element.bind('click', function(){
				var $brand = $(this).parent().find('.product-brand').text();
				var $color = $(this).parent().find('.product-color').text();

				var $image = $(this).parent().find('.product-image').attr('src');
	 			imageContainer.addClass('visible').attr('src', $image);

				// alert($brand);
				// alert($color);
			});
		}
	};
})