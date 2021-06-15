exports.install = function (Vue, options) {
  Vue.prototype.play = function (){//全局函数1
    if (this.$store.state.system.sound) {
      this.$refs.audio.play();//点击触发 点击音效
      // alert('123')
    }
   };
   Vue.prototype.jin = function (){//全局函数2
    if (this.$store.state.system.sound) {
      this.$refs.jin.play();//点击触发 点击音效
    }
   };
   Vue.prototype.tui = function (){//全局函数2
    if (this.$store.state.system.sound) {
      this.$refs.tui.play();//点击触发 点击音效
    }
   };
};