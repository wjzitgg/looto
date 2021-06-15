<template>
	<div class="addBankCard-wrap page-wrap">
	
		<app-header :title="$store.state.system.webLang.add_bank_account_for_withdrawal" v-on:clickLeft="returnBack" :right="false"></app-header>
	
		<div class="recharge-text">{{$store.state.system.webLang.please_select_the_bank}}</div>
		<van-cell is-link @click="showSelectBank=true">
			<div v-if="bankDetail"><img :src="bankDetail.logo"/> {{bankDetail.name}}</div>
			<div v-else></div>
		</van-cell>

		<div v-if="codePay" class="recharge-text">{{$store.state.system.webLang.please_enter_vaild_bank_code_number}}</div>
		 <van-field
		 		v-if="codePay"
		    v-model="code"
		    label=""
		  />
		  
		  <div class="recharge-text">{{numbersText}}</div>
		 <van-field
		    v-model="numbers"
		    label=""

		  />
		  
		  
		  <div class="recharge-text">{{nameText}}</div>
		 <van-field
		    v-model="name"
		    label=""

		  />
		
		
		
		
		
		
		<div class="setting-bottom">
			<van-button   type="danger"  :loading="loading" @click="cardsCreate">{{$store.state.system.webLang.Submit}}</van-button>
		</div>
		
		
		
		<van-action-sheet v-model="showSelectBank" :title="$store.state.system.webLang.please_select_the_bank">
			
			<div class="content">
			  	<div v-for="(item,index) in bankList" @click="selectBank(index)" :key="index" :class="{'active-select':bankIndex==index}">
			  		<img :src="item.logo"/> {{item.name}}
			  	</div>
			  	
			</div>
		</van-action-sheet>
		
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
				bankList:[],//银行列表
				bankDetail:{},
				bankIndex:null,
				showSelectBank:false,
				activeIds: [],
			    activeIndex: 0,
				showPayTypeList:false,
				rechargeAmount:'',//充值金额
				rechargeName:'',//姓名
				mobileNo:'',
				email:'',
				payTypeList:[],//支付方式列表
				payIndex:'',
				payTypeName:'',
				loading:false,
				code:'',//银行编号，钱包时可以为空
				numbers:'',//银行卡号
				name:'',//银行卡姓名
				codePay: true,
				numbersText:this.$store.state.system.webLang.please_enter_vaild_bank_account_number,
				nameText:this.$store.state.system.webLang.please_enter_the_name_of_bank_account_holder
				
				
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

		},
		activated() {
			this.cardsBanks();//获取银行列表

		},
		deactivated() {
			this.showPayTypeList = false;
			
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			selectBank(index) {
				console.log(index)
				if(index == 0 || index == 1) {
					this.codePay = false;
					this.numbersText = "Please enter valid E-wallet account"
					this.nameText = "Please enter the name of E-wallet account holder"
					
				} else {
					this.numbersText = this.$store.state.system.webLang.please_enter_vaild_bank_account_number
					this.nameText = this.$store.state.system.webLang.please_enter_the_name_of_bank_account_holder
					this.codePay = true;
				}
				this.bankIndex = index;
				this.bankDetail = this.bankList[index];
				this.showSelectBank = false;
			},
			//获取银行列表
			cardsBanks() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token')
				}
	
				  axios.post(globals.api.cardsBanks,params)
				  .then(res => {
				  	
				  		
				  		
						this.bankList = res.data.data
							console.log(this.bankList)
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			//添加银行卡
			cardsCreate() {
				if(!this.bankDetail) {
					Toast(this.$store.state.system.webLang.please_select_the_bank)
					return
				}
				// if(!this.code) {
				// 	Toast(this.$store.state.system.webLang.please_enter_vaild_bank_code_number)
				// 	return
				// }
				if(!this.numbers) {
					Toast(this.$store.state.system.webLang.please_enter_vaild_bank_account_number)
					return
				}
				if(!this.name) {
					Toast(this.$store.state.system.webLang.please_enter_the_name_of_bank_account_holder)
					return
				}
				
				
				
				
				Dialog.confirm({
				  	title: this.$store.state.system.webLang.tips_text,
				  	message: this.$store.state.system.webLang.please_make_sure_correct
				}).then(() => {
				  	var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					code:this.code,
					bank_id:this.bankDetail.id,
					numbers:this.numbers,
					name:this.name
				}
				  	
				  	this.loading = true;
	
				  axios.post(globals.api.cardsCreate,params)
				  .then(res => {
				  		console.log(res.data.data)
				  		if(res.data.code==200) {
				  	
				  			setTimeout(()=>{
								this.loading = false;
							},1500)
				  			this.code = '';
				  			this.numbers = '';
							this.name = '';
							Toast.success(this.$store.state.system.webLang.success_text)
							
							
							if(res.data.data.is_first_bind=='Y') {
								//首次绑定
								Dialog.alert({
								  title: this.$store.state.system.webLang.tips_text,
								  message: res.data.msg
								}).then(() => {
								  this.$router.push('/lottery')
								})
							}else {
								this.$router.go(-1) 
							}
							
							
							
							
							
				  		}else {
				  			Toast(res.data.msg)
				  			setTimeout(()=>{
								this.loading = false;
							},1500)
				  		}
				  		
				  		
				  		
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
				}).catch(() => {
				  // on cancel
				})
				
				
				
				
				
			},

		}
	}
</script>

<style lang="scss">
	.addBankCard-wrap {
		background: #f5f5f5;
		.recharge-text {
			padding: 0.22rem 0.2rem 0 0.2rem;
			background: #fff;
			font-size: 0.26rem;
		}
		.van-cell__value {
			display: flex;
			align-items: center;
			img {
				width: 0.55rem;
				margin-right: 0.13rem;
			}
		}
		.van-action-sheet {
			max-height: 40%!important;
		}
		.van-cell {
			padding: 0.24rem 0.24rem 0.24rem 0.24rem;
			font-size: 0.26rem;
		}
		.setting-bottom {
			text-align: center;
			margin: 1rem 0.8rem 0 0.8rem;
			.van-button--danger {
				width:100%;
				background-color: #D51B31;
				border: 1px solid #D51B31;
				border-radius: 0.5rem;
			}
		}
		
		.van-action-sheet__content {
			.content {
				div {
					padding: 0.2rem 0.2rem 0.2rem 0.6rem;
					border-top: 1px solid #f4f3f3;
					display: flex;
					align-items: center;
					img {
						width: 0.55rem;
						margin-right: 0.16rem;
					}
				}
				.active-select {
					color: red;
				}
				
			}
		}
	}
</style>