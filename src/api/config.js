import Vue from 'vue'
import store from '../store/store'
import * as types from '../store/types'
////////
var url = localStorage.getItem('role')=='guset'?'https://www.fantasyland.cc/h5/':'https://api.fantasyland.cc/'//请求地址生产/
var socketUrl = 'https://api.fantasyland.cc/'


// var url = localStorage.getItem('role')=='guset'?'https://dev.fantasyland.cc/h5/':'https://dev.api.fantasyland.cc/'//请求地址 测试
// var socketUrl = 'https://dev.api.fantasyland.cc/'

import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({

    debug: true,

    connection: socketUrl, 

}))


export default { 
	basePath:process.env.NODE_ENV === 'production'?'/frontWeb/api/':'/api/',
	api:{	
			register: url+"user/login/register", //注册
			forgotPassword: url+"user/user/modify-password-by-mobile", //忘记密码
			login: url+"user/login/login", //用户登录
			loginLog: url+"user/login/log", //记录登录日志
			existUsername: url+"user/login/exist-username", //验证用户名是否存在
			loginCheckCaptcha: url+"user/login/check-captcha", //验证短信验证码,并登录
			updatePassword: url+"user/password/update", //修改用户密码
			UpdataPayPassword: url+"user/password/update-pay-pass", //设置用户支付密码
			getUserInfo: url+"user/user/my", //获取我的信息
			userOnline: url+"user/user/online", //设置用户在线状态
			bindEmail: url+"user/user/bind-email", //绑定邮箱
			unBindEmail: url+"user/user/unbind-email", //解绑邮箱
			getPointsList: url+"user/points/list", //获取用户账户变更记录
			pointsDrawList: url+"user/points/draw-list", //获取用户提现记录
			pointsDraw: url+"user/points/draw", //申请提现
			pointsDrawCancel: url+"user/points/draw-cancel", //取消申请提现
			cardsBanks: url+"user/cards/banks", //获取银行列表,添加银行卡时使用
			cardsGet: url+"user/cards/get", //获取银行卡列表
			cardsCreate: url+"user/cards/create", //添加银行卡
			cardsDelete: url+"user/cards/delete", //删除银行卡 废弃
			deleteCardsCheckCaptcha: url+"user/cards/check-captcha", //验证短信验证码,并删除银行卡
			agentCreate: url+"user/agent/create-user", //代理商开户
			agentSalesStat: url+"user/agent/sales-stat", //团队销量统计
			arentTransferPoints: url+"user/agent/transfer-points", //转账
			getLotteryRecord: url+"lottery/lottery/get-new-lotty-result", // 获取开奖记录
			getLotteryClass: url+"lottery/lottery/class", // 获取彩票种类信息
			getLotteryList: url+"lottery/lottery/list", //获取历史开奖记录
			getLotteryBetsList: url+"lottery/user/bets-list", //获取用户投注列表
			lotteryUserBets: url+"lottery/user/bets", //购买彩票
			lotteryUserPay: url+"lottery/user/pay-bets", //支付彩票
			lotteryUserDelete: url+"lottery/user/delete-bets", //删除彩票记录
			bannerList: url+"common/banner/list", //获取banner列表，需要传入指定位置信息
			fileUpimg: url+"common/file/upimg", //上传图片，上传成功后返回图片地址
			regionCountry: url+"common/region/country", //获取所有的国家列表
			regionStates: url+"common/region/states", //获取地区省份列表
			regionCity: url+"common/region/city", //获取城市列表
			regionLocation: url+"common/region/location", //需要获取的用户IP信息，可以用来定位用户当前是在哪
			getCaptcha: url+"user/captcha/get-captcha", //获取邮件验证码
			checkCaptcha: url+"user/captcha/check", //验证邮箱验证码
			getMsgList: url+"msg/msg/list", // 获取用户站内信列表
			msgRead: url+"msg/msg/read", // 设置站内信为已读
			checkMobile: url+"user/user/check-mobile", //  验证手机号码格式
			getSmsCaptcha: url+"user/captcha/get-sms-captcha", // 获取短信验证码
			bindMobile: url+"user/user/bind-mobile", // 绑定手机
			unbindMobile: url+"user/user/unbind-mobile", // 解绑手机
			getAgentInfo: url+"user/agent/info", // 获取代理商信息
			systemConfig: url+"common/system/config", // 获取系统配置
			agentUpdata: url+"user/agent/update", // 修改信息
			platformLogin: url+"user/platform/login-token", // 使用三方ID获取登录TOKEN
			refreshMsg: url+"msg/msg/refresh-msg", // 更新用户系统信息
			systemTime: url+"common/system/time", // 获取服务器当前时间戳
			getSubordinates: url+"user/agent/get-subordinates", // 获取下级列表
			updateInfo: url+"user/user/update", //修改用户信息
			
			bseClass: url+"lottery/lottery/bse-class", // 获取指数种类信息
			bseData: url+"lottery/lottery/bse-data", // 获取指数记录
			getPursuit: url+"lottery/lottery/get-no-times-config", // 获取追投
			betsBse: url+"lottery/user/bets-bse", // 购买指数
			
			historyList: url+"lottery/lottery/history-list", // 获取历史开奖记录(v2)  获取所有彩票最后一期开奖记录和下一期彩票   2020/12/04
			
			
			getBizTypes: url+"user/payment/get-biz-types", // 获取支付方式列表
			createWebOrder: url+"user/payment/create-web-order", // 创建网页支付订单（WEB、H5专用）
			createh5Order: url+"user/payment-lop/create-order", // 创建网页支付订单（WEB、H5专用）
			checkOrder: url+"user/payment/check-order", // 查询订单支付状态
			paymentNotify: url+"user/payment/notify", // 支付回调（系统使用）
			
			spreadInfo: url+"user/spread/info", // 获取推广用户信息
			spreadStat: url+"user/spread/stat", // 团队销量统计
			updateName: url+"user/spread/update-name", // 修改推广用户名称信息
			
			createPaytmOrder: url+"user/payment/create-paytm-order", // 创建PAYTM订单
			
			activityRecieve: url+"common/activity/recieve", // 领取任务凭证
			activityComplete: url+"common/activity/complete", // 完成任务
			
			
			activityRecieveNew: url+"common/activity/recieve-new", // 领取任务凭证(new)
			activityCompleteNew: url+"common/activity/complete-new", // 完成任务(new)
			
			
			
			createOrder: url+"user/payment-v2/create-order", // 创建订单(Rxrorpay平台)
			checkOrder: url+"user/payment-v2/check-order", // Rxrorpay平台回调
			
			activityLogin: url+"common/activity/login", // 累计登录活动参与
			getActiveConfig: url + "common/activity/get-active-config", // 累计登录活动参与参数获取

			lotteryData: url+"lottery/lottery/get-stat-lottery-data", //获取指数统计折线图
			rankingData: url+"lottery/lottery/get-ranking", //获取排行榜
			rewardData: url + "lottery/lottery/get-ranking-reward", //排行榜奖励
			getComments: url + "msg/msg/get-comments-list", //留言列表
			publishComment: url + "msg/msg/publish-comment", //留言评论
			
			
	
		}
	}

