import Vue from 'vue'
import url from './resource'
import store from '../store/store'
import http from '../http'
import * as types from '../store/types'
import router from '../router'

import Dialog from '../plugin/dialog/dialog'


Dialog.config.target='#app'
Vue.use(Dialog)
let vue=new Vue()

let successCode=[
	'02000000',
	'00000000',
	'03000013',
	'03000000',
	'15999999'
]

let loginFailCodes=[
	'01000011',//'无token 无权限'
    // '01000008',//权限验证异常
	'02000006',//Token(令牌)过期
	'02000007',//解析异常
	// '02000008',//交易服务Token刷新异常
	'02000014',//用户未登陆
	'02000019',//客户/用户信息不全，请联系客服
	'02000077'//下线
]

var ajax = function(options) {
	//options={type, url, data, success,error}
	// store.commit('SHOW_LOADING');

	var {type,url,data,success,error,sendToken}=Object.assign({
		data:{},
		success:function(){},
		error:function(){},
		sendToken:true
	},options)

	if(sendToken)
		data.token=store.state.user.token
	let datas=type === 'get'?{params: data}:data

	return new Promise((resolve,reject)=>{
		 http[type](url, datas).then((res) => {
			 let code=res.data.res_code;
			 //判断是否登录
			 if(typeof loginFailCodes.find(el=>{return el==code})!= "undefined") {
				 if(router.currentRoute.name=='login') return

//				 store.commit(types.UPDATE_TOKEN,{token:'',updateTime:''});
				 router.push({
					 path: '/login',
					 query: {redirect: router.currentRoute.fullPath}
				 })

                 if(code!="02000014"&&code!="02000006"){
                     return;
                 }

				 
			 }

			if (typeof successCode.find(el=>{return el==res.data.res_code}) != "undefined") {
				if(typeof success =="function") success(res.data)
				if(typeof resolve =="function") resolve(res.data)
			} else {
				//调用错误回调
				let errorObj={msg:res.data.res_msg,statusCode:200,data:res.data}
				if(typeof error =="function") error(errorObj)
				else if(typeof reject =="function") reject(errorObj)
			}
             if(code=="00000000"){
                 store.dispatch(types.GET_NEW_TOKEN)
             }
			// store.commit('HIDE_LOADING');
		}).catch((err) => {
		 	let msg,statusCode
		 	if(typeof err.statusCode =="undefined"){
                msg=err
			}else{
                msg=err.msg
                statusCode=err.statusCode
			}
			// console.log(err);
			// 调用全局配置错误回调
			// store.commit('HIDE_LOADING');

			//statusCode
			//-1 请求发送失败
			//0  请求没有内容返回（一般超时）
			//200 请求成功
			//其他 http错误状态吗
			 if(typeof error =="function") error({msg,statusCode})
			 else if(typeof reject =="function") reject({msg,statusCode})
		});
	})
};


export default {
	app:{
        getAppVer(success,error){
        	return ajax.call(this,{type:'get',url:url.getAppVer,sendToken:false,success,error})
		},
        getSysTime(success,error){
            return ajax.call(this,{type:'get',url:url.getSysTime,sendToken:false,success,error})
        },
        //资讯列表
        doBlogArticles(data,success,error){
            return ajax.call(this,{type:'get',url:url.doBlogArticles,data,success,error})
        },
        //资讯详情
        getArticleInfo(data,success,error){
            return ajax.call(this,{type:'get',url:url.getArticleInfo,data,success,error})
        },
        //查询游戏列表
        doQueryGames(data,success,error){
            return ajax.call(this,{type:'get',url:url.doQueryGames,data,success,error})
        },
        //获取游戏跳转链接
        doGoTOGame(data,success,error){
            return ajax.call(this,{type:'get',url:url.doGoTOGame,data,success,error})
        }
	},
    // 用户模块
    user: {
		//用户登录
		doLogin(data,success,error){
			return ajax.call(this,{type:'post',url:url.doLogin,sendToken:false,data,success,error})
		},

		//退出登录
		doLogout(success,error){
			//return ajax.call(this,{type:'post',url:url.doLogout,success,error})
		},

		//刷新token
		getNewToken(success,error){
			return ajax.call(this,{type:'post',url:url.getNewToken,success,error})
		},

		//忘记密码 | data: mobileNo pwd verCode
        	forgetPwded(data,success,error){
			return ajax.call(this,{type:'post',url:url.forgetPwded,sendToken:false,data,success,error})
		},

		//忘记支付密码
		forgetPayPwded(data,success,error){
			return ajax.call(this,{type:'post',url:url.forgetPayPwded,data,success,error});
		},

		//修改密码 | data: pwd oldPwd
		resetPwded(data,success,error){
            return ajax.call(this,{type:'post',url:url.resetPwded,data,success,error})
		},
		//修改支付密码
		resetPayPwded(data,success,error){
			return ajax.call(this,{type:'post',url:url.resetPayPwded,data,success,error})
		},

		//获取登录状态
		getLoginStatus(success,error){
			return ajax.call(this,{type:'post',url:url.getLoginStatus,success,error})
		},

		//获取用户信息
		getUserInfo(success){
			return ajax.call(this,{type:'get',url:url.getUserInfo,success})
		},

		//发送验证码 | data: mobileNo , type
		sendVerCode(data,success,error){
			return ajax.call(this,{type:'post',url:url.sendMsg,sendToken:false,data,success,error})
		},

		//注册 ｜ data: mobileNo , pwd , verCode , tjCode , ipInfo , clerkCode , wxNo , orgCode
		doRegister(data,success,error){
			return ajax.call(this,{type:'post',url:url.doRegister,sendToken:false,data,success,error})
		},

		//获取账户余额
		getAccount(success,error){
            return ajax.call(this,{type:'post',url:url.getAccount,success,error})
		},

		//查询个人收货地址
		queryAddress(data,success,error){
			return ajax.call(this,{type:'post',url:url.queryAddress,data,success,error});
		},

		//新增收货地址
		addAddress(data,success,error){
			return ajax.call(this,{type:'post',url:url.addAddress,data,success,error});
		},

		//编辑收货地址
		updateAddress(data,success,error){
			return ajax.call(this,{type:'post',url:url.updateAddress,data,success,error});
		},

		//删除收货地址
		delAddress(data,success,error){
			return ajax.call(this,{type:'post',url:url.delAddress,data,success,error});
		},
		
		//地址详情
		doAddressDetail(data,success,error){
			return ajax.call(this,{type:'post',url:url.doAddressDetail,data,success,error});
		},

		//查询个人资料
		queryCustomInfo(success,error){
			return ajax.call(this,{type:'post',url:url.queryCustomInfo,success,error});
		},

		//编辑个人资料
		updateCustomInfo(data,success,error){
			return ajax.call(this,{type:'post',url:url.updateCustomInfo,data,success,error});
		},

		//实名认证
		doCertification(data,success,error){
			return ajax.call(this,{type:'post',url:url.doCertification,data,success,error});
		},

		//查询收件箱 data{pageSize:10,index:0,readFlag:0}
		queryInbox(data,success,error){
			return ajax.call(this,{type:'post',url:url.queryInbox,data,success,error});
		},

		//查询单个详情 data{noticeSerialNo:1111}
		queryInboxDetail(data,success,error){
			return ajax.call(this,{type:'post',url:url.queryInboxDetail,data,success,error});
		},

		//更新收件箱状态为已读 data{noticeSerialNo:11111}
		updateInboxStatus(data,success,error){
			return ajax.call(this,{type:'post',url:url.updateInboxStatus,data,success,error});	
		},

		//查询未读收件箱数量
		queryInboxCount(success,error){
			return ajax.call(this,{type:'post',url:url.queryInboxCount,success,error});
		},

		//查询账户余额
		queryAccountBalance(success,error){
			return ajax.call(this,{type:'post',url:url.queryAccountBalance,success,error});
		},
		//查询客户登记
		queryAccountLevel(success,error){
			return ajax.call(this,{type:'post',url:url.queryAccountLevel,success,error});
		},
		//查询个人信息提示信息数量
		queryHintInfo(success,error){
			return ajax.call(this,{type:'post',url:url.queryHintInfo,success,error});
		},
		//头像
		doSetCusIcon(data,success,error){
			return ajax.call(this,{type:'post',url:url.doSetCusIcon,data,success,error});
		},
		//参数设置
		doSetCusParam(data,success,error){
			return ajax.call(this,{type:'post',url:url.doSetCusParam,data,success,error});
		},
		//查询经纪人
		doGetAgentInfo(success,error){
			return ajax.call(this,{type:'post',url:url.doGetAgentInfo,success,error});
		},
		//发送推荐码
		doAddInviteCode(data,success,error){
			return ajax.call(this,{type:'post',url:url.doAddInviteCode,data,success,error});
		},
		//申请成为经纪人
		doApplicationAgent(data,success,error){
			return ajax.call(this,{type:'post',url:url.doApplicationAgent,data,success,error});
		},
		//支付
		doRecharge(data,success,error){
			return ajax.call(this,{type:'post',url:url.doRecharge,data,success,error});
		},
		//充值记录查询
		doChargeRecordList(data,success,error){
			return ajax.call(this,{type:'post',url:url.doChargeRecordList,data,success,error});
		},
		//提现
		doWithdraw(data,success,error){
			return ajax.call(this,{type:'post',url:url.doWithdraw,data,success,error});
		},
		//查询提现申请列表
		doBookChange(data,success,error){
			return ajax.call(this,{type:'post',url:url.doBookChange,data,success,error});
		},
		//查询客户参数信息
		doQueryCusParam(success,error){
			return ajax.call(this,{type:'post',url:url.doQueryCusParam,success,error});
		},
		//更换银行卡
		doUpdateBankInfo(data,success,error){
			return ajax.call(this,{type:'post',url:url.doUpdateBankInfo,data,success,error});
		},
		//查询客户等级属性
		doQueryCustomerLevelProperty(data,success,error){
			return ajax.call(this,{type:'post',url:url.doQueryCustomerLevelProperty,data,success,error});
		},
		//升级客户等级
		doUpgradeLevel(data,success,error){
			return ajax.call(this,{type:'post',url:url.doUpgradeLevel,data,success,error});
		},
		//查询我的回购列表
		doQueryBackOrderList(data,success,error){
			return ajax.call(this,{type:'post',url:url.doQueryBackOrderList,data,success,error});
		},
		//退出登录
		doLoginOut(data,success,error){
			return ajax.call(this,{type:'post',url:url.doLoginOut,data,success,error});
		},
		//微信支付
		doWxPay(data,success,error){
			return ajax.call(this,{type:'post',url:url.doWxPay,data,success,error});
		},
		//微信支付失败
		doWxPayFail(success,error){
			return ajax.call(this,{type:'get',url:url.doWxPayFail,success,error});
		},
		//积分兑换商品
		doCreditsExchange(data,success,error){
			return ajax.call(this,{type:'post',url:url.doCreditsExchange,data,success,error});
		},
		//查询我的推荐
		doMyReferrals(success,error){
			return ajax.call(this,{type:'post',url:url.doMyReferrals,success,error});
		},
		//查询我的推荐费
		doRecommendationFee(success,error){
			return ajax.call(this,{type:'post',url:url.doRecommendationFee,success,error});
		},
		//bu兑换商品
		doBUCoinExchange(data,success,error){
			return ajax.call(this,{type:'post',url:url.doBUCoinExchange,data,success,error});
		},
		//Bu币余额查询
		doBUAmount(success,error){
			return ajax.call(this,{type:'post',url:url.doBUAmount,success,error});
		},
		//BU币变动记录查询
		doQueryAssertHistory(data,success,error){
			return ajax.call(this,{type:'post',url:url.doQueryAssertHistory,data,success,error});
		},
		//钻石兑换积分
		doCustBalanceExchange(data,success,error){
			return ajax.call(this,{type:'post',url:url.doCustBalanceExchange,data,success,error});
		},
		//资金变动记录
		doQueryChangeHistory(data,success,error){
			return ajax.call(this,{type:'post',url:url.doQueryChangeHistory,data,success,error});
		},
    },
    //商城
    mall: {
    	//商城商品列表
		doQueryMallProduct(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryMallProduct,sendToken:false,data,success,error})
		},
		//商品分类列表查询
		doQueryProductCatalog(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryProductCatalog,sendToken:false,data,success,error})
		},
		//商品商品详情
		doMallProductInfo(data,success,error){
            return ajax.call(this,{type:'post',url:url.doMallProductInfo,sendToken:false,data,success,error})
		},
		//广告轮播列表查询
		doQueryNewsList(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryNewsList,sendToken:false,data,success,error})
		},
		//按照系列查询商品列表
		doQuerySeriesProduct(data,success,error){
            	return ajax.call(this,{type:'post',url:url.doQuerySeriesProduct,sendToken:false,data,success,error})
		},
		//按分类查询商品列表
		doQueryCatalogProduct(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryCatalogProduct,sendToken:false,data,success,error})
		},
		//查询商品规格
		doQueryProductSpec(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryProductSpec,sendToken:false,data,success,error})
		},
		//商品浏览记录查询
		doQueryScanRecord(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryScanRecord,data,success,error})
		},
		//新增商品咨询
		doAddProductAdvice(data,success,error){
            return ajax.call(this,{type:'post',url:url.doAddProductAdvice,data,success,error})
		},
		//查询商品咨询列表
		doQueryAdviceRecord(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryAdviceRecord,data,success,error})
		},
		//新增商品评价
		doAddFeedback(data,success,error){
            return ajax.call(this,{type:'post',url:url.doAddFeedback,data,success,error})
		},
		//查询商品评价列表
		doQueryFeedback(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryFeedback,data,success,error})
		},
		//查询待评价商品
		doQueryWaitForFeedback(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryWaitForFeedback,data,success,error})
		},
		//查询商品全部评价
		doQueryAllFeedbackByProductId(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryAllFeedbackByProductId,data,success,error})
		},
		//删除商品评价
		doDelFeedback(data,success,error){
            return ajax.call(this,{type:'post',url:url.doDelFeedback,data,success,error})
		},
		//商城订单列表查询
		doQueryMallOrderList(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryMallOrderList,data,success,error})
		},
		//商城订单查询
		doQueryMallOrder(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryMallOrder,data,success,error})
		},
		//商城商品参数列表
		doQueryProductParam(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryProductParam,data,success,error})
		},
		//购物车查询
		doQueryShoppingCart(success,error){
            return ajax.call(this,{type:'post',url:url.doQueryShoppingCart,success,error})
		},
		//添加购物车
		doAddCart(data,success,error){
            return ajax.call(this,{type:'post',url:url.doAddCart,data,success,error})
		},
		//删除购物车
		doDelCart(data,success,error){
            return ajax.call(this,{type:'post',url:url.doDelCart,data,success,error})
		},
		//修改购物车
		doEditCart(data,success,error){
            return ajax.call(this,{type:'post',url:url.doEditCart,data,success,error})
		},
		//查询发票列表
		doQueryInvoice(success,error){
            return ajax.call(this,{type:'post',url:url.doQueryInvoice,success,error})
		},
		//查询发票信息
		doInvoiceDetail(data,success,error){
            return ajax.call(this,{type:'post',url:url.doInvoiceDetail,data,success,error})
		},
		//新增发票信息
		doCreateInvoice(data,success,error){
            return ajax.call(this,{type:'post',url:url.doCreateInvoice,data,success,error})
		},
		//编辑发票信息
		doEditInvoice(data,success,error){
            return ajax.call(this,{type:'post',url:url.doEditInvoice,data,success,error})
		},
		//删除发票信息
		doDelInvoice(data,success,error){
            return ajax.call(this,{type:'post',url:url.doDelInvoice,data,success,error})
		},
		//查询优惠券信息
		doQueryVoucher(data,success,error){
            return ajax.call(this,{type:'post',url:url.doQueryVoucher,data,success,error})
		},
		//商品下单
		doProductOrder(data,success,error){
            return ajax.call(this,{type:'post',url:url.doProductOrder,data,success,error})
		},
		//取消订单
		doCancelOrder(data,success,error){
            return ajax.call(this,{type:'post',url:url.doCancelOrder,data,success,error})
		},
		//确认收货
		doConfirmRecv(data,success,error){
            return ajax.call(this,{type:'post',url:url.doConfirmRecv,data,success,error})
		},
		//系统余额支付
		doSystemAmountPay(data,success,error){
            return ajax.call(this,{type:'post',url:url.doSystemAmountPay,data,success,error})
		},
		//查询商品收藏列表
		doQueryFavorites(data,success,error){
            	return ajax.call(this,{type:'post',url:url.doQueryFavorites,data,success,error})
		},
		//新增商品收藏
		doAddFavorites(data,success,error){
            	return ajax.call(this,{type:'post',url:url.doAddFavorites,data,success,error})
		},
		//删除商品收藏
		doDelFavorites(data,success,error){
            	return ajax.call(this,{type:'post',url:url.doDelFavorites,data,success,error})
		},
		//清空商品收藏
		clearAllFavorites(success,error){
			return ajax.call(this,{type:'post',url:url.clearAllFavorites,success,error})
		},
		//退货列表查询
		doQueryRtnGoodsList(data,success,error){
			return ajax.call(this,{type:'post',url:url.doQueryRtnGoodsList,data,success,error})
		},
		//退款列表查询
		doQueryRefundList(data,success,error){
			return ajax.call(this,{type:'post',url:url.doQueryRefundList,data,success,error})
		},
		//交易商品查询
		doQueryProduct(data,success,error){
			return ajax.call(this,{type:'post',url:url.doQueryProduct,sendToken:false,data,success,error})
		},
		//查询推荐商品列表（猜你喜欢）
		doQueryRecommendProduct(data,success,error){
			return ajax.call(this,{type:'post',url:url.doQueryRecommendProduct,sendToken:false,data,success,error});
		},
		//支付
		getPayInfo(data,success,error){
			return ajax.call(this,{type:'post',url:url.getPayInfo,data,success,error});
		},
		//预付款下单
		doBBIOpenPosition(data,success,error){
			return ajax.call(this,{type:'post',url:url.doBBIOpenPosition,data,success,error});
		},
		//预付款单详情
		doOrderDetail(data,success,error){
			return ajax.call(this,{type:'post',url:url.doOrderDetail,data,success,error});
		},
		//平仓单详情
		doOrderHisDetail(data,success,error){
			return ajax.call(this,{type:'post',url:url.doOrderHisDetail,data,success,error});
		},
		//预付款单列表查询
		doOrderHold(data,success,error){
			return ajax.call(this,{type:'post',url:url.doOrderHold,data,success,error});
		},
		//平仓单列表查询
		doOrderHoldHis(data,success,error){
			return ajax.call(this,{type:'post',url:url.doOrderHoldHis,data,success,error});
		},
		//退订
		doBBIClosePosition(data,success,error){
			return ajax.call(this,{type:'post',url:url.doBBIClosePosition,data,success,error});
		},
		//预付款回购转交货
		doBuyBackChangeDeliverTheGoods(data,success,error){
			return ajax.call(this,{type:'post',url:url.doBuyBackChangeDeliverTheGoods,data,success,error});
		},
		//预付款预定转提货
		doPickUpPriceDifference(data,success,error){
			return ajax.call(this,{type:'post',url:url.doPickUpPriceDifference,data,success,error});
		},
		//查询交易规格信息
		doQueryProductSpec(data,success,error){
			return ajax.call(this,{type:'post',url:url.doQueryProductSpec,data,success,error});
		},
		//获取微信api
		getJsApi(data,success,error){
			return ajax.call(this,{type:'post',url:url.getJsApi,data,success,error});
		},
    },





	common:{
		//字典值
        queryDictList(data,success,error){
            return ajax.call(this,{type:'post', url:url.queryDictList,sendToken:false,data,success,error});
		},
		//查询系统参数
		querySystemParam(data,success,error){
			return ajax.call(this,{type:'post', url:url.querySystemParam,sendToken:false,data,success,error});
		}
	}
}
