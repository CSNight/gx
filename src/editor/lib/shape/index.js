import registerAnchor from './anchor'
import registerNode from './node'
import registerEdge, {defaultEdge} from './edge'

defaultEdge();
registerAnchor();
export default function (_shapeDef) {
    if (_shapeDef.shape_type === "node") {
        registerNode(_shapeDef);
    } else {
        registerEdge(_shapeDef);
    }
}
