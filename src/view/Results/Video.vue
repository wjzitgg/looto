<template>
	<div class="video-wrap page-wrap">

		<app-header title="Open result video" v-on:clickLeft="returnBack"></app-header>
		
	
		
		<video class="ad-video" :src="$route.query.detail" autoplay   controls playsinline="" webkit-playsinline=""   ></video>
		

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
				rule:''
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
			window.scrollTo(0,0)
			if(this.$route.query.name) {
				this.getLotteryClass();
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
			
 
		}
	};
</script>

<style lang="scss">
  @import '../../assets/style/variables';
	.video-wrap {
		video {
			width:100%;
		}
		
	}
</style>