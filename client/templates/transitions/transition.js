// Can use a reactive var and allow transitions to continue when another is done


var hooks = {
  transitioning: false,

  insertElement: function(node, next) {
  	var $node = $(node);

    $node.insertBefore(next);

    $node.addClass('pt-page-current')
    // $node.velocity('transition.slideLeftBigIn', { delay: 750})

    // // Adds transition effect
	    $node.addClass('pt-page-' + transitionDir('insert'))

    $node.on( animEndEventName, function () {
    	$node.off( animEndEventName );
    	$node.removeClass('pt-page-' + transitionDir('insert'))
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
		$node.addClass( 'pt-page-' + transitionDir('remove') );

		$node.on( animEndEventName, function () {
			$node.off( animEndEventName )
			// $node.removeClass('pt-page-current')
			$node.remove()
		})
  }
};

var gamesHooks = {
  transitioning: false,

  insertElement: function(node, next) {
  	var $node = $(node);
    var that = this;

    $node.insertBefore(next);

    var insert = function () {
      if (that.transitioning) {
        Meteor.setTimeout( insert, 50 )
      } else {
        $node.velocity('transition.slideLeftBigIn', { duration: 300, delay: 250, display: 'inline-block'})
      }
    };
    insert();
  },

  removeElement: function(node) {
    var $node = $(node);
    var that = this;

    this.transitioning = true
    $node.velocity('transition.slideRightBigOut', 300, function () {
      $node.remove()
      that.transitioning = false;
    })
  }
};

var gameTemplateHooks = {
  transitioning: false,

  insertElement: function(node, next) {
    var $node = $(node);
    var that = this;

    $node.hide();

    $node.insertBefore(next);

    var insert = function () {
      if (that.transitioning) {
        Meteor.setTimeout( insert, 50 )
      } else {
        $node.velocity('transition.slideUpBigIn', { duration: 300, delay: 250, display: 'inline-block'})
      }
    };
    insert();
  },

  removeElement: function(node) {
    var $node = $(node);
    var that = this;

    this.transitioning = true
    $node.velocity('transition.slideDownBigOut', 300, function () {
      $node.remove()
      that.transitioning = false;
    })
  }
};
 
Template.transition.rendered = function() {
	var parentNode = this.firstNode.parentNode;
  var className = parentNode.className;

  console.log(parentNode)

  // To distinguish with templates to give what hooks
	if ( className === "games-container") {
		parentNode._uihooks = gamesHooks;
	} else if ( parentNode.id === "game-view" ) {
    parentNode._uihooks = gameTemplateHooks;
  } else {
		parentNode._uihooks = hooks;
	}

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