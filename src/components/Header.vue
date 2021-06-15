<template>
	<div style="width: 100%;">
		
	
	<!--<van-nav-bar :title=title left-text=""  :z-index="99999999" left-arrow @click-left="$emit('clickLeft')" @click.native="scrollTop" />-->
	<header class="header">
        <div class="inner"  @click="scrollTop">
            <div class="header-left"  v-if="left" @click="$emit('clickLeft')">
                <slot name="goBack">
                    <span><i class="iconfont iconxiangzuo"></i></span>
                </slot>
            </div>
            <div class="header-title">
                <slot name="title">
                    <span>{{ title }}</span>
                </slot>
            </div>
            <div class="header-right" v-if="right" @click="$emit('clickRight')">
                <slot name="right">
                    <img src="../assets/images/mine/kefu@2x.png" @click="showRecharge=true"/>
                    <span  @click="showRecharge=true">FAQ</span>
                </slot>
            </div>
        </div>
    </header>
    
    
    <div class="pop-up-bg" v-if="showRecharge" @click="closeBg"></div>
		  	<transition name="slide-popupShow"> 
	
			  <!--充值-->
			  <div class="pay-pwd-wrap"  v-if="showRecharge">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.pls_contact_agent_for_deposit}}</div>
			     
					<div class="pay-text">WhatsApp:{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			       <van-button type="primary" class="pay-cancel-btn  clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile" @click="closeBtn">
					{{$store.state.system.webLang.copy}}
			        </van-button>
			         <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share" @click="closeBtn">{{$store.state.system.webLang.message_now}}</a>
			      </div>
			      
			  </div>
			  <!--充值-->
			 </transition>
    
    <div style="height: 0.8rem;color: #fff;line-height: 0.8rem;position: relative;z-index: -1;">1</div></div>
</template>

<script>
	import * as types from "../store/types";
	import ClipboardJS from '../plugin/app/clipboard.min.js';
	import { Toast,Dialog } from 'vant';
	export default {
		data() {
			return {
				showRecharge:false
			}
		},
		mounted() {
			var clipboard = new ClipboardJS('.clip-btn');
			clipboard.on('success', () => {
				Toast.success(this.$store.state.system.webLang.already_copied);
			})
		},
		methods: {
			scrollTop() {
				window.scrollTo(0, 0);
			},
			onClickLeft() {

			},
			onClickRight() {

			},
			closeBtn() {
				this.showRecharge = false;
			},
			//充值电话
			toPhone() {
				window.location.href = 'tel://'+this.$store.state.system.rechargeMobile
			},
			closeBg() {
				this.showRecharge = false;
			},
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
	.header {
		z-index: 999;
		position: fixed;
		height: 0.81rem;
		line-height: 0.8rem;
		width: 100%;

		.inner {
/*			position: fixed;*/
			left: 0;
			top: 0;
			width: 100%;
			height: 0.8rem;
			line-height: 0.8rem;
			z-index: 1999;
			background:#D51B31;
		/*	background: #fff;*/
			/*background: url(../assets/images/header.png);
			background-size: 104%;
			background-position: -14px -26px;
			background-attachment: fixed;
			background-repeat: no-repeat;*/
			/*   opacity: 0.6;*/
		}
		.header-left {
			@include ct;
			top: 57%;
			left: 10px;
			color: #fff;
			padding-left: 5px;
			z-index:9999;
			.iconfont {
				font-size: 0.46rem;
				/*color: #8E8E93;*/
			}
			/*&:after {
                position:absolute; 
                content:""; 
                left:0; 
                top:50%; 
                margin:-7px 0 0 -7px; 
                width:.23rem; height:.23rem; 
                border-width:2px 0 0 2px; 
                border-style:solid; 
                border-color:#464646; 
                -webkit-transform:rotate(-45deg); 
                transform:rotate(-45deg); 
            }*/
			&:active {
				opacity: .6;
			}
		}
		.header-title {
			position: absolute;
			width: 100%;
			height: 100%;
			line-height: 0.9rem;

			font-size: 0.31rem;
			text-align: center;
			
			span {
				width: 5rem;
				display: inline-block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #fff;
				font-size: 0.31rem;
			}
		}
		.header-right {
			@include ct;
			right: 0;
			color: #8E8E93;
			font-size: 0.27rem;
			padding-left: 5px;
			display:flex;
			align-items:center;
			span {
				color: #fff;
				font-size: 0.26rem;
			}
			img {
				width: 40%;
				margin-right: 0.15rem;
			}
	
			.iconfont {
				margin-right: .13rem;
				font-size: .34rem;
				color: #fff;
			}
			.save {
				background: #fff;
				color: #D0021B;
				border-radius: 0.1rem;
				font-size: 0.24rem;
				margin-right: 0.24rem;
				padding: 0.07rem 0.2rem;
				font-weight: 600;
			}
		}
	}
	
	.activeHeader {
		.header {
			z-index: 1111111111;
		}
	}
</style>