angular
	.module('productDetails')
	.directive('cart', function(){
		return{
		scope:{},
		restrict: 'A',
		link: function(scope, element, attrs){
			// element.addClass('box');
			var addCart = $(document).find('#addCart');
			var removeCart = $(document).find('#removeCart');
			var bag = $(document).find('#bag');
			// T.text('this is a cart')
			// B.text('this is a Bag')
			// console.log(T);
			// console.log(B);
			
			var items = 0;
			addCart.bind('click', function(scope){
				// B.toggleClass('box');
				items++;
				bag.text(items);
				
			});
			removeCart.bind('click', function(scope){
				// B.toggleClass('box');
				items--;
				bag.text(items);
				
			});
			bag.bind('click', function(scope){
				items = 0;
				bag.text(items);
			})
			// console.log(T);
			//console.log(scope.count);

			
		
		}


		};
	});