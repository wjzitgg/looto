import * as moment from "moment";
import * as types from '../../store/types';
import globals from '../../api/config';
import axios from 'axios';
import { Toast,Dialog } from 'vant';
import AppHeader from '../../components/Header.vue';


export default {
	data() {
		return {
			lotteryClassShow:false,
			lotteryClass:[],
			lotteryIndex:0,//所选彩种下标
			lotteryBetsList:[],
			currentPage:1,
			reqLoading:false,
			scrollTop: 0,
			REQUIRE: true,
			loading: false,
			isLoading:false,
			lotteryBetsListNum:'',
			checked:false,//只看开奖
			status:'2,5,7',//中奖，未中奖
			calendarShow:false,//日历显示
			minDate:new Date(new Date().getTime()-60*60*24*365*1000),
			maxDate:new Date(new Date().getTime()),
			defaultDate:[new Date(new Date().getTime()-60*60*24*30*1000),new Date(new Date().getTime())],
			reqDate:[new Date(new Date().getTime()-60*60*24*30*1000),new Date(new Date().getTime())],
			selsetDateStart:moment(new Date().getTime()-60*60*24*30*1000).format('MM/DD'),
			selsetDateEnd:moment(new Date().getTime()).format('MM/DD'),
			lotteryDetailShowB:false,//开奖详情显示
			lotteryDetail:[],//开奖详情
			activeNames:[]
		}
	},
	components: {
		AppHeader

	},
	computed: {
		userInfo() {
			return this.$store.state.user.info;
		}
	},
	watch: {
		checked(val) {
			console.log(val)
			if(val) {
				this.status = 5
			}else {
				this.status = '5,7'
			}
			this.currentPage = 1;
			this.getLotteryBetsList();
		}
	},
	mounted() {
		window.addEventListener('scroll', this.scrollBottomLotteryBetsList);
	},
	beforeDestroy(){
	   window.removeEventListener("scroll",this.scrollBottomLotteryBetsList)
	},
	activated() {
		this.getLotteryClass();//获取彩票种类信息

	},
	deactivated() {
		this.currentPage = 1;
		this.reqLoading = false;
		this.lotteryDetailShowB = false;

	},

	methods: {
		//获取彩票种类信息
		getLotteryClass() {
	
			axios.post(globals.api.getLotteryClass).then((res)=>{
				this.lotteryClass = res.data.data;
		
				var temp = {name:this.$store.state.system.webLang.All,id:'',color:'#6173D5'}
				this.lotteryClass.unshift(temp)
				console.log(this.lotteryClass)


				this.getLotteryBetsList();//获取用户投注列表
				

       		}).catch((error)=>{})
		},
		//选择彩种
		onSelectLotteryClass(item) {
			console.log(item)
			for(let i = 0;i<this.lotteryClass.length;i++) {
				this.lotteryClass[i].color = ''
				if(item.id==this.lotteryClass[i].id) {
					this.lotteryIndex = i;
				}
			}
			item.color = '#6173D5'
			this.lotteryClassShow = false;
			this.currentPage = 1;
			this.getLotteryBetsList(item.id); //获取用户投注列表
		},
		scrollBottomLotteryBetsList() {
			let osTop = document.documentElement.scrollTop || document.body.scrollTop;
			

			if(((window.screen.height + osTop) > (document.body.clientHeight-50)) && this.REQUIRE) {

				if(this.lotteryBetsListNum!=10) {
					return
				}
				this.REQUIRE = false;
				this.loading = true;
				this.currentPage += 1;
				this.getLotteryBetsList()

				
			}
		},
		//获取用户投注列表
		getLotteryBetsList() {
			this.reqLoading = true;
			console.log()
			var start_time = 
			console.log(start_time)
			
			var params = {
				UserId:localStorage.getItem('userId'),
				UserToken:localStorage.getItem('token'),
				lottery_id: this.lotteryIndex==0?'':this.lotteryClass[this.lotteryIndex].id, //彩票ID
				status:this.status, //状态,多个条件用逗号分隔 1待支付 2未付费 3待开奖 5中奖 7未中奖
				page:this.currentPage,
				limit:10,
				start_time:String(new Date(this.reqDate[0]).getTime()).substring(0,String(new Date(this.reqDate[0]).getTime()).length-3),
				end_time:String(new Date(this.reqDate[1]).getTime()+60*60*24*100).substring(0,String(new Date(this.reqDate[1]).getTime()).length-3)
				//日历是按当天0点算的，加上一天才能请求到当天数据
			}

			axios.post(globals.api.getLotteryBetsList,params).then((res)=>{	
				if(res.data.code==200) {
					
					if (this.currentPage == 1) {
		              	this.lotteryBetsListNum = res.data.data.length;
		              	console.log(this.lotteryBetsListNum)
		              	var temp = res.data.data
						
						console.log(temp)
						
						
						
						var map = {},
						dest = [];
						for(var i = 0; i < temp.length; i++){
						    var ai = temp[i];
						    if(!map[ai.lottery_no_id]){
						        dest.push({
						            lottery_no_id: ai.lottery_no_id,
						            list: [ai],
						            lottery_type: ai.lottery_type
						        });
						        map[ai.lottery_no_id] = ai;
						    }else{
						        for(var j = 0; j < dest.length; j++){
						            var dj = dest[j];

						            if(dj.lottery_no_id == ai.lottery_no_id&&dj.lottery_type==ai.lottery_type){
						                dj.list.push(ai);
						                break;
						            }
						        }
						    }
						}
						this.lotteryBetsList = dest
						console.log(dest);
						
						
						
//						var tempId = [];
//						for(let i = 0;i<this.lotteryBetsList.length;i++) {
//							for(let j = 0;j<this.lotteryBetsList[i].list.length;j++) {
//								tempId.push(this.lotteryBetsList[i].list[j].id)
//							}
//						}
//						
//			
//						this.activeNames = tempId
//						
//						console.log(this.activeNames)
						
						
						
						
						
						
						
						
						
						//下期开奖倒计时
//						var now = new Date(this.sysTime);
//						var year = now.getFullYear();
//					    var mon = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
//					    var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
//						var hour = now.getHours();
//						var minute = now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes();
//						
//						var nowTime = hour+''+minute
						
//						var lotteryClassTemp = this.lotteryClass.slice(1);//临时
//	
//				console.log(lotteryClassTemp)
////						
//						var arr  = lotteryClassTemp.map((item) => {
////							var statTime = year+'-'+mon+'-'+day+' '+ item.lottery_time+':00'
//					
//					          return {
//					            id: item.id,
//					            name: item.name,
////					            lottery_time: Number(nowTime)>Number((item.lottery_time).replace(':',""))?(new Date(statTime).getTime()+24*60*60*1000)/1000:(new Date(statTime).getTime())/1000,
//					            list: [],
//					            type:item.type?item.type:2
//					          };
//
//			      		});
//
//
//					
//						console.log(arr)
//			
//			
//						
//
//						for(let i = 0;i<arr.length;i++) {
//							for(let j = 0;j<temp.length;j++) {
//								if(arr[i].id==temp[j].lottery_no_info.lottery_id&&arr[i].type==temp[j].lottery_no_info.lottery_type) {
//									arr[i].list.push(temp[j])
//								}
//							}
//				
//						}
//					
//
//						this.lotteryBetsList = arr;
						
					
					}else {
						
						var temp = res.data.data;
						this.lotteryBetsListNum = res.data.data.length;
						console.log(this.lotteryBetsListNum)
						var map = {};
						var dest = this.lotteryBetsList;
						for(var i = 0; i < temp.length; i++){
						    var ai = temp[i];
						    if(!map[ai.lottery_no_id]){
						        dest.push({
						            lottery_no_id: ai.lottery_no_id,
						            list: [ai],
						            lottery_type: ai.lottery_type
						        });
						        map[ai.lottery_no_id] = ai;
						    }else{
						        for(var j = 0; j < dest.length; j++){
						            var dj = dest[j];

						            if(dj.lottery_no_id == ai.lottery_no_id&&dj.lottery_type==ai.lottery_type){
						                dj.list.push(ai);
						                break;
						            }
						        }
						    }
						}
						this.lotteryBetsList = dest
						console.log(dest);
						
//						var tempId = [];
//						for(let i = 0;i<this.lotteryBetsList.length;i++) {
//							for(let j = 0;j<this.lotteryBetsList[i].list.length;j++) {
//								tempId.push(this.lotteryBetsList[i].list[j].id)
//							}
//						}
//						
//			
//						this.activeNames = tempId
//						
//						console.log(this.activeNames)

					
				
						
						
						
					}
					this.REQUIRE = true;
					this.loading = false;
					this.reqLoading = false;
					console.log(this.lotteryBetsList)
				}

       		}).catch((error)=>{
       			console.log(error)
       			this.reqLoading = false;
       			error.msg?Toast(error.msg):''
       		})
		},
		//关闭彩种选择弹窗
		onCancel() {
			this.lotteryClassShow = false;
		},
		returnBack() {
			this.$router.go(-1)
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

	      console.log(this.selsetDateStart)
	      this.currentPage = 1;
	
	      this.getLotteryBetsList();
	    },
	    onSelect(date) {
	    	console.log(date)
	    	this.selsetDateStart = this.formatDate(date[0]);
			this.selsetDateEnd = this.formatDate(date[1]);
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
	
	      	this.getLotteryBetsList();
	    },
	    getNum(num) {
			var a = num.substring(0,2);
			var b = num.substring(2,3);
			var c = num.substring(3,4);
			var d = num.substring(4,5);
			var e = num.substring(5,6);
			var f = num.substring(6,7);
			var g = num.substring(7,8);
			
			var list = [];
			list.push(a,b,c,d,e,f,g)

			return list
		},
	    getNumA(num) {
			
			var a = num.substring(0,1);
			var b = num.substring(1,2);
			var c = num.substring(2,3);

			
			var list = [];
			list.push(a,b,c)

			return list
		},
	    //打开开奖详情
		openLotteryDetailB(item){
			
			console.log(item)
			if(item.lottery_type==1) {
				//彩票
				if(!Array.isArray(item.prize_2)){
					item.prize_1 = this.getNum(item.lottery_no_info.prize_1)
					item.prize_2 = item.lottery_no_info.prize_2.split(',')
					item.prize_3 = item.lottery_no_info.prize_3.split(',')
					item.prize_4 = item.lottery_no_info.prize_4.split(',')
					item.prize_5 = item.lottery_no_info.prize_5.split(',')
					item.prize_6 = this.getNumA(item.lottery_no_info.prize_6)
					item.list = []
					for(let i = 0;i<this.lotteryClass.length;i++) {
						
						if(this.lotteryClass[i].id == item.lottery_id) {
							item.list.push(this.lotteryClass[i].win_1_points,this.lotteryClass[i].win_2_points,this.lotteryClass[i].win_3_points,this.lotteryClass[i].win_4_points,this.lotteryClass[i].win_5_points,this.lotteryClass[i].win_6_points,this.lotteryClass[i].win_c_points)
						}
					}
				}
				
				this.lotteryDetail = item;
			}else {
				//指数
				this.lotteryDetail = item;
				console.log(this.lotteryDetail)
			}
			
		console.log(this.lotteryDetail)
			this.lotteryDetailShowB = true;
        },
        //立即购买
		toResults() {
			this.$router.push({name:'results',query:{id:this.$route.query.id}})
		},
		//跳转开奖视频
		toVideo(video_url) {
			this.$router.push({name:'video',query:{detail:video_url}})
		},
		//跳转开奖历史
		toHisResults(item) {
//			console.log(item)
			this.$router.push({name:"hisResults",query:{id:item.lottery_id}})
		},
		//跳转数据网站
		toNet(video_url) {
			window.location.href = video_url
		},
		watchChange(index) {
			console.log(index)
		},
		getValue(id) {
			if(this.activeNames.includes(id)) {
				return false
			}else {
				return true
			}
		},
		getNewTime(time) {
			if(time) {
				var timeA = new Date(time.replace(/-/g,'/')).getTime();
				return moment(timeA).format('YYYY/MM/DD');
			}
		}
	}
};