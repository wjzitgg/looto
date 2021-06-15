<template>
	<div class="message-wrap page-wrap">

		<app-header :title="$store.state.system.webLang.notification" v-on:clickLeft="returnBack" :right="false"></app-header>
		<div class="message">

			<div class="block">
				<van-tabs v-model="activeName"  line-width="26px" line-height="2px" color="#FF2741" >
          <van-tab :title="$store.state.system.webLang.winning_notice" name="a">
            <van-list
              v-model="loadingA"
              :finished="finishedA"
              :finished-text="$store.state.system.webLang.all_data_loaded"
              :loading-text="$store.state.system.webLang.loading_text"
              @load="onLoadA"
            >
              <div class="message-content">
                <div class="message-item" v-for="(item,index) in listA"   @click="showMessage(item,index)">
                	
                  	<div>
                    	<span>{{item.title}}</span>
                    	<span v-if="item.is_read=='N'"><i class="iconfont iconyuandianzhong"></i></span>
                  	</div>
                  	
                  	<p v-html="item.content"></p>
                  	<div class="time">{{item.creation_time}}</div>
                </div>
              </div>
            </van-list>
          </van-tab>
          <van-tab :title="$store.state.system.webLang.promotions" name="b">
            <van-list
              v-model="loadingB"
              :finished="finishedB"
              :finished-text="$store.state.system.webLang.all_data_loaded"
              :loading-text="$store.state.system.webLang.loading_text"
              @load="onLoadB"
            >
              <div class="message-content">
                <div class="message-item" v-for="(item,index) in listB"   @click="showMessage(item,index)">
                  <div>
                    <span>{{item.title}}</span>
                    <span v-if="item.is_read=='N'"><i class="iconfont iconyuandianzhong"></i></span>
                  </div>
                  <p v-html="item.content"></p>
                  <div class="time">{{item.creation_time}}</div>
                </div>
              </div>
            </van-list>
          </van-tab>
        </van-tabs>
			</div>
		</div>
		

	</div>
</template>

<script>
	import api from "../../api/require";
	import AppHeader from '../../components/Header.vue';
	import * as types from "../../store/types";
	import globals from '../../api/config';
	import axios from 'axios';
	import { Dialog, Toast } from 'vant';
	import * as moment from "moment";

	export default {
		data() {
			return {
				mobile: null,
        content: null,
        activeName: 'a',
        listA: [],
        loadingA: false,
        finishedA: false,
        pageA: 1,
        limit: 10,
        listB: [],
        loadingB: false,
        finishedB: false,
        pageB: 1,
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
			window.scrollTo(0,0);
		},
		deactivated() {

		},
		computed: {

		},
		methods: {
			returnBack() {
				this.$router.go(-1)
			},
		    onLoadA() {
		        this.getDataA()
		    },
		    onLoadB() {
		        this.getDataB()
		    },
		    
		    getDataA() {
	      	
      			var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					type:this.activeName=='a'?1:3, //消息类型 1中奖通知 2系统公告 3运营活动 4弹窗信息
					page:this.pageA,
					limit:this.limit
				}
	
				  axios.post(globals.api.getMsgList,params)
				  .then(res => {
				  		 const list = res.data.data
				          this.loadingA = false;
				          this.listA = this.listA.concat(list)
				          // 数据全部加载完成
				          if (list.length < this.limit) {
				            this.finishedA = true;
				          } else {
				            this.pageA++
          }
					  }).catch((error)=>{
						
		       			error.msg?Toast(error.msg):''
		       		})

		    },
	      	getDataB() {
	      		
	      		var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					type:this.activeName=='a'?1:'3,5', //消息类型 1中奖通知 2系统公告 3运营活动 4弹窗信息
					page:this.pageB,
					limit:this.limit
				}
	
				  axios.post(globals.api.getMsgList,params)
				  .then(res => {
				  		 const list = res.data.data
				          this.loadingB = false;
				          this.listB = this.listB.concat(list)
				          // 数据全部加载完成
				          if (list.length < this.limit) {
				            this.finishedB = true;
				          } else {
				            this.pageB++
          }
					  }).catch((error)=>{
						
		       			error.msg?Toast(error.msg):''
		       		})

	      	},
	      	showMessage(item,index) {
	      		console.log(item.creation_time,item.creation_time*1000)
	      		var time = item.creation_time
				Dialog.alert({
					title:item.title,
				  	message: '<p class="message-p"">'+time+'</p>\n'+item.content
				}).then(() => {
				  	this.msgRead(item.id,index)
				});
			},
			msgRead(id,index) {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					id:id
				}
	
				  axios.post(globals.api.msgRead,params)
				  .then(res => {
				  		console.log(res)
				  		if(this.activeName=='a') {
//				  			this.getDataA()
							this.$set(this.listA[index],"is_read",'Y');
				  		}else {
//				  			this.getDataB()

							this.$set(this.listB[index],"is_read",'Y');

				  		}
				  		
					  }).catch((error)=>{
						
		       			error.msg?Toast(error.msg):''
		       		})
			}
		}
	};
</script>

<style lang="scss">
  @import '../../assets/style/variables';
	.message-wrap {
		background:#F8F6F9;
		min-height:100vh;
		.van-tabs__nav {
			background:#D51B31;
		}
		.van-tabs--line .van-tabs__wrap .van-tab {
			color: #fff;
		}
		.van-tabs__line {
			bottom: 20px;
			background-color:#fff!important;
			width: 70px!important;
		}
		.block {
			margin-top: -0.1rem;
		}
    .message-content {
      padding: 0 0.25rem;
      .message-item {
        padding: 0.22rem 0.25rem 0.35rem 0.25rem;
        background: #fff;
        box-shadow:0px 3px 6px 0px rgba(84,105,119,0.05);
		border-radius:0.16rem;
        margin-top: 0.3rem;
        /*border-bottom: 1px solid #F7F7F7;*/
        > div {
          display: flex;
          position: relative;
          > h4 {
            flex: 1;
          }
        }
        .time {
        	color: #999999;
        	padding: 0.1rem 0 0 0.15rem;
        }
        span {
          font-weight: 600;
          color: #666666;
          padding: 0 0.15rem;
        }
        .iconyuandianzhong {
        	color: red;
        	position: absolute;
          	left: -0.13rem;
          	top: 0.1rem;
          	font-size: 0.24rem;
        }
        p {
          	padding: 0.1rem 0 0 0.15rem;
          	color: #999999;
          	display: -webkit-box;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            /*! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
            word-break: break-all;
        }
      }
    }

	}
	
	
	    .van-dialog__message {
	    	.message-p {
	    		text-align: center;
	    	}
	    }
</style>