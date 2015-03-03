Template.layout.rendered = function () {

	var $main = this.$('#main');
	var $content = this.$('.pt-page')

	$content.addClass('pt-page-current');
	$main.addClass('pt-page-current').addClass('pt-page-moveFromBottom');

	$main.on( animEndEventName, function () {
		$main.off( animEndEventName );
		$main.removeClass('pt-page-moveFromBottom');
	})
};
