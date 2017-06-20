$(document).ready(function(){

	(function(){

		var $ham = $('.ham'),
			$overlay = ('.overlay'),
			$sideMenu = $('.side-menu');

		

		$ham.on('click', function(){
			$('.overlay, .side-menu').addClass('open-menu');
		});

		

		$('.overlay, .navigation ul li a' ).on('click', function(){
			$('.overlay, .side-menu').removeClass('open-menu');
		});

	}());
});
