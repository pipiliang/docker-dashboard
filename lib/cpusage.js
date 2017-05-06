var contrib = require('blessed-contrib');

var CPUsage = function(screen, grid) {
	if (!(this instanceof CPUsage))
		return new CPUsage(screen, grid);
	this.s = screen;
	this.g = grid;
	var chart = this.g.set(6, 0, 6, 4, contrib.line, {
		style: {
			line: 'red',
			text: 'green',
			baseline: ['#696969']
		},
		showNthLabel: 1,
		showLegend: false,
		wholeNumbersOnly: false,
		label: 'CPU Usage (%)'
	});
	this.chart = chart;
	this.s.on('resize', function() {
		chart.emit('attach');
	});
}

var usage = {
	x: [],
	y: []
}

CPUsage.prototype.draw = function(stat, xv) {
	var total = stat.cpu_stats.cpu_usage.total_usage - stat.precpu_stats.cpu_usage.total_usage;
	var system = stat.cpu_stats.system_cpu_usage - stat.precpu_stats.system_cpu_usage;
	var num = stat.cpu_stats.cpu_usage.percpu_usage.length;

	if (system > 0.0 && total > 0.0) {
		var percent = (total / system) * num * 100;

		if (usage.y.length >= 30) {
			usage.y.shift();
			usage.x.shift();
		}
		usage.y.push(percent.toFixed(2));
		usage.x.push(xv);

		this.chart.setData(usage);
	}
}

CPUsage.prototype.clean = function() {
	usage.x.length = 0;
	usage.y.length = 0;
}

CPUsage.prototype.show = function() {
	this.chart.show();
}

CPUsage.prototype.hide = function() {
	this.chart.hide();
}

module.exports = CPUsage;