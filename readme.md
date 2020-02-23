## Docker Dashboard [![npm version](https://badge.fury.io/js/docker-dashboard.svg)](https://www.npmjs.com/package/docker-dashboard) [![Build Status](https://travis-ci.org/pipiliang/docker-dashboard.svg?branch=master)](https://travis-ci.org/pipiliang/docker-dashboard)

:computer::chart_with_upwards_trend:Console based docker dashboard, base on [blessed](https://github.com/chjj/blessed) and [blessed-contrib](https://github.com/yaronn/blessed-contrib).

![](https://raw.githubusercontent.com/pipiliang/docker-dashboard/master/screenshot/containers.PNG)

## Install (No longer maintain)

```
$ npm install -g docker-dashboard
```
>Note: need to install the docker before use, and only support `unix socket`.

In the following environment test passed:

|OS|Docker|
|----|----|
|Ubuntu 16.04 LTS|1.12.6|

* Other platforms and versions are not guaranteed. *

## Usage

```
$ docker-dashboard
```

### Shortcut
|shortcut|description|
|----|----|
|`D`| show node info, warm info and others.|
|`C`| show container list.|
|`I`| show image list.|
|`N`| show network list.|
|`V`| show volume list.|
|`A`| about.|
|`↑`| scroll up.|
|`↓`| scroll down.|
|`Enter`| select a container and show statistics.|
|`Q`| exit dashboard.|

> Support operation with mouse.

## Todo

- [ ] auto refresh container list

## Thanks
- [blessed-contrib](https://github.com/yaronn/blessed-contrib)
- [blessed](https://github.com/chjj/blessed)
- [dockerode](https://github.com/apocas/dockerode)

## License
[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/pipiliang/made/blob/master/LICENSE)
