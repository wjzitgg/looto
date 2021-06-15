<template>
	<div class="hisResults-wrap">
		
		
		<app-header title="Results history" v-on:clickLeft="returnBack" :right="true">
			
			<template slot="right">
		        <span class="save" @click="toResults">{{$store.state.system.webLang.purchase}}</span>
		    </template>
		</app-header>
		


  		<div class="results-list">
			
			<div class="list-block" v-for="item in lotteryList">
				
				<div class="list-title">
					<div class="title-left">
						<div>
							<span v-if="item.lottery_type==2">3 Mins/Draw</span> 
							<span v-if="item.lottery_type==1">{{item.lottery_id==1?'Morning Lottery':item.lottery_id==2?'Day Lottery':item.lottery_id==3?'Evening Lottery':''}}</span>
							<!--<span>1st</span>
							<span>Prize: Rs.</span>
							<span>₹{{item.win_1_points | NumFormat}}</span>-->
						</div>
					</div>
					<div class="title-right" >
						{{$store.state.system.webLang.draw_time}}: {{item.creation_time}}
					</div>
					
				</div>
				
				<div class="list-title">
					<div class="title-left">
						<p>{{item.lottery_info.name}}</p>
					</div>
					<div class="title-right" @click="openLotteryDetailA(item)">
						<i class="iconfont iconxiangyou"></i>
					</div>
				</div>
				
				<div class="lottery-num">
					<div v-for="item1 in item.prize_1" v-if="item.lottery_type==1">
						<span >{{item1}}</span>
					</div>
					<div v-if="item.lottery_type==2" class="lottery-num-bse">
						<span>{{item.prize_1}}</span>
						<b>.</b>
						<span>{{item.prize_2}}</span>
						<span>{{item.prize_3}}</span>
						<b>-</b>
						<span>{{item.prize_4}}</span>
					</div>
					
				</div>
				
				<!--<div class="list-center">

					<div></div>
					<div  @click="openLotteryDetailA(item)">
						<span>
							Draw Details
						</span>
						
						<i class="iconfont iconico_arrowdown" ref="arrowdown"></i>
					</div>
				</div>-->
				
			
				
			</div>
			
			
		</div>

		
		
		
		
		
		
		
		
		
		
		
		
		<van-loading type="spinner" color="#1989fa" v-if="loading">{{$store.state.system.webLang.loading_text}}</van-loading>
		<div v-if="lotteryList.length==0&&!loading" class="no-data">
			<img src="../../assets/images/no-data.png" />
			<p>{{$store.state.system.webLang.no_data}}</p>
		</div>
		<div class="all-data" v-if="currentPage==10&&!loading">
			{{$store.state.system.webLang.recent_otal_draw_100th}}
		</div>
		
	
		
		<!--开奖详情-->
		<van-popup v-model="lotteryDetailShowA" position="bottom" class="lottery-detail-popup">
			
			<div class="lottery-detail" v-if="lotteryDetail.list&&lotteryDetail.lottery_type==1">
				<i class="iconfont iconguanbi" @click="lotteryDetailShowA=false"></i>
				<div class="lottery-detail-title">
					<p>{{lotteryDetail.lottery_id==1?'Morning Lottery':lotteryDetail.lottery_id==2?'Day Lottery':lotteryDetail.lottery_id==3?'Evening Lottery':''}}</p>
					<p>
						<!--<span>{{$store.state.system.webLang.top_prize}}:</span>
						<span>₹ {{lotteryDetail.list[0] | changeNum}}</span>-->
					</p>
					<p>{{getNewTime(lotteryDetail.creation_time)}}</p>
				</div>
				
				
				
				<div class="lottery-detail-first">
					<div class="first-wrap">
						<div  v-for="item1 in lotteryDetail.prize_1">
							<span>{{item1}}</span>
						</div>
						
					</div>
					<!--<div class="first-center">

						<div>Purchase</div>
						<div >
							Lottery Details
							
						</div>
					</div>-->
					<div class="first-bottom">
						<p>{{$store.state.system.webLang.draw_no}}.{{lotteryDetail.no}}</p>
						<p>{{$store.state.system.webLang.top_prize}}: <span class="amount">{{lotteryDetail.list[0]  | changeNum}}</span></p>
						<p>{{$store.state.system.webLang.held_on}}: {{lotteryDetail.lottery_time}}</p>
					</div>
				</div>
				
				<div class="lottery-list">
					<div class="lottery-Consolation">
						<div class="list-block-title">Consolation Prize: Rs.<span class="amount">{{lotteryDetail.list[6] | NumFormat}}</span></div>
						<div class="Consolation-list">
							<span v-for="(item1,index1) in lotteryDetail.prize_1" v-if="index1>1">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">2nd Prize: Rs.<span class="amount">{{lotteryDetail.list[1] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail.prize_2">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">3rd Prize: Rs.<span class="amount">{{lotteryDetail.list[2] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail.prize_3">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">4th Prize: Rs.<span class="amount">{{lotteryDetail.list[3] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail.prize_4">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">5th Prize: Rs.<span class="amount">{{lotteryDetail.list[4] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail.prize_5">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-Consolation no-border">
						<div class="list-block-title">6th Prize: Rs.<span class="amount">{{lotteryDetail.list[5] | NumFormat}}</span></div>
						<div class="Consolation-list">
							<span  v-for="item1 in lotteryDetail.prize_6">{{item1}}</span>
						</div>
					</div>
					
				</div>
				
				<div class="lottery-detail-btn">
					
					<!--<div class="detail-btn" @click="toHisResults(lotteryDetail)">
						<img src="../../assets/images/home/time.png">
						{{$store.state.system.webLang.draw_history}} 
					</div>-->
					<div class="detail-btn" @click="toVideo(lotteryDetail.video_url)">
						<img src="../../assets/images/home/video.png">
						{{$store.state.system.webLang.draw_videos}}
					</div>
				</div>
				
				
			</div>
			
			
			
			<!--指数-->
			<div class="lottery-detail" v-else>
				<i class="iconfont iconguanbi" @click="lotteryDetailShowA=false"></i>
				<div class="lottery-detail-title">
					<p>3 Mins/Draw</p>
					<p>
						<span v-if="lotteryDetail.lottery_info">{{lotteryDetail.lottery_info.name}}</span>
						
					</p>
					<p>{{getNewTime(lotteryDetail.creation_time)}}</p>
				</div>
				
				<div class="lottery-detail-first">
					
					<div class="odd-even-text">{{lotteryDetail.prize_5==1?$store.state.system.webLang.single:lotteryDetail.prize_5==2?$store.state.system.webLang.double:''}}</div>

					<div class="lottery-num-bse">
						<span>{{lotteryDetail.prize_1}}</span>
						<b>.</b>
						<span>{{lotteryDetail.prize_2}}</span>
						<span>{{lotteryDetail.prize_3}}</span>
						<b>-</b>
						<span>{{lotteryDetail.prize_4}}</span>
					</div>

					<!--<div class="first-center">

						<div>{{$store.state.system.webLang.buy_now}}div>
						<div >
							Draw Details
							
						</div>
					</div>-->
					<div class="first-bottom">
						<p>{{$store.state.system.webLang.draw_no}}.{{lotteryDetail.no}}</p>
						<p v-if="lotteryDetail.lottery_info">{{$store.state.system.webLang.top_prize}}: <span class="amount">{{lotteryDetail.lottery_info.win_1_times  | changeNum}} {{$store.state.system.webLang.times}}</span></p>
						<p>{{$store.state.system.webLang.held_on}}: {{lotteryDetail.lottery_time}}</p>
					</div>
				</div>
				
				
				<!--指数-->
				<div class="bse-wrap" v-if="lotteryDetail.lottery_data&&lotteryDetail.lottery_info.id==1">
					
					<div class="bse-title">
						<span>{{lotteryDetail.lottery_info.name}}</span>  
						<!--<span>{{sysMonth}} {{sysTime/1000 | formatDate('dd hh:mm')}}</span>-->
					</div>
					<div class="current-bse">
						<div>{{lotteryDetail.lottery_data.current_value?lotteryDetail.lottery_data.current_value:'-'}}
							<span v-if="lotteryDetail.lottery_data.contrast_value">{{lotteryDetail.lottery_data.contrast_value}}({{lotteryDetail.lottery_data.contrast_percent+'%'}})</span>
						</div>
						<div>
							<b>{{$store.state.system.webLang.OPEN}}：</b>{{lotteryDetail.lottery_data.open?lotteryDetail.lottery_data.open:'-'}}
						</div>
					</div>
					
					<div class="day-bse">
						<div></div>
						<div>
							<span><b>{{$store.state.system.webLang.HIGH}}：</b>{{lotteryDetail.lottery_data.high?lotteryDetail.lottery_data.high:'-'}}</span>
							<span><b>{{$store.state.system.webLang.LOW}}：</b>{{lotteryDetail.lottery_data.low?lotteryDetail.lottery_data.low:'-'}}</span>
						</div>
					</div>
					
				</div>
				<!--指数-->
				
				
				<!--btc-->
				<div class="bse-wrap" v-if="lotteryDetail.lottery_data&&lotteryDetail.lottery_info.id==2">
					
					<div class="bse-title">
						<span>{{lotteryDetail.lottery_info.name}}</span>  
						<!--<span>{{sysMonth}} {{sysTime/1000 | formatDate('dd hh:mm')}}</span>-->
					</div>
					
					<div class="current-bse-btc">
						{{$store.state.system.webLang.Results}}：₹ {{lotteryDetail.lottery_data.current_value | NumFormat}} = <span class="usd">${{lotteryDetail.lottery_data.current_value/lotteryDetail.lottery_data.contrast_value | NumFormat(2)}}</span>
						<p>{{$store.state.system.webLang.today_rate}}</p>
						<p>1 USD = {{lotteryDetail.lottery_data.contrast_value}} INR</p>
					</div>
			
					
				</div>
				<!--btc-->
				
				
				<div class="lottery-detail-btn">
					
					<!--<div class="detail-btn" @click="toHisResults(lotteryDetail)">
						<img src="../../assets/images/home/time.png">
						{{$store.state.system.webLang.draw_history}} 
					</div>-->
					<div class="detail-btn" @click="toNet(lotteryDetail.video_url)">
						<img src="../../assets/images/home/video.png">
						{{$store.state.system.webLang.results_link}}
					</div>
				</div>
				
				
			</div>
			
		</van-popup>
		
		<!--开奖详情-->
		
		

	</div>
	
	
	
	
	
</template>

<script src="./HisResults.js"></script>

<style lang="scss">
	@import './HisResults';
</style>