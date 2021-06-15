<template>

	<div class="previewWord-wrap page-wrap">
		
		<app-header title="" v-on:clickLeft="returnBack"></app-header>
		
		
	<!--<iframe

    style="overflow: auto; position: absolute; top: 0.81rem; right: 0; bottom: 0; left: 0; width: 100%; height: 100%"
    >
        </iframe>-->
    	
    
		<van-loading size="24px" v-if="loading">{{$store.state.system.webLang.loading_text}}...</van-loading>
		
		<pdf 
    		:src="$route.query.url"
    		ref="pdf"
		    v-for="i in numPages" 
		    :key="i"  
		    :page="i"
		    v-else
    		></pdf>
		
<!--'https://view.officeapps.live.com/op/view.aspx?src='+-->
	
		
		
		
	</div>
</template>
<script>
	import * as types from '../../store/types';
	import { Toast,Dialog } from 'vant';
	import globals from '../../api/config';
	import AppHeader from '../../components/Header.vue';
	import axios from 'axios';
	import * as moment from "moment";
	import pdf from 'vue-pdf'
	export default {
		components: {
			AppHeader,
			pdf
		},
		data() {
			return {
				 numPages: null, // pdf 总页数
				 loading:false
				
			}
		},
		watch:{
	
		},
		computed: {

		},
		mounted() {
			this.getNumPages()
		},
		activated() {
			console.log(this.$route.query.url)
			window.scrollTo(0,0)
			
			console.log(this.loading)
		},
		deactivated() {
			this.loading = false;
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			getNumPages() {
				this.loading = true;
		      	let loadingTask = pdf.createLoadingTask(this.$route.query.url)
		      	loadingTask.promise.then(pdf => {
		      		console.log(pdf)
		        	this.numPages = pdf.numPages
		        	console.log(this.numPages)
		        	setTimeout(()=>{
		        		this.loading = false;
		        	},7000)
		      	}).catch(err => {
		        	console.error('pdf 加载失败', err);
		        	Toast(this.$store.state.system.webLang.failed_to_load)
		        
		      	})
		    },
			


		}
	}
</script>

<style lang="scss">
	@import '../../assets/style/variables';
	.previewWord-wrap {
		overflow:hidden;
		.van-loading--circular {
			position:fixed;
			top:50%;
			left:40%;
		}

	}


</style>