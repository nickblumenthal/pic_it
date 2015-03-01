Template.layout.rendered = function () {
	this.$('#main').velocity('transition.slideDownBigIn', {
		complete: function () {
			$('.hidden').removeClass('.hidden')
		}
	})
};