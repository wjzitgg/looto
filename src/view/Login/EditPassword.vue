<template>
	<div class="editPassword-wrap">
		<app-header :title="$store.state.system.webLang.change_password" v-on:clickLeft="returnBack" :right="true">
			
			<template slot="right">
		        <span class="save" @click="updatePassword">{{$store.state.system.webLang.save}}</span>
		    </template>
		</app-header>
	
		<van-field v-model="oldPassword" type="password" clearable maxlength="12"  :placeholder="$store.state.system.webLang.enter_old_password"/>

		<van-field v-model="password"  @blur="passwordBlur" :error-message="errorMsgB" type="password" clearable maxlength="12" :placeholder="$store.state.system.webLang.paddword_error"/>
	
		<van-field v-model="passwordA" type="password" :error-message="errorMsgC" clearable maxlength="12"  :placeholder="$store.state.system.webLang.reenter_new_password"/>
		
		
		
		
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
				oldPassword:'',
				password:'',
				passwordA:'',
				errorMsgB:'',
				errorMsgC:''
				
			}
		},
		components: {
			AppHeader
		},
		watch:{
			passwordA(val) {
				if(this.errorMsgB.length)return
				this.errorMsgC = '';
				var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,12})$/
		
				setTimeout(()=>{
					console.log(this.passwordA,this.password)
					if(this.passwordA!=this.password) {
						
						this.errorMsgC = this.$store.state.system.webLang.inconsistent_password
					}
				},2000)
			}
		},
		activated() {
			window.scrollTo(0,0);

		},
		deactivated() {
			this.oldPassword = '';
			this.password = '';
			this.passwordA = '';
			this.errorMsgB = '';
			this.errorMsgC = '';
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			//密码失去焦点
			passwordBlur(event) {
				var reg = /^[A-Za-z0-9]{6,12}$/
				if(!reg.test(this.password)&&this.password!='') {
					this.errorMsgB = this.$store.state.system.webLang.paddword_error
				}else {
					this.errorMsgB = ''
				}
			},
			updatePassword() {
				if(!this.oldPassword) {
					Toast(this.$store.state.system.webLang.enter_old_password)
					return
				}
				if(!this.password) {
					Toast(this.$store.state.system.webLang.paddword_error)
					return
				}
				var reg = /^[A-Za-z0-9]{6,12}$/
				if(!reg.test(this.password)&&this.password!='') {
					this.errorMsgB = this.$store.state.system.webLang.paddword_error
					return
				}
				if(!this.passwordA||this.password!=this.passwordA) {
					Toast(this.$store.state.system.webLang.inconsistent_password)
					return
				}
				
				if(!clickBol)return
				clickBol = false
				setTimeout(()=>{
					clickBol = true
				},1500)
				
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					new_password: this.password,
					old_password: this.oldPassword
				}
	
				  axios.post(globals.api.updatePassword,params)
				  .then(res => {
				  		
				    	if(res.data.code==200) {
				    		this.$router.push('/login')
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