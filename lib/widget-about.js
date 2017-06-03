var blessed = require('blessed'),
	contrib = require('blessed-contrib');

var AboutBox = function(screen, showbox) {
	if (!(this instanceof AboutBox))
		return new AboutBox(screen, showbox);
	this.showbox = showbox;
	this.aboutBox = blessed.box({
		parent: this.showbox,
		label: ' Github ',
		scrollable: true,
		scrollstep: 1,
		left: 'center',
		top: 'center',
		width: '60%',
		height: '20%',
		align: 'left',
		style: {
			bg: 'black'
		},
		border: {
			type: "line",
			fg: "cyan"
		},
		content: 
			' Github  : https://github.com/pipiliang/docker-dashboard\n' +
			' Bugs    : https://github.com/pipiliang/docker-dashboard/issues\n' +
			' Lisence : MIT',
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
}

AboutBox.prototype.show = function() {
	this.aboutBox.show();
	this.screen.render();
}

AboutBox.prototype.hide = function() {
	this.aboutBox.hide();
	this.screen.render();
}


module.exports = AboutBox;