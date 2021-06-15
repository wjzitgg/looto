<template>
	<div class="changeRecord-wrap" >
		<!--帐变记录-->
		<app-header :title="$store.state.system.webLang.transaction_records" v-on:clickLeft="returnBack"  :right="true">
			<template slot="right">
				<img src="../../assets/images/mine/kefu@2x.png" @click="showKefu=true"/>
                <span @click="showKefu=true">FAQ</span>
		    </template>
		</app-header>
		
		<div class="changeRecord-top">
			<div class="record-left" @click="typeShow=true">
				<img src="../../assets/images/mine/全部@2x.png" />
				<span>{{$store.state.system.webLang.all_record}}</span>
			</div>
			<div class="calendar" @click="calendarShow=true">
				<i class="iconfont iconrili"></i>
				<div>{{selsetDateStart+'~'+selsetDateEnd}}</div>
			</div>
		</div>
		
		<div class="record-list">
			<div class="list-block" v-for="item in pointsList">
				<div class="blockA">
					<div class="blockA-left">{{item.source_type==1?$store.state.system.webLang.deposit:item.source_type==2?$store.state.system.webLang.withdraw:item.source_type==3?$store.state.system.webLang.withdrawal_refund:item.source_type==4?$store.state.system.webLang.Bet:item.source_type==5?$store.state.system.webLang.Winning:item.source_type==6?$store.state.system.webLang.Transfer:''}}</div>
					
					<div class="blockA-right" v-if="item.source_type==6">{{item.ext_info[0].username}}</div>
					<div class="blockA-right" v-else>{{item.points_type==1?$store.state.system.webLang.account:item.points_type==2?$store.state.system.webLang.bonus:''}}</div>
				</div>
				
				<div class="blockB">
					<div class="blockB-left">{{$store.state.system.webLang.No_}}{{item.order_id}}</div>
					<div class="blockB-right">{{item.creation_time}}</div>
				</div>
				<div class="blockC">
					<div class="blockC-left">{{$store.state.system.webLang.Amount}}: <span class="cut-amount">₹ {{item.points | NumFormat}}</span></div>
					<!--:class="{'add-amount':item.amount>0,'cut-amount':item.amount<0}"-->
					<div class="blockC-right">{{$store.state.system.webLang.Balance}}: ₹ {{item.after_points | NumFormat}}</div>
				</div>
			</div>
		</div>
		

		<van-loading type="spinner" color="#1989fa" v-if="reqLoading">{{$store.state.system.webLang.loading_text}}</van-loading>
		<div v-if="pointsListNum==0&&!reqLoading" class="no-data">
			<img src="../../assets/images/no-data.png" />
			<p>{{$store.state.system.webLang.no_data}}</p>
		</div>
		<div class="allData" v-if="pointsListNum!=0&&REQUIRE&&!loading">$store.state.system.webLang.all_data_loaded</div>
		
		
		
		<div class="calendar-bg" v-if="calendarShow" @click="calendarShow=false">
			
			<div class="bg-fix">
				
				<div class="bg-bottom">
					<div class="bg-left">
						{{selsetDateStart}}
					</div>
					<div class="bg-center">
						~~
					</div>
					<div class="bg-right">
						{{selsetDateEnd}}
					</div>
				</div>
				
				<div class="bg-top">
					<div class="top-btn" @click.stop="selectList('Yesterday')">
						{{$store.state.system.webLang.yesterday}}
					</div>
					<div class="top-btn"  @click.stop="selectList('week')">
						{{$store.state.system.webLang.last_week}}
					</div>
					<div class="top-btn"  @click.stop="selectList('month')">
						{{$store.state.system.webLang.last_month}}
					</div>
				</div>
			</div>

			
			
		</div>
		
		<!--日历-->
		<van-calendar :title="$store.state.system.webLang.calendar" :confirm-text="$store.state.system.webLang.btn_confirm" v-model="calendarShow" type="range" :min-date="minDate"
  :max-date="maxDate" :default-date="defaultDate" :overlay="false" :max-range="90" :range-prompt="$store.state.system.webLang.filter_for_up_to_3_months"   @confirm="onConfirm" @select="onSelect" />
		
		<!--日历-->
		
		
		
		<div class="pop-up-bg" v-if="showKefu" @click="closeBg"></div>
		  	<transition name="slide-popupShow"> 
	

			  
			  
			  <!--客服-->
			  <div class="pay-pwd-wrap"  v-if="showKefu">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.please_contact_service}}</div>
			     
					<div class="pay-text">WhatsApp:{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile" @click="closeBg">
						{{$store.state.system.webLang.copy}}
			        </van-button>
			        <!--<van-button type="primary" class="pay-submit-btn">-->
			            <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share" @click="closeBg">{{$store.state.system.webLang.message_now}}</a>
			            
			        <!--</van-button>-->
			       
			      </div>
			      
			  </div>
			  <!--客服-->
			  
			  
			</transition>
		

		<!--类型选择-->
			<van-action-sheet v-model="typeShow" :actions="typeList" @select="onSelecttypeList" @cancel="typeShow=false" :cancel-text="$store.state.system.webLang.cancel"/>
		<!--类型选择-->
		

	</div>
</template>

<script>
	import * as types from '../../store/types';
	import { Toast } from 'vant';
	import globals from '../../api/config';
	import axios from 'axios';
	import AppHeader from '../../components/Header.vue';
	import * as moment from "moment";
	export default {
		data() {
			return {
				pointsList:[],
				pointsListNum:0,
				calendarShow:false,//日历显示
				minDate:new Date(new Date().getTime()-60*60*24*365*1000),
				maxDate:new Date(new Date().getTime()),
				defaultDate:[new Date(new Date().getTime()-60*60*24*30*1000),new Date(new Date().getTime())],
				reqDate:[new Date(new Date().getTime()-60*60*24*30*1000),new Date(new Date().getTime())],
				selsetDateStart:moment(new Date().getTime()-60*60*24*30*1000).format('MM/DD'),
				selsetDateEnd:moment(new Date().getTime()).format('MM/DD'),
				currentPage:1,
				scrollTop: 0,
				REQUIRE: true,
				loading: false,
				reqLoading: false,
				showKefu:false,
				type:'',
				typeShow:false,
				typeList:[{name:'ALL',id:'',color:'#6173D5'},{name:'Deposit',id:1,color:''},{name:'Withdraw',id:2,color:''},{name:'Withdrawal refund',id:3,color:''},{name:'Bet',id:4,color:''},{name:'Winning',id:5,color:''},{name:'Transfer',id:6,color:''}]

				
			}
		},
		components: {
			AppHeader
		},
		watch:{
		
		},
		activated() {
			window.scrollTo(0,0);
			this.getPointsList();//获取用户账户变更记录
			this.getUserInfo()

		},
		mounted() {
			window.addEventListener('scroll', this.scrollBottomLotteryBetsList);
		},
		beforeDestroy(){
		   window.removeEventListener("scroll",this.scrollBottomLotteryBetsList)
		},
		deactivated() {
			this.reqLoading = false;
			this.typeShow = false;
			this.pointsList = [];
			this.currentPage = 1;
			this.type = ''
			this.typeList = [{name:this.$store.state.system.webLang.All,id:'',color:'#6173D5'},{name:this.$store.state.system.webLang.deposit,id:1,color:''},{name:this.$store.state.system.webLang.withdraw,id:2,color:''},{name:this.$store.state.system.webLang.withdrawal_refund,id:3,color:''},{name:this.$store.state.system.webLang.Bet,id:4,color:''},{name:this.$store.state.system.webLang.Winning,id:5,color:''},{name:this.$store.state.system.webLang.Transfer,id:6,color:''}]
		},
		methods: {
			closeBg() {
				this.showKefu = false
			},
			getUserInfo() {
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					ext:'show'
				}
	
				  axios.post(globals.api.getUserInfo,params)
				  .then(res => {
					console.log(res.data.data.is_agent);
					if(res.data.data.is_agent=='Y') {
						this.typeList = [{name:this.$store.state.system.webLang.All,id:'',color:'#6173D5'},{name:this.$store.state.system.webLang.deposit,id:1,color:''},{name:this.$store.state.system.webLang.withdraw,id:2,color:''},{name:this.$store.state.system.webLang.withdrawal_refund,id:3,color:''},{name:this.$store.state.system.webLang.Bet,id:4,color:''},{name:this.$store.state.system.webLang.Winning,id:5,color:''},{name:this.$store.state.system.webLang.Transfer,id:6,color:''}]
					}else {
						this.typeList = [{name:this.$store.state.system.webLang.All,id:'',color:'#6173D5'},{name:this.$store.state.system.webLang.deposit,id:1,color:''},{name:this.$store.state.system.webLang.withdraw,id:2,color:''},{name:this.$store.state.system.webLang.withdrawal_refund,id:3,color:''},{name:this.$store.state.system.webLang.Bet,id:4,color:''},{name:this.$store.state.system.webLang.Winning,id:5,color:''}]
					}
			
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			returnBack() {
				this.$router.go(-1)
			},
			selectList(date) {
		    	var now = new Date().getTime()
		    	if(date=='Yesterday') {
		    		this.reqDate = [new Date(new Date().getTime()-60*60*24*1000),new Date(new Date().getTime())]
		    	}else if(date=='week') {
		    		this.reqDate = [new Date(new Date().getTime()-60*60*24*7*1000),new Date(new Date().getTime())]
		    	}else if(date=='month') {
		    		this.reqDate = [new Date(new Date().getTime()-60*60*24*30*1000),new Date(new Date().getTime())]
		    	}
		    	this.calendarShow = false;
		    	this.selsetDateStart = `${Number(this.formatDate(this.reqDate[0]))<10?'0'+this.formatDate(this.reqDate[0]):this.formatDate(this.reqDate[0])}`;
				this.selsetDateEnd = `${this.formatDate(this.reqDate[1])}`;
				this.defaultDate = this.reqDate;//默认选择
		    	this.currentPage = 1;
		    	window.scrollTo(0,0);
		    	this.REQUIRE = false
				this.pointsList = []
		      	this.getPointsList();
		    },
		    //选择类型
			onSelecttypeList(item) {
				console.log(item)
				for(let i = 0;i<this.typeList.length;i++) {
					this.typeList[i].color = ''
				}
				this.type = item.id
				item.color = '#6173D5'
				this.typeShow = false;
				this.currentPage = 1;
				window.scrollTo(0,0);
				this.REQUIRE = false
				this.pointsList = []
				this.getPointsList(); //获取用户账户变更记录
			},
			//获取用户账户变更记录
			getPointsList() {
				this.reqLoading = true;
				var params = {
					UserId: localStorage.getItem('userId'),
					UserToken: localStorage.getItem('token'),
					page:this.currentPage,
					limit:10,
					start_time:String(new Date(this.reqDate[0]).getTime()).substring(0,String(new Date(this.reqDate[0]).getTime()).length-3),
					end_time:String(new Date(this.reqDate[1]).getTime()+60*60*24*1000).substring(0,String(new Date(this.reqDate[1]).getTime()).length-3),
					type:this.type
					//日历是按当天0点算的，加上一天才能请求到当天数据
				}

				  axios.post(globals.api.getPointsList,params)
				  .then(res => {
				  	
				  	if (this.currentPage == 1) {
				  		this.pointsList = res.data.data;
						this.pointsListNum = res.data.data.length;
				  	}else {
				  		this.pointsList = this.pointsList.concat(res.data.data);
						this.pointsListNum = res.data.data.length;
				  	}
	
						
			console.log(this.pointsList)
			
			
			
			
					this.REQUIRE = true;
					this.loading = false;
					this.reqLoading = false;
//					this.reqLoading = false;
					  }).catch((error)=>{
			
		       			error.msg?Toast(error.msg):''
		       		})
			},
			formatDate(date) {

	      		return `${(date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)}/${date.getDate()<10?'0'+date.getDate():date.getDate()}`;
	    	},
		    onConfirm(date) {
		      	const [start, end] = date;
		      	this.calendarShow = false;
		      
		      	this.reqDate = date;
				this.selsetDateStart = `${Number(this.formatDate(start))<10?'0'+this.formatDate(start):this.formatDate(start)}`;
				this.selsetDateEnd = `${this.formatDate(end)}`;
	
		      	console.log(this.reqDate)
		      	this.currentPage = 1;
		
		      	this.getPointsList();
		    },
	    	onSelect(date) {
		    	console.log(date)
		    	this.selsetDateStart = this.formatDate(date[0]);
				this.selsetDateEnd = this.formatDate(date[1]);
	    	},

			scrollBottomLotteryBetsList() {
				let osTop = document.documentElement.scrollTop || document.body.scrollTop;
				
			
				if(((window.screen.height + osTop) > (document.body.clientHeight-50)) && this.REQUIRE) {

				if(this.pointsListNum!=10) {
					return
				}
				console.log(this.currentPage)
				this.REQUIRE = false;
				this.loading = true;
				this.currentPage += 1;
				this.getPointsList()
	
			}
		},

		}
	}
</script>

<style lang="scss">
	.changeRecord-wrap {
		background: #F7F6F9;
		min-height: 100vh;
		
		.changeRecord-top {
			display: flex;
			align-items: center;
			background:#fff;
			box-shadow:0px 3px 6px 0px rgba(84,105,119,0.05);
			padding: 0.15rem 0.3rem;
			position:fixed;
			width:100%;
			z-index:999;
			.record-left {
				img {
					width: 0.37rem;
				}
				span {
					font-size: 0.32rem;
					font-weight: 600;
					color: #C71D25;
					margin-left: 0.1rem;
				}
			}
			.calendar {
				flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                .iconrili {
                    font-size: 0.54rem;
                    color: #C81F27;
                }
                div {
                    background:rgba(240,239,239,1);
                    border-radius:0.3rem;
                    font-size: 0.22rem;
                    color: #696969;
                    padding: 0.15rem 0.4rem;
                    margin-left: 0.1rem;
                    text-align: center;
                }
            }
		}
		
		.record-list {
			margin:1.2rem 0.2rem 0 0.2rem;
			.list-block {
				background:#fff;
				box-shadow:0px 3px 6px 0px rgba(84,105,119,0.05);
				border-radius:0.16rem;
				padding: 0.15rem 0.3rem 0.28rem 0.3rem;
				margin-bottom: 0.2rem;
				.blockA {
					display: flex;
					align-items: center;
					.blockA-left {
						font-size: 0.26rem;
						color: #A6A6A6;
					}
					.blockA-right {
						flex: 1;
						text-align: right;
						font-size: 0.22rem;
						color: #767171;
					}
				}
				.blockB {
					display: flex;
					align-items: center;
					margin: 0.1rem 0 0.1rem 0;
					.blockB-left {
						font-size: 0.25rem;
						font-weight: 600;
					}
					.blockB-right {
						flex: 1;
						text-align: right;
						font-size: 0.22rem;
						color: #767171;
					}
				}
				.blockC {
					display: flex;
					align-items: center;
					.blockC-left {
						color: #797677;
						.add-amount {
							color: #74D20E;
						}
						.cut-amount {
							color: #D0021B;
						}
					}
					.blockC-right {
						flex: 1;
						text-align: right;
						color: #797677;
					}
				}
			}
		}
	}
</style>