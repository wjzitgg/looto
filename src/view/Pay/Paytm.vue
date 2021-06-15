<template>
	<div class="paytm-wrap page-wrap">
		<!--
        	作者：550243308@qq.com
        	时间：2020-08-15
        	描述：paytm
        -->
        
        
        
        
        <app-header :title="$store.state.system.webLang.deposit" v-on:clickLeft="returnBack" :right="true">
        	<template slot="right">
				<img src="../../assets/images/mine/kefu@2x.png" @click="showKefu=true"/>
                <span  @click="showKefu=true">FAQ</span>
		    </template>
        </app-header>
        
        
        
		<div class="setting-content">
			
			<div class="paytm-tips">
				<p><i class="iconfont iconinfo"></i> Notice</p>
				<p  v-if="!timeEnd">Please deposit the exact amount above includes the two decimal places figure in request times.
	</p>
				<p v-else>The transfer validity period has expired, if the transfer has been made but no deposit, please contact customer service</p>
			</div>
		
			
			<!--<div class="setting-top-text">充值信息</div>-->
			
			<div class="block clip-btn" :data-clipboard-text="userInfo.nickname">
				<span>{{$store.state.system.webLang.account}}</span>
				<span v-if="userInfo.nickname">{{userInfo.nickname}} <i class="iconfont iconcopy" ></i></span>
			</div>
			
			<div class="block clip-btn" :data-clipboard-text="depositInfo.paytmAccount">
				<span>Deposit to PayTM account</span>
				<span v-if="depositInfo.paytmAccount">{{depositInfo.paytmAccount}} <i class="iconfont iconcopy" ></i></span>
			</div>
			
			<div class="block clip-btn" :data-clipboard-text="depositInfo.amount">
				<span>{{$store.state.system.webLang.deposit_amount}}</span>
				<span v-if="depositInfo.amount">{{depositInfo.amount}} <i class="iconfont iconcopy" ></i></span>
			</div>
			
			<div class="block"  v-if="countDownTime.min">
				<span>Remaining time to complete</span>
				<span>{{countDownTime.min}}:{{countDownTime.sec}}</span>
			</div>
			
			<!--<div class="paytm-time">
				<span>剩余转账时间</span>
				<span></span>
			</div>-->
		</div>
		
		
		
		<!---->
		
		<div class="setting-content setting-contentA" v-if="depositInfo.qrCode">
			
			
			<img :src="depositInfo.qrCode" class="qrCode-img" @click="openImg"/>
			<div class="setting-top-text">PayTM Receiving Code</div>
				
			
			<div class="paytm-btn">
				<span>
					<a href="https://m.p-y.tm/minkyc">PayTM Now</a>
				</span>
			</div>
			
		</div>	
		<van-loading size="24px" v-else>{{$store.state.system.webLang.loading_text}}...</van-loading>
		
		
		<van-image-preview
		  v-model="showImg"
		  :images="dataURL"
		  closeOnPopstate
		>
		</van-image-preview>
		
		<div class="pop-up-bg" v-if="showKefu" @click="closeBg"></div>
		  	<transition name="slide-popupShow"> 
	
	
			  
			  
			  <!--客服-->
			  <div class="pay-pwd-wrap"  v-if="showKefu">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.please_contact_service}}</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn  clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile" @click="closeBg">
						{{$store.state.system.webLang.copy}}
			        </van-button>
			        <!--<van-button type="primary" class="pay-submit-btn">-->
			
			         <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share"  @click="closeBg">{{$store.state.system.webLang.message_now}}</a>
			        <!--</van-button>-->
			       
			      </div>
			      
			  </div>
			  <!--客服-->
			  
			  
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
				depositInfo:{
					account:'',
					paytmAccount:'',
					amount:0,
					qrCode:''
				},
				sysTime:0,//系统时间
				paytmTimer:null,
				countDownTime:{},
				showImg:false,
				dataURL:[],
				timeEnd:false,
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
		watch:{
			
		},
		mounted() {
			var clipboard = new ClipboardJS('.clip-btn');
			clipboard.on('success', () => {
				Toast.success(this.$store.state.system.webLang.already_copied);
			})
		},
		activated() {
			this.createPaytmOrder();
		},
		deactivated() {
			this.showImg = false;
			this.timeEnd = false;
			this.showKefu = false;
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			closeBg() {

				this.showKefu = false;
		},
			openImg() {
				this.dataURL.push(this.depositInfo.qrCode)
				this.showImg = true;
			},
			createPaytmOrder() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					client:'android',
					amount:this.$route.query.amount
				}

			  axios.post(globals.api.createPaytmOrder,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		var data = res.data.data;
			  		this.depositInfo.paytmAccount = data.paytm_account;
			  		this.depositInfo.amount = data.amount/100;
			  		this.depositInfo.qrCode = data.paytm_qrcode;
			  		this.countDown();
			  		
		
				  }).catch((error)=>{
		
	       			error.msg?Toast(error.msg):''
	       		})

			},
			//获取服务器时间
			getSystemTime() {
				axios.post(globals.api.systemTime).then((res)=>{
					

	
					clearInterval(this.systemTimer)
		
					var systemTime = new Date((res.data.data).replace(/-/g,'/')).getTime()
					this.sysTime = systemTime;
					this.systemTimer = setInterval(()=>{
						systemTime+=1000;
						this.sysTime = systemTime;
	//					console.log(this.sysTime)
					},1000)
	
	
					
				
				
					
					
					
					
					
					
				}).catch((error)=>{})
			},
			timeFormat(param) {//小于10的格式化函数
			    return param < 10 ? '0' + param : param;
			},
			countDown() {
				 clearInterval(this.paytmTimer)
				    var temp = 15*60;
				    var a = 0;
			    this.paytmTimer = setInterval(()=>{
			    	
			    	a+=1;
			    	var time = temp-a;
			    	let day = parseInt(time / (60 * 60 * 24));
				        let hou = parseInt(time % (60 * 60 * 24) / 3600);
				        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
				        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
				        let datTyemp = this.timeFormat(day, 1) == '0' ? '' : this.timeFormat(day, 1) + '天 ';
				        var obj = {
				          	day: this.timeFormat(day),
				          	hou: Number(this.timeFormat(day))>=1?Number(this.timeFormat(hou))+Number(this.timeFormat(day))*24:this.timeFormat(hou),
				          	min: this.timeFormat(min),
				          	sec: this.timeFormat(sec)
				    	}
				        
				        if(min=='00'&&sec=='00') {
				        	clearInterval(this.paytmTimer);
				        	this.timeEnd = true;
				        }
				        
				         this.countDownTime = obj;
				      
			    },1000)
			},
			activityCountDown() {
				var _this = this;
				let newTime = this.sysTime;
//				console.log(new Date(newTime))
			    clearInterval(this.paytmTimer)
				    
			    this.paytmTimer = setInterval(()=>{
			    	newTime += 1000;
			      	let endTime = this.lottery_time;
//			 console.log(endTime)
			     
				    let obj = null;
				    let objStatus = null;
				    // console.log(this.data.phaseDetail.startTime,newTime)
					 if (endTime - newTime > 0) {
				   
			        	objStatus = null;
				        let time = (endTime - newTime) / 1000;
				        // 获取天、时、分、秒
				        let day = parseInt(time / (60 * 60 * 24));
				        let hou = parseInt(time % (60 * 60 * 24) / 3600);
				        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
				        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
				        let datTyemp = this.timeFormat(day, 1) == '0' ? '' : this.timeFormat(day, 1) + '天 '
				        obj = {
				          	day: this.timeFormat(day),
				          	hou: Number(this.timeFormat(day))>=1?Number(this.timeFormat(hou))+Number(this.timeFormat(day))*24:this.timeFormat(hou),
				          	min: this.timeFormat(min),
				          	sec: this.timeFormat(sec)
				    	}
			      	} else {//活动已结束，全部设置为'00'
			        	obj = '';
			        	objStatus = null;
			        	
			        
					        	
			     
				}
				        this.countDownTime = obj;
//				        console.log(this.countDownTime)
				 
				    },1000)
			},
			
			
			
		}
	}
</script>

<style lang="scss">
	.paytm-wrap {
		background: #f5f5f5;
		.setting-content {
			background: #fff;
			
			position: relative;
			
		
			.block {
				display: flex;
				align-items: center;
				border-bottom: 1px solid #EDEDED;
				padding: 0.25rem;
				.iconxiangyou {
					color: #c9c5c5;
					font-size: 0.32rem;
					margin-left: 0.1rem;
				}
				.icontouxiang {
					font-size: 0.9rem;
					color: #B4B2B2;
				}
				img {
					width: 0.9rem;
					height: 0.9rem;
					border-radius: 50%;
				}
				span {
					flex: 2;	
				}
				span:nth-of-type(2) {
					text-align: right;
					color: gray;
					flex: 1;
				}
				/*.red {
					color: red!important;
				}*/
			}
			.block:nth-last-of-type(1) {
				border-bottom: 0!important;
			}
			
			.paytm-time {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #fff;
				padding: 0.15rem 0.25rem;
				position: relative;
				span:nth-of-type(1) {
					position: absolute;
					left: 0.25rem;
				}
				span:nth-of-type(2) {
					color: red;
					font-size: 0.46rem;
				}
			}
		}
		
		.paytm-tips {
			/*background: red;*/
			color: red;
			border-radius: 0.05rem;
			padding: 0.2rem 0.2rem;
	
			p:nth-of-type(1) {
				position:relative;
				padding-left: 0.42rem;
				font-weight:600;
				.iconfont {
					font-size: 0.36rem;
					position: absolute;
					left: 0;
					font-weight: normal;
				}
			}
			p:nth-of-type(2) {
				font-size: 0.26rem;
				padding-left: 0.42rem;
			}
		}
		
		.setting-contentA {
			/*border: 1px dotted #bcb9b9;*/
			margin:0.6rem auto;
			padding:0.3rem 0 0.3rem 0;
			text-align: center;
			width: 4rem;
			.setting-top-text {
				font-size: 0.26rem;
				/*position: absolute;
				top: -0.2rem;
				left: 40%;
				background: #fff;
				padding: 0 0.2rem;
				font-size: 0.3rem;
				font-weight: 600;*/
			}
			.qrCode-img {
				width: 3.4rem;
				height: 3.4rem;
			}
			.paytm-btn {
				margin-top: 0.7rem;
				margin-bottom: 0.15rem;
				span {
					color: #fff;
					background: red;
					padding: 0.15rem 0.7rem;
					border-radius: 0.05rem;
					font-size: 0.26rem;
					a {
						color: #fff;
					}
				}
				
			}
			
		}
		
		.van-loading {
			text-align: center;
			margin: 1.5rem 0;
		}
		
		
	}
</style>