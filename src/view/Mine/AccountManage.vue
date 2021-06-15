<template>
	<div class="accountManage-wrap">
		<!--收款账户管理-->
		<app-header :title="$store.state.system.webLang.funds_transfer_to_bank_account" v-on:clickLeft="returnBack" :right="false"></app-header>
	
	
	

		
		
		
		
		


	
	
	
		<div class="account-list">
			
			<van-swipe-cell  :before-close="beforeCloseCard" @open="bankCardIndex=index"   v-for="(item,index) in bankCardList"  v-if="bankCardList.length">
				 <!--@touchstart="showDeleteButton(item.id)" @touchend="emptyTime"-->
				<div class="account-block"  @click="selectCardIndex(index)">
					<div class="block-top">
						<div>
							{{item.bank_name}}
						</div>
						<div>
							<img :src="item.bank_logo" />
						</div>
						
					</div>
					<div class="block-center">
						<div class="xing">****</div>
						<div class="xing">****</div> 
						<div class="xing">****</div> 
			       		<div>{{String(item.number).substr(String(item.number).length-4)}}</div>
					</div>
					<div class="block-bottom">
						{{item.name}}
						
					</div>
					
					<i class="iconfont iconxuanze" :class="{'active-select':selectIndex==index}" v-if="$route.query.type=='draw'"></i>
					
					
				</div>
				
				<template #right >
					<i class="iconfont iconshanchu"></i>
					<p>{{$store.state.system.webLang.Delete}}</p>
			  	</template>
	   
			</van-swipe-cell>	
		  
		</div>
		
		
		<!--v-if="bankCardList.length<3"-->
		
		<div class="add-btn" @click="openDraw" >
			<i class="iconfont iconjiahao"></i>
		</div>
		
		<p class="add-tips">{{$store.state.system.webLang.max_for_3_bank}}</p>
		
		
		
		
		<!--添加收款账户-->
			<!--<van-dialog class="draw-dialog" v-model="showDraw" title="Add bank account for withdrawal" :closeOnClickOverlay="true" :before-close="beforeClose"  @cancel="showDraw=false" @confirm="cardsCreate" show-cancel-button>
		 		
		 		<div class="draw-wrap">
		 			<div class="draw-block">
			 			<p class="block-title">Please select the bank or E-wallet </p>
	
			 			<select @change="selectBank($event)" >
			 				<option v-for="(item,index) in bankList"  :value='index'>{{item.name}}</option>
			 			</select>
			 		</div>
			 		<div class="draw-block">
			 			<p class="block-title">Please enter valid bank account number </p>
			 			<input v-model="numbers" type="text" />
			 		</div>
			 		<div class="draw-block">
			 			<p class="block-title">Please enter the name of bank account holder</p>
			 			<input v-model="name"  type="text" />
			 		</div>
			 		
			 		<div class="draw-tips">Please make sure the banking details is correct</div>
		 		</div>
		 		
			</van-dialog>
		-->
		
		<!--添加收款账户-->
		
		
		
		
		<van-dialog class="draw-dialog" v-model="showInput" :closeOnClickOverlay="true" :title="getTime(getSecond)"    @confirm="closeDialog" :confirmButtonText="$store.state.system.webLang.cancel">
		 		
		 		<van-password-input
		  :value="verifyCode"
		  :focused="showKeyboard = true"
		  :mask="false"
		  :length="4"
			v-if="showInput"
		  @focus="showKeyboard = true"
		  :gutter="25"
		/>
		 		
			</van-dialog>
			
		
		<!-- 数字键盘 -->
		<van-number-keyboard
		  :show="showKeyboard"
		  @input="onInput"
		  @delete="onDelete"
		  @blur="showKeyboard = false"
		/>
		
	
		
		
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
				showDraw:false,
				numbers:'',
				name:'',
				bankList:[],
				defaultBank:'',
				bankIndex:0,
				bankCardList:[],
				Loop:null,
				showInput:false,
				showKeyboard:false,
				verifyCode:'',
				bankCardIndex:null,
				getSecond:0,
				selectIndex:null,//选择的银行卡下标
				
				
			}
		},
		components: {
			AppHeader
		},
		computed: {
			userInfo() {
				return this.$store.state.user.info;
			}
		},
		watch:{
			
		},
		activated() {
			window.scrollTo(0,0);
			this.cardsGet();
			this.cardsBanks();
			this.$store.dispatch(types.GET_USER_INFO);
		},
		deactivated() {
			this.showDraw = false;
			this.numbers = '';
			this.name = '';
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			selectCardIndex(index){
				console.log(this.bankCardList[index])
				this.selectIndex = index
				this.$router.push({name:'withdraw',query:{id:this.bankCardList[index].id}})
			},
			openDraw() {
				this.$router.push('/addBankCard')
//				this.showDraw=true;
			},
			selectBank(event) {
				this.bankIndex = event.target.value
				console.log(this.bankIndex)
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
			//获取银行卡列表
			cardsGet() {


				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token')
				}
	
				  axios.post(globals.api.cardsGet,params)
				  .then(res => {
				  		console.log(res.data.data)
				  		this.bankCardList = res.data.data
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			//添加银行卡
			cardsCreate() {
				if(!this.numbers) {
					Toast('Please enter valid bank account number')
					return
				}
				if(!this.name) {
					Toast('Please enter the name of bank account holder')
					return
				}
				
				if(!clickBol) {
					return
				}
				clickBol = false;
				setTimeout(() => {
					clickBol = true;
				}, 1000)
				
				
				Dialog.confirm({
				  	title: this.$store.state.system.webLang.tips_text,
				  	message: 'Please make sure the banking details is correct'
				}).then(() => {
				  	var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					bank_id:this.bankList[this.bankIndex].id,
					numbers:this.numbers,
					name:this.name
					
				}
	
				  axios.post(globals.api.cardsCreate,params)
				  .then(res => {
				  		console.log(res.data.data)
				  		if(res.data.code==200) {
				  			this.showDraw = false;
				  			this.cardsGet();
				  			this.numbers = '';
							this.name = '';
							Toast.success(this.$store.state.system.webLang.success_text)
				  		}else {
				  			Toast(res.data.msg)
				  		}
				  		
				  		
				  		
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
				}).catch(() => {
				  // on cancel
				})
				
				
				
				
				
			},
			beforeClose(action, done) {
				if(action=='confirm') {
					done(false) 
				}else {
					done()
				}
			},
			showDeleteButton(id) {

					clearTimeout(this.Loop); //再次清空定时器，防止重复注册定时器
				    this.Loop = setTimeout(function() {
				        Dialog.confirm({
						  title: this.$store.state.system.webLang.tips_text,
						  message: 'Delete the bank card?'
						}).then(() => {
						  this.cardsDelete(id)
						});
				    }.bind(this), 700);
			
			    
			},
			//清空
			emptyTime() {
			    clearTimeout(this.Loop); //清空定时器，防止重复注册定时器
			},
			//删除银行卡
			cardsDelete(id) {

				
				
				
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					id:id
					
				}
	
				  axios.post(globals.api.cardsDelete,params)
				  .then(res => {
				  		console.log(res.data.data)
				  		if(res.data.code==200) {
				  			this.cardsGet()
				  			Toast.success(this.$store.state.system.webLang.success_text)
				  		}else {
				  			Toast(res.data.msg)
				  		}
				  		
				  		
				  		
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
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
		    closeDialog() {
				this.showInput = false;
				this.showKeyboard = false;
			},
			onInput(key) {
		      this.verifyCode = (this.verifyCode + key).slice(0, 4);
		      console.log(this.verifyCode)
		      if(this.verifyCode.length==4) {
		      	var params = {
		      		UserId:localStorage.getItem('userId'),
					UserToken:localStorage.getItem('token'),
		      		id: this.bankCardList[this.bankCardIndex].id,
					captcha: this.verifyCode
				}
	
				  axios.post(globals.api.deleteCardsCheckCaptcha,params)
				  .then(res => {
//				  		Toast(res.data.msg)
				  		if(res.data.code==200) {
				  			this.cardsGet()
							Toast.success(this.$store.state.system.webLang.success_text)
						  
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
			 beforeCloseCard({ position, instance }) {
			 	
			 	if(this.userInfo.mobile=='') {
		          	Dialog.confirm({
			            message: 'Please link your mobile number',
			        }).then(() => {
			          	this.$router.push('/bindMobile')
			          	instance.close();
			        });
	          		return
	          	}
			 	
			 	
		      switch (position) {
		        case 'left':
		        case 'cell':
		        case 'outside':
		          instance.close();
		          break;
		        case 'right':
		          Dialog.confirm({
		            message: 'Delete the bank card?',
		          }).then(() => {
		          	console.log(this.bankCardIndex)
		          	
		          	
		          	
		          	
		          	
		   
		          	var params = {
			      		mobile: this.userInfo.mobile,
						action: 'unbind_sms'
					}
	
				  axios.post(globals.api.getSmsCaptcha,params)
				  .then(res => {
				  		if(res.data.code==200) {
				  			console.log(res)
				  			this.showInput = true;
				  			
				  			var localTime = new Date().getTime();
							var intervalTime = 300;
							this.getSecond = intervalTime;
							clearInterval(timer);
							var timer = setInterval(() => {
								this.getSecond = intervalTime - parseInt((new Date().getTime() - localTime) / 1000);
								if(this.getSecond <= 0) {
									this.closeDialog();
									clearInterval(timer);
								}
							}, 1000)
				  		}else {
				  			
				  			Toast(res.data.msg)
				  		}
				  
			
					  }).catch((error)=>{
				
		       			error.msg?Toast(error.msg):''
		       		})
		          	
		          	
		            instance.close();
		          });
		          break;
		      }
		    },
		    deleteCards(item) {
		    	Dialog.confirm({
		            message: 'Delete the bank card?',
		          }).then(() => {
		          	console.log(item)
		          	
		          
		           
		           
//		           
//		           
		           
		           
		           
		           
		           
		           
		        });
		    	
		    }
		}
	}
</script>

<style lang="scss">
	.accountManage-wrap {
		background: #F7F6FB;
		min-height: 100vh;
		padding-bottom: 1rem;
		.account-list {
			padding: 0.4rem 0.3rem 0 0.3rem;
			.van-swipe-cell__right {
				background: #D51B31;
				color: #fff;
				display: inline-block;
				padding: 15% 0.3rem 0 0.3rem;
				font-size: 0.26rem;
				text-align: center;
				border-radius: 0.1rem;
				.iconfont {
					color: #fff;
				}
			}
			.account-block {
				width: 100%;
				height: 3rem;
				background:rgba(35,60,103,1);
				box-shadow:0px 3px 6px 0px rgba(20,36,65,0.08);
				border-radius:0.16rem;
				padding: 0.4rem 0.5rem;
				margin-bottom: 0.3rem;
				position: relative;
				.block-top {
					display:flex;
					font-size: 0.3rem;
					color: #e1e1e1;
					div:nth-of-type(2) {
						flex: 1;
						text-align: right;
						img {
							width: 0.8rem;
						}
					}

				}
				.block-center {
					font-size: 0.44rem;
					color: #fff;
					display: flex;
					margin: 0.3rem 0 0.2rem 0;
					.xing {
						margin-right: 0.27rem;
					}
				}
				.block-bottom {
					font-size: 0.3rem;
					color: #abb4c4;
				}
				.iconxuanze {
					position: absolute;
					right: 0.3rem;
					bottom: 0.3rem;
					color: gray;
					font-size: 0.42rem;
				}
				.active-select {
					color: #65c61c;
				}
			}
			.account-block:nth-of-type(2) {
				background:#4D4C53;
			}
			.account-block:nth-of-type(3) {
				background:#A13FE2;
			}
		}
		.add-tips {
			color: #999;
			font-size: 0.23rem;
			margin: 0.2rem 0.35rem;
		}
		.add-btn {
			background: #fff;
			height: 3rem;
			box-shadow:0px 3px 6px 0px rgba(84,105,119,0.05);
			border-radius:0.16rem;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 0.3rem 0 0.3rem;
			.iconfont {
				font-size: 0.78rem;
				color: #CDCDCF;
			}
		}
		
		
		//提现框
    .draw-dialog {
        background-color:rgba(252,252,252,0.9)!important;
        border-radius:12px;
        .van-dialog__header {
            font-weight: bold;
        }
        .van-button {
            background:rgba(252,252,252,0)!important;
        }
        .van-dialog__footer--buttons {
            border-top: 1px solid #D6D3D7;
        }
       .draw-wrap {
            padding: 0 0.3rem;
            .draw-block {
                margin-top: 0.15rem;
                .block-title {
                    font-size: 0.22rem;
                    color: #6C6C6C;
                    margin-bottom: 0.05rem;
                }
                input {
                    background:rgba(255,255,255,1);
                    border:1px solid #cac8c8;
                    height: 0.54rem;
                    width: 100%;
                    padding: 0 0.13rem;
                    font-size: 0.26rem;
                }
                select {
                	width: 100%;
                	height: 0.54rem;
                	font-size: 0.26rem;
                	background: #fff;
                }
            }
            .draw-tips {
                margin: 0.2rem 0 0.3rem 0;
                font-size: 0.22rem;
                color: rgba(3,3,3,0.49);
            }
        } 
    }
	    .van-number-keyboard {
	    	z-index: 999999!important;
	    }
	    .van-password-input {
	//      position: absolute;
	//      width: 90%;
	//      top: 25%;
	//      left: 5%;
	//      margin: 0;
	        z-index: 1111111111;
	        margin: 0.3rem 0.4rem 0.5rem 0.4rem;
	        .van-password-input__security li {
	            border-radius: 4px;
	            border: 1px solid #333;
	        }
	    }
	    .van-password-input__info {
	        color: #fff;
	    }
	}
</style>