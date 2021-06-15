<template>
	<div id="app" class="app">
		<transition name="router-fade" mode="out-in">
			<keep-alive v-if="isRouterAlive">
				<router-view class="view"></router-view>
			</keep-alive>
		</transition>

		
		
		<van-overlay :show="showTip||showActivity||$store.state.system.showRegisterBanner" @click="closeOverlay" class="tips-overlay"/>
		<div class="add-tip" v-if="showTip">
			<div v-if="$store.state.system.langType=='en'">Please click"<i class="iconfont iconfenxiang2"></i>",Then click "Add to Home Screen" to save this site.</div>
			<div v-if="$store.state.system.langType=='hi'">कृपया "<i class="iconfont iconfenxiang2"></i>" पर क्लिक करें, फिर इस साइट को बचाने के लिए "होम स्क्रीन में जोड़ें" पर क्लिक करें।</div>
			
			
			<div class="triangle_bottom"></div>
		</div>
		
		
		
		
		<transition name="slide-popupShow"> 
			<div class="activity-wrap" v-if="showActivity&&$store.state.system.langType=='en'">
				<div class="activity-title">Login Rewards</div>
	
				<div v-if="activityInfo.points>0" >
					<div class="activity-a">Welcome back! 
It's your {{activityInfo.count}} cumulative login days, ₹{{activityInfo.points}} for your today login, {{Number(activityInfo.next_count-activityInfo.count)}} days to go for your next rewards! Wish you the best luck!</div>
					
				</div>
				
				<div v-else>
					<div class="activity-a">Welcome back!
It's your {{activityInfo.count}} cumulative login days, {{Number(activityInfo.next_count-activityInfo.count)}} days to go your next rewards, Wish you the best luck!</div>
				</div>
				
				
				<div class="activity-btn">
					<span @click="closeActivity(1)" v-if="activityInfo.is_receive">Received</span>
					<span v-else @click="closeActivity(2)">Confirm</span>
				</div>
				<div class="activity-c">Bonuses received by login accumulation</div>
				
				<div class="activity-d">
					<i class="iconfont iconicon_sanjiaoxing" :style="`left:${tempPrecent}%`"></i>
					<div v-for="item in activityInfo.config" :key="item.index" :class="{'receive':activityInfo.count>item.count,'active':activityInfo.is_receive&&activityInfo.count==item.count}">
						<p>{{item.count}} days</p>
						<p>{{item.points}}</p>
					</div>
				</div>
			</div>
			
			
			<div class="activity-wrap" v-if="showActivity&&$store.state.system.langType=='hi'">
				<div class="activity-title">लॉग इन पुरस्कार</div>
	
				<div v-if="activityInfo.points>0" >
					<div class="activity-a">वापसी पर स्वागत है!
यह आपके {{activityInfo.count}} संचयी लॉगिन दिन हैं, आपके आज के लॉगिन के लिए login {{activityInfo.points}}, आपके अगले पुरस्कारों के लिए जाने के लिए {{Number(activityInfo.next_count-activityInfo.count)}} दिन! आपको शुभकामनाएँ!</div>
					
				</div>
				
				<div v-else>
					<div class="activity-a">वापसी पर स्वागत है!
यह आपका {{activityInfo.count}} संचयी लॉगिन दिन है, आपके अगले पुरस्कारों को जाने के लिए {{Number(activityInfo.next_count-activityInfo.count)}} दिन, आपको शुभकामनाएँ!</div>
				</div>
				
				
				<div class="activity-btn">
					<span @click="closeActivity(1)" v-if="activityInfo.is_receive">प्राप्त किया</span>
					<span v-else @click="closeActivity(2)">पुष्टि करें</span>
				</div>
				<div class="activity-c">लॉगिन संचय द्वारा प्राप्त बोनस</div>
				
				<div class="activity-d">
					<i class="iconfont iconicon_sanjiaoxing" :style="`left:${tempPrecent}%`"></i>
					<div v-for="item in activityInfo.config" :key="item.index" :class="{'receive':activityInfo.count>item.count,'active':activityInfo.is_receive&&activityInfo.count==item.count}">
						<p>{{item.count}}  दिन</p>
						<p>{{item.points}}</p>
					</div>
				</div>
			</div>
			
			
			
			
			<div class="register-banner" v-if="$store.state.system.showRegisterBanner&&$store.state.system.registerBanner.link">
				<img :src="$store.state.system.registerBanner.link" @click="openLink($store.state.system.registerBanner)" />
				<i class="iconfont iconguanbi1" @click="$store.state.system.showRegisterBanner = false"></i>
			</div>
			
			
		</transition>
		
		
		
		
		
	</div>
</template>

<script>
	import * as types from './store/types';
	import globals from './api/config';
  	import axios from 'axios';
  	import { Toast,Dialog } from 'vant';
	import * as moment from "moment";
	let clickBol = true;
	export default {
		provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
            return {
                reload: this.reload                                              
            }
        },
		data() {
			return {
				showRegisterSuccess:false,
				showTip:false,
				message:[],
				userOnlineTimer:null,
				flag:'',
				isRouterAlive: true,
				gameWS: null, //websocket
				showActivity:false,
				activityInfo:{},
				tempPrecent:0,
				showGuideDialog:true

			}
		},
		watch:{
			'$store.state.user.token'(val) {
				console.log(val)
				
				this.$store.state.user.loginBol = true;
				this.loginLog();//用户登录日志
			},
			'$store.state.user.registerBol'(val) {
				if(val) {
					console.log(val)
//					this.loginLog();//用户登录日志
				}
			}
		},
		mounted() {
		
			if(localStorage.getItem('lang')) {
				var temp = localStorage.getItem('lang')=='hi'?'hi':'en'
				this.$store.commit(types.UPDATE_LANG, temp);//多语言设置
				
			}else {
				this.$store.commit(types.UPDATE_LANG, 'en');//没有默认英语
			}
			
			
			this.noticeList();//获取广告轮播
			
			
			if(window.location.href.includes('ios')||window.location.href.includes('android')||window.location.href.includes('download')) {
					//url带参数ios或者android不作处理  落地页不做处理
					localStorage.setItem('fromType','app')
					
					
					
					document.addEventListener('plusready', function() {
				        var webview = plus.webview.currentWebview();
				        plus.key.addEventListener('backbutton', function() {
				            webview.canBack(function(e) {
				                if(e.canBack) {
				                    webview.back();             
				                } else {
				                    //webview.close(); //hide,quit
				                    //plus.runtime.quit();
				                    //首页返回键处理
				                    //处理逻辑：1秒内，连续两次按返回键，则退出应用；
				                    var first = null;
				                    plus.key.addEventListener('backbutton', function() {
				                        //首次按键，提示‘再按一次退出应用’
				                        if (!first) {
				                            first = new Date().getTime();
				                            if(window.location.href.includes('results')) {
		
					                            Toast(this.$store.state.system.webLang.press_again_to_exit_the_app);
					                            
				                            }
				                            setTimeout(function() {
				                                first = null;
				                            }, 1000);
				                            
				                        } else {
				                            if (new Date().getTime() - first < 1500) {
				                                plus.runtime.quit();
				                            }
				                        }
				                    }, false);
				                }
				            })
				        });
				    });
					
					
					
					
					
					
					
					
					
					
			}else {
				
				let ua = navigator.userAgent.toLowerCase();
		        //Android终端
		        let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;  
		　　   //Ios终端
		        let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
		        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
							// console.log(navigator.userAgent);
					//ios
//					this.showTip = true;
//		        	setTimeout(()=>{
//		        		this.showTip = false;
//		        	},3000)
					
					
					if(localStorage.getItem('tipTime')) {
						var tipTime = localStorage.getItem('tipTime');
						var newTime = new Date().getTime();
						if(newTime-tipTime>3600*1000*24) {
							//限制一天只弹出一次
							localStorage.setItem('tipTime',new Date().getTime())
		
							this.showTip = true;
				        	setTimeout(()=>{
				        		this.showTip = false;
				        	},3000)
						
						}
					}else {
						//限制一天只弹出一次
							localStorage.setItem('tipTime',new Date().getTime())
							this.showTip = true;
				        	setTimeout(()=>{
				        		this.showTip = false;
				        	},3000)
							
							
					}
	
					
				} else if (/(Android)/i.test(navigator.userAgent)&&localStorage.getItem('fromType')!='app') {
					console.log(navigator.userAgent);
					this.$store.state.system.showAndroid = true;
				// 	document.addEventListener( "plusready", function(){
				// 	alert('yincang')
				// 	this.$store.state.system.showAndroid = false;
				// },false)
					
					
					
				}

			}
			
			
	
			
			this.systemConfig();//获取系统配置
	
			if(localStorage.getItem('token')) {
				this.getUserInfo();

//				this.activityLogin()
				this.loginLog();//记录用户日志
//				this.refreshMsg();//测试
				clearInterval(this.userOnlineTimer)
				
				this.userOnlineTimer = setInterval(()=>{
					this.userOnline()
				},40000)
				
				setTimeout(()=>{
					this.initWebSocket()
				},2000)
			}else {
				this.initWebSocket()
			}
			
			
			
			
			
			
			
			
			
			
			
			
			
			
		},
		methods: {
			closeOverlay() {
				this.showTip = false;
				this.showActivity = false;
				this.$store.state.system.showRegisterBanner = false;
			},
			//获取广告轮播
			noticeList() {
				var params = {
					position:1
				}
				axios.post(globals.api.bannerList,params).then((res)=>{
					this.$store.state.system.bannerList = res.data.data
					for(let i = 0;i<res.data.data.length;i++) {
						if(res.data.data[i].is_mandatory=='Y'&&res.data.data[i].link&&this.$store.state.user.loginBol) {
							this.$store.state.system.registerBanner = res.data.data[i]
						}
					}
	       		}).catch((error)=>{})
			},
			openLink(item) {
				 // 点击banner链接类型 1站内 2站外 3弹出
				 if(item.link=='')return
				 if(item.link_type==3) {
				 	window.location.href = item.link
//				 	this.showSwipeImg = true;
//				 	this.linkImg = item.link
				 }else if(item.link_type==2){
				 	window.location.href = item.link
				 }else {
				 	this.$router.push(item.link)
				 }
			},
			activityLogin() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token')
				}
				return new Promise((resolve,reject)=>{
					axios.post(globals.api.activityLogin,params).then((res)=>{
						console.log(res)
							if(res.data.code!=333){
								var data = res.data.data;
							
									var a = 100/(data.config.length)-4-((100/(data.config.length)-4)/2)
									for(let i = 0;i<data.config.length;i++) {
										data.config[i].precent = a+i*(100/(data.config.length))
										if(data.count<=data.config[i].count) {
											if(i==0) {
												this.tempPrecent = data.count/data.config[i].count*data.config[i].precent
											}else {
												this.tempPrecent = data.config[i-1].precent+(data.count-data.config[i-1].count)/(data.config[i].count-data.config[i-1].count)*(100/(data.config.length))
											}
											
											break
										}
									}
									this.activityInfo = data
									console.log(this.activityInfo)
									console.log(data.count)
//									data.count = 3
									var activeType = data.count == 1?11:data.count == 3?8:data.count == 5?10:''
									console.log(activeType);
									this.getActiveConfig(activeType)//累计登录活动参与参数获取
									
									resolve(true)
								
							}else {
								this.$store.state.system.guideBol = false
								this.refreshMsg();
							
							}
							
							
							
		
							
					
			       		}).catch((error)=>{
			       			error.msg?Toast(error.msg):'';
			       			reject(false)
			       			
			   		})
				})
				
			},
			//记录用户日志
			 loginLog() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token')
				}		
				
				
				
				axios.post(globals.api.loginLog,params).then(async(res)=>{
					
var n = await this.activityLogin()
					if(!n)return
					
					// alert('nnnnnnnnn')
					axios.post(globals.api.systemTime).then((resA)=>{
				
					
						var time = resA.data.data.replace(/-/g,'/')
						
						var now = new Date(time);
						var year = now.getFullYear();
					    var mon = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
					    var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
					
						var timeDate = String(year)+String(mon)+String(day); //服务器当前日期
					
						if(window.location.href.includes('download')) {
							
						}else {
							if(localStorage.getItem('timeDate')){
								// alert(this.activityInfo.is_receive);
								if(timeDate==localStorage.getItem('timeDate')){
									// alert('不会谈')
									this.refreshMsg();
									// var tianshu = this.activityInfo.count;
									// if(tianshu == 1 || tianshu == 3 || tianshu == 5 || tianshu == 7 || tianshu == 14) {
									// 	this.$store.state.system.guideBol = true;
									// } else {
									// 	this.$store.state.system.guideBol = false;
									// }
									this.$store.state.system.guideBol = false;
									console.log(this.$store.state.system.guideBol)
									return
								}
								
								this.showActivity = true;
								localStorage.setItem('timeDate',timeDate)
							}else {
								localStorage.setItem('timeDate',timeDate)
								this.showActivity = true;
							}
						}
						
						
						
					}).catch((error)=>{})
					
					
					
		       		}).catch((error)=>{
		       			error.msg?Toast(error.msg):'';
		   		})
			},
			closeActivity(index) {
				this.showActivity = false;
				if(index==1) {
					if(localStorage.getItem('lang')=='hi') {
						Toast(this.activityInfo.sum_points + 'बाउंस के साथ');
					}else {
						Toast('With '+this.activityInfo.sum_points+' bouns');
					}
				}
				if(localStorage.getItem('token')) {
					this.refreshMsg();
				}
			},
			refreshMsg() {
		   		var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token')
				}
				  axios.post(globals.api.refreshMsg,params)
				  .then(res => {
	      				this.getMessage();//获取弹窗信息
					  }).catch((error)=>{
		       			error.msg?Toast(error.msg):''
		       		})
		   }, 
		   // 累计登录活动参与参数获取
		   getActiveConfig(activeType) {
		   	//type 11：那加兰购彩引导 10：充值引导  8：手机号引导
		   		var params = {
					type:activeType
				}

				  axios.post(globals.api.getActiveConfig,params)
				  .then(res => {
				  	
				  	var paramsA = {
						UserId: localStorage.getItem('userId'),
						UserToken: localStorage.getItem('token'),
						id:res.data.data[res.data.data.length-1].id
					}
				  	
				  	
				  		//领取任务凭证
	      				 axios.post(globals.api.activityRecieveNew,paramsA)
						  .then(resA => {
						  	
						  	
						  		var paramsB = {
									UserId: localStorage.getItem('userId'),
									UserToken: localStorage.getItem('token'),
									id:res.data.data[res.data.data.length-1].id,
									act_token:resA.data.data.act_token
								}
					
							  axios.post(globals.api.activityCompleteNew,paramsB)
							  .then(resB => {
							  		
							  		this.$store.state.system.guidePoints = resB.data.data.points
							 
								
								  }).catch((errorB)=>{
						
					       			errorB.msg?Toast(errorB.msg):''
					       			
					       		})
						  	
						  		
						  	
						  	
						  	
							  }).catch((errorA)=>{
					
				       			errorA.msg?Toast(errorA.msg):''
				       		
				       		})
							  
							  
							  
							  
					  }).catch((error)=>{
						
		       			error.msg?Toast(error.msg):''
		       		})
		   },
			getMessage() {
	      	
	  			var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					is_read: 'N',
					type:'4', //传多个时用半角逗号分隔 1中奖通知 2系统公告 3运营活动 4弹窗信息 5系统通知消息类型 1中奖通知 2系统公告 3运营活动 4弹窗信息
				}
	
				  axios.post(globals.api.getMsgList,params)
				  .then(res => {

				  		this.message = res.data.data;	//这个返回true
				  		// console.log(this.$store.state.system.registerBanner,this.$store.state.system.guideBol)
				  		// alert(this.$store.state.system.registerBanner)  这里是空
				  		// alert(this.$store.state.system.guideBol)  如果第一次登录这里会是true
				  		var langType = this.$store.state.system.langType;
				  	// console.log("yuyan"+langType); 
//				  		
//							
//				  	this.activityInfo.count =3
//				  	this.$store.state.system.guideBol = true
//				  	this.$store.state.user.info.mobile = ''
//				  	console.log()
							
				  		if(this.message.length==0) {
				  			
				  			if(!this.$store.state.system.guideBol) {
									
				  				if(this.$store.state.system.registerBanner!=''){
										// alert('3')
				  					this.$store.state.system.showRegisterBanner = true;
				  				}
									// alert(this.message.length)
				  				return
				  			}
				  			var scrollBol = false;
							//  alert(this.activityInfo.count)
				  			if(this.activityInfo.count==1) {
				  				//第一天登录 那加兰购彩引导
				  				this.$router.push('/purchase')
								this.$store.state.system.guideText = this.$store.state.system.guideList[0][langType]
								this.$store.state.system.guideType = 1;
								scrollBol = true;
								// alert("hello")
				  			}else if(this.activityInfo.count==3&&this.$store.state.user.info.mobile=='') {
				  				//第三天登录 绑定手机号引导   已经绑定手机号码的玩家不触发。
				  				this.$router.push('/results')
				  				this.$store.state.system.guideText = this.$store.state.system.guideList[1][langType]
								this.$store.state.system.guideType = 3;
								scrollBol = true;
								// alert("hello3")
				  			}else if(this.activityInfo.count==5) {
				  				//第五天登录 充值引导
				  				this.$router.push('/results')
				  				this.$store.state.system.guideText = this.$store.state.system.guideList[2][langType]
				  				console.log(this.$store.state.system.guideText)
								this.$store.state.system.guideType = 5;
								scrollBol = true;
				  			}else if(this.activityInfo.count==7&&this.$store.state.user.info.is_agent=='N') {
				  				//第七天登录 推广员系统引导  代理不触发
				  				this.$router.push('/results')
				  				this.$store.state.system.guideText = this.$store.state.system.guideList[3][langType]
				  				console.log(this.$store.state.system.guideText)
								this.$store.state.system.guideType = 7;
								scrollBol = true;
				  			}else if(this.activityInfo.count==14&&this.$store.state.user.info.is_agent=='N') {
				  				//第十四天登录 代理咨询引导
				  				this.$router.push('/results')
				  				this.$store.state.system.guideText = this.$store.state.system.guideList[4][langType]
				  				console.log(this.$store.state.system.guideText)
									this.$store.state.system.guideType = 14;
									scrollBol = true;
				  			}
			  				console.log(scrollBol);
				  			if(scrollBol == true) {
									this.$store.state.system.guideType = this.activityInfo.count
				  				document.body.style.overflow = "hidden"; //禁止滚动
									this.$store.state.system.showGuide = true; //打开新手引导
									console.log(this.$store.state.system.showGuide);
									this.$store.dispatch(types.KEYBOARD_TEXT)
				  			}
				  			
							
				  		}else {
				  		 	var time = moment(this.message[0].creation_time*1000).format('YYYY/MM/DD HH:mm:ss')
							Dialog.alert({
							  message: '<p class="message-p">Notice</p>\n'+this.message[0].content
							}).then(() => {
							  	this.msgRead(this.message[0].id)
							});
				  		}
				  		 
	
	      	
					  }).catch((error)=>{
						
		       			error.msg?Toast(error.msg):''
		       		})
	
		    },
		    	  
		    msgRead(id) {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					id:id
				}
	
				  axios.post(globals.api.msgRead,params)
				  .then(res => {
				  		this.getMessage();
				  		
					  }).catch((error)=>{
						
		       			error.msg?Toast(error.msg):''
		       		})
			},
			initWebSocket() {
			 	var timerOne = window.setInterval(() => {
		      	if (this.$socket) {
					this.$socket.emit('uid', 111)
		        	window.clearInterval(timerOne)
		        	return;
		      	}
		    	}, 500)
			 	
			 	

				
			    this.sockets.subscribe('win_msg', (data) => {
			  
					this.$store.state.system.messageData = ''
			  		this.$store.state.system.messageList.push(data);
			  		if(this.$store.state.system.messageList.length>5) {
			  			this.$store.state.system.messageList.shift()
			  		}
			  		this.$store.state.system.messageData = this.$store.state.system.messageList.join(" ----- ");

		
			  		
				})
			     this.sockets.subscribe('recharge_msg', (data) => {
			  		
			  		this.$store.state.system.messageData = ''
			  		this.$store.state.system.messageList.push(data)
			  		if(this.$store.state.system.messageList.length>5) {
			  			this.$store.state.system.messageList.shift()
			  		}
			  		this.$store.state.system.messageData = this.$store.state.system.messageList.join(" ----- ");
				})

		

			},
			websocketCommonSend() {
				
			},
			reload () {
                this.isRouterAlive = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAlive = true;         //再打开
                    this.$router.push('/')
                }) 
            },
			//判断设备
			_isMobile() {
		      	let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
		      	return flag;
		   },

			//获取系统配置
			systemConfig() {
				axios.post(globals.api.systemConfig).then((res)=>{
			
					this.$store.state.system.systemInfo = res.data.data
					if(!this.$store.state.system.rechargeMobile) {
						var whatsappList = res.data.data.whatsapp.split(',')
					
						var temp = whatsappList[Math.floor(Math.random()*whatsappList.length)]
						// console.log(temp);
						this.$store.state.system.rechargeMobile = temp
					}
					
		       		}).catch((error)=>{
		       			error.msg?Toast(error.msg):'';
		   		})
			},
	
			//设置用户在线状态
			userOnline() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token')
				}
				axios.post(globals.api.userOnline,params).then((res)=>{
				if(res.data.code==305) {
					clearInterval(this.userOnlineTimer)
					Toast(this.$store.state.system.webLang.login_abnormal)
					this.$store.dispatch(types.LOGOUT);
			  		this.$router.push('/login')
				}
					
		       		}).catch((error)=>{
		       			error.msg?Toast(error.msg):'';
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
				    
				    
				    
					this.$store.commit(types.UPDATE_USER_INFO, res.data.data);//更新用户信息
					// console.log(res.data.data.agent_id)
						if(res.data.data.agent_id==0||res.data.data.agent_id) {
						
						var params = {
							UserId:localStorage.getItem('userId'),
							UserToken:localStorage.getItem('token'),
							agent_id:res.data.data.agent_id
						}
						
						
						
						//获取代理商信息
						axios.post(globals.api.getAgentInfo,params).then((res)=>{
//							console.log(res.data.data,res.data.data.length)
							if(res.data.data.whatsapp) {
								
								this.$store.state.system.rechargeMobile = res.data.data.whatsapp
							}
							// console.log(this.$store.state.system.rechargeMobile)
				       		}).catch((error)=>{
				       			error.msg?Toast(error.msg):'';
				   		})
					       	
					}else {
						this.$store.state.system.rechargeMobile = this.$store.state.system.systemInfo.whatsapp
		
					}
					
					
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},

		
		}
	}
</script>

<style lang="scss">
	@import 'assets/style/app.scss';
	@import './assets/iconfont/iconfont.css';
	.add-tip {
		position: fixed;
		bottom: 0.6rem;
		left: 5%;
		width: 90%;
		z-index: 9999999999;
		color: #333;
		font-size: 0.25rem;
		padding: 0.12rem 0.25rem;
		background:#fff;
		/*box-shadow:1px 1px 1px 1px #eee;*/
		border-radius:0.17rem;
		.iconfont {
			color:#000;
			font-size:0.48rem;
		}
		
	}
	.add-tip:before{
	 	position: absolute;
  		display: inline-block;
      	width: 0;
      	height: 0px;
      	bottom: -0.12rem;
      	left: 48%;
      	content: '';
      	border-style: solid;
      	border-width: 0.15rem;
      	border-color: #fff #fff transparent transparent;
      	transform: rotate(135deg);
      	/*box-shadow: 1px -1px 1px #eee;*/
	}
	.tips-overlay {
		z-index: 99999!important;
	}
	.app {
		
	
	.pop-up-bg {
    position: fixed;
    z-index: 999999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    transition: all .2s;
    overflow: hidden;
}
.slide-popupShow-enter-active,
.slide-popupShow-leave-active {
    transition: opacity 0.2s;
    -webkit-transform: scale(0.3);
    transform: scale(0.3);
    opacity: 0;
}
.fade-enter,
.slide-popupShow-leave-active {
    opacity: 0;
    -webkit-transform: scale(0.3);
    transform: scale(0.3);
}


	/*//注册成功*/
	.register-success {
	    z-index: 100000000;
	    position: fixed;
	    top: 25%;
	    left: 7.5%;
	    width: 85%;
	    transition: all .2s;
	    background: #fff;
	    text-align: center;
	    padding: 0.6rem 13%;
	    border-radius: 5px;
	    .logo  {
	        width: 0.8rem;
	        margin-bottom: 0.2rem;
	        border-radius: 0.2rem;
	    }
	    .success-text {
	        font-size: 0.3rem;
	        margin-bottom: 0.5rem;
	        color: #000;
	        font-weight: bold;
	    }
	    .success-wrap {
	        p {
	            font-size: 0.3rem;
	            color: #8B899A;
	            line-height: 0.4rem;
	            text-align: center;
	        }
	        p:nth-of-type(3) {
	            color: #F5655B;
	            font-size: 0.22rem;
	        }
	    }
	    .success-btn {
	        margin-top: 0.5rem;
	        .van-button--normal {
	            width: 100%;
	            font-size: 0.3rem!important;
	            border-radius: 50px;
	        }
	    }
	}
}
/*//注册成功*/

.register-banner {
	position: fixed;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.3s;
    z-index: 9999999999;
    text-align: center;

    .iconguanbi1 {
        font-size: 0.6rem;
        color: #fff;
    }
    img {
    	width: 90%;
    	margin: 0.4rem 5%;
    }
}
    
      
        
   
        
        
</style>