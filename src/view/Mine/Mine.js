import * as moment from "moment";
import * as types from '../../store/types';
import globals from '../../api/config';
import axios from 'axios';
import { Toast,Dialog } from 'vant';
import AppHeader from '../../components/Header.vue';
import ClipboardJS from '../../plugin/app/clipboard.min.js';

let clickBol = true;

export default {

	data() {
		return {
			showAmount:1,
			safePercent:'',
			showDraw:false,//提现框
			bankCardList:[],
			bankCardIndex:0,
			drawAmount:'',//提现金额
			drawPassword:'',//提现密码
			showRecharge:false,
			messageNum:0,
			userInfo:{},
			showKefu:false,
			showKefuGuide:false,
			checked: true,
			src: '',
			src2: '',
			show1:false
		}
	},
	components: {
		AppHeader

	},
	computed: {
	
	},
	watch: {

	},
	mounted() {
		console.log(this.$store.state.system.systemInfo.default_avatar);
		var clipboard = new ClipboardJS('.clip-btn');
		clipboard.on('success', () => {
			if(this.$store.state.system.showGuide)return
			Toast.success(this.$store.state.system.webLang.already_copied);
		})
	},

	activated() {
	
		if(this.$store.state.system.guideType==3&&this.$store.state.system.guideIndex==2&&this.$store.state.system.showGuide) {
			//绑定手机号引导
			this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
		}
		
		if(this.$store.state.system.guideType==7&&this.$store.state.system.guideIndex==2&&this.$store.state.system.showGuide) {
			//推广员系统引导
			this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
		}
		
		if(this.$store.state.system.guideType==14&&this.$store.state.system.guideIndex==2&&this.$store.state.system.showGuide) {
			//代理咨询统引导
			this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
		}
		
		this.cardsGet();//获取银行卡列表
		this.showAmount = localStorage.getItem('showAmount') || 2
		this.getUserInfo();
		
		
		
		
//		this.getMsgListNum();
	},
	deactivated() {
		this.drawAmount = '';
		this.drawPassword = '';
		this.showKefu = false;
	},

	methods: {
		// 头像上传
		afterRead(file) {
      // 此时可以自行将文件上传至服务器
		
			this.src = file.content;
			let params = {file:this.src};
			axios.post(globals.api.fileUpimg,params)
			.then(res => {
					// console.log(res);
				if (res.data.code == 200) {
						this.show1 = true
						this.src2 = res.data.data.url;
						console.log(this.src2);
						this.portraitEdi();
				} else {
						Toast(res.data.msg)
					}
				}).catch((error)=>{
						error.msg?Toast(error.msg):''
				})
		},
		// 修改头像
		portraitEdi() {
			
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				avatar: this.src2 
			}
				axios.post(globals.api.updateInfo,params)
					.then(res => {
						this.show1 = false
					if (res.data.code == 200) {
						this.$store.state.user.info.avatar = this.src2;
						Toast.success(this.$store.state.system.webLang.success_text)
						
						}else {
							Toast(res.data.msg)
						}
					}).catch((error)=>{
							 error.msg?Toast(error.msg):''
						 })
		},
		returnBack() {
			if(this.$store.state.system.showGuide)return
			this.$router.go(-1)
		},
		openKefu() {
			if(this.$store.state.system.showGuide)return
			this.showKefu = true
		},
		toSafetyGrade() {
			if(this.$store.state.system.showGuide)return
			this.$router.push('/safetyGrade')
		},
		//下一页
		nextGuide() {
			
			if(!clickBol)return
			this.$store.state.system.guideIndex+=1;
			this.$store.state.system.guideI = 0;
			this.$store.state.system.guideTemp = '';
		
			
			if(this.$store.state.system.guideType==3&&this.$store.state.system.guideIndex==3) {
				//绑定手机号引导
				this.$router.push('/safetyGrade')
				return
			}
			
			if(this.$store.state.system.guideType==7&&this.$store.state.system.guideIndex==3) {
				//推广员系统引导
				this.$router.push('/promote')
				return
			}
			
			if(this.$store.state.system.guideType==14&&this.$store.state.system.guideIndex==3) {
				//代理咨询统引导
				this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
				this.showKefuGuide = true
				return
			}
	
			this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
			clickBol = false;
			setTimeout(()=>{
				clickBol = true
			},500)
		},
		//关闭引导页
		closeGuide() {
			document.body.style.overflow = "visible";
			this.$store.state.system.showGuide = false;
			this.$store.state.system.guideIndex = 0;
			this.$store.state.system.guideType = null;
			this.showKefuGuide = false;
			if(this.$store.state.system.registerBanner!=''){
				this.$store.state.system.showRegisterBanner = true;
			}
		  setTimeout(()=>{
			  this.$router.push('/results')
		  },500)
		},
		//未读消息数量
		getMsgListNum() {
	      	
      			var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					is_read:'N'
				}
	
				  axios.post(globals.api.getMsgList,params)
				  .then(res => {
				  		 const list = res.data.data
				  		 this.messageNum = res.data.data.length
				        
					  }).catch((error)=>{
						
		       			error.msg?Toast(error.msg):''
		       		})

		    },
		getUserInfo() {
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				ext:'show'
			}

			  axios.post(globals.api.getUserInfo,params)
			  .then(res => {
				this.safePercent = res.data.data.safe_percent;
					this.userInfo = res.data.data;
					this.$store.commit(types.UPDATE_USER_INFO, res.data.data);//更新用户信息
					console.log(this.userInfo);
		
				  }).catch((error)=>{
		
	       			error.msg?Toast(error.msg):''
	       		})
		},
		changeShowAmount(type) {
			if(type==1) {
				this.showAmount = 1;
				localStorage.setItem('showAmount',1)
			}else {
				this.showAmount = 2
				localStorage.setItem('showAmount',2)
			}
		},
		beforeClose(action, done) {
			if(action=='confirm') {
				done(false) 
			}else {
				done()
			}
			
		},
		//提现
		submitDraw() {
			if(!this.drawAmount) {
				Toast(this.$store.state.system.webLang.please_fill_in_the_withdrawal_amount)
				return
			}
			if(Number(this.drawAmount)<this.$store.state.system.systemInfo.min_draw_points) {
				Toast(this.$store.state.system.webLang.the_minimum_cash_withdrawal_is+this.$store.state.system.systemInfo.min_draw_points)
				return
			}
			if(Number(this.drawAmount)>this.$store.state.system.systemInfo.max_day_draw_points) {
				Toast(this.$store.state.system.webLang.the_maximum_cash_withdrawal_amount_is+this.$store.state.system.systemInfo.max_day_draw_points)
				return
			}
			if(this.$store.state.system.systemInfo.max_day_draw_count<1) {
				Toast(this.$store.state.system.webLang.insufficient_withdrawals)
				return
			}
			if(this.drawAmount>this.userInfo.disposable_points) {
				Toast(this.$store.state.system.webLang.insufficient_balance)
				return
			}
			if(!this.drawPassword) {
				Toast(this.$store.state.system.webLang.please_fill_in_the_fund_password)
				return
			}
				if(!clickBol) {
					return
				}
				clickBol = false;
				setTimeout(() => {
					clickBol = true;
				}, 1500)
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				card_id:this.bankCardList[this.bankCardIndex].id,
				points:this.drawAmount,
				pay_password:this.drawPassword
			}

			  axios.post(globals.api.pointsDraw,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		
			  		if(res.data.code==200) {
			  			this.drawAmount = '';
			  			this.drawPassword = '';
			  			this.showDraw = false;
			  			this.$store.dispatch(types.GET_USER_INFO);
			  			Toast.success(this.$store.state.system.webLang.success_text)
			  		}else {
			  			Toast(res.data.msg)
			  		}
					
			  		
			  		
		
				  }).catch((error)=>{
		
	       			error.msg?Toast(error.msg):''
	       		})
		},
		//获取银行卡列表
		cardsGet() {


			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token')
			}

			  axios.post(globals.api.cardsGet,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		this.bankCardList = res.data.data
		
				  }).catch((error)=>{
		
	       			error.msg?Toast(error.msg):''
	       		})
		},
		//选择银行卡
		selectBankCard(event) {
			this.bankCardIndex = event.target.value
			console.log(this.bankCardIndex)
		},
		//充值电话
		toPhone() {

		
		},
		closeBg() {
			this.showRecharge = false;
			this.showKefu = false;
		},
		//撤销提现
		cancelDraw() {
			Dialog.confirm({
			  title: this.$store.state.system.webLang.tips_text,
			  message: this.$store.state.system.webLang.revoke_withdrawal_amount
			}).then(() => {
			  	var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token')
			}

			  axios.post(globals.api.pointsDrawCancel,params)
			  .then(res => {
			  		if(res.data.code==200) {
			  			this.$store.dispatch(types.GET_USER_INFO);
			  			Toast.success(this.$store.state.system.webLang.success_text)
			  		}else {
			  			Toast(res.data.msg)
			  		}
			  		console.log(res.data.data)
			  		
					
				  }).catch((error)=>{
		
	       			error.msg?Toast(error.msg):''
	       		})
			}).catch(() => {
			  // on cancel
			})
		},
		//退出账号
		loginOut() {
			Dialog.confirm({
			  title: this.$store.state.system.webLang.tips_text,
			  message: 'Are you sure to login out'
			}).then(() => {
			  	localStorage.setItem('role','')
			  	this.$store.dispatch(types.LOGOUT);
			  	location.reload();
			  	this.$router.push('/login')
			  	
			}).catch(() => {
			  // on cancel
			})
		},
		openShowRecharge() {
			if(localStorage.getItem('role')=='guset') {
				Dialog.confirm({
				  message: this.$store.state.system.webLang.guset_tips
				}).then(() => {
					this.$store.dispatch(types.LOGOUT);
				 	this.$router.push({name:'login',query:{role:'guset'}})
				 	location.reload();
				})
				return
			}
			
		
			if(this.userInfo.agent_id==0 || !this.userInfo.agent_id) {
				//没有代理可以跳转充值，0算没有代理
				this.$router.push('/rechargeSelect')
			}else{
				//有代理得联系上级充值
				this.showRecharge=true
			}
			
			
//			
		},
		//打开提现
		openDraw() {
			if(localStorage.getItem('role')=='guset') {
					Dialog.confirm({
					  message: this.$store.state.system.webLang.guset_tips
					}).then(() => {
						this.$store.dispatch(types.LOGOUT);
					 	this.$router.push({name:'login',query:{role:'guset'}})
					 	location.reload();
					})
					return
				}
			if(this.userInfo.is_agent=='Y') {
				Toast(this.$store.state.system.webLang.agent_cannot_withdra)
				return
			}
			
			
//			if(this.userInfo.agent_id==0 || !this.userInfo.agent_i) {
//				//没有代理可以跳转提现，0算没有代理
				this.$router.push('/withdraw')
//			}else{
//				//有代理得联系上级提现
//				this.showDraw = true
//			}
			
			
		},
		toAccountManage() {
			if(localStorage.getItem('role')=='guset') {
					Dialog.confirm({
					  message: this.$store.state.system.webLang.guset_tips
					}).then(() => {
						this.$store.dispatch(types.LOGOUT);
					 	this.$router.push({name:'login',query:{role:'guset'}})
					 	location.reload();
					})
					return
				}
			this.$router.push('/accountManage')
		},
		toEditPassword() {
			if(localStorage.getItem('role')=='guset') {
					Dialog.confirm({
					  message: this.$store.state.system.webLang.guset_tips
					}).then(() => {
						this.$store.dispatch(types.LOGOUT);
					 	this.$router.push({name:'login',query:{role:'guset'}})
					 	location.reload();
					})
					return
				}
			this.$router.push('/editPassword')
		},
		//修改资金密码
		toEditPinNumber() {
			if(localStorage.getItem('role')=='guset') {
					Dialog.confirm({
					  message: this.$store.state.system.webLang.guset_tips
					}).then(() => {
						this.$store.dispatch(types.LOGOUT);
					 	this.$router.push({name:'login',query:{role:'guset'}})
					 	location.reload();
					})
					return
				}
			this.$router.push('/editPayPassword')
		},
		//跳转代理页面
		toAgent() {
			if(localStorage.getItem('role')=='guset') {
					Dialog.confirm({
					  message: this.$store.state.system.webLang.guset_tips
					}).then(() => {
						this.$store.dispatch(types.LOGOUT);
					 	this.$router.push({name:'login',query:{role:'guset'}})
					 	location.reload();
					})
					return
				}
			if(this.userInfo.is_agent=='Y') {
				this.$router.push('/agent')
			}else {
				Toast(this.$store.state.system.webLang.become_agent_text)
			}
			
		},
		//跳转修改信息
		toEditInfo() {
			this.$router.push('/editInfo')
		},
		//推广中心
		toPromote() {
			if(this.$store.state.system.showGuide)return
			this.$router.push('/promote')
		},
		closeBtn() {
			this.showKefu = false;
		},
		//跳转语言设置
		toSettingLang() {
			this.$router.push('/settingLanguage')
		},
		stopKeyBoaddText() {
			this.$store.dispatch(types.STOP_KEYBOARD_TEXT) 
		},
	}
};