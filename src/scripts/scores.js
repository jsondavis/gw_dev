(function ($) {
	
	// this is the live scoring app for the widget on the top right
	// live scoring will match as closely as possible the output from the
	// element with the id "framing"
	// different behaviour will likely need to be put in place for the 
	// home page version
	// ***NOTE nwid (nationwide) is now known as web.com tour ***
	// pga / nwid / chmp scoring will come from xml documents on rankings.golfweek.com
	// college / amateur / junior scoring will come from golfstat

	// LiveScore model

	function LiveScore (frame) {
		// frame should be a url to fetch the data from
		// frame is here in case a necessary framing is not in place
		if (frame) {
			this.framing = frame;
		}
		else {
			this.setFrame();
		}
		// other standard initializations if necessary
	}

	LiveScore.prototype = {
		setData: function (scoreData) {
			this.xhrData = scoreData;
		},
		// The possible frames / urls for live score data
		frames: {
			"GW-PGATour": "http://rankings.golfweek.com/fetchurl/assets/pga.xml",
			"GW-WebTour": "http://rankings.golfweek.com/fetchurl/assets/nwid.xml",
			"GW-ChampTour": "http://rankings.golfweek.com/fetchurl/assets/chmp.xml"
		},
		// set the Framing for the score fetch
		setFrame: function () {
			var scope = this;
			var elem = document.getElementById('live_scores');
			var frame = elem.getAttribute('framing');
			scope.framing = scope.frames[frame];
		},
		// Load will fetch the data from the score xml
		load: function () {
			var scope = this;
			scope.players = [];
			$.ajax({
				type: "GET",
				// real data
				// url: scope.framing,
				// test data
				url:'./pga1.xml',
				dataType: 'xml'
				}).success(function (scoreData) {
					scope.setData(scoreData);

					console.log("%c\n\n*****Jason check the player data when a tournament is live!*****\n\n\n\n", 'color:green');
					// ** TODO **
					// Put rankings in when no tours are available

					var players = $(scoreData).find('Player');
					for (var i = players.length - 1; i >= 0; i--) {
						player = {};
						player.playerName = $(players[i]).attr('FInit') + ". " + $(players[i]).attr('Lname');
						player.currentPos = $(players[i]).attr('CurPos');
						player.currentPar = $(players[i]).attr('CurParRel');
						player.tournPar = $(players[i]).attr('TournParRel');
						player.thru = $(players[i]).attr('Thru');
						scope.players.push(player);
						// put the scores on the page if this is the last element
						if (i === 1) scope.putScores();
					};
			});
		},
		scoreDiv: function (player) { 

			var	str ='<div class="live_score_row">' + 
						'<div class="position">' + player.currentPos + '</div>' +
						'<div class="player">' + player.playerName + '</div>' +
						'<div class="currentPar">' + player.currentPar + '</div>' +
						'<div class="tournPar">' + player.tournPar + '</div>' +
						'<div class="thru">' + player.thru + '</div>' +
					  '</div>';
			return str;
		},

		putScores: function () {
			var players = this.players;
			var retString = '';
			for (var i = players.length - 1; i >= 0; i--) {
				retString += this.scoreDiv(players[i]) + "\n";
			};

			var elem = document.getElementById('livescores');
			elem.innerHTML = retString;
		}

	}

	
	var thed = new LiveScore();
	thed.load();

})(jQuery);