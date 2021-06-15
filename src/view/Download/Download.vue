<template>
	<!--下载页-->
	<div class="download-wrap page-wrap">
		
		<div class="download-title" :class="{'whiteBg':showHead}">
			<img src="../../assets/images/download/logo@2x.png"/>  Start to win more at FantasyLand
		</div>
		
		
		<a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share" >
			<div class="whatsapp-btn">
				<p><img src="../../assets/images/whatsapp (1).png"/> Click to get </p>
				<p>Rs. 5500 per week!</p>
			</div>
		</a>
		
		
		
		
		
		<!--<van-swipe    @change="onchange">
		  <van-swipe-item>-->
		  	<img src="../../assets/images/download/download-bg.png" style="height: 100%;width: 100%;"/>
		  	<!--<div class="download-bg"></div>-->

				<div class="download-text">
					<p class="text-title">Your 24/7 online lottery shop</p>
					<p>offers States Lottery and 3 mins draw build on public trustworthy results.</p>
			
					<p>Top Prize ₹ 15,000,000！</p>
				</div>
				
					
				<div class="download-btn">
					<div>
						<a :href="h5Url">
							<img src="../../assets/images/download/btn-ios.png" />
						</a>
					</div>
					
					<div class="clip-btn"   :data-clipboard-text="channel">
						<a href="https://dl.lottoplus.cc/apps/FantasyLand.apk">
							<img src="../../assets/images/download/btn-andriod.png" />
						</a>
					</div>
					
					<div>
						<a :href="h5Url">
							<img src="../../assets/images/download/btn-h5.png" />
						</a>
					</div>
				</div>	
		  	
		  	
		  <!--</van-swipe-item>
		  
		  <van-swipe-item>-->
		  	
		  	
		  	<div class="download-bg-2">
		  		<img src="../../assets/images/download/download-bg-2.jpg" />
		  	</div>
		  	
		  	
		  	
		  	
		  	<!--<div class="download-sec">
		  		<div class="sec-title">Product Introduce</div>
		  		<div class="sec-bottom">
					<div class="sec-left">
						<img src="../../assets/images/download/download-1.png" />
					</div>
					<div class="sec-right">
						<div class="right-block">
							<i class="iconfont iconxuanze"></i> <div>Highest payout in the industry, starts to win more everyday here at FantasyLand</div>
						</div>
						<div class="right-block">
							<i class="iconfont iconxuanze"></i> <div>Multiple game options, 5 Mins draw everyday! </div>
						</div>
						<div class="right-block">
							<i class="iconfont iconxuanze"></i> <div>All betting history take record here, easy to check +</div>
						</div>
						<div class="right-block">
							<i class="iconfont iconxuanze"></i> <div>Each transaction your made can be found here, fast withdraw within a day only! </div>
						</div>
					</div>
				</div>
				
			</div>
			
			
			<div  class="download-img-list">
				<img :src="item" v-for="item in imgList"/>
			</div>-->
			
			
			
		  	
		  <!--</van-swipe-item>
		
		</van-swipe>
		-->
		

	</div>
</template>

<script>
	import AppHeader from '../../components/Header.vue';
	import * as types from "../../store/types";
	import globals from '../../api/config';
	import axios from 'axios';
	import { Dialog, Toast } from 'vant';
	import * as moment from "moment";
	import ClipboardJS from '../../plugin/app/clipboard.min.js';
	export default {
		data() {
			return {
				clientHeight:0,
				scrollTop:0,
				showHead: false,
				imgList:[require('../../assets/images/download/img-1.jpg'),require('../../assets/images/download/img-2.jpg'),require('../../assets/images/download/img-3.jpg'),require('../../assets/images/download/img-4.jpg'),require('../../assets/images/download/img-5.jpg')],
				channel:'',//渠道码参数
				h5Url:'',//h5跳转url
			}
		},
		components: {
			AppHeader
		},
		watch: {
			scrollTop(val) {
				console.log(val)
				if(val > 200) {
					this.showHead = true;
//					console.log(this.showHead)
				} else {
					this.showHead = false;
				}
			},
		},
		mounted() {
				// let id = this.$route.params.id;
				// console.log(id);
			var clipboard = new ClipboardJS('.clip-btn');
			clipboard.on('success', () => {
//				Toast.success(this.$store.state.system.webLang.already_copied);
			})
			window.addEventListener('scroll', this.scrolldownload)
		},
		beforeDestroy(){
	   		 window.removeEventListener("scroll",this.scrolldownload)
		},
		activated() {
		
			window.scrollTo(0,0);
			this.$store.state.system.rechargeMobile = this.$store.state.system.systemInfo.whatsapp
			
			if(this.$route.query.channel) {
				this.channel = this.$route.query.channel
				
			}
			
			this.h5Url = window.location.href.substring(0,window.location.href.indexOf("#"))+'#/purchase?channel='+this.$route.query.channel
			
			
//			let ua = navigator.userAgent.toLowerCase();
//	        //Android终端
//	        let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;  
//	        if (/(Android)/i.test(navigator.userAgent)) {
//
//	        	
//	        	var a = document.createElement('a')
//				a.setAttribute('href', 'https://dl.lottoplus.cc/apps/FantasyLand.apk?channel='+this.$route.query.channel)
//				document.body.appendChild(a)
//				a.click()
//				
//	
//	        	
//	        }
//			
			
			
			
			
		},
		deactivated() {

		},
		computed: {

		},
		methods: {
			scrolldownload() {
				let osTop = document.documentElement.scrollTop || document.body.scrollTop;
				this.scrollTop = osTop;
			},
		}
	};
</script>

<style lang="scss">
  @import '../../assets/style/variables';
	.download-wrap {
		/*.van-swipe {
			.van-swipe__track {
				height: 100%!important;
			}
			.van-swipe-item {
				height: 100%!important;
			}
		}*/
		.download-title {
			position:fixed;
			top:0;
			left:0;
			padding:0.1rem 0.3rem;
			color:#ffac28;
			z-index:9999;
			font-size:0.3rem;
			font-weight:600;
			font-style:italic;
			width:100%;
			img {
				width: 1.1rem;
			}
		}
		.whiteBg {
            background: #E10338;
			transition: all 0.3s;
        }
		.download-bg {
			background: url('../../assets/images/download/download-bg.png') no-repeat;
	        height: 100%;
	        background-size: 100%;
	        width: 100%;
	        opacity:0.9;
	        position: absolute;
		}
		.download-text {
			position: absolute;
			top: 10%;
			left: 5%;
			color: #e0e0e0;
			
	
			p:nth-of-type(1) {
				font-size: 0.43rem;
				margin-bottom:0.1rem;
				font-weight: 600;
			}
			p:nth-of-type(2) {
			
				font-size: 0.35rem;
				margin-bottom: 0.15rem;
				font-weight: 600;
			}
			p:nth-of-type(3) {
				font-size: 0.34rem;
				color:#ffac28;
				font-weight: 600;
			}
			p:nth-of-type(4) {
				font-size: 0.31rem;
				color:#ffac28;
				font-weight: 600;
			}
		}
		.download-btn {
			text-align: center;
			position: absolute;
			bottom: 9%;
			width: 100%;
			div {
				margin:0 25% 0.4rem 25%;
				img {
					width: 100%;
				}
			}
		}
		
		
		.download-sec {
			margin-bottom: 0.5rem;
			padding: 0.4rem 0.3rem;
			.sec-title {
				text-align: center;
				color: #E4023A;
				font-size: 0.45rem;
				margin-bottom: 0.4rem;
			}
			.sec-bottom {
				display: flex;
				.sec-left {
					flex:2;
					/*padding-top:5%;*/
					img {
						width: 100%;
					}
				}
				.sec-right {
					flex: 3;
					margin-left: 0.5rem;
					.right-block {
						margin-top:0.4rem;
						display: flex;
						div {
							line-height: 0.4rem;
						}
						.iconfont {
							color: #E4023A;
							font-size: 0.37rem;
							margin-right: 0.1rem;
							margin-top: 0.03rem;
						}
					}
				}
			}
		}
		
		.download-img-list {
			padding: 0.5rem 0.3rem;
			border-top: 0.1rem solid #E10338;
			display: flex;
			overflow-x: auto;
			background: #f3f3f3;
			img {
				width: 50%;
				margin-right: 0.4rem;
				height:7rem;
			}
		}
		
		.download-bg-2 {
			img {
				width: 100%;
			}
		}
		
		
		.whatsapp-btn {
			position: fixed;
			right: 5%;
			top: 43%;
			background: #e6b43e;
			padding: 0.1rem 0.1rem;
			border-radius: 0.15rem;
			color: #fff;
			font-size: 0.25rem;
			font-weight: 600;
			box-shadow: 0px 0px 10px #703434;
            animation:opacity-alt2 4s infinite;
            z-index: 99999;
            
            p {
            	display: flex;
            	align-items: center;

            }
            .iconwhatsapp {
            	color:  #fff;
            	font-size: 0.4rem;
            	margin-right: 0.1rem;
            }
            img {
            	width: 0.45rem;
            	margin-right: 0.1rem;
            }
		}
		
		
		 @keyframes opacity-btn{
            0% {
                -webkit-transform: scale(1);
                -moz-transform: scale(1);
                -ms-transform: scale(1);
                -o-transform: scale(1);
                transform: scale(1);
            }
            50%{
                -webkit-transform: scale(1.1);
                -moz-transform: scale(1.1);
                -ms-transform: scale(1.1);
                -o-transform: scale(1.1);
                transform: scale(1.1);
            }
            100%{
                -webkit-transform: scale(1);
                -moz-transform: scale(1);
                -ms-transform: scale(1);
                -o-transform: scale(1);
                transform: scale(1);
            }
        }

	}
	
	

</style>