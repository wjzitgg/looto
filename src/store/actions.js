import * as types from './types'
import api from '../api/require'

export default {
    [types.GET_APP_VER]({commit}){
        api.app.getAppVer(res=>{
            commit(types.SET_APP_VER,res.res_content.releaseNO)
        })
    },
    [types.SYN_TIME]({commit}){
        api.app.getSysTime(res=>{
            commit(types.SET_SYSTEM_TIME_OFFEST,new Date()-new Date(parseInt(res.res_content.sysDate)))
        })
    },
//  [types.GET_PRODUCT_CATLOG](state){
//  	const data = {
//  		pageSize: 100,
//  		index: 0
//		}
//      api.mall.doQueryProductCatalog(data,res=>{
//          state.cateLog = res.res_content
//		})
//  }
}
