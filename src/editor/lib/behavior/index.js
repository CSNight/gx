import clickSelect from "./clickSelect";
import hoverAnchorActivated from "./hoverAnchorActivated";
import hoverNodeActivated from "./hoverNodeActivated";
import dragEdge from "./dragEdge";
import itemAlign from "./itemAlign";
import deleteItem from "./deleteItem";
import contextMenu from "./contextMenu";
import dragAddNode from "./dragAddNode";

export default function (G6) {
    clickSelect(G6);
    hoverAnchorActivated(G6);
    hoverNodeActivated(G6);
    dragEdge(G6);
    itemAlign(G6);
    deleteItem(G6);
    contextMenu(G6);
    dragAddNode(G6);
}