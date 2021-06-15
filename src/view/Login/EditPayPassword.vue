<template>
	<div class="editPassword-wrap">
		<app-header :title="$store.state.system.webLang.setting_pin_number" v-on:clickLeft="returnBack" :right="true">
			
			<template slot="right">
		        <span class="save" @click="UpdataPayPassword">{{$store.state.system.webLang.save}}</span>
		    </template>
		</app-header>
		
		<van-field v-model="oldPassword" type="password" clearable :error-message="errorMsgA" maxlength="6" v-enter-number  :placeholder="$store.state.system.webLang.please_enter_old_pin_number"  v-if="userInfo.is_pay_password=='Y'"/>
	
		<van-field v-model="password" type="password" clearable :error-message="errorMsg" maxlength="6" v-enter-number  :placeholder="$store.state.system.webLang.enter_6_digit_pin_number"/>

	
		
		
	</div>
</template>
<script>
	import * as types from '../../store/types';
	import AppHeader from '../../components/Header.vue';
	import { Toast,Dialog } from 'vant';
	import globals from '../../api/config';
	import axios from 'axios';
	
	let clickBol = true;
	export default {
		data() {
			return {
				oldPassword:'',//旧密码
				password:'',
				errorMsg:'',
				userInfo:{},
				errorMsgA:''
				
			}
		},
		components: {
			AppHeader
		},
		watch:{
			password(val) {
				this.errorMsg = '';		
			},
			oldPassword(val) {
				this.errorMsgA = '';		
			}
		},
		activated() {
			window.scrollTo(0,0);
			this.getUserInfo();
		},
		deactivated() {
			this.oldPassword = '';
			this.password = '';
			this.errorMsg = '';
			this.errorMsgA = '';
		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
			getUserInfo() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					ext:'show'
				}

				  axios.post(globals.api.getUserInfo,params)
				  .then(res => {

					this.userInfo = res.data.data;
				
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			UpdataPayPassword() {
				
				var reg=/^[0-9]{6}$/
				
				if(this.userInfo.is_pay_password=='Y') {
					if(!this.oldPassword) {
						this.errorMsgA = this.$store.state.system.webLang.please_enter_old_pin_number
						return
					}
					if(!reg.test(this.oldPassword)) {
						this.errorMsgA = this.$store.state.system.webLang.enter_6_digit_pin_number
						return
					}
				}

				if(!this.password) {
					this.errorMsg = this.$store.state.system.webLang.enter_6_digit_pin_number
					return
				}
				
				if(!reg.test(this.password)) {
					this.errorMsg = this.$store.state.system.webLang.enter_6_digit_pin_number
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
					password: this.password,
					old_password:this.oldPassword
				}
	
				  axios.post(globals.api.UpdataPayPassword,params)
				  .then(res => {
//				  		
					if(res.data.code==200) {
						this.password = '';
						this.oldPassword = '';
						Dialog.alert({
						  title: this.$store.state.system.webLang.tips_text,
						  message: this.$store.state.system.webLang.forget_text
						}).then(() => {
						  this.$router.go(-1)
						})
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