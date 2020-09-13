import registerAnchor from './anchor'
import registerNode from './node'
import registerEdge from './edge'

registerAnchor();
export default function (G6, _shapeDef) {
    if (_shapeDef.shape_type === "node") {
        registerNode(G6, _shapeDef);
    } else {
        registerEdge(G6, _shapeDef);
    }
}
