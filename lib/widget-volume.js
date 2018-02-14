var moment = require('moment'),
	utils = require('./utils'),
	wu = require('./widget-utils');

var self;

var Volume = function(screen, showbox, docker) {
	if (!(this instanceof Volume))
		return new Volume(screen, showbox, docker);
	self = this;
	this.showbox = showbox;
	this.screen = screen;
	this.docker = docker;
	this.table = wu.newListTable(showbox, 0, 0, '100%-2', '100%-2', '');
	setData();
};

function setData() {
	self.docker.listVolumes((err, result) => {
		var data = [
			['Name', 'Driver', 'Mountpoint']
		];
		result.Volumes.forEach(v => {
			var row = [];
			row.push(v.Name);
			row.push(v.Driver);
			row.push(v.Mountpoint);
			data.push(row);
		});
		self.table.setData(data);
		self.screen.render();
	});
}

Volume.prototype.show = function() {
	setData();
	this.table.show();
	this.screen.render();
};

Volume.prototype.hide = function() {
	this.table.hide();
	this.screen.render();
};

module.exports = Volume;