Template.layout.rendered = function () {

	var $main = this.$('.pt-page');
	$main.addClass('pt-page-current').addClass('pt-page-moveFromTop');


	$main.on( animEndEventName, function () {
		$main.off( animEndEventName );
		$main.removeClass('pt-page-moveFromTop');
	})
};