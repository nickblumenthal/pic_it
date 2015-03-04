// IMPORTANT: Meteor looks at a reactive element's parent for a property
// _uihooks to see what to do before inserting, moving or deleting the
// reactive element

// Hooks for initial page transition
var hooks = {
  transitioning: false,

  insertElement: function(node, next) {
  	var $node = $(node);

    $node.insertBefore(next);
    $node.addClass('pt-page-current')

    console.log(Session.get('notFirstHook'))
    if (Session.get('notFirstHook')) {
      // TEMP: Not really needed anymore, seeing as we could just 
      // $node.hide() before inserting

      // // Adds transition effect
      $node.addClass('pt-page-' + transitionDir('insert'))

      $node.on( animEndEventName, function () {
      	$node.off( animEndEventName );
      	$node.removeClass('pt-page-' + transitionDir('insert'))
      })
    } else {
      $node.addClass('pt-page-moveFromBottom')

      $node.on( animEndEventName, function () {
        $node.off( animEndEventName );
        $node.removeClass('pt-page-moveFromBottom')
      })
    }
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


var createTransitionHooks = function (transIn, transOut, display, wait, exception) {
  // Sets the default for wait
  var wait = typeof wait !== 'undefined' ? wait : true;

  var hooks = {
    transitioning: false,

    insertElement: function(node, next) {
      var $node = $(node);
      var that = this;
      var trans = 'transition.' + transIn;

      if (exception === true) {
        trans = 'transition.' + velocityDir('insert');
      };

      $node.hide();

      $node.insertBefore(next);

      var insert = function () {
        if (that.transitioning) {
          Meteor.setTimeout( insert, 50 )
        } else {
          $node.velocity( trans, { duration: 600, display: display})
        }
      };
      return Tracker.afterFlush( function () {
        insert()
      })
    },

     moveElement: function (node, next) {
      $(node).animate({ height: 'toggle', opacity: 'toggle' }, 'slow').promise().done(function(){
        $(node).insertBefore(next).animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
      });
    },

    removeElement: function(node) {
      var $node = $(node);
      var that = this;
      var trans = 'transition.' + transOut;
      
      if (exception === true) {
        trans = 'transition.' + velocityDir('remove')
      };

      if ( wait ) { this.transitioning = true };

      $node.velocity( trans, { 
        duration: 600,
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

  // Set transition attributes
  var transIn = typeof this.data.transIn !== 'undefined' ? this.data.transIn : 'fadeIn';
  var transOut = typeof this.data.transOut !== 'undefined' ? this.data.transOut : 'fadeOut';
  var display = typeof this.data.display !== 'undefined' ? this.data.display : true;
  var wait = typeof this.data.wait !== 'undefined' ? this.data.wait : true;

  if (parentNode.id === "router") { 
    return parentNode._uihooks = createTransitionHooks( transIn, transOut, display, wait, true); };
  return parentNode._uihooks = createTransitionHooks( transIn, transOut, display, wait);

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

// Veloctiy Direction:
var velocityDir = function ( action ) {
	// Gets route client is navigating to
	var toRoute = Router.current().url;
  var animROut = 'slideRightBigOut';
  var animRIn = 'slideRightBigIn';
  var animLOut = 'slideLeftBigOut';
  var animLIn = 'slideLeftBigIn';


	if ( toRoute === "/" ) {
		if ( action === "remove" ) {
      return animROut;
		} else {
      return animLIn;
		}
	} else {
		if ( action === "remove" ) {
			return animLOut;
		} else {
			return animRIn;
		}
	}
}