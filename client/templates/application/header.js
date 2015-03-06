Template.header.helpers({
  //Only show clock if on smaller screen
  clock: function() {
    if(screen.width <= 770) {
      return "countdown";
    }
  }
})
