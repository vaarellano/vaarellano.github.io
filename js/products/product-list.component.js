angular
	.module('productList')
	.component('productList',  {
		templateUrl: 'js/products/product-list.template.html',
		controller: ['$http', function ProductListController($http){

			var self = this;
			self.orderProp = 'price';

			$http.get('js/products/product-list.json').then(function(response){
				self.products = response.data;

			});

		}]

	})