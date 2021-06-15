import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'
import * as types from './store/types'

const Purchase = () => System.import('./view/Lottery/Lottery.vue') //购买彩票页
const Rules = () => System.import('./view/Lottery/Rules.vue') //规则

const Predict = () => System.import('./view/Predict/Predict.vue') //统计

const Results = () => System.import('./view/Results/Results.vue') //结果
const HisResults = () => System.import('./view/Results/HisResults.vue') //开奖历史
const Video = () => System.import('./view/Results/Video.vue') //开奖视频

const Tickets = () => System.import('./view/Tickets/Tickets.vue') //Tickets
const HisTickets = () => System.import('./view/Tickets/HisTickets.vue') //HisTickets

const Register = () => System.import('./view/Login/Register.vue') //注册
const ForgotPassword = () => System.import('./view/Login/ForgotPassword.vue') //忘记密码
const Login = () => System.import('./view/Login/Login.vue') //登录
const Loading = () => System.import('./view/Login/Loading.vue') //进度条加载
const EditPassword = () => System.import('./view/Login/EditPassword.vue') //修改密码
const EditPayPassword = () => System.import('./view/Login/EditPayPassword.vue') //设置资金密码

const Mine = () => System.import('./view/Mine/Mine.vue') //个人中心
const AccountManage = () => System.import('./view/Mine/AccountManage.vue') //收款账户管理
const SafetyGrade = () => System.import('./view/Mine/SafetyGrade.vue') //安全中心
const BindMail = () => System.import('./view/Mine/BindMail.vue') //绑定邮箱
const BindMobile = () => System.import('./view/Mine/BindMobile.vue') //绑定手机
const Message = () => System.import('./view/Mine/Message.vue') //站内信件
const ChangeRecord = () => System.import('./view/Mine/ChangeRecord.vue') //资金变动记录
const Wallet = () => System.import('./view/Mine/Wallet.vue') //钱包
const AddBankCard = () => System.import('./view/Mine/AddBankCard.vue') //添加银行卡
const RechargeSelect = () => System.import('./view/Mine/RechargeSelect.vue') //选择充值

const EditInfo = () => System.import('./view/Login/EditInfo.vue') //修改信息

const Agent = () => System.import('./view/Agent/Agent.vue') //代理中心

const PcTips = () => System.import('./view/Login/PcTips.vue') //pc打开提示

const Recharge = () => System.import('./view/Mine/Recharge.vue') //充值
const Withdraw = () => System.import('./view/Mine/Withdraw.vue') //提现

const Download = () => System.import('./view/Download/Download.vue') //下载
const Download2 = () => System.import('./view/Download/Download2.vue') //下载

const Guide = () => System.import('./view/Guide/Guide.vue') //新手引导页

const Promote = () => System.import('./view/Promote/Promote.vue') //推广中心

const Paytm = () => System.import('./view/Pay/Paytm.vue') //paytm

const PayStatus = () => System.import('./view/Mine/PayStatus.vue') //支付状态

const SettingLanguage = () => System.import('./view/Mine/SettingLanguage.vue') //语言设置

const PreviewWord = () => System.import('./view/PreviewWord/PreviewWord.vue') //预览word文档

Vue.use(VueRouter)

const routes = [
	//地址为空时跳转home页面
	{
		path: '/',
		name: 'index',
		redirect: '/purchase'
	},
	//Results
	{
		path: '/results',
		name: 'results',
		component: Results,
		meta: {
			title: ''
		}
	},
	//Video
	{
		path: '/video',
		name: 'video',
		component: Video,
		meta: {
			title: 'Video'
		}
	},
	//开奖历史
	{
		path: '/hisResults',
		name: 'hisResults',
		component: HisResults,
		meta: {
			title: 'Dear Morning'
		}
	},
	//lottery
	{
		path: '/purchase',
		name: 'lottery',
		component: Purchase,
		meta: {
			title: 'purchase'
		}
	},
	//规则
	{
		path: '/rules',
		name: 'rules',
		component: Rules,
		meta: {
			title: 'Rules'
		}
	},
	//Predict
	{
		path: '/predict',
		name: 'predict',
		component: Predict,
		meta: {
			title: 'Predict',
		}
	},
	//tickets
	{
		path: '/tickets',
		name: 'tickets',
		component: Tickets,
		meta: {
			title: 'Tickets',
			requireAuth: true
		}
	},
	//HisTickets
	{
		path: '/hisTickets',
		name: 'hisTickets',
		component: HisTickets,
		meta: {
			title: 'HisTickets'
		}
	},
	//注册
	{
		path: '/register',
		name: 'register',
		component: Register,
		meta: {
			title: 'Register'
		}
	},
	//忘记密码
	{
		path: '/forgotpassword',
		name: 'forgotpassword',
		component: ForgotPassword,
		meta: {
			title: 'Forgot Password'
		}
	},
	//登录
	{
		path: '/login',
		name: 'login',
		component: Login,
		meta: {
			title: 'Log in',
			// requireAuth: true
		}
	},
	//修改密码
	{
		path: '/editPassword',
		name: 'editPassword',
		component: EditPassword,
		meta: {
			title: 'Change Password',
			requireAuth: true
		}
	},
	//设置资金密码
	{
		path: '/editPayPassword',
		name: 'editPayPassword',
		component: EditPayPassword,
		meta: {
			title: 'Setting Trade Password',
			requireAuth: true
		}
	},
	//进度条加载
	{
		path: '/loading',
		name: 'loading',
		component: Loading,
		meta: {
			title: ''
		}
	},
	//个人中心
	{
		path: '/mine',
		name: 'mine',
		component: Mine,
		meta: {
			title: 'Personal',
			requireAuth: true
		}
	},
	//账户管理
	{
		path: '/accountManage',
		name: 'accountManage',
		component: AccountManage,
		meta: {
			title: '',
			requireAuth: true
		}
	},
	//安全中心
	{
		path: '/safetyGrade',
		name: 'safetyGrade',
		component: SafetyGrade,
		meta: {
			title: 'Safety Grade',
			requireAuth: true
		}
	},
	//绑定邮箱
	{
		path: '/bindMail',
		name: 'bindMail',
		component: BindMail,
		meta: {
			title: 'Link mailbox',
			requireAuth: true
		}
	},
	//绑定手机
	{
		path: '/bindMobile',
		name: 'bindMobile',
		component: BindMobile,
		meta: {
			title: 'Link phone',
			requireAuth: true
		}
	},
	//站内信件
	{
		path: '/message',
		name: 'message',
		component: Message,
		meta: {
			title: '',
			requireAuth: true
		}
	},
	//站内信件
	{
		path: '/agent',
		name: 'agent',
		component: Agent,
		meta: {
			title: 'Agency Center',
			requireAuth: true
		}
	},
	//资金变动记录
	{
		path: '/changeRecord',
		name: 'changeRecord',
		component: ChangeRecord,
		meta: {
			title: '',
			requireAuth: true
		}
	},
	//Tips
	{
		path: '/pcTips',
		name: 'pcTips',
		component: PcTips,
		meta: {
			title: ''
		}
	},
	//钱包
	{
		path: '/wallet',
		name: 'wallet',
		component: Wallet,
		meta: {
			title: 'Funds',
			requireAuth: true
		}
	},
	//添加银行卡
	{
		path: '/addBankCard',
		name: 'addBankCard',
		component: AddBankCard,
		meta: {
			title: 'Add bank account for withdrawal',
			requireAuth: true
		}
	},
	//选择充值
	{
		path: '/rechargeSelect',
		name: 'rechargeSelect',
		component: RechargeSelect,
		meta: {
			title: '',
			requireAuth: true
		}
	},
	//修改信息
	{
		path: '/editInfo',
		name: 'editInfo',
		component: EditInfo,
		meta: {
			title: 'Edit',
			requireAuth: true
		}
	},
	//充值
	{
		path: '/recharge',
		name: 'recharge',
		component: Recharge,
		meta: {
			title: '',
			requireAuth: true
		}
	},
	//提现
	{
		path: '/withdraw',
		name: 'withdraw',
		component: Withdraw,
		meta: {
			title: '',
			requireAuth: true
		}
	},
	//下载
	{
		path: '/download',
		name: 'download',
		component: Download,
		meta: {
			title: ''
		}
	},
	//下载
	{
		path: '/download2',
		name: 'download2',
		component: Download2,
		meta: {
			title: ''
		}
	},
	//引导页
	{
		path: '/guide',
		name: 'guide',
		component: Guide,
		meta: {
			title: ''
		}
	},
	//推广中心
	{
		path: '/promote',
		name: 'promote',
		component: Promote,
		meta: {
			title: ''
		}
	},
	//Paytm
	{
		path: '/paytm',
		name: 'paytm',
		component: Paytm,
		meta: {
			title: ''
		}
	},
	//payStatus
	{
		path: '/payStatus',
		name: 'payStatus',
		component: PayStatus,
		meta: {
			title: ''
		}
	},
	//SettingLanguage
	{
		path: '/settingLanguage',
		name: 'settingLanguage',
		component: SettingLanguage,
		meta: {
			title: ''
		}
	},
	//预览word文档
	{
		path: '/previewWord',
		name: 'previewWord',
		component: PreviewWord,
		meta: {
			title: ''
		}
	}
]

const router = new VueRouter({
	mode: process.env.NODE_ENV === 'production' ? 'hash' : 'history',
	base: __dirname,
	routes: routes
})

router.beforeEach((to, from, next) => {
		
			if (to.name == "predict") {
				document.getElementsByTagName("body")[0].setAttribute("style","height:100%;overflow: hidden;");
			} else {
				document.getElementsByTagName("body")[0].setAttribute("style","overflow:visible");
			}
			// console.log(to);
			store.commit(types.PUSH_HISTORY_STATE, to.name)
			if(to.meta.requireAuth) { // 判断该路由是否需要登录权限
//				console.log(store.state.user.token)
				if(localStorage.getItem('token')) {
//					console.log(store.state.user.loginStatus)
//					if(store.state.user.loginStatus == '') {
//						store.dispatch(types.GET_LOGIN_STATUS).then(status => {
//							
//							if(status) {
//								initUserInfo()
//								next()
//							} else {
//								redirectLogin()
//							}
//						}).catch(() => {
//							redirectLogin()
//						})
//					} else {
						initUserInfo(next)
//					}
				} else {
					redirectLogin()
				}

			} else if(store.state.user.token && store.state.user.loginStatus == '') { // 不需要登录的页面，如果已登录，获取用户信息
				store.dispatch(types.GET_LOGIN_STATUS).then(status => {
					if(status) {
						initUserInfo()
					}
				})
				next()
			} else {
				next()
			}

			function redirectLogin() {
				console.log(to.fullPath)
				next({
					path: '/login',
					query: {
						redirect: to.fullPath
					}
				})
			}

			function initUserInfo(callback) {
				if(!store.state.user.hasUserInfo) {
					store.dispatch(types.GET_USER_INFO).then(() => {
//						initAfterLoginInfo()

						if(typeof callback == "function")
							callback()
					})
				} else {
					if(typeof callback == "function") {
//						initAfterLoginInfo()
						callback()
					}
				}
			}

//			function initAfterLoginInfo() {
//				store.dispatch(types.GET_BANK)
//			}

			router.beforeEach((to, from, next) => {
				/* 路由发生变化修改页面title */
//				let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
////			console.log(flag)
//			next()
//			if(!flag) {
//				router.push('/pcTips')
//				next()
////				next({
////					path: '/pcTips',
////					query: {
////						redirect: to.fullPath
////					}
////				})
//			}
				
				
				
				if(to.meta.title) {
					document.title = to.meta.title + '-FantasyLand'
				}
				next()
			})

			let allowBack = true //    给个默认值true
			if(to.meta.allowBack !== undefined) {
				allowBack = to.meta.allowBack
			}
			if(!allowBack) {
				history.pushState(null, null, location.href)
			}
			sessionStorage.setItem('allowBack',allowBack)
//			store.dispatch('updateAppSetting', {
//				allowBack: allowBack
//			})

			})

			export default router