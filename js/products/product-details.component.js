angular.
  module('productDetails').
  component('productDetails', {
    templateUrl: 'template/product-view.html',
    controller: ['$http', '$stateParams',
      function ProductDetailsController($http, $stateParams) {
        var self = this;

        $http.get('js/products/product-' + $stateParams.shoesId + '.json').then(function(response) {
          self.products = response.data;
        });
      }
    ]
  });