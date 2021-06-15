<template>
	<div class="hicTickets-wrap" >
		
		
		<app-header :title="$store.state.system.webLang.history_record" v-on:clickLeft="returnBack" left :right="false"></app-header>
		
		
		<div class="tickets-top">
			<div> 
				<van-checkbox v-model="checked" shape="square" checked-color="#D51B31">{{$store.state.system.webLang.only_review_winning_numbers}}</van-checkbox>
			</div>
			<div class="calendar" @click="calendarShow=true">
				<i class="iconfont iconrili"></i>
				<div>{{selsetDateStart+'~'+selsetDateEnd}}</div>
			</div>
			<div @click="lotteryClassShow = true">
				<img src="../../assets/images/mulu.png"/>
			</div>
		</div>
		
		
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
		<van-calendar :title="$store.state.system.webLang.calendar" :confirm-text="$store.state.system.webLang.btn_confirm"  v-model="calendarShow" type="range" :min-date="minDate"
  :max-date="maxDate" :default-date="defaultDate" :overlay="false" :max-range="90" :range-prompt="$store.state.system.webLang.filter_for_up_to_3_months"   @confirm="onConfirm" @select="onSelect" />
		
		<!--日历-->
		
		
		<!--彩种选择弹窗-->
			<van-action-sheet v-model="lotteryClassShow" :actions="lotteryClass" @select="onSelectLotteryClass" @cancel="onCancel" :cancel-text="$store.state.system.webLang.cancel"/>
		<!--彩种选择弹窗-->
		
		
		<div class="tickets-list">
			<div class="tickets-list-wrap" v-for="item in lotteryBetsList" v-if="item.list.length">
				<div class="wrap-title">
					<div>{{item.list[0].lottery_no_info.lottery_info.name}}</div>
					<div>
						<span>Buy Time: </span>
						<span>{{item.list[0].creation_time}}</span>
					</div>
				</div>
				
				<div class="wrap-list">
					
					
			
					<div class="list-cell" v-for="(item1,index1) in item.list" @click="openLotteryDetailB(item1)">
							<i class="iconfont iconxiangyou"></i>
							

						     	<div v-if="item.lottery_type==2" class="cell-type">
													{{item1.lottery_no_info.ext_type==1?'Next Draw':item1.lottery_no_info.ext_type==2?'Tomorrow Open':item1.lottery_no_info.ext_type==3?'Tomorrow Highest':item1.lottery_no_info.ext_type==4?'Tomorrow Lowest':''}}
										</div>
						
						
						
						<div class="cell-top" v-if="item.lottery_type==1">
							<div v-if="item1.a">
								<span>{{item1.a}}</span>
							</div>

							<div  v-if="item1.b">
								<span>{{item1.b}}</span>
							</div>
							<div v-if="item1.c">
								<span>{{item1.c}}</span>
							</div>
							<div v-if="item1.d">
								<span>{{item1.d}}</span>
							</div>
							<div v-if="item1.e">
								<span>{{item1.e}}</span>
							</div>
							<div v-if="item1.f">
								<span>{{item1.f}}</span>
							</div>
							<div v-if="item1.g">
								<span>{{item1.g}}</span>
							</div>
						</div>
						
						
						
						<van-collapse v-model="activeNames"  v-if="item.lottery_type==2&&item1.complex_data.length" @change="watchChange">
						<van-collapse-item title="" :name="item1.id" >
					
							<template #title>
								<div class="cell-top">
									<div  v-if="getValue(item1.id)">
										<span>{{item1.complex_data[0].a}}</span>
									</div>
									<span  v-if="getValue(item1.id)">.</span>
									<div  v-if="getValue(item1.id)">
										<span>{{item1.complex_data[0].b}}</span>
									</div>
									<div  v-if="getValue(item1.id)">
										<span>{{item1.complex_data[0].c}}</span>
									</div>
									<div style="color: whitesmoke;">.</div>
							
									
								</div>
								<div class="right-text">Details</div>
							</template>
							<!--<template #right-icon>
								复投
								<van-icon name="arrow-up" />
							</template>-->
							<div class="cell-top"  v-for="(itemA,indexA) in item1.complex_data">
								<div>
									<span>{{itemA.a}}</span>
								</div>
								<span>.</span>
								<div>
									<span>{{itemA.b}}</span>
								</div>
								<div>
									<span>{{itemA.c}}</span>
								</div>
								
					
								<span style="color: #3B4DF1;"  class="blue" v-if="itemA.status==2">{{$store.state.system.webLang.puchase_pending}}</span>
						
								<span  v-if="itemA.status==5" class="blue">{{itemA.win_no}}{{$store.state.system.webLang.th_prize}}: Rs.<b style="color: #D0021B;">₹ {{itemA.win_points}}</b>  <b style="color: #3B4DF1;">{{$store.state.system.webLang.Won}}</b></span>
						
								<span class="blue" style="color: #3B4DF1;"  v-if="itemA.status==7">{{$store.state.system.webLang.better_luck_next_time}}</span>
							
							
							
							
							</div>	
								
					
						</van-collapse-item>
						</van-collapse>
					
							<div v-if="item.lottery_type==2&&item1.complex_data.length==0" class="cell-top">
								
								<div v-if="item1.a">
									<span>{{item1.a}}</span>
								</div>
								<span v-if="item1.b">.</span>
								<div  v-if="item1.b">
									<span>{{item1.b}}</span>
								</div>
								<div v-if="item1.c">
									<span>{{item1.c}}</span>
								</div>
								<div v-if="item1.d">
									<span>{{item1.d}}</span>
								</div>
								<div v-if="item1.e" class="u-mt-10 u-mb-10 u-f8" >
									{{item1.e==1?$store.state.system.webLang.single:item1.e==2?$store.state.system.webLang.double:''}}
								</div>
							</div>
						
						
						
						
						<div class="cell-bottom">
							<div class="bottom-left" v-if="item1.status==2&&item1.complex_data.length==0">
								<div>
									<span class="blue">{{$store.state.system.webLang.puchase_pending}}</span>
								</div>
							</div>
							<div class="bottom-left" v-if="item1.status==5&&item1.complex_data.length==0">
								<div>
									<span>{{item1.win_no}}{{$store.state.system.webLang.th_prize}}: Rs.<b>₹ {{item1.win_points}}</b>  <b>{{$store.state.system.webLang.Won}}</b></span>
								</div>
							</div>
							<div class="bottom-left" v-if="item1.status==7&&item1.complex_data.length==0">
								<div>
									<span class="blue">{{$store.state.system.webLang.better_luck_next_time}}</span>
								</div>
							</div>
							
							
							
							
							<div class="bottom-center">
								<span v-if="item1.no_times>1">{{$store.state.system.webLang.CHASE}}：<b>{{item1.now_no_times}}</b>/{{item1.no_times}}
									<span v-if="item1.no_times == 12">+1</span>
									<span v-if="item1.no_times == 18">+2</span>
									<span v-if="item1.no_times == 24">+3</span>
								</span>
							</div>
							<div  class="bottom-right">
								<!--<span>Draw Details</span>-->
								<span>{{$store.state.system.webLang.times}}：</span>
								<span>{{item1.times}}</span>
								<i class="iconfont iconico_arrowdown" ref="arrowdown"></i>
							</div>
						</div>
					
					</div>
					
				
				</div>
			</div>
		</div>
		
		
		
		<van-loading type="spinner" color="#1989fa" v-if="reqLoading">{{$store.state.system.webLang.loading_text}}</van-loading>
		<div v-if="lotteryBetsListNum==0&&!reqLoading" class="no-data">
			<img src="../../assets/images/no-data.png" />
			<p>{{$store.state.system.webLang.no_purchase_history}}</p>
		</div>
		
		
		
		
		
		
		
		
		
		
		
		
		
		<!--开奖详情-->
		<van-popup v-model="lotteryDetailShowB" position="bottom" close-on-popstate class="lottery-detail-popup">
			
			<div class="lottery-detail" v-if="lotteryDetail.list&&lotteryDetail.lottery_type==1">
				<i class="iconfont iconguanbi" @click="lotteryDetailShowB=false"></i>
				<div class="lottery-detail-title">
					<p>{{lotteryDetail.lottery_id==1?'Morning Lottery':lotteryDetail.lottery_id==2?'Day Lottery':lotteryDetail.lottery_id==3?'Evening Lottery':''}}</p>
					<p>
						<!--<span>{{$store.state.system.webLang.top_prize}}:</span>
						<span>₹ {{lotteryDetail.list[0] | NumFormat}}</span>-->
					</p>
					<p>{{getNewTime(lotteryDetail.creation_time)}}</p>
				</div>
				
				
				
				<div class="lottery-detail-first">
					<div class="first-wrap">
						<div  v-for="item1 in lotteryDetail.prize_1">
							<span>{{item1}}</span>
						</div>
						
					</div>
					<div class="first-center">

						<div>Purchase</div>
						<div >
							Lottery Details
							<!--<i class="iconfont iconxiangshang3" ref="arrowdown"></i>-->
						</div>
					</div>
					<div class="first-bottom">
						<p>{{$store.state.system.webLang.draw_no}}.{{lotteryDetail.lottery_no_info.no}}</p>
						<p>1st Price-Rs: <span class="amount">{{lotteryDetail.list[0] | changeNum}}</span></p>
						<p>{{$store.state.system.webLang.held_on}}: {{lotteryDetail.creation_time}}</p>
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
					
					<div class="detail-btn" @click="toResults">
						<img src="../../assets/images/home/time.png">
						{{$store.state.system.webLang.buy_now}}
					</div>
					<div class="detail-btn" @click="toVideo(lotteryDetail.video_url)">
						<img src="../../assets/images/home/video.png">
						{{$store.state.system.webLang.draw_videos}}
					</div>
				</div>
					
			</div>
			
			
			
			
			<!--指数-->
			<div class="lottery-detail" v-else>
				<i class="iconfont iconguanbi" @click="lotteryDetailShowB=false"></i>
				<div class="lottery-detail-title">
					<p>3 Mins/Draw</p>
					<p>
						<span v-if="lotteryDetail.lottery_info">{{lotteryDetail.lottery_info.name}}</span>
						
					</p>
					<p v-if="lotteryDetail.lottery_no_info">{{lotteryDetail.lottery_no_info.lottery_time}}</p>
				</div>
				
				<div class="lottery-detail-first" v-if="lotteryDetail.lottery_no_info">
					
					<div class="odd-even-text">{{lotteryDetail.lottery_no_info.prize_5==1?$store.state.system.webLang.single:lotteryDetail.lottery_no_info.prize_5==2?$store.state.system.webLang.double:''}}</div>

					<div class="lottery-num-bse">
						<span>{{lotteryDetail.lottery_no_info.prize_1}}</span>
						<b>.</b>
						<span>{{lotteryDetail.lottery_no_info.prize_2}}</span>
						<span>{{lotteryDetail.lottery_no_info.prize_3}}</span>
						<b>-</b>
						<span>{{lotteryDetail.lottery_no_info.prize_4}}</span>
					</div>

					<div class="first-center">

						<!--<div>{{$store.state.system.webLang.buy_now}}</div>
						<div >
							Draw Details
							
						</div>-->
					</div>
					<div class="first-bottom">
						<p>{{$store.state.system.webLang.draw_no}}.{{lotteryDetail.lottery_no_info.no}}</p>
						<p>{{$store.state.system.webLang.top_prize}}: <span class="amount">{{lotteryDetail.lottery_no_info.lottery_info.win_1_points | NumFormat}}</span></p>
						<p v-if="lotteryDetail.lottery_no_info">{{$store.state.system.webLang.held_on}}: {{lotteryDetail.lottery_no_info.lottery_time}}</p>
					</div>
				</div>
				
				
				<!--指数-->
				<div class="bse-wrap" v-if="lotteryDetail.lottery_no_info&&lotteryDetail.lottery_no_info.lottery_info.id==1">
					
					<div class="bse-title">
						<span>{{lotteryDetail.lottery_no_info.lottery_info.name}}</span>  
						<!--<span>{{sysMonth}} {{sysTime/1000 | formatDate('dd hh:mm')}}</span>-->
					</div>
					<div class="current-bse">
						<div>{{lotteryDetail.lottery_no_info.lottery_data.current_value?lotteryDetail.lottery_no_info.lottery_data.current_value:'-'}}
						<!--	<span >{{lotteryDetail.lottery_no_info.lottery_data.contrast_value}}({{lotteryDetail.lottery_no_info.lottery_data.contrast_percent+'%'}})</span>-->
						</div>
						<div>
							<b>{{$store.state.system.webLang.OPEN}}：</b>{{lotteryDetail.lottery_no_info.lottery_data.open?lotteryDetail.lottery_no_info.lottery_data.open:'-'}}
						</div>
					</div>
					
					<div class="day-bse">
						<div></div>
						<div>
							<span><b>{{$store.state.system.webLang.HIGH}}：</b>{{lotteryDetail.lottery_no_info.lottery_data.high?lotteryDetail.lottery_no_info.lottery_data.high:'-'}}</span>
							<span><b>{{$store.state.system.webLang.LOW}}：</b>{{lotteryDetail.lottery_no_info.lottery_data.low?lotteryDetail.lottery_no_info.lottery_data.low:'-'}}</span>
						</div>
					</div>
					
				</div>
				<!--指数-->
				
				
				<!--btc-->
				<div class="bse-wrap" v-if="lotteryDetail.lottery_no_info&&lotteryDetail.lottery_no_info.lottery_info.id==2">
					
					<div class="bse-title">
						<span>{{lotteryDetail.lottery_no_info.lottery_info.name}}</span>  
						<!--<span>{{sysMonth}} {{sysTime/1000 | formatDate('dd hh:mm')}}</span>-->
					</div>
					
					<div class="current-bse-btc">
						O：₹ {{lotteryDetail.lottery_no_info.lottery_data.current_value}} = <span class="usd">${{lotteryDetail.lottery_no_info.lottery_data.current_value/lotteryDetail.lottery_no_info.lottery_data.contrast_value | toFixed(2)}}</span>
						<p>{{$store.state.system.webLang.today_rate}}</p>
						<p>1 USD = {{lotteryDetail.lottery_no_info.lottery_data.contrast_value}} INR</p>
					</div>
					
				
					
				</div>
				<!--btc-->
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				<div class="lottery-detail-btn">
					
					<div class="detail-btn" @click="toHisResults(lotteryDetail)">
						<img src="../../assets/images/home/time.png">
						{{$store.state.system.webLang.draw_history}} 
					</div>
					<div class="detail-btn" @click="toNet(lotteryDetail.lottery_no_info.video_url)">
						<img src="../../assets/images/home/video.png">
						{{$store.state.system.webLang.draw_data}}
					</div>
				</div>
				
				
			</div>
			
			
			
			
		</van-popup>
		
		<!--开奖详情-->
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

	</div>
</template>

<script src="./HisTickets.js"></script>
<style lang="scss">
	@import './HisTickets';
</style>