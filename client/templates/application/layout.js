Template.layout.rendered = function () {
	this.$('#main').velocity('transition.slideDownBigIn', {
		complete: function () {
			$('.transition-hidden').removeClass('.transition-hidden')
		}
	})
};
