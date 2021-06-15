import Vue from 'vue'
import store from './store/store'
import * as types from './store/types'
import router from './router'
import App from './App.vue'
import Vant from 'vant'
Vue.use(Vant)
import baes from './components/base'
Vue.use(baes)

import fastClick from 'fastclick'
fastClick.attach(document.body);


import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

import  VueLazyload  from 'vue-lazyload';
//Vue.use(Lazyload);
import { Locale } from 'vant';
import enUS from 'vant/lib/locale/lang/en-US';

Locale.use('en-US', enUS);

import VueQriously from 'vue-qriously'
Vue.use(VueQriously)
Vue.config.devtools = true

import { Toast } from 'vant';
Toast.allowMultiple(); //允许同时存在多个 Toast
Toast.setDefaultOptions({ duration: 1700 });    // duration延迟时间

import FBSignInButton from 'vue-facebook-signin-button'
Vue.use(FBSignInButton)

import GSignInButton from 'vue-google-signin-button'
Vue.use(GSignInButton)

import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import 'default-passive-events'





// 页面刷新时，重新赋值token
if(window.localStorage.getItem('token')) {
	store.commit(types.UPDATE_TOKEN, {
		token:window.localStorage.getItem('token'),
		userId:window.localStorage.getItem('userId')
	})
}

//缩放布局计算
var docEl = document.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function() {
		var clientWidth = docEl.clientWidth;
		if(!clientWidth) return;
		if(clientWidth >= 750) {
			docEl.style.fontSize = '100px';
		} else {
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		}
	};
recalc()
window.addEventListener(resizeEvt, recalc, false);
// window.addEventListener('touchstart', function (event) {
// 	event.preventDefault();
// 	console.log(123);
// }, {
// 	passive: false
// });
//Global Filter
Vue.filter('formatDate', (value, fmt) => {
	fmt = fmt ? fmt : 'yyyy-MM-dd hh:mm'
	var date = new Date(value*1000)
	if(isNaN(date.getMonth())) date = new Date(Number(value))
	var o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
});


Vue.filter('formatDateA', (value, fmt) => {
	fmt = fmt ? fmt : 'yyyy/MM/dd hh:mm'
	var date = new Date(value)
	if(isNaN(date.getMonth())) date = new Date(Number(value))
	var o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
});

Vue.filter('parseInt', (value) => {
	return parseInt(value)
});

Vue.filter('changeNum', (value) => {
	var val = Number(value)
	if(val>=100000&&val<10000000) {
		return (val/100000+' Lac')
	}else if(val>=10000000) {
		return (val/10000000+' Crore')
	}else {
		return val
	}
	
});

Vue.filter('toFixed', (value, len) => {
	let num = Number(value)
	if(isNaN(num) || typeof len == "undefined") return
	return num.toFixed(len)
});

Vue.filter('numFilter', (value, len) => {
	let transformVal = Number(value).toFixed(len + 1)
	let realVal = transformVal.substring(0, transformVal.length - 1)
	return Number(realVal)
});
Vue.filter('NumFormat', (value,len) => {

    if(!value) return '0.00';
//  var value2Array = String(value);
    var intPart = 0
     if(String(value).indexOf('.')!=-1) {
     	intPart = String(value).split('.')[0];
     	var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
     	return intPartFormat + '.'+String(value).split('.')[1].substring(0,len?len:2)
     }else {
     	var intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
     	return intPartFormat
     }
// var intPart = Number(value).toFixed(0); //获取整数部分
//
// var floatPart = ""; //预定义小数部分
// 
// //=2表示数据有小数位
// console.log(value2Array)
// 		if(value2Array.indexOf('.')!=-1) {
// 			
// 		}else {
// 			return intPartFormat
// 		}
// console.log(intPartFormat)
// if(value2Array.length == 2) {
//  floatPart = value2Array[1].toString(); //拿到小数部分
//  console.log(floatPart)
//  if(floatPart.length == 1) { //补0,实际上用不着
//   return intPartFormat;
//  } else {
//   return intPartFormat;
//  }
// } else {
//  return intPartFormat + floatPart;
// }
  });
  
  
Vue.directive('enterNumber', {
  inserted: function (el) {
    el.addEventListener("keypress",function(e){
      e = e || window.event;
      let charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode;
      let re = /\d/;
      if(!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey){
        if(e.preventDefault){
          e.preventDefault();
        }else{
          e.returnValue = false;
        }
      }
    });
  }
});

new Vue({
	router,
	store,
	el: '#app',
	render: h => h(App)
})