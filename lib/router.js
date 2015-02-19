// Sets Iron Router's configuration
Router.configure({
	// Template 'layout' will be used for every page
	layoutTemplate: 'layout'
});


// Iron Router way of defining multiple, simple routes
Router.map(function () {
	this.route('test', { path: '/' })
})

// Iron Router way of defining more complex routes that require data
Router.route('/notSureYet/:_id', {
	name: 'templateName',
	data: function () {return Boards.findOne( this.params._id )}
})