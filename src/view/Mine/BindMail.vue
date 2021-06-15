<template>
	<div class="bindMail-wrap">
		<app-header :title="$store.state.system.webLang.link_mailbox" v-on:clickLeft="returnBack" :right="true">
			
			<template slot="right">
		        <span class="save" @click="checkCaptcha" v-if="!emailBol">{{$store.state.system.webLang.save}}</span>
		    </template>
		</app-header>
		
		
		<div v-if="showEmail">
			
		
		
			<van-field v-model="email"  clearable :error-message="errorMsg"   :placeholder="$store.state.system.webLang.please_enter_Email_Address"  :disabled="emailBol">
	
			</van-field>
		
			<van-field v-model="verifyCode"  clearable :error-message="errorMsgA" maxlength="6"   :placeholder="$store.state.system.webLang.please_enter_code" v-if="!emailBol">
				
			  <template #button>
			    <van-button size="small" type="primary" color="linear-gradient(to right, #4bb0ff, #6149f6)" :loading="clickBol" @click="getCaptcha" v-if="getSecond <= 0">{{$store.state.system.webLang.send}}</van-button>
			    <van-button size="small" type="primary" v-else color="linear-gradient(to right, #4bb0ff, #6149f6)" >{{getTime(getSecond)}}</van-button>
			  </template>
			  
			</van-field>
			
<!--			
			<van-field v-model="password" type="password"  clearable :error-message="errorMsgB" maxlength="12"   placeholder="Please enter password"  :disabled="emailBol" v-if="!emailBol">
	
			</van-field>-->
			
			<div class="bind-tips">
				<i class="iconfont iconinfo"/></i>{{$store.state.system.webLang.forget_password_will_send}}
			</div>
			
		</div>
		
	
		
		
	</div>
</template>
<script>
	import * as types from '../../store/types';
	import AppHeader from '../../components/Header.vue';
	import { Toast,Dialog } from 'vant';
	import globals from '../../api/config';
	import axios from 'axios';
	export default {
		data() {
			return {
				showEmail:false,
				email:'',
				errorMsg:'',
				verifyCode:'',
				errorMsgA:'',
				emailBol:false,//是否绑定邮箱
				getSecond: 0,
				clickBol:false,
				password:'',//登录密码
				errorMsgB:''
				
			}
		},
		components: {
			AppHeader
		},
		userInfo() {
			return this.$store.state.user.info;
		},
		watch:{
			email(val) {
				this.errorMsg = ''
;			}
		},
		activated() {
			window.scrollTo(0,0);
			this.getUserInfo();
			

		},
		deactivated() {
			this.password = '';
			this.verifyCode = '';

		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			getUserInfo() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					ext:'show'
				}
	
				  axios.post(globals.api.getUserInfo,params)
				  .then(res => {
				    this.showEmail = true;
					if(res.data.data.email) {
						this.emailBol = true;
						this.email = res.data.data.email
					}else {
						this.emailBol = false
					}
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			onInput(key) {
		      this.verifyCode = (this.verifyCode + key).slice(0, 6);
		      console.log(this.verifyCode)
		      if(this.verifyCode.length==4) {
		      		
		      }
		    },
		    onDelete() {
		      this.verifyCode = this.verifyCode.slice(0, this.verifyCode.length - 1);
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
			getCaptcha() {
				var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if(!reg.test(this.email)) {
					this.errorMsg = this.$store.state.system.webLang.please_enter_Email_Address
					return
				}
				
				this.clickBol = true;


				var params = {
					email: this.email,
					action: 'bind_email'
				}

				  axios.post(globals.api.getCaptcha,params)
				  .then(res => {
				  		Toast(res.data.msg)
				  		var localTime = new Date().getTime();
						var intervalTime = 60;
						this.getSecond = intervalTime;
						var timer = setInterval(() => {
							this.getSecond = intervalTime - parseInt((new Date().getTime() - localTime) / 1000);
			
							if(this.getSecond <= 0) {
								clearInterval(timer);
							}
						}, 1000)
	
						setTimeout(() => {
							this.clickBol = false;
						}, 600)
				  		
			
					  }).catch((error)=>{
						setTimeout(() => {
							this.clickBol = false;
						}, 600)
		       			error.msg?Toast(error.msg):''
		       		})
			},
			//验证邮箱验证码
			checkCaptcha() {
				
				this.errorMsg = '';
				this.errorMsgA = '';
				this.errorMsgB = '';
				
				if(!this.email) {
					this.errorMsg = this.$store.state.system.webLang.please_enter_Email_Address
					return
				}
				var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if(!reg.test(this.email)) {
					this.errorMsg = this.$store.state.system.webLang.please_enter_Email_Address
					return
				}
				
				if(!this.verifyCode) {
					this.errorMsgA = this.$store.state.system.webLang.please_enter_code
					return
				}
				
//				if(!this.password) {
//					this.errorMsgB = 'Please enter password'
//					return
//				}
//				
				var params = {
					email: this.email,
					action: 'bind_email',
					captcha: this.verifyCode
					
					
				}

				  axios.post(globals.api.checkCaptcha,params)
				  .then(res => {
				  		
				  		if(res.data.code==200) {
				  			
				  			
				  			var paramsA = {
				  				UserId: localStorage.getItem('userId'),
								UserToken: localStorage.getItem('token'),
								email: this.email,
//								password: this.password,
								captcha: this.verifyCode
								
							}

						  axios.post(globals.api.bindEmail,paramsA)
						  .then(resA => {
						  		
						  		if(resA.data.code==200) {
						  			this.getUserInfo()
						  			Toast.success(this.$store.state.system.webLang.success_text)
						  			console.log(resA.data)
						  			if(resA.data.data.is_first_bind=='Y') {
										//首次绑定
										Dialog.alert({
										  title: this.$store.state.system.webLang.tips_text,
										  message: resA.data.msg
										}).then(() => {
										  this.$router.go(-1) 
										})
									}else {
										this.$router.go(-1) 
									}
					
						  			
						  			
						  		}else {
						  			Toast(resA.data.msg)
						  		}
					
							  }).catch((errorA)=>{
					
				       			errorA.msg?Toast(errorA.msg):''
				       		})
				  			
				  			
				  			
				  			
//				  			this.getUserInfo()
//				  			T
				  		}else {
				  			Toast(res.data.msg)
				  		}
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			}
		}
	}
</script>

<style lang="scss">
	.bindMail-wrap {
		background: #F8F6F9;
		min-height: 100vh;
		.bind-tips {
			display: flex;
			align-items: center;
			margin: 0.22rem 0.3rem;
			font-size:0.22rem;
			color:rgba(153,153,153,0.67);
			.iconfont {
				color: #C2BDBF;
				margin-right: 0.1rem;
			}
		}
		.header-right {
	        display: inline-block!important;
	    }
	}
</style>