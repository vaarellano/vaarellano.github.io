angular.module("cartDetails").component("cartDetails",{templateUrl:"template/checkout-view.html",controller:["$http","$stateParams",function t(e,a){var o=this;e.get("js/products/product-"+a.shoesId+".json").then(function(t){o.products=t.data})}]});