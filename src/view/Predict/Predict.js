import Tabbar from '../../components/Tabbar.vue';
import * as moment from "moment";
import * as types from '../../store/types';
import globals from '../../api/config';
import axios from 'axios';
import { Toast,Dialog } from 'vant';
import IndexHeader from '../../components/IndexHeader2.vue';
import FloatBall from '../../components/FloatBall.vue';
// import LotteryNotice from '../../components/LotteryNotice.vue';


export default {
	data() {
		return {
			myChart:'',
			date:{},
			active: 0,
			active2: 0,
			value1: 0,
			value2: 0, //指数类型sum end single
			thisTime:[],
			dropdownMenu: [
				{ text: 'All', value: 0 },
				{ text: '1st Digit', value: 1 },
				{ text: '2nd Digit', value: 2 },
				{ text: '3rd Digit', value: 3 },
			],
			dropdownMenu2: [
				{ text: 'Ending Number', value: 0 },
				{ text: 'Sum Number', value: 1 },
				{ text: 'Single Or Double', value: 2 },
			],
			reveal: false,
			acIndex: 1,
			ctime:'',
			actions: [
				{ name: 'Winning Rank', id: 0 ,type:1},
				{ name: 'Bet Rank', id: 1 ,type:2},
				{ name: 'Profits Rank', id: 2 ,type:3},
				{ name: 'Losing Rank', id: 3 ,type:4}
			],
			thasName:'Winning Rank',
			option: {
				tooltip: {
					trigger: 'axis',
					formatter: function (params, ticket, callback) {
            // console.log(params);
            var showHtm="";
            for(var i=0;i<params.length;i++){
                //x轴名称
                var name = params[i].axisValue;
                //名称
                var text = params[i].seriesName;
                //值
                var value = params[i].data;
                showHtm+= 'Number: '+ name + "<br />"+' Count: ' + value+'<br>'
            }
            return showHtm;
        }
			
				},
				xAxis: {
					show: true,
					type: 'category',
					data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
				},
				yAxis: {
					show: true,
					type: 'value'
				},
				series: [{
					name:'Count',
					data: [],
					type: 'line',
					itemStyle: {
						normal: {
							// color: '#8cd5c2', //改变折线点的颜色
							lineStyle: {
								color: '#c0504d' //改变折线颜色
							}
						}
					},
				}],
				grid: {
					x: 40,
					y: 10,
					x2: 20,
					y2: 20
				},
			},
			option2: {
				xAxis: {
					show: false,
				},
				yAxis: {
					show: false,
				},
					tooltip: {
							trigger: 'item',
							formatter: '{b} : {c} ({d}%)'
				},
				color:['#648d44', '#b00005'],
					series: [
							{
									name: '',
									type: 'pie',
									radius: '75%',
									center: ['50%', '50%'],
									data: [
										{value: 2500, name: 'Single'},
										{value: 3500, name: 'Double'},
									],
									emphasis: {
											itemStyle: {
													shadowBlur: 5,
													shadowOffsetX: 0,
													shadowColor: 'rgba(0, 0, 0, 0.5)'
											}
									}
							}
				],
				grid: {
					x: 40,
					y: 10,
					x2: 20,
					y2: 20
				},
			},
			// 排行
			// seniority2: [
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "33317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "3137", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "3137", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			// 	{date: "2021-04-01", user_id: "317", wins: "22286", stat_value: "22286", nickname: "testuser1"},
			
			// ],
			// 两个i数组排行榜
			seniority: [],
			seniority2: [],
			jiangli: [
				{}
			],
			numberFirst: '',
			numberFirst2: '',
			numberFirst3: '',
			sumNumber: [],		//sum推荐
			honglu: 1,
			page: 1,
			pageSize: 10,
			comments: [],	//评论列表
			weihao: false, //数据加载完上拉显示
			loadly: false,
			content: '',
			gouzi:true

		}
	},

	components: {
		Tabbar,
		IndexHeader,
		FloatBall,
		// LotteryNotice
	},
	filters: {
		toThousandFilter: function (val) {
			return (+val || 0).toFixed(0).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
		}
	},
	computed: {
		sty() {
			// let num = Number(this.active) * 100
			// return `transform: translate3d(-${num}%,0px,0px);transition-duration: 0.3s;`
		}
	},

	watch: {
		content() {
			
			
		},
		option: {
			deep: true,
			handler: function (newVal, oldVal) {
				if (newVal) {
					this.myChart.setOption(newVal,true)
				} else {
					this.myChart.setOption(oldVal,true)
				}
				// this.myChart.resize();
			  }
		},
		option2: {
			deep: true,
			handler: function (newVal, oldVal) {
				if (newVal) {
					this.myChart.setOption(newVal,true)
				} else {
					this.myChart.setOption(oldVal,true)
				}
				// this.myChart.resize();
			  }
		},
		
	},
	// beforeCreate: function() {
	// 	document.getElementsByTagName("body")[0].className="active22";
	// },
	// beforeDestroy: function () {
	// 		alert('222')
	// 		document.body.removeAttribute("class","active");
	// },
	activated() {
		// this.weihao = false;
		// this.loadly = false;
		// this.page = 1;
		// this.comments = [];
		// this.getComments();
		// console.log(222);
		
	},
	mounted() {
		this.getTodayDate();
		this.createChart(this.option);
		this.rewardData();
	},
	

	methods: {
	
		onLoadLy() {
			this.getComments();
		},
		// item改变时触发
		activeTab() {
			if (this.active < 2) {
				this.getData()
			} else {
				// 获取排行版
			
				// this.rewardData();
				this.getTop(this.acIndex);
			}
		},
		createChart(Type) {
			// 基于准备好的dom，初始化echarts实例
			this.myChart = this.$echarts.init(document.getElementById('myChart'))
			// 绘制图表
			this.myChart.setOption(Type,true);
			window.addEventListener('resize', () => {
				// 自动渲染echarts
				this.myChart.resize();
		})
		},
	
		timeTab(index) {
			
			if (index == 0)
				this.getTodayDate();
			
			if (index == 1) {
				this.getLastWeek();
			}
			if (index == 2) {
				this.getLastMonth();
			}
		},
		// 指数玩法类型切换
		bseType(value) {
			console.log(value);
			if (value == 0) {
				this.option.series[0].data = this.date.Ending.all;
				this.createChart(this.option);
			}
			if (value == 1) {
				this.option.series[0].data = this.date.Sum;
				this.createChart(this.option);
			
			}
			if (value == 2) {
				// console.log(this.date.Single[1]);
				// console.log(this.date.Single[2]);
				// var obj = this.date.Single;
				// console.log(Object.keys(obj));
				this.option2.series[0].data[0].value = this.date.Single[1];
				this.option2.series[0].data[1].value = this.date.Single[2];
				this.createChart(this.option2);
			}
		},

		// 排行榜
		onSelect(item) {
			console.log(item);
			this.thasName = item.name;
			this.acIndex = item.type;
			this.reveal = false
			for (let i = 0; i < this.actions.length; i++) {
				this.actions[i].color = ''
			}
			item.color = '#6173D5'
			this.rewardData2(this.acIndex);
			this.getTop(this.acIndex);
			
		},
		
		add0(m) {
			return m<10?'0'+m:m
		},
		// 获取上月第一天
		 getPriorMonthFirstDay(year, month) {
			//年份为0代表,是本年的第一月,所以不能减
			if (month == 0) {
					month = 11; //月份为上年的最后月份
					year--; //年份减1
					return new Date(year, month, 1);
			}
			//否则,只减去月份
			month--;
			return new Date(year, month, 1); 
	},
	 getMonthDays(year, month) {
		var new_year = year; //取当前的年份 
	var nextMonth = month++;
	if (month>12) {
		nextMonth -=12; //月份减 
		new_year++; //年份增 
	}
		var nextMonthFirstDay=new Date(new_year,nextMonth,1);//下个月第一天
		var oneDay=1000*60*60*24;
		var dateString=new Date(nextMonthFirstDay-oneDay);
		var dateTime = dateString.getDate();
		return dateTime;
},

		// 获取当天24小时
		getTodayDate(){
			// var today = [];
			var todayDate = new Date();
			var y = todayDate.getFullYear();  
			var m = todayDate.getMonth() + 1;
			var d = todayDate.getDate();
			var s = y+'-'+this.add0(m)+'-'+this.add0(d)+' 00:00:00';//今日开始
			var e = y + '-' + this.add0(m) + '-' + this.add0(d) + ' 23:59:59';//今日结束
			this.thisTime = [];
			this.thisTime.push(s);
			this.thisTime.push(e);
			// return(this.thisTime[1]);
			this.getData();
		},
		// 获取上周
		getLastWeek(){
			//起止日期数组
				var startStop = new Array();
				//获取当前时间
				var currentDate = new Date();
				//返回date是一周中的某一天
				var week = currentDate.getDay();
				//返回date是一个月中的某一天
				var month = currentDate.getDate();
				//一天的毫秒数
				var millisecond = 1000 * 60 * 60 * 24;
				//减去的天数
				var minusDay = week != 0 ? week - 1 : 6;
				//获得当前周的第一天
				var currentWeekDayOne = new Date(currentDate.getTime() - (millisecond * minusDay));
				//上周最后一天即本周开始的前一天
				var priorWeekLastDay = new Date(currentWeekDayOne.getTime() - millisecond);
				//上周的第一天
				var priorWeekFirstDay = new Date(priorWeekLastDay.getTime() - (millisecond * 6));
				var sy = priorWeekFirstDay.getFullYear();  
				var sm = priorWeekFirstDay.getMonth() + 1;
				var sd = priorWeekFirstDay.getDate();
				var ey = priorWeekLastDay.getFullYear();  
				var em = priorWeekLastDay.getMonth() + 1;
				var ed = priorWeekLastDay.getDate();
				var s = sy+'-'+this.add0(sm)+'-'+this.add0(sd)+' 00:00:00';//开始
				var e = ey+'-'+this.add0(em)+'-'+this.add0(ed)+' 23:59:59';//结束
				this.thisTime = [];
				this.thisTime.push(s);
				this.thisTime.push(e);
			// return startStop;
				this.getData();
		},
	//  获取上个月
	getLastMonth(){
 	
		// var startStop = new Array();
		//获取当前时间
		var currentDate = new Date();
		//获得当前月份0-11
		var currentMonth = currentDate.getMonth();
		//获得当前年份4位年
		var currentYear = currentDate.getFullYear();
		//获得上一个月的第一天
		var priorMonthFirstDay = this.getPriorMonthFirstDay(currentYear, currentMonth);
		console.log(priorMonthFirstDay);
		//获得上一月的最后一天
		var priorMonthLastDay = new Date(priorMonthFirstDay.getFullYear(), priorMonthFirstDay.getMonth(), this.getMonthDays(priorMonthFirstDay.getFullYear(), priorMonthFirstDay.getMonth()));
		var sy = priorMonthFirstDay.getFullYear();  
		var sm = priorMonthFirstDay.getMonth() + 1;
		var sd = priorMonthFirstDay.getDate();
		var ey = priorMonthLastDay.getFullYear();  
		var em = priorMonthLastDay.getMonth() + 1;
		var ed = priorMonthLastDay.getDate();
		var s = sy+'-'+this.add0(sm)+'-'+this.add0(sd)+' 00:00:00';//开始
		var e = ey+'-'+this.add0(em)+'-'+this.add0(ed)+' 00:00:00';//结束
		this.thisTime = [];
		this.thisTime.push(s);
		this.thisTime.push(e);
		console.log(this.thisTime);
		this.getData();
		// console.log(startStop);
		// return startStop;
},
//  secondMax (arr){ 
// 	var max = Math.max.apply(null, arr), // get the max of the array
// 			maxi = arr.indexOf(max);
// 	arr[maxi] = -Infinity; // replace max in the array with -infinity
// 	var secondMax = Math.max.apply(null, arr); // get the new max 
// 	arr[maxi] = max;
// 	return secondMax;
// },
 secondMax (dataArr){ 
	var arr = dataArr;
	
	// 求最大值、次大值和第三大值
	var fMax = arr[0];
	var sMax = arr[1];
	var tMax = arr[2];
	for (let i = 1; i < arr.length; i++) {
		if (fMax < arr[i]) {
			tMax = sMax;
			sMax = fMax;
			fMax = arr[i];
		} else if (sMax < arr[i] && fMax > arr[i]) {
			tMax = sMax;
			sMax = arr[i];
		} else if(tMax < arr[i] && sMax > arr[i]) {
			tMax = arr[i];
		}
	 }
	 var res = new Array();
	 res.push(fMax)
	 res.push(sMax)
	 res.push(tMax)
	 return res
	
		},
//  获取折现图
		getData() {
			// 获取24小时
			// this.getTodayDate();
			let number = 2;
			if (this.active == 1) {
				number = 1;
			}
			var params = {
				lottery_id: number,
				start_time: this.thisTime[0],
				end_time: this.thisTime[1]
			}
			axios.post(globals.api.lotteryData,params).then((res) => {
				if (res.data.code == 200) {
					// console.log(res.data.data);
					this.date = res.data.data;
					// 统计次数最多是数组前三
					var first1= this.secondMax(this.date.Ending.prize_1);
					var first2= this.secondMax(this.date.Ending.prize_2);
					var first3= this.secondMax(this.date.Ending.prize_3);
					// console.log(first1, first2, first3);
					var num = this.date.Ending.prize_1.indexOf(first1[0])+'';
					var num2 = this.date.Ending.prize_2.indexOf(first2[0])+'';
					var num3 = this.date.Ending.prize_3.indexOf(first3[0]) + '';
					this.numberFirst = num + num2 + num3;
					var num4 = this.date.Ending.prize_1.indexOf(first1[1])+'';
					var num5 = this.date.Ending.prize_2.indexOf(first2[1])+'';
					var num6 = this.date.Ending.prize_3.indexOf(first3[1]) + '';
					this.numberFirst2 = num4 + num5 + num6;
					var num7 = this.date.Ending.prize_1.indexOf(first1[2])+'';
					var num8 = this.date.Ending.prize_2.indexOf(first2[2])+'';
					var num9 = this.date.Ending.prize_3.indexOf(first3[2]) + '';
					this.numberFirst3 = num7 + num8 + num9;
					// console.log(this.numberFirst,this.numberFirst2,this.numberFirst3);

					// sum
					// 从大到小排序
					const map1 = this.date.Sum;
					const arrSum = map1.map(x => x * 1);  //这他妈的才不会改变原数组
					// this.sumNumber = arr.sort((a, b) => b - a)
					// console.log(this.sumNumber);
					// console.log(this.date.Sum);
					var max;
						for (var i = 0; i < arrSum.length; i++) {
							for (var j = i; j < arrSum.length; j++) {
								if (arrSum[i] < arrSum[j]) {
									max = arrSum[j]
									arrSum[j] = arrSum[i]
									arrSum[i] = max
								}
							}
						}
					//console.log(arrSum);  //排序后
					//console.log(this.date.Sum);
					var sum1 = this.date.Sum.indexOf(arrSum[0])+'';
					var sum2 = this.date.Sum.indexOf(arrSum[1])+'';
					var sum3 = this.date.Sum.indexOf(arrSum[2])+'';
					var sum4 = this.date.Sum.indexOf(arrSum[3])+'';
					var sum5 = this.date.Sum.indexOf(arrSum[4]) + '';
					var str = sum1 + sum2 + sum3 + sum4 + sum5;
					var sumStr = str.split("");
					this.sumNumber = sumStr.join();
					// console.log(this.sumNumber);
					this.honglu = Math.ceil(Math.random() * 10);
					console.log(this.honglu);
					// 指数类型
					if (this.value2 == 0) {
						this.option.series[0].data = this.date.Ending.all;
					} 
					if (this.value2 == 1) {
						this.option.series[0].data = this.date.Sum;
					} 
					if (this.value2 == 2) {
						this.option2.series[0].data[0].value = this.date.Single[1];
						this.option2.series[0].data[1].value = this.date.Single[2];
					} 
					// this.option.series[0].data = this.date.Sum;
					

				} else {
					Toast(res.data.msg)
				}
			}).catch((error)=>{
				console.log(error)
				this.reqLoading = false;
				error.msg?Toast(error.msg):''
			})

		},
		
		// 排行榜获取
		getTop(type) {
		
			var todayDate = new Date();
			var y = todayDate.getFullYear();  
			var m = todayDate.getMonth() + 1;
			var d = 1;
			this.ctime = y + '-' + this.add0(m) + '-' + this.add0(d);
			console.log(this.ctime);
			
			var params = {
				type: type,
				date: this.ctime,
				// date: '2021-04-01',
			}
			axios.post(globals.api.rankingData, params).then((res) => {
				if (res.data.code == 200) {
					// console.log(res.data);
					var arr = res.data.data;
					console.log(arr);
					if (arr == '') {
						this.gouzi = false
					}
					console.log(this.gouzi);
					this.seniority = arr.slice(0, 3);
					console.log(this.seniority);
				
					this.seniority[0] = this.seniority.splice(1, 1, this.seniority[0])[0];
					this.seniority2 = arr.slice(3);
				
				}
			})
		},
		// 排行榜奖励1-4
		rewardData() {
			var params = {
				type: 0
			}
			axios.post(globals.api.rewardData, params).then((res) => {
				if (res.data.code == 200) {
					// console.log(res.data);
				
					var arrActions = res.data.data;
					for (let i = 0; i < arrActions.length; i++) {
						// if (arrActions[i].status == 1) {
						// 	this.actions.splice(arrActions[i].type - 1, 1);
						// 	console.log(this.actions);
						// }
						if (arrActions[i].type == 1) {
							arrActions[i].name = "Winning Rank"
						}
						if (arrActions[i].type == 2) {
							arrActions[i].name = "Bet Rank"
						}
						if (arrActions[i].type == 3) {
							arrActions[i].name = "Profits Rank"
						}
						if (arrActions[i].type == 4) {
							arrActions[i].name = "Losing Rank"
						}
					}
					for (var i = 0; i < arrActions.length; i++) {
						if (arrActions[i]["status"] == 1) {
							arrActions.splice(i, 1);
								i--;
						}
					}
					this.actions = arrActions;
					this.jiangli = res.data.data;
					console.log(this.jiangli);
					
				
					
				}
			})
		},
		// 排行榜奖励
		rewardData2(type) {
			var params = {
				type: type
			}
			axios.post(globals.api.rewardData, params).then((res) => {
				if (res.data.code == 200) {
					this.jiangli = res.data.data;
					console.log(this.jiangli);
				}
			})
		},
		// 评论列表
		getComments() {
			var params = {
				pageIndex: this.page,
				pageSize:this.pageSize
			}
			axios.post(globals.api.getComments, params).then((res) => {
				if (res.data.code == 200) {
					setTimeout(() => {
						const list = res.data.data;
						this.loadly = false;
						this.comments = this.comments.concat(list);
						console.log(this.comments);
						if (list.length < this.pageSize) {
							this.weihao = true;
							
						} else {
							this.page++
						}
					},1000)
				
				
				}
			})
			.catch((error)=>{
				console.log(error)
				error.msg?Toast(error.msg):''
			})
		},
		// 发布留言
		publishComment() {
		
			if (!this.content) {
				Toast("Please enter a message")
				return;
			}
			var contentText = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
			if (contentText.test(this.content)) {
				Toast('Prohibit Links')
				return;
			}
			var params = {
				UserId: localStorage.getItem('userId'),
				UserToken:localStorage.getItem('token'),
				content: this.content
			}
			
		
			
			// this.$store.state.system.systemInfo.default_avatar
			// console.log(heightTop);
			// console.log(this.$refs.msgTop.scrollTop); 
			axios.post(globals.api.publishComment, params).then((res) => {
				if (res.data.code == 200) {
					console.log(res.data);
					var myObj = {
						// avatar: this.$store.state.system.systemInfo.default_avatar,
						avatar: this.$store.state.user.info.avatar,
						nickname:this.$store.state.user.info.nickname,
						content:this.content
					}
					this.comments.unshift(myObj);
					this.content = ''
					document.getElementsByClassName('van-list')[0].scrollTop = 0;
				}
			}).catch(() => {
				error.msg?Toast(error.msg):''
			})
		},
		// 发表留言
		
		// 下拉刷新
		// onRefresh() {
    //   // 清空列表数据
    //   this.finished = false;

    //   // 重新加载数据
    //   // 将 loading 设置为 true，表示处于加载状态
    //   this.loadly = true;
    //   this.getComments();
    // },
		// 位数设置
		digit(value) {
			if (value == 0) {
				this.option.series[0].data = this.date.Ending.all;
			}
			if (value == 1) {
				this.option.series[0].data = this.date.Ending.prize_1;
			}
			if (value == 2) {
				this.option.series[0].data = this.date.Ending.prize_2;
			}
			if (value == 3) {
				this.option.series[0].data = this.date.Ending.prize_3;
			}
		}
	}
};