var Docker = require('dockerode'),
	blessed = require('blessed'),
	contrib = require('blessed-contrib'),
	aboutbox = require('./lib/aboutbox'),
	containerbox = require('./lib/containerbox');

var screen = blessed.screen({
	smartCSR: true,
	fullUnicode: true,
	padding: 'auto'
});

var bar = blessed.listbar({
	parent: screen,
	top: 0,
	left: 0,
	right: 0,
	height: 'shrink',
	mouse: true,
	keys: true,
	autoCommandKeys: true,
	border: 'line',
	vi: true,
	style: {
		bg: 'black',
		item: {
			bg: 'yellow',
			fg: 'black',
			hover: {
				bg: 'blue'
			}
		},
		selected: {
			bg: 'blue'
		}
	},
	commands: {
		'📈 Dashboard': {
			keys: ['d'],
			callback: function() {
				showNodeInfo();
				screen.render();
			}
		},
		'📦 Containers': {
			keys: ['c'],
			callback: function() {
				showContainers();
				screen.render();
			}
		},
		'Images': {
			keys: ['i'],
			callback: function() {
				screen.render();
			}
		},
		'Networks': {
			keys: ['n'],
			callback: function() {
				screen.render();
			}
		},
		'💾 Volumes': {
			keys: ['v'],
			callback: function() {
				screen.render();
			}
		},
		'🔔 Events': {
			keys: ['e'],
			callback: function() {
				screen.render();
			}
		},
		'Docker': {
			keys: ['o'],
			callback: function() {
				screen.render();
			}
		},
		'👦 About': {
			keys: ['a'],
			callback: function() {
				showHelp();
				screen.render();
			}
		}
	}
});

screen.append(bar);
bar.focus();

var showBox = blessed.box({
	parent: screen,
	align: 'center',
	scrollable: true,
	scrollstep: 1,
	padding: {
		// top: 1,
		// left: 1,
		right: -1,
		bottom: -1
	},
	left: 0,
	top: 2,
	width: '100%',
	height: 'shrink',
	style: {
		bg: 'black'
	},
	border: {
		type: "line",
		fg: "white"
	},
	alwaysScroll: true,
	scrollbar: {
		ch: ' ',
		inverse: true
	}
});
screen.append(showBox);

var aboutBox, containerBox;

function showNodeInfo() {
	if (containerBox != null)
		containerBox.hide();

	if (aboutBox != null)
		aboutBox.hide();
}

function showContainers() {
	if (aboutBox != null)
		aboutBox.hide();

	if (containerBox == null)
		containerBox = new containerbox(screen, showBox);
	else
		containerBox.show();
}

function showHelp() {
	if (containerBox != null)
		containerBox.hide();

	if (aboutBox == null)
		aboutBox = new aboutbox(screen, showBox);
	else
		aboutBox.show();
}

screen.key(['q', 'C-c'], function(ch, key) {
	return process.exit(0);
});

screen.render();