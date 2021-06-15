import Tabbar from '../../components/Tabbar.vue';
import Recharge from '../../components/recharge-dialog.vue';
import * as moment from "moment";
import * as types from '../../store/types';
import globals from '../../api/config';
import axios from 'axios';
import { Toast,Dialog } from 'vant';
import ClipboardJS from '../../plugin/app/clipboard.min.js';
import IndexHeader from '../../components/IndexHeader.vue';
import FloatBall from '../../components/FloatBall.vue';
import LotteryNotice from '../../components/LotteryNotice.vue';
let clickBol = true
export default {
	data() {
		return {
			lotteryClassShow:false,
			lotteryClass:[],
			lotteryIndex:0,//所选彩种下标
			lotteryBetsList:[],
			showPayPwd:false,//支付密码弹出框
			clickBol:false,
			payPassword:'',//支付密码
			currentPage:1,
			reqLoading:1,
			scrollTop: 0,
			REQUIRE: true,
			loading: false,
			isLoading:false,
			lotteryBetsListNum:'',
			lotteryDetail:{},
			showDialog:false,
			lotteryName:'',
			showRecharge:false,//充值
			bseInfo:{},
			systemTimer:null,
			sysTime:'',
			role:'',
			activeNames:[],
			channel:''

		}
	},
	components: {
		Tabbar,
		Recharge,
		IndexHeader,
		FloatBall,
		LotteryNotice

	},
	computed: {
	
	},
	watch: {

	},
	mounted() {
//		var clipboard = new ClipboardJS('.clip-btn');
//		clipboard.on('success', () => {
//			Toast.success(this.$store.state.system.webLang.already_copied);
//		})
		window.addEventListener('scroll', this.scrollBottomLotteryBetsList);
		
	},
	beforeDestroy(){
	   window.removeEventListener("scroll",this.scrollBottomLotteryBetsList)
	},
	activated() {
		this.getLotteryClass();//获取彩票种类信息
		if(window.localStorage.getItem('channel')) {
			this.channel = window.localStorage.getItem('channel')
		}
		if(window.location.href.includes('channel') ) {
			//拿到渠道码参数后存在本地
			window.localStorage.setItem('channel',this.$route.query.channel)
			this.channel = this.$route.query.channel
		}
		
		
		if(this.$store.state.system.guideType==1&&this.$store.state.system.guideIndex==6&&this.$store.state.system.showGuide) {
			//那加兰购彩引导
			this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
		}
		
		if(this.$store.state.system.guideType==1&&this.$store.state.system.guideIndex==14&&this.$store.state.system.showGuide) {
			//那加兰购彩引导/比特币汇率购彩引导
			this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
		}
		
//		if(window.location.href.includes('ios')||window.location.href.includes('android')||window.location.href.includes('download')||window.location.href.includes('fromType')) {
//			
//		}else {
//			let ua = navigator.userAgent.toLowerCase();
//	        //Android终端
//	        let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;  
//	　　   //Ios终端
//	        let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
//			 if (/(Android)/i.test(navigator.userAgent)) {
//				this.$store.state.system.showAndroid = true;
//			}
//			
//		}
	
	},
	deactivated() {
		this.reqLoading = false;
		this.role = '';
	},

	methods: {
		//获取彩票种类信息
		getLotteryClass() {
	
			axios.post(globals.api.getLotteryClass).then((res)=>{
				this.lotteryClass = res.data.data;
				
				
				
//				axios.post(globals.api.bseClass).then((res1)=>{
//			
//					this.lotteryClass[3] = res1.data.data[0]
					var temp = {name:this.$store.state.system.webLang.All,id:'',color:'#6173D5'}
					this.lotteryClass.unshift(temp)
					console.log(this.lotteryClass)

//	       		}).catch((error1)=>{})
		
		
	
				this.getLotteryBetsList();//获取用户投注列表
				

       		}).catch((error)=>{})
		},
		//选择彩种
		onSelectLotteryClass(item) {
			console.log(item)
			for(let i = 0;i<this.lotteryClass.length;i++) {
				this.lotteryClass[i].color = ''
				if(item.id==this.lotteryClass[i].id) {
					this.lotteryIndex = i;
				}
			}
			item.color = '#6173D5'
			this.lotteryClassShow = false;
			this.currentPage = 1;
		
			this.getLotteryBetsList(item.id); //获取用户投注列表
		},
		scrollBottomLotteryBetsList() {
			let osTop = document.documentElement.scrollTop || document.body.scrollTop;
			

			if(((window.screen.height + osTop) > (document.body.clientHeight-50)) && this.REQUIRE) {

				if(this.lotteryBetsListNum!=15) {
					return
				}
				this.REQUIRE = false;
				this.loading = true;
				this.currentPage += 1;
				this.getLotteryBetsList()

				
			}
		},
		//获取服务器时间
		getSystemTime() {
			axios.post(globals.api.systemTime).then((res)=>{
				
//				this.sysTimeA = res.data.data;
				
				setTimeout(()=>{
					
				},1000)
				
				
				clearInterval(this.systemTimer)
	
				var systemTime = new Date(res.data.data).getTime()
				this.systemTimer = setInterval(()=>{
					systemTime+=1000;
					this.sysTime = systemTime;
//					console.log(this.sysTime)
				},1000)
				
				
			}).catch((error)=>{})
		},
		//获取用户投注列表
		getLotteryBetsList() {
			this.reqLoading = true;
			var params = {
				UserId:localStorage.getItem('userId'),
				UserToken:localStorage.getItem('token'),
				lottery_id: this.lotteryIndex==0?'':this.lotteryClass[this.lotteryIndex].id==10000?'':this.lotteryClass[this.lotteryIndex].id, //彩票ID
				lottery_type: this.lotteryIndex==0?'':this.lotteryClass[this.lotteryIndex].type,//彩种
				status:'1,3', //状态,多个条件用逗号分隔 1待支付 2未付费 3待开奖 5中奖 7未中奖 10追投中 11追投结束
				page:this.currentPage,
				limit:15
			}

			axios.post(globals.api.getLotteryBetsList,params).then((res)=>{	
				if(res.data.code==200) {
					
					if (this.currentPage == 1) {
		              	this.lotteryBetsListNum = res.data.data.length;
//		              	console.log(this.lotteryBetsListNum)
		              	var temp = res.data.data
						
						console.log(temp)
						
						
						
						var map = {},
						dest = [];
						for(var i = 0; i < temp.length; i++){
						    var ai = temp[i];
						    if(!map[ai.lottery_no_id]){
						        dest.push({
						            lottery_no_id: ai.lottery_no_id,
						            list: [ai],
						            lottery_type: ai.lottery_type
						        });
						        map[ai.lottery_no_id] = ai;
						    }else{
						        for(var j = 0; j < dest.length; j++){
						            var dj = dest[j];

						            if(dj.lottery_no_id == ai.lottery_no_id&&dj.lottery_type==ai.lottery_type){
						                dj.list.push(ai);
						                break;
						            }
						        }
						    }
						}
						this.lotteryBetsList = dest
						console.log(dest);
						
						
						
						
//						var tempId = [];
//						for(let i = 0;i<this.lotteryBetsList.length;i++) {
//							for(let j = 0;j<this.lotteryBetsList[i].list.length;j++) {
//								tempId.push(this.lotteryBetsList[i].list[j].id)
//							}
//						}
//						
//			
//						this.activeNames = tempId
						
						console.log(this.activeNames)
						
						
						
						//下期开奖倒计时
//						var now = new Date(this.sysTime);
//						var year = now.getFullYear();
//					    var mon = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
//					    var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
//						var hour = now.getHours();
//						var minute = now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes();
//						
//						var nowTime = hour+''+minute
						
//						var lotteryClassTemp = this.lotteryClass.slice(1);//临时
//	
//				console.log(lotteryClassTemp)
////						
//						var arr  = lotteryClassTemp.map((item) => {
////							var statTime = year+'-'+mon+'-'+day+' '+ item.lottery_time+':00'
//					
//					          return {
//					            id: item.id,
//					            name: item.name,
////					            lottery_time: Number(nowTime)>Number((item.lottery_time).replace(':',""))?(new Date(statTime).getTime()+24*60*60*1000)/1000:(new Date(statTime).getTime())/1000,
//					            list: [],
//					            type:item.type?item.type:2
//					          };
//
//			      		});
//
//
//					
//						console.log(arr)
//			
//			
//						
//
//						for(let i = 0;i<arr.length;i++) {
//							for(let j = 0;j<temp.length;j++) {
//								if(arr[i].id==temp[j].lottery_no_info.lottery_id&&arr[i].type==temp[j].lottery_no_info.lottery_type) {
//									arr[i].list.push(temp[j])
//								}
//							}
//				
//						}
//					
//
//						this.lotteryBetsList = arr;
						
					
					}else {
						
						var temp = res.data.data;
						this.lotteryBetsListNum = res.data.data.length;
						console.log(this.lotteryBetsListNum)
						var map = {};
						var dest = this.lotteryBetsList;
						for(var i = 0; i < temp.length; i++){
						    var ai = temp[i];
						    if(!map[ai.lottery_no_id]){
						        dest.push({
						            lottery_no_id: ai.lottery_no_id,
						            list: [ai],
						            lottery_type: ai.lottery_type
						        });
						        map[ai.lottery_no_id] = ai;
						    }else{
						        for(var j = 0; j < dest.length; j++){
						            var dj = dest[j];

						            if(dj.lottery_no_id == ai.lottery_no_id&&dj.lottery_type==ai.lottery_type){
						                dj.list.push(ai);
						                break;
						            }
						        }
						    }
						}
						this.lotteryBetsList = dest
						console.log(dest);
						
//						var tempId = [];
//						for(let i = 0;i<this.lotteryBetsList.length;i++) {
//							for(let j = 0;j<this.lotteryBetsList[i].list.length;j++) {
//								tempId.push(this.lotteryBetsList[i].list[j].id)
//							}
//						}
//						
//			
//						this.activeNames = tempId	

					
				
						
						
						
					}
					this.REQUIRE = true;
					this.loading = false;
					this.reqLoading = false;
//					console.log(new Date(this.lotteryBetsList[0].lottery_time*1000))
				}

       		}).catch((error)=>{
       			console.log(error)
       			this.reqLoading = false;
       			error.msg?Toast(error.msg):''
       		})
		},
		//关闭彩种选择弹窗
		onCancel() {
			this.lotteryClassShow = false;
		},
		//付款
		toPay(item,name) {
			console.log(item)
			this.lotteryDetail = item;
			this.showDialog = true;
			this.lotteryName = name
//			Dialog.confirm({
//			  title: ,
//			  message: 'Rs '+item.points+' (Balance：Rs '+this.userInfo.points+')',
//			  cancelButtonText:this.$store.state.system.webLang.confirm_payment,
//			  confirmButtonText:this.$store.state.system.webLang.delete_number,
//			  confirmButtonColor:'#323233',
//			  cancelButtonColor:'#1989fa',
//			  overlay:false
//			}).then(() => {
//				//删除彩票记录
//			  
//			}).catch(() => {
//				//打开支付密码
//				this.showPayPwd = true;
//
//			});
		},
		//删除彩票
		lotteryUserDelete() {
			var params = {
				UserId:localStorage.getItem('userId'),
				UserToken:localStorage.getItem('token'),
				bets_id:this.lotteryDetail.id
			}
		  axios.post(globals.api.lotteryUserDelete,params).then((res)=>{
				
				if(res.data.code==200) {
					Toast.success(this.$store.state.system.webLang.success_text)
					this.currentPage = 1;
					this.getLotteryBetsList(); //获取用户投注列表
				}else {
					Toast(res.data.msg)
				}
			
			
			
       		}).catch((error)=>{
       			error.msg?Toast(error.msg):'';
   		})
		},
		getNumFormat(value) {
			if(!value) return '0.00';
			   var intPart = Number(value).toFixed(0); //获取整数部分
			   var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
			   var floatPart = ""; //预定义小数部分
			   var value2Array = value;
			   //=2表示数据有小数位
			   if(value2Array.length == 2) {
			    floatPart = value2Array[1].toString(); //拿到小数部分
			    if(floatPart.length == 1) { //补0,实际上用不着
			     return intPartFormat;
			    } else {
			     return intPartFormat;
			    }
			   } else {
			    return intPartFormat + floatPart;
			   }
		},
		//支付彩票
		lotteryUserPay() {
//			if(!this.payPassword) {
//				Toast(this.$store.state.system.webLang.enter_the_payment_password)
//				return;
//			}

			this.clickBol = true;
			var params = {
					UserId:localStorage.getItem('userId'),
					UserToken:localStorage.getItem('token'),
					bets_id:this.lotteryDetail.id
				}
			  axios.post(globals.api.lotteryUserPay,params).then((res)=>{
				
				if(res.data.code==200) {
					this.showPayPwd = false;
					Toast.success(this.$store.state.system.webLang.Successfully_purchased)
					
				}else {
					Toast(res.data.msg)
				}
				
				this.clickBol = false;
				this.payPassword = '';
	       		}).catch((error)=>{
	       			error.msg?Toast(error.msg):'';
	       			this.clickBol = false;
	       		})
		},
		//打开支付密码
		openPayPassword() {
			//购买前先判断余额是否足够
				if(this.$store.state.user.info.points<6) {
					Toast('Insufficient balance, please reload')
		       		this.showRecharge =true;
					return
				
				}
				
				this.lotteryUserPay();
				
				//判断是否设置支付密码
//				console.log()
//				if(this.userInfo.is_pay_password=='N') {
//					Dialog.confirm({
//					  title: this.$store.state.system.webLang.tips_text,
//					  message: 'Please set your pin number and banking details on your profile'
//					}).then(() => {
//					  this.$router.push('/editPayPassword')
//					}).catch(() => {
//					  // on cancel
//					});
//					return
//				}
//				
//			
//			this.showPayPwd=true;
//			setTimeout(() => {
//		       if (this.$refs.passwordInput) this.$refs.passwordInput.focus()
//		    }, 300)
		},
		closeBg() {
			this.showDialog = false;
			this.showPayPwd = false;
			this.showRecharge = false;
		},
		beforeClose(action, done) {
			if(action=='confirm') {
				done(false) 
			}else {
				done()
			}
			
		},
		//充值电话
		toPhone() {
			window.location.href = 'tel://'+this.$store.state.system.rechargeMobile
		},
		toTop() {
			window.scrollTo(0,0)
		},
		tips(index) {
			console.log(index)
			var clipboard = new ClipboardJS('.clip-btn');
	
			clipboard.on('success', () => {
				if(index==2) {
					Toast.success(this.$store.state.system.webLang.already_copied);
				}
				
				clipboard.destroy(); 
				return
			})
		},
		//下一页
		nextGuide() {
			
			if(!clickBol)return
			
			this.$store.state.system.guideIndex+=1;
			this.$store.state.system.guideI = 0;
			this.$store.state.system.guideTemp = '';
			if(this.$store.state.system.guideType==1&&this.$store.state.system.guideIndex==7) {
				//那加兰购彩引导
				this.$router.push('/results')
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
			
			this.$store.dispatch(types.GET_USER_INFO);

			if(this.$store.state.system.registerBanner!=''){
				this.$store.state.system.showRegisterBanner = true;
			}
			if(this.$store.state.system.langType=='en') {
				Toast('You complete the tutorial, we have Rs.'+this.$store.state.system.guidePoints+' for you as welcome bonus! ')
			}else {
				Toast('आप ट्यूटोरियल पूरा करते हैं, हमारे पास स्वागत बोनस के रूप में आपके पास' +this.$store.state.system.guidePoints+ 'रुपये हैं!')
			}
			
			setTimeout(()=>{
				this.$router.push('/results')
			},900)
				
		
			document.body.style.overflow = "visible";
			this.$store.state.system.showGuide = false;
			this.$store.state.system.guideIndex = 0;
			this.$store.state.system.guideType = null;
			
			
//			var params = {
//				UserId: localStorage.getItem('userId'),
//				UserToken: localStorage.getItem('token'),
//				id:11,
//				act_token:this.act_token
//			}
//			
//		  	axios.post(globals.api.activityComplete,params)
//		  	.then(res => {
//		  		console.log(res.data.data.points)
//		  		
//		  		
////				this.$router.push({name:'lottery',query:{type:2,id:2}})
//				this.$router.push('/lottery')
//			  }).catch((error)=>{
//	
//     			error.msg?Toast(error.msg):''
////     			this.$router.push({name:'lottery',query:{type:2,id:2}})
//				this.$router.push('/lottery')
//     		})
			
		},
		stopKeyBoaddText() {
			this.$store.dispatch(types.STOP_KEYBOARD_TEXT) 
		},


	}
};