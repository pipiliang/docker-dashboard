var moment = require('moment'),
	utils = require('./utils'),
	wu = require('./widget-utils');

var self;

var Network = function(screen, showbox, docker) {
	if (!(this instanceof Network))
		return new Network(screen, showbox, docker);
	self = this;
	this.showbox = showbox;
	this.screen = screen;
	this.docker = docker;
	this.netTable = wu.newListTable(showbox, 0, 0, '100%-2', 'shrink', '');
	setData();
};

function setData() {
	self.docker.listNetworks((err, networks) => {
		var netInfo = [
			['Name', 'Id', 'Scope', 'Driver', 'IPAM Driver', 'IPAM Subnet', 'IPAM Gateway']
		];
		networks.forEach(n => {
			var row = [];
			row.push(n.Name);
			row.push(n.Id);
			row.push(n.Scope);
			row.push(n.Driver);
			if (n.IPAM != null) {
				row.push(n.IPAM.Driver);
				if (n.IPAM.Config.length > 0) {
					var c = n.IPAM.Config[0];
					row.push(c.Subnet == null ? '-' : c.Subnet);
					row.push(c.Gateway == null ? '-' : c.Gateway);
				} else {
					row.push('-');
					row.push('-');
				}
			} else {
				row.push('-');
				row.push('-');
				row.push('-');
			}
			netInfo.push(row);
		});
		self.netTable.setData(netInfo);
		self.screen.render();
	});
}

Network.prototype.show = function() {
	setData();
	this.netTable.show();
	this.screen.render();
};

Network.prototype.hide = function() {
	this.netTable.hide();
	this.screen.render();
};

module.exports = Network;