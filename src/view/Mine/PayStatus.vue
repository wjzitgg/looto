<template>
	<div class="payStatus-wrap page-wrap">
		<!--
        	作者：550243308@qq.com
        	时间：2020-10-26
        	描述：支付结果
        -->
		<app-header title="Pay" v-on:clickLeft="returnBack" :right="false" :left="false"></app-header>
		
		<div class="payStatus-text" v-if="status==1">{{$store.state.system.webLang.PAYING}}</div>
		<div class="payStatus-text" v-else-if="status==3">{{$store.state.system.webLang.PAYMENT_SUCCESSFUL}}</div>
		<div class="payStatus-text" v-else-if="status==5">{{$store.state.system.webLang.PAYMENT_FAILED}}</div>
		
		
		<div class="payStatus-back" v-if="second>0" @click="$router.push('/wallet')">{{SecondText}}</div>
	
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
				status:null,
				second:0,
				SecondText:''
				
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
		
		},
		activated() {
			
			
			if(this.$route.query.order_id) {
				this.checkOrder(this.$route.query.order_id)
			}else if(this.$route.query.status=='false') {
				this.status = 5;
				this.second = 5;
		  		var timer = setInterval(()=>{
		  			this.second-=1;
		  			if(localStorage.getItem('lang')=='hi') {
						this.SecondText = this.second+' सेकंड में वॉलेट पर लौटें'
					}else {
						this.SecondText = 'Return to wallet in' +this.second+ 'seconds'
					}
		  			
		  			if(this.second<=0) {
		  				clearInterval(timer)
		  				this.SecondText = ''
		  				this.$router.push('/wallet')
		  				return
		  			}
		  		},1000)
			}
		},
		deactivated() {
			this.status = null
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			//支付回调
			checkOrder(orderId) {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					payment_id:this.$route.query.trade_id
				}
	
				  axios.post(globals.api.checkOrder,params)
				  .then(res => {
				  	//3是成功，1是支付中，5是支付失败
				  		console.log(res)
				  		this.status = res.data.data.status;
				  		this.second = 5;
				  		var timer = setInterval(()=>{
				  			this.second-=1;
				  			if(this.second<=0) {
				  				clearInterval(timer)
				  				this.$router.push('/wallet')
				  				return
				  			}
				  		},1000)
					
					  }).catch((error)=>{
						
		       			error.msg?Toast(error.msg):''
		       		})
			},
			

		}
	}
</script>

<style lang="scss">
	.payStatus-wrap {
		.payStatus-text {
			text-align: center;
			padding: 0.6rem 0;
			font-size: 0.6rem;
			color: green;
		}
		.payStatus-back {
			text-align: center;
			text-decoration: underline;
			color: cornflowerblue;
		}
		
	}
</style>