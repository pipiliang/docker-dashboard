var utils = require('./utils'),
	widgetutils = require('./widget-utils');

var self;

var ContainerBox = function(screen, showbox, docker) {
	if (!(this instanceof ContainerBox))
		return new ContainerBox(screen, showbox);
	self = this;
	this.showbox = showbox;
	this.screen = screen;
	this.docker = docker;
	this.selectId = null;
	this.table = widgetutils.newListTable(showbox, 0, 0, '100%-2', '40%-2', 'Containers');
	this.text = widgetutils.text(showbox, '40%-2', 0, '100%-2', 2, '{bold}✔  Container Stats{bold}');
	this.cpu = widgetutils.newLine({
		top: '40%',
		left: 0
	}, '50%-1', '30%', 'red', '📈  CPU Usage (%)');
	this.mem = widgetutils.newLine({
		top: '40%',
		right: 0
	}, '50%-1', '30%', 'magenta', '📈  Memory Usage (MB)');
	this.net = widgetutils.newLine({
		left: 0,
		bottom: 0
	}, '50%-1', '30%-1', 'white', '📈  Net I/O (B)', true);
	this.log = widgetutils.inspectBox(showbox, 0, 0, '50%-1', '30%-1', '🗒  inspect');

	append(this.cpu, this.mem, this.net);
	initData();
	resize();
	select();
}

var cpuUsage = {
	x: [],
	y: []
}

var memUsage = {
	x: [],
	y: []
}

var rdata = buildData('RX', 'magenta');
var tdata = buildData('TX', 'yellow');

function append() {
	for (var i in arguments) {
		self.showbox.append(arguments[i]);
	}
}

function resize() {
	self.screen.on('resize', function() {
		self.table.emit('attach');
		self.cpu.emit('attach');
		self.mem.emit('attach');
		self.net.emit('attach');
		self.log.emit('attach');
		refreshData();
	});
}

function initData() {
	var data = [
		['Id', 'Name', 'Image', 'IP', 'Ports', 'State']
	];
	self.docker.listContainers({
		all: true
	}, function(err, containers) {

		containers.forEach(containerInfo => {
			data.push(utils.toRow(containerInfo));
		});

		self.table.setData(data);
		render();
	});

	refreshData();
}

function refreshData() {
	self.cpu.setData(cpuUsage);
	self.mem.setData(memUsage);
	self.net.setData([rdata, tdata]);
	render();
}

function buildData(title, color) {
	return {
		title: title,
		style: {
			line: color
		},
		x: [],
		y: []
	}
}

var sm;

function select() {
	self.table.on('select', (item) => {
		var selectId = item.content.substring(0, 8);
		if (self.selectId == selectId) {
			return;
		}

		self.selectId = selectId;
		self.text.setContent('{bold}✔ Container Stats (' + selectId + '){bold}');
		render();
		if (sm != null) {
			sm.emit('end');
			cleanData();
		}

		var selContainer = self.docker.getContainer(selectId);
		selContainer.stats()
			.then(function(s) {
				sm = s;
				var prerxv, pretxv;
				sm.on('data', function(chunk) {
					var stat = JSON.parse(chunk.toString());
					var time = stat.read.substring(12, 19);
					calCPUUsage(stat, time);
					calMemoryUsage(stat, time);

					if (prerxv == null || pretxv == null) {
						calNetData(0, 0, time);
					} else {
						var rxv = (stat.networks.eth0.rx_bytes - prerxv);
						var txv = (stat.networks.eth0.tx_bytes - pretxv);
						calNetData(rxv.toFixed(2), txv.toFixed(2), time);
					}
					refreshData();
					prerxv = stat.networks.eth0.rx_bytes;
					pretxv = stat.networks.eth0.tx_bytes;
				});
			})
			.catch(function(ex) {
				console.log(ex);
			});

		selContainer.inspect()
			.then(function(s) {
				self.log.setContent(JSON.stringify(s, null, 2));
			}).catch(function(ex) {
				console.log(ex);
			});

	});
}

function cleanData() {
	cpuUsage.x.length = 0;
	cpuUsage.y.length = 0;
	memUsage.x.length = 0;
	memUsage.y.length = 0;
	rdata.x.length = 0;
	rdata.y.length = 0;
	tdata.x.length = 0;
	tdata.y.length = 0;
}

function calCPUUsage(stat, xv) {
	var total = stat.cpu_stats.cpu_usage.total_usage - stat.precpu_stats.cpu_usage.total_usage;
	var system = stat.cpu_stats.system_cpu_usage - stat.precpu_stats.system_cpu_usage;
	var num = stat.cpu_stats.cpu_usage.percpu_usage.length;

	if (system > 0.0 && total > 0.0) {
		var percent = (total / system) * num * 100;

		if (cpuUsage.y.length >= 30) {
			cpuUsage.y.shift();
			cpuUsage.x.shift();
		}
		cpuUsage.y.push(percent.toFixed(2));
		cpuUsage.x.push(xv);
	}
}

function calMemoryUsage(stat, xv) {
	var max_usage = stat.memory_stats.max_usage / 1024 / 1024;

	if (memUsage.y.length >= 30) {
		memUsage.y.shift();
		memUsage.x.shift();
	}
	memUsage.y.push(max_usage);
	memUsage.x.push(xv);
}

function calNetData(rxv, txv, time) {
	setXY(rdata, rxv, time);
	setXY(tdata, txv, time);
}

function setXY(data, y, x) {
	if (data.y.length >= 20) {
		data.y.shift();
		data.x.shift();
	}
	data.y.push(y);
	data.x.push(x);
}

function render() {
	self.screen.render();
}

ContainerBox.prototype.show = function() {
	this.table.show();
	//this.table.focus();
	this.text.show();
	this.net.show();
	this.mem.show();
	this.cpu.show();
	this.log.show();
	this.screen.render();
}

ContainerBox.prototype.hide = function() {
	this.table.hide();
	this.text.hide();
	this.net.hide();
	this.mem.hide();
	this.cpu.hide();
	this.log.hide();
	this.screen.render();
}

module.exports = ContainerBox;