<template>
	<div style="width: 100%;">

	<header class="index_header">
      	<div class="results-title" :style="`position:${$store.state.system.showGuide&&(($store.state.system.guideType==3&&$store.state.system.guideIndex==1)||($store.state.system.guideType==5&&$store.state.system.guideIndex==1)||($store.state.system.guideType==7&&$store.state.system.guideIndex==1)||($store.state.system.guideType==14&&$store.state.system.guideIndex==1))?'initial':'fixed'}`">
	
			<div class="title-headImage" :class="{'guideActive':($store.state.system.guideType==3&&$store.state.system.guideIndex==1)||($store.state.system.guideType==7&&$store.state.system.guideIndex==1)||($store.state.system.guideType==14&&$store.state.system.guideIndex==1)}">
			
				<img :src="$store.state.user.info.avatar" @click="toMine" v-if="$store.state.user.info.avatar"/>
				<img :src="$store.state.system.systemInfo.default_avatar" @click="toMine" v-else/>
				<div v-if="$store.state.user.info.nickname"  @click="toMine">{{$store.state.user.info.nickname}}</div>
				<div v-else @click="toLogin">{{$store.state.system.webLang.log_in}}</div>
			</div>
			
			<!--<div class="download-btn clip-btn"  :data-clipboard-text="channel" v-if="$store.state.system.showAndroid">
				<a href="https://dl.lottoplus.cc/apps/FantasyLand.apk">
					<i class="iconfont icondownload-fill"></i> Download APP
				</a>
			</div>-->
			
			<div class="title-agent title-agentA"  @click="openKefu" >
				<img src="../assets/images/mine/kefu22.png"/>
			</div>
			
			
			
			<div class="title-agent"  @click="$router.push('/message')" v-if="$store.state.user.info">
				<img src="../assets/images/mine/notifications.png" />
				<span class="messageNum" v-if="$store.state.user.info.unread_msg_count>0">{{$store.state.user.info.unread_msg_count>99?99:$store.state.user.info.unread_msg_count}}</span>
				 <!--Notification-->
			</div>
			<!--$router.push('/wallet')"-->
			<div class="title-amount"  @click="toWallet" >
				<img src="../assets/images/mine/qianbao.png"/>
				<span v-if="$store.state.user.info">₹ {{$store.state.user.info.points+$store.state.user.info.lotto_points | NumFormat}}</span>
				<span v-else>0.00</span>
			</div>
			
<!-- 			
			<div class="title-amount title-amountA"  @click="toRechargeSelect" :class="{'guideActiveA':$store.state.system.guideType==5&&$store.state.system.guideIndex==1}">
				<span>₹ {{$store.state.system.webLang.deposit}}</span>

			</div> -->
			
		</div>
		
		
		
		<div class="pop-up-bg" v-if="showKefu" @click="closeBg"></div>
		  	<transition name="slide-popupShow"> 

			  
			  
			  <!--客服-->
			  <div class="pay-pwd-wrap"  v-if="showKefu">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.please_contact_service}}</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn  clip-btn" :disabled="$store.state.system.showGuide" :data-clipboard-text="$store.state.system.rechargeMobile" @click="closeBtn">
						{{$store.state.system.webLang.copy}}
			        </van-button>
			        <!--<van-button type="primary" class="pay-submit-btn">-->
			
			         <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share"  @click="closeBtn">{{$store.state.system.webLang.message_now}}</a>
			        <!--</van-button>-->
			       
			      </div>
			      
			  </div>
			  <!--客服-->
			  
		
			  
			  
			</transition>
		
			
		
		<audio preload="auto" ref="jin" src="../assets/mp3/Menu_appear.mp3"></audio>
		<audio preload="auto" ref="tui" src="../assets/mp3/Menu_appear.mp3"></audio>
		
    </header>
</div>
</template>

<script>
	import * as types from "../store/types";
	import ClipboardJS from '../plugin/app/clipboard.min.js';
	import { Toast,Dialog } from 'vant';
	
	export default {
		data() {
			return {
				channel:'',
				showKefu:false,
				balance:this.$store.state.user.info.points+this.$store.state.user.info.lotto_points
			}
		},
		watch: {
			balance (newVal,oldVal) {
					console.log(newVal,oldVal);
			  },
		},
		mounted() {
		
//
			var clipboard = new ClipboardJS('.clip-btn');
			clipboard.on('success', () => {
				Toast.success(this.$store.state.system.webLang.already_copied);
			})
		},
		methods: {
			scrollTop() {
				window.scrollTo(0, 0);
			},
			toMine() {
				if(this.$store.state.system.showGuide)return
				this.$router.push('/mine')
			},
			toRechargeSelect() {
				if(this.$store.state.system.showGuide)return
				this.$router.push('/rechargeSelect')
			},
			toWallet() {
				if(this.$store.state.system.showGuide)return
				this.$router.push('/wallet')
			},
			onClickLeft() {

			},
			onClickRight() {

			},
			closeBtn() {
				this.showKefu = false;
			},
			//充值电话
			toPhone() {
				window.location.href = 'tel://'+this.$store.state.system.rechargeMobile
			},
			closeBg() {
				this.tui();
				this.showKefu = false
			},
			openKefu() {
				if(this.$store.state.system.showGuide)return
				this.jin();
				this.showKefu = true
			},
			toLogin() {
				localStorage.removeItem('token')
	            localStorage.removeItem('userId')
	            setTimeout(()=>{
	            	this.$router.push('/login')
	            },100)
				
			}
		},
		props: {
			left: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: 'FantasyLand'
			},
			right: {
				type: Boolean,
				default: true
			},
			icon: {
				type: String,
			},
			tColor: {
				type: String,
				default: '#464646'
			},
		}
	}
</script>

<style lang="scss">
	@import '../assets/style/mixins';
	.index_header {
		height: 1.2rem;
		.results-title {
            background: #E40001;
            display: flex;
           align-items: center;
           padding: 0 0.4rem;
           font-size: 0.26rem;
           color: #707070;
           height: 1.2rem;
           position: fixed;
           width: 100%;
           top: 0;
           z-index: 1999;
           .title-headImage {
               flex: 1;
               color: #fff;
               display: flex;
               align-items: center;
               font-size: 0.24rem;
               div {
                   text-decoration: none;
									 font-size: .28rem;
               }
               img {
                   width: 0.9rem;
                   height: 0.9rem;
                   border-radius: 100%;
                   margin-right: 0.1rem;
               }
           }
           .download-btn {
               padding: 0.1rem 0.15rem;
               background: #fff;
               border-radius: 0.1rem;
               font-weight: 600;
               margin-right: 0.25rem;
               font-size: 0.24rem;
               a {
                    color: #B60B1A;
               }
           }
           .title-agent {
               padding: 0;
               background: none;
              //  border-radius: 50%;
              //  margin-right: 0.2rem;
              //  color: #b60b1a;
              //  font-weight: 600;
               position: relative;
               width: 0.5rem;
               height: 0.5rem;
              
               img {
                   width: 0.4rem;
               }
               .messageNum {
                    position: absolute;
                    color: #fff;
                    width: 0.3rem;
                    height: 0.3rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #F7232C;
                    font-size: 0.17rem;
                    right: -0.15rem;
                    top: -0.1rem;
                }
           }
           .title-agentA {
           		margin-right: 0.26rem;
           		img {
                   width: 0.4rem;
           
               }
           }
           .title-amount {
               background: none;
							 padding: 0;
               border-radius: 0.1rem;
               color: #fff;
               font-weight: 600;
               font-size: 0.27rem;
               display: flex;
               align-items: center;
               margin-left: 0.15rem;
               img {
                   width: 0.37rem;
                   margin-right: 0.09rem;
               }
           }
           .title-amountA {
           	 	img {
                   width: 0.13rem;
                   margin-right: 0.09rem;
               }
           }
        }
        
        .guideActive {
            z-index: 9999999;
            color: #fff!important;
        }
        .guideActiveA {
        	z-index: 9999999;
        }
	}
</style>