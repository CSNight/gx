
const state = {
    globalGraph: null,
    BASE_API: 'https://127.0.0.1'
};


const mutations = {
    SET_GRAPH(state, n) {
        state.globalGraph = n
    },
};

const actions = {

};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
