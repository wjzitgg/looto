<template>
	<div class="rechargeSelect-wrap page-wrap">
		<!--
        	作者：550243308@qq.com
        	时间：2020-11-28
        	描述：充值选择
        -->
        
        <app-header :title="$store.state.system.webLang.deposit" v-on:clickLeft="returnBack" :right="true">
        	<template slot="right">
				
                <span  @click="$router.push('/changeRecord')">
                	<i class="iconfont iconjilu" @click="$router.push('/changeRecord')"></i>
                	{{$store.state.system.webLang.records}}
                </span>
		    </template>
        </app-header>
        <!-- 新支付 -->
				  <div class="select-list" >
        	 <div class="select-wrap" :class="{'guideActive':$store.state.system.guideType==5&&($store.state.system.guideIndex==2||$store.state.system.guideIndex==3)}">
        	 	<div class="select-title" :style="`position:${$store.state.system.guideType==5&&($store.state.system.guideIndex==2||$store.state.system.guideIndex==3)?'initial':'absolute'}`">Quick Pay</div>
						<div class="yt-jiaocheng">
							<a href="https://youtu.be/EmFbNWrKDoY">
								<i class="iconfont iconshipin1"></i>
								<span>Tutorial</span>
							</a>
						</div>
        	 	<div class="img-wrap" @click="toRecharge(2)">
        	 		<img src="../../assets/images/recharge-3.png" />
        	 		<!-- <p>PayTM,GoldPay,Mobikwik & more</p> -->
        	 		<p>Paytm,Google Pay,BHIM,PhonePe,MobiKwik & More</p>
        	 	</div>
	        	<!--<img src="../../assets/images/recharge-1.png" />-->
	        	<div class="select-text" @click="toRecharge(2)">
	        		<div class="text-left">
	        			{{$store.state.system.webLang.deposit}} Rs.100~50000
	        		</div>
	        		
	        		
	        		<div class="text-right">
	        			<!--<img src="../../assets/images/mine/kefu@2x.png"/> 
	        			{{$store.state.system.webLang.payment_service}}-->
	        			<i class="iconfont iconxiangyou"></i>
	        		</div>
	        			
	        	</div>
	        </div>	
        </div>
        <!-- 原有得 -->
        <!-- <div class="select-list" >
        	 <div class="select-wrap" @click="toRecharge(1)" :class="{'guideActive':$store.state.system.guideType==5&&($store.state.system.guideIndex==2||$store.state.system.guideIndex==3)}">
        	 	<div class="select-title" :style="`position:${$store.state.system.guideType==5&&($store.state.system.guideIndex==2||$store.state.system.guideIndex==3)?'initial':'absolute'}`">Quick Pay</div>
        	 	<div class="img-wrap">
        	 		<img src="../../assets/images/recharge-3.png" />
        	 		<p>Google Pay,BHIM,PhonePe & more</p>
        	 	</div> -->
	        	<!--<img src="../../assets/images/recharge-1.png" />-->
	        	<!-- <div class="select-text">
	        		<div class="text-left">
	        			{{$store.state.system.webLang.deposit}} Rs.100~50000
	        		</div>
	        		
	        		
	        		<div class="text-right"> -->
	        			<!--<img src="../../assets/images/mine/kefu@2x.png"/> 
	        			{{$store.state.system.webLang.payment_service}}-->
	        			<!-- <i class="iconfont iconxiangyou"></i>
	        		</div>
	        			
	        	</div>
	        </div>	
        </div> -->
        
        
         <!--<div class="select-list">
        	 <div class="select-wrap" :class="{'guideActive':$store.state.system.guideType==5&&$store.state.system.guideIndex==3}">
        	 	<div class="select-title"  @click.stop="toRecharge(2)" :style="`position:${$store.state.system.guideType==5&&$store.state.system.guideIndex==3?'initial':'absolute'}`">Bank Card Transfer</div>
        	 	<div class="img-wrap img-wrapA"  @click.stop="toRecharge(2)">
        	 		<img src="../../assets/images/recharge-4.png" />
        	 		<p>Visa,MasterCard,RuPay & more</p>
        	 	</div>
	        
	        	<div class="select-text">
	        		<span @click.stop="toRecharge(2)">{{$store.state.system.webLang.deposit}} Rs.100~50000</span>
	        		<div>
	        			<a href="https://youtu.be/RxhWWIoPbxQ">
			        		<i class="iconfont iconshipin1"></i>
			        		<span>Tutorial</span>
			        	</a>
	        		</div>
	        	</div>
	        </div>	
        </div>-->
        
        
        <!--<div class="rechargeSelect-bottom">
        	<a href="https://youtu.be/RxhWWIoPbxQ">
        		<i class="iconfont iconshipin1"></i>
        		<span>Tutorial</span>
        	</a>
        	
        	<div class="kefu-wrap" @click="showKefu=true">
        		<img src="../../assets/images/mine/kefu@2x.png"/>
                <span  @click="showKefu=true">{{$store.state.system.webLang.payment_service}}</span>
        	</div>
        	
        </div>-->
        
        
        <div class="pop-up-bg" v-if="showKefu" @click="closeBtn"></div>
        <!--客服-->
        <transition name="slide-popupShow"> 
		<div class="pay-pwd-wrap"  v-if="showKefu">
		    <div class="pay-pwd-title">{{$store.state.system.webLang.please_contact_service}}</div>
		     
				<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
		      <div class="pay-bottom-btn">
		        <van-button type="primary" class="pay-cancel-btn  clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile" @click="closeBtn">
					{{$store.state.system.webLang.copy}}
		        </van-button>
		        <!--<van-button type="primary" class="pay-submit-btn">-->
		
		         <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share"  @click="closeBtn">{{$store.state.system.webLang.message_now}}</a>
		        <!--</van-button>-->
		       
		    </div>
		      
	 	</div>
	 	</transition>
		<!--客服-->
		
		
		<van-overlay :show="$store.state.system.showGuide&&$store.state.system.guideType==5" lock-scroll class="guide-overlay"/>	
			<!--充值引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==5" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
	
				
				
				<div v-if="$store.state.system.guideIndex==2" class="guide-0 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				
				<!--<div v-if="$store.state.system.guideIndex==3" class="guide-1 guide-wrap">
					
					<i class="iconfont iconxiangxia"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>-->
				
				<div v-if="$store.state.system.guideIndex==3" class="guide-0 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				
				
				
				
			
			</transition>
			</div>
			<!--充值引导-->
       
        
        
	
	</div>
</template>
<script>
	import * as types from '../../store/types';
	import AppHeader from '../../components/Header.vue';
	import { Toast,Dialog  } from 'vant';
	import globals from '../../api/config';
	import axios from 'axios';
	import ClipboardJS from '../../plugin/app/clipboard.min.js';
	let clickBol = true
	export default {
		data() {
			return { 
				showKefu:false
				
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.user.info;
			}
		},
		components: {
			AppHeader
		},
	
		mounted() {
			var clipboard = new ClipboardJS('.clip-btn');
			clipboard.on('success', () => {
				Toast.success(this.$store.state.system.webLang.already_copied);
			})
		},
		activated() {
			if(this.$store.state.system.guideType==5&&this.$store.state.system.guideIndex==2&&this.$store.state.system.showGuide) {
				//充值引导
				this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
			}
			
		},
		deactivated() {
			this.status = null
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			toRecharge(index) {
				if(this.$store.state.system.guideType==5)return
				this.$router.push({name:'recharge',query:{index:index}})
			},
			closeBtn() {
				this.showKefu = false;
			},
			//下一页
			nextGuide() {
				
				if(!clickBol)return
				this.$store.state.system.guideIndex+=1;
				this.$store.state.system.guideI = 0;
				this.$store.state.system.guideTemp = '';
				
				if(this.$store.state.system.guideIndex==4) {
					this.$router.push({name:'recharge',query:{index:1}})
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
			

		}
	}
</script>

<style lang="scss">
	.rechargeSelect-wrap {
		background: #f5f5f5;
		.header-right {
			display:inherit!important;
	       span {
	           border: 1px solid #fff;
	           border-radius: 0.3rem;
	           font-size: 0.22rem;
	           padding: 0.1rem 0.23rem;
	           color: #666!important;
	           background: #fff;
	       		margin-right: 0.1rem;
	            .iconfont {
	               color: #666!important;
	               margin-right:0!important;
	            }
	       }
	   }
		.select-list {
			padding: 0.4rem 0.3rem;
			background: #fff;
			.select-wrap {
				padding: 0.4rem 0 0 0;
				border: 1px solid #c3c3c3;
				position: relative;
				border-radius:0.1rem;
				.select-title {
					position: absolute;
					left: 0.3rem;
					top: -0.2rem;
					background: #fff;
					padding: 0 0.15rem;
				}
				.img-wrap {
					text-align: center;
					margin: 0.25rem 0 0.5rem 0;
					img {
						width: 1.6rem;
					}
					p {
						font-size: 0.26rem;
						color: gray;
					}
				}
				.img-wrapA {
					img {
						width: 1.8rem;
					}
					p {
						margin-top: -0.2rem;
					}
				}
				/*img {
					width: 100%;
					height: 3.3rem;
				}*/
				.select-text {
					padding: 0.1rem 0.1rem 0.1rem 0.2rem;
					font-weight: 600;
					border-top: 1px dotted #c3c3c3;
					display: flex;
					align-items: center;
					div {
						flex: 1;
/*	/*	/*	/*	/*	/*	/*
						a {
							background: #F5F6F5;
							border-radius: 3px;
							padding: 0.04rem 0.1rem;
						}
						span {
							color: #2A78E4;
							text-decoration: underline;
							font-size: 0.25rem;
							font-weight: 600;
						}
						.iconfont {
							color: #2A78E4;
							font-size: 0.27rem;
							padding-right: 0.1rem;
						}*/
					}
					.text-right {
						display: flex;
						align-items: center;
						justify-content: flex-end;
						font-weight: normal;
						color: #D0021B;
						img {
							width: 0.51rem;
						}
						.iconfont {
							color: #000;
							font-size: 0.5rem;
						}
					}
				}
			}
		}
		
		.rechargeSelect-bottom {
			padding: 0.4rem 0 0.2rem 0;
			display: flex;
			align-items: center;
			justify-content: center;
			.kefu-wrap {
				padding: 0.08rem 0.2rem;
				background:#FF0000;
				border-radius:0.06rem;
				img {
					width: 0.51rem;
				}
				span {
					color:#f9f9f9 !important;
					font-size: 0.26rem;
				}
			}
		}
		
		
		 //新手引导
	    .guide-0 {
	        top: 6.8rem;
	        p {
	            height: 1rem;
	        }
	        .iconxiangshang {
	            left: 48%;
	            top: -32%;
	        }
	        
	    }
	    .guide-1 {
	        top: 18%;
	        p {
	            height: 1rem;
	        }
	        .iconxiangxia {
	            left: 48%;
	            bottom: -32%;
	        }
	        .guide-people {
	            right: 2%;
	            top: -80%;
	        }
	        
	    }
	    .guideActive {
	        z-index: 9999999;
	        background: #fff;
	        box-shadow: 0px 0px 5px -1px #d5d5d5;
	    }
		
	}
	.yt-jiaocheng {
		position: absolute;
    right: .24rem;
    top: 0.1rem;
		a {
			color: #1989fa;
			text-decoration-line: underline;
		}
	}
</style>