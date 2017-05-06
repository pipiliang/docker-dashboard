var blessed = require('blessed'),
	contrib = require('blessed-contrib');

var AboutBox = function(screen, showbox) {
	if (!(this instanceof AboutBox))
		return new AboutBox(screen, showbox);
	this.showbox = showbox;
	this.aboutBox = blessed.box({
		parent: this.showbox,
		label: ' Help ',
		scrollable: true,
		scrollstep: 1,
		left: 'center',
		top: 'center',
		width: '30%',
		height: '20%',
		align: 'center',
		style: {
			bg: 'black'
		},
		border: {
			type: "line",
			fg: "cyan"
		},
		content: 'Key   | Description            \n' +
			'-------------------------------\n' +
			'H     | show help information. \n' +
			'ESC   | hide all popup box.    \n' +
			'Up    | scroll up.             \n' +
			'Down  | scroll down.           \n' +
			'Enter | select a container.    \n' +
			'Q     | exit dashboard.        ',
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