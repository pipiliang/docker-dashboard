var utils = require('./utils'),
	wu = require('./widget-utils'),
	os = require('os');

var self;

var Home = function(screen, showbox, docker) {
	if (!(this instanceof Home))
		return new Home(screen, showbox, docker);
	self = this;
	this.showbox = showbox;
	this.screen = screen;
	this.docker = docker;
	this.table = wu.newListTable(showbox, 0, 0, '100%-2', '100%-2', ' ');
	initData();
}

function convertLengthToString(param) {
    return (param && param.length) ? param.length.toString() : 0;
}

function initData() {
	var data = [
		[title('💻  Node Info'), ''],
		[blue('Name'), os.hostname()],
		[blue('OS'), os.platform() + '-' + os.arch()],
		[blue('Release'), os.release()],
	        [blue('CPU'), convertLengthToString(os.cpus())],
		[blue('Memory'), (os.totalmem() / 1000 / 1000 / 1000).toFixed(1) + 'GB'],
		[blue('Up time'), (os.uptime() / 60 / 60).toFixed(0) + ' Hours']
	];
	var tmp = {};

	self.docker.version()
		.then(function(r) {
			data.push(['', '']);
			data.push([title('🐳  Docker Info'), '']);
			data.push([blue('Docker version'), r.Version]);
			data.push([blue('Docker api version'), r.ApiVersion]);
			data.push([blue('Go version'), r.GoVersion]);
			data.push([blue('Build'), r.GitCommit]);
			data.push([blue('Build time'), r.BuildTime]);
			data.push([blue('Experimental'), r.Experimental]);

			return self.docker.info();
		}).then(function(i) {
			data.push(['', '']);
			var isSwarm = i.Swarm.LocalNodeState === 'active';
			data.push([title('◻  Swarm Info'), '']);
			if (isSwarm) {
				data.push([blue('(This node is part of a Swarm cluster)'), '']);
			};
			data.push([blue('Node role'), isSwarm ? role(i.Swarm) : '-']);
			data.push([blue('Node id'), isSwarm ? i.Swarm.NodeID : '-']);
			data.push([blue('Nodes in the cluster'), isSwarm ? i.Swarm.Nodes.toString() : '-']);
			data.push([blue('Managers in the cluster'), isSwarm ? i.Swarm.Managers.toString() : '-']);

			data.push(['', '']);
			data.push([title('📦  Containers'), '']);
			data.push([blue('Containers'), i.Containers.toString()]);
			data.push([blue('Running'), cyan(i.ContainersRunning.toString())]);
			data.push([blue('Stopped'), red(i.ContainersStopped.toString())]);
			data.push([blue('Paused'), yellow(i.ContainersPaused.toString())]);
			tmp.Driver = i.Driver;

			return self.docker.listImages();
		}).then(function(images) {
			data.push(['', '']);
			data.push([title('🏻  Images'), '']);
		        data.push([blue('Images'), convertLengthToString(images)]);
			data.push([blue('Size'), sizeOf(images) + ' GB']);

			return self.docker.listNetworks();
		}).then(function(nets) {
			data.push(['', '']);
			data.push([title('🕸  Networks'), '']);
		        data.push([blue('Networks'), convertLengthToString(nets)]);

			return self.docker.listVolumes();
		}).then(function(vols) {
			data.push(['', '']);
			data.push([title('📔  Volumes'), '']);
		        data.push([blue('Volumes'), convertLengthToString(vols.Volumes)]);
			data.push([blue('Driver'), tmp.Driver]);

		}).then(function() {
			self.table.setData(data);
		}).catch(function(ex) {
			console.log(ex);
		});
}

function role(swarm) {
	var localId = swarm.NodeID;
	var isLeader = false;
	swarm.RemoteManagers.forEach(rm => {
		if (rm.NodeID == localId) {
			isLeader = true;
		}
	});
	return isLeader ? 'Leader' : 'Follower';
}

function title(str) {
	return '{bold}{white-fg}' + str + '{/white-fg}{/bold}'
}

function blue(str) {
	return '{blue-fg}' + str + '{/blue-fg}'
}


function red(str) {
	return '{red-fg}' + str + '{/red-fg}'
}

function cyan(str) {
	return '{cyan-fg}' + str + '{/cyan-fg}'
}

function yellow(str) {
	return '{yellow-fg}' + str + '{/yellow-fg}'
}

function sizeOf(images) {
	var size = 0;
	images.forEach(s => {
		size = size + s.Size / 1000 / 1000;
	})
	return (size / 1000).toFixed(2);
}

function append() {
	for (var i in arguments) {
		self.showbox.append(arguments[i]);
	}
}

Home.prototype.show = function() {
	initData();
	this.table.show();
	this.screen.render();
}

Home.prototype.hide = function() {
	this.table.hide();
	this.screen.render();
}

module.exports = Home;
