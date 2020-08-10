export const NodeTooltip = {
    type: 'tooltip', formatText: (e) => {
        return '<div class="g6-component-tooltip">' +
            '<h4 class="tooltip-type">ID:' + e.id + '</h4>' +
            '<div class="tooltip-id">label:' + e.label + '</div>' +
            '<div class="tooltip-id">type:' + e.type + '</div></div>'
    }
}
export const EdgeTooltip = {
    type: 'edge-tooltip', formatText: (e) => {
        return '<div class="g6-component-tooltip">' +
            '<h4 class="tooltip-type">ID:' + e.id + '</h4>' +
            '<div class="tooltip-id">label:' + e.label + '</div>' +
            '<div class="tooltip-id">type:' + e.type + '</div></div>'
    }
}