angular.
  module('cartDetails').
  component('cartDetails', {
    templateUrl: 'template/checkout-view.html',
    controller: ['$http', '$stateParams',
      function CartDetailsController($http, $stateParams) {
        var self = this;

        $http.get('js/products/product-' + $stateParams.shoesId + '.json').then(function(response) {
          self.products = response.data;
        });
      }
    ]
  });