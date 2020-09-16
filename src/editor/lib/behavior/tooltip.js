export function formatNodeTooltip(e) {
    return '<div>' +
        '<h4 class="tooltip-type">ID:' + e.id + '</h4>' +
        '<div class="tooltip-id">label:' + e.label + '</div>' +
        '<div class="tooltip-id">type:' + e.type + '</div></div>'
}

export function formatEdgeTooltip(e) {
    return '<div>' +
        '<h4 class="tooltip-type">ID:' + e.id + '</h4>' +
        '<div class="tooltip-id">label:' + e.label + '</div>' +
        '<div class="tooltip-id">type:' + e.type + '</div></div>'
}