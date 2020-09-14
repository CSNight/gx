export default {
    edgeActivatedStyle: {lineWidth: 1, stroke: '#1890FF', strokeOpacity: .92, fill: '#1890FF', fillOpacity: .08},
    edgeSelectedStyle: {lineWidth: 2, strokeOpacity: .92, stroke: '#f2b', fill: '#f2b', fillOpacity: .08},
    edgeStyle: {stroke: '#A3B1BF', strokeOpacity: .92, lineWidth: 1, lineAppendWidth: 8, endArrow: true},
    edgeLabelRectPadding: 4,
    anchorPointStyle: {r: 3.5, fill: '#fff', stroke: '#1890FF', lineAppendWidth: 12},
    anchorHotspotStyle: {r: 12, fill: '#1890FF', fillOpacity: .25, stroke: false},
    anchorHotspotActivatedStyle: {r: 14},
    anchorPointHoverStyle: {r: 4, fill: '#1890FF', fillOpacity: 1, stroke: '#1890FF'},
    cursor: {
        panningCanvas: '-webkit-grabbing', beforePanCanvas: '-webkit-grab',
        hoverNode: 'move', hoverEffectiveAnchor: 'crosshair',
        hoverEdge: 'default', hoverGroup: 'move',
        hoverUnEffectiveAnchor: 'default', multiSelect: 'crosshair',
    },
    nodeDelegationStyle: {
        stroke: '#1890FF', fill: '#1890FF', fillOpacity: .08, lineDash: [4, 4], radius: 4, lineWidth: 1
    },
    edgeDelegationStyle: {stroke: '#1890FF', lineDash: [4, 4], lineWidth: 1},
};
