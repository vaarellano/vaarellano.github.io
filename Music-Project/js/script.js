$(document).ready(function(){


	var $ham = $('.ham'),
		$mainNav = $('.main-nav'),
		$loader = $('.loader');

	$ham.click(function(){
		$mainNav.toggleClass('hide-nav');
	});

	

	setTimeout(function(){
		$loader.fadeOut('slow');
	}, 5000);



});