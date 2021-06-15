<template>
	<div class="bindPhone-wrap">
		<app-header :title="$store.state.system.webLang.link_phone" v-on:clickLeft="returnBack" :right="false">
			
			<!--<template slot="right">
		        <span class="save" @click="getCaptcha">{{$store.state.system.webLang.save}}</span>
		    </template>-->
		</app-header>
		
		
		<div v-if="showMobile">
			
			
		
		
				<van-field
				  v-model="mobile"
				  center
				  clearable
				  :error-message="errorMsg"
				  :placeholder="$store.state.system.webLang.please_enter_phone_number"
				  v-enter-number
				  :disabled="mobileBol"
				  maxlength="10"
				>
				  <template #button v-if="!mobileBol">
				    <van-button size="small" type="primary" :loading="clickBol" :disabled="!captchaDisabled"  color="linear-gradient(to right, #4bb0ff, #6149f6)" @click="getSmsCaptcha" v-if="getSecond <= 0" :class="{'guideActive':$store.state.system.guideType==3&&$store.state.system.guideIndex==4}">{{$store.state.system.webLang.send}}</van-button>
				    <van-button size="small" type="primary" v-else color="linear-gradient(to right, #4bb0ff, #6149f6)" >{{getTime(getSecond)}}</van-button>
				  </template>
				</van-field>
			
			
				
				<div class="bind-tips">
					<i class="iconfont iconinfo"/></i>{{$store.state.system.webLang.to_receive_the_prize}}
				</div>
				
				<div :class="{'guideActive':$store.state.system.guideType==3&&$store.state.system.guideIndex==5}">
					
				
				<van-password-input
				  :value="verifyCode"
				  :info="getTime(getSecond)"
				  :focused="showKeyboard = true"
				  :mask="false"
				  :length="4"
					v-if="showInput"
				  @focus="showKeyboard = true"
				  :gutter="25"
				  
				/>
				</div>
				<!-- 数字键盘 -->
				<van-number-keyboard
				  :show="showKeyboard"
				  @input="onInput"
				  @delete="onDelete"
				  @blur="showKeyboard = false"
				  :delete-button-text="$store.state.system.webLang.Delete"
				/>
		
		</div>
		
		
		
		
		<van-overlay :show="$store.state.system.showGuide&&$store.state.system.guideType==3&&showMobile" lock-scroll class="guide-overlay"/>	
			<!--绑定手机号引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==3&&showMobile" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
	
				
				
				<div v-if="$store.state.system.guideIndex==4" class="guide-0 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				
				<div v-if="$store.state.system.guideIndex==5" class="guide-1 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click="closeGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				
				
				
				
			
			</transition>
			</div>
			<!--绑定手机号引导-->
	
		
		
	</div>
</template>
<script>
	import * as types from '../../store/types';
	import AppHeader from '../../components/Header.vue';
	import { Toast,Dialog } from 'vant';
	import globals from '../../api/config';
	import axios from 'axios';
	import * as moment from "moment";
	let clickBol = true;
	export default {
		data() {
			return {
				showMobile:false,
				mobile:'',
				errorMsg:'',
				verifyCode:'',
				showKeyboard: false,
				showInput:false,
				getSecond: 0,
				clickBol:false,
				mobileBol:false,
				captchaDisabled:false
				
			}
		},
		components: {
			AppHeader
		},
		watch:{
			mobile(val) {
				this.errorMsg = ''
				if(val.length==10) {
					var params = {
						UserId: localStorage.getItem('userId'),
						UserToken: localStorage.getItem('token'),
						mobile:val
					}
	
				  axios.post(globals.api.checkMobile,params)
				  .then(res => {
					
						if(!res.data.data) {
							this.errorMsg = this.$store.state.system.webLang.please_enter_phone_number
							this.captchaDisabled = false;
							this.showKeyboard = false;
							this.showInput = false;
						}else {
							this.captchaDisabled = true;
						}
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
				
				}
				
;			}
		},
		activated() {
			window.scrollTo(0,0);
			this.getUserInfo();
			if(this.$store.state.system.guideType==3&&this.$store.state.system.guideIndex==4&&this.$store.state.system.showGuide) {
				//绑定手机号引导
				this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
			}

		},
		deactivated() {
			this.showInput = false;
			this.showKeyboard = false;
			this.errorMsg = '';
			this.mobile = '';
			this.verifyCode = '';
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
				
				if(this.$store.state.system.guideIndex==5) {
					this.mobile = '0908764631'
					this.showInput = true;
					var localTime = new Date().getTime();
					var intervalTime = 300;
					this.getSecond = intervalTime;
					var timer = setInterval(() => {
						this.getSecond = intervalTime - parseInt((new Date().getTime() - localTime) / 1000);
						if(this.getSecond <= 0) {
							clearInterval(timer);
						}
					}, 1000)
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
				},800)
				
				document.body.style.overflow = "visible";
				this.$store.state.system.showGuide = false;
				this.$store.state.system.guideIndex = 0;
				this.$store.state.system.guideType = null;
				
			},
			getUserInfo() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					ext:'show'
				}
	
				  axios.post(globals.api.getUserInfo,params)
				  .then(res => {
						this.showMobile = true;
					if(res.data.data.mobile) {
						this.mobileBol = true;
						this.mobile = res.data.data.mobile
					}else {
						this.mobileBol = false
					}
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			onInput(key) {
		      this.verifyCode = (this.verifyCode + key).slice(0, 4);
		      console.log(this.verifyCode)
		      if(this.verifyCode.length==4) {
		      	var params = {
		      		UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					mobile: this.mobile,
					captcha: this.verifyCode
				}
	
				  axios.post(globals.api.bindMobile,params)
				  .then(res => {
				  		if(res.data.code==200) {
				  			Toast.success(this.$store.state.system.webLang.success_text)
							this.getUserInfo();
							this.showInput = false;
							this.showKeyboard = false;
							console.log(res.data)
							if(res.data.data.is_first_bind=='Y') {
								//首次绑定
								Dialog.alert({
								  title: this.$store.state.system.webLang.tips_text,
								  message: res.data.msg
								}).then(() => {
								  this.$router.go(-1) 
								})
							}else {
								this.$router.go(-1) 
							}
							
							
							
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
			getSmsCaptcha() {
				this.errorMsg = '';
				if(this.$store.state.system.guideType==3)return
				if(!this.captchaDisabled) {
					this.errorMsg = this.$store.state.system.webLang.please_enter_phone_number
					return
				}
			
				this.clickBol = true;
				
				
				var params = {
					mobile: this.mobile,
					action: 'bind_sms'
				}
	
				  axios.post(globals.api.getSmsCaptcha,params)
				  .then(res => {
				  		Toast(res.data.msg)
				  		if(res.data.code==200) {
				  			this.showInput = true;
							var localTime = new Date().getTime();
							var intervalTime = 300;
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
				
				  		}
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
			stopKeyBoaddText() {
				this.$store.dispatch(types.STOP_KEYBOARD_TEXT) 
			}
		}
	}
</script>

<style lang="scss">
	.bindPhone-wrap {
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
		
		 //新手引导
	    .guide-0 {
	        top: 2.8rem;
	        p {
	            height: 1.5rem;
	        }
	        .iconxiangshang {
	            left: 48%;
	            top: -32%;
	        }
	    }
	    .guide-1 {
	        top: 5.6rem;
	        p {
	            height: 1.5rem;
	        }
	        .iconxiangshang {
	            left: 48%;
	            top: -32%;
	        }
	        
	    }
	    .guideActive {
	        z-index: 9999999;
	        box-shadow: 0px 0px 5px -1px #d5d5d5;
	        .van-password-input {
	    		z-index: 9999999;
	    	}
	    }
	}
</style>