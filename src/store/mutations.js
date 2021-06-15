import * as types from './types'

export default {
    [types.SHOW_LOADING](state){
        state.ajax_loading = true;
    },

    [types.HIDE_LOADING](state){
        state.ajax_loading = false;
    },

    [types.SAVE_SCROLL_POSITION](state,payload){
    	console.log(state.pageData)
        if(state.pageData[payload.name])
            state.pageData[payload.name].scrollTop=payload.scrollTop
        else
            state.pageData[payload.name]={scrollTop:payload.scrollTop}
    },
    [types.SET_SYSTEM_TIME_OFFEST](state,payload){
        state.timeOffset=payload
        state.timeOffsetSecond=parseInt(payload/1000)
    },
    [types.SET_APP_VER](state,payload){
        state.appVer=payload
    }
}
