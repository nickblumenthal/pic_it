Template.layout.rendered = function () {

	var $main = this.$('#main');
	var $content = this.$('.pt-page')

	// For velocity transitions
	// var $velContent = this.$('.transition-hidden')
	// $velContent.removeClass('transition-hidden')

	$content.addClass('pt-page-current');
	$main.addClass('pt-page-current').addClass('pt-page-moveFromBottom');


	$main.on( animEndEventName, function () {
		$main.off( animEndEventName );
		$main.removeClass('pt-page-moveFromBottom');
	})
	// this.$('#main').velocity('transition.slideDownBigIn', {
	// 	complete: function () {
	// 		$('.transition-hidden').removeClass('.transition-hidden')
	// 	}
	// })
};
