<template>
	<div class="loading-wrap">
	
	<div class="loading-logo">
		<img src="../../assets/images/loading_logo.png" />
	</div>
		
		
	<div class="loading-progress">
		<div class="progress-block">
			<van-progress :percentage="percent" stroke-width="10" color="#FF0000" :show-pivot="false"/>
		</div>
		<div class="progress-text">
			<span>{{$store.state.system.webLang.loading_progress_text}}</span>
			<span>{{percent}}%</span>
		</div>
	</div>
	
		
		
	</div>
</template>
<script>
	import * as types from '../../store/types';
	import { Toast } from 'vant';
	import globals from '../../api/config';
	import axios from 'axios';
	export default {
		data() {
			return {
				percent:0,
				timer:null
				
			}
		},
		components: {
			
		},
		watch:{

		},
		activated() {
	
			this.getLotteryList();
		},
		deactivated() {
			this.percent = 0;
		},
		methods: {
			getNum(num) {
			
				var a = num.substring(0,2);
				var b = num.substring(2,3);
				var c = num.substring(3,4);
				var d = num.substring(4,5);
				var e = num.substring(5,6);
				var f = num.substring(6,7);
				var g = num.substring(7,8);
				
				var list = [];
				list.push(a,b,c,d,e,f,g)
	
				return list
			},
			//获取历史开奖记录
			getLotteryList() {
				var params = {
					status:3,
					page:1,
					limit:10
				}
				axios.post(globals.api.getLotteryList,params).then((res)=>{
					this.timer = setInterval(()=>{
						this.percent+=1;
						if(this.percent==100) {
							clearInterval(this.timer);
							this.$router.push('/')
						}
					},10)
	
					var temp = res.data.data
					for(let i = 0;i<temp.length;i++) {
						temp[i].prize_1 = this.getNum(temp[i].prize_1)
					}
					this.$store.state.system.lotteryList = temp;
					console.log(this.$store.state.system.lotteryList)
			
	       		}).catch((error)=>{})
			},
		}
	}
</script>

<style lang="scss">
	@import './Login';
</style>