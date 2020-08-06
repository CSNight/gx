import clickSelect from "@/components/behavior/clickSelect";
import hoverAnchorActivated from "@/components/behavior/hoverAnchorActivated";
import hoverNodeActivated from "@/components/behavior/hoverNodeActivated";
import dragEdge from "@/components/behavior/dragEdge";

export default function(G6){
    clickSelect(G6);
    hoverAnchorActivated(G6);
    hoverNodeActivated(G6);
    dragEdge(G6);
}