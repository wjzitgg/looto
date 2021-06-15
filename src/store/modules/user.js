import api from '../../api/require'
import * as types from '../types'
import config from '../../../config/product.json'
import axios from 'axios';
import globals from '../../api/config';

let account={}
let coinTypeName=config.gameConfig.coinTypeName
if(coinTypeName){
    Object.keys(coinTypeName).forEach(n=>{
        account[n]=0
    })
}

export default {
    state:{
        token:'',
        tokenUpdateTime:'',
        tokenRequireTime:'',
        loginStatus:'',
        hasUserInfo:false,
        account:account, //0：人民币 1：金币 2：宝石 3：铜币
        info:{},
        userId:'',
        addBol:false,
        registerBol:false,//判断是否注册
        loginBol:false,//判断是否登录
    },
    mutations:{
        [types.UPDATE_USER_INFO](state,payload){
            state.hasUserInfo=true
            state.info=payload;
        },
        [types.UPDATE_ACCOUNT](state,payload){
            var oAccount={}
            for(var i=0;payload.length>i;i++){
                oAccount[payload[i].currency]=payload[i].amount
            }
            state.account=oAccount
        },
        [types.UPDATE_LOGIN_STATUS](state,status){
            state.loginStatus=status
        },
        [types.UPDATE_TOKEN](state,payload){
        
            if(payload) {
                if(localStorage.getItem('token')!=payload.token)
                    state.loginStatus=true
                	localStorage.setItem('token', payload.token)
                	localStorage.setItem('userId', payload.userId)
                	state.token = payload.token;
                	state.userId = payload.userId
            }else{
                localStorage.removeItem('token')
                localStorage.removeItem('userId')
                state.userId = ''
                state.token=''
                state.loginStatus=false;
                state.info={}
            }
        },
        [types.UPDATE_TOKEN_REQUIRE_TIME](state,payload){
            state.tokenRequireTime=payload
        }
    },
    actions:{
        [types.LOGIN] ({commit},loginInfo){

        },
        [types.LOGOUT] ({commit}){
            return new Promise(resolve=>{
            	const params = {
					token: localStorage.getItem('token')
				}
            	localStorage.setItem('token','')
            	localStorage.setItem('role', '')
            	commit(types.UPDATE_USER_INFO,{})
                commit(types.UPDATE_TOKEN, {
					token:'',
					userId:''
				})
              
                resolve()
            })
        },
        [types.GET_USER_INFO]({commit}){
            return new Promise((resolve,reject)=>{
            	var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					ext:'show'
				}
            	axios.post(globals.api.getUserInfo,params).then((res)=>{
					commit(types.UPDATE_USER_INFO,res.data.data)
                    resolve(res.data.data)
	       		}).catch((error)=>{reject(error)})
	       		})
	
        },
        
        [types.GET_NEW_TOKEN](context){
            if(context.state.tokenRequireTime&&(+new Date()-context.state.tokenRequireTime<5*100)) return //5s内 不再更新token
//          context.commit(types.UPDATE_TOKEN_REQUIRE_TIME,+new Date())
//          api.user.getNewToken(data=>{context.commit(types.UPDATE_TOKEN,{token:data.res_content.token,updateTime:+new Date()})})
        },
        [types.GET_LOGIN_STATUS]({commit}){
            return new Promise((resolve,reject)=>{
//              api.user.getLoginStatus(data=>{
//                  commit(types.UPDATE_LOGIN_STATUS,data.res_content.status)
//                  resolve(data.res_content.status);
//              },err=>{reject(err)})
            })
        },
        [types.GET_ACCOUNT]({commit}){
            api.user.getAccount(data=>{commit(types.UPDATE_ACCOUNT,data.res_content)},err=>{
                //if(err.statusCode==0) return
                //vue.prototype.$dialog.alert("获取资金信息失败")
            })
        }
    }
}
