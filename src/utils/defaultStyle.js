export default {
    edgeActivatedStyle: {lineWidth: 1, stroke: '#1890FF', strokeOpacity: .92, fill: '#1890FF', fillOpacity: .08},
    edgeSelectedStyle: {lineWidth: 2, strokeOpacity: .92, stroke: '#f2b', fill: '#f2b', fillOpacity: .08},
    nodeStyle: {
        stroke: '#CED4D9',
        fill: '#FFFFFF',
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 10,
        shadowColor: 'rgba(13, 26, 38, 0.08)',
        lineWidth: 1,
        radius: 4,
        strokeOpacity: .7,
    },
    edgeStyle: {stroke: '#A3B1BF', strokeOpacity: .92, lineWidth: 1, lineAppendWidth: 8, endArrow: true},
    edgeLabelStyle: {fill: '#666', textAlign: 'center', textBaseline: 'middle'},
    edgeLabelRectPadding: 4,
    edgeLabelRectStyle: {fill: 'white'},
    nodeLabelStyle: {fill: '#666', textAlign: 'center', textBaseline: 'middle'},
    multiSelectRectStyle: {fill: '#1890FF', fillOpacity: .08, stroke: '#1890FF', opacity: .1},
    anchorPointStyle: {r: 3.5, fill: '#fff', stroke: '#1890FF', lineAppendWidth: 12},
    anchorHotspotStyle: {r: 12, fill: '#1890FF', fillOpacity: .25, stroke: false},
    anchorHotspotActivatedStyle: {r: 14},
    anchorPointHoverStyle: {r: 4, fill: '#1890FF', fillOpacity: 1, stroke: '#1890FF'},
    cursor: {
        panningCanvas: '-webkit-grabbing',
        beforePanCanvas: '-webkit-grab',
        hoverNode: 'move',
        hoverEffectiveAnchor: 'crosshair',
        hoverEdge: 'default',
        hoverGroup: 'move',
        hoverUnEffectiveAnchor: 'default',
        hoverEdgeControllPoint: 'crosshair',
        multiSelect: 'crosshair',
    },
    nodeDelegationStyle: {
        stroke: '#1890FF',
        fill: '#1890FF',
        fillOpacity: .08,
        lineDash: [4, 4],
        radius: 4,
        lineWidth: 1,
    },
    edgeDelegationStyle: {stroke: '#1890FF', lineDash: [4, 4], lineWidth: 1},
};
