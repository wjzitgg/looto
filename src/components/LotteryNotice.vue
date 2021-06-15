<template>
    <transition>
 		<div class="lottery-notice" v-if="$store.state.system.messageList.length" >
             <img src="../assets/images/tifications.png" alt="">
 			<marquee  v-html="$store.state.system.messageData"></marquee>
				<!--<van-notice-bar :speed="60-(1*$store.state.system.messageList.length)" :text="$store.state.system.messageData" scrollable background="rgb(0,0,0,0.5)" color="#f0f0f0" v-if="$store.state.system.messageList.length"> 
					</van-notice-bar>-->
			
 		
 		</div>
 		
 		
    </transition>
</template>

<script>
import * as types from '../store/types';
export default {
    props: {
       text: {
           type: String,
           default: 'ball'
       },

    },
    data(){
        return{

        }
    },
   
    mounted() {
 
    },

    methods: {

    },
}
</script>

<style scoped>
	.lottery-notice {
        display: flex;
        align-items: center;
		width: 93%;
		height: 34px;
		margin: 0 3.5%;
		border-radius: 0.1rem;
		/* background:rgb(0,0,0,0.5); */
		color:#645656;
		display: flex;
		align-items: center;
		
	}
    .lottery-notice img {
        width: .48rem;
    }

</style>