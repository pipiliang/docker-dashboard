## Docker Dashboard [![npm version](https://badge.fury.io/js/docker-dashboard.png)](https://www.npmjs.com/package/docker-dashboard)
:computer::chart_with_upwards_trend:Console based docker dashboard, base on [blessed-contrib](https://github.com/yaronn/blessed-contrib) and [blessed](https://github.com/chjj/blessed).

![](https://raw.githubusercontent.com/pipiliang/docker-dashboard/master/screenshot/home.PNG)
![](https://raw.githubusercontent.com/pipiliang/docker-dashboard/master/screenshot/containers.PNG)

## Install

```
$ npm install -g docker-dashboard
```
>Note: need to install the docker before use, and only support `unix socket`.

In the following environment test passed:
|OS|Docker|
|----|----|
|Ubuntu 16.04 LTS|1.12.6  Api 1.24 |
Other platforms and versions are not guaranteed.

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

## Todo List

- [ ] operate container: start / stop / restart / rm and other
- [ ] refresh container list
- [ ] images import and export
- [ ] network connect and disconnect

## Thanks
- [blessed-contrib](https://github.com/yaronn/blessed-contrib)
- [blessed](https://github.com/chjj/blessed)
- [dockerode](https://github.com/apocas/dockerode)

## License
**MIT** License
