<template>
	<div class="pcTips-wrap">
	
		Please use your phone to open this website
	
		
		
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
			
				
			}
		},
		components: {
			
		},
		watch:{

		},
		activated() {
	
		},
		deactivated() {
			
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.pcTips-wrap {
		font-size: 0.7rem;
		font-weight: bold;
		text-align: center;
		position: fixed;
		top: 40%;
	}
</style>