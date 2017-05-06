var table = require('./widget/table');

var ContainerTable = function(screen, grid) {
	if (!(this instanceof ContainerTable))
		return new ContainerTable(screen, grid);
	this.s = screen;
	this.g = grid;
	this.table = this.g.set(0, 0, 6, 12, table, {
		keys: true,
		fg: 'green',
		label: 'Container List (press H for help)',
		columnSpacing: 1,
		align: 'center',
		columnWidth: [10, 25, 50, 30, 30, 70]
	});
	this.table.focus();
}

var data = [];

ContainerTable.prototype.draw = function(containerInfo) {

	var row = [];

	row.push(containerInfo.Id.substring(0, 8));
	if (containerInfo.Names.length > 0) {
		row.push(containerInfo.Names[0]);
	} else {
		row.push('');
	}

	row.push(containerInfo.Image);
	row.push('-');

	if (containerInfo.Ports.length > 0) {
		var port = containerInfo.Ports[0];
		row.push(port.PrivatePort + '->' + port.PublicPort);
	} else {
		row.push('-');
	}

	if (containerInfo.State == 'exited') {
		row.push('{bold}{red-bg}{white-fg} stopped  {/white-fg}{/red-bg}{/bold}');
	} else if (containerInfo.State == 'running') {
		row.push('{bold}{cyan-bg}{white-fg} running  {/white-fg}{/cyan-bg}{/bold}');
	} else {
		row.push('{bold}{yellow-bg}{white-fg}' + containerInfo.State + '{/white-fg}{/yellow-bg}{/bold}');
	}

	data.push(row);

	this.table.setData({
		headers: ['Id', 'Name', 'Image', 'IP', 'Ports', 'State'],
		data: data
	});

	this.s.render();
}

ContainerTable.prototype.clean = function() {
	data.length = 0;
	this.table.setData({
		headers: ['Id', 'Name', 'Image', 'IP', 'Ports', 'State'],
		data: data
	});
	this.s.render();
}

ContainerTable.prototype.refresh = function(event, container) {
	if (event.Action === 'start'){

	}

	this.table.setData({
		headers: ['Id', 'Name', 'Image', 'IP', 'Ports', 'State'],
		data: data
	});
	this.s.render();
}

ContainerTable.prototype.on = function(e, callback) {
	this.table.rows.on(e, callback);
}

ContainerTable.prototype.show = function() {
	this.table.show();
}

ContainerTable.prototype.hide = function() {
	this.table.hide();
}

ContainerTable.prototype.getRow = function(item) {
	return this.table.rows.getItemIndex(item);
}

module.exports = ContainerTable;