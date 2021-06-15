<template>
	<div class="login-wrap register-wrap">
		
		
		<div class="langusge-list">
			<span v-for="(item,index) in $store.state.system.languageList" :key="index" :class="{'active-en':$store.state.system.langIndex==index}" @click="settingLang(index)">{{item.name}}</span>
		</div>
		
		

		<div class="logo-img" @click="$router.push('/')">
			<img src="../../assets/images/logo.png" />
			<p>{{$store.state.system.webLang.start_login}}</p>
		</div>
		
		
		<van-cell-group>
				<div class="colr">Mobile Number or User name</div>
		  	<van-field v-model="userName" @blur="userNameBlur" clearable :error-message="errorMsgA" maxlength="12" :border="false" placeholder="Click to enter" />
		  	<div  class="colr">{{$store.state.system.webLang.password}}</div>
		  	<van-field style="margin-bottom: 0;" v-model="password" @blur="passwordBlur" :error-message="errorMsgB"  maxlength="12" :type="passwordType" :border="false"
				 :right-icon="passwordType === 'password' ? Visible : disapperance"
				  @click-right-icon="sight" :placeholder="$store.state.system.webLang.passwordTips" />

		</van-cell-group>
		
		
		<div class="register-btn">
				<div class="login-tips">
				<div @click="toRegister">
					<!-- <span>{{$store.state.system.webLang.new_user}}</span> -->
					<span class="hue">{{$store.state.system.webLang.register}}</span>
				</div>
				<div @click="forgetPass">
					<span class="hue">Forgot password?</span>
				</div>
				<!--<div @click="toGuset">
					<span>{{$store.state.system.webLang.guest}}</span>
				</div>-->
			</div>
			<van-button @click="login" block :color="showRegister?'#E40001':'#DCDCDC'" :loading="loading" :disabled="!showRegister" :class="{'disabled-btn':!showRegister}" >{{$store.state.system.webLang.log_in}}</van-button>
			
		
			
		</div>
		
		
		<div class="other-login">
			<div class="other-title">
				<span class="line-lf"></span>
				{{$store.state.system.webLang.quick_login}}
				<span class="line-rt"></span>
			</div>
			<div class="other-btn">
				
				<div class="login-btn">
					<fb-signin-button
			          	:params="fbSignInParams"
			          	@success="onSignInSuccess"
			          	@error="onSignInError">
					
						<img src="../../assets/images/facebook2.png" />
				
					</fb-signin-button>
				</div>
				
				<div class="login-btn">
					
					<g-signin-button
					    :params="googleSignInParams"
					    @success="onSignInSuccessA"
					    @error="onSignInErrorA">
					    
						<img src="../../assets/images/google@2x.png" />
					  </g-signin-button>

				</div>
				<div class="login-btn" @click="$router.push('/')">
						<img src="../../assets/images/tourist.png" />
				</div>
				
			</div>
		</div>
		
		
		<!--<div class="pop-up-bg" v-if="showInput" ></div>-->

		<van-dialog class="draw-dialog" v-model="showInput" :closeOnClickOverlay="true" :title="getTime(getSecond)"   @confirm="closeDialog" :confirmButtonText="$store.state.system.webLang.cancel">
		 		
		 		<van-password-input
		  :value="verifyCode"
		  :focused="showKeyboard = true"
		  :mask="false"
		  :length="4"
			v-if="showInput"
		  @focus="showKeyboard = true"
		  :gutter="25"
		/>
		 		
			</van-dialog>
			
		
		<!-- 数字键盘 -->
		<van-number-keyboard
		  :show="showKeyboard"
		  @input="onInput"
		  @delete="onDelete"
		  @blur="showKeyboard = false"
		/>
		
		
		
	</div>
</template>
<script>
	import * as types from '../../store/types';
	import { Toast,Dialog } from 'vant';
	import globals from '../../api/config';
	import axios from 'axios';

	export default {
		inject:['reload'],
		data() {
			return {
				userName:localStorage.getItem('bchAccount') ? localStorage.getItem('bchAccount') : '',
				password:'',
				errorMsgA:'',//用户名错误信息
				errorMsgB:'',//密码错误信息
				showRegister:false,
				loading:false,
				showInput:false,
				showKeyboard:false,
				passwordType:'password',
				verifyCode:'',
				Visible:'./assets/Visible.png',
				disapperance:'./assets/disappearance.png',
				fbSignInParams: {
		          scope: 'email,user_likes',
		          return_scopes: true
		        },
				getSecond:0,
				fbSignInParams: {
					scope: 'email,user_likes',
					return_scopes: true
				},
		    googleSignInParams: {
		        client_id: '131538779229-3bo792dssbc7b1f0lr2p6ak50oq690jl.apps.googleusercontent.com'
				},
				channel:'',//渠道码
			}
		},
		components: {
			
		},
		watch:{
			userName(val) {
				if(val.length==0) {
					this.errorMsgA = '';
				}
				var reg = /^[6-9]\d{9}$/
		
				// if(this.errorMsgB==''&&this.password.length&&reg.test(this.userName)&&this.userName!='') {
				// 	this.showRegister = true;
				// }else {
				// 	this.showRegister = false
				// }
			},
			password(val) {
				var reg = /^[6-9]\d{9}$/;
				var regA = /^[A-Za-z0-9]{6,12}$/
				if(this.errorMsgB==''&&regA.test(this.password)&&this.password.length&&this.userName!='') {
					this.showRegister = true;
				}else {
					this.showRegister = false
				}
			}
			// password(val) {
			// 	var reg = /^[6-9]\d{9}$/;
			// 	var regA = /^[A-Za-z0-9]{6,12}$/
			// 	if(this.errorMsgB==''&&regA.test(this.password)&&this.password.length&&reg.test(this.userName)&&this.userName!='') {
			// 		this.showRegister = true;
			// 	}else {
			// 		this.showRegister = false
			// 	}
			// }
		},
		activated() {
			for(let i = 0;i<this.$store.state.system.languageList.length;i++) {
				if(this.$store.state.system.languageList[i].type==localStorage.getItem('lang')) {
					this.$store.state.system.langIndex = i
				}
			}
			if(window.localStorage.getItem('channel')) {
				this.channel = window.localStorage.getItem('channel')
			}
			window.scrollTo(0,0);
			localStorage.removeItem('firstReg')
			if(localStorage.getItem('token')) {
				this.$router.push('/results')
//				this.$router.push({name:'lottery',query:{regType:'suc'}})
			}

		},
		deactivated() {
			this.password = '';
			this.showInput = false;
			this.showKeyboard = false;
			this.verifyCode = '';
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			settingLang(index) {
//				Toast('Not yet open')
				this.$store.state.system.langIndex = index;
				localStorage.setItem('lang',this.$store.state.system.languageList[index].type)
				this.$store.commit(types.UPDATE_LANG, this.$store.state.system.languageList[index].type);//多语言设置
			},
			 getTime(s) {
		    	 //计算分钟
			    //算法：将秒数除以60，然后下舍入，既得到分钟数
			    var m
			    m  =   Math.floor(s/60);
			    //计算秒
			    //算法：取得秒%60的余数，既得到秒数
			    s  =   s%60;
			    //将变量转换为字符串
			    m    +=    '';
			    s    +=    '';
			    //如果只有一位数，前面增加一个0
			 
			    s  =   (s.length==1)?'0'+s:s;
			    return m+'m '+s+'s';
   	
		    },
			//用户名失去焦点
			userNameBlur(event) {
				// var reg = /^[6-9]\d{9}$/
				// // var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,12})$/
				// if(!reg.test(this.userName)&&this.userName!='') {
				// 	this.errorMsgA = this.$store.state.system.webLang.userName_error
				// }else {
				// 	this.errorMsgA = ''
				// }
			},
				// 眼睛
			sight() {
				this.passwordType = this.passwordType === 'password' ? 'text' : 'password'

			},
			//密码失去焦点
			passwordBlur(event) {
				var reg = /^[A-Za-z0-9]{6,12}$/
				if(!reg.test(this.password)&&this.password!='') {
					this.errorMsgB = this.$store.state.system.webLang.paddword_error
				}else {
					this.errorMsgB = ''
				}
			},
		
			login() {
				
				if(!this.userName) {
					this.errorMsgA = this.$store.state.system.webLang.userName_error
					return
				}
				if(!this.password) {
					this.errorMsgB = this.$store.state.system.webLang.paddword_error
					return
				}

				this.loading = true;
//				
				var params = {
					username: this.userName,
					password: this.password
				}
	
				  axios.post(globals.api.login,params)
				  .then(res => {
			
				    if(res.data.code==200) {
				    	this.$store.state.user.loginBol = true;
				    	this.$store.commit(types.UPDATE_TOKEN,{
							token:res.data.data.token,
							userId:res.data.data.user_id
						});
						localStorage.setItem('bchAccount', this.userName);
				  		this.$store.dispatch(types.GET_USER_INFO);
				    	if(res.data.data.is_agent=='Y'&&res.data.data.mobile=='') {
				    		//是代理但是没有绑定手机
				    		Dialog.alert({
							  title: this.$store.state.system.webLang.tips_text,
							  message: this.$store.state.system.webLang.agent_bind_mobile,
							}).then(() => {
//							   this.$router.push({name:'lottery',query:{regType:'suc'}})
								this.$router.push('/results')
							});
				    	}else {
				    		
							Toast.success(this.$store.state.system.webLang.success_text)
						    setTimeout(()=>{
//						    	this.$router.push({name:'lottery',query:{regType:'suc'}})
								this.$router.push('/results')
						    },200)
				    	}
				    	
				    	
						this.getUserInfo()
						
//						this.loginLog();//记录登录日志
				    	
				    }else if(res.data.code==313){
				    	this.showInput = true;
				    	Toast(res.data.msg)
				    	//是代理需要填验证码
				    	var localTime = new Date().getTime();
						var intervalTime = 300;
						this.getSecond = intervalTime;
						clearInterval(timer);
						var timer = setInterval(() => {
							this.getSecond = intervalTime - parseInt((new Date().getTime() - localTime) / 1000);
							if(this.getSecond <= 0) {
								this.closeDialog();
								clearInterval(timer);
							}
						}, 1000)
				    }else {
				    	Toast(res.data.msg)
				    }
				    
				    setTimeout(()=>{
				    	this.loading = false;
				    	
				    },1000)
					
			
					  }).catch((error)=>{
					  	setTimeout(()=>{
					    	this.loading = false;
					    },1000)
		       			error.msg?Toast(error.msg):''
		       		})

			},
			onInput(key) {
		      this.verifyCode = (this.verifyCode + key).slice(0, 4);
		      console.log(this.verifyCode)
		      if(this.verifyCode.length==4) {
		      	var params = {
		      		username: this.userName,
					captcha: this.verifyCode
				}
	
				  axios.post(globals.api.loginCheckCaptcha,params)
				  .then(res => {
//				  		Toast(res.data.msg)
				  		if(res.data.code==200) {
				  			this.$store.state.user.loginBol = true;
				  			this.$store.commit(types.UPDATE_TOKEN,{
								token:res.data.data.token,
								userId:res.data.data.user_id
							});
							localStorage.setItem('bchAccount', this.userName);
							this.getUserInfo()
							Toast.success(this.$store.state.system.webLang.success_text);
							
//							this.loginLog();//记录登录日志
							
						    setTimeout(()=>{
						    	this.$router.push('/results')
//						    	this.$router.push({name:'lottery',query:{regType:'suc'}})
						    },200)
				  		}else {
				  			this.verifyCode = ''
				  			Toast(res.data.msg)
				  		}
				  
			
					  }).catch((error)=>{
				
		       			error.msg?Toast(error.msg):''
		       		})
		      }
		    },
		    onDelete() {
		      this.verifyCode = this.verifyCode.slice(0, this.verifyCode.length - 1);
		    },
			getUserInfo() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					ext:'show'
				}
	
				  axios.post(globals.api.getUserInfo,params)
				  .then(res => {
				  	
				  	
				  	if(res.data.data.agent_id==0||res.data.data.agent_id) {
						
						var params = {
							UserId:localStorage.getItem('userId'),
							UserToken:localStorage.getItem('token'),
							agent_id:res.data.data.agent_id
						}
						//获取代理商信息
						axios.post(globals.api.getAgentInfo,params).then((res)=>{
							console.log(res.data.data,res.data.data.length)
							if(res.data.data.whatsapp) {
								this.$store.state.system.rechargeMobile = res.data.data.whatsapp
							}else {
								this.$store.state.system.rechargeMobile = this.$store.state.system.systemInfo.whatsapp
							}
							
							console.log(this.$store.state.system.rechargeMobile)
				       		}).catch((error)=>{
				       			error.msg?Toast(error.msg):'';
				   		})
					       	
					}else {
						this.$store.state.system.rechargeMobile = this.$store.state.system.systemInfo.whatsapp
		
					}
				  	
				    
					this.$store.commit(types.UPDATE_USER_INFO, res.data.data);//更新用户信息
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			onSignInSuccess (response) {
		        // FB.api('/me', dude => {
		        //   console.log(`Good to see you, ${dude.name}.`)
		        // })
		        console.log(response) //返回第三方的登录信息 tolen等
		    },
		    onSignInError (error) {
		    	console.log(error)
		    },
		    closeDialog() {
				this.showInput = false;
				this.showKeyboard = false;
			},
			//facebook授权登录
			onSignInSuccess (response) {
				console.log(response);
		        // FB.api('/me', dude => {
		        //   console.log(`Good to see you, ${dude.name}.`)
		        // })
		       if(response.authResponse.userID) {
		       		var params = {
		       			platform:1,
						id: response.authResponse.userID,
						invitation_code:this.$route.query.code?this.$route.query.code:'',
						channel:this.$route.query.role=='guset'?'visitor':this.channel?this.channel:''
					}
		
					  axios.post(globals.api.platformLogin,params)
					  .then(res => {

					    if(res.data.code==200) {
					    	
					    	this.$store.commit(types.UPDATE_TOKEN,{
								token:res.data.data.token,
								userId:res.data.data.user_id
							});
							localStorage.setItem('bchAccount', this.userName);
					    
					    	if(res.data.data.is_agent=='Y'&&res.data.data.mobile=='') {
					    		//是代理但是没有绑定手机
					    		Dialog.alert({
								  title: this.$store.state.system.webLang.tips_text,
								  message: this.$store.state.system.webLang.agent_bind_mobile,
								}).then(() => {
								   this.$router.push({name:'lottery',query:{regType:'suc'}})
								   this.$store.state.user.registerBol = true;//判断是否注册
//									this.$router.push({name:'guide',query:{type:'guide'}})
								});
					    	}else {
					    		this.$store.state.user.registerBol = true;//判断是否注册
								Toast.success(this.$store.state.system.webLang.success_text)
							    setTimeout(()=>{
							    	this.$router.push({name:'lottery',query:{regType:'suc'}})
//									this.$router.push({name:'guide',query:{type:'guide'}})
							    },200)
					    	}
					    	
					    	
							this.getUserInfo()
							
							
//							this.loginLog();//记录登录日志
				    	
				    }else if(res.data.code==313){
				    	this.showInput = true;
				    	Toast(res.data.msg)
				    	//是代理需要填验证码
				    	var localTime = new Date().getTime();
						var intervalTime = 300;
						this.getSecond = intervalTime;
						var timer = setInterval(() => {
							this.getSecond = intervalTime - parseInt((new Date().getTime() - localTime) / 1000);
							if(this.getSecond <= 0) {
								this.closeDialog();
								clearInterval(timer);
							}
						}, 1000)
						
						
						
						
				    }else {
				    	Toast(res.data.msg)
				    }
					    
					 
						
				
						  }).catch((error)=>{
						  
			       			error.msg?Toast(error.msg):''
			       		})
			       }
		        
		    },
		    onSignInError (error) {
		    	console.log(error)
		    },
		    //google授权登录
			onSignInSuccessA (googleUser) {
					console.log('123');
			     	const id = googleUser.getBasicProfile().getId(); // 用户登录信息
					console.log(id)

					var params = {
		       			platform:2,
						id: id,
						invitation_code:this.$route.query.code?this.$route.query.code:'',
						channel:this.$route.query.role=='guset'?'visitor':this.channel?this.channel:''
					}
		
					  axios.post(globals.api.platformLogin,params)
					  .then(res => {
					  		
					    if(res.data.code==200) {
					    	
					    	this.$store.commit(types.UPDATE_TOKEN,{
								token:res.data.data.token,
								userId:res.data.data.user_id
							});
							localStorage.setItem('bchAccount', this.userName);
				    
					    	if(res.data.data.is_agent=='Y'&&res.data.data.mobile=='') {
					    		//是代理但是没有绑定手机
					    		Dialog.alert({
								  title: this.$store.state.system.webLang.tips_text,
								  message: this.$store.state.system.webLang.agent_bind_mobile,
								}).then(() => {
								    this.$router.push({name:'lottery',query:{regType:'suc'}})
								    this.$store.state.user.registerBol = true;//判断是否注册
//									this.$router.push({name:'guide',query:{type:'guide'}})
								});
					    	}else {
					    		this.$store.state.user.registerBol = true;//判断是否注册
								Toast.success(this.$store.state.system.webLang.success_text)
							    setTimeout(()=>{
							    	this.$router.push({name:'lottery',query:{regType:'suc'}})
									//	this.$router.push({name:'guide',query:{type:'guide'}})									
							    },200)
					    	}
					    	
					    	
							this.getUserInfo()
							
							
//							this.loginLog();//记录登录日志
				    	
				    }else if(res.data.code==313){
				    	this.showInput = true;
				    	Toast(res.data.msg)
				    	//是代理需要填验证码
				    	var localTime = new Date().getTime();
						var intervalTime = 300;
						this.getSecond = intervalTime;
						var timer = setInterval(() => {
							this.getSecond = intervalTime - parseInt((new Date().getTime() - localTime) / 1000);
							if(this.getSecond <= 0) {
								this.closeDialog();
								clearInterval(timer);
							}
						}, 1000)
						
						
						
						
				    }else {
				    	Toast(res.data.msg)
				    }
					    
					 
						
				
						  }).catch((error)=>{
						  
			       			error.msg?Toast(error.msg):''
			       		})
	
		    },
		    onSignInErrorA(error) {
		    	 console.log(error)
		    },
		    //游客登录
		    toGuset() {
		    	localStorage.setItem('role','guset');
		   
//		    		var url = 'https://dev.visitorapi.lottoplus.cc/user/login/register'; //测试
		    		
		    		var url = 'https://visitorapi.lottoplus.cc/user/login/register' //生产
		    	
			   
			    	axios.post(url)
					  .then(res => {
					    console.log(res.data);
					    if(res.data.code==200) {
			
					    	Toast.success(this.$store.state.system.webLang.success_text)
						   
					    
					    	
					    	this.$store.commit(types.UPDATE_TOKEN,{
								token:res.data.data.token,
								userId:res.data.data.user_id
							});
							localStorage.setItem('bchAccount', this.userName);
							this.getUserInfo()
					    	
						    	
//						    	this.reload();
						  location.reload();
					   	
					    }else {
					    	Toast(res.data.msg)
					    }
					    
					    setTimeout(()=>{
					    	this.loading = false;
					    },1000)
						
				
						  }).catch((error)=>{
						  	setTimeout(()=>{
						    	this.loading = false;
						    },1000)
			       			error.msg?Toast(error.msg):''
			       		})
						  
		
		    	
		    	
		    },
		    //跳转注册
		    toRegister() {
		    	if(this.$route.query.role=='guset') {
		    		this.$router.push({name:'register',query:{role:'guset'}})
		    	}else {
		    		this.$router.push('/register')
		    	}
		    	
		    },
		    //忘记密码
		    forgetPass() {
		    		this.$router.push('/ForgotPassword')
		    },
		    //记录用户日志
			loginLog() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token')
				}
				axios.post(globals.api.loginLog,params).then((res)=>{
//				console.log(res.data.data)
					
		       		}).catch((error)=>{
		       			error.msg?Toast(error.msg):'';
		   		})
			},
		}
	}
</script>

<style lang="scss">
	@import './Login';
</style>