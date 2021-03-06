minZoom=0.1;
minZone=960; //pixels, min square zone that every body can see
lineGrow=5; //the greater, the thiner the line is when starting/ending
Session.set("board_w",550);
Session.set("board_h",200);
Session.set("zoom",1);

Template.board.helpers({
	width: function () {
		setZoom();
		return Session.get('board_w');
	},

	height: function () {
		setZoom();
		return Session.get('board_h')
	},

	role: function() {
		return Session.get('role');
	},

	drawer: function() {
		return Session.get('role') === 'drawer';
	},

	guessedWords: function() {
    return this.guessedWords
  },

	won: function() {
		if(this.won === true) {
			return this.winner;
		} else {
			return 'No winner yet';
		}
	}
});

Template.board.events({
	'click #clear-lines': function (event) {
		Meteor.call('clearLines', this._id);
	}

});

var linesToDraw = null;

Template.board.created = function () {
	var round = this.data;

	Meteor.subscribe( "Lines", round._id );

};

Template.board.rendered = function() {
	var round = this.data;
	resizeBoard();
	boardRender(true, round);

	// Adds listener to stop drawing lines on mouseup outside of board
	$(window).on('mouseup', function (event) {
		mpTouchEnd(event)
	});

	Rounds.startLinesObserver(round);
}

Template.board.destroyed = function () {
	Rounds.stopLinesObserver();

	// Removes listener for stopping lines outside of board
	$(window).off('mouseup');
};

Rounds.startLinesObserver = function startLinesObserver (round) {
	Rounds.linesObserver = Tracker.autorun(function () {
		linesToDraw = Lines.find({ round_id: round._id });

		boardRender( true, round );
	});
}

Rounds.stopLinesObserver = function stopLinesObserver () {
	if ( Rounds.linesObserver ) { Rounds.linesObserver.stop() };
}


var resizeControl = function () {
	var s = size();
	var that = this;

	// TEMP: round = that.data
	var round = getCurrentRound( Session.get('gameID') )

	var canvas = document.getElementById('board');
	if (canvas) {
		if (canvas.width!=s.w || canvas.height!=s.h) {
			Session.set("board_w",s.w);
			Session.set("board_h",s.h);

			setZoom();

			canvas.width=s.w;
			canvas.height=s.h;

			boardRender(false, round)
		}
	}
}

// Sizing

var size = function () {
	var canvas = document.getElementById('board');
	if (canvas) {
		// var rect = canvas.getBoundingClientRect();
		// return {w:window.innerWidth-20 , h:(window.innerHeight-rect.top-20)}
		var rect = $(canvas).parent();
		return { w: rect.width(), h: rect.height() };
	}
	return {w:500,h:500}
}

var boardRender = function (overlay, round) {

	var canvas = document.getElementById('board');

	var s = size();

	if (canvas.width!=s.w || canvas.height!=s.h) {
		canvas.width=s.w;
		canvas.height=s.h;
		Session.set("board_w",s.w);
		Session.set("board_h",s.h);
	}
  var context = canvas.getContext('2d');
	var board = round.board;

	var center={x:canvas.width/2,y:canvas.height/2};
	var zoom=Session.get("zoom");

	context.clearRect ( 0 , 0 , canvas.width , canvas.height );

	if (overlay) {
	  // context.beginPath();
		// context.strokeStyle = "rgba(240, 240, 240, 255)";
		// context.lineWidth = 4;
		// context.moveTo(center.x+minZone*0.5*zoom,center.y+minZone*0.5*zoom);
		// context.lineTo(center.x+minZone*0.5*zoom,center.y-minZone*0.5*zoom);
		// context.lineTo(center.x-minZone*0.5*zoom,center.y-minZone*0.5*zoom);
		// context.lineTo(center.x-minZone*0.5*zoom,center.y+minZone*0.5*zoom);
		// context.lineTo(center.x+minZone*0.5*zoom,center.y+minZone*0.5*zoom);
		// context.stroke();
	}

	var lines=linesToDraw;

	if (lines) {

		lines.rewind();

		lines.forEach(function (line) {
	    context.beginPath();
			context.strokeStyle = line.color;
			context.lineWidth = line.width*zoom;

			var i=0;
			var nb=line.points.length;
			line.points.forEach(function (point) {
				if (i==0) {
					context.moveTo(center.x+point.x*zoom,center.y+point.y*zoom);
				} else {
					context.lineTo(center.x+point.x*zoom,center.y+point.y*zoom);
					if (i<=lineGrow) {
						context.lineWidth = line.width*zoom*i/lineGrow;
						if (i<lineGrow) {
							context.stroke();
							context.beginPath();
							context.moveTo(center.x+point.x*zoom,center.y+point.y*zoom);
						}
					} else {
						if (i>nb-lineGrow) {
							context.lineWidth = line.width*zoom*(nb-i)/lineGrow;
							context.stroke();
							if (i<nb-1) {
								context.beginPath();
								context.moveTo(center.x+point.x*zoom,center.y+point.y*zoom);
							}
						}
					}
				}
				i++;
			});
			context.stroke();
	  });
	}

}



// ZOOM and RESIZE
//

// Set new size of the canvas on browser window resize (or mobile rotation for example)

var setZoom = function () {
	var zoom=1;
	if (Session.get("board_w")<minZone) {
		zoom=Session.get("board_w")/minZone;
	}
	if (Session.get("board_h")<Session.get("board_w")) {
		zoom=Session.get("board_h")/minZone;
	}
	if (zoom<minZoom) zoom=minZoom;
	Session.set("zoom",zoom);
}

// Events
var isTouchSupported = 'ontouchstart' in window;


if (isTouchSupported) {
	Template.board.events({
		"touchstart #board": function (e,tmp) {
			mpTouchStart(e);
		},
		"touchmove #board": function (e,tmp) {
			mpTouchMove(e, tmp);
		},
		"touchend #board": function (e,tmp) {
			mpTouchEnd(e);
		},
	});
} else {
	Template.board.events({
		"mousedown #board": function (e,tmp) {
			mpTouchStart(e);
		},
		"mousemove #board": function (e,tmp) {
			mpTouchMove(e, tmp);
		},
		"mouseup #board": function (e,tmp) {
			mpTouchEnd(e);
		},
	});
}



function convertTouchEvent(e) {
	if (isTouchSupported) {

		if (e.originalEvent.touches[0]) {
			e.insideX=e.originalEvent.touches[0].pageX - (window.scrollX + document.getElementById('board').getBoundingClientRect().left);
			e.insideY=e.originalEvent.touches[0].pageY - (window.scrollY + document.getElementById('board').getBoundingClientRect().top);
		} else {
			e.insideX=e.changedTouches[0].pageX - document.getElementById('board').getBoundingClientRect().left;
			e.insideY=e.changedTouches[0].pageY - document.getElementById('board').getBoundingClientRect().top;
		}
	} else {
		e.insideX=(e.offsetX || e.pageX - document.getElementById('board').getBoundingClientRect().left);
		e.insideY=(e.offsetY || e.pageY - document.getElementById('board').getBoundingClientRect().top);
	}
	e.insideX-=4;
	e.insideY-=4;
}


function mpTouchStart(e) {
	if(Session.get('role') === 'drawer') {
		resizeBoard();
		try { convertTouchEvent(e); } catch (err) {return;}
		previousTouchPosition={x:e.insideX,y:e.insideY};
		e.preventDefault();
	}
}



function mpTouchMove(e, tmp) {
	if(Session.get('role') === 'drawer') {

		try { convertTouchEvent(e); } catch (err) {return;}
		if (previousTouchPosition) {

			var round = tmp.data;
			var board = round.board;

			var canvas = document.getElementById('board');
			var center={x:canvas.width/2,y:canvas.height/2};
			var zoom=Session.get("zoom");

			if (Session.get("line_id")) {
				pushPoint( Session.get("line_id"), (e.insideX-center.x)/zoom, (e.insideY-center.y)/zoom );
			} else {
				Session.set("line_id", insertLine(
					round._id,
					"black",
					6,
					(previousTouchPosition.x-center.x)/zoom, (previousTouchPosition.y-center.y)/zoom, (e.insideX-center.x)/zoom, (e.insideY-center.y)/zoom
				));
				Meteor.call("boardUpdated", round._id, function(error, ret){
						// console.log("boardUpdated error="+error+" ret="+ret);
				});
			}

			previousTouchPosition={x:e.insideX,y:e.insideY};
		}
		e.preventDefault();
	}
}


function mpTouchEnd(e) {
	if(Session.get('role') === 'drawer') {

		// No need of the touch coordinates
		//convertTouchEvent(e);
		//console.log("mpTouchEnd "+e.insideX+","+e.insideY);
		resetLine();
		e.preventDefault();
	}
}

var previousTouchPosition;
resetLine();
function resetLine() {
	previousTouchPosition=false;
	Session.set("line_id",false);
}


var insertLine = function(roundID, color, width, x0, y0, x1, y1) {
	return Lines.insert({ _id:Meteor.uuid() , round_id: roundID , width: width , color: color , points: [ {x:x0 , y:y0} , {x:x1 , y:y1} ] });
}

var pushPoint = function(line_id, x, y) {
	Lines.update({ _id: line_id }, { $push: { points : {x:x,y:y} } });
}

var resizeBoard = function() {
	Session.set("board_w", $('.drawer-canvas').width());
	Session.set("board_h", $('.drawer-canvas').height());
	setZoom();
}
