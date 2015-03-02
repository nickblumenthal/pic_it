// Can use a reactive var and allow transitions to continue when another is done


var hooks = {
  transitioning: false,

  insertElement: function(node, next) {
  	var $node = $(node);

    $node.insertBefore(next);

    $node.addClass('pt-page-current')
    $node.velocity('transition.slideLeftBigIn', { delay: 750})

    // // Make it visible
    // // Adds transition effect
    // $node.addClass('pt-page-' + transitionDir('insert'))

    // $node.on( animEndEventName, function () {
    // 	$node.off( animEndEventName );
    // 	$node.removeClass('pt-page-' + transitionDir('insert'))
    // })
  },


  removeElement: function(node) {
    var remove;
    var $node = $(node);
    var that = this;


    $node.velocity('transition.slideRightBigOut', function () {
      $node.remove()
      that.transitioning = false;
    })

		// TEMP: Switch this to a Session variable
		// $node.addClass( 'pt-page-' + transitionDir('remove') );

		// $node.on( animEndEventName, function () {
		// 	$node.off( animEndEventName )
		// 	// $node.removeClass('pt-page-current')
		// 	$node.remove()
		// })
  }
};
 
Template.transition.rendered = function() {
  this.firstNode.parentNode._uihooks = hooks;
};

var transitionDir = function ( action ) {
	// Gets route client is navigating to
	var toRoute = Router.current().url;
	var direction;

	if ( toRoute === "/" ) {
		if ( action === "remove" ) {
			direction = 'moveToRight';
		} else {
			direction = 'moveFromLeft';
		}
	} else {
		if ( action === "remove" ) {
			direction = 'moveToLeft';
		} else {
			direction = 'moveFromRight';
		}
	}

	return direction;
}