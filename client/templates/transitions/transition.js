// Can use a reactive var and allow transitions to continue when another is done


var hooks = {
  transitioning: false,

  insertElement: function(node, next) {
  	var $node = $(node);

    $node.insertBefore(next);
    // Make it visible
    $node.addClass('pt-page-current')
    // Adds transition effect
    $node.addClass('pt-page-moveFromRight')

    $node.on( animEndEventName, function () {
    	$node.off( animEndEventName );
    	$node.removeClass('pt-page-moveFromRight')
    })
  },


  removeElement: function(node) {
    var remove;
    var $node = $(node);
    var that = this;

    // $node.velocity('transition.slideRightBigOut', function () {
    //   $node.remove()
    //   that.transitioning = false;
    // })

		// TEMP: Switch this to a Session variable
		$node.addClass('pt-page-moveToLeft');

		$node.on( animEndEventName, function () {
			$node.off( animEndEventName )
			// $node.removeClass('pt-page-current')
			$node.remove()
		})
  }
};
 
Template.transition.rendered = function() {
  this.firstNode.parentNode._uihooks = hooks;
};