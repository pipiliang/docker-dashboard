var Docker = require('dockerode'),
	blessed = require('blessed'),
	contrib = require('blessed-contrib'),
	About = require('./lib/widget-about'),
	Container = require('./lib/widget-container'),
	Image = require('./lib/widget-images'),
	Network = require('./lib/widget-network'),
	Volume = require('./lib/widget-volume'),
	Home = require('./lib/widget-home');

function dashboard() {}

var screen = blessed.screen({
	smartCSR: true,
	fullUnicode: true,
	autoPadding: 'auto',
	title: '🐳 Docker Dashboard'
});

var docker = new Docker({
	socketPath: '/var/run/docker.sock'
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
		'📑️ Images': {
			keys: ['i'],
			callback: function() {
				showImages();
				screen.render();
			}
		},
		'🕸  Networks': {
			keys: ['n'],
			callback: function() {
				showNetwork();
				screen.render();
			}
		},
		'📔 Volumes': {
			keys: ['v'],
			callback: function() {
				showVolume();
				screen.render();
			}
		},
		'️🦍 About': {
			keys: ['a'],
			callback: function() {
				showAbout();
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
	left: 0,
	top: 2,
	width: '100%',
	height: 'shrink',
	border: {
		type: "line",
		fg: "white"
	},
	alwaysScroll: false,
	scrollbar: {
		ch: ' ',
		inverse: true
	}
});
screen.append(showBox);

var about, container, image, network, volume, nodeInfo = new Home(screen, showBox, docker);

function showNodeInfo() {
	hide(container, about, image, network, volume);

	if (nodeInfo != null)
		nodeInfo.show();
}

function showContainers() {
	hide(about, nodeInfo, image, network, volume);

	if (container == null)
		container = new Container(screen, showBox, docker);
	else
		container.show();
}

function showImages() {
	hide(about, nodeInfo, container, network, volume);

	if (image == null)
		image = new Image(screen, showBox, docker);
	else
		image.show();
}

function showNetwork() {
	hide(about, nodeInfo, container, image, volume);

	if (network == null)
		network = new Network(screen, showBox, docker);
	else
		network.show();
}

function showVolume() {
	hide(about, nodeInfo, container, image, network);

	if (volume == null)
		volume = new Volume(screen, showBox, docker);
	else
		volume.show();
}

function showAbout() {
	hide(container, nodeInfo, image, network, volume);

	if (about == null)
		about = new About(screen, showBox);
	else
		about.show();
}

function hide() {
	for (var i in arguments) {
		var each = arguments[i];
		if (each != null)
			each.hide();
	}
}

screen.key(['q', 'C-c'], function(ch, key) {
	return process.exit(0);
});

screen.render();

module.exports = dashboard;