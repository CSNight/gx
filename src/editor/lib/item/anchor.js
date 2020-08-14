import editorStyle from '../../utils/defaultStyle';
import Item from '@antv/g6/lib/item/item';
import {deepMix} from '@antv/util';

export default class Anchor extends Item {
    constructor(cfg) {
        super(deepMix(cfg, {
            type: 'anchor',
            isActivated: false,
            model: {
                type: 'anchor',
                style: {
                    ...editorStyle.anchorPointStyle,
                    cursor: editorStyle.cursor.hoverEffectiveAnchor,
                }
            },
        }));
        this.enableCapture(true);
        this.isAnchor = true;
        this.toFront();
    }

    showHotpot() {
        this.hotpot = this.getContainer().addShape('marker', {
            attrs: {
                ...this.get('model').style,
                ...editorStyle.anchorHotspotStyle
            },
            name: 'hotpot-shape',
            draggable: true,
        });
        this.hotpot.toFront();
        this.getKeyShape().toFront();
    }

    setHotspotActivated(act) {
        this.hotpot && (act ? this.hotpot.attr(editorStyle.anchorHotspotActivatedStyle) : this.hotpot.attr(editorStyle.anchorHotspotStyle))
    }
}
