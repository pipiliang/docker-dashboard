var utils = exports;

utils.toRow = function(info) {
	var row = [];

	row.push(info.Id.substring(0, 8));
	if (info.Names.length > 0) {
		var name = info.Names[0];
		row.push(name.substring(1, name.length));
	} else {
		row.push('-');
	}
	row.push(info.Image);

	if (info.State == 'running') {
		var mode = info.HostConfig.NetworkMode;
		row.push(info.NetworkSettings.Networks[mode == 'default' ? 'bridge' : mode].IPAddress);
		if (info.Ports.length > 0) {
			var port = info.Ports[0];
			row.push(port.PrivatePort + ':' + port.PublicPort);
		} else {
			row.push('-');
		}
		row.push('{bold}{cyan-bg}{white-fg}running{/white-fg}{/cyan-bg}{/bold}');
	} else {
		row.push('-');
		row.push('-');
		row.push('{bold}{red-bg}{white-fg}stopped{/white-fg}{/red-bg}{/bold}');
	}

	return row;
};