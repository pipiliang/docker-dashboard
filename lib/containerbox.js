var Docker = require('dockerode'),
	blessed = require('blessed'),
	contrib = require('blessed-contrib');

var self;

var ContainerBox = function(screen, showbox) {
	if (!(this instanceof ContainerBox))
		return new ContainerBox(screen, showbox);
	self = this;
	this.showbox = showbox;
	this.screen = screen;

	this.table = createLine(0, 'center', '100%-2', '40%', 'red', 'Container List');
	this.cpu = createLine('40%', 0, '50%-1', '30%', 'red', 'CPU Usage (%)');
	this.mem = createLine('40%', '50%', '50%-1', '30%', 'magenta', 'Memory Usage (MB)');
	this.net = createLine('70%', 0, '50%-1', '30%-1', 'white', 'Net I/O (KB)', true);
	this.log = createLine('70%', '50%', '50%-1', '30%-1', 'magenta', 'Log');

	append(this.table, this.cpu, this.mem, this.net, this.log);

	var usage = {
		x: ['1', '2', '3'],
		y: [1, 1, 2]
	}

	this.cpu.setData(usage);

	resize(this.table, this.cpu, this.mem, this.net, this.log);
	// this.screen.on('resize', function() {
	// 	self.showbox.remove(self.cpu)
	// 	self.showbox.append(self.cpu)
	// 	self.cpu.setData(usage);
	// 	self.screen.render();
	// });
}

function createLine(top, left, width, height, color, label, showLegend, legendWidth){
	return new contrib.line({
		top: top,
		left: left,
		width: width,
		height: height,
		style: {
			line: color,
			text: 'green',
			baseline: ['#696969']
		},
		border: {
			type: "line",
			fg: "cyan"
		},
		showNthLabel: 1,
		label: label,
		xLabelPadding: 3,
		showLegend: showLegend || false,
		legend: {
			width: legendWidth || 4
		},
	});
}

function append() {
	for(var i in arguments){
		self.showbox.append(arguments[i]);
    }
}

function resize(){
	self.screen.on('resize', function() {
		for(var i in arguments){
			self.showbox.remove(arguments[i])
			self.showbox.append(arguments[i]);
    	}
		self.screen.render();
	});
}

ContainerBox.prototype.show = function() {
	this.table.show();
	this.net.show();
	this.mem.show();
	this.cpu.show();
	this.log.show();
	this.screen.render();
}

ContainerBox.prototype.hide = function() {
	this.table.hide();
	this.net.hide();
    this.mem.hide();
	this.cpu.hide();
	this.log.hide();
	this.screen.render();
}

module.exports = ContainerBox;