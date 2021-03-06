import {clone, deepMix, isString, mix} from '@antv/util';
import {guid2} from "../../utils/utils";

class Command {
    
    constructor() {
        this._cfgs = this.getDefaultCfg();
        this.list = [];
        this.queue = [];
    }
    
    getDefaultCfg() {
        return {_command: {zoomDelta: .1, queue: [], current: 0, clipboard: []}};
    }
    
    get(key) {
        return this._cfgs[key];
    }
    
    set(key, val) {
        this._cfgs[key] = val;
    }
    
    initPlugin(graph) {
        this.initCommands();
        graph.getCommands = () => {
            return this.get('_command').queue
        };
        graph.getCurrentCommand = () => {
            const c = this.get('_command');
            return c.queue[c.current - 1]
        };
        graph.executeCommand = (name, cfg) => {
            this.execute(name, graph, cfg)
        };
        graph.commandEnable = (name) => {
            return this.enable(name, graph)
        };
    }
    
    registerCommand(name, cfg,) {
        if (this[name]) {
            mix(this[name], cfg);
        } else {
            const cmd = mix({}, {
                name: name,
                shortcutCodes: [],
                queue: true,
                executeTimes: 1,
                init() {
                },
                enable() {
                    return true
                },
                execute(graph) {
                    this.snapShot = graph.save();
                    this.selectedItems = graph.get('selectedItems');
                    this.method && (isString(this.method) ? graph[this.method]() : this.method(graph));
                },
                back(graph) {
                    graph.changeData(this.snapShot);
                   // graph.refresh();
                    graph.set('selectedItems', this.selectedItems);
                }
            }, cfg);
            this[name] = cmd;
            this.list.push(cmd);
        }
    }
    
    execute(name, graph, cfg) {
        const cmd = mix({}, this[name], cfg);
        const manager = this.get('_command');
        if (cmd.enable(graph)) {
            cmd.init();
            if (cmd.queue) {
                manager.queue.splice(manager.current, manager.queue.length - manager.current, cmd);
                manager.current++;
            }
        }
        graph.emit('beforecommandexecute', {command: cmd});
        cmd.execute(graph);
        graph.emit('aftercommandexecute', {command: cmd});
        return cmd;
    }
    
    enable(name, graph) {
        return this[name].enable(graph);
    }
    
    destroyPlugin() {
        this._events = null;
        this._cfgs = {};
        this.list = [];
        this.queue = [];
        this.destroyed = true;
    }
    
    initCommands() {
        const cmdPlugin = this;
        cmdPlugin.registerCommand('add', {
            enable: function () {
                return this.type && this.addModel;
            },
            execute: function (graph) {
                const item = graph.add(this.type, this.addModel);
                if (this.executeTimes === 1)
                    this.addId = item.get('id');
            },
            back: function (graph) {
                graph.remove(this.addId);
            },
        });
        cmdPlugin.registerCommand('update', {
            enable: function () {
                return this.itemId && this.updateModel;
            },
            execute: function (graph) {
                const item = graph.findById(this.itemId);
                if (item) {
                    if (!this.originModel && this.executeTimes === 1) {
                        this.originModel = deepMix({}, item.getModel());
                    }
                    graph.updateItem(item, this.updateModel);
                }
            },
            back: function (graph) {
                const item = graph.findById(this.itemId);
                if (item) {
                    for (let key in item.getModel().style) {
                        if (item.getModel().style[key] && !this.originModel.style[key]) {
                            if (item.get('shapeFactory')[item.getModel().type].options.style[key]) {
                                item.getModel().style[key] = item.get('shapeFactory')[item.getModel().type].options.style[key]
                            }
                        }
                    }
                    graph.update(item, this.originModel);
                }
            },
        });
        cmdPlugin.registerCommand('delete', {
            enable: function (graph) {
                const mode = graph.getCurrentMode();
                const selectedItems = graph.get('selectedItems');
                return mode === 'edit' && selectedItems && selectedItems.length > 0;
            },
            method: function (graph) {
                const selectedItems = graph.get('selectedItems');
                graph.emit('beforedelete', {items: selectedItems});
                if (selectedItems && selectedItems.length > 0) {
                    selectedItems.forEach(i => {
                        const node = graph.findById(i);
                        if (node) {
                            graph.remove(i);
                        }
                    });
                }
                graph.emit('afterdelete', {items: selectedItems});
                graph.set('selectedItems', [])
            },
            shortcutCodes: ['Delete'],
        });
        cmdPlugin.registerCommand('redo', {
            queue: false,
            enable: function (graph) {
                const mode = graph.getCurrentMode();
                const manager = cmdPlugin.get('_command');
                return mode === 'edit' && manager.current < manager.queue.length;
            },
            execute: function (graph) {
                const manager = cmdPlugin.get('_command');
                const cmd = manager.queue[manager.current];
                cmd && cmd.execute(graph);
                manager.current++;
                let cmdNext = manager.queue[manager.current]
                if (cmdNext && cmdNext.selectedItems && cmdNext.selectedItems.length > 0) {
                    graph.set('selectedItems', manager.queue[manager.current].selectedItems)
                }
            },
            shortcutCodes: [['metaKey', 'shiftKey', 'z'], ['ctrlKey', 'shiftKey', 'z']],
        });
        cmdPlugin.registerCommand('undo', {
            queue: false,
            enable: function (graph) {
                const mode = graph.getCurrentMode();
                return mode === 'edit' && cmdPlugin.get('_command').current > 0;
            },
            execute: function (graph) {
                const manager = cmdPlugin.get('_command');
                const cmd = manager.queue[manager.current - 1];
                if (cmd) {
                    cmd.executeTimes++;
                    cmd.back(graph);
                }
                manager.current--;
                //graph.set('selectedItems', [])
            },
            shortcutCodes: [['metaKey', 'z'], ['ctrlKey', 'z']],
        });
        cmdPlugin.registerCommand('copy', {
            queue: false,
            enable: function (graph) {
                const mode = graph.getCurrentMode();
                const items = graph.get('selectedItems');
                return mode === 'edit' && items && items.length > 0;
            },
            method: function (graph) {
                const manager = cmdPlugin.get('_command');
                manager.clipboard = [];
                const items = graph.get('selectedItems');
                if (items && items.length > 0) {
                    for (let i = 0; i < items.length; i++) {
                        const item = graph.findById(items[i]);
                        if (item && item.get('type') !== 'edge') {
                            manager.clipboard.push({type: item.get('type'), model: item.getModel()});
                        }
                    }
                }
            },
            shortcutCodes: ['Control', 'c'],
        });
        cmdPlugin.registerCommand('paste', {
            enable: function (graph) {
                const mode = graph.getCurrentMode();
                return mode === 'edit' && cmdPlugin.get('_command').clipboard.length > 0;
            },
            method: function (graph) {
                const manager = cmdPlugin.get('_command');
                for (let i = 0; i < manager.clipboard.length; i++) {
                    this.pasteData = clone(manager.clipboard[i]);
                    const addModel = this.pasteData.model;
                    addModel.x && (addModel.x += 10);
                    addModel.y && (addModel.y += 10);
                    let oldId = addModel.id.split('$')[0]
                    addModel.id = oldId + "$" + guid2();
                    const item = graph.add(this.pasteData.type, addModel);
                    item.toFront();
                }
            },
            shortcutCodes: [['Control', 'v']],
        });
        cmdPlugin.registerCommand('zoomIn', {
            queue: false,
            enable: function (graph) {
                const zoom = graph.getZoom();
                const maxZoom = graph.get('maxZoom');
                const minZoom = graph.get('minZoom');
                return zoom <= maxZoom && zoom >= minZoom;
            },
            execute: function (graph) {
                const manager = cmdPlugin.get('_command');
                const maxZoom = graph.get('maxZoom');
                const zoom = graph.getZoom();
                this.originZoom = zoom;
                let currentZoom = zoom + manager.zoomDelta;
                if (currentZoom > maxZoom)
                    currentZoom = maxZoom;
                graph.zoomTo(currentZoom);
            },
            back: function (graph) {
                graph.zoomTo(this.originZoom);
            },
            shortcutCodes: [['metaKey', '='], ['ctrlKey', '=']],
        });
        cmdPlugin.registerCommand('zoomOut', {
            queue: false,
            enable: function (graph) {
                const zoom = graph.getZoom();
                const maxZoom = graph.get('maxZoom');
                const minZoom = graph.get('minZoom');
                return zoom <= maxZoom && zoom >= minZoom;
            },
            execute: function (graph) {
                const manager = cmdPlugin.get('_command');
                const minZoom = graph.get('minZoom');
                const zoom = graph.getZoom();
                this.originZoom = zoom;
                let currentZoom = zoom - manager.zoomDelta;
                if (currentZoom < minZoom)
                    currentZoom = minZoom;
                graph.zoomTo(currentZoom);
            },
            back: function (graph) {
                graph.zoomTo(this.originZoom);
            },
            shortcutCodes: [['metaKey', '-'], ['ctrlKey', '-']],
        });
        cmdPlugin.registerCommand('resetZoom', {
            queue: false,
            execute: function (graph) {
                const zoom = graph.getZoom();
                this.originZoom = zoom;
                graph.fitCenter();
            },
            back: function (graph) {
                graph.zoomTo(this.originZoom);
            },
        });
        cmdPlugin.registerCommand('autoFit', {
            queue: false,
            execute: function (graph) {
                const zoom = graph.getZoom();
                this.originZoom = zoom;
                graph.fitCenter()
                graph.fitView(5);
            },
            back: function (graph) {
                graph.zoomTo(this.originZoom);
            },
        });
        cmdPlugin.registerCommand('toFront', {
            queue: false,
            enable: function (graph) {
                const items = graph.get('selectedItems');
                return items && items.length > 0;
            },
            execute: function (graph) {
                const items = graph.get('selectedItems');
                if (items && items.length > 0) {
                    const item = graph.findById(items[0]);
                    item.toFront();
                    graph.paint();
                }
            }
        });
        cmdPlugin.registerCommand('toBack', {
            queue: false,
            enable: function (graph) {
                const items = graph.get('selectedItems');
                return items && items.length > 0;
            },
            execute: function (graph) {
                const items = graph.get('selectedItems');
                if (items && items.length > 0) {
                    const item = graph.findById(items[0]);
                    item.toBack();
                    graph.paint();
                }
            }
        });
        cmdPlugin.registerCommand('brushSelect', {
            queue: false,
            enable: function () {
                return true
            },
            execute: function (graph) {
                graph.setMode('brush')
            }
        });
        cmdPlugin.registerCommand('editDetail', {
            queue: false,
            enable: function (graph) {
                const items = graph.get('selectedItems');
                return items && items.length > 0;
            },
            execute: function (graph) {
                const items = graph.get('selectedItems');
                graph.emit('editDetail', items)
            }
        });
    }
}

export default Command;
