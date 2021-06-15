<template>
	<!--引导页-->
	<div class="guide-wrap page-wrap">
		
	<van-overlay :show="show" class="guide-overlay"/>	
		
		
	<div v-if="guideIndex==1" class="guide-1">
		<img src="../../assets/images/guide/guide-1.png" class="guide-1-bg"/>	
			
		<div class="guide-1-text">
			<p>Welcome to LottoPlus, we are provide more existed gaming experience from high frequency draws and best odds for player to win! </p>
			<p>Follow me and let’s start to win from LottoPlus!</p>
			<div class="guide-1-btn">
				<span @click="next">{{$store.state.system.webLang.Next}}</span>
				<span @click="closeGuide">{{$store.state.system.webLang.I_already_knew_how}}</span>
			</div>
		</div>
	</div>	
	
	
	<div v-if="guideIndex==2" class="guide-2">
		<img src="../../assets/images/guide/guide-1.png" class="guide-2-bg"/>	
		
		
		<div class="guide-2-text">
			<p>Select the game you like to bet by clicking</p>
			<p>[{{$store.state.system.webLang.buy_now}}]</p>
			<i class="iconfont iconxiangxia"></i>
			<div class="guide-2-btn">
				<span @click="next">{{$store.state.system.webLang.Next}}</span>
			</div>
		</div>
		
	</div>
	
	
	<div v-if="guideIndex==3||guideIndex==4||guideIndex==5||guideIndex==6||guideIndex==7" class="guide-3">
		<img src="../../assets/images/guide/guide-2.png" class="guide-3-bg" v-if="guideIndex==3||guideIndex==4||guideIndex==5||guideIndex==6"/>	
		<img src="../../assets/images/guide/guide-3.png" class="guide-3-bg" v-if="guideIndex==7"/>	
		
		<div class="guide-3-text" v-if="guideIndex==3">
			<p>Click the Question mark to know more about the games and the payouts. </p>
			<div class="guide-3-btn">
				<span @click="next">{{$store.state.system.webLang.Next}}</span>
			</div>
		</div>
		
		
		<div class="guide-3-text guide-3-text-1" v-if="guideIndex==4">
			<p>Ending number or sum number? Here for you to choose the game you like, lucky pick for random or hand pick your favor number go for the win!</p>
			<i class="iconfont iconxiangxia"></i>
			<div class="guide-3-btn">
				<span @click="next">{{$store.state.system.webLang.Next}}</span>
			</div>
		</div>
		
		<div class="guide-3-text guide-3-text-2" v-if="guideIndex==5">
			<p>The bet will close 1 min before the draw, make sure complete the bet after your pick.</p>
			<i class="iconfont iconxiangxia"></i>
			<div class="guide-3-btn">
				<span @click="next">{{$store.state.system.webLang.Next}}</span>
			</div>
		</div>
		
		
	
		
		<van-dialog class="draw-dialog guide-dialog" @confirm="next" @cancel="next" v-model="showDialog" :closeOnClickOverlay="true" title="Buy Lottery"    show-cancel-button v-if="guideIndex==6">
		 		
		 		<div class="draw-wrap">
		 			
		 			
		 			<div class="lottery-text">
		 				<div>Lottey type：B.S.E Lottery</div>
		 				<div>Times：1</div>
		 				<div>
		 					All Price：
							<span>₹ 10</span>
		 				</div>
		 			</div>
		 			
		 			<i class="iconfont iconxiangxia"></i>
					<div class="guide-3-btn">
						<span @click="next">{{$store.state.system.webLang.Next}}</span>
					</div>

		 		</div>
		 		
			</van-dialog>
			
			
		<div class="guide-3-text guide-3-text-3"  v-if="guideIndex==7">
			<p>Purchase successfully! Now you can check your purchase from the [Ticket]</p>
			<i class="iconfont iconxiangxia"></i>
			<div class="guide-3-btn">
				<span @click="next">{{$store.state.system.webLang.Next}}</span>
			</div>
		
		</div>
		
		
		
	</div>
	
	
	
	<div v-if="guideIndex==8" class="guide-4">
		<img src="../../assets/images/guide/guide-4.png" class="guide-4-bg"/>	
		
		<div class="guide-4-text">
			<p>Now let’s wait to the draw! Wish you all the best luck here at LottoPlus!</p>
			<i class="iconfont iconxiangshang"></i>
			<div class="guide-4-btn">
				<span @click="closeGuide">Good Luck!</span>
			</div>
		
		</div>
		
	</div>
	
	
		
	

	</div>
</template>

<script>
	import AppHeader from '../../components/Header.vue';
	import * as types from "../../store/types";
	import globals from '../../api/config';
	import axios from 'axios';
	import { Dialog, Toast } from 'vant';
	
	let clickBol = true;

	export default {
		data() {
			return {
				show:true,
				guideIndex:1,
				showDialog:true,
				act_token:''
			}
		},
		components: {
		
		},
		watch: {
	
		},
		mounted() {

		},
		beforeDestroy(){
	   		
		},
		activated() {
			// gtag('config', 'G-N6Y1WPMJH6', {
			//   'page_title' : 'guide',
			//   'page_path': '/guide'
			// });
			window.scrollTo(0,0);
			localStorage.setItem('firstReg', 2);
			this.activityRecieve();//领取任务
			
			
		},
		deactivated() {

		},
		computed: {

		},
		methods: {
			//领取任务
			activityRecieve() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					id:11
				}
	
			  axios.post(globals.api.activityRecieve,params)
			  .then(res => {
			  		console.log(res.data.data)
			  		this.act_token = res.data.data.act_token
		
				  }).catch((error)=>{
		
	       			error.msg?Toast(error.msg):''
	       		})
			},
			
			//关闭引导页
			closeGuide() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					id:11,
					act_token:this.act_token
				}
	
			  axios.post(globals.api.activityComplete,params)
			  .then(res => {
			  		console.log(res.data.data.points)
			  		
			  		Toast('You  complete the tutorial, we have Rs.'+res.data.data.points+' for you as welcome bonus! ')
					this.$router.push({name:'lottery',query:{type:2,id:2}})
				
				  }).catch((error)=>{
		
	       			error.msg?Toast(error.msg):''
	       			this.$router.push({name:'lottery',query:{type:2,id:2}})
	       		})
				
			},
			//下一页
			next() {
				
				if(!clickBol)return
				this.guideIndex+=1;
				console.log(this.guideIndex)
				clickBol = false;
				setTimeout(()=>{
					clickBol = true
				},500)
			}
		}
	};
</script>

<style lang="scss">
  @import '../../assets/style/variables';
	.guide-wrap {
		.guide-overlay {
			z-index: 9999;
			background-color: rgba(0,0,0,0.35);
		}
		.guide-1 {
			.guide-1-bg {
				width:100%;
				height:100%;
			}
			.guide-1-text {
				position: absolute;
				width: 92%;
				top: 30%;
				left: 4%;
				background: #C8C8C8;
				z-index: 999999;
				padding: 0.25rem 0.15rem;
				border-radius: 0.15rem;
				border: 0.06rem solid #385D8A;
				p {
					text-indent:0.5rem;
					line-height: 0.45rem;
					font-size: 0.27rem;
					color: #000;
					/*word-break:break-all*/
				}
			}
			.guide-1-btn {
				display: flex;
				margin: 0.3rem 0 0 0;
				span {
					flex: 1;
					text-align: center;
					background: #4F81BD;
					color: #fff;
					border-radius: 0.15rem;
					border: 0.06rem solid #385D8A;
					padding: 0.2rem 0;
					font-size: 0.26rem;
				}
				span:nth-of-type(1) {
					margin-right: 3%;
				}
			}
		}
		
		
		.guide-2 {
			.guide-2-bg {
				width:100%;
				height:100%;
			}
			.guide-2-text {
				position: absolute;
				width: 92%;
				top: 32%;
				left: 4%;
				background: #C8C8C8;
				z-index: 999999;
				padding: 0.25rem 0.15rem;
				border-radius: 0.15rem;
				border: 0.06rem solid #385D8A;
				p {
					text-indent:0.5rem;
					line-height: 0.45rem;
					font-size: 0.27rem;
					color: #000;
					/*word-break:break-all*/
				}
				.iconxiangxia {
					position: absolute;
					font-size: 0.6rem;
					color: #095abc;
					right: 4%;
					bottom: -30%;
				}
				.guide-2-btn {
					display: flex;
					justify-content: center;
					margin: 0.3rem 0 0 0;
					span {
						width: 50%;
						text-align: center;
						background: #4F81BD;
						color: #fff;
						border-radius: 0.15rem;
						border: 0.06rem solid #385D8A;
						padding: 0.2rem 0;
						font-size: 0.26rem;
					}
				}
			}
			
		}
		
		
		.guide-3 {
			.guide-3-bg {
				width:100%;
				height:100%;
			}
			.guide-3-text {
				position: absolute;
				width: 92%;
				top: 12%;
				left: 4%;
				background: #C8C8C8;
				z-index: 999999;
				padding: 0.25rem 0.15rem;
				border-radius: 0.15rem;
				border: 0.06rem solid #385D8A;
				p {
					text-indent:0.5rem;
					line-height: 0.45rem;
					font-size: 0.27rem;
					color: #000;
					/*word-break:break-all*/
				}
				.guide-3-btn {
					display: flex;
					justify-content: center;
					margin: 0.3rem 0 0 0;
					span {
						width: 50%;
						text-align: center;
						background: #4F81BD;
						color: #fff;
						border-radius: 0.15rem;
						border: 0.06rem solid #385D8A;
						padding: 0.2rem 0;
						font-size: 0.26rem;
					}
				}
			}
			
			.guide-3-text-1 {
				top: 31%;
				.iconxiangxia {
					position: absolute;
					font-size: 0.6rem;
					color: #095abc;
					left: 10%;
					bottom: -24%;
				}
			}
			.guide-3-text-2 {
				top: 65%;
				.iconxiangxia {
					position: absolute;
					font-size: 0.6rem;
					color: #095abc;
					right: 4%;
					bottom: -28%;
				}
			}
			.guide-dialog {
				overflow: initial!important;
			}
			.draw-wrap {
				top: 34%;
				.guide-3-btn {
					position: absolute;
					width: 100%;
					bottom: -35%;
					display: flex;
					justify-content: center;
					margin: 0.3rem 0 0 0;
					span {
						width: 50%;
						text-align: center;
						background: #4F81BD;
						color: #fff;
						border-radius: 0.15rem;
						border: 0.06rem solid #385D8A;
						padding: 0.2rem 0;
						font-size: 0.26rem;
					}
				}
				.iconxiangxia {
					position: absolute;
					font-size: 0.6rem;
					color: #095abc;
					right: 20%;
					bottom: 20%;
					z-index: 9999;
				}
			}
			
			
			.guide-3-text-3 {
				position: fixed;
				top: inherit;
				bottom: 12%;
				.iconxiangxia {
					position: absolute;
					font-size: 0.6rem;
					color: #095abc;
					right: 8%;
					bottom: -30%;
				}
			}
		}
		
		
		
		
		.guide-4 {
			.guide-4-bg {
				width:100%;
				height:100%;
			}
			.guide-4-text {
				position: absolute;
				width: 92%;
				top: 10%;
				left: 4%;
				background: #C8C8C8;
				z-index: 999999;
				padding: 0.25rem 0.15rem;
				border-radius: 0.15rem;
				border: 0.06rem solid #385D8A;
				p {
					text-indent:0.5rem;
					line-height: 0.45rem;
					font-size: 0.27rem;
					color: #000;
					/*word-break:break-all*/
				}
				.iconxiangshang {
					position: absolute;
					font-size: 0.5rem;
					color: #095abc;
					right: 4%;
					top: -25%;
				}
				.guide-4-btn {
					display: flex;
					justify-content: center;
					margin: 0.3rem 0 0 0;
					span {
						width: 50%;
						text-align: center;
						background: #4F81BD;
						color: #fff;
						border-radius: 0.15rem;
						border: 0.06rem solid #385D8A;
						padding: 0.2rem 0;
						font-size: 0.26rem;
					}
				}
			}
			
		}
		
		.iconxiangxia {
			animation:opacity-alt 1.4s infinite;
		}
		.iconxiangshang {
			animation:opacity-alt1 1.4s infinite;
		}
		@keyframes opacity-alt{
            0% {
                transform: translateY(0);
                opacity: 0.7;
            }
            100%{

                transform: translateY(12px);
                 opacity: 1;
            }
        }
        @keyframes opacity-alt1{
            0% {
                transform: translateY(0);
                opacity: 0.7;
            }
            100%{

                transform: translateY(-12px);
                 opacity: 1;
            }
        }

	}
	
	

</style>