import * as moment from "moment";
import * as types from '../../store/types';
import globals from '../../api/config';
import axios from 'axios';
import { Toast } from 'vant';
import AppHeader from '../../components/Header.vue';

export default {
	data() {
		return {
			lotteryList:[],//开奖历史
			lotteryClass:[],//彩种种类
			lotteryDetailShowA:false,//开奖详情显示
			lotteryDetail:[],//开奖详情
			scrollTop: 0,
			REQUIRE: true,
			loading: 1,
			isLoading:false,
			currentPage:1,
			lotteryListNum:0,
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

	},
	mounted() {
		window.addEventListener('scroll', this.scrollBottomLotteryListHis);
	},
	beforeDestroy(){
		
	   window.removeEventListener("scroll",this.scrollBottomLotteryListHis)

	},

	activated() {
		window.scrollTo(0,0)

		this.getLotteryClass();//彩种种类

		console.log(this.userInfo)
	},
	deactivated() {
		this.lotteryDetailShowA = false;
		this.currentPage = 1;
		this.REQUIRE = true;
		this.loading = 1;
		this.lotteryList = []

	},

	methods: {
		returnBack() {
			this.$router.go(-1)
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
		getNumB(num) {
			var list = [];
	
		},
		//获取历史开奖记录
		getLotteryList() {
			this.loading = true;
			var params = {
				status:3,
				page:this.currentPage,
				limit:10,
				lottery_type:this.$route.query.type,
				lottery_id:this.$route.query.id
			}
			if(this.currentPage==11) return
			axios.post(globals.api.getLotteryList,params).then((res)=>{
				
				
				if (this.currentPage == 1) {
	              	this.lotteryListNum = res.data.data.length;

	              	var temp = res.data.data;
	
	              	for(let i = 0;i<temp.length;i++) {
	              		if(temp[i].lottery_type==1) {
	              			temp[i].prize_1 = this.getNum(temp[i].prize_1)
	              		}
						
						for(let j = 0;j<this.lotteryClass.length;j++) {
							if(temp[i].lottery_id == this.lotteryClass[j].id) {
								temp[i].win_1_points = this.lotteryClass[j].win_1_points
							}
						}
					}
	              	
	              	this.lotteryList = this.lotteryList.concat(temp);
			

	              	
	              	
		
					
	              		
	          } else {
		 			this.lotteryListNum = res.data.data.length;
		 			
		 			var temp = res.data.data;
		 			
		 			for(let i = 0;i<temp.length;i++) {
						if(temp[i].lottery_type==1) {
	              			temp[i].prize_1 = this.getNum(temp[i].prize_1)
	              		}
					}

					this.lotteryList = this.lotteryList.concat(temp);
					
		 			
	         	 }

//				console.log(this.lotteryList)
				this.REQUIRE = true;
				this.loading = false;

       		}).catch((error)=>{
       			this.loading = false;
       		})
		},
		scrollBottomLotteryListHis() {
			let osTop = document.documentElement.scrollTop || document.body.scrollTop;

			if(((window.screen.height + osTop) > (document.body.clientHeight-50)) && this.REQUIRE) {
	
				if(this.lotteryListNum!=10||this.currentPage==10) {
					return
				}
				this.REQUIRE = false;
				this.loading = true;
				this.currentPage += 1;
				this.getLotteryList()

				
			}
		},
		//获取彩票种类信息
		getLotteryClass() {
	
			axios.post(globals.api.getLotteryClass).then((res)=>{
				this.lotteryClass = res.data.data;
		
				var temp = {name:'ALL',id:'',color:'#6173D5'}
				this.lotteryClass.unshift(temp)

				this.getLotteryList();//获取历史开奖记录


       		}).catch((error)=>{})
		},
		//打开开奖详情
		openLotteryDetailA(item){
			
		
			if(item.lottery_type==1) {
				//彩票
				if(!Array.isArray(item.prize_2)){
					item.prize_2 = item.prize_2.split(',')
					item.prize_3 = item.prize_3.split(',')
					item.prize_4 = item.prize_4.split(',')
					item.prize_5 = item.prize_5.split(',')
					item.prize_6 = this.getNumA(item.prize_6)
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
				
			}
			
//			console.log(this.lotteryDetail)
			this.lotteryDetailShowA = true;

        },
		//立即购买
		toResults() {
			this.lotteryDetailShowA = false;
			
			this.$router.push({name:'lottery',query:{type:this.$route.query.type,id:this.$route.query.id}})
		},
		//跳转开奖视频
		toVideo(video_url) {
			this.lotteryDetailShowA = false;
			this.$router.push({name:'video',query:{detail:video_url}})
		},
		//跳转数据网站
		toNet(video_url) {
			this.lotteryDetailShowA = false;
			window.location.href = video_url
		},
		getNewTime(time) {
			if(time) {
				var timeA = new Date(time.replace(/-/g,'/')).getTime();
				return moment(timeA).format('YYYY/MM/DD');
			}
		}
		


	}
};