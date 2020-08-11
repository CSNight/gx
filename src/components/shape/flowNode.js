import editorStyle from "@/utils/defaultStyle";

const taskDefaultOptions = {
    icon: null,
    iconStyle: {
        width: 12,
        height: 12,
        left: 2,
        top: 2,
    },
    style: {
        ...editorStyle.nodeStyle,
        fill: '#E7F7FE',
        stroke: '#1890FF',
        cursor: 'default',
    },
    stateStyles: {
        selected: {
            fill: '#95D6FB',
        },
        hover: {
            cursor: editorStyle.cursor.hoverNode,
        }
    }
};


export default function (G6) {
    for (let i = 0; i < 1; i++) {
        G6.registerNode('tk-node', {
            shapeType: 'rect',
            options: {...taskDefaultOptions},
            getShapeStyle: function (cfg) {
                if (cfg.size && typeof cfg.size === 'string') {
                    cfg.size = [parseInt(cfg.size.split('*')[0]), parseInt(cfg.size.split('*')[1])]
                } else if (!cfg.size) {
                    cfg.size = [80, 44];
                }
                const width = cfg.size[0];
                const height = cfg.size[1];
                const style = {
                    x: 0 - width / 2,
                    y: 0 - height / 2,
                    width,
                    height,
                    ...this.options.style,
                };
                return style;
            },
        }, 'base-node')
    }

}
