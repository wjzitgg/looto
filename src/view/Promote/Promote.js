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
			showAmount:false,
			safePercent:25,
			showDraw:false,//提现框
			tabList:[],
			tabListEn:['Registration Link','Statistics'],
			tabListyd:['पंजीकरण लिंक','आंकड़े'],
			tabIndex:0,
			userName:'',
			errorMsgA:'',
			agentType:'1',//开户类型
			agentLink:'https://www.national-lottery.co.uk/',
			agentLinkA:'',
			bankCardList:[],
			bankCardIndex:0,
			drawAmount:'',//提现金额
			drawPassword:'',//提现密码
			calendarShow:false,//日历显示
			minDate:new Date(new Date().getTime()-60*60*24*365*1000),
			maxDate:new Date(new Date().getTime()),
			defaultDate:[new Date(new Date().getTime()-60*60*24*30*1000),new Date(new Date().getTime())],
			reqDate:[new Date(new Date().getTime()-60*60*24*30*1000),new Date(new Date().getTime())],
			selsetDateStart:moment(new Date().getTime()-60*60*24*30*1000).format('MM/DD'),
			selsetDateEnd:moment(new Date().getTime()).format('MM/DD'),
			showRecharge:false,//充值显示
			showTransfer:false,//转账申请显示
			transferUsername:'',//转账接收用户账号或ID
			transferAmount:'',//转账金额
			submitBol:false,
			salesList:[],//团队销量
			copyAccoutShow:false, 
			total:{
				all_recharge_points:0,
				all_draw_points:0,
				all_bet_points:0
			},
			Subordinates:[],
			showQuestion:false,
			userInfo:{},
			showUserInfo:false,
			downLineUserInfo:{},//下线用户信息
			showchangeName:false,
			newUserName:'',
			clickBol:false,
			reqLoading:false,
			showKefu:false,
			showImg:false,
			dataURL:[]
			
		}
	},
	components: {
		AppHeader

	},
	computed: {
		
	},
	watch: {
		tabIndex(val) {
			if(val==1) {
				this.agentSalesStat();//团队销量统计
				if(this.$store.state.system.showGuide&&this.$store.state.system.guideType==7&&this.$store.state.system.guideIndex==5) {
					this.nextGuide()
				}
			}else if(val==3) {
				this.getSubordinates();//下级列表
			}else if(val==4) {
				return
			}
		}
	},
	mounted() {
		var clipboard = new ClipboardJS('.clip-btn');
		clipboard.on('success', () => {
			Toast.success(this.$store.state.system.webLang.already_copied);
		})
	},

	activated() {
		if(localStorage.getItem('lang')=='hi') {
			this.tabList = this.tabListyd
		}else {
			this.tabList = this.tabListEn
		}
		this.cardsGet();///获取银行卡列表
		this.showAmount = localStorage.getItem('showAmount') || 2;
		this.getUserInfo();
		
		if(this.$store.state.system.guideType==7&&this.$store.state.system.guideIndex==3&&this.$store.state.system.showGuide) {
			//推广员系统引导
			this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
		}

		
	},
	deactivated() {
		this.drawAmount = '';
		this.drawPassword = '';
		this.showRecharge = false;
		this.showTransfer = false;
		this.submitBol = false;
		this.copyAccoutShow = false;
		this.showQuestion = false;
		this.showUserInfo = false;
		this.newUserName = '';
		this.showKefu = false;
		this.showImg = false;
	},

	methods: {
		returnBack() {
			this.$router.go(-1)
		},
		//下一页
		nextGuide() {
			
			if(!clickBol)return
			this.$store.state.system.guideIndex+=1;
			this.$store.state.system.guideI = 0;
			this.$store.state.system.guideTemp = '';
		
		
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
			if(this.$store.state.system.registerBanner!=''){
				this.$store.state.system.showRegisterBanner = true;
			}
		  setTimeout(()=>{
			  this.$router.push('/results')
		  },500)
		},
		openImg() {
			this.dataURL.push(this.userInfo.invitation_qrcode)
			this.showImg = true;
		},
		openUserInfo(item) {
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				user_id:item.id,
			}
			this.reqLoading = true;

			axios.post(globals.api.spreadInfo,params)
			  	.then(res => {
					this.downLineUserInfo = res.data.data;
					console.log(this.downLineUserInfo)
					this.showUserInfo = true;
					this.reqLoading = false;
				  }).catch((error)=>{
					this.reqLoading = false;
	       			error.msg?Toast(error.msg):''
	       		})
		},
		openShowchangeName() {
			this.showchangeName = true;
			setTimeout(() => {
		       if (this.$refs.payInput) this.$refs.payInput.focus()
		    }, 300)
		},
		//修改推广用户名称信息
		updateName() {
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				user_id:this.downLineUserInfo.id,
				name:this.newUserName
			}
			
			
			if(!this.newUserName) {
				Toast(this.$store.state.system.webLang.please_enter_a_new_nickname)
				return
			}
			
			this.clickBol = true;

			  axios.post(globals.api.updateName,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		if(res.data.code==200) {
			  			Toast(this.$store.state.system.webLang.success_text)
			  			this.showchangeName = false;
			  			this.openUserInfo(this.downLineUserInfo);
			  			this.agentSalesStat(); //团队销量统计
			  			this.newUserName = '';
			  		}else {
//			  			Toast(res.data.msg);
			  		}
			  	
			  		setTimeout(()=>{
			  			this.clickBol = false;
			  		},1000)
		
				  }).catch((error)=>{
					setTimeout(()=>{
			  			this.clickBol = false;
			  		},1000)
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
				this.userInfo = res.data.data;
//				this.toImage()
		
		
				  }).catch((error)=>{
		
	       			error.msg?Toast(error.msg):''
	       		})
		},
//		toImage() {
//			var _this = this;
//
//         
//              let formdata = new FormData();
//				formdata.append('file', this.userInfo.invitation_qrcode);
//				let config = {
//					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//				};
//              //上传base64格式获取图片
//					axios.post(globals.api.fileUpimg, formdata, config).then((res) => {
//			console.log(res.data.data.url)
//						_this.dataURL.push(res.data.data.url);
//						console.log(_this.dataURL)
//			       		_this.showImg = true;
//						}).catch((error) => {});
//   
//      },
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
		formatDate(date) {

	      return `${(date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)}/${date.getDate()<10?'0'+date.getDate():date.getDate()}`;
	    },
	    onConfirm(date) {
	      const [start, end] = date;
	      this.calendarShow = false;
	      
	      this.reqDate = date;
			this.selsetDateStart = `${Number(this.formatDate(start))<10?'0'+this.formatDate(start):this.formatDate(start)}`;
			this.selsetDateEnd = `${this.formatDate(end)}`;

	      console.log(this.selsetDateStart)
	      this.currentPage = 1;
	
	      this.agentSalesStat();
	    },
	    onSelect(date) {
	    	console.log(date)
	    	this.selsetDateStart = this.formatDate(date[0]);
			this.selsetDateEnd = this.formatDate(date[1]);
	    },
	    selectList(date) {
	    	var now = new Date().getTime()
	    	if(date=='Yesterday') {
	    		this.reqDate = [new Date(new Date().getTime()-60*60*24*1000),new Date(new Date().getTime())]
	    	}else if(date=='week') {
	    		this.reqDate = [new Date(new Date().getTime()-60*60*24*7*1000),new Date(new Date().getTime())]
	    	}else if(date=='month') {
	    		this.reqDate = [new Date(new Date().getTime()-60*60*24*30*1000),new Date(new Date().getTime())]
	    	}
	    	this.calendarShow = false;
	    	this.selsetDateStart = `${Number(this.formatDate(this.reqDate[0]))<10?'0'+this.formatDate(this.reqDate[0]):this.formatDate(this.reqDate[0])}`;
			this.selsetDateEnd = `${this.formatDate(this.reqDate[1])}`;
			this.defaultDate = this.reqDate;//默认选择
	    	this.currentPage = 1;
	
	      	this.agentSalesStat();
	    },
	    closeBg() {
			this.showRecharge = false;
			this.copyAccoutShow = false;
			this.showQuestion = false;
			this.showKefu = false;
		},
		//充值电话
		toPhone() {
			window.location.href = 'tel://'+this.$store.state.system.rechargeMobile
		},
		//转账
		arentTransferPoints(){
			if(!this.transferUsername) {
				Toast(this.$store.state.system.webLang.please_fill_in_the_payee_account_or_Id)
				return
			}
			if(!this.transferAmount) {
				Toast(this.$store.state.system.webLang.please_fill_in_the_transfer_amount)
				return
			}
			if(!this.drawPassword) {
				Toast(this.$store.state.system.webLang.please_fill_in_the_fund_password)
				return
			}
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				username:this.transferUsername,//接收用户账号或ID
				points:this.transferAmount,
				pay_password:this.drawPassword
			}

			  axios.post(globals.api.arentTransferPoints,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		if(res.data.code==200) {
			  			this.showTransfer = true;
			  			this.$store.dispatch(types.GET_USER_INFO);
			  			Toast.success(this.$store.state.system.webLang.success_text)
			  		}else {
			  			Toast(res.data.msg);
			  		}
			  		
			  		
		
				  }).catch((error)=>{
		
	       			error.msg?Toast(error.msg):''
	       		})
		},
		//代理商开户
		agentCreate() {
			if(!this.userName) {
				Toast(this.$store.state.system.webLang.please_fill_in_the_userName)
				return
			}
			this.submitBol = true;
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				username:this.userName,//接收用户账号或ID
				is_agent:this.agentType==1?'N':'Y'//是否代理商 N普通用户 Y代理商

			}

			  axios.post(globals.api.agentCreate,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		if(res.data.code==200) {
			  			Toast.success(this.$store.state.system.webLang.success_text)
			  		}else {
			  			Toast(res.data.msg);
			  		}
			  		setTimeout(()=>{
			  			this.submitBol = false;
			  		},1000)
			  		
		
				  }).catch((error)=>{
					setTimeout(()=>{
			  			this.submitBol = false;
			  		},1000)
	       			error.msg?Toast(error.msg):''
	       		})
		},
		//修改邀请链接
		agentUpdata(type,index) {
			Dialog.confirm({
			  title: this.$store.state.system.webLang.tips_text,
			  message: this.$store.state.system.webLang.modify
			}).then(() => {
			  var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				field_key:type=='agent'?'agent_invitation_is_open':'invitation_is_open',//普通邀请码invitation_is_open，代理商邀请码agent_invitation_is_open
				field_value:index==1?'N':'Y'//Y是 N否

			}

			  axios.post(globals.api.agentUpdata,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		if(res.data.code==200) {
			  			this.$store.dispatch(types.GET_USER_INFO);
			  			Toast.success(this.$store.state.system.webLang.success_text)
			  		}else {
			  			Toast(res.data.msg);
			  		}
			  	
			  		
		
				  }).catch((error)=>{
					
	       			error.msg?Toast(error.msg):''
	       		})
			}).catch(() => {
			  // on cancel
			});
			
		},
		//团队销量统计
		agentSalesStat() {
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				start_time:String(new Date(this.reqDate[0]).getTime()).substring(0,String(new Date(this.reqDate[0]).getTime()).length-3),
				end_time:String(new Date(this.reqDate[1]).getTime()+60*60*24*1000).substring(0,String(new Date(this.reqDate[1]).getTime()).length-3)
				//日历是按当天0点算的，加上一天才能请求到当天数据
			}

			  axios.post(globals.api.spreadStat,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		if(res.data.code==200) {
			  			this.salesList = res.data.data;
			  			console.log(this.salesList.data.length)
			  			var all_recharge_points = 0;
			  			var all_draw_points = 0;
			  			var all_bet_points = 0;
			  			for(let i = 0;i<this.salesList.data.length;i++) {
			  				console.log(this.salesList.data[i])
			  				all_recharge_points+=this.salesList.data[i].recharge_points;
			  				all_draw_points+=this.salesList.data[i].draw_points;
			  				all_bet_points+=this.salesList.data[i].bets_points;
			  			}
			  			this.total.all_recharge_points = all_recharge_points;
			  			this.total.all_draw_points = all_draw_points;
			  			this.total.all_bet_points = all_bet_points;
			  		}else {
//			  			Toast(res.data.msg);
			  		}
			  	
			  		
		
				  }).catch((error)=>{
				
	       			error.msg?Toast(error.msg):''
	       		})
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
			  		console.log(res.data.data)
			  		
			  		if(res.data.code==200) {
			  			this.$store.dispatch(types.GET_USER_INFO);
			  			Toast.success(this.$store.state.system.webLang.success_text)
			  		}else {
			  			Toast(res.data.msg)
			  		}
					
				  }).catch((error)=>{
		
	       			error.msg?Toast(error.msg):''
	       		})
			}).catch(() => {
			  // on cancel
			})
		},
		//打开提现
		openDraw() {
			if(this.userInfo.is_agent=='Y') {
				Toast(this.$store.state.system.webLang.agent_cannot_withdra)
				return
			}
			
			this.$router.push('/withdraw')
			
//			this.showDraw = true
		},
		//获取下级列表
		getSubordinates() {
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token')
			}

			  axios.post(globals.api.getSubordinates,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		if(res.data.code==200) {
			  			this.Subordinates = res.data.data;
			  			console.log(res.data.data,this.Subordinates)
			  		}else {
//			  			Toast(res.data.msg);
			  		}
			  	
			  		
		
				  }).catch((error)=>{
				
	       			error.msg?Toast(error.msg):''
	       		})
		},
		getTime(val) {
			return moment(val).format('MM/DD hh:mm:ss')
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
		},
		closeBtn() {
			this.showKefu = false;
		},
		stopKeyBoaddText() {
			this.$store.dispatch(types.STOP_KEYBOARD_TEXT) 
		},
	
	}
};