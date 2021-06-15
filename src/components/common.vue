<template>
  <div>
    <audio v-show="$store.state.system.sound" ref="audio" :src="mp3http"></audio>
  </div>
</template>

<script>
  import * as types from '../store/types';

  export default {
    data() {
      return {
        mp3http:require('../assets/mp3/ButtonClick.mp3'),
      }
    },
   methods: {
      	// 音效
     play() {
      console.log(2133);
      
       
     
      },
   }
  }

</script>