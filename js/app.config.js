angular
	.module('myApp')
	.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){

		$urlRouterProvider.otherwise('/main');
		

		$stateProvider
			.state('main', {
				url: '/main',
				templateUrl: 'template/main-view.html'
			})
			.state('collection', {
				url: '/collection',
				templateUrl: 'template/collection-view.html'
			})
			.state('lookbook', {
				url: '/lookbook',
				templateUrl: 'template/lookbook-view.html'
			})
			.state('comingsoon', {
				url: '/comingsoon',
				templateUrl: 'template/comingsoon-view.html'
			})
			.state('/collection/:shoesId',{
				url:'/collection/:shoesId',
				template: "<product-details></product-details>"
			})
			.state('/collection/cart/:shoesId',{
				url:'/collection/cart/:shoesId',
				template: "<cart-details></cart-details>"
			})
			.state('/collection/cart/:shoesId/ordercomplete',{
				url:'/collection/cart/:shoesId/ordercomplete',
				templateUrl: "template/ordercomplete.html"
			})
			;

	}]);


	// .config(['$urlRouterProvider', '$stateProvider',function($urlRouterProvider, $stateProvider) {
	// $urlRouterProvider.otherwise('/');
	// $stateProvider
	// 	.state('main', {
	// 		url: '/',
	// 		templateUrl: 'template/main-view.html'
	// 	})
	// 	.state('collection', {
	// 		url: '/collection',
	// 		templateUrl: 'template/collection-view.html'

	// 	})
	// 	.state('product', {
	// 		url: '/collection/product',
	// 		templateUrl: 'template/product-view.html'

	// 	})
	// 	.state('checkout', {
	// 		url: '/collection/product/checkout',
	// 		templateUrl: 'template/checkout-view.html'

	// 	})
	// 	.state('lookbook', {
	// 		url: '/lookbook',
	// 		templateUrl: 'template/lookbook-view.html',
	// 		controller: 'ShoeController',
	// 		resolve: {
	// 			shoes: ['$http', function($http){
	// 				return $http.get('https://count.donreach.com/?url=https://www.vice.com/en_us/article/the-five-worst-fake-news-stories-trump-has-pushed-on-america').then(function(response){
	// 					return response.data;
	// 				})
	// 			}]
	// 		}

	// 	});