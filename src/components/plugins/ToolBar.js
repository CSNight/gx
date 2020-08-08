import {deepMix, each, wrapBehavior} from '@antv/util';

class ToolBar {
    constructor(cfgs) {
        this._cfgs = deepMix(this.getDefaultCfg(), cfgs);
    }

    getDefaultCfg() {
        return {container: null};
    }

    get(key) {
        return this._cfgs[key];
    }

    set(key, val) {
        this._cfgs[key] = val;
    }

    initPlugin(graph) {
        const self = this;
        this.set('graph', graph);
        const events = self.getEvents();
        const bindEvents = {};
        each(events, (v, k) => {
            const event = wrapBehavior(self, v);
            bindEvents[k] = event;
            graph.on(k, event);
        });
        this._events = bindEvents;
        this.initEvents();
        this.updateToolbar();
    }

    getEvents() {
        return {afteritemselected: 'updateToolbar', aftercommandexecute: 'updateToolbar'};
    }

    initEvents() {
        const graph = this.get('graph');
        const parentNode = this.get('container');
        const children = parentNode.querySelectorAll('button[tool-click]');
        each(children, (child) => {
            const cmdName = child.getAttribute('tool-click');
            child.addEventListener('click', () => {
                graph.commandEnable(cmdName) && graph.executeCommand(cmdName);
            });
        })
    }

    updateToolbar() {
        const graph = this.get('graph');
        const parentNode = this.get('container');
        const children = parentNode.querySelectorAll('button[tool-click]');
        each(children, (child) => {
            const cmdName = child.getAttribute('tool-click');
            this.get('toolbarCom').barComState[cmdName] = !graph.commandEnable(cmdName)
        })
    }

    destroyPlugin() {
        this.get('canvas').destroy();
        const container = this.get('container');
        container.parentNode.removeChild(container);
    }
}

export default ToolBar;
