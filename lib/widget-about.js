var blessed = require('blessed'),
	contrib = require('blessed-contrib');

var AboutBox = function(screen, showbox) {
	if (!(this instanceof AboutBox))
		return new AboutBox(screen, showbox);
	this.showbox = showbox;
	this.aboutBox = blessed.box({
		parent: this.showbox,
		label: ' About docker-dashborad ',
		scrollable: true,
		scrollstep: 1,
		left: 'center',
		top: 'center',
		width: '60%',
		height: 11,
		align: 'left',
		style: {
			bg: 'black'
		},
		border: {
			type: "line",
			fg: "cyan"
		},
		content: 
		    '\n' +
		    ' 🗻  Github  : https://github.com/pipiliang/docker-dashboard\n' +
			' 🐛  Issues  : https://github.com/pipiliang/docker-dashboard/issues\n' +
			' 🔑  Lisence : MIT\n' +
			'    Thanks  : \n' + 
			'              1. blessed \n' + 
			'              2. blessed-contrib \n' +
			'              3. dockerode',
		keys: true,
		mouse: true,
		vi: true,
		alwaysScroll: true,
		scrollbar: {
			ch: ' ',
			inverse: true
		}
	});
	this.screen = screen;
};

AboutBox.prototype.show = function() {
	this.aboutBox.show();
	this.screen.render();
};

AboutBox.prototype.hide = function() {
	this.aboutBox.hide();
	this.screen.render();
};


module.exports = AboutBox;