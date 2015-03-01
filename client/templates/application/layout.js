Template.layout.rendered = function () {

	// TEMP: Added this here because lib gets loaded before Modernizr
	// therefore causing an error
	animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ]

	var $main = this.$('#main');
	$main.addClass('pt-page-current').addClass('pt-page-moveFromTop')

	$main.on( animEndEventName, function () {
		$main.off( animEndEventName )
		$main.removeClass('pt-page-moveFromTop')
	})
};