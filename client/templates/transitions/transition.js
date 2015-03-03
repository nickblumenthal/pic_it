// Hooks for initial page transition
var hooks = {
  transitioning: false,

  insertElement: function(node, next) {
  	var $node = $(node);

    $node.insertBefore(next);

    // TEMP: Not really needed anymore, seeing as we could just 
    // $node.hide() before inserting
    $node.addClass('pt-page-current')

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

		// TEMP: Switch this to a Session variable
		$node.addClass( 'pt-page-' + transitionDir('remove') );

		$node.on( animEndEventName, function () {
			$node.off( animEndEventName )
			$node.remove()
		})
  }
};


var createTransitionHooks = function (transIn, transOut, display, wait) {
  // Sets the default for wait
  var wait = typeof wait !== 'undefined' ? wait : true;

  var hooks = {
    transitioning: false,

    insertElement: function(node, next) {
      var $node = $(node);
      var that = this;
      var trans = 'transition.' + transIn;

      $node.hide();

      $node.insertBefore(next);

      var insert = function () {
        if (that.transitioning) {
          Meteor.setTimeout( insert, 50 )
        } else {
          $node.velocity( trans, { duration: 500, display: display})
        }
      };
      insert();
    },

     moveElement: function (node, next) {
      debugger
      $(node).animate({ height: 'toggle', opacity: 'toggle' }, 'slow').promise().done(function(){
        $(node).insertBefore(next).animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
      });
    },

    removeElement: function(node) {
      var $node = $(node);
      var that = this;
      var trans = 'transition.' + transOut;

      if ( wait ) { this.transitioning = true };

      $node.velocity( trans, { 
        duration: 500,
        display: display, 
        complete: function () {
          $node.remove()
          that.transitioning = false;
      }})
    }
  };

  return hooks
}
 

// Where hooks are applied
Template.transition.rendered = function() {
	var parentNode = this.firstNode.parentNode;
  var className = parentNode.className;

  // To distinguish with templates to give what hooks
	if ( className === "games-container") {
		parentNode._uihooks = createTransitionHooks('expandIn', 'expandOut', 'inline-block');
	} else if ( parentNode.id === "game-view" ) {
    parentNode._uihooks = createTransitionHooks('slideUpBigIn', 'slideDownBigOut', 'block');
  } else if ( parentNode.id === "timer" ) {
    parentNode._uihooks = createTransitionHooks('slideRightBigIn', 'slideRightBigOut', 'block')
  } else if ( parentNode.id === "guesses") {
    parentNode._uihooks = createTransitionHooks('slideLeftBigIn', 'slideRightBigOut', 'block', false)
  } 
  else {
		parentNode._uihooks = hooks;
	}

};

// For figuring out which direction route changes should transition
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