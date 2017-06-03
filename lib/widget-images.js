var moment = require('moment'),
	utils = require('./utils'),
	wu = require('./widget-utils');

var self;

var Image = function(screen, showbox, docker) {
	if (!(this instanceof Image))
		return new Image(screen, showbox, docker);
	self = this;
	this.showbox = showbox;
	this.screen = screen;
	this.docker = docker;
	this.nodeTable = wu.newListTable(showbox, 0, 0, '100%-2', 'shrink', '');
	setData();
}

function setData() {
	self.docker.listImages((err, images) => {
		var nodeInfo = [
			['Id', 'Tags', 'Size', 'Created']
		];
		images.forEach(s => {
			var row = [];
			row.push(s.Id);
			row.push(s.RepoTags[0].toString());
			row.push((s.Size / 1000 / 1000).toFixed(2) + 'MB');
			row.push(moment(new Date(s.Created)).format('YYYY-MM-DD HH:mm:ss'));
			nodeInfo.push(row);
		})
		self.nodeTable.setData(nodeInfo);
		self.screen.render();
	})
}

Image.prototype.show = function() {
	setData();
	this.nodeTable.show();
	this.screen.render();
}

Image.prototype.hide = function() {
	this.nodeTable.hide();
	this.screen.render();
}

module.exports = Image;