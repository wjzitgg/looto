<template>
    <div class="recharge-dialog">


			  <!--充值-->
			  <div class="pay-pwd-wrap">
			      <div class="pay-pwd-title">Please contact the agent to recharge</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn"  @click="toPhone">
			           CALL 
			        </van-button>
			        <van-button type="primary" class="pay-submit-btn clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile">
			            {{$store.state.system.webLang.copy}} 
			        </van-button>
			      </div>
			      
			  </div>
			  <!--充值-->


    </div>
</template>

<script>
	import * as types from '../store/types';
	import ClipboardJS from '../plugin/app/clipboard.min.js';
    export default {

        data() {
            return{
                // hasTicket: false
            }
        },
        computed: {
        	userInfo() {
				return this.$store.state.user.info;
			},
			isLogin() {
				return this.$store.state.user.loginStatus;
			}
        },
        mounted() {
			var clipboard = new ClipboardJS('.clip-btn');
			clipboard.on('success', () => {
				Toast.success(this.$store.state.system.webLang.already_copied);
			})
		},
        activated() {
       
        },
        methods: {
			//充值电话
			toPhone() {
				window.location.href = 'tel://'+this.$store.state.system.rechargeMobile
			},
        }
    }
</script>

<style lang="scss">
    .recharge-dialog {
    
        
    }
</style>

