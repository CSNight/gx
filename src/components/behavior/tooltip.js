export const NodeTooltip = {
    type: 'tooltip', formatText: (e) => {
        return '<div class="g6-component-tooltip">' +
            '<h4 class="tooltip-type">type:' + e.type + '</h4>' +
            '<span class="tooltip-id">label:' + e.label + '</span></div>'
    }
}
export const EdgeTooltip = {
    type: 'edge-tooltip', formatText: (e) => {
        return '<div class="g6-component-tooltip">' +
            '<h4 class="tooltip-type">type:' + e.type + '</h4>' +
            '<span class="tooltip-id">label:' + e.label + '</span></div>'
    }
}