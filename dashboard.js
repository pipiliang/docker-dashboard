var Docker = require('dockerode'),
	blessed = require('blessed'),
	contrib = require('blessed-contrib'),
	MemUsage = require('./lib/memusage'),
	CPUsage = require('./lib/cpusage'),
	NetIO = require('./lib/netio'),
	ContainerTable = require('./lib/container-table');

function dashboard() {}

var docker = new Docker({
	socketPath: '/var/run/docker.sock'
});

var screen = blessed.screen({
	smartCSR: true
});

var grid = new contrib.grid({
	rows: 12,
	cols: 12,
	screen: screen
});

var containerTable = new ContainerTable(screen, grid);
var cpu = new CPUsage(screen, grid);
var mem = new MemUsage(screen, grid);
var net = new NetIO(screen, grid);

docker.listContainers({
	all: true
}, function(err, containers) {
	containers.forEach(function(containerInfo) {
		containerTable.draw(containerInfo);
	});
});

docker.getEvents(function(err, stream) {
	stream.on('data', function(chunk) {
		var event = JSON.parse(chunk.toString());
		if (event.Type === undefined || event.Type != 'container') {
			return;
		}

		if (event.Action === 'start' || event.Action === 'stop' || event.Action === 'distory') {
			containerTable.clean();
			docker.listContainers({
				all: true
			}, function(err, containers) {
				containers.forEach(function(containerInfo) {
					containerTable.draw(containerInfo);
				});
			});
		}
	});
});

var preSelContainer;
containerTable.on("select", function(item) {
	var selectId = item.content.substring(0, 8);
	if (preSelContainer != null) {
		if (preSelContainer.id == selectId)
			return;
		preSelContainer.stats({
			stream: false
		}, undefined);
		cpu.clean();
		mem.clean();
		net.clean();
	}

	selContainer = docker.getContainer(selectId);
	preSelContainer = selContainer;
	// if (selContainer.State != 'running')
	// 	return;

	var prerxv, pretxv;
	selContainer.stats(function(err, stream) {
		stream.on('data', function(chunk) {
			var stat = JSON.parse(chunk.toString());
			var time = stat.read.substring(12, 19);

			cpu.draw(stat, time);
			mem.draw(stat, time);

			if (prerxv == null || pretxv == null) {
				net.draw(0, 0, time);
			} else {
				var rxv = (stat.networks.eth0.rx_bytes - prerxv) / 1024;
				var txv = (stat.networks.eth0.tx_bytes - pretxv) / 1024;
				net.draw(rxv, txv, time);
			}
			screen.render();
			prerxv = stat.networks.eth0.rx_bytes;
			pretxv = stat.networks.eth0.tx_bytes;
		});
	});
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
	content: ' Key   | Description\n' +
		'-------------------------------\n' +
		' H     | show help information.\n' +
		' ESC   | hide all popup box.\n' +
		' Up    | scroll up.\n' +
		' Down  | scroll down.\n' +
		' Enter | select a container.\n' +
		' Q     | exit dashboard.',
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

module.exports = dashboard;