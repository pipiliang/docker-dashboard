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
	this.nodeTable = wu.newListTable(showbox, 0, 0, '100%-2', '50%', 'Images');
	this.text = wu.text(showbox, '50%', 0, 24, 2, '{bold}✔  Image Information {bold}');
	this.line = wu.line(showbox, '50%', 24, '100%-27');
	this.importButton = wu.button(showbox, '50%+2', '100%-15', 10, 1, 'Import');
	this.exportButton = wu.button(showbox, '50%+4', '100%-15', 10, 1, 'Export');
	this.removeButton = wu.button(showbox, '50%+6', '100%-15', 10, 1, 'Remove');
    this.inspectBox = wu.box(showbox, 16, 0, '100%-18', '50%-3', '', 'line', 'black');
	setData();
	select();
};

function setData() {
	self.docker.listImages((err, images) => {
		let nodeInfo = [
			['Id', 'Repository', 'Tag', 'Size', 'Created']
		];
		images.forEach(s => {
			var row = [];
			row.push(getId(s.Id));
			var repoTag = getRepoTag(s.RepoTags);
			row.push(repoTag.repo);
			row.push(repoTag.tag);
			row.push((s.Size / 1000 / 1000).toFixed(2) + 'MB');
			row.push(moment(new Date(s.Created * 1000), 'YYYYMMDD').fromNow());
			nodeInfo.push(row);
		});
		self.nodeTable.setData(nodeInfo);
		self.screen.render();
	});
}

function getId(id) {
	if (!id)
		return '-';
	let index = id.indexOf(':');
	if (index >= 0) {
		return id.substring(index + 1, index + 13);
	}
	return id.substring(0, 12);
}

function getRepoTag(repoTags) {
	let repo = {
		repo: '',
		tag: ''
	};
	if (repoTags && repoTags.length && repoTags.length > 0) {
		let tmp = repoTags[0].toString();
		let index = tmp.lastIndexOf(':');
		if (index >= 0) {
			repo.repo = tmp.substring(0, index);
			repo.tag = tmp.substring(index + 1, tmp.length);
		} else {
			repo.repo = tmp;
		}

	}
	return repo;
}

function select() {
	self.nodeTable.on('select', function (item) {
		var selectId = item.content.substring(0, 12);
		self.text.setContent('{bold}✔  Image (' + selectId + ') {bold}');
		self.screen.render();
	});
}

Image.prototype.show = function() {
	setData();
	this.nodeTable.show();
	this.line.show();
	this.text.show();
	this.importButton.show();
	this.exportButton.show();
	this.removeButton.show();
    this.inspectBox.show();
	this.screen.render();
};

Image.prototype.hide = function() {
	this.nodeTable.hide();
	this.line.hide();
	this.text.hide();
	this.importButton.hide();
	this.exportButton.hide();
	this.removeButton.hide();
    this.inspectBox.hide();
	this.screen.render();
};

module.exports = Image;