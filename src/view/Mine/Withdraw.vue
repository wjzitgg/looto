<template>
	<div class="withdraw-wrap page-wrap">
		
		<app-header :title="$store.state.system.webLang.withdrawable_amount" v-on:clickLeft="returnBack" :right="false"></app-header>
		
	
		<div class="recharge-text">{{$store.state.system.webLang.withdrawal_amount}} (Rs.{{userInfo.disposable_points | NumFormat}})</div>
		<van-field v-model="drawAmount" @input="changeAmount" clearable type="digit" label="" :placeholder="$store.state.system.webLang.please_fill_in_the_withdrawal_amount" />
		
		
		<div class="recharge-text">{{$store.state.system.webLang.pin_number}}</div>
		<van-field v-model="drawPassword" clearable type="password" label="" :placeholder="$store.state.system.webLang.please_fill_in_the_fund_password"/>
			

		 <van-field  clearable v-model="card.number"  :label="$store.state.system.webLang.collection_account" right-icon="arrow" readonly @click="toAccountManage">
	
		
		</van-field>
		
		<div class="tips" v-if="withdrawText==2">
			<!--<i class="iconfont iconinfo"></i>--> 
			{{$store.state.system.webLang.tips_text}}:
			<p>1. Player must have deposit history before withdraw;</p>
			<p>2. Player need to bet full deposit amount before withdraw;</p>
			<p>3. Currently you need to have {{userInfo.frozen_points | NumFormat}} bets before withdraw the requested amount;</p>
			<p>4. {{$store.state.system.systemInfo.draw_points_charge_percent}}% Withdraw fees will automatically deduct from withdrawal amount. </p>
			<p>5. Minimum amount for withdraw is Rs.300 and the amount shall multiple by 100.</p>
		</div>
		
		<div class="tips" v-if="withdrawText==1">
			<!--<i class="iconfont iconinfo"></i>--> 
			{{$store.state.system.webLang.tips_text}}:
			<p>1. खिलाड़ी के पास जमा करने से पहले इतिहास होना चाहिए;</p>
			<p>2. खिलाड़ी को वापस लेने से पहले पूरी जमा राशि पर दांव लगाना होगा;</p>
			<p>3. वर्तमान में अनुरोधित राशि को वापस लेने से पहले आपको {{userInfo.frozen_points | NumFormat}} दांव लगाने की आवश्यकता है;</p>
			<p>4. {{$store.state.system.systemInfo.draw_points_charge_percent}}% विदड्रॉल फीस विदड्रॉल अमाउंट डिडक्ट हो जाएगी।</p>
			<p>5. निकासी के लिए न्यूनतम राशि 300 रुपये है और यह राशि 100 से कई गुना अधिक होगी।</p>
		</div>
		
		
		<div class="setting-bottom">
			<van-button   type="danger"  :loading="loading" @click="submitDraw">{{$store.state.system.webLang.Submit}}</van-button>
		</div>
		
		<div class="withdraw-text" v-if="withdrawText==2">Receiving amount after fees Rs.{{drawAmountAfter}}</div>
		<div class="withdraw-text" v-if="withdrawText==1">{{drawAmountAfter}} रुपए फीस के बाद राशि प्राप्त करना</div>
		
		

			<van-action-sheet v-model="showPayTypeList" title="Select Pay Method" :actions="payTypeList" @select="onSelectType" @cancel="onCancelType" :cancel-text="$store.state.system.webLang.cancel"/>
	
	
		<div style="display:none;" id="hftx"></div>
		
	</div>
</template>
<script>
	import * as types from '../../store/types';
	import AppHeader from '../../components/Header.vue';
	import { Toast,Dialog  } from 'vant';
	import globals from '../../api/config';
	import axios from 'axios';

	var clickBol = true;
	
	export default {
		data() {
			return {
				drawPassword:'',
				card:[],
				showPayTypeList:false,
				drawAmount:'',//提现金额

				payTypeList:[],//支付方式列表
				payIndex:'',
				payTypeName:'',
				loading:false,
				withdrawTimer:null,
				withdrawText:2,
				drawAmountAfter:0
				
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
			drawAmount(val) {
				// console.log(val);
			}

		},
		mounted() {

		},
		activated() {
			if(localStorage.getItem('lang')=='hi') {
				this.withdrawText = 1
			}else {
				this.withdrawText = 2
			}
			this.$store.dispatch(types.GET_USER_INFO);
			this.getBizTypes();//支付方式列表
			if(this.$route.query.id) {
				this.cardsGet();
			}
		},
		deactivated() {
			this.showPayTypeList = false;
			
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},

			changeAmount() {
				// console.log(this.drawAmount)
				clearTimeout(this.withdrawTimer)
				this.withdrawTimer = setTimeout(()=>{
					if(this.drawAmount) {
						var bite = 0;
						if(Number(this.drawAmount)<300) {
							this.drawAmount = 300
						}else {
							var f = Math.floor(this.drawAmount/100)
							this.drawAmount = f*100
							this.drawAmountAfter = this.drawAmount-this.drawAmount*this.$store.state.system.systemInfo.draw_points_charge_percent*0.01

    				}
					}
					
				},1000)
			},
			//获取银行卡列表
			cardsGet() {


				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token')
				}
	
				  axios.post(globals.api.cardsGet,params)
				  .then(res => {
				  		console.log(res.data.data)
				  		var data = [];
				  		
				  		for(let i = 0;i<res.data.data.length;i++) {
				  			if(res.data.data[i].id==this.$route.query.id) {
				  				data = res.data.data[i];
				  				this.card = res.data.data[i];
				  			}
				  		}

				  		this.card.number = '**** **** **** '+String(data.number).substr(String(data.number).length - 4)
				  	console.log(this.card)
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			//跳转银行卡选择
			toAccountManage() {
				this.$router.push({name:'accountManage',query:{type:'draw'}})
			},
			//支付方式列表
			getBizTypes() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token')
				}
	
				  axios.post(globals.api.getBizTypes,params)
				  .then(res => {
				  		 const list = res.data.data;
				  		 var arr = []
				  		 
				  		 for (let i in list) {
					        let o = {};
					        o[i] = list[i];
					        arr.push(o)
					    }
 
					

						for(let i of arr) {
							for(let k in i) {
								i.name = i[k]
								i.type = k
								i.color = ''
							}	
						}
				  		 
				  		console.log(arr)
				  		this.payTypeList = arr;
					
					  }).catch((error)=>{
						
		       			error.msg?Toast(error.msg):''
		       		})
			},
			onSelectType(item) {
				console.log(item)
				for(let i = 0;i<this.payTypeList.length;i++) {
					this.payTypeList[i].color = '';
						if(this.payTypeList[i].type==item.type) {
							this.payIndex = i;
							
						}
						this.payTypeName = item.name
						item.color = '#6173D5'
				
				}
				this.onCancelType();
				console.log(this.payIndex)
			},	
			onCancelType() {
				this.showPayTypeList = false;
			},
			//提现
		submitDraw() {
			console.log()
	
			
			if(this.userInfo.is_pay_password=='N') {
				Dialog.confirm({
				  title: this.$store.state.system.webLang.tips_text,
				  message: this.$store.state.system.webLang.set_your_pin_number_on_your_profile
				}).then(() => {
				  this.$router.push('/editPayPassword')
				}).catch(() => {
				  // on cancel
				});
				return
			}
			
			
			if(this.userInfo.mobile=='') {
				Dialog.confirm({
				  title: this.$store.state.system.webLang.tips_text,
				  message: this.$store.state.system.webLang.set_your_mobile_number_on_your_profile
				}).then(() => {
				  this.$router.push('/bindMobile')
				}).catch(() => {
				  // on cancel
				});
				return
			}
			
			if(this.userInfo.email=='') {
				Dialog.confirm({
				  title: this.$store.state.system.webLang.tips_text,
				  message: this.$store.state.system.webLang.set_your_email_on_your_profile
				}).then(() => {
				  this.$router.push('/bindmail')
				}).catch(() => {
				  // on cancel
				});
				return
			}
			
//			
			if(!this.drawAmount) {
				Toast(this.$store.state.system.webLang.please_fill_in_the_withdrawal_amount)
				return
			}
			if(Number(this.drawAmount)<this.$store.state.system.systemInfo.min_draw_points) {
				Toast(this.$store.state.system.webLang.the_minimum_cash_withdrawal_is+this.$store.state.system.systemInfo.min_draw_points)
				return
			}
			if(Number(this.drawAmount)>this.$store.state.system.systemInfo.max_day_draw_points) {
				Toast(this.$store.state.system.webLang.the_maximum_cash_withdrawal_amount_is+this.$store.state.system.systemInfo.max_day_draw_points)
				return
			}
			if(this.$store.state.system.systemInfo.max_day_draw_count<1) {
				Toast(this.$store.state.system.webLang.insufficient_withdrawals)
				return
			}
			if(this.drawAmount>this.userInfo.disposable_points) {
				Toast(this.$store.state.system.webLang.insufficient_balance)
				return
			}
			if(!this.drawPassword) {
				Toast(this.$store.state.system.webLang.please_fill_in_the_fund_password)
				return
			}
			if(!this.card) {
				Toast(this.$store.state.system.webLang.select_collection_account)
				return
			}
			
				this.loading = true;
			
			
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				card_id:this.card.id,
				points:this.drawAmount,
				pay_password:this.drawPassword
			}

			  axios.post(globals.api.pointsDraw,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		
			  		if(res.data.code==200) {
			  			this.drawAmount = '';
			  			this.drawPassword = '';
			  			this.showDraw = false;
			  			this.$store.dispatch(types.GET_USER_INFO);
			  			Toast.success(this.$store.state.system.webLang.success_text)
			  		}else {
			  			Toast(res.data.msg)
			  		}
					
			  		setTimeout(()=>{
						this.loading = false;
					},1400)
			  		
		
				  }).catch((error)=>{
					setTimeout(()=>{
						this.loading = false;
					},1400)
	       			error.msg?Toast(error.msg):''
	       		})
		},

		}
	}
</script>

<style lang="scss">
	.withdraw-wrap {
		background: #f5f5f5;
		.tips {
			color: #dd0202;
			padding: 0.25rem 0.2rem;
			font-size: 0.22rem;
			/*background: #fff;*/

			.iconfont {
				font-size: 0.3rem;
				margin-right: 0.05rem;
			}
			p {
				line-height: 0.42rem;
			}
		}
		.recharge-text {
			padding: 0.22rem 0.2rem 0 0.2rem;
			background: #fff;
			font-size: 0.26rem;
		}
		.van-action-sheet {
			max-height: 40%!important;
		}
		.van-cell {
			padding: 0.24rem 0.24rem 0.24rem 0.24rem;
			font-size: 0.26rem;
			.van-cell__title {
				width: 3rem;
			}
		}
		.setting-bottom {
			text-align: center;
			margin: 0.7rem 0.8rem 0 0.8rem;
			.van-button--danger {
				width:100%;
				background-color: #D51B31;
				border: 1px solid #D51B31;
				border-radius: 0.5rem;
			}
		}
		.withdraw-text {
			text-align: center;
			margin: 0.2rem 0;
			color: #dd0202;
			font-size: 0.26rem;
		}
	}
</style>