minZoom=0.1;
minZone=960; //pixels, min square zone that every body can see
lineGrow=5; //the greater, the thiner the line is when starting/ending
Session.set("board_w",minZone);
Session.set("board_h",minZone);
Session.set("zoom",1);


Template.board.rendered = function() {
	//console.log("Template.board.rendered");
	boardRender(true);
}


var linesToDraw=null;




function boardRenderWithOverlay() {
	boardRender(true);
}