var blessed = require('blessed'),
	contrib = require('blessed-contrib');

var screen = blessed.screen({
	smartCSR: true
});

screen.key(['q', 'C-c'], function(ch, key) {
	return process.exit(0);
});

var helperBox = blessed.box({
	parent: screen,
	scrollable: true,
	scrollstep: 1,
	left: 'center',
	top: 'center',
	width: '30%',
	height: '30%',
	style: {
		bg: 'black'
	},
	border: 'line',
	content: ' hello world...',
	keys: true,
	mouse: true,
	vi: true,
	alwaysScroll: true,
	scrollbar: {
		ch: ' ',
		inverse: true
	}
});

helperBox.hide();

screen.key(['h'], function(ch, key) {
	helperBox.show();
	screen.render();
});

screen.key(['escape'], function(ch, key) {
	helperBox.hide();
	screen.render();
});

screen.render();