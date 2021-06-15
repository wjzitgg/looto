import Tabbar from '../../components/Tabbar.vue';
import * as moment from "moment";
import * as types from '../../store/types';
import globals from '../../api/config';
import axios from 'axios';
import { Toast,Dialog } from 'vant';
import html2canvas from "html2canvas"
import ClipboardJS from '../../plugin/app/clipboard.min.js';
import IndexHeader from '../../components/IndexHeader.vue';
import FloatBall from '../../components/FloatBall.vue';
import LotteryNotice from '../../components/LotteryNotice.vue';
let clickBol = true;
export default {
	data() {
		return {
			lotteryClassShow:false,
			lotteryClass:[{},{}],//彩种种类
			lotteryIndex: 1,//所选彩种下标  0：指数  1：彩票
			lotteryDetailShowD:false,//开奖详情显示
			lotteryDetail2: [],//开奖详情
			lotLoading:true,
			tabCut: [
				{
					color: "",
					id: 10000,
					name:"3 Mins/Draw"
				},
				{
					color: "",
					id: 3,
					name: "Nagaland Lottery"
				},
			],
			mul:1,//倍数
//			selectList:[],//可选号码数组
			selectIndex:null,
			selectNumList:[{num:'',list:[],randomList:[]},{num:'',list:[],randomList:[]},{num:'',list:[],randomList:[]},{num:'',list:[],randomList:[]},{num:'',list:[],randomList:[]},{num:'',list:[],randomList:[]},{num:'',list:[],randomList:[]}],//已选号码数组
			selectNumIndex:0,
			selectNumTimerA:null,
			selectNumTimerB:null,
			selectNumTimerC:null,
			selectNumTimerD:null,
			selectNumTimerE:null,
			selectNumTimerF:null,
			selectNumTimerG:null,
			randomBol:false,//随机状态
			waitLotteryList:[],//待开奖记录
			flag : false,
			lotteryImg:'',
			lottery_time:'',//下期开奖时间
			countDownTime:'',
			lotteryTimer:null,
			showPayPwd:false,//支付密码弹出框
			clickBol:false,
			payPassword:'',//支付密码
			showRecharge:false,//充值
			sysTime:0,//系统时间
			chaseBol:false,//是否追投
			chaseNum:'',//追投期数
			chaseShow:false,//追投期数选择弹窗
			chaseList:[],
			bseInfo:{},//指数彩种信息
			bseDataInfo:{},
			oldBse:'',//指数上一口价
			bseTimer:null,
			systemTimer:null,//系统时间计时
//			sysTimeA:'',
			sysMonth:'',//月份
			bseClassList:[],//指数种类
			bseClassIndex:1,//指数tab
			bseTypeList:[{name:'Next Draw',type:1,select:true},{name:'Tomorrow Open',type:2,select:true},{name:'Tomorrow Highest',type:3,select:true},{name:'Tomorrow Lowest ',type:4,select:true}],
			bseTypeIndex:1,
			selectNumListBse:[{num:'',list:[],randomList:[]},{num:'',list:[],randomList:[]},{num:'',list:[],randomList:[]}],//已选号码数组
			selectNumIndexBse:0,
			bseShow:false,
			bseChaseShow:false,
			bseChaseList:[],
			lottery_no_id:'',//彩票id
			selectNumLength:9999,//可选号码数量
			selectNumLengthA:0,//已选号码数量
			role:'',
			oddEvenList:[],
			oddEvenIndex:0,
			eList:[],
			eIndex:null,
			complexBol:false,//复投详情
			reinvestDetail:false,//复投显示
			reinvestList:[],//复投列表
			reinvestLoading:false,
			numIndex:null,
			leaveBol:false,
			bseIndex:0,	//设置指数默认tbc
			bseDataLoading:false,
			futouSelectIndex:0,
			showActivity:false,
			showActivityA:false,
			activityInfo:{},
			percent:0,
			loginTimer:null,
			siteLoading:false,
			message:{},
			tempPrecent:0,
			channel:'',
			showGuideDialog: true,
			active: 1, //tab选择默认选中
			sanweishu:'',
			arrString:[],
			maxWeishu:'',	//末位数
			// hahaha:['123'],
			winningData:[],//中奖
			canData:[], //失败data
			condition: false, // 新手开关那里
			Popup: false, //失败的弹窗
			Popup2: false, //成功弹窗
			indexlr:0, //控制轮播索引
			pageA: 1,
			limit: 1,
			altogether: '',	//总条数
			altogether2: '',	//总条数
			currentPage: 1,//当前页码
			currentPage2: 1, //当前页码
			front: '',
			shuzhi: '',
			yansebolr: false, //控制点击后让别的球变暗
			balance:this.$store.state.user.info.points+this.$store.state.user.info.lotto_points,
			// audioUrl:require('../../assets/mp3/ButtonClick.mp3'),//声音文件
			coDown: false,	//倒计时
			timedow:1,
			kjloading:false,
			kaijiang: {},
			najialan15:false,
		
		}
	},
	components: {
		Tabbar,
		IndexHeader,
		FloatBall,
		LotteryNotice,
	},
	beforeRouteEnter(to, from, next) {
			console.log(to);
   		if ((from.name == 'login'||from.name == 'register')&&to.query.regType=='suc') {
	      	next(vm=>{
	            vm.siteLoading=true;
	            vm.showActivityA = true;//登录过来是否弹出活动
	            setTimeout(()=>{
		      			vm.siteLoading = false;
		      	},20000)
	        })
	       }

      	next();
    },
	computed: {
	
	},
	watch: {
		// 监听时间
		countDownTime() {
			if (this.countDownTime.min == "00" && this.countDownTime.sec <= 1) {
				this.takeoff();
			}
		
		},
		bseTypeIndex(val) {
			
		},
		bseClassIndex(val) {
		
			if (val == 2) {
				// console.log("一个球");
				this.selectNumList[0].list = this.bseInfo.bets_d_range.split(',')
				
				this.selectNumIndex = 0

				this.selectNumList[1].list = []

				this.selectNumList[2].list = []
					
				this.selectNumLength = 1;
			} else if (val == 1) {
				// console.log("监听3个球");
				this.selectNumList[0].list = this.bseInfo.bets_a_range.split(',')

				this.selectNumList[1].list = this.bseInfo.bets_b_range.split(',')

				this.selectNumList[2].list = this.bseInfo.bets_c_range.split(',')
				this.selectNumLength = 3;
			} else {
				this.selectNumList = [{ num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }];
			}
			this.resetNum();//清空选数
		},
		complexBol(val) {
			this.oddEvenIndex = 0;
			this.resetNum();//清空选数
		},
		lotteryIndex(val) {
			// console.log(this.lotteryIndex);
			//this.resetNum();//清空选数
		},
		oddEvenIndex(val) {
			console.log(val)
			this.eIndex = null;
			this.resetNum();//清空选数
		},
		bseIndex(val) {
			this.resetNum();//清空选数
		},
	
		Popup2() {
			console.log(123);
		}
	},
	mounted() {
		this.getDataB();
		this.getDataA();
//	获取追投	
		this.getChaseList();
//		var clipboard = new ClipboardJS('.clip-btn');
//		clipboard.on('success', () => {
//			Toast.success(this.$store.state.system.webLang.already_copied);
//		})


		
		
	},
	activated() {
		window.scrollTo(0,0)
		this.percent = 0;
		document.body.style.overflow = "visible";
		// 红色tab下面tab
		this.oddEvenList = [this.$store.state.system.webLang.single_or_double];
		// 上面的红色TAB
		this.bseClassList = [this.$store.state.system.webLang.single_or_double,this.$store.state.system.webLang.ending_number,this.$store.state.system.webLang.sum_number];
		// this.bseClassList = [this.$store.state.system.webLang.ending_number,this.$store.state.system.webLang.sum_number];
		this.eList = [this.$store.state.system.webLang.single,this.$store.state.system.webLang.double];
		if(this.$store.state.system.guideType==1&&this.$store.state.system.guideIndex==8&&this.$store.state.system.showGuide) {
			//比特币汇率购彩引导/比特币汇率购彩引导
			this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
		}
		
		if(window.localStorage.getItem('channel')) {
			this.channel = window.localStorage.getItem('channel')
		}
		if(window.location.href.includes('channel') ) {
			//拿到渠道码参数后存在本地
			window.localStorage.setItem('channel',this.$route.query.channel)
			this.channel = this.$route.query.channel
		}
		
		if(this.$route.query.regType=='suc') {
			//取消注册登陆弹出新手指南，默认是SENSIX指数，选择了BTC/INR彩票才弹出新手指南
			localStorage.setItem('firstReg', 1);
		}
		
		if(this.sysTime==0||this.$route.query.type) {
			this.getSystemTime();//获取服务器时间
			this.bseClass();//获取指数种类信息
		}
		
		this.mul = localStorage.getItem('mul')?localStorage.getItem('mul'):1;//获取投注倍数
		this.bseTypeIndex = localStorage.getItem('bseTypeIndex')?Number(localStorage.getItem('bseTypeIndex')):1;//获取指数玩法选项
		if (this.$store.state.system.guideIndex >= 8) {
			this.active = 0
		}
		// console.log('进入了首页');
	},
	deactivated() {
		this.mul = 1;
		this.payPassword = '';
		this.lotteryImg = '';
		this.$store.state.user.addBol = false;//清除动画
		this.role = '';
		this.percent = 0;
		this.siteLoading = false;
//		this.lotteryIndex = 0;
//		this.bseInfo = {}
//		this.oddEvenIndex = 0;
	},

	methods: {
		compare(property){
		    return function(a,b){
		        var value1 = a[property];
		        var value2 = b[property];
		        return value1 - value2;
		    }
		},
		// 停止动画
		stopAnimation() {
			this.coDown = false;
			this.randomBol = false
			this.resetNum();

		},
		// 请求追投
		getChaseList() {
			axios.post(globals.api.getPursuit)
			.then(res => {
				if (res.data.code == 200) {
					let data1 = [];
					data1 = res.data.data;
					// console.log(data1);
					data1.forEach(item => {
						this.chaseList.push({
							name: item.no_times,
							subname: `( + ${item.give_no_times} Free )`
						});
					});
				
				}
			})
		},

		// 飞
		takeoff() {
			this.coDown = true;
			if (this.active == 1) {
				this.resetNum();
				this.randomNum3();
				this.timewait();
			
			} else {
				this.resetNum();
				this.bseClassIndex = 1;
				this.randomNum3();
			
				this.timewait();
			}
		},
		// 倒计时 
		timewait() {
		let hahaha =	setInterval(() => {
				this.timedow--
			if (this.timedow == 0) {
					if (this.active == 1) {
					
						this.lotteryRecord(1,this.lotteryClass[this.lotteryIndex].id)
					} else {
						this.lotteryRecord(2,this.bseInfo.id)
					}
					clearInterval(hahaha)
				}
			}, 1000);
		},
		// 请求开奖结果
		lotteryRecord(type,id) {
				this.kjloading = true
				var params = {
					lottery_type: type,
					lottery_id: id,
					bets_type: 1
				}
			axios.post(globals.api.getLotteryRecord,params)
				.then(res => {
					if (res.data.code == 200) {
						this.kaijiang = res.data.data;
						console.log(this.kaijiang);
						
						this.randomNum2();  //这个是随机动画
						this.bseData(); //从新获取指数
						setTimeout(() => {
							this.coDown = false
							this.timedow = 1
							this.resetNum();
							this.getDataB();
							this.getDataA();
						}, 8000);
					} else {
						if (!this.coDown) {
							return;
						}
						this.randomNum3();
						this.lotteryRecord(type, id)
					}
				})
		},
		// ===========================================
		// 球声音
		qiuVoices() {
			if (this.$store.state.system.sound) {
				this.$refs.audio2.play();//点击触发 点击音效
			}
		},
		paySuccess() {
			if (this.$store.state.system.sound) {
				this.$refs.audio3.play();//点击触发 点击音效
			}
		},
		// 中奖播放
		winningPlay() {
			if (this.$store.state.system.sound) {
				setTimeout(()=>{
					this.$refs.audio4.play()
				},1000)
			
			}
		},
		// switch
		conditionStatus(){
			this.condition = !this.condition;
			console.log(this.condition);
			this.play();
			if(!this.condition) {
				this.mul = 1;
				this.chaseNum = '';
			}
		},
		//zhong点击左右
		changeSwipe(type) {
			if(type == 'up') {
				this.indexlr -= 1;
			} else if (type == 'down') {
				this.indexlr += 1;
			}
			// console.log(this.indexlr)
			this.$refs.swiper.swipeTo(this.indexlr);
			this.zhanNeibu(1,this.winningData[this.indexlr].id);
		},
		//不中奖点击左右
		changeSwipe2(type) {
			if(type == 'up') {
				this.indexlr -= 1;
			} else if (type == 'down') {
				this.indexlr += 1;
			}
			// console.log(this.canData[this.indexlr].id)
			this.$refs.swiper2.swipeTo(this.indexlr);
			this.zhanNeibu(6,this.canData[this.indexlr].id);
		
		},
		// 站内读
		zhanNeibu(number,id) {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					// id: this.canData[this.indexlr].id,
					id: id,
					type:number
					
				}
			axios.post(globals.api.msgRead,params)
				.then(res => {
					console.log(res);
				})
		},
		// 弹窗获取中奖
		getDataA() {
			let sopToken = localStorage.getItem('token');
			let myId = localStorage.getItem('userId');
			// console.log(sopToken,myId);
			if (!sopToken && !myId) {
				return
			}
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				type: 1, //1中奖通知
				is_read:"N",
			}
		axios.post(globals.api.getMsgList,params)
			.then(res => {
				// console.log(res);
				this.winningData = res.data.data;
				this.altogether = res.data.data.length;
				if (res.data.data.length > 0) {
					this.Popup2 = true;
					this.zhanNeibu(1, this.winningData[this.indexlr].id);
					
					// this.winningPlay()
				}
			}).catch((error)=>{
					 error.msg?Toast(error.msg):''
				 })

	},
		// 获取不中奖
		getDataB() {
			let sopToken = localStorage.getItem('token');
			let myId = localStorage.getItem('userId');

			if (!sopToken && !myId) {
				return
			}
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				type: 6, //不中奖
				is_read:"N",
			}
		axios.post(globals.api.getMsgList,params)
			.then(res => {
						// console.log(res);
				this.canData = res.data.data;
				this.altogether2 = res.data.data.length;
				if (res.data.data.length > 0) {
					this.Popup = true;
					this.zhanNeibu(6,this.canData[this.indexlr].id);
				}
			}).catch((error)=>{
					 error.msg?Toast(error.msg):''
				 })

		},
		//打开开奖详情
		openLotteryDetailD(item){
			if(item.extend.buyInfo.lottery_type==1) {
				//彩票
				if(!Array.isArray(item.prize_2)){
					item.prize_2 = item.prize_2.split(',')
					item.prize_3 = item.prize_3.split(',')
					item.prize_4 = item.prize_4.split(',')
					item.prize_5 = item.prize_5.split(',')
					item.prize_6 = this.getNumA(item.prize_6)
					item.list = []
					for(let i = 0;i<this.lotteryClass.length;i++) {
						if(this.lotteryClass[i].id == item.lottery_id) {
							item.list.push(this.lotteryClass[i].win_1_points,this.lotteryClass[i].win_2_points,this.lotteryClass[i].win_3_points,this.lotteryClass[i].win_4_points,this.lotteryClass[i].win_5_points,this.lotteryClass[i].win_6_points,this.lotteryClass[i].win_c_points)
						}
					}
				}
				this.lotteryDetail2 = item;
				// console.log(item)
			}else {
				//指数
				this.lotteryDetail2 = item;
				// console.log(item)
			}
			console.log(this.lotteryDetail2)
			// console.log(this.lottery_time)
			this.lotteryDetailShowD = true;
		},
		//关闭彩种选择弹窗
		onCancel() {
			this.lotteryClassShow = false;
			this.tui();
			console.log(22);
	},
	getNewTime(time) {
		if(time) {
			var timeA = new Date(time.replace(/-/g,'/')).getTime();
			return moment(timeA).format('YYYY/MM/DD');
		}
	},
		getNumA(num) {	
			var a = num.substring(0,1);
			var b = num.substring(1,2);
			var c = num.substring(2,3);

			var list = [];
			list.push(a,b,c)
			return list
		},
		//获取历史开奖记录(v2)  获取所有彩票最后一期开奖记录和下一期彩票   2020/12/04
		historyList() {
		  	axios.post(globals.api.historyList)
		  	.then(res => {
				var data = res.data.data;
				for(let i = 0;i<data.length;i++) {
					data[i].lottery_time_new = new Date((data[i].next_lottery_info.lottery_time).replace(/-/g,'/')).getTime();
				}
			
				this.waitLotteryList = data.sort(this.compare('lottery_time_new'));
				var lottery_id = ''
				// console.log(this.waitLotteryList)
				for(let i = 0;i<this.waitLotteryList.length;i++) {
					if(this.$route.query.regType=='suc') {
					    //第一次注册默认是SENSIX指数
//					    this.lotteryIndex = 0;
//					    if(this.waitLotteryList[i].lottery_type==2&&this.waitLotteryList[i].lottery_id==1) {
//					   		//取消注册登陆弹出新手指南，默认是SENSIX指数，选择了BTC/INR彩票才弹出新手指南
//					   		this.lottery_time = this.waitLotteryList[i].lottery_time_new;
//					   		this.bseShow = true;
//					   		break;
//					    }



						//登录默认取彩票类离开奖时间最近的
				    	if(this.waitLotteryList[i].lottery_type==1) {
					   		//取消注册登陆弹出新手指南，默认是SENSIX指数，选择了BTC/INR彩票才弹出新手指南
					   		this.lottery_time = this.waitLotteryList[i].lottery_time_new;
					   		this.lottery_no_id = this.waitLotteryList[i].id;
					   		lottery_id = this.waitLotteryList[i].lottery_id;
					   		this.bseShow = false;
					   		break;
					    }
					   
				    }else {
				    	//登录默认取彩票类离开奖时间最近的
				    	if(this.waitLotteryList[i].lottery_type==1) {
					   		//取消注册登陆弹出新手指南，默认是SENSIX指数，选择了BTC/INR彩票才弹出新手指南
					   		this.lottery_time = this.waitLotteryList[i].lottery_time_new;
					   		this.lottery_no_id = this.waitLotteryList[i].id;
					   		lottery_id = this.waitLotteryList[i].lottery_id;
					   		this.bseShow = false;
					   		break;
					    }
				    }
				}
				this.getLotteryClass(lottery_id);//获取彩票种类
				//  console.log(this.lottery_time,this.lottery_no_id)
				this.activityCountDown();

			}).catch((error)=>{	
       			error.msg?Toast(error.msg):''
       		
       		})
		},
		//获取服务器时间
		getSystemTime() {
			axios.post(globals.api.systemTime).then((res)=>{
//				this.sysTimeA = res.data.data;
				clearInterval(this.systemTimer)
				var systemTime = new Date((res.data.data).replace(/-/g,'/')).getTime()
				var now = new Date(systemTime);
				var year = now.getFullYear();
				var mon = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
				var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
				var timeDate = String(year)+String(mon)+String(day); //服务器当前日期
					
//				setTimeout(()=>{
//					
//				
//					//判断是否弹出登录活动
//					if(this.showActivityA) {
//						//showActivityA：先判断是否登录页过来的
//						console.log(localStorage.getItem('timeDate'))
//						if(localStorage.getItem('timeDate')){
//							console.log(localStorage.getItem('timeDate'))
//							if(timeDate!=localStorage.getItem('timeDate')){
//	
//								var paramsA = {
//									UserId: localStorage.getItem('userId'),
//									UserToken: localStorage.getItem('token')
//								}
//								axios.post(globals.api.activityLogin,paramsA).then((res)=>{
//									var data = res.data.data;
//									//					data.count = 14
//									var a = 100/(data.config.length)-4-((100/(data.config.length)-4)/2)
//									for(let i = 0;i<data.config.length;i++) {
//										data.config[i].precent = a+i*(100/(data.config.length))
//										if(data.count<=data.config[i].count) {
//											if(i==0) {
//												
//												this.tempPrecent = data.count/data.config[i].count*data.config[i].precent
//											}else {
//												this.tempPrecent = data.config[i-1].precent+(data.count-data.config[i-1].count)/(data.config[i].count-data.config[i-1].count)*(100/(data.config.length))
//											}
//											
//											break
//										}
//									}
//									this.activityInfo = data
//								
//									
//									this.showActivity = true;
//									localStorage.setItem('timeDate',timeDate)
//									
//						       		}).catch((error)=>{
//						       			error.msg?Toast(error.msg):'';
//						   		})
//					       	}else {
//					       		if(localStorage.getItem('token')) {
//									this.refreshMsg();
//								}
//					       	}
//								
//							
//						}else {
//							var paramsA = {
//								UserId: localStorage.getItem('userId'),
//								UserToken: localStorage.getItem('token')
//							}
//							axios.post(globals.api.activityLogin,paramsA).then((res)=>{
//								var data = res.data.data;
//								//					data.count = 14
//								var a = 100/(data.config.length)-4-((100/(data.config.length)-4)/2)
//								for(let i = 0;i<data.config.length;i++) {
//									data.config[i].precent = a+i*(100/(data.config.length))
//									if(data.count<=data.config[i].count) {
//										if(i==0) {
//											
//											this.tempPrecent = data.count/data.config[i].count*data.config[i].precent
//										}else {
//											this.tempPrecent = data.config[i-1].precent+(data.count-data.config[i-1].count)/(data.config[i].count-data.config[i-1].count)*(100/(data.config.length))
//										}
//										
//										break
//									}
//								}
//								this.activityInfo = data
//						
//								
//								this.showActivity = true;
//								localStorage.setItem('timeDate',timeDate)
//								
//					       		}).catch((error)=>{
//					       			error.msg?Toast(error.msg):'';
//					   		})
//						}
//					}else {
//						if(localStorage.getItem('token')) {
//							this.refreshMsg();
//						}
//					}
//				},2500)
				
				
				
				
				
				
				
				
				
				
				this.sysTime = systemTime;
				console.log(this.sysTime);
				this.systemTimer = setInterval(()=>{
					systemTime+=1000;
					this.sysTime = systemTime;
					// console.log(this.sysTime)
				},1000)
				
				this.historyList();//历史开奖记录
			
			
				clearInterval(this.loginTimer);
					this.loginTimer = setInterval(()=>{
					this.percent+=1;
	
					if(this.percent>=100) {
						clearInterval(this.loginTimer);
						this.siteLoading = false;
					}
				},10)
				
				
				
				
				
			}).catch((error)=>{})
		},
		getMonth(time) {
			if(time=='01') {
				return 'Jan'
			}else if(time=='02') {
				return 'Feb'
			}else if(time=='03') {
				return 'Mar'
			}else if(time=='04') {
				return 'Apr'
			}else if(time=='05') {
				return 'May'
			}else if(time=='06') {
				return 'Jun'
			}else if(time=='07') {
				return 'Jul'
			}else if(time=='08') {
				return 'Aug'
			}else if(time=='09') {
				return 'Sept'
			}else if(time=='10') {
				return 'Oct'
			}else if(time=='11') {
				return 'Nov'
			}else if(time=='12') {
				return 'Dec'
			}
		},
		//获取彩票种类信息
		getLotteryClass(lottery_id) {
			axios.post(globals.api.getLotteryClass).then((res)=>{
				this.lotteryClass = res.data.data;
				this.lotLoading = false;
				// console.log(this.lotteryClass)
				if(this.$route.query.type) {
					for(let i = 0;i<res.data.data.length;i++) {
						if(this.$route.query.type==1) {
							if(this.$route.query.id==res.data.data[i].id) {
								this.lotteryIndex = i;
				//获取期数id
				this.lottery_no_id = '';
			
				for(let i = 0;i<this.waitLotteryList.length;i++) {
					if(this.waitLotteryList[i].lottery_type==1&&this.waitLotteryList[i].lottery_id==this.lotteryClass[this.lotteryIndex].id) {
						this.lottery_time = this.waitLotteryList[i].lottery_time_new;
						this.lottery_no_id = this.waitLotteryList[i].id;
						break
					}
				}
			
				if(this.lottery_no_id=='')return
					this.activityCountDown();
					this.selectNumList[0].list = this.lotteryClass[this.lotteryIndex].bets_a_range.split(',');
					this.selectNumList[1].list = this.lotteryClass[this.lotteryIndex].bets_b_range.split(',');
					this.selectNumList[2].list = this.lotteryClass[this.lotteryIndex].bets_c_range.split(',');
					this.selectNumList[3].list = this.lotteryClass[this.lotteryIndex].bets_d_range.split(',');
					this.selectNumList[4].list = this.lotteryClass[this.lotteryIndex].bets_e_range.split(',');
					this.selectNumList[5].list = this.lotteryClass[this.lotteryIndex].bets_f_range.split(',');
					this.selectNumList[6].list = this.lotteryClass[this.lotteryIndex].bets_g_range.split(',');
							}
							
						}else {
							// alert('type')
							this.lotteryIndex = 0;
							this.active = 0;
							this.bseShow = true;
							
							if(this.$route.query.id==1) {
								//股指
								this.bseIndex = 1;
							}else {
								//btc
								this.bseIndex = 0;
							}
						
							this.bseInfo = this.bseChaseList[this.bseIndex];
							var now = new Date(this.sysTime);
							var mon = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
							
							for(let i = 0;i<this.waitLotteryList.length;i++) {
								if(this.waitLotteryList[i].lottery_type==2&&this.waitLotteryList[i].lottery_id==this.$route.query.id) {
									this.lottery_time = this.waitLotteryList[i].lottery_time_new;
									break
								}
							}
							this.activityCountDown();
							
							this.sysMonth = this.getMonth(mon)
							this.selectNumList[0].list = this.bseInfo.bets_a_range.split(',')
							this.selectNumList[1].list = this.bseInfo.bets_b_range.split(',')
							this.selectNumList[2].list = this.bseInfo.bets_c_range.split(',')
							this.selectNumList[3].list = []
							this.selectNumList[4].list = []
							this.selectNumList[5].list = []
							this.selectNumList[6].list = []
							this.selectNumLength = 3;
							// console.log(this.selectNumList)
							this.lottery_no_id = 999999
							this.bseData()
							for(let i = 0;i<this.bseChaseList.length;i++) {
								this.bseChaseList[i].color = ''
							}
							this.$set(this.bseChaseList[this.bseIndex],'color','#6173D5')
						}
					}
				
					this.lotteryClass[this.lotteryIndex].color = '#6173D5';
				}else {
					for(let i = 0;i<this.lotteryClass.length;i++) {
						if(this.lotteryClass[i].type==1&&this.lotteryClass[i].id==lottery_id) {
							this.lotteryIndex = i;
							break;
						}
					}
			// console.log(this.lotteryClass[this.lotteryIndex].bets_a_range.split(','))
			// console.log(this.selectNumIndex)
					this.selectNumList[0].list = this.lotteryClass[this.lotteryIndex].bets_a_range.split(',');
					this.selectNumList[1].list = this.lotteryClass[this.lotteryIndex].bets_b_range.split(',');
					this.selectNumList[2].list = this.lotteryClass[this.lotteryIndex].bets_c_range.split(',');
					this.selectNumList[3].list = this.lotteryClass[this.lotteryIndex].bets_d_range.split(',');
					this.selectNumList[4].list = this.lotteryClass[this.lotteryIndex].bets_e_range.split(',');
					this.selectNumList[5].list = this.lotteryClass[this.lotteryIndex].bets_f_range.split(',');	
					this.selectNumList[6].list = this.lotteryClass[this.lotteryIndex].bets_g_range.split(',');
					this.selectNumLength = 7;
					// console.log(this.selectNumList)
					this.lotteryClass[this.lotteryIndex].color = '#6173D5';
				}
					
       		}).catch((error)=>{})
		},
		activityCountDown() {

				var _this = this;
				let newTime = this.sysTime;
//				console.log(new Date(newTime))
			    clearInterval(this.lotteryTimer)
				    
			    this.lotteryTimer = setInterval(()=>{
			    	newTime += 1000;
			      	let endTime = this.lottery_time;

			     
				    let obj = null;
				    let objStatus = null;
				    // console.log(this.data.phaseDetail.startTime,newTime)
					 if (endTime - newTime > 0) {
				   
			        	objStatus = null;
				        let time = (endTime - newTime) / 1000;
				        // 获取天、时、分、秒
				        let day = parseInt(time / (60 * 60 * 24));
				        let hou = parseInt(time % (60 * 60 * 24) / 3600);
				        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
				        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
				        let datTyemp = this.timeFormat(day, 1) == '0' ? '' : this.timeFormat(day, 1) + '天 '
				        obj = {
				          	day: this.timeFormat(day),
				          	hou: Number(this.timeFormat(day))>=1?Number(this.timeFormat(hou))+Number(this.timeFormat(day))*24:this.timeFormat(hou),
				          	min: this.timeFormat(min),
				          	sec: this.timeFormat(sec)
				    	}
			      	} else {//活动已结束，全部设置为'00'
			        	obj = '';
			        	objStatus = null;
			        	
			      
			        	

					        	if(this.lotteryIndex==0) {
					        		//如果是指数，重新查询开奖时间
					        		clearInterval(this.lotteryTimer)
					        		
					        	setTimeout(()=>{
					        		axios.post(globals.api.historyList)
								  	.then(res => {
								
										var data = res.data.data;
										// console.log(data);
										for(let i = 0;i<data.length;i++) {
											 if(data[i].lottery_type==2&&data[i].lottery_id==this.bseChaseList[this.bseIndex].id) {
										   		this.lottery_time = new Date((data[i].next_lottery_info.lottery_time).replace(/-/g,'/')).getTime();
					
										   		break;
										    }
	
										}
			
									_this.activityCountDown();
					        		
					        		
					        		 }).catch((error)=>{
					
						       			error.msg?Toast(error.msg):''
						       		})
					        	},10000)

					      	}
					        	
			     
				}
				        this.countDownTime = obj;
				        // console.log(this.countDownTime)
				 
					}, 1000)
			},
			timeFormat(param) {//小于10的格式化函数
			    return param < 10 ? '0' + param : param;
		},
		// 新加兰下拉
		lotterySelect() {
			this.jin();
				// 删除数组第一项
			if (this.lotteryClass.length == 4) {
				this.lotteryClass[0].name = " ";
				this.lotteryClass[0].disabled = true;
				// this.lotteryClass = this.lotteryClass.splice(1,3);
				console.log(this.lotteryClass);
				this.lotteryClassShow = true;
			} else {
				this.lotteryClassShow = true;
			}
			
		},
		//获取指数种类信息
		bseClass() {
			axios.post(globals.api.bseClass).then((res)=>{
				this.bseChaseList = res.data.data;
				// console.log(this.bseChaseList)
				// console.log(this.bseIndex)
				for(let i = 0;i<this.bseChaseList.length;i++) {
					this.bseChaseList[i].color = '#000'
				}
				
				this.$set(this.bseChaseList[this.bseIndex],'color','#6173D5')
				this.bseInfo = this.bseChaseList[this.bseIndex];
				
				var now = new Date(this.sysTime);
			    var mon = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
					this.sysMonth = this.getMonth(mon)
					this.lottery_no_id = 9999999;//假的
					this.bseData()

       		}).catch((error)=>{})
		},
		//获取指数记录
		bseData() {
			if(this.bseDataInfo.current_value!=this.oldBse) {
				this.oldBse = this.bseDataInfo.current_value;//上一口价
			}
			this.bseDataLoading = true;
//			console.log(this.oldBse)
			console.log(this.bseInfo);
			var params = {
				limit:1,
				page:1,
				bse_id:this.bseInfo.id
			}
			axios.post(globals.api.bseData,params).then((res)=>{
				// console.log(res);
				let valstring = res.data.data[0].current_value;
				if (valstring.length == 8) {
					this.front=valstring.substring(0,4);
				} else {
					this.front=valstring.substring(0,6);
				}
				this.shuzhi = valstring.substring(valstring.length - 4);
				// 尾数三位数
				this.sanweishu = this.shuzhi.replace(".", "");
				
				// 转数组
				this.arrString = this.sanweishu.split('');
				let zonghe = this.arrString.map(Number);
				let strMax = zonghe.reduce((x, y) => x + y);
				let zhuanhuan = strMax.toString();
				this.maxWeishu = zhuanhuan.charAt(zhuanhuan.length-1);
				
				setTimeout(()=>{
					this.bseDataInfo = res.data.data[0];
					this.bseDataLoading = false;
				},500)
				
       		}).catch((error)=>{
       			setTimeout(()=>{
					this.bseDataLoading = false;
				},500)
       		})
		},
		//选择彩种
		onSelectLotteryClass(item) {
			console.log(this.lottery_no_id);
			console.log(this.countDownTime);
			// console.log(this.bseClassIndex);
			// console.log(this.LotteryClass);
			// console.log(item);
			if (item == 0) {
				this.lotteryIndex = 0;
				
			} else if(item == 1) {
				this.lotteryIndex = 1;
				this.complexBol = false;
			} else {
				for(let i = 0;i<this.lotteryClass.length;i++) {
					this.lotteryClass[i].color = ''; //点击后让所有index颜色为空
					if(item.id==this.lotteryClass[i].id) {
						this.lotteryIndex = i;
					}
				}
				item.color = '#6173D5'
			}
			//彩种种类
			// if(this.tabCut.length)
			

			// console.log("彩种"+this.lotteryIndex)
			
			//下期开奖倒计时
			var now = new Date(this.sysTime);
			//console.log(now); 服务器时间
			var year = now.getFullYear();
			var mon = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
			var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
			var hour = now.getHours();
			var minute = now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes();

			var nowTime = hour+''+minute
			// console.log(nowTime) 服务器小时分钟
					this.resetNum();//清空选数
					
					// item.color = '#6173D5'
					
					if(this.lotteryIndex==0) {
						// console.log("哈哈哈哈哈=======>"+this.bseIndex);
						//指数 月份
						this.sysMonth = this.getMonth(mon)
						// this.bseIndex = 1;
						this.bseInfo = this.bseChaseList[this.bseIndex];
						// console.log(this.bseInfo);  btc信息
						this.bseData();//重新请求行情
						for(let i = 0;i<this.bseChaseList.length;i++) {
							this.bseChaseList[i].color = ''
						}
						this.$set(this.bseChaseList[this.bseIndex],'color','#6173D5')
				
						this.bseTypeIndex = 1;
						this.bseShow = true;
				
						if (this.bseClassIndex == 0) {
							// console.log(this.bseClassIndex + "等于0索引");
							this.selectNumList = [{ num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }, { num: '', list: [], randomList: [] }];
						}
						if (this.bseClassIndex == 1) {
							// console.log(this.bseClassIndex + "等于1索引");
							 this.selectNumList[0].list = this.bseInfo.bets_a_range.split(',')

						 	this.selectNumList[1].list = this.bseInfo.bets_b_range.split(',')
		
					  	this.selectNumList[2].list = this.bseInfo.bets_c_range.split(',')
						
						 	this.selectNumList[3].list = []
		
						 this.selectNumList[4].list = []
		
						 this.selectNumList[5].list = []
		
						 this.selectNumList[6].list = []
						
						 this.selectNumLength = 3;
						}
						if (this.bseClassIndex == 2) {
							// console.log(this.bseClassIndex + "等于2索引");
							this.selectNumList[0].list = this.bseInfo.bets_a_range.split(',')

							this.selectNumList[1].list = []
			
							this.selectNumList[2].list = []
							
							this.selectNumList[3].list = []
			
							this.selectNumList[4].list = []
			
							this.selectNumList[5].list = []
			
							this.selectNumList[6].list = []
							
							this.selectNumLength = 1;
						 }
						// console.log(this.waitLotteryList);
						if (this.bseIndex == 0) {
							for(let i = 0;i<this.waitLotteryList.length;i++) {
								//找出普通场的开奖时间
								if(this.waitLotteryList[i].lottery_type==2&&this.waitLotteryList[i].lottery_id==2) {
									this.lottery_time = this.waitLotteryList[i].lottery_time_new;
									break;
								}
							}
						}
						if (this.bseIndex == 1) {
							for(let i = 0;i<this.waitLotteryList.length;i++) {
								//找出普通场的开奖时间
								if(this.waitLotteryList[i].lottery_type==2&&this.waitLotteryList[i].lottery_id==1) {
									this.lottery_time = this.waitLotteryList[i].lottery_time_new;
									break;
								}
							}
						}
							

							
							this.activityCountDown();
			
							this.lotteryClassShow = false;
							// console.log("选择了mins玩法");
						}else {
							// console.log(this.lotteryClass)
							this.bseShow = false   //这里好像就是控制选择上面部分下拉箭头的开关
							this.selectNumList[0].list = this.lotteryClass[this.lotteryIndex].bets_a_range.split(',')
	
							this.selectNumList[1].list = this.lotteryClass[this.lotteryIndex].bets_b_range.split(',')
			
							this.selectNumList[2].list = this.lotteryClass[this.lotteryIndex].bets_c_range.split(',')
			
							this.selectNumList[3].list = this.lotteryClass[this.lotteryIndex].bets_d_range.split(',')
			
							this.selectNumList[4].list = this.lotteryClass[this.lotteryIndex].bets_e_range.split(',')
			
							this.selectNumList[5].list = this.lotteryClass[this.lotteryIndex].bets_f_range.split(',')
			
							this.selectNumList[6].list = this.lotteryClass[this.lotteryIndex].bets_g_range.split(',')
						
						// console.log(this.selectNumList)
							this.selectNumLength = 7;

							this.lotteryClassShow = false;
							
							//获取期数id
							this.lottery_no_id = '';
							
							for(let i = 0;i<this.waitLotteryList.length;i++) {
								if(this.waitLotteryList[i].lottery_type==1&&this.waitLotteryList[i].lottery_id==this.lotteryClass[this.lotteryIndex].id) {
									this.lottery_time = this.waitLotteryList[i].lottery_time_new;
									this.lottery_no_id = this.waitLotteryList[i].id;
									break
								}
							}
						
						
							if(this.lottery_no_id=='')return
						
		
							this.activityCountDown();
						}


		},
		watchMul(e) {
			if(Number(e)>99) {
				this.mul = 99;
			}
		},
		unique(arr) {
			return Array.from(new Set(arr))
		},
		removeNum(arr,val) {
			var index = arr.indexOf(val);
			if (index > -1) {
				arr.splice(index, 1);
			}
		},
		//选中号码，添加进已选数组
		selectNum(item, index) {
			this.qiuVoices();
			this.selectIndex = index;
			if(this.lotteryIndex==0) {
				if((this.selectNumList[0].zeroBol == 2||this.selectNumList[1].zeroBol == 2||this.selectNumList[2].zeroBol == 2)&&item === '0'){
					Toast(this.$store.state.system.webLang.can_not_select_text)
					return
				}
				this.selectNumList[this.selectNumIndex].num = item;
				var bseList = this.selectNumList.slice(0,3);
				var bseA = bseList[0].num,bseB = bseList[1].num, bseC = bseList[2].num
	// console.log(bseA,bseB,bseC)
	

				
				
				for(let i = 0;i<bseList.length;i++) {
					this.selectNumList[i].zeroBol = 1
			
					if(bseA==='0'&&bseB==='0') {
						this.selectNumList[2].zeroBol = 2
						if(bseC==='0') {
							this.selectNumList[this.selectNumIndex].num = '';
							// console.log(this.selectNumList)
							Toast(this.$store.state.system.webLang.can_not_select_text)
							return
						}
					}
					if(bseA==='0'&&bseC==='0') {
						this.selectNumList[1].zeroBol = 2
						if(bseB==='0') {
							this.selectNumList[this.selectNumIndex].num = '';
							// console.log(this.selectNumList)
							Toast(this.$store.state.system.webLang.can_not_select_text)
							return
						}
					}
					if(bseB==='0'&&bseC==='0') {
						this.selectNumList[0].zeroBol = 2
						if(bseA==='0') {
							this.selectNumList[this.selectNumIndex].num = '';
							// console.log(this.selectNumList)
							Toast(this.$store.state.system.webLang.can_not_select_text)
							return
						}
					}
				}
				
				if(this.complexBol) {
					//复投
				var list = this.selectNumList.slice(0,3);
				var numLen = 0;
				for(let i = 0;i<list.length;i++) {
					if(list[i].num) {
						numLen+=1;
					}
				}
					
					
					if(numLen==1) {
						//选了1位数
					var list = this.selectNumList.slice(0,3);
					var temp = []
					var a = index,b = index,c = index;
			
					for(let i = 0;i<list[1].list.length;i++) {
						for(let k = 0;k<list[2].list.length;k++) {
							temp.push(a+list[1].list[i]+list[2].list[k])
						}
					}

					for(let i = 0;i<list[0].list.length;i++) {
						for(let k = 0;k<list[2].list.length;k++) {
							temp.push(list[0].list[i]+b+list[2].list[k])
						}
					}
			
				
			
					for(let i = 0;i<list[0].list.length;i++) {
						for(let k = 0;k<list[1].list.length;k++) {
							temp.push(list[0].list[i]+list[1].list[k]+c)
						}
					}
				
					// console.log(temp)
					this.reinvestList = this.unique(temp);
			
				
						
						
						
					}else if(numLen==2) {
					
						var list = this.selectNumList.slice(0,3);
						var temp = []
						var a = this.selectNumList[0].num;
						var b = index;
						var c = index;
						for(let i = 0;i<list[2].list.length;i++) {
							temp.push(a+b+list[2].list[i])
						}
						
						for(let i = 0;i<list[1].list.length;i++) {
							temp.push(a+list[1].list[i]+c)
						}
						
						for(let i = 0;i<list[0].list.length;i++) {
							temp.push(list[0].list[i]+a+b)
						}
						
						for(let i = 0;i<list[0].list.length;i++) {
							temp.push(list[0].list[i]+b+a)
						}
						
						for(let i = 0;i<list[2].list.length;i++) {
							temp.push(b+a+list[2].list[i])
						}
						
						for(let i = 0;i<list[2].list.length;i++) {
							temp.push(b+list[2].list[i]+a)
						}
						
						this.reinvestList = this.unique(temp);
//						console.log(this.reinvestList.length)
						
				
						
					}else if(numLen==3) {
						this.reinvestList = []
						var a = this.selectNumList[0].num,b = this.selectNumList[1].num, c = this.selectNumList[2].num
						var num = a+b+c
						this.getNum3(num)
						this.reinvestList = this.unique(this.reinvestList);
			
						
//							console.log(this.reinvestList)
					}
						this.removeNum(this.reinvestList,'000')  //Can not select “000
						
						
						if(localStorage.getItem('lang')=='hi') {
							Toast(this.reinvestList.length + ' कॉम्बो कई दांव पहले से ही [अपने पिक] को बचाया')
						}else {
							Toast('The ' + this.reinvestList.length + ' combo multiple bets already saved to [Your Pick]')
						}
					
						
					
						if(this.futouSelectIndex<=1) {
							this.selectNumIndex+=1;
					
							this.futouSelectIndex = this.selectNumIndex;
						}
					
					
			
				}else {
					// console.log(this.bseClassIndex);
					//指数
					if(this.bseClassIndex==1) {
						//猜数字，猜尾数不做处理
					
						if(this.selectNumIndex<=1) {
			//				if(this.selectNumList[this.selectNumIndex+1].num=='') {
								this.selectNumIndex+=1;
			//				}
						}
					}
					
				}	
					
				
			} else {
				// console.log(item);
				this.selectNumList[this.selectNumIndex].num = item;
				if(this.selectNumIndex<=5) {
						this.selectNumIndex+=1;
				}
			}
		
			this.selectNumLengthA = 0;
			for(let i = 0;i<this.selectNumList.length;i++) {
				if(this.selectNumList[i].num) {
					this.selectNumLengthA+=1;
				}
			}
		
		},
		// 数组匹配值
		// getArrnumber(arr,count) {
		// 	var list = [];
		// 	for(let i = 0;i<count;i++) {
		// 		var arrIndex = Math.floor(Math.random()*arr.length+1);
		// 		list.push(arrIndex)
		// 	}
		//  return list
		// },

		//随机从数组取几个数字
		getRandomArrayElements(arr, count) {
		    var list = [];
		    for(let i = 0;i<count;i++) {
		    	var arrIndex = Math.floor(Math.random()*arr.length+1);
		    	list.push(arrIndex)
		    }
		   return list
		},
		//随机选数
		randomNum() {
		
			if(this.complexBol||this.$store.state.system.showGuide)return
			
			if(this.countDownTime.hou=='00'&&this.countDownTime.min=='00'&&this.countDownTime.sec<10&&this.lotteryIndex==0) {
				Toast(this.$store.state.system.webLang.betting_is_unavailable)
				return
			}
			
			
			if(this.oddEvenIndex==0) {
				
					this.selectNumList[0].randomList = this.getRandomArrayElements(this.selectNumList[0].list,20);
					
					this.selectNumList[1].randomList = this.getRandomArrayElements(this.selectNumList[1].list,30);
					
					this.selectNumList[2].randomList = this.getRandomArrayElements(this.selectNumList[2].list,40);
					// console.log(this.selectNumList[2].randomList);
					
					var a = 1,b = 1,c = 1,d = 1,e = 1,f = 1,g = 1;
					clearInterval(this.selectNumTimerA)
					clearInterval(this.selectNumTimerB)
					clearInterval(this.selectNumTimerC)
					clearInterval(this.selectNumTimerD)
					clearInterval(this.selectNumTimerE)
					clearInterval(this.selectNumTimerF)
					clearInterval(this.selectNumTimerG)
					this.randomBol = true;
					
					
				if (this.lotteryIndex != 0) {
					// console.log(this.lotteryIndex);
						this.selectNumList[3].randomList = this.getRandomArrayElements(this.selectNumList[3].list,50);
						
						this.selectNumList[4].randomList = this.getRandomArrayElements(this.selectNumList[4].list,60);
					
						this.selectNumList[5].randomList = this.getRandomArrayElements(this.selectNumList[5].list,70);
						
						this.selectNumList[6].randomList = this.getRandomArrayElements(this.selectNumList[6].list,80);
			
						this.selectNumTimerD = setInterval(()=>{
							this.qiuVoices();
							d+=1;
								if(d==this.selectNumList[3].randomList.length){
									this.qiuVoices();
									this.randomBol = false;
									clearInterval(this.selectNumTimerD)
									this.selectNumList[3].randomList.push(this.selectNumList[3].num)
		//							this.$refs['selectNum'+3][0].style.transform  = "translateY("+"-"+d*39+"px)";
									return
								}
								
							this.selectNumList[3].num = this.selectNumList[3].list[Math.floor((Math.random() * this.selectNumList[3].list.length))];
							// console.log(this.$refs['selectNum3']);
								this.$refs['selectNum3'][0].style.transform  = "translateY("+"-"+d*39+"px)";
						},20)
					
						this.selectNumTimerE = setInterval(() => {
							this.qiuVoices();
							e+=1;
							if (e == this.selectNumList[4].randomList.length) {
								this.qiuVoices();
									this.randomBol = false;
									clearInterval(this.selectNumTimerE)
									this.selectNumList[4].randomList.push(this.selectNumList[4].num)
		//							this.$refs['selectNum'+4][0].style.transform  = "translateY("+"-"+e*39+"px)";
									return
								}
			
								this.selectNumList[4].num = this.selectNumList[4].list[Math.floor((Math.random()*this.selectNumList[4].list.length))];
								this.$refs['selectNum'+4][0].style.transform  = "translateY("+"-"+e*39+"px)";
						},20)
						
						this.selectNumTimerF = setInterval(() => {
							this.qiuVoices();
							f+=1;
							if (f == this.selectNumList[5].randomList.length) {
								this.qiuVoices();
									this.randomBol = false;
									clearInterval(this.selectNumTimerF)
									this.selectNumList[5].randomList.push(this.selectNumList[5].num)
		//							this.$refs['selectNum'+5][0].style.transform  = "translateY("+"-"+f*39+"px)";
									return
								}
			
								this.selectNumList[5].num = this.selectNumList[5].list[Math.floor((Math.random()*this.selectNumList[5].list.length))];
								this.$refs['selectNum'+5][0].style.transform  = "translateY("+"-"+f*39+"px)";
						},20)
						
						this.selectNumTimerG = setInterval(() => {
							this.qiuVoices();
							g+=1;
								if(g==this.selectNumList[6].randomList.length){
									this.qiuVoices();
									this.randomBol = false;
									clearInterval(this.selectNumTimerG)
									this.selectNumList[6].randomList.push(this.selectNumList[6].num)
		//							this.$refs['selectNum'+6][0].style.transform  = "translateY("+"-"+g*39+"px)";
									this.selectNumLengthA = 7;
									return
								}
			
								this.selectNumList[6].num = this.selectNumList[6].list[Math.floor((Math.random()*this.selectNumList[6].list.length))];
								this.$refs['selectNum'+6][0].style.transform  = "translateY("+"-"+g*39+"px)";
						},20)
						
					}
					
					
		
					
					
					this.selectNumTimerA = setInterval(()=>{
						a+=1;
						this.qiuVoices();
						if (a == this.selectNumList[0].randomList.length) {
								this.qiuVoices();
								this.randomBol = false;
								clearInterval(this.selectNumTimerA)
								// console.log(this.selectNumList[0].num);这个就是随机字
								// this.selectNumList[0].num = 5
								this.selectNumList[0].randomList.push(this.selectNumList[0].num)
		//						this.$refs['selectNum'+0][0].style.transform  = "translateY("+"-"+a*39+"px)";
								return
							}
		
							this.selectNumList[0].num = this.selectNumList[0].list[Math.floor((Math.random()*this.selectNumList[0].list.length))];
							this.$refs['selectNum'+0][0].style.transform  = "translateY("+"-"+a*39+"px)";
					},20)
		//			
					this.selectNumTimerB = setInterval(()=>{
						b += 1;
						this.qiuVoices();
						if (b == this.selectNumList[1].randomList.length) {
							this.qiuVoices();
								
								this.randomBol = false;
								clearInterval(this.selectNumTimerB)
								this.selectNumList[1].randomList.push(this.selectNumList[1].num)
		//						this.$refs['selectNum'+1][0].style.transform  = "translateY("+"-"+b*39+"px)";
								return
							}
		
							this.selectNumList[1].num = this.selectNumList[1].list[Math.floor((Math.random()*this.selectNumList[1].list.length))];
							this.$refs['selectNum'+1][0].style.transform  = "translateY("+"-"+b*39+"px)";
							
					},20)
		//			
					this.selectNumTimerC = setInterval(()=>{
							c += 1;
							this.qiuVoices();
						if (c == this.selectNumList[2].randomList.length) {
							this.qiuVoices();
								this.randomBol = false;
								clearInterval(this.selectNumTimerC)
								this.selectNumList[2].randomList.push(this.selectNumList[2].num)
		//						this.$refs['selectNum'+'2'][0].style.transform  = "translateY("+"-"+c*39+"px)";
							
								if(this.lotteryIndex==0) {
									this.selectNumLengthA = 3;
							
								}
								return
							}
							
							this.selectNumList[2].num = this.selectNumList[2].list[Math.floor((Math.random()*this.selectNumList[2].list.length))];
							this.$refs['selectNum'+'2'][0].style.transform  = "translateY("+"-"+c*39+"px)";
					},20)
				}else {
					//猜单双
					var temp = [1,2]
					var list = this.getRandomArrayElements(temp,80);
					var a = 1;
					this.selectNumTimerA = setInterval(()=>{
						this.eIndex = list[Math.floor((Math.random()*list.length))];
						a+=1;
						if(a>=80) {
							clearInterval(this.selectNumTimerA)
						}
						
					},20)
				}
		},
		// 中奖动画
		randomNum2() {
			
			if(this.oddEvenIndex==0) {
					this.selectNumList[0].randomList = this.getRandomArrayElements(this.selectNumList[0].list,20);
					
					this.selectNumList[1].randomList = this.getRandomArrayElements(this.selectNumList[1].list,30);
					
					this.selectNumList[2].randomList = this.getRandomArrayElements(this.selectNumList[2].list,40);
			
					var a = 1,b = 1,c = 1,d = 1,e = 1,f = 1,g = 1;
					clearInterval(this.selectNumTimerA)
					clearInterval(this.selectNumTimerB)
					clearInterval(this.selectNumTimerC)
					clearInterval(this.selectNumTimerD)
					clearInterval(this.selectNumTimerE)
					clearInterval(this.selectNumTimerF)
					clearInterval(this.selectNumTimerG)
					this.randomBol = true;
					
					
				if (this.lotteryIndex != 0) {
						this.selectNumList[3].randomList = this.getRandomArrayElements(this.selectNumList[3].list,50);
						
						this.selectNumList[4].randomList = this.getRandomArrayElements(this.selectNumList[4].list,60);
					
						this.selectNumList[5].randomList = this.getRandomArrayElements(this.selectNumList[5].list,70);
						
						this.selectNumList[6].randomList = this.getRandomArrayElements(this.selectNumList[6].list,80);
						
						this.selectNumTimerD = setInterval(()=>{
							
								d += 1;
								if(d==this.selectNumList[3].randomList.length){
							
									this.randomBol = false;
									clearInterval(this.selectNumTimerD)
									this.selectNumList[3].num =	this.kaijiang.prize_4
									this.selectNumList[3].randomList.push(this.selectNumList[3].num)
		//							this.$refs['selectNum'+3][0].style.transform  = "translateY("+"-"+d*39+"px)";
									return
								}
								
								this.selectNumList[3].num = this.selectNumList[3].list[Math.floor((Math.random()*this.selectNumList[3].list.length))];
								this.$refs['selectNum3'][0].style.transform  = "translateY("+"-"+d*39+"px)";
						},100)
					
						this.selectNumTimerE = setInterval(() => {
						
							e += 1;
							if (e == this.selectNumList[4].randomList.length) {
								
									this.randomBol = false;
								clearInterval(this.selectNumTimerE)
									this.selectNumList[4].num =	this.kaijiang.prize_5
									this.selectNumList[4].randomList.push(this.selectNumList[4].num)
		//							this.$refs['selectNum'+4][0].style.transform  = "translateY("+"-"+e*39+"px)";
									return
								}
			
								this.selectNumList[4].num = this.selectNumList[4].list[Math.floor((Math.random()*this.selectNumList[4].list.length))];
								this.$refs['selectNum'+4][0].style.transform  = "translateY("+"-"+e*39+"px)";
						},100)
						
						this.selectNumTimerF = setInterval(() => {
							f+=1;
							if (f == this.selectNumList[5].randomList.length) {
									this.randomBol = false;
								clearInterval(this.selectNumTimerF)
								this.selectNumList[5].num =	this.kaijiang.prize_6
									this.selectNumList[5].randomList.push(this.selectNumList[5].num)
		//							this.$refs['selectNum'+5][0].style.transform  = "translateY("+"-"+f*39+"px)";
									return
								}
			
								this.selectNumList[5].num = this.selectNumList[5].list[Math.floor((Math.random()*this.selectNumList[5].list.length))];
								this.$refs['selectNum'+5][0].style.transform  = "translateY("+"-"+f*39+"px)";
						},100)
						
						this.selectNumTimerG = setInterval(() => {
							g += 1;
								if(g==this.selectNumList[6].randomList.length){
									this.randomBol = false;
									clearInterval(this.selectNumTimerG)
									this.selectNumList[6].num =	this.kaijiang.prize_7
									this.selectNumList[6].randomList.push(this.selectNumList[6].num)
		//							this.$refs['selectNum'+6][0].style.transform  = "translateY("+"-"+g*39+"px)";
									this.selectNumLengthA = 7;
									return
								}
								this.selectNumList[6].num = this.selectNumList[6].list[Math.floor((Math.random()*this.selectNumList[6].list.length))];
								this.$refs['selectNum'+6][0].style.transform  = "translateY("+"-"+g*39+"px)";
						},100)
						
					}
					
					
		
					
					
				this.selectNumTimerA = setInterval(() => {
						a+=1;
						if (a == this.selectNumList[0].randomList.length) {
							
								this.randomBol = false;
								clearInterval(this.selectNumTimerA)
								// console.log(this.selectNumList[0].num);这个就是随机字
								this.selectNumList[0].num =	this.kaijiang.prize_1
								this.selectNumList[0].randomList.push(this.selectNumList[0].num)
								this.$refs.tagItem[0].style.animation = `opacity-alt2 ${2}s infinite`
		//						this.$refs['selectNum'+0][0].style.transform  = "translateY("+"-"+a*39+"px)";
								return
							}
		
							this.selectNumList[0].num = this.selectNumList[0].list[Math.floor((Math.random()*this.selectNumList[0].list.length))];
							this.$refs['selectNum'+0][0].style.transform  = "translateY("+"-"+a*39+"px)";
					},100)
		//			
					this.selectNumTimerB = setInterval(()=>{
						b += 1;
						if (b == this.selectNumList[1].randomList.length) {
								this.randomBol = false;
								clearInterval(this.selectNumTimerB)
								this.selectNumList[1].num =	this.kaijiang.prize_2
							this.selectNumList[1].randomList.push(this.selectNumList[1].num)
							this.$refs.tagItem[1].style.animation = `opacity-alt2 ${2}s infinite`
		//						this.$refs['selectNum'+1][0].style.transform  = "translateY("+"-"+b*39+"px)";
								return
							}
							this.selectNumList[1].num = this.selectNumList[1].list[Math.floor((Math.random()*this.selectNumList[1].list.length))];
							this.$refs['selectNum'+1][0].style.transform  = "translateY("+"-"+b*39+"px)";
							
					},100)
		//			
					this.selectNumTimerC = setInterval(()=>{
							c += 1;
						if (c == this.selectNumList[2].randomList.length) {
								this.randomBol = false;
								clearInterval(this.selectNumTimerC)
								this.selectNumList[2].num =	this.kaijiang.prize_3
							this.selectNumList[2].randomList.push(this.selectNumList[2].num)
							this.$refs.tagItem[2].style.animation = `opacity-alt2 ${2}s infinite`
		//						this.$refs['selectNum'+'2'][0].style.transform  = "translateY("+"-"+c*39+"px)";
							
								if(this.lotteryIndex==0) {
									this.selectNumLengthA = 3;
							
								}
								return
							}
							
							this.selectNumList[2].num = this.selectNumList[2].list[Math.floor((Math.random()*this.selectNumList[2].list.length))];
							this.$refs['selectNum'+'2'][0].style.transform  = "translateY("+"-"+c*39+"px)";
					},100)
				}
		},
		// 中奖动画
		randomNum3() {
			
					this.selectNumList[0].randomList = this.getRandomArrayElements(this.selectNumList[0].list,20);
					
					this.selectNumList[1].randomList = this.getRandomArrayElements(this.selectNumList[1].list,20);
					
					this.selectNumList[2].randomList = this.getRandomArrayElements(this.selectNumList[2].list,20);
			
					var a = 1,b = 1,c = 1,d = 1,e = 1,f = 1,g = 1;
					clearInterval(this.selectNumTimerA)
					clearInterval(this.selectNumTimerB)
					clearInterval(this.selectNumTimerC)
					clearInterval(this.selectNumTimerD)
					clearInterval(this.selectNumTimerE)
					clearInterval(this.selectNumTimerF)
					clearInterval(this.selectNumTimerG)
					this.randomBol = true;
					
					
				if (this.lotteryIndex != 0) {
						this.selectNumList[3].randomList = this.getRandomArrayElements(this.selectNumList[3].list,20);
						
						this.selectNumList[4].randomList = this.getRandomArrayElements(this.selectNumList[4].list,20);
					
						this.selectNumList[5].randomList = this.getRandomArrayElements(this.selectNumList[5].list,20);
						
						this.selectNumList[6].randomList = this.getRandomArrayElements(this.selectNumList[6].list,20);
						
						this.selectNumTimerD = setInterval(()=>{
							
								d += 1;
								if(d==this.selectNumList[3].randomList.length){
							
									this.randomBol = false;
									clearInterval(this.selectNumTimerD)
						
									this.selectNumList[3].randomList.push(this.selectNumList[3].num)
		//							this.$refs['selectNum'+3][0].style.transform  = "translateY("+"-"+d*39+"px)";
									return
								}
								
								this.selectNumList[3].num = this.selectNumList[3].list[Math.floor((Math.random()*this.selectNumList[3].list.length))];
								this.$refs['selectNum3'][0].style.transform  = "translateY("+"-"+d*39+"px)";
						},20)
					
						this.selectNumTimerE = setInterval(() => {
						
							e += 1;
							if (e == this.selectNumList[4].randomList.length) {
								
									this.randomBol = false;
								clearInterval(this.selectNumTimerE)
									
									this.selectNumList[4].randomList.push(this.selectNumList[4].num)
		//							this.$refs['selectNum'+4][0].style.transform  = "translateY("+"-"+e*39+"px)";
									return
								}
			
								this.selectNumList[4].num = this.selectNumList[4].list[Math.floor((Math.random()*this.selectNumList[4].list.length))];
								this.$refs['selectNum'+4][0].style.transform  = "translateY("+"-"+e*39+"px)";
						},20)
						
						this.selectNumTimerF = setInterval(() => {
							f+=1;
							if (f == this.selectNumList[5].randomList.length) {
									this.randomBol = false;
								clearInterval(this.selectNumTimerF)
								
									this.selectNumList[5].randomList.push(this.selectNumList[5].num)
		//							this.$refs['selectNum'+5][0].style.transform  = "translateY("+"-"+f*39+"px)";
									return
								}
			
								this.selectNumList[5].num = this.selectNumList[5].list[Math.floor((Math.random()*this.selectNumList[5].list.length))];
								this.$refs['selectNum'+5][0].style.transform  = "translateY("+"-"+f*39+"px)";
						},20)
						
						this.selectNumTimerG = setInterval(() => {
							g += 1;
								if(g==this.selectNumList[6].randomList.length){
									this.randomBol = false;
									clearInterval(this.selectNumTimerG)
									
									this.selectNumList[6].randomList.push(this.selectNumList[6].num)
		//							this.$refs['selectNum'+6][0].style.transform  = "translateY("+"-"+g*39+"px)";
									this.selectNumLengthA = 7;
									return
								}
								this.selectNumList[6].num = this.selectNumList[6].list[Math.floor((Math.random()*this.selectNumList[6].list.length))];
								this.$refs['selectNum'+6][0].style.transform  = "translateY("+"-"+g*39+"px)";
						},20)
						
					}
					
				this.selectNumTimerA = setInterval(() => {
						a+=1;
						if (a == this.selectNumList[0].randomList.length) {
							
								this.randomBol = false;
								clearInterval(this.selectNumTimerA)
								// console.log(this.selectNumList[0].num);这个就是随机字
								
								this.selectNumList[0].randomList.push(this.selectNumList[0].num)
		//						this.$refs['selectNum'+0][0].style.transform  = "translateY("+"-"+a*39+"px)";
								return
							}
		
							this.selectNumList[0].num = this.selectNumList[0].list[Math.floor((Math.random()*this.selectNumList[0].list.length))];
							this.$refs['selectNum'+0][0].style.transform  = "translateY("+"-"+a*39+"px)";
					},100)
		//			
					this.selectNumTimerB = setInterval(()=>{
						b += 1;
						if (b == this.selectNumList[1].randomList.length) {
								this.randomBol = false;
								clearInterval(this.selectNumTimerB)
							
								this.selectNumList[1].randomList.push(this.selectNumList[1].num)
		//						this.$refs['selectNum'+1][0].style.transform  = "translateY("+"-"+b*39+"px)";
								return
							}
							this.selectNumList[1].num = this.selectNumList[1].list[Math.floor((Math.random()*this.selectNumList[1].list.length))];
							this.$refs['selectNum'+1][0].style.transform  = "translateY("+"-"+b*39+"px)";
							
					},100)
		//			
					this.selectNumTimerC = setInterval(()=>{
							c += 1;
						if (c == this.selectNumList[2].randomList.length) {
								this.randomBol = false;
								clearInterval(this.selectNumTimerC)
								
								this.selectNumList[2].randomList.push(this.selectNumList[2].num)
		//						this.$refs['selectNum'+'2'][0].style.transform  = "translateY("+"-"+c*39+"px)";
							
								if(this.lotteryIndex==0) {
									this.selectNumLengthA = 3;
							
								}
								return
							}
							
							this.selectNumList[2].num = this.selectNumList[2].list[Math.floor((Math.random()*this.selectNumList[2].list.length))];
							this.$refs['selectNum'+'2'][0].style.transform  = "translateY("+"-"+c*39+"px)";
					},100)
				
		},
		//清空选数
		resetNum() {
			this.play();
			clearInterval(this.selectNumTimerA)
			clearInterval(this.selectNumTimerB)
			clearInterval(this.selectNumTimerC)
			clearInterval(this.selectNumTimerD)
			clearInterval(this.selectNumTimerE)
			clearInterval(this.selectNumTimerF)
			clearInterval(this.selectNumTimerG)
			for(let i = 0;i<this.selectNumList.length;i++) {
				this.selectNumList[i].zeroBol = 1
				this.selectNumList[i].num = '';
				this.selectNumList[i].randomList = []
			}
			this.selectNumIndex = 0;
			this.selectNumLengthA = 0;
			this.eIndex = null;
			
			this.futouSelectIndex = 0;
			this.reinvestList = [];//复投列表
		},
		//复投清空选数
		resetNumA() {
			for(let i = 0;i<this.selectNumList.length;i++) {
				this.selectNumList[i].num = '';
				this.selectNumList[i].randomList = []
			}
			this.futouSelectIndex = 0;
			this.reinvestList = [];//复投列表
			
		},
		//购买保存彩票
		lotteryUserBets(type) {
//			if(this.countDownTime.hou=='00'&&this.countDownTime.min=='00'&&this.countDownTime.sec<10&&this.lotteryIndex==3) {
//				Toast('Sorry, betting is temporarily unavailable')
//				return
//			}

			if(!clickBol)return
			clickBol = false;
			setTimeout(()=>{
				clickBol = true
			},1500)
			
			this.$store.state.user.addBol = false;//清除动画
	
//			if(localStorage.getItem('token')==null) {
//				Toast(this.$store.state.system.webLang.please_login)
//				return
//			}
//			
			if(this.lotteryIndex==0) {
				//指数
				if(this.bseClassIndex==1) {
					//猜数字
					var list = this.selectNumList.slice(0,3);
				}else if(this.bseClassIndex==2){
					//猜尾数
					var list = this.selectNumList.slice(0,1);
				}
				
			}else {
				var list = this.selectNumList;
			}
//				
//			console.log(list)
//			for(let i = 0;i<list.length;i++) {
//				if(list[i].num==''){
//					Toast(this.$store.state.system.webLang.select_num_tips)
//					return
//				}
//			}
//			console.log(this.randomBol)
//			if(this.randomBol) {
//				Toast(this.$store.state.system.webLang.random_tips)
//				return
//			}
//			
			
		
			
			
			if(this.lotteryIndex==0) {
				//指数
//				if(this.bseTypeIndex.length==0) {
//					Toast('请至少选择一种玩法')
//					return
//				}
				if (this.bseClassIndex == 1) {
					// console.log(list[0].num,list[1].num,this.mul);
					//猜数字
					var params = {
						UserId:localStorage.getItem('userId'),
						UserToken:localStorage.getItem('token'),
						lottery_id: this.bseInfo.id, //彩票ID
	//					lottery_no_id: lottery_no_id, //彩票期数ID
						type:type,//1购买 2保存
						a:list[0].num,
						b:list[1].num,
						c:list[2].num,
						times:this.mul,//倍数
						bets_type:this.bseTypeIndex,
						no_times:type==2?'':this.chaseNum,
						e:this.eIndex?this.eIndex:'',//猜单双 1单 2双
						complex_data:this.reinvestList.toString(),//复投详情
					}
				}else if(this.bseClassIndex==2){
					//猜尾数
					var params = {
						UserId:localStorage.getItem('userId'),
						UserToken:localStorage.getItem('token'),
						lottery_id: this.bseInfo.id, //彩票ID
	//					lottery_no_id: lottery_no_id, //彩票期数ID
						type:type,//1购买 2保存
						d:list[0].num,
						times:this.mul,//倍数
						bets_type:this.bseTypeIndex,
						no_times:type==2?'':this.chaseNum,
						e:this.eIndex?this.eIndex:'',//猜单双 1单 2双
						complex_data:this.reinvestList.toString(),//复投详情
					}
				} else if (this.bseClassIndex==0) {
					var params = {
						UserId:localStorage.getItem('userId'),
						UserToken:localStorage.getItem('token'),
						lottery_id: this.bseInfo.id, //彩票ID
	//					lottery_no_id: lottery_no_id, //彩票期数ID
						type:type,//1购买 2保存
						
						times:this.mul,//倍数
						bets_type:this.bseTypeIndex,
						no_times:type==2?'':this.chaseNum,
						e:this.eIndex?this.eIndex:'',//猜单双 1单 2双
						complex_data:this.reinvestList.toString(),//复投详情
					}
				}
				
				
				
				    //转成图片
						html2canvas(this.$refs.lotteryInfo).then((canvas) => {
								this.lotteryImg = canvas.toDataURL("image/png");
						});
				
				axios.post(globals.api.betsBse,params).then((res)=>{
			
					if (res.data.code == 200) {
						this.paySuccess();
						
						this.resetNum();//清空选数
	//					this.mul = 1;
						localStorage.setItem('mul',this.mul);//记录投注倍数
						localStorage.setItem('bseTypeIndex',Number(this.bseTypeIndex));//记录指数玩法
						if(type==1) {
							this.$store.dispatch(types.GET_USER_INFO);
//							this.payPassword = '';
							this.closeBg();//关闭密码支付框
							
							Toast.success(this.$store.state.system.webLang.Successfully_purchased)
						}else {
							Toast.success(this.$store.state.system.webLang.success_text)
						}
					
						
						
						if(this.lotteryImg) {
							this.flag = true;
						}
						// console.log(this.balance);
					}else {
						Toast(res.data.msg)
					}
					
					
			
	       	}).catch((error)=>{
	       			error.msg?Toast(error.msg):''
	       		})
				
				
				
			}else {
				

				
		
				var params = {
					UserId:localStorage.getItem('userId'),
					UserToken:localStorage.getItem('token'),
					lottery_id: this.lotteryClass[this.lotteryIndex].id, //彩票ID
					lottery_no_id: this.lottery_no_id, //彩票期数ID
					type:type,//1购买 2保存
					a:list[0].num,
					b:list[1].num,
					c:list[2].num,
					d:list[3].num,
					e:list[4].num,
					f:list[5].num,
					g:list[6].num,
					times:this.mul,//倍数
					no_times:type==2?'':this.chaseNum
				}
				
				    //转成图片
	              	html2canvas(this.$refs.lotteryInfo).then((canvas) => {
	                    this.lotteryImg = canvas.toDataURL("image/png");
	                });
				
				axios.post(globals.api.lotteryUserBets,params).then((res)=>{
				
					if(res.data.code==200) {
						this.resetNum();//清空选数
	//					this.mul = 1;
						localStorage.setItem('mul',this.mul);//记录投注倍数
						if(type==1) {
							this.$store.dispatch(types.GET_USER_INFO);
//							this.payPassword = '';
							this.closeBg();//关闭密码支付框
							Toast.success(this.$store.state.system.webLang.Successfully_purchased)
						}else {
							Toast.success(this.$store.state.system.webLang.success_text)
						}
						
						
						if(this.lotteryImg) {
							this.flag = true;
						}
						
					}else {
						Toast(res.data.msg)
					}
					
					
			
	       		}).catch((error)=>{
	      
	       			error.msg?Toast(error.msg):''
	       		})
	        }
		},
		beforeEnter(el){
				//beforeEnter表示动画入场之前，此时动画尚未开始可以在beforeEnter中设置元素开始动画之前的起始样式。
				//设置小球开始动画之前的起始位置
				el.style.transform = 'translate(0,0)'
			},
			enter(el,done){
				//设置过渡
				el.offsetWidth
				//enter表示动画开始之后的样式，这里可以设置小球完成动画之后的结束状态
//			
//				var width = document.body.clientWidth-this.$refs.collect.offsetWidth;
//				console.log(width)
				var ball = el.getBoundingClientRect();
				
				var shopCart = document.getElementById('shopCart').getBoundingClientRect();
				
				var ballX = shopCart.left - ball.left;
				var ballY = shopCart.top - ball.top;
			
				el.style.transform = `translate(${ballX}px,${ballY}px)`
				el.style.transition = 'all 1s cubic-bezier(0,0,1,1)'
				//这里的done其实就是afterEnter这个函数，也就是说done是一个函数的引用
				done()
			},
			afterEnter(el){
				this.flag = !this.flag;
				
				setTimeout(()=>{
					this.$store.state.user.addBol = true;
					//给tabbar添加动画
				},900)
			},
			closeBg() {
				this.showPayPwd = false;
				this.showRecharge = false;
				this.showActivity = false;
			},
			//保存或者支付
			openPayPwd(type) {
				//type:1保存2购买
				//改为不用密码支付了
				// this.play();
				if((this.complexBol&&type==1)||this.$store.state.system.showGuide)return
				
				if(!this.countDownTime && this.active==0) {
					Toast(this.$store.state.system.webLang.launching_soon)
					return
				}
				if(!this.countDownTime && this.active==1) {
					this.najialan15 = true;
					// Toast(this.$store.state.system.webLang.launching_soon)
					return
				}
			
				if(localStorage.getItem('token')==null) {
					Toast(this.$store.state.system.webLang.please_login)
					return
				}
		
				if(this.randomBol) {
					Toast(this.$store.state.system.webLang.random_tips)
					return
				}
				
				// 最外层tab索引
				// console.log(this.lotteryIndex);
				if(this.lotteryIndex==0) {
					//指数
					
					if(this.countDownTime.hou=='00'&&this.countDownTime.min=='00'&&this.countDownTime.sec<Number(this.bseInfo.end_bets_time)) {
						//指数小于n秒不能购买
						
						if(localStorage.getItem('lang')=='hi') {
							Toast('ड्रा से पहले ' +this.bseInfo.end_bets_time+' सेकंड में शर्त को बंद करना');
						}else {
							Toast('Closing the bet in ' +this.bseInfo.end_bets_time+ ' seconds before the draw');
						}
						
						return
					}
					
					// console.log(this.complexBol);
					if(this.complexBol){
						//复投
						if(this.reinvestList.length==0) {
							Toast(this.$store.state.system.webLang.select_num_tips)
							return
						}
					}else {
						// console.log("这是"+ this.oddEvenIndex);  //打印一直都是0
						if(this.oddEvenIndex==0) {
							//猜数字 
							// console.log("我是第二层tab索引" + this.bseClassIndex);
							
							if(this.bseClassIndex==1) {
								//猜数字
								var list = this.selectNumList.slice(0, 3);
								for(let i = 0;i<list.length;i++) {
									if(list[i].num==''){
										Toast(this.$store.state.system.webLang.select_num_tips)
										return
									}
								}
							}
							if(this.bseClassIndex==2) {
								//猜尾数
								var list = this.selectNumList.slice(0,1);
								for(let i = 0;i<list.length;i++) {
									if(list[i].num==''){
										Toast(this.$store.state.system.webLang.select_num_tips)
										return
									}
								}
							}
								// 猜单双
						if(this.bseClassIndex==0) {
							// console.log('猜单双'+this.eIndex);
							if(!this.eIndex) {
								Toast(this.$store.state.system.webLang.please_select_single_or_double)
								return
							}
						}
						
							
							
						}


						// else {
						// 	//猜单双
						// 	if(!this.eIndex) {
						// 		Toast(this.$store.state.system.webLang.please_select_single_or_double)
						// 		return
						// 	}
							
						// }
				
					}
				
				}else {
					var list = this.selectNumList;
		
					for(let i = 0;i<list.length;i++) {
						if(list[i].num==''){
							Toast(this.$store.state.system.webLang.select_num_tips)
							return
						}
					}
					
					//如果没有对应期数
					if(this.lottery_no_id=='') {
						Toast(this.$store.state.system.webLang.current_lottery_is_stop)
						return
					}
					
					
					
				}
					
				
				
				// console.log(type)
				
				if(type==2) {
					//购买前先判断余额是否足够
					
					// 外层索引
					if(this.lotteryIndex==0) {
	
						var amount = 0;
						// 判断第二个tab
						if (this.bseClassIndex == 1) {
							amount = this.bseChaseList[this.bseIndex].bets_points
						}else if(this.bseClassIndex==2) {
								amount = this.bseChaseList[this.bseIndex].bets_points_guess
						} else if(this.bseClassIndex==0) {
							amount = this.bseChaseList[this.bseIndex].bets_points_single
						}
						// console.log(amount)
				
						if(this.$store.state.user.info.points+this.$store.state.user.info.lotto_points<amount*this.mul*(this.chaseNum==''?1:this.chaseNum)*1) {
	
							if(this.$store.state.user.info.agent_id==0 || !this.$store.state.user.info.agent_id) {
								Toast(this.$store.state.system.webLang.insufficient_balance_please_reload);
								this.$router.push('/rechargeSelect')
								//没有代理直接提示余额不足，不做处理
							}else{
								//有代理得联系上级充值
								this.showRecharge=true
							}
							return
						}
					}else {
						if(this.$store.state.user.info.points+this.$store.state.user.info.lotto_points<this.lotteryClass[this.lotteryIndex].bets_points*this.mul*(this.chaseNum==''?1:this.chaseNum)) {
							if(this.$store.state.user.info.agent_id==0 || !this.$store.state.user.info.agent_id) {
								Toast(this.$store.state.system.webLang.insufficient_balance_please_reload);
								this.$router.push('/rechargeSelect')
								//没有代理直接提示余额不足，不做处理
							}else{
								//有代理得联系上级充值
								this.showRecharge=true
							}
							return
						}
					}
					
					this.showPayPwd = true
				}else {
					this.lotteryUserBets(2);//保存
				}
				
				
//				
				
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
	
				
//				this.showPayPwd = true;
//				setTimeout(() => {
//			       if (this.$refs.passwordInput) this.$refs.passwordInput.focus()
//			    }, 300)
			},
			//确定支付
			lotteryUserPay() {
//				if(!this.payPassword) {
//					Toast(this.$store.state.system.webLang.enter_the_payment_password)
//					return;
//				}
				
				this.lotteryUserBets(1);//购买
			},
			//充值电话
			toPhone() {
				window.location.href = 'tel://'+this.$store.state.system.rechargeMobile
			},
			beforeClose(action, done) {
				if(action=='confirm') {
					done(false) 
				}else {
					done()
				}
				
			},
			openBseChaseShow() {
				this.jin();
				if(this.$store.state.system.showGuide)return
				this.bseChaseShow = true
			},
			//跳转规则页面
			toRules(name) {
				this.play();
				if(this.$store.state.system.showGuide)return
				this.$router.push({name:'rules',query:{name:name}})
			},
			//关闭指数种类选择弹窗
		onCancelBseChase() {
				this.tui();
				this.bseChaseShow = false;
				
			},
			onSelectBseChase(name,index) {
				this.bseIndex = index;
				
				
				if(localStorage.getItem('firstReg')==1) {
					//取消注册登陆弹出新手指南，默认是SENSIX指数，选择了BTC/INR彩票才弹出新手指南
//					this.$router.push({name:'guide',query:{type:'guide'}})  2021/02/05 新的新手引导
				}
				
				
				
				this.bseInfo = this.bseChaseList[this.bseIndex];
				this.bseData();//重新请求行情
				
		
				for(let i = 0;i<this.waitLotteryList.length;i++) {
					if(this.waitLotteryList[i].lottery_type==2&&this.waitLotteryList[i].lottery_id==this.bseInfo.id) {
						this.lottery_time = this.waitLotteryList[i].lottery_time_new;
						break
					}
				}
				
				
				this.activityCountDown();

				for(let i = 0;i<this.bseChaseList.length;i++) {
					this.bseChaseList[i].color = ''
				}
				this.$set(this.bseChaseList[this.bseIndex],'color','#6173D5')
				this.bseChaseShow = false;
				this.bseTypeIndex = 1;
			
				
		},
			zhuitou() {
				this.jin();
				this.chaseShow = true;
			},
			//关闭选择期数弹窗
			onCancelChase() {
				this.tui();
				this.chaseShow = false;
				this.chaseNum = '';
				this.chaseBol = false;
				for(let i = 0;i<this.chaseList.length;i++) {
					this.chaseList[i].color = ''
				}
			},
		onSelectChase(item, index) {
				this.play();
				this.chaseNum = item.name;
				this.chaseShow = false;
				this.chaseBol = true;
				for(let i = 0;i<this.chaseList.length;i++) {
					this.chaseList[i].color = ''
				}
				this.chaseList[index].color = '#6173D5'
			},
			watchBseTypeIndex(index) {
				// console.log(this.bseTypeList,this.bseTypeIndex.length)
//				if(this.bseTypeIndex.length==1) {
//					for(let i = 0;i<this.bseTypeIndex.length;i++) {
//						if(index+1==this.bseTypeIndex[i]) {
//							Toast('Choose at least one way to play')
//							this.bseTypeIndex.push(index+1)
//									console.log(this.bseTypeIndex)
//							return
//						}
//					}
//			
//				}
	
		},
		//复投
//		reinvest() {
//			var list = this.selectNumList.slice(0,3);
//			var len = 0;
//			var a = '',b = '',c = '';
//			for(let i = 0;i<list.length;i++) {
//				if(list[i].num!='') {
//					list[i].bol = true
//					len+=1;
//					if(i == 0) {
//						a = list[0].num
//					}else if(i == 1) {
//						b = list[1].num
//					}else if(i == 2) {
//						c = list[2].num
//					}
//				}
//			}
//			
//			if(len==0) {
//				Toast('Please select at least 1 number')
//				return
//			} 
//\
//			this.reinvestLoading = true;
//			
//			
//			
//			if(len==1) {
//				//选择了1个数字，则有另外2个待选，共有100组玩法
//				console.log(a,b,c)
//				var temp = []
//				if(a) {
//					for(let i = 0;i<list[1].list.length;i++) {
//						for(let k = 0;k<list[2].list.length;k++) {
//							temp.push(a+list[1].list[i]+list[2].list[k])
//						}
//					}
//				}
//				
//				if(b) {
//					for(let i = 0;i<list[0].list.length;i++) {
//						for(let k = 0;k<list[2].list.length;k++) {
//							temp.push(list[0].list[i]+b+list[2].list[k])
//						}
//					}
//				}
//				
//				if(c) {
//					for(let i = 0;i<list[0].list.length;i++) {
//						for(let k = 0;k<list[1].list.length;k++) {
//							temp.push(list[0].list[i]+list[1].list[k]+c)
//						}
//					}
//				}
//			
//				this.reinvestList = temp;
//				Toast('100 sets of bets have been generated, which can be viewed in the number details');
//				setTimeout(()=>{
//					this.reinvestLoading = false;
//				},500)
//			} 
//			
//			if(len==2) {
//				//选择了2个数字，则有1个待选，共有10组玩法
//			
//				var temp = [];
//				if(a&&b) {
//					for(let i = 0;i<list[2].list.length;i++) {
//						temp.push(a+b+list[2].list[i])
//					}
//				}
//				if(a&&c) {
//					for(let i = 0;i<list[1].list.length;i++) {
//						temp.push(a+list[1].list[i]+c)
//					}
//				}
//				if(b&&c) {
//					for(let i = 0;i<list[0].list.length;i++) {
//						temp.push(list[0].list[i]+b+c)
//					}
//				}
//				console.log(temp)
//				this.reinvestList = temp;
//				Toast('10 sets of bets have been generated, which can be viewed in the number details');
//				setTimeout(()=>{
//					this.reinvestLoading = false;
//				},500)
//			}
//			
//			
//			if(len==3) {
//				var num = a+b+c
//
//				this.reinvestList = this.reinvestList.concat(this.getNum3(num))
//				console.log(this.reinvestList)
//				Toast('6 sets of bets have been generated, which can be viewed in the number details');
//				setTimeout(()=>{
//					this.reinvestLoading = false;
//				},500)
//			}
//			
//			
//			
//			
//			
//		},
		getNum3(chars) {
			var _this = this;
		    if (!chars.length) return;
		    var _foo = function(chars, tmp) {
		        for (var i in chars) {
		            var ch = chars;
		            var t = tmp + ch[i];
		            var ch = _this.delCharAt(chars, i);
		            if (ch.length < 1) {
		              _this.reinvestList.push(t);
		            } else {
		                _foo(ch, t);
		            }
		        }
		    };
		    _foo(chars, '');
		},
		delCharAt(s, i) {
		    var ss = '';
		    for (var j in s) {
		        if (i != j) {
		            ss += s[j];
		        }
		    }
		    return ss;
		},
		//猜数字和猜单双切换
		changeOddEvenIndex(index) {
			console.log(index);
			this.oddEvenIndex = index;
			this.resetNum();//清空选数
		},
		beforeCloseNum({ position, instance }) {
 	
		      switch (position) {
		        case 'left':
		        case 'cell':
		        case 'outside':
		          instance.close();
		          break;
		        case 'right':
		      
		      
		        
//		          Dialog.confirm({
//		            message: 'Delete the number?',
//		          }).then(() => {
			          
			          
			          instance.close();
			        
			          	
		          			this.leaveBol = true;
			          this.reinvestList.splice(this.numIndex,1);
			       
		
		          	setTimeout(()=>{
		          			this.leaveBol = false;
			          	
		          	},500)

		          	
		          	
		            
//		          });
		          break;
		      }
		    },
		    //关闭复投
		    closeComplexBol() {
		    	this.complexBol = false;
		    },
		    //猜数字和猜尾数切换以及新改的单双
		    selectBseClassIndex(index) {
					// this.takeoff();
					// this.winningPlay();
					this.bseClassIndex = index;
					// console.log(this.oddEvenIndex);
					if (index == 0) {
						// 之前的索引为1往数组里面添加单双玩法
		    		// this.oddEvenList.unshift(this.$store.state.system.webLang.single_or_double)
						// console.log(this.complexBol);
						
		    	}else {
		    		// this.oddEvenList.pop()
						// console.log(this.complexBol);
		    	}
		    },
		    closeActivity(index) {
				this.showActivity = false;
				if(localStorage.getItem('token')) {
					this.refreshMsg();
				}
				
				if(index==1) {
					if(localStorage.getItem('lang')=='hi') {
						Toast(this.activityInfo.sum_points + 'बाउंस के साथ');
					}else {
						Toast('With '+this.activityInfo.sum_points+' bouns');
					}
					
					
				}
			},
			tips(index) {
				// console.log(index)
				var clipboard = new ClipboardJS('.clip-btn');
		
				clipboard.on('success', () => {
					if(index==2) {
						Toast.success(this.$store.state.system.webLang.already_copied);
					}
					
					clipboard.destroy(); 
					return
				})
			},
			//新手引导
			//关闭引导页
			closeGuide() {
				
				this.$store.dispatch(types.GET_USER_INFO);
				
				if(this.$store.state.system.langType=='en') {
					Toast('You complete the tutorial, we have Rs.'+this.$store.state.system.guidePoints+' for you as welcome bonus! ')
				}else {
					Toast('आप ट्यूटोरियल पूरा करते हैं, हमारे पास स्वागत बोनस के रूप में आपके पास' +this.$store.state.system.guidePoints+ 'रुपये हैं!')
				}
				
				if(this.$store.state.system.registerBanner!=''){
  					this.$store.state.system.showRegisterBanner = true;
  				}
	
				document.body.style.overflow = "visible";
				this.$store.state.system.showGuide = false;
				this.$store.state.system.guideIndex = 0;
				this.$store.state.system.guideType = null;

			},
			//下一页
			nextGuide() {
				
				if(!clickBol)return
				this.showGuideDialog = true;
				this.$store.state.system.guideIndex+=1;
				this.$store.state.system.guideI = 0;
				this.$store.state.system.guideTemp = '';
				if(this.$store.state.system.guideType==1&&this.$store.state.system.guideIndex==6) {
					//那加兰购彩引导
					
					this.$router.push('/tickets')
					// console.log(this.$store.state.system.guideIndex);
					return
				}
				
				if(this.$store.state.system.guideType==1&&this.$store.state.system.guideIndex==14) {
					//那加兰购彩引导/比特币汇率购彩引导
					this.$router.push('/tickets')
					return
				}
				
				
				this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
				console.log(this.$store.state.system.guideIndex)
				clickBol = false;
				setTimeout(()=>{
					clickBol = true
				},500)
			},
			stopKeyBoaddText() {
				this.$store.dispatch(types.STOP_KEYBOARD_TEXT) 
			}
		

	}
};