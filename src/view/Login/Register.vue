<template>
	<div class="register-wrap">
		<div class="register-left" @click="returnBack">
			<img src="../../assets/images/register_left.png"/>
		</div>
		<div class="register-title">
			<p>{{$store.state.system.webLang.register_title}}</p>
			<p>{{$store.state.system.webLang.create_account}}</p>
		</div>
		
		
		<van-cell-group>
			<!-- 手机号 -->
			 <div class="colr">{{$store.state.system.webLang.mobileNumber}}</div>
		  	<van-field v-model="userName" @blur="userNameBlur" type="text" clearable :error-message="errorMsgA" maxlength="10" :border="false"  />
			<!-- 验证码 -->
				<div class="colr">OTP</div>
		  	<van-field v-model="verify_code" @blur="codeBlur" :error-message="errorMsgC" type="text" maxlength="4" :border="false">
					<template #button>
    				<van-button :disabled="disabled" color="#fe7175" @click="timer">{{btntxt}}</van-button>
  				</template>
		  	</van-field>
			<!-- 密码 -->
		  	<div class="colr">Set Password</div>
		  	<van-field v-model="password" @blur="passwordBlur" :error-message="errorMsgB"  maxlength="12" :type="passwordType" :border="false" :right-icon="passwordType === 'password'?'./assets/Visible.png':'./assets/disappearance.png'"  @click-right-icon="sight" />
		  	
		</van-cell-group>
		
		
		<div class="register-btn">
			<van-button @click="register" block :color="showRegister?'#DCDCDC':'#D0021B'" :loading="loading" :disabled="showRegister" :class="{'disabled-btn':showRegister}" >{{$store.state.system.webLang.REGISTER}}</van-button>
			
			<!--<div class="tips">
				<van-checkbox v-model="checked" shape="square">By registering, I agree to FantasyLand’ sT&Cs </van-checkbox>
			</div>-->
			
		</div>
		
		
		<div class="other-login">
			<div class="other-title">
					<span class="line-lf"></span>
					{{$store.state.system.webLang.quick_login}}
					<span class="line-rt"></span>
				</div>
			<div class="other-btn" style="padding: 0 2.36rem">
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
			</div>
		</div>
		
		
		
		
		<van-dialog class="draw-dialog" v-model="showInput" :closeOnClickOverlay="true" :title="getTime(getSecond)"    @confirm="closeDialog" :confirmButtonText="$store.state.system.webLang.cancel">
		 		
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
		data() {
			return {
				userName:'',
				password:'',
				passwordA:'',
				passwordType:'password',
				errorMsgA:'',//用户名错误信息
				errorMsgB:'',//密码错误信息
				errorMsgC:'',//验证码错误信息
				verify_code:'',//验证码
				btntxt:"Send",
				disabled:false,
				time:60,
				checked:false,
				loading:false,
				fbSignInParams: {
		          scope: 'email,user_likes',
		          return_scopes: true
		       },
		       googleSignInParams: {
		        	client_id: '131538779229-3bo792dssbc7b1f0lr2p6ak50oq690jl.apps.googleusercontent.com'
				},
				showInput:false,
				showKeyboard:false,
				verifyCode:'',
				getSecond:0,
				code:'',//邀请码
				channel:'',//渠道码

				
			}
		},
		components: {
			
		},
		computed:{
			showRegister() {
				var reg = /^[6-9]\d{9}$/
				var regC = /^[0-9]\d{3}$/
				var regA = /^[A-Za-z0-9]{6,12}$/
				if(this.errorMsgB==''&&regA.test(this.password)&&reg.test(this.userName)&&this.userName!=''&&regC.test(this.verify_code)&&this.verify_code!='') {
					return false;
				}else {
					return true;
				}
			}
		},
		watch:{
			userName(val) {
				if(val.length==0) {
					this.errorMsgA = '';
				}
			
		
				
			},
			password(val) {
				if(val.length==0) {
					this.errorMsgB = '';
				}
//				var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,12})$/
//				if(this.password == this.passwordA&&this.errorMsgB==''&&this.errorMsgC==''&&this.password.length&&reg.test(this.userName)&&this.userName!='') {
//					this.showRegister = true;
//				}else {
//					this.showRegister = false
//				}
			},
			passwordA(val) {
				if(this.errorMsgB.length)return
				this.errorMsgC = '';
//				var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,12})$/
//				if(this.password == this.passwordA&&this.errorMsgB==''&&this.errorMsgC==''&&this.password.length&&reg.test(this.userName)&&this.userName!='') {
//					this.showRegister = true;
//				}else {
//					this.showRegister = false
//				}
//
//				setTimeout(()=>{
//					console.log(this.passwordA,this.password)
//					if(this.passwordA!=this.password) {
//						
//						this.errorMsgC = 'Inconsistent passwords'
//					}
//				},2000)
			}
		},
		activated() {
			// gtag('config', 'G-N6Y1WPMJH6', {
			//   'page_title' : 'register',
			//   'page_path': '/register'
			// });
			localStorage.removeItem('firstReg')
			localStorage.removeItem('timeDate')
			this.$store.state.system.guideBol = true;
			this.$store.dispatch(types.LOGOUT);
			if(window.localStorage.getItem('channel')) {
				this.channel = window.localStorage.getItem('channel')
				console.log(this.channel)
			}
			
			if (plus.os.name == 'iOS') {  
	            var UIPasteboard = plus.ios.importClass("UIPasteboard");  
	            var generalPasteboard = UIPasteboard.generalPasteboard();  
	            var value = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");  
	            // value就是粘贴板的值  
	            this.channel = value
	    
	        } else if (plus.os.name == 'Android') {  
	            var Context = plus.android.importClass("android.content.Context");  
	            var main = plus.android.runtimeMainActivity();  
	            var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);  
	            var value = plus.android.invoke(clip, "getText");  
	            // value就是粘贴板的值  
	            this.channel = value
	         
	        }
			
			window.scrollTo(0,0);

		},
		deactivated() {
			this.userName = '';
			this.password = '';
			this.passwordA = '';
			this.showInput = false;
			this.showKeyboard = false;
			this.verifyCode = '';
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			closeDialog() {
				this.showInput = false;
				this.showKeyboard = false;
			},
				// 密码隐藏
			sight() {
				this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
			},
		
		// 发送验证码倒计时
			timer() {
				var reg = /^[6-9]\d{9}$/
				if(!reg.test(this.userName) ) {
					Toast("Please enter your mobile phone number")
					return
				}
				var params = {
					mobile:this.userName,
					action:'login'
				}
				axios.post(globals.api.getSmsCaptcha,params).then( res => {
					console.log(res);
				}).catch((error)=>{
		       			error.msg?Toast(error.msg):''
		    })
				if (this.time > 0) {
					let setTime = setInterval(()=> {
						this.disabled=true;
						this.time--;
						this.btntxt = this.time + 's';
						if(this.time<0) {
							this.disabled = false;
							this.btntxt = 'Send';
							this.time = 60;
							clearInterval(setTime);
						}
					},1000)
				}
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
				  			this.$store.commit(types.UPDATE_TOKEN,{
								token:res.data.data.token,
								userId:res.data.data.user_id
							});
							localStorage.setItem('bchAccount', this.userName);
							this.getUserInfo();
							
							Toast.success(this.$store.state.system.webLang.success_text)
							
//							this.loginLog();//记录登录日志
							
							
						    setTimeout(()=>{
						    	this.$router.push({name:'lottery',query:{regType:'suc'}})
//								this.$router.push({name:'guide',query:{type:'guide'}})
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
			onSignInSuccess (response) {
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
					    	
					    	
							this.getUserInfo();
							
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
									//	this.$router.push({name:'guide',query:{type:'guide'}})
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
			//用户名失去焦点
			userNameBlur(event) {
				var reg = /^[6-9]\d{9}$/
				if(this.userName.length==0) {
					this.errorMsgA = ''
				}
				if(!reg.test(this.userName)&&this.userName!='') {
					this.errorMsgA = this.$store.state.system.webLang.userName_error
				}else {
					this.errorMsgA = ''
				}
			},
			//验证码失去焦点
			codeBlur(event) {
				var reg = /^[0-9]\d{3}$/
				if(this.verify_code.length==0) {
					this.errorMsgC = ''
				}
				if(!reg.test(this.verify_code)&&this.verify_code!='') {
					this.errorMsgC = "Please enter a 4 digit verification code"
				}else {
					this.errorMsgC = ''
				}
			},
			//密码失去焦点
			passwordBlur(event) {
				var reg = /^[A-Za-z0-9]{6,12}$/
				if(this.password.length==0) {
					this.errorMsgA = ''
				}
				if(!reg.test(this.password)&&this.password!='') {
					this.errorMsgB = this.$store.state.system.webLang.paddword_error
				}else {
					this.errorMsgB = ''
				}
			},
			//确认密码失去焦点
			// passwordAInput(event) {
			// 	if(this.passwordA.length==0) {
			// 		this.errorMsgC = ''
			// 		return
			// 	}
		
			// 		console.log(this.passwordA,this.password)
			// 	if(this.passwordA!=this.password) {
					
			// 		this.errorMsgC = this.$store.state.system.webLang.inconsistent_password
			// 	}
			
				
			// },
			register() {
				
				if(!this.userName) {
					this.errorMsgA = this.$store.state.system.webLang.userName_error
					return
				}
				if(!this.password) {
					this.errorMsgB = this.$store.state.system.webLang.paddword_error
					return
				}
				// if(!this.passwordA||this.password!=this.passwordA) {
				// 	this.errorMsgC = this.$store.state.system.webLang.inconsistent_password
				// 	return
				// }
				this.loading = true;
				
		
				var params = {
					mobile: this.userName,
					password: this.password,
					captcha:this.verify_code,
					registerType: 2,
					invitation_code:this.$route.query.code?this.$route.query.code:'',
					channel:this.$route.query.role=='guset'?'visitor':this.channel?this.channel:''
				}
	
				  axios.post(globals.api.register,params)
				  .then(res => {
				    console.log(res.data);
				    if(res.data.code==200) {
		
				    	this.$store.state.user.registerBol = true;//判断是否注册
				    	Toast.success(this.$store.state.system.webLang.success_text)
					    setTimeout(()=>{
					    	this.$router.push({name:'lottery',query:{regType:'suc'}})
//					    	this.$router.push({name:'lottery',query:{regType:'suc'}})
//							this.$router.push({name:'guide',query:{type:'guide'}})
					    },200)
				    
				    	this.$store.commit(types.UPDATE_TOKEN,{
							token:res.data.data.token,
							userId:res.data.data.user_id
						});
						localStorage.setItem('bchAccount', this.userName);
						this.getUserInfo()
				    	
				    	
//				    	this.loginLog();//记录登录日志
				    	
				    	
				    	
				    	
				    	
				    	
				    	
				    	
				    	
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