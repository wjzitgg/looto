import * as types from '../types'


export default {
    state:{
        history:[]
    },
    mutations:{
        [types.PUSH_HISTORY_STATE](state,path){
            state.history.push(path)
        },
        [types.POP_HISTORY_STATE](state,path){
            let pop = state.history.pop()
            state.history.pop()
            state.history.pop()
            state.history.push(pop)
        }
    },
    getters:{
        backHistory(state){
            if(state.history.length<3)
                return ''
            else
                return state.history[state.history.length-3]
        }
    }
}
