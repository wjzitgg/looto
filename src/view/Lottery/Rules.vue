<template>
	<div class="rules-wrap page-wrap">

		<app-header :title="name" v-on:clickLeft="returnBack"></app-header>
		
		
		
		<div class="rules-content" v-html="rule">
			
		</div>
		

	</div>
</template>

<script>
	import api from "../../api/require";
	import AppHeader from '../../components/Header.vue';
  import * as types from "../../store/types";
  import globals from '../../api/config';
  import axios from 'axios';

	export default {
		data() {
			return {
				name:'',
				rule:'',
				valListEN:[{name:'Account Balance',val:'Account balance are the funds your can use for betting.'},{name:'Bonus',val:'Bonus chips is gifted by FantasyLand, you can not withdraw it before you play it and bonus chips will prioritized in play over your available funds.'},{name:'Withdrawable',val:'The amount you can withdraw after you complete the withdraw requirement which is fully bet your deposit.'}],
				valListyd:[{name:'शेष राशि',val:'खाता शेष राशि वह धन है जिसका उपयोग आप सट्टेबाजी के लिए कर सकते हैं।'},{name:'बोनस',val:'बोनस चिप्स लोट्टो + द्वारा उपहार में दिया गया है, इसे खेलने से पहले आप इसे वापस नहीं ले सकते हैं और बोनस चिप्स आपके उपलब्ध धन पर खेलने में प्राथमिकता दी जाएगी।'},{name:'निकासी योग्य',val:'वह राशि जो आप निकासी की आवश्यकता को पूरा करने के बाद निकाल सकते हैं जो पूरी तरह से आपकी जमा राशि है।'}],
				valList:[]
			}
		},
		components: {
			AppHeader
		},
		watch: {

		},
		mounted() {

		},
		activated() {
			if(localStorage.getItem('lang')=='hi') {
				this.valList = this.valListyd
			}else {
				this.valList = this.valListEN
			}
			
			
			window.scrollTo(0,0)
			if(this.$route.query.name) {
				//lottery页
				this.name = this.$route.query.name
				console.log(this.$route.query.name)
				if(this.$route.query.name=='3 Mins/Draw') {
					this.bseClass()
				}else {
					this.getLotteryClass();
				}
				
				
			}else if(this.$route.query.val) {
				//wallet页
				this.name = this.$route.query.val
				for(let i = 0;i<this.valList.length;i++) {
					if(this.valList[i].name==this.$route.query.val) {
						this.rule = this.valList[i].val;
						
					}
				}
			}
		},
		deactivated() {

		},
		computed: {

		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			//获取彩票种类信息
		getLotteryClass() {
			axios.post(globals.api.getLotteryClass).then((res)=>{
				this.lotteryClass = res.data.data;
				for(let i = 0;i<res.data.data.length;i++) {
					if(res.data.data[i].name==this.$route.query.name) {
						this.rule = res.data.data[i].rule
					}
				}
				
       		}).catch((error)=>{})
		},
		bseClass() {
			axios.post(globals.api.bseClass).then((res)=>{
			this.rule = res.data.data[0].rule
				

       		}).catch((error)=>{})
		},
		
			
 
		}
	};
</script>

<style lang="scss">
  @import '../../assets/style/variables';
	.rules-wrap {
		.rules-content {
			padding: 0.5rem 0.35rem;
			font-size:0.3rem;
			color:#7C7777;
			white-space: pre-line;
			.title {
				font-size: 0.48rem;
				color: #3F3E3E;
				margin-bottom: 0.25rem;
				font-weight: 600;
			}
		}
		
	}
</style>