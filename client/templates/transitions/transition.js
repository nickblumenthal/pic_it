var hooks = {
  transitioning: false,

  insertElement: function(node, next) {
  	var $node = $(node);

  	$node.hide();
    $node.insertBefore(next);
    $node.velocity('transition.slideLeftBigIn', { delay: 750})
  },


  removeElement: function(node) {
    var remove;
    var $node = $(node);
    var that = this;

    $node.velocity('transition.slideRightBigOut', function () {
      $node.remove()
      that.transitioning = false;
    })
  }
};
 
Template.transition.rendered = function() {
  this.firstNode.parentNode._uihooks = hooks;
};