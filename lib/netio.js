var contrib = require('blessed-contrib');

var NetIO = function(screen, grid) {
	if (!(this instanceof NetIO))
		return new NetIO(screen, grid);
	this.s = screen;
	this.g = grid;
	var chart = this.g.set(6, 8, 6, 4, contrib.line, {
		style: {
			text: 'green',
			baseline: ['#696969']
		},
		showLegend: true,
		legend: {
			width: 4
		},
		wholeNumbersOnly: false,
		label: 'Net I/O (KB)'
	});
	this.chart = chart;
	this.s.on('resize', function() {
		chart.emit('attach');
	});
}

var rdata = buildData('RX', 'magenta');
var tdata = buildData('TX', 'yellow');


NetIO.prototype.draw = function(ry, ty, x) {
	setData(rdata, ry, x);
	setData(tdata, ty, x);
	this.chart.setData([rdata, tdata]);
}

NetIO.prototype.clean = function() {
	rdata.x.length = 0;
	rdata.y.length = 0;
	tdata.x.length = 0;
	tdata.y.length = 0;
}

function setData(data, y, x) {
	if (data.y.length >= 20) {
		data.y.shift();
		data.x.shift();
	}
	data.y.push(y);
	data.x.push(x);
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

NetIO.prototype.show = function() {
	this.chart.show();
}

NetIO.prototype.hide = function() {
	this.chart.hide();
}

module.exports = NetIO;