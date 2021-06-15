<template>
<!--	
	<div class="loading-wrap" v-if="siteLoading">
	
		<div class="loading-logo">
			<img src="../../assets/images/loading_logo.png" />
		</div>
			
			
		<div class="loading-progress">
			<div class="progress-block">
				<van-progress :percentage="percent" stroke-width="10" color="#FF0000" :show-pivot="false"/>
			</div>
			<div class="progress-text">
				<span>{{$store.state.system.webLang.loading_progress_text}}</span>
				<span>{{percent}}%</span>
			</div>
		</div>
		
		
		
	</div>
	-->
	
	<div class="results-wrap">
		
		<index-header></index-header>
		
		
		
		
		<van-pull-refresh v-model="isLoading" :head-height="80" @refresh="onRefresh">
		  		<!-- 下拉提示，通过 scale 实现一个缩放效果 -->
				<template #pulling="props">
				    <img
				      class="doge"
				      src="../../assets/images/lottoplus_logo2.png"
				      :style="{ transform: `scale(${props.distance / 80})` }"
				    />
				</template>
				
				<!-- 释放提示 -->
				<template #loosing>
				    <img class="doge" src="../../assets/images/lottoplus_logo2.png" />
				</template>
				
				<!-- 加载提示 -->
				<template #loading>
				    <!--刷新成功-->
				</template>
		
		
				<div class="results-banner">
					<van-swipe :autoplay="5000" indicator-color="white"  loop >
					  <van-swipe-item v-for="(item,index) in $store.state.system.bannerList" :key="index">
							<van-image
							  fit="cover"
							  :src="item.file_link" @click="openLink(item)"/>
					  </van-swipe-item>
					
					</van-swipe>
						
				</div>
				
				
				<lottery-Notice></lottery-Notice>
			
				
				
				
			
				
				<div class="results-new-list" :class="{'fixActive':fixed}">
					<!-- <span>{{$store.state.system.webLang.new_list}}</span> -->
					<span>Select & play</span>
					<div class="new-list-right" @click="lotteryClassShow = true">
						<img src="../../assets/images/mulu.png"/>
					</div>
				</div>
				
				<!--<div class="results-list">
					
					<div class="list-block" v-for="item in $store.state.system.lotteryList">
						
						<div class="list-title">
							<div class="title-left">
								<div v-if="item.lottery_type==1">{{item.lottery_info.name}}</div>
								<div v-else>3 Mins/Draw</div>
								<div v-if="item.lottery_type==1">
							
								</div>
								<div v-else class="bse-type">
									<span>{{item.lottery_info.name}}</span>
								</div>
							</div>
							<div class="title-right">
								<div>{{item.lottery_time}}</div>
								<div @click="openLotteryDetail(item)"><i class="iconfont iconxiangyou"></i></div>
							</div>
							
						</div>
						
						<div class="lottery-num" :class="{'noTimer':!item.timerA}">
							<div v-for="item1 in item.prize_1" v-if="item.lottery_type==1">
								<span >{{item1}}</span>
							</div>
							<div v-else class="lottery-num-bse">
								<span>{{item.prize_1[0]}}</span>
								<b>.</b>
								<span>{{item.prize_2}}</span>
								<span>{{item.prize_3}}</span>
								<b>-</b>
								<span>{{item.prize_4}}</span>
							</div>
							
						</div>
						
						
						<div class="list-bottom">
							<div class="bottom-left" v-if="item.lottery_type==1">
								<p :class="{'gray':!item.timerA}">{{$store.state.system.webLang.top_prize}}</p>
								<p :class="{'gray':!item.timerA}">{{item.lottery_info.win_1_points | changeNum}}</p>
							</div>
							<div class="bottom-left" v-else>
								<p>Current Prize</p>
								<p>{{item.lottery_data.current_value}}</p>
							</div>
							<div class="bottom-center" v-if="item.timer&&item.timerA">
								<p v-if="item.timer.hou&&item.timer.min&&item.timer.sec">
									Next Draw
								</p>
								<p v-if="item.timer.hou&&item.timer.min&&item.timer.sec">
									<span>{{item.timer.hou?item.timer.hou:'00'}}</span>
									<b>:</b>
									<span>{{item.timer.min?item.timer.min:'00'}}</span>
									<b>:</b>
									<span>{{item.timer.sec?item.timer.sec:'00'}}</span>
								</p>
								<p v-else class="no-time"></p>
								
							</div>
							<div class="bottom-center no-time" v-else>
							
							</div>
							<div class="bottom-right">
								<div class="right-block" @click="toLottery(item)" :class="{'no-buy':(!item.timer.hou&&!item.timer.min&&!item.timer.sec)||!item.timerA}">
									<div>{{$store.state.system.webLang.buy_now}}</div>
									<div>₹{{item.lottery_type==1?6:10}}</div>
								</div>
								
							</div>
						</div>
						
						
					</div>
					
					
				</div>-->
				
				
				
				
			
				
				<div class="results-list">
					
					<div class="list-block" v-for="(item,index) in newHistoryList" :key="index">
						
						<div class="list-title">
							<div class="title-left">
								<div v-if="item.lottery_type==1">{{item.lottery_info.name}}</div>
								<div v-else>3 Mins/Draw</div>
								<div v-if="item.lottery_type==1">
									<!--<span :class="{'gray':!item.timerA}">Top</span>
									<span>Prize: Rs.</span>
									<span :class="{'gray':!item.timerA}">₹{{item.lottery_info.win_1_points | NumFormat}}</span>-->
								</div>
								<div v-else class="bse-type">
									<span>{{item.lottery_info.name}}</span>
								</div>
							</div>
							<div class="title-right">
								<div>{{item.lottery_time}}</div>
								<div @click="openLotteryDetail(item)"><i class="iconfont iconxiangyou"></i></div>
							</div>
							
						</div>
						
						<div class="lottery-num" :class="{'noTimer':!item.timerA}">
							<div v-for="item1 in item.prize_1" :key="item1.index" v-if="item.lottery_type==1">
								<span >{{item1}}</span>
							</div>
							<div v-else class="lottery-num-bse">
								<span>{{item.prize_1[0]}}</span>
								<b>.</b>
								<span>{{item.prize_2}}</span>
								<span>{{item.prize_3}}</span>
								<b>-</b>
								<span>{{item.prize_4}}</span>
							</div>
							
						</div>
						
						
						<div class="list-bottom">
							<div class="bottom-left" v-if="item.lottery_type==1">
								<p :class="{'gray':!item.timerA}">{{$store.state.system.webLang.top_prize}}</p>
								<p :class="{'gray':!item.timerA}">{{item.lottery_info.win_1_points | changeNum}}</p>
							</div>
							<div class="bottom-left" v-else>
								<p>{{$store.state.system.webLang.current_prize}}</p>
								<p>{{item.lottery_data.current_value}}</p>
							</div>
							<!--&&item.timerA-->
							<div class="bottom-center" v-if="item.timer">
								<p v-if="item.timer.hou&&item.timer.min&&item.timer.sec">
									{{$store.state.system.webLang.next_draw}}
								</p>
								<p v-if="item.timer.hou&&item.timer.min&&item.timer.sec">
									<span>{{item.timer.hou?item.timer.hou:'00'}}</span>
									<b>:</b>
									<span>{{item.timer.min?item.timer.min:'00'}}</span>
									<b>:</b>
									<span>{{item.timer.sec?item.timer.sec:'00'}}</span>
								</p>
								<p v-else class="no-time">{{$store.state.system.webLang.launching_soon}}</p>
								
							</div>
							<div class="bottom-center no-time" v-else>
								{{$store.state.system.webLang.launching_soon}}
							</div>
							<div class="bottom-right" :class="{'guideActive':$store.state.system.guideType==1&&$store.state.system.guideIndex==7&&index==0}">
								<div class="right-block" @click="toLottery(item)" :class="{'no-buy':(!item.timer.hou&&!item.timer.min&&!item.timer.sec&&!$store.state.system.showGuide)}">
									<!--||!item.timerA-->
									<div>{{$store.state.system.webLang.buy_now}}</div>
									<div>₹{{item.lottery_info.bets_points}}</div>
								</div>
								
							</div>
						</div>
						
						
					</div>
					
					
				</div>
				
				
				<van-loading type="spinner" color="#1989fa" v-if="reqLoading">{{$store.state.system.webLang.loading_text}}</van-loading>
				<div v-if="newHistoryList.length==0&&!reqLoading" class="no-data">
					<img src="../../assets/images/no-data.png" />
					<p>{{$store.state.system.webLang.no_data}}</p>
				</div>
				
			</van-pull-refresh>
		
		<!--彩种选择弹窗-->
			<van-action-sheet v-model="lotteryClassShow" :actions="lotteryClass" @select="onSelectLotteryClass" @cancel="onCancel" :cancel-text="$store.state.system.webLang.cancel"/>
		<!--彩种选择弹窗-->
		
		
		<!--开奖详情-->
		<van-popup v-model="lotteryDetailShow" position="bottom" close-on-popstate class="lottery-detail-popup">
			
			<div class="lottery-detail" v-if="lotteryDetail.list&&lotteryDetail.lottery_type==1">
				<i class="iconfont iconguanbi" @click="lotteryDetailShow=false"></i>
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
						<div  v-for="item1 in lotteryDetail.prize_1" :key="item1.index">
							<span>{{item1}}</span>
						</div>
						
					</div>
					<!--<div class="first-center">

						<div>Purchase</div>
						<div>
							Lottery Details
							
						</div>
					</div>-->
					<div class="first-bottom">
						<p>{{$store.state.system.webLang.draw_no}}.{{lotteryDetail.no}}</p>
						<p>{{$store.state.system.webLang.top_prize}}: <span class="amount">{{lotteryDetail.list[0] | changeNum}}</span></p>
						<p>{{$store.state.system.webLang.held_on}}: {{lotteryDetail.lottery_time}}</p>
					</div>
				</div>
				
				<div class="lottery-list">
					<div class="lottery-Consolation">
						<div class="list-block-title">Consolation Prize: Rs.<span class="amount">{{lotteryDetail.list[6] | NumFormat}}</span></div>
						<div class="Consolation-list">
							<span v-for="(item1,index1) in lotteryDetail.prize_1" :key="item1.index" v-if="index1>1">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">2nd Prize: Rs.<span class="amount">{{lotteryDetail.list[1] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail.prize_2" :key="item1.index">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">3rd Prize: Rs.<span class="amount">{{lotteryDetail.list[2] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail.prize_3" :key="item1.index">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">4th Prize: Rs.<span class="amount">{{lotteryDetail.list[3] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail.prize_4" :key="item1.index">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">5th Prize: Rs.<span class="amount">{{lotteryDetail.list[4] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail.prize_5" :key="item1.index">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-Consolation no-border">
						<div class="list-block-title">6th Prize: Rs.<span class="amount">{{lotteryDetail.list[5] | NumFormat}}</span></div>
						<div class="Consolation-list">
							<span  v-for="item1 in lotteryDetail.prize_6" :key="item1.index">{{item1}}</span>
						</div>
					</div>
					
				</div>
				
				<div class="lottery-detail-btn">
					
					<div class="detail-btn" @click="toHisResults(lotteryDetail)">
						<img src="../../assets/images/home/time.png">
						{{$store.state.system.webLang.draw_history}} 
					</div>
					<div class="detail-btn" @click="toVideo(lotteryDetail)">
						<img src="../../assets/images/home/video.png">
						{{$store.state.system.webLang.official_result}}
					</div>
				</div>
				
				
			</div>
			
			
			
			<!--指数-->
			<div class="lottery-detail" v-else>
				<i class="iconfont iconguanbi" @click="lotteryDetailShow=false"></i>
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

						<div>{{$store.state.system.webLang.buy_now}}</div>
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
					
					<div class="bse-title" v-if="sysMonth">
						<span>{{lotteryDetail.lottery_info.name}}</span>  
						<span>{{sysMonth}} {{sysTime/1000 | formatDate('dd hh:mm')}}</span>
					</div>
					
					<div class="current-bse">
						<div ><b  :class="{'rise':lotteryDetail.lottery_data.contrast_percent>0,'decline':lotteryDetail.lottery_data.contrast_percent<0}">{{lotteryDetail.lottery_data.current_value}}
							<i class="iconfont iconGroup-" v-if="lotteryDetail.lottery_data.contrast_percent>0"></i>
							<i class="iconfont iconplus-shiftdown" v-if="lotteryDetail.lottery_data.contrast_percent<0"></i>
							</b>
			<!--				<span :class="{'rise':lotteryDetail.lottery_data.contrast_percent>0,'decline':lotteryDetail.lottery_data.contrast_percent<0}" v-if="lotteryDetail.lottery_data.contrast_value">{{lotteryDetail.lottery_data.contrast_value}}({{lotteryDetail.lottery_data.contrast_percent+'%'}})</span>-->
						</div>
						<div>
							<b>{{$store.state.system.webLang.OPEN}}：</b>{{lotteryDetail.lottery_data.open}}
						</div>
					</div>
					
					<div class="day-bse">
						<div></div>
						<div>
							<span>
								<b>{{$store.state.system.webLang.HIGH}}：</b>
								<span v-if="lotteryDetail.lastLottery">{{lotteryDetail.lottery_data.high?lotteryDetail.lottery_data.high:'-'}}
								</span>
								<span v-else>{{lotteryDetail.lottery_info.close_time}}</span>
							</span>
							
							<span>
								<b>LOW：</b>
								<span v-if="lotteryDetail.lastLottery">{{lotteryDetail.lottery_data.low?lotteryDetail.lottery_data.low:'-'}}</span>
								<span v-else>{{lotteryDetail.lottery_info.close_time}}</span>
							</span>
						</div>
					</div>
					
				</div>
				<!--指数-->
				
				
				<!--btc-->
				<div class="bse-wrap" v-if="lotteryDetail.lottery_data&&lotteryDetail.lottery_info.id==2">
					
					<div class="bse-title" v-if="sysMonth">
						<span>{{lotteryDetail.lottery_info.name}}</span>  
						<span>{{sysMonth}} {{sysTime/1000 | formatDate('dd hh:mm')}}</span>
					</div>
					
					<div class="current-bse-btc">
						{{$store.state.system.webLang.Results}}：₹ {{lotteryDetail.lottery_data.current_value | NumFormat}} = <span class="usd">${{lotteryDetail.lottery_data.current_value/lotteryDetail.lottery_data.contrast_value | NumFormat(2)}}</span>
						<p>{{$store.state.system.webLang.today_rate}}</p>
						<p>1 USD = {{lotteryDetail.lottery_data.contrast_value}} INR</p>
					</div>
					
		
					
				</div>
				<!--btc-->
				
				
				
				
				<div class="lottery-detail-btn">
					
					<div class="detail-btn" @click="toHisResults(lotteryDetail)">
						<img src="../../assets/images/home/time.png">
						{{$store.state.system.webLang.draw_history}} 
					</div>
					<!--@click="toNet(lotteryDetail.video_url)"-->
					<div class="detail-btn"  @click="toLottery(lotteryDetail)">
						<img src="../../assets/images/home/video.png">
						{{$store.state.system.webLang.buy_now}}
					</div>
				</div>
				
				
			</div>
			
		</van-popup>
		
		<!--开奖详情-->
		
		
		
		
		
		
		
		<div class="pop-up-bg" v-if="showRecharge || showSwipeImg" @click="closeBg"></div>
		
			
		  	<transition name="slide-popupShow"> 

		
			  <div class="pay-pwd-wrap"  v-if="showRecharge">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.pls_contact_agent_for_deposit}}</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <!--<van-button type="primary" class="pay-cancel-btn"  @click="toPhone">
			           CALL 
			        </van-button>-->
			        <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share">{{$store.state.system.webLang.dial_now}} </a>
			        <van-button type="primary" @click="tips(2)" class="pay-submit-btn clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile">
						{{$store.state.system.webLang.copy_number}}
			        </van-button>
			      </div>
			      
			  </div>
			  
			  
			  
			  <div class="show-swipeImg" v-if="showSwipeImg">
			  	<img :src="linkImg" />
			  	<i class="iconfont iconguanbi1" @click="showSwipeImg = false"></i>
			  </div>
			
			</transition>
			
			
			
			
			
			
			<div class="downLoad-a clip-btn"  :data-clipboard-text="channel" @click="tips(1)" v-if="$store.state.system.showAndroid">
				<a href="https://dl.lottoplus.cc/apps/FantasyLand.apk" >
					<FloatBall >	
		      		</FloatBall>
				</a>
			</div>
		
		
			
			
			
			<van-overlay :show="$store.state.system.showGuide&&(($store.state.system.guideType==1&&newHistoryList.length)||$store.state.system.guideType==3||$store.state.system.guideType==5||$store.state.system.guideType==7||$store.state.system.guideType==14)" lock-scroll class="guide-overlay"/>	
			
			
		
			<!--那加兰购彩引导/比特币汇率购彩引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==1&&newHistoryList.length" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
	
				<div v-if="$store.state.system.guideIndex==7" class="guide-1 guide-wrap">
					
					<i class="iconfont iconxiangxia"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				
		
			</transition>
			</div>
			<!--那加兰购彩引导/比特币汇率购彩引导-->
			
			
			
			
			<!--绑定手机号引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==3" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
					
				<div v-if="$store.state.system.guideIndex==0" class="guide-2 guide-wrap">
				
					<img src="../../assets/images/guide-people.jpg" class="guide-people"/>
					<div class="guide-text">
						<p>{{$store.state.system.guideTemp}}</p>
						<!--<p></p>-->
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.link_it_now}} ({{$store.state.system.webLang.bonus}} {{$store.state.system.guidePoints}})</span>
							<span @click="closeGuide('point')">{{$store.state.system.webLang.knew_it_Skip_it}}</span>
						</div>
					</div>
				</div>	
				
				
				<div v-if="$store.state.system.guideIndex==1" class="guide-3 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				
				
				
				
			
			</transition>
			</div>
			
			
			<!--绑定手机号引导-->
			
			
			
			<!--充值引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==5" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
					
				<div v-if="$store.state.system.guideIndex==0" class="guide-4 guide-wrap">
				
					<img src="../../assets/images/guide-people.jpg" class="guide-people"/>
					<div class="guide-text">
						<p v-if="$store.state.system.langType=='en'">Welcoming bonus for the first time deposit will receive {{$store.state.system.guidePoints}} bonus!</p>
						<p v-else>पहली बार जमा राशि पर स्वागत बोनस {{$store.state.system.guidePoints}} प्राप्त होगा!</p>
						<!--<p></p>-->
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.deposit_now_bouns}} {{$store.state.system.guidePoints}}</span>
							<span @click="closeGuide('point')">{{$store.state.system.webLang.knew_it_Skip_it}}</span>
						</div>
					</div>
				</div>	
				
				
				<div v-if="$store.state.system.guideIndex==1" class="guide-5 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				
				
				
				
			
			</transition>
			</div>
			
			
			<!--充值引导-->
			
			
			
			<!--推广员系统引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==7" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
					
				<div v-if="$store.state.system.guideIndex==0" class="guide-6 guide-wrap">
				
					<img src="../../assets/images/guide-people.jpg" class="guide-people"/>
					<div class="guide-text">
						<p>{{$store.state.system.guideTemp}}</p>
						<!--<p></p>-->
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.starts_guiding}}</span>
							<span @click="closeGuide">{{$store.state.system.webLang.knew_it_Skip_it}}</span>
						</div>
					</div>
				</div>	
				
				
				<div v-if="$store.state.system.guideIndex==1" class="guide-7 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				
				
				
				
			
			</transition>
			</div>
			
			
			<!--推广员系统引导-->
			
			
			
			<!--代理咨询引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==14" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
					
				<div v-if="$store.state.system.guideIndex==0" class="guide-8 guide-wrap">
				
					<img src="../../assets/images/guide-people.jpg" class="guide-people"/>
					<div class="guide-text">
						<p>{{$store.state.system.guideTemp}}</p>
						<!--<p></p>-->
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.t_know_more}}</span>
							<span @click="closeGuide">{{$store.state.system.webLang.knew_it_Skip_it}}</span>
						</div>
					</div>
				</div>	
				
				
				<div v-if="$store.state.system.guideIndex==1" class="guide-9 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				
				
				
				
			
			</transition>
			</div>
			
			
			<!--代理咨询引导-->



		<tabbar></tabbar>
	</div>
	
	
	
	
	
</template>

<script src="./Results.js"></script>
<style lang="scss">
	@import './Results';
</style>