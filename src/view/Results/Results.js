import Tabbar from '../../components/Tabbar.vue';
import * as moment from "moment";
import * as types from '../../store/types';
import globals from '../../api/config';
import axios from 'axios';
import { Toast,Dialog } from 'vant';
import ClipboardJS from '../../plugin/app/clipboard.min.js';
import { PullRefresh } from 'vant';
import IndexHeader from '../../components/IndexHeader.vue';
import FloatBall from '../../components/FloatBall.vue';
import LotteryNotice from '../../components/LotteryNotice.vue';
let clickBol = true
export default {
	inject:['reload'], 
	data() {
		return {
			lotteryClassShow:false,
			lotteryClass:[],//彩种种类
			activityTimer:null,
			lotteryDetailShow:false,//开奖详情显示
			lotteryDetail:[],//开奖详情
			reqLoading:false,
			isLoading:false,
			lotteryListNum:0,
			percent:0,
			timer:null,
			lotteryId:'',
			showRecharge:false,//充值
			sysTime:0,//系统时间
			showSwipeImg:false,//banner图片弹窗
			sysMonth:'',//月份
			systemTimer:null,
			lotteryListA:[],//临时存放
			osTop:0,
			fixed:false,
			newHistoryList:[],
			channel:'',
			showGuide:true
		}
	},
	components: {
		Tabbar,
		PullRefresh,
		IndexHeader,
		FloatBall,
		LotteryNotice

	},

	watch: {
		osTop(val) {
			if(val>120) {
				this.fixed = true
			}else {
				this.fixed = false
			}
		}
	},
	mounted() {
//		var clipboard = new ClipboardJS('.clip-btn');
//		clipboard.on('success', () => {
//			Toast.success(this.$store.state.system.webLang.already_copied);
//		})
		window.addEventListener('scroll', this.scrollBottomLotteryList);
		
	},
	beforeDestroy(){
	   window.removeEventListener("scroll",this.scrollBottomLotteryList)
	},

	activated() {
	
		if(window.localStorage.getItem('channel')) {
			this.channel = window.localStorage.getItem('channel')
		}
		if(window.location.href.includes('channel') ) {
			//拿到渠道码参数后存在本地
			window.localStorage.setItem('channel',this.$route.query.channel)
			this.channel = this.$route.query.channel
		}
		
		var that = this
		that.lotteryDetailShow = false;
		// console.log("出发了码"+this.$store.state.system.guideType);
		// console.log("哈喽出发"+this.$store.state.system.showGuide);
		if(this.$store.state.system.guideType==1&&this.$store.state.system.guideIndex==7&&this.$store.state.system.showGuide) {
			//那加兰购彩引导/比特币汇率购彩引导
			this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
		}

		if(this.newHistoryList.length)return
		this.getLotteryClass();//彩种种类
		
		this.getSystemTime();//获取系统时间

		

		
	},
	deactivated() {
		this.reqLoading = false;
		this.percent = 0;
		this.lotteryId = '';
		this.lotteryDetailShow = false;
		this.lotteryDetail = [];
		this.showRecharge = false;
		this.showActivity = false;
	},

	methods: {
		//判断设备
		_isMobile() {
	      	let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
	      	return flag;
	  	},
		//跳转购买彩票
		toLottery(item) {
			// console.log(item)
			if(this.$store.state.system.guideType==2&&this.$store.state.system.guideIndex==1)return
			if(item.lottery_type==2&&item.lottery_id==2&&localStorage.getItem('firstReg')==1) {
				this.$router.push({name:'guide',query:{type:'guide'}})
				return
			}
//			if((!item.timer.hou&&!item.timer.min&&!item.timer.sec)||!item.timerA)return
			if(!item.timer.hou&&!item.timer.min&&!item.timer.sec)return
			this.$router.push({name:'lottery',query:{type:item.lottery_type,id:item.lottery_info.id}})
		},
		closeBg() {
			this.showPayPwd = false;
			this.showRecharge = false;
			this.showActivity = false;
		},
		//充值电话
		toPhone() {
			window.location.href = 'tel://'+this.$store.state.system.rechargeMobile
		},

		getNum(num) {	
			var a = num.substring(0,2);
			var b = num.substring(2,3);
			var c = num.substring(3,4);
			var d = num.substring(4,5);
			var e = num.substring(5,6);
			var f = num.substring(6,7);
			var g = num.substring(7,8);
			
			var list = [];
			list.push(a,b,c,d,e,f,g)

			return list
		},
		getNumA(num) {	
			var a = num.substring(0,1);
			var b = num.substring(1,2);
			var c = num.substring(2,3);

			var list = [];
			list.push(a,b,c)
			return list
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
		compare(property){
		    return function(a,b){
		        var value1 = a[property];
		        var value2 = b[property];
		        return value1 - value2;
		    }
		},
		scrollBottomLotteryList() {
			let osTop = document.documentElement.scrollTop || document.body.scrollTop;
			this.osTop = osTop
			if(((window.screen.height + osTop) > (document.body.clientHeight-50)) && this.REQUIRE) {
			}
		},
		activityCountDown() {
				let newTime = new Date(this.sysTime).getTime();
			
			    clearInterval(this.activityTimer)
			    this.activityTimer = setInterval(() => {
			      // var num = 0;
			    var _this = this;
			      
			    
				newTime+=1000;
			
			      // 获取服务器时间
			  
			     
			      let endTimeList = this.newHistoryList;

			      let countDownArr = [];
				
			      // 对结束时间进行处理渲染到页面
			      endTimeList.forEach(o => {

			        let beginTime = o.lottery_time_new;
			
			        let obj = null;
			        // 如果开始时间大于当前时间，说明未开始
			        // console.log(newTime - beginTime)
			        if (beginTime - newTime > 0) {
			          let time = (beginTime - newTime) / 1000;
			          // 获取天、时、分、秒
			          let day = parseInt(time / (60 * 60 * 24));
			          let hou = parseInt(time % (60 * 60 * 24) / 3600);
			          let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
			          let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
			          obj = {
			            hou: Number(this.timeFormat(day))>=1?Number(this.timeFormat(hou))+Number(this.timeFormat(day))*24:this.timeFormat(hou),
			            min: this.timeFormat(min),
			            sec: this.timeFormat(sec)
			          }
			         
			        } else {

						if(o.lottery_type==2) {
							//指数
							if(obj=='')return
							clearInterval(this.activityTimer)

							setTimeout(()=>{
								this.historyList() //获取历史开奖记录(v2)  获取所有彩票最后一期开奖记录和下一期彩票   2020/12/04
							},10000)
						}
//			        	
			        	obj = '';


			
			
			        }
		
			        countDownArr.push(obj);
			      })

			      for (let i = 0; i < countDownArr.length; i++) {
			  			this.$set(this.newHistoryList[i], 'timer', countDownArr[i]);
		     	  }
//			       console.log(this.newHistoryList)
			    }, 1000)
			},
			timeFormat(param) {//小于10的格式化函数
			    return param < 10 ? '0' + param : param;
			},
		//获取彩票种类信息
		getLotteryClass() {
	
			axios.post(globals.api.getLotteryClass).then((res)=>{
				this.lotteryClass = res.data.data;
		
				var temp = {name:this.$store.state.system.webLang.All,id:'',color:'#6173D5'}
				this.lotteryClass.unshift(temp)
//				console.log(this.lotteryClass)
				
				
				//从开奖历史页跳转过来
//				if(this.$route.query.id) {
//					var index = '';
//					for(let i = 0;i<this.lotteryClass.length;i++) {
//						this.lotteryClass[i].color = ''
//						if(this.$route.query.id==this.lotteryClass[i].id) {
//							index = i;
//						}
//					}
//					this.lotteryClass[index].color = '#6173D5'
//					this.lotteryId = this.$route.query.id;

//				}else {
//					this.getLotteryList();//获取历史开奖记录
//				}
//				
		
				

				
				
		
       		}).catch((error)=>{})
		},
		//选择彩种
		onSelectLotteryClass(item) {
 
			for(let i = 0;i<this.lotteryClass.length;i++) {
				this.lotteryClass[i].color = ''
			}
			item.color = '#6173D5'
			this.lotteryClassShow = false;
			this.lotteryId = item.id;
			var temp = this.lotteryListA;
		
			var tempA = [];
			for(let i = 0;i<temp.length;i++) {
				if(item.type==1) {
					if(temp[i].lottery_id==item.id&&item.type==temp[i].lottery_type) {
						tempA.push(temp[i])
					}
				}else if(item.type==2){
					if(item.type==temp[i].lottery_type) {
						tempA.push(temp[i])
					}

				}else {
					tempA.push(temp[i])
				}
			
			}

			this.newHistoryList = tempA

		},
		//打开开奖详情
		openLotteryDetail(item){
			// console.log(item)
			if(item.lottery_type==1) {
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
				
				this.lotteryDetail = item;
				// console.log(item)
				
			}else {
				//指数
				this.lotteryDetail = item;
			
			}
			
		// console.log(this.lotteryDetail)
			this.lotteryDetailShow = true;
        },
        //关闭彩种选择弹窗
		onCancel() {
			this.lotteryClassShow = false;
		},
		//跳转开奖历史
		toHisResults(item) {
//			console.log(item)
			
			this.$router.push({name:"hisResults",query:{type:item.lottery_type,id:item.lottery_id}})
		},
		//跳转开奖视频
		toVideo(item) {
			const temp = item.no;
			// console.log(temp)
			const y = temp.substring(2,4);
			const m = temp.substring(4,6);
			const d = temp.substring(6,8);
			const name = item.lottery_id==1?'ML':item.lottery_id==2?'DL':item.lottery_id==3?'EL':''
			
			const result = 'https://results.lottoplus.in/'+name+d+m+y+'.PDF'
			// console.log(result)
			this.$router.push({name:'previewWord',query:{url:result}})
//			return
//			this.$router.push({name:'video',query:{detail:video_url}})
		},
		//跳转数据网站
		toNet(video_url) {
			window.location.href = video_url
		},
		openLink(item) {
			 // 点击banner链接类型 1站内 2站外 3弹出
			 if(item.link_type==3) {
			 	this.showSwipeImg = true;
			 	this.linkImg = item.link
			 }else if(item.link_type==2){
			 	window.location.href = item.link
			 }else {
			 	this.$router.push(item.link)
			 }
		},
		//下拉刷新
		onRefresh() {
			this.isLoading = true;
			this.historyList()//获取历史开奖记录(v2)  获取所有彩票最后一期开奖记录和下一期彩票   2020/12/04
	    },
		getNewTime(time) {
			if(time) {
				var timeA = new Date(time.replace(/-/g,'/')).getTime();
				return moment(timeA).format('YYYY/MM/DD');
			}
		},
		//获取系统时间
		getSystemTime() {
			axios.post(globals.api.systemTime).then((res)=>{
				clearInterval(this.systemTimer)
	
				var systemTime = new Date((res.data.data).replace(/-/g,'/')).getTime()

				this.systemTimer = setInterval(()=>{
					systemTime+=1000;
					this.sysTime = systemTime;
//					console.log(this.sysTime)
				},1000)
				
				setTimeout(()=>{
					this.historyList()//获取历史开奖记录(v2)  获取所有彩票最后一期开奖记录和下一期彩票   2020/12/04
				},1000)
				
				
				
				}).catch((error)=>{	
       			
       		})
				
				
		},	
		//获取历史开奖记录(v2)  获取所有彩票最后一期开奖记录和下一期彩票   2020/12/04
		historyList() {
			this.reqLoading = true;
		  	axios.post(globals.api.historyList)
		  	.then(res => {
		
				var data = res.data.data;
				for(let i = 0;i<data.length;i++) {
					data[i].lottery_time_new = new Date((data[i].next_lottery_info.lottery_time).replace(/-/g,'/')).getTime();
				}
			
				 
				// this.newHistoryList = data.sort(this.compare('lottery_time_new'));
				this.newHistoryList = data;
				this.lotteryListA = this.newHistoryList;//临时存放，筛选用
				// console.log(this.newHistoryList)
				this.activityCountDown();
				this.isLoading = false;
				this.reqLoading = false;
			}).catch((error)=>{	
       			error.msg?Toast(error.msg):''
       			this.isLoading = false;
       			this.reqLoading = false;
       		})
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
		//关闭引导页
		closeGuide(type) {
			if(type=='point') {
				this.$store.dispatch(types.GET_USER_INFO);
				if(this.$store.state.system.langType=='en') {
					Toast('You complete the tutorial, we have Rs.'+this.$store.state.system.guidePoints+' for you as welcome bonus! ')
				}else {
					Toast('आप ट्यूटोरियल पूरा करते हैं, हमारे पास स्वागत बोनस के रूप में आपके पास' +this.$store.state.system.guidePoints+ 'रुपये हैं!')
				}
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
			this.$store.state.system.guideIndex+=1;
			this.$store.state.system.guideI = 0;
			this.$store.state.system.guideTemp = '';
			// alert('下一页')
			if(this.$store.state.system.guideType==1&&this.$store.state.system.guideIndex==8) {
				//那加兰购彩引导/比特币汇率购彩引导
				this.$router.push({name:'lottery',query:{type:2,id:2}})
				return
			}
			
//				if(this.$store.state.system.guideType==2&&this.$store.state.system.guideIndex==2) {
//					//比特币汇率购彩引导
//					this.$router.push({name:'lottery',query:{type:2,id:2}})
//					return
//				}
		
			if(this.$store.state.system.guideType==3&&this.$store.state.system.guideIndex==2) {
				//绑定手机号引导
				this.$router.push('/mine')
				return
			}
			
			if(this.$store.state.system.guideType==5&&this.$store.state.system.guideIndex==2) {
				//充值引导
				this.$router.push('/rechargeSelect')
				return
			}
			
			if(this.$store.state.system.guideType==7&&this.$store.state.system.guideIndex==2) {
				//推广员系统引导
				this.$router.push('/mine')
				return
			}
			
			if(this.$store.state.system.guideType==14&&this.$store.state.system.guideIndex==2) {
				//代理咨询引导
				this.$router.push('/mine')
				return
			}
	
			
			this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
			// console.log(this.$store.state.system.guideIndex)
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