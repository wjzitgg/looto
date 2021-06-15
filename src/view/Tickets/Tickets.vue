<template>
	<div class="tickets-wrap" :style="`padding-top: ${$store.state.system.messageList.length?0.95:0}rem;`">
		
		
		<index-header></index-header>
		
		<lottery-Notice></lottery-Notice>
	
		
		<div class="tickets-top">
			<div @click="$router.push('/hisTickets')"> 
				<i class="iconfont icontime-fill"></i>
				<span>{{$store.state.system.webLang.history_record}}</span>
			</div>
			<div @click="lotteryClassShow = true">
				<img src="../../assets/images/mulu.png"/>
			</div>
		</div>
		
		
		<!--彩种选择弹窗-->
			<van-action-sheet v-model="lotteryClassShow" :actions="lotteryClass" @select="onSelectLotteryClass" @cancel="onCancel" :cancel-text="$store.state.system.webLang.cancel"/>
		<!--彩种选择弹窗-->
		
		
		<div class="tickets-list">
			<div class="tickets-list-wrap" v-for="item in lotteryBetsList" v-if="item.list.length">
				<div class="wrap-title">
					<div v-if="item.list[0].lottery_no_info.lottery_info">{{item.list[0].lottery_no_info.lottery_info.name}}</div>
					<div>
						<span>Buy Time: </span>
						<span>{{item.list[0].creation_time}}</span>
					</div>
				</div>
				
				<div class="wrap-list">
					
					<div class="list-cell" v-for="(item1,index1) in item.list">
						
						
						
						     	<div v-if="item.lottery_type==2" class="cell-type">
									{{item1.lottery_no_info.ext_type==1?'Next Draw':item1.lottery_no_info.ext_type==2?'Tomorrow Open':item1.lottery_no_info.ext_type==3?'Tomorrow Highest':item1.lottery_no_info.ext_type==4?'Tomorrow Lowest':''}}
								</div>
								<div v-else class="cell-type">FantasyLand</div>
						    
						
						
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
						
						<van-collapse v-model="activeNames"  v-if="item.lottery_type==2&&item1.complex_data.length" >
						<van-collapse-item title="" :name="item1.id" >
					
							<template #title>
								<div class="cell-top" >
									<div>
										<span>{{item1.complex_data[0].a}}</span>
									</div>
									<span>.</span>
									<div>
										<span>{{item1.complex_data[0].b}}</span>
									</div>
									<div>
										<span>{{item1.complex_data[0].c}}</span>
									</div>
								</div>
								<div class="right-text">Details</div>
							</template>
							<!--<template #right-icon>
								复投
								<van-icon name="arrow-up" />
							</template>-->
							<div class="cell-top"  v-for="(itemA,indexA) in item1.complex_data" v-if="indexA!=0">
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
								<div v-if="item1.e" class="u-f8">
									<span>{{item1.e==1?$store.state.system.webLang.single:item1.e==2?$store.state.system.webLang.double:''}}</span>
								</div>
							</div>
					
					
					
						
						
						
						
						
						
						
						<div class="cell-bottom">
							<div class="bottom-left">
								<div v-if="item1.status==1||item1.status==2" class="wait-pay" @click="toPay(item1,item.name)">{{$store.state.system.webLang.waiting_payment}}</div>
								<div v-else>
									<span>{{$store.state.system.webLang.top_prize}}: </span>
									<span v-if="item.lottery_type==1&&item1.lottery_no_info.lottery_info">
	
										₹ {{item1.lottery_no_info.lottery_info.win_1_points | NumFormat}}
									</span>
									<span v-if="item.lottery_type==2&&item1.lottery_no_info.lottery_info">
										<b v-if="item1.complex_data.length">
											<!--复投-->
											₹ {{item1.lottery_no_info.lottery_info.bets_points*item1.lottery_no_info.lottery_info.win_1_times*item1.times*item1.complex_data.length | NumFormat}}
										</b>
										
										<b v-else>
											<b v-if="item1.d">
												<!--尾数-->
												₹ {{item1.lottery_no_info.lottery_info.bets_points_guess*item1.lottery_no_info.lottery_info.win_c_times*item1.times | NumFormat}}
											</b>
											<b v-else-if="item1.e">
												<!--单双-->
												₹ {{item1.lottery_no_info.lottery_info.bets_points_single*item1.lottery_no_info.lottery_info.win_s_times*item1.times | NumFormat}}
											</b>
											<b v-else>
												<!--3个号码的-->
												₹ {{item1.lottery_no_info.lottery_info.bets_points*item1.lottery_no_info.lottery_info.win_1_times*item1.times | NumFormat}}
											</b>
										</b>
									</span>
									
						
									
									
									
								</div>
								
							</div>
							<div class="bottom-right">
								<span v-if="item1.no_times>1">{{$store.state.system.webLang.CHASE}}：<b>{{item1.now_no_times}}</b>/{{item1.no_times}}
								<span v-if="item1.no_times == 12">+1</span>
									<span v-if="item1.no_times == 18">+2</span>
									<span v-if="item1.no_times == 24">+3</span>
								</span>
								<span>{{$store.state.system.webLang.times}}:</span>
								<span style="color: #D0021B;">{{item1.times}}</span>
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
		
		
		<van-dialog v-model="showDialog" :title="$store.state.system.webLang.payment_or_not" :message="'Rs '+lotteryDetail.points+'(' +$store.state.system.webLang.Balance+'：Rs '+getNumFormat($store.state.user.info.points)+')'" :confirm-button-text="$store.state.system.webLang.delete_your_pack" :cancel-button-text="$store.state.system.webLang.confirm_purchase" confirm-button-color="#323233" cancel-button-color="#1989fa" :overlay="false"  @cancel="openPayPassword" @confirm="lotteryUserDelete" show-cancel-button>
		 
		</van-dialog>
	
			
			<div class="pop-up-bg" v-if="showDialog" @click="closeBg"></div>
			
			<!--支付密码-->
			
		  	<!--<transition name="slide-popupShow"> 
			    <div class="pay-pwd-wrap"  v-if="showPayPwd">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.Payment}}</div>
			      <input ref="payInput"   maxlength="12" v-model="payPassword" type="password" :placeholder="$store.state.system.webLang.enter_the_payment_password"/>
			
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn"  @click="showPayPwd=false">
			           {{$store.state.system.webLang.cancel}}
			        </van-button>
			        <van-button type="primary" class="pay-submit-btn" :loading="clickBol" @click="lotteryUserPay">
			            {{$store.state.system.webLang.confirm_payment}}
			        </van-button>
			      </div>
			      
			  </div>
			</transition>-->
				<!--支付密码-->
				
				
				<!--支付密码-->
			<van-dialog class="draw-dialog" v-model="showPayPwd" :closeOnClickOverlay="true"  :title="$store.state.system.webLang.buy_lottery" :confirmButtonText="$store.state.system.webLang.btn_confirm" :cancelButtonText="$store.state.system.webLang.cancel"  :before-close="beforeClose"   @cancel="showPayPwd=false" @confirm="lotteryUserPay" show-cancel-button>
		 		
		 		<div class="draw-wrap">
		 			
		 			
		 			<div class="lottery-text"  v-if="lotteryDetail">
		 				<div>{{$store.state.system.webLang.lottey_type}}：{{lotteryName}}</div>
		 				<div>{{$store.state.system.webLang.times}}：{{lotteryDetail.times}}</div>
		 				<div>{{$store.state.system.webLang.all_price}}：{{lotteryDetail.points | NumFormat}}</div>
		 			</div>
		
			
			 		<div class="draw-block">
			 			<p class="block-title">Fund password</p>
			 			<input  type="password" v-model="payPassword" ref="passwordInput"/>
			 		</div>
			 		
		 		</div>
		 		
			</van-dialog>
			
			
			<!--支付密码-->
			
			
			
			<div class="pop-up-bg" v-if="showRecharge" @click="closeBg"></div>
			
		  	<transition name="slide-popupShow"> 

			  <!--充值-->
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
			  <!--充值-->
			  
			  
			</transition>
			
			
			<div class="downLoad-a clip-btn"  :data-clipboard-text="channel" @click="tips(1)" v-if="$store.state.system.showAndroid">
				<a href="https://dl.lottoplus.cc/apps/FantasyLand.apk" >
					<FloatBall >	
		      		</FloatBall>
				</a>
			</div>
			
			
			<van-overlay :show="$store.state.system.showGuide&&($store.state.system.guideType==1||$store.state.system.guideType==2)" lock-scroll class="guide-overlay"/>	
			
			
			<!--那加兰购彩引导-->
	
			
			<div v-if="$store.state.system.showGuide&&$store.state.system.guideIndex==6&&$store.state.system.guideType==1" class="guide-9 guide-wrap" @click="stopKeyBoaddText">

				<i class="iconfont iconxiangxia"></i>
				<div class="guide-text">
					
					<p>{{$store.state.system.guideTemp}}</p>
					<div class="guide-btn">
						<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
					</div>
				</div>
			</div>
			
			<!--那加兰购彩引导-->
			
			
			<!--那加兰购彩引导/比特币汇率购彩引导-->
			<div v-if="$store.state.system.showGuide&&$store.state.system.guideIndex==14&&$store.state.system.guideType==1" class="guide-8 guide-wrap" @click="stopKeyBoaddText">
				
				<!--<i class="iconfont iconxiangshang"></i>-->
				<div class="guide-text">
					
					<p>{{$store.state.system.guideTemp}}</p>
					<div class="guide-btn">
						<span @click="closeGuide">{{$store.state.system.webLang.Next}}</span>
					</div>
				</div>
			</div>
			<!--那加兰购彩引导/比特币汇率购彩引导-->



		<tabbar></tabbar>
	</div>
</template>

<script src="./Tickets.js"></script>
<style lang="scss">
	@import './Tickets';
</style>