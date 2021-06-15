<template>
	<div class="safetyGrade-wrap" >
		
		
		<app-header :title="$store.state.system.webLang.security_grade" v-on:clickLeft="returnBack" :right="true">
			<template slot="right">
				<img src="../../assets/images/mine/kefu@2x.png" @click="showKefu=true"/>
                <span @click="showKefu=true">FAQ</span>
		    </template>
		</app-header>
		
		
		<div class="safetyGrade-top">
			<div class="safe-pie">
				<div class="pie" v-if="safePercent>0" :class="{'aaa':safePercent==25,'bbb':safePercent==50,'ccc':safePercent==75,'ddd':safePercent==100}">
					<div class="num" :style="`bottom:${safePercent==75?0.45:safePercent==50?0.7:safePercent==25?1:safePercent==100?0.65:''}rem;left:${safePercent==100?0.5:0.2}rem`">
						<countTo :startVal='startVal' :endVal='safePercent' :decimals='0' :duration='duration'></countTo>%
					</div>
				</div>
			</div>
	
		</div>
		
		<div class="safe-top-text">{{$store.state.system.webLang.security_level}}: {{safePercent<50?$store.state.system.webLang.low:safePercent<75?$store.state.system.webLang.medium:$store.state.system.webLang.high}}</div>
		<div class="safe-top-textA">{{$store.state.system.webLang.complete_he_information}}</div>
		
		
	
		<div class="safetyGrade-list">
			
			<!--提款信息-->
			<div class="safetyGrade-block" @click="toAccountManage">
				<img src="../../assets/images/mine/safety_Grade/setup@2x.png" class="block-status" v-if="bankList.length"/>
				<img src="../../assets/images/mine/safety_Grade/nosetup@2x.png" class="block-status" v-else/>
				<div class="block-top">{{$store.state.system.webLang.withdrawal_information}}</div>
				<div class="block-bottom">
					<div class="bottom-left">
						<img src="../../assets/images/mine/safety_Grade/withdrawal@2x.png" />
					</div>
					<div class="bottom-center">{{$store.state.system.webLang.make_sure_the_information_is_all_correct}}</div>
					<div class="bottom-right">
						<i class="iconfont iconxiangyou"/></i>
					</div>
				</div>
			</div>
			
			<!--资金密码-->
			<div class="safetyGrade-block"  @click="toEditPayPassword">
				<img src="../../assets/images/mine/safety_Grade/setup@2x.png" class="block-status" v-if="userInfo.is_pay_password=='Y'"/>
				<img src="../../assets/images/mine/safety_Grade/nosetup@2x.png" class="block-status" v-else/>
				<div class="block-top">{{$store.state.system.webLang.pin_number}}</div>
				<div class="block-bottom">
					<div class="bottom-left">
						<img src="../../assets/images/mine/safety_Grade/fundpassword@2x.png" />
					</div>
					<div class="bottom-center">{{$store.state.system.webLang.safety_of_your_funds}}</div>
					<div class="bottom-right">
						<i class="iconfont iconxiangyou"/></i>
					</div>
				</div>
			</div>
			
			<!--绑定邮箱-->
			<div class="safetyGrade-block" @click="toBindMail">
				<img src="../../assets/images/mine/safety_Grade/setup@2x.png" class="block-status" v-if="userInfo.email"/>
				<img src="../../assets/images/mine/safety_Grade/nosetup@2x.png" class="block-status" v-else/>
				<div class="block-top">{{$store.state.system.webLang.link_mailbox}}</div>
				<div class="block-bottom">
					<div class="bottom-left">
						<img src="../../assets/images/mine/safety_Grade/mailbox@2x.png" />
					</div>
					<div class="bottom-center">{{$store.state.system.webLang.retrieve_password}}</div>
					<div class="bottom-right">
						<i class="iconfont iconxiangyou"/></i>
					</div>
				</div>
			</div>
			
			<!--绑定手机-->
			<div class="safetyGrade-block" @click="toBindMobil" :class="{'guideActive':$store.state.system.guideType==3&&$store.state.system.guideIndex==3}">
				<img src="../../assets/images/mine/safety_Grade/setup@2x.png" class="block-status" v-if="userInfo.mobile"/>
				<img src="../../assets/images/mine/safety_Grade/nosetup@2x.png" class="block-status" v-else/>
				<div class="block-top">{{$store.state.system.webLang.link_phone}}</div>
				<div class="block-bottom">
					<div class="bottom-left">
						<img src="../../assets/images/mine/safety_Grade/phone@2x.png" />
					</div>
					<div class="bottom-center">{{$store.state.system.webLang.will_contact_your}}</div>
					<div class="bottom-right">
						<i class="iconfont iconxiangyou"/></i>
					</div>
				</div>
			</div>
			
		
			
			
			
		</div>
		
		
		
		
		
		
		<div class="pop-up-bg" v-if="showKefu" @click="closeBg"></div>
		  	<transition name="slide-popupShow"> 
	
			  
			  
			  <!--客服-->
			  <div class="pay-pwd-wrap"  v-if="showKefu">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.please_contact_service}}</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile" @click="closeBtn">
			           {{$store.state.system.webLang.copy}}
			        </van-button>
			        <!--<van-button type="primary" class="pay-submit-btn">-->
			            <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share" @click="closeBtn">{{$store.state.system.webLang.message_now}}</a>
			            
			        <!--</van-button>-->
			       
			      </div>
			      
			  </div>
			  <!--充值-->
			  
			  
			</transition>
			
			
			
			
			<van-overlay :show="$store.state.system.showGuide&&$store.state.system.guideType==3" lock-scroll class="guide-overlay"/>	
			<!--绑定手机号引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==3" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
	
				
				
				<div v-if="$store.state.system.guideIndex==3" class="guide-0 guide-wrap">
				
					<i class="iconfont iconxiangxia"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
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
	import countTo from 'vue-count-to';
	let clickBol = true;
	export default {
		data() {
			return {
				safePercent:'',
				startVal: 0,
     			duration: 1000,
				bankList:[],
				showKefu:false
				
			}
		},
		components: {
			AppHeader,
			countTo
		},
		computed: {
			userInfo() {
				return this.$store.state.user.info;
			}
		},
		watch:{
			
		},
		activated() {
			document.body.style.overflow = "visible";
			window.scrollTo(0,8000)
			this.cardsBanks();//获取银行卡列表

			if(this.$store.state.system.guideType==3&&this.$store.state.system.guideIndex==3&&this.$store.state.system.showGuide) {
				//绑定手机号引导
				this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
			}
	
		},
		deactivated() {
			this.timeOut = false;
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
			
				
				if(this.$store.state.system.guideType==3&&this.$store.state.system.guideIndex==4) {
					//绑定手机号引导
					this.$router.push('/bindMobile')
					return
				}
		
				
				this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
				clickBol = false;
				setTimeout(()=>{
					clickBol = true
				},500)
			},
			stopKeyBoaddText() {
				this.$store.dispatch(types.STOP_KEYBOARD_TEXT) 
			},
			closeBtn() {
				this.showKefu = false;
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
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			//获取银行列表
			cardsBanks() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token')
				}
	
				  axios.post(globals.api.cardsGet,params)
				  .then(res => {
				  	
//				  		var temp = {name:'BBB银行',id:3}
//				  		
						this.bankList = res.data.data
							console.log(this.bankList)
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			closeBg() {
				this.showKefu = false;
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
			toEditPayPassword() {
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
			toBindMail() {
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
				this.$router.push('/bindMail')
			},
			toBindMobil() {
				if(this.$store.state.system.showGuide)return
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
				this.$router.push('/bindMobile')
			}

		}
	}
</script>
<style lang="scss">
	.safetyGrade-wrap {
		background: #F7F6F9;
		min-height: 100vh;
		.safetyGrade-top {
			display:flex;
			justify-content:center;
			margin:0.4rem 0 0.2rem 0;
			.safe-pie {
                background: #BC56FF;
                border-radius: 100%;
                width: 2.68rem;
                height: 2.68rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .pie {
                width: 1.85rem;
                height: 1.84rem;
                border-radius: 50%;
                background: #fff;
                background-image: linear-gradient(to right, transparent 50%, #BC56FF 0);
                transition: all 0.3s;
                position: relative;
            }   
   
            .pie::before {
//              
                content: '';
                display: block;
                
                height: 100%;
                border-radius: 0 100% 100% 0/50%;
                background-color: inherit;
                transform-origin: left;
                
//              transform: rotate(.25turn);
            }
            .aaa {
               background: #BC56FF!important;
               background-image:linear-gradient(to left, transparent 50%, #fff 0)!important;
            }
           
            .aaa::before {
//              transform: rotate(.25turn);
				margin-left: 49%;
                animation: spin 0.5s linear alternate forwards;
            }
            .bbb::before {
//              transform: rotate(.50turn);
                margin-left: 50%;
                animation: spin1 0.5s linear alternate forwards;
            }
            .ccc::before {
//              transform: rotate(.25turn);
				margin-left: 51%;
                animation: spin2 0.5s linear alternate forwards;
            }
            .ddd::before {
//              transform: rotate(.25turn);
				margin-left: 50%;
                animation: spin3 0.5s linear alternate forwards;
            }
            
              @keyframes spin{
                to{transform: rotate(.25turn);}
              }

               @keyframes spin1{
                to{transform: rotate(.50turn);}
              }
               @keyframes spin2{
                to{transform: rotate(.25turn);}
              }
              @keyframes spin3{
                to{transform: rotate(0turn);}
              }
              .num {
              	position: absolute;
              	font-size: 0.3rem;
              	color: #BC56FF;
              	/*bottom: 0.4rem;*/
              	left: 0.2rem;
              	font-weight: 600;
              	span {
              		margin-right: -0.07rem;
              	}
              }

		}
		
		.safe-top-text {
          	text-align: center;
          	color: #BC56FF;
          	font-size: 0.3rem;
          	font-weight: 600;
        }
        .safe-top-textA {
        	text-align: center;
        	font-size: 0.22rem;
        	color: rgba(0,0,0,0.34);
        	margin-top: 0.04rem;
        }
        
        .safetyGrade-list {
        	padding: 0.4rem 0.3rem;
        	.safetyGrade-block {
        		padding: 0.4rem 0.2rem 0.4rem 0.25rem;
        		background:#fff;
        		box-shadow:0px 3px 6px 0px rgba(84,105,119,0.05);
				border-radius:0.16rem;
				margin-bottom:0.3rem;
				position:relative;
				.block-status {
					position: absolute;
					left: 0;
					top: 0;
					width: 1rem;
				}
        		.block-top {
        			font-size: 0.3rem;
        			color: #666666;
        			padding-left: 0.5rem;
        			margin-bottom: 0.1rem;
        			font-weight: 600;
        		}
        		.block-bottom {
        			display: flex;
        			align-items: center;
        			.bottom-left {
        				img {
        					width: 1.2rem;
        					margin-right: 0.1rem;
        				}
        			}
        			.bottom-center {
        				flex: 2;
        				color: #999999;
        			}
        			.bottom-right {
        				.iconfont {
			                font-size: 0.54rem;
			                color: #bebebe;
			            }
        			}
        		}
        	}

        }
        
        
        //新手引导
	    .guide-0 {
	    	position: fixed;
	        bottom: 3.8rem;
	        p {
	            height: 1rem;
	        }
	        .iconxiangxia {
	            left: 48%;
	            bottom: -32%;
	        }
	        
	    }
	    .guideActive {
	    	position: fixed!important;
	    	bottom: 0;
	    	width: 92%;
	        z-index: 9999999;
	        box-shadow: 0px 0px 5px -1px #d5d5d5;
	    }
	}
</style>