var blessed = require('blessed'),
	contrib = require('blessed-contrib');

var widgetutils = exports;

widgetutils.newLine = function(opts, width, height, color, label, showLegend, legendWidth) {
	return new contrib.line({
		top: opts.top,
		left: opts.left,
		right: opts.right,
		bottom: opts.bottom,
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
		label: ' ' + label + ' ',
		xLabelPadding: 3,
		showLegend: showLegend || false,
		legend: {
			width: legendWidth || 4
		},
	});
}

widgetutils.text = function(p, t, l, w, h, c) {
	return blessed.text({
		parent: p,
		top: t,
		left: l,
		tags: true,
		keys: true,
		width: w,
		height: h,
		content: c
	});
}


widgetutils.newListTable = (p, t, l, w, h, label) => {
	return blessed.listtable({
		parent: p,
		top: t,
		left: l,
		border: 'line',
		align: 'left',
		tags: true,
		keys: true,
		width: w,
		height: h,
		vi: true,
		mouse: true,
		style: {
			fg: 'white',
			header: {
				fg: 'blue',
				bold: true
			},
			border: {
				fg: 'black'
			},
			cell: {
				fg: 'magenta',
				selected: {
					bg: 'blue'
				}
			}
		},
		label: label
	});
}

widgetutils.inspectBox = function(p, r, b, w, h, label) {
	return blessed.box({
		parent: p,
		label: label,
		scrollable: true,
		scrollstep: 1,
		right: r,
		bottom: b,
		width: w,
		height: h,
		align: 'left',
		style: {
			fg: 'blue'
		},
		border: {
			type: "line",
			fg: "cyan"
		},
		content: '',
		keys: true,
		mouse: true,
		vi: true,
		alwaysScroll: true,
		scrollbar: {
			ch: ' ',
			inverse: true
		}
	});
}