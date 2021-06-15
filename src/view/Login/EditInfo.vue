<template>
	<div class="editPassword-wrap">
		<app-header :title="$store.state.system.webLang.edit" v-on:clickLeft="returnBack" :right="true">
			
			<template slot="right">
		        <span class="save" @click="updateInfo">{{$store.state.system.webLang.save}}</span>
		    </template>
		</app-header>
		<div class="editinfo">
			<van-uploader v-model="fileList" :after-read="afterRead" :max-count="1" @delete="deleteIma">
			</van-uploader>
		</div>
		<van-field v-model="nickname" type="text" clearable maxlength="30" :error-message="errorMsg"  :placeholder="$store.state.system.webLang.please_enter_a_new_nickname"/>


		
		
		
	</div>
</template>
<script>
	import * as types from '../../store/types';
	import AppHeader from '../../components/Header.vue';
	import { Toast } from 'vant';
	import globals from '../../api/config';
	import axios from 'axios';
	let clickBol = true;
	export default {
		data() {
			return {
				nickname:'',
				errorMsg:'',
				src2:'',
				fileList: [
        
      ],
				
			}
		},
		components: {
			AppHeader
		},
		watch:{
			nickname(val) {
				this.errorMsg = '';		
			}
		},
		activated() {
			window.scrollTo(0,0);
			// const promise = new promise(function())
		},
		deactivated() {
			this.nickname = '';
			this.errorMsg = '';
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
// 头像上传
		afterRead(file) {
      // 此时可以自行将文件上传至服务器
			// this.src = file.content;
			let params = {file:this.src};
			axios.post(globals.api.fileUpimg,params)
			.then(res => {
				if (res.data.code == 200) {
						this.src2 = res.data.data.url;
						console.log(this.src2);
						// this.portraitEdi();
					}else {
						Toast(res.data.msg)
					}
				}).catch((error)=>{
						error.msg?Toast(error.msg):''
				})
		},
			deleteIma() {
				this.src2 = '';
			},
		// 修改头像
		portraitEdi() {
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken: localStorage.getItem('token'),
				avatar: this.src2 
			}
				axios.post(globals.api.updateInfo,params)
					.then(res => {
					if (res.data.code == 200) {
						this.$store.state.user.info.avatar = this.src2;
						Toast.success(this.$store.state.system.webLang.success_text)
						
						}else {
							Toast(res.data.msg)
						}
					}).catch((error)=>{
							 error.msg?Toast(error.msg):''
						 })
		},
			updateInfo() {
				
				// return;
				// if(!this.nickname) {
				// 	this.errorMsg = this.$store.state.system.webLang.please_enter_a_new_nickname
				// 	return
				// }
				
				if(!clickBol)return
				clickBol = false
				setTimeout(()=>{
					clickBol = true
				},1500)

				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					nickname: this.nickname,
					avatar:this.src2
				}
	
				  axios.post(globals.api.updateInfo,params)
				  .then(res => {
				    	if(res.data.code==200) {
								this.fileList = [];
				    		this.$router.go(-1)
				    		Toast.success(this.$store.state.system.webLang.success_text)
				    	}else {
				    		Toast(res.data.msg)
				    	}
						
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			}
		}
	}
</script>

<style lang="scss">
	@import './Login';
	
</style>