import registerAnchor from './anchor'
import registerNode from './node'
import registerEdge from './edge'

export default function (G6) {
    registerAnchor();
    registerNode(G6);
    registerEdge(G6);
}
