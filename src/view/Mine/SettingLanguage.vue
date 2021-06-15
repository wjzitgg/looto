<template>
	<div class="settingLanguage-wrap page-wrap" >
		<app-header :title="$store.state.system.webLang.language_setting" v-on:clickLeft="returnBack"></app-header>
<!--$store.state.system.webLang.language_setting-->
		
	
			
			<div class="lang-list" v-for="(item,index) in $store.state.system.languageList" @click="settingLang(index)" >
				<div class="list-block">
					<span>{{item.name}}</span>
					<i class="iconfont iconxuanze" v-if="$store.state.system.langIndex==index"></i>
				</div>
			</div>







	</div>
</template>

<script>
	import AppHeader from '../../components/Header.vue';
	import { Dialog, Toast } from 'vant';
	import * as types from "../../store/types";
	import * as moment from "moment";
	import globals from '../../api/config';
	import axios from 'axios';

	export default {
		data() {
			return {
				currentIndex:0
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
			this.getSystemInfo();//获取站点配置
			
		
		},
		deactivated() {
			
		},
		computed: {
		
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			//获取站点配置
			getSystemInfo() {
			
				for(let i = 0;i<this.$store.state.system.languageList.length;i++) {
					if(this.$store.state.system.languageList[i].type==localStorage.getItem('lang')) {
						this.$store.state.system.langIndex = i
					}
				}
				return
				axios.get(globals.api.getSystemInfo).then((res)=>{
					this.languageList = res.data.data.language;
					console.log(this.languageList)
					for(let i = 0;i<this.languageList.length;i++) {
						if(this.languageList[i].language==localStorage.getItem('lang')) {
							this.currentIndex = i
						}
					}
	       		}).catch((error)=>{})
			},
			settingLang(index) {
//				Toast('Not yet open')
				this.$store.state.system.langIndex = index;
				localStorage.setItem('lang',this.$store.state.system.languageList[index].type)
				this.$store.commit(types.UPDATE_LANG, this.$store.state.system.languageList[index].type);//多语言设置
			}

		}
	};
</script>

<style lang="scss">
	@import '../../assets/style/variables';
	.settingLanguage-wrap {
		background: #f5f5f5;
		.lang-list {
			margin: 0 8px;
			background:#fff;
		}
		
		.list-block {
			display:flex;
			align-items:center;
			/*background: #fff;*/
			color: #9A9A9A;
			padding: 0 20px 0 15px;
			border-radius: 4px;
			margin-top: 10px;
			height:0.9rem;
			line-height:0.9rem;
			.iconxuanze {
				flex:1;
				text-align:right;
				color:#3370F6;
			}
		}
	}
</style>