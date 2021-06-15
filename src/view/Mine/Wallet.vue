<template>
	<div class="wallet-wrap page-wrap">
		<!--
        	作者：550243308@qq.com
        	时间：2020-06-22
        	描述：钱包
        -->
		<app-header :title="$store.state.system.webLang.funds" v-on:clickLeft="returnBack" :right="false"></app-header>
	
		<div class="wallet-list">
			<div class="list-block">
				<div class="block-title" @click="toRules($store.state.system.webLang.account_balance)">{{$store.state.system.webLang.account_balance}}  <i class="iconfont iconwenhao"></i></div>
				<div class="block-wrap"  @click="openShowRecharge">
					₹  <span class="amount">{{userInfo.points | NumFormat}}</span>
				</div>
			</div>
			
			<div class="list-block">
				<div class="block-title" @click="toRules($store.state.system.webLang.bonus)">{{$store.state.system.webLang.bonus}}  <i class="iconfont iconwenhao"></i></div>
				<div class="block-wrap"  @click="openShowRecharge">
					₹  <span class="amount">{{userInfo.lotto_points | NumFormat}}</span>
				</div>
			</div>
			
			
			<div class="list-block">
				<div class="block-title" @click="toRules($store.state.system.webLang.withdrawable_amount)">{{$store.state.system.webLang.withdrawable_amount}}  <i class="iconfont iconwenhao"></i></div>
				<div class="block-wrap"  @click="openShowRecharge">
					₹  <span class="amount">{{userInfo.draw_points | NumFormat}}</span>
				</div>
			</div>
		</div>
		
		
		
		<div class="setting-bottom">
			<span @click="openShowRecharge">{{$store.state.system.webLang.deposit}}</span>
		</div>
		
		
		
		
		<div class="pop-up-bg" v-if="showRecharge" @click="closeBg"></div>
		
			
		  	<transition name="slide-popupShow"> 

		
			  <div class="pay-pwd-wrap"  v-if="showRecharge">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.pls_contact_agent_for_deposit}}</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <!--<van-button type="primary" class="pay-cancel-btn"  @click="toPhone">
			           CALL 
			        </van-button>-->
			        <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share">{{$store.state.system.webLang.dial_now}} </a>
			        <van-button type="primary" class="pay-submit-btn clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile">
						{{$store.state.system.webLang.copy_number}}
			        </van-button>
			      </div>
			      
			  </div>
			  
			  
			  
			  <!-- <div class="show-swipeImg" v-if="showSwipeImg">
			  	<img :src="linkImg" />
			  	<i class="iconfont iconguanbi1" @click="showSwipeImg = false"></i>
			  </div> -->
			
			</transition>
	
		
		
	</div>
</template>
<script>
	import * as types from '../../store/types';
	import AppHeader from '../../components/Header.vue';
	import { Toast,Dialog  } from 'vant';
	import globals from '../../api/config';
	import axios from 'axios';
	import ClipboardJS from '../../plugin/app/clipboard.min.js';
	var clickBol = true;
	
	export default {
		data() {
			return {
				showRecharge:false
				
				
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
		watch:{
			
		},
		mounted() {
			var clipboard = new ClipboardJS('.clip-btn');
			clipboard.on('success', () => {
				Toast.success(this.$store.state.system.webLang.already_copied);
			})
		},
		activated() {
			this.$store.dispatch(types.GET_USER_INFO);
		},
		deactivated() {
			this.showRecharge = false;
		},
		methods: {
			returnBack() {
				this.$router.push('/results')
			},
			openShowRecharge() {
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
				if(this.userInfo.agent_id==0 || !this.userInfo.agent_id) {
					//没有代理可以跳转充值，0算没有代理
					this.$router.push('/rechargeSelect')
				}else{
					//有代理得联系上级充值
					// this.showRecharge=true
					this.$router.push('/rechargeSelect')
				}
			},
			closeBg() {
				this.showRecharge = false;
			},
			toRules(val) {
				this.$router.push({name:'rules',query:{val:val}})
			}
		}
	}
</script>

<style lang="scss">
	.wallet-wrap {
		background: #f5f5f5;
		.wallet-list {
			padding: 0.2rem 0.3rem;
			background: #fff;
			.list-block {
				margin-bottom: 0.3rem;
				.block-title {
					margin-bottom: 0.15rem;
					display: flex;
					align-items: center;
					.iconfont {
						color: #707070;
						font-size: 0.38rem;
						margin-left: 0.1rem;
					}
				}
				.block-wrap {
					border-bottom: 1px solid #ddd;
					color: #B60B1A;
					padding: 0 0 0.1rem 0;
					.amount {
						margin-left: 0.15rem;
						
					}
				}
			}
		}
		.setting-bottom {
			text-align: center;
			margin: 1.5rem 0.5rem 0 0.5rem;
			span {
				color: #fff;
				background: #D51B31;
				width: 100%;
				text-align: center;
				display: inline-block;
				padding: 0.23rem 0;
				font-size: 0.26rem;
				border-radius: 0.1rem;
			}
		}
	}
</style>