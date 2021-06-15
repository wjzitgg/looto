<template>
	<div class="recahrge-wrap page-wrap">
	
		<app-header :title="$store.state.system.webLang.deposit" v-on:clickLeft="returnBack" :right="false"></app-header>
		
		<!-- <div class="recharge-text" v-if="$route.query.index==2">Payment methods</div>
		 <van-field
		    v-model="payTypeName"
		    label=""
		    
		    placeholder="Please select payment method"
		    readonly
		    right-icon="arrow"
		    @click="showPayTypeList=true"
		    v-if="$route.query.index==2"
		  /> -->
	
		<div class="recharge-text">{{$store.state.system.webLang.deposit}}</div>
		<!--<van-field v-model="rechargeAmount" clearable type="digit" label="" disabled placeholder="Please select deposit amount"/>-->
		
		<div class="recharge-list">
			<div v-for="(item,index) in rechargeList" :key="index" class="list-block" @click="rechargeIndex=index" :class="{'active':rechargeIndex==index,'guideActive':$store.state.system.guideType==5&&$store.state.system.guideIndex==4&&index==0}">
				<p>Rs.{{item}}</p>
			</div>
		</div>
			<div v-if="$route.query.index==2">
				<van-field
					v-model="userName"
					placeholder="Please type in your name"
					
				/>
				<van-field
					v-model="phoneNumber"
					type="number"
					placeholder="Please enter your mobile phone number"
					
				/>
				<van-field
					v-model="email22 "
					type="E-mail address "
					placeholder="Please enter email address"
				/>
		</div>
		<div class="note-wrap">
			<span>{{$store.state.system.webLang.note}}:</span> {{$store.state.system.webLang.recharge_note}}
		</div>
		
		<div class="setting-bottom" v-if="$route.query.index==2">
			<van-button   type="danger"  :loading="loading" @click="createWebOrder2">{{$store.state.system.webLang.Next}}</van-button>
		</div>

	
		
		<div class="setting-bottom" v-if="$route.query.index==1" >
			<van-button   type="danger" :class="{'guideActive':$store.state.system.guideType==5&&$store.state.system.guideIndex==5}"  :loading="loading" @click="createrazorpay">{{$store.state.system.webLang.Next}}</van-button>
		</div>
		
		

			<van-action-sheet v-model="showPayTypeList" title="Select Pay Method" :actions="payTypeList" @select="onSelectType" @cancel="onCancelType" :cancel-text="$store.state.system.webLang.cancel"/>
	
	
		<div style="display:none;" id="hftx"></div>
		
		
		<van-overlay :show="$store.state.system.showGuide&&$store.state.system.guideType==5" lock-scroll class="guide-overlay"/>	
			<!--充值引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==5" @click="stopKeyBoaddText">
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
	var clickBol = true;
	
	export default {
		data() {
			return { 
				rechargeList:[100,500,1000,5000,10000,50000],
				rechargeIndex:0,//选择下标
				showPayTypeList:false,
				rechargeAmount:'',//充值金额
				rechargeName:'',//姓名
				mobileNo:'',
				email:'',
				payTypeList:[],//支付方式列表
				payIndex:'',
				payTypeName:'',//Paytm
				loading:false,
				biz_type:'',
				userName:'',
				phoneNumber:this.$store.state.user.info.mobile,
				email22:this.$store.state.user.info.email,
				
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
			rechargeIndex(val) {
				this.rechargeAmount = this.rechargeList[val]
			}
		},
		mounted() {
		
			var clipboard = new ClipboardJS('.clip-btn');
			clipboard.on('success', () => {
				Toast.success(this.$store.state.system.webLang.already_copied);
			})
		},
		activated() {
			this.showPayTypeList = false;
			if(this.$route.query.index==2) {
				this.getBizTypes();//支付方式列表
			}
			
			this.rechargeAmount = this.rechargeList[this.rechargeIndex]
	
			if(this.$store.state.system.guideType==5&&this.$store.state.system.guideIndex==4&&this.$store.state.system.showGuide) {
				//充值引导
				this.$store.dispatch(types.KEYBOARD_TEXT);//键盘文字效果
			}
			
		
		},
		deactivated() {
			this.showPayTypeList = false;

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
			stopKeyBoaddText() {
				this.$store.dispatch(types.STOP_KEYBOARD_TEXT) 
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
				  		for(let i = 0;i<this.payTypeList.length;i++) {
							if(this.payTypeList[i].type=='ca001') {
								this.payIndex = i;
								this.biz_type = this.payTypeList[i].type
								this.payTypeName = this.payTypeList[i].name
								this.payTypeList[i].color = '#6173D5'
							}
							
						}
					
					  }).catch((error)=>{
						
		       			error.msg?Toast(error.msg):''
		       		})
			},
			onSelectType(item) {
				console.log(this.payTypeList)
				for(let i = 0;i<this.payTypeList.length;i++) {
					this.payTypeList[i].color = '';
						if(this.payTypeList[i].type==item.type) {
							this.payIndex = i;
							this.biz_type = this.payTypeList[i].type
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
			createrazorpay() {
					// console.log(this.rechargeAmount);
				if(this.$store.state.system.guideType==5)return
				if(!this.rechargeAmount) {
					Toast(this.$store.state.system.webLang.enter_the_deposit_amount)
					return
				}
			
				if(this.rechargeAmount<this.$store.state.system.systemInfo.min_recharge_points||this.rechargeAmount>this.$store.state.system.systemInfo.max_recharge_points) {
				
					if(localStorage.getItem('lang')=='hi') {
						Toast('न्यूनतम जमा राशि  '+ this.$store.state.system.systemInfo.min_recharge_points+ '  ​​रुपये और अधिकतम जमा  ' +this.$store.state.system.systemInfo.max_recharge_points+ '  रुपये है')
					}else {

						Toast('Minimum deposit of Rs.'+this.$store.state.system.systemInfo.min_recharge_points+', maximum deposit of Rs.'+this.$store.state.system.systemInfo.max_recharge_points)
					}
					return
				}
				
				
				this.loading = true;
				var backUrl = window.location.href.substring(0,window.location.href.indexOf("#"))+'#/rechargeSelect'
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					client:'h5',
					amount: this.rechargeAmount
				}
	
				  axios.post(globals.api.createOrder,params)
				  .then(res => {
				  		// console.log(res.data.data)
				  		var data = res.data.data;
				  		
				  		
				  		window.location.href = data.pay_url+'&callback='+backUrl
				  	
//				  		var options = {
//						    "key": data.key, // Enter the Key ID generated from the Dashboard
//						    "amount": data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//						    "currency": data.currency,
//						    "name": "Acme Corp",
//						    "description": "Test Transaction",
//						    "image": "https://example.com/your_logo",
//						    "order_id": data.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
//						    "handler": function (response){
//						    	
//						    	
//						    	
//						    	
//						    	var params = {
//									UserId: localStorage.getItem('userId'),
//									UserToken: localStorage.getItem('token'),
//									payment_id:response.razorpay_payment_id,
//									order_id: response.razorpay_order_id,
//									signature: response.razorpay_signature
//						
//								}
//					
//							  	axios.post(globals.api.checkOrder,params)
//							  	.then(res => {
//							  		console.log(res)
//							  
//							  	}).catch((error)=>{
//						
//					       			error.msg?Toast(error.msg):''
//					       		})
//						    	
//						    	
//						    	
//						    	
////						        alert(response.razorpay_payment_id);
////						        alert(response.razorpay_order_id);
////						        alert(response.razorpay_signature)
//						    },
////						    "prefill": {
////						        "name": "Gaurav Kumar",
////						        "email": "gaurav.kumar@example.com",
////						        "contact": "9999999999"
////						    },
//						    "prefill": {
//						        "name": "",
//						        "email": "",
//						        "contact": ""
//						    },
//						    "notes": {
//						        "address": "Razorpay Corporate Office"
//						    },
//						    "theme": {
//						        "color": "#D51B31"
//						    }
//						};
//				  		
//				  		
//				  		
//				  		var rzp1 = new Razorpay(options);
//console.log(rzp1)
//					    rzp1.open();
//					    e.preventDefault();
				  		
				  		
				  		
				  		
				  		
				  		
				  		
				  		setTimeout(()=>{
				  			this.loading = false;
				  		},1500)
				
				
				
				}).catch((error)=>{
						setTimeout(()=>{
				  			this.loading = false;
				  		},1500)
		       			error.msg?Toast(error.msg):''
		       		})
			},
			createWebOrder() {
				
				if(this.biz_type=='') {
					Toast(this.$store.state.system.webLang.select_payment_method)
					return
				}
				
				if(!this.rechargeAmount) {
					Toast(this.$store.state.system.webLang.enter_the_deposit_amount)
					return
				}
				
				
				if(this.rechargeAmount<this.$store.state.system.systemInfo.min_recharge_points||this.rechargeAmount>this.$store.state.system.systemInfo.max_recharge_points) {
					if(localStorage.getItem('lang')=='hi') {
						Toast('न्यूनतम जमा राशि  '+ this.$store.state.system.systemInfo.min_recharge_points+ '  ​​रुपये और अधिकतम जमा  ' +this.$store.state.system.systemInfo.max_recharge_points+ '  रुपये है')
					}else {
						Toast('Minimum deposit of Rs.'+this.$store.state.system.systemInfo.min_recharge_points+', maximum deposit of Rs.'+this.$store.state.system.systemInfo.max_recharge_points)
					}
					return
				}

				
				
				
//				if(!this.rechargeName) {
//					Toast('请输入姓名')
//					return
//				}
//
//				if(!this.mobileNo) {
//					Toast('请输入手机号码')
//					return
//				}
//				var reg = /^(\+?91|0)?[789]\d{9}$/;
//				if(!reg.test(this.mobileNo)) {
//					Toast('请输入正确的手机号码')
//					return
//				}

//				var regA = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
//				if(!this.email||!regA.test(this.email)) {
//					Toast('Please Enter The Valid Email Address')
//					return
//				}



//
//
//
				
//		
//				this.loading = true;
//				
//	
//				
//				var params = {
//					UserId: localStorage.getItem('userId'),
//					UserToken: localStorage.getItem('token'),
//					client:'h5',
//					amount: this.rechargeAmount
//				}
//				
//				
//				 axios.post(globals.api.createOrder,params)
//				  .then(res => {
//					
//				  		var data = res.data.data;
//				  			console.log(data)
//
//				  		var backUrl = window.location.href.substring(0,window.location.href.indexOf("#"))+'#/payStatus'
//
//				
//				  		var div = window.document.getElementById("hftx");
//						div.innerHTML="";
//						var form = window.document.createElement("form");
//						div.appendChild(form);
//						var input1 = window.document.createElement("input");
//						input1.setAttribute("name","amount");
//						input1.setAttribute("value",data.amount);
//						form.appendChild(input1);
//						
//						var input2 = window.document.createElement("input");
//						input2.setAttribute("name","email");
//						input2.setAttribute("value",data.email);
//						form.appendChild(input2);
//						
//						var input3 = window.document.createElement("input");
//						input3.setAttribute("name","mobile");
//						input3.setAttribute("value",data.mobile);
//						form.appendChild(input3);
//						
//						var input4 = window.document.createElement("input");
//						input4.setAttribute("name","nickname");
//						input4.setAttribute("value",data.nickname);
//						form.appendChild(input4);
//						
//						var input5 = window.document.createElement("input");
//						input5.setAttribute("name","user_id");
//						input5.setAttribute("value",localStorage.getItem('userId'));
//						form.appendChild(input5);
//		
//						
//						var input6 = window.document.createElement("input");
//						input6.setAttribute("name","order_id");
//						input6.setAttribute("value",data.order_id);
//						form.appendChild(input6);
//
//						var input7 = window.document.createElement("input");
//						input7.setAttribute("name","callback");
//						input7.setAttribute("value",backUrl);
//						form.appendChild(input7);
//						
//						
//						
//						form.setAttribute("method","post");
//						form.setAttribute("action",data.pay_url);
//						console.log(form)
//				
//						form.submit();
//				  		
//				  	
//			
//						
//				  		
//				  		
//				  		
//				  		
//				  		
//				  		
//				  		
//				  		
//				  		
//				  		
//				  		
//				  		
//				  		
//				  		
//				  		setTimeout(()=>{
//				  			this.loading = false;
//				  		},1500)
//				
//				
//				
//				}).catch((error)=>{
//						setTimeout(()=>{
//				  			this.loading = false;
//				  		},1500)
//		       			error.msg?Toast(error.msg):''
//		       		})
//				
//				
//				
//				
//				
//				
//				
//				
//				
//				
//				return
//				
			
				
			
				this.loading = true;
				
				var backUrl = window.location.href.substring(0,window.location.href.indexOf("#"))+'#/rechargeSelect'
				
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					client:'h5',
					amount: this.rechargeAmount,
					biz_type: this.biz_type,
					call_back_url: backUrl
				}
	
				  axios.post(globals.api.createWebOrder,params)
				  .then(res => {
				  		console.log(res)
				  		setTimeout(()=>{
				  			this.loading = false;
				  		},1500)
				  		
				  		
				  	
				  		
				  		
				  		var data = res.data.data;
				  			var div = window.document.getElementById("hftx");
						div.innerHTML="";
						var form = window.document.createElement("form");
						div.appendChild(form);
						var input1 = window.document.createElement("input");
						input1.setAttribute("name","amount");
						input1.setAttribute("value",data.param.amount);
						form.appendChild(input1);
						
						var input2 = window.document.createElement("input");
						input2.setAttribute("name","appId");
						input2.setAttribute("value",data.param.appId);
						form.appendChild(input2);
						
						var input3 = window.document.createElement("input");
						input3.setAttribute("name","biz");
						input3.setAttribute("value",data.param.biz);
						form.appendChild(input3);
						
						var input4 = window.document.createElement("input");
						input4.setAttribute("name","callBackUrl");
						input4.setAttribute("value",data.param.callBackUrl);
						form.appendChild(input4);
						
						var input5 = window.document.createElement("input");
						input5.setAttribute("name","currencyType");
						input5.setAttribute("value",data.param.currencyType);
						form.appendChild(input5);
						
						var input6 = window.document.createElement("input");
						input6.setAttribute("name","goods");
						input6.setAttribute("value",data.param.goods);
						form.appendChild(input6);
						
						var input7 = window.document.createElement("input");
						input7.setAttribute("name","mchtId");
						input7.setAttribute("value",data.param.mchtId);
						form.appendChild(input7);
						
						var input8 = window.document.createElement("input");
						input8.setAttribute("name","notifyUrl");
						input8.setAttribute("value",data.param.notifyUrl);
						form.appendChild(input8);
						
						var input9 = window.document.createElement("input");
						input9.setAttribute("name","orderId");
						input9.setAttribute("value",data.param.orderId);
						form.appendChild(input9);
						
						var input10 = window.document.createElement("input");
						input10.setAttribute("name","orderTime");
						input10.setAttribute("value",data.param.orderTime);
						form.appendChild(input10);
						
						var input11 = window.document.createElement("input");
						input11.setAttribute("name","sign");
						input11.setAttribute("value",data.param.sign);
						form.appendChild(input11);
						
						var input12 = window.document.createElement("input");
						input12.setAttribute("name","version");
						input12.setAttribute("value",data.param.version);
						form.appendChild(input12);
						
						
						
						form.setAttribute("method","post");
						form.setAttribute("action",data.pay_url+"");
						form.submit();
				  		console.log(form)
				  		
				  		
				  		
					
					  }).catch((error)=>{
						setTimeout(()=>{
				  			this.loading = false;
				  		},1500)
		       			error.msg?Toast(error.msg):''
		       		})
			},
			createWebOrder2() {
				if(!this.userName){
					Toast('Please type in your name');
					return;
				}
				if(!this.phoneNumber){
					Toast('Please enter your mobile phone number');
					return;
				}
				if(!this.email22){
					Toast('Please enter email address');
					return;
				}
				// console.log(this.$store.state.user.info.mobile);
					this.loading = true;
					var backUrl = window.location.href.substring(0,window.location.href.indexOf("#"))+'#/rechargeSelect'
					var params = {
						UserId: localStorage.getItem('userId'),
						UserToken: localStorage.getItem('token'),
						client:'h5',
						amount: this.rechargeAmount,
						callbackUrl: backUrl,
						userName:this.userName,
						mobile:this.phoneNumber,
						email:this.email22
						// email:this.$store.state.user.info.email
					}
					axios.post(globals.api.createh5Order,params)
					.then(res => {
							console.log(res);
							var data = res.data.data;
				  		window.location.href = data.pay_url+'&callback='+backUrl

							setTimeout(()=>{
				  			this.loading = false;
				  		},1500)
				  	
					})
					.catch((error)=>{
						setTimeout(()=>{
				  			this.loading = false;
				  		},1500)
		       			error.msg?Toast(error.msg):''
		      })
			}

		}
	}
</script>

<style lang="scss">
	.recahrge-wrap {
		background: #f5f5f5;
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
		
		.recharge-list {
				display: flex;
				flex-wrap: wrap;
				background: #fff;
				padding-top: 0.3rem;
				.list-block {
					flex: 0 0 28%;
					border: 1px solid #E2E2E2;
					padding: 0.25rem 0;
					text-align: center;
					border-radius: 4px;
					margin-left: 4%;
					margin-bottom: 0.3rem;
					font-size: 0.26rem;
					transition: all 0.2s;
					p:nth-of-type(2) {
						font-size: 0.25rem;
						color: #999;
					}
				}
				.active {
					border: 1px solid #D51B31;
					background: #D51B31;
					color: #fff;
					p:nth-of-type(2) {
				
						color: #fff;
					}
				}
				.list-block:nth-of-type(3n) {
					margin-right: 4%;
				}
			}
			
			
			.temp-content {
				padding: 0.2rem 0.3rem;
				p {
					line-height: 0.45rem;
				}
				a {
					color: #5672FF;
				}
				p:nth-of-type(3) {
					a {
						text-decoration: underline;
					}
				}
			}
		
		.note-wrap {
			color: red;
			padding: 0.3rem 0.3rem 0 0.3rem;
			font-size: 0.27rem;
			span {
				font-weight: 600;
			}
		}
		
		
		//新手引导
	    .guide-0 {
	        top: 3.5rem;
	        p {
	            height: 0.5rem;
	        }
	        .iconxiangshang {
	            left: 11%;
	            top: -32%;
	        }

	        
	    }
	    .guide-1 {
	        top: 8.2rem;
	        p {
	            height: 1.5rem;
	        }
	        .iconxiangshang {
	            left: 48%;
	            top: -22%;
	        }
	    }
	    .guide-2 {
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
	            bottom: -80%;
	        } 
	    }
	    .guideActive {
	        z-index: 9999999;
	        background: #fff;
	        box-shadow: 0px 0px 5px -1px #d5d5d5;
	    }
		
		
	}
</style>