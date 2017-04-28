var contrib = require('blessed-contrib');


var MemUsage = function(screen, grid) {
	if (!(this instanceof MemUsage))
		return new MemUsage(screen, grid);
	this.s = screen;
	this.g = grid;
	var chart = this.g.set(6, 4, 6, 4, contrib.line, {
		showNthLabel: 1,
		label: 'Memory Usage (MB)',
		xLabelPadding: 3,
		showLegend: false
	});

	this.chart = chart;
	this.s.on('resize', function() {
		chart.emit('attach');
	});
}

var usage = {
	style: {
		line: 'white'
	},
	x: [],
	y: []
}

MemUsage.prototype.draw = function(stat, xv) {
	var max_usage = stat.memory_stats.max_usage / 1024 / 1024;

	if (usage.y.length >= 30) {
		usage.y.shift();
		usage.x.shift();
	}
	usage.y.push(max_usage);
	usage.x.push(xv);
	
	this.chart.setData(usage);
}

MemUsage.prototype.clean = function() {
	usage.x.length = 0;
	usage.y.length = 0;
}

module.exports = MemUsage;