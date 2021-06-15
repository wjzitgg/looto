<template>
	<div class="agent-wrap" >
		

		<app-header :title="$store.state.system.webLang.promotion_center" v-on:clickLeft="returnBack" :right="true">
			<template slot="right">
				<img src="../../assets/images/mine/kefu@2x.png" @click="showKefu=true"/>
                <span  @click="showKefu=true">FAQ</span>
		    </template>
			
		</app-header>
		
		
		<div class="mine-info">

			<div class="info-top">
				<div class="bottom-left">
					<div>
						{{$store.state.system.webLang.account_balance}}: 
						<span class="amount">
							<span v-if="showAmount==1">****</span>
							<span v-else>₹ {{userInfo.points | NumFormat}}</span>
						</span>
						<img src="../../assets/images/mine/xianshi@2x.png" @click="changeShowAmount(1)" v-if="showAmount==2"/>
						<img src="../../assets/images/mine/yincang@2x.png" @click="changeShowAmount(2)" v-if="showAmount==1"/>
					</div>
					<div>
						{{$store.state.system.webLang.bonus}}:
						<span class="amount"> 
							<span v-if="showAmount==1">****</span>
							<span v-else>₹ {{userInfo.lotto_points | NumFormat}}</span>
						</span>
					</div>
					<div>
						{{$store.state.system.webLang.withdrawable_amount}}t:
						<span class="amount"> 
							<span v-if="showAmount==1">****</span>
							<span v-else>₹ {{userInfo.draw_points | NumFormat}}</span>
						</span>
					</div>
				</div>
				<!--<div class="bottom-right"  @click="cancelDraw">
					<span>Revoke withdrawal</span>
				</div>-->
			</div>
			
			<div class="info-bottom">
				<div @click="openShowRecharge">
					<div class="info-text">
						<p>{{$store.state.system.webLang.deposit}}</p>
					</div>
					<img src="../../assets/images/agent/invest-1.png" />
				</div>
				<!--<div @click="showTransfer=true">
					<div class="info-text">
						<p>{{$store.state.system.webLang.send}}</p>
						<p>Chips</p>
					</div>
					<img src="../../assets/images/agent/转账-1.png" />
				</div>-->
				<div @click="openDraw" :class="{'gray':userInfo.is_agent=='Y'}">
					<div class="info-text">
						<p>{{$store.state.system.webLang.withdraw}}</p>
					</div>
					<img src="../../assets/images/agent/提现-1.png" v-if="userInfo.is_agent=='N'"/>
				</div>
			</div>
		</div>
		
		
		<van-tabs v-model="tabIndex" :class="{'guideActive':$store.state.system.guideType==7&&$store.state.system.guideIndex==5}">
		  	<van-tab :title="item" v-for="(item,index) in tabList" :disabled="index==4" ></van-tab>
		</van-tabs>
		

		
		
		
		<div class="registration-link" v-if="tabIndex==0">
			<!--<div class="link-block">
				
				<div class="block-left">
					<img src="../../assets/images/agent/选中@2x.png" @click="agentUpdata('agent',1)" v-if="userInfo.agent_invitation_is_open=='Y'"/>
					<img src="../../assets/images/agent/禁用@2x.png" @click="agentUpdata('agent',2)" v-if="userInfo.agent_invitation_is_open=='N'"/>
				</div>
				<div class="block-center">
					<p>{{$store.state.system.webLang.downline_agent_registration_link}}</p>
					<p><i class="iconfont iconV"></i> {{$store.state.system.webLang.transferring_chips}}</p>
					<p>{{$store.state.system.systemInfo.invitation_url+userInfo.agent_invitation_code}}</p>
				</div>
				<span class="copy-btn clip-btn" :data-clipboard-text="$store.state.system.systemInfo.invitation_url+userInfo.agent_invitation_code" v-if="userInfo.agent_invitation_is_open=='Y'">COPY</span>
	
			</div>-->
			
			<div class="link-block">
				
				<div class="block-left" :class="{'guideActiveA':$store.state.system.guideType==7&&$store.state.system.guideIndex==3}">
					<!--<img src="../../assets/images/agent/选中@2x.png" @click="agentUpdata('player',1)" v-if="userInfo.invitation_is_open=='Y'"/>
					<img src="../../assets/images/agent/禁用@2x.png" @click="agentUpdata('player',2)" v-if="userInfo.invitation_is_open=='N'"/>-->
					<i class="iconfont iconcopy clip-btn" :data-clipboard-text="$store.state.system.systemInfo.invitation_url+userInfo.invitation_code" :class="{'guideActiveA':$store.state.system.guideType==7&&$store.state.system.guideIndex==3}"></i>
				</div>
				<div class="block-center">
					<p>{{$store.state.system.webLang.downline_player_registration_link}}</p>
					<p></p>
					<p>{{$store.state.system.systemInfo.invitation_url+userInfo.invitation_code}}</p>
				</div>
			<!--	<span class="copy-btn clip-btn"  :data-clipboard-text="$store.state.system.systemInfo.invitation_url+userInfo.invitation_code" v-if="userInfo.invitation_is_open=='Y'" :class="{'guideActive':$store.state.system.guideType==7&&$store.state.system.guideIndex==3}">{{$store.state.system.webLang.copy}}</span>-->
			
			</div>
			
			
			<div class="promote-qrCode">
				<p>{{$store.state.system.webLang.promote_code}}</p>
				<img :src="userInfo.invitation_qrcode"  v-if="userInfo.invitation_qrcode" @click="openImg"/>
				<van-loading size="24px" v-else>{{$store.state.system.webLang.loading_text}}...</van-loading>
			</div>
			
			<van-image-preview
			  v-model="showImg"
			  :images="dataURL"
			  closeOnPopstate
			>
			</van-image-preview>
			
			
			
			
			
		</div>
		
		
		<div class="team-sales" v-if="tabIndex==1">
			<div class="calendar" @click="calendarShow=true">
				<i class="iconfont iconrili"></i>
				<div>{{selsetDateStart+'~'+selsetDateEnd}}</div>
			</div>
			<div class="time-btn">
				<div @click.stop="selectList('Yesterday')">{{$store.state.system.webLang.yesterday}}</div>
				<div @click.stop="selectList('week')">{{$store.state.system.webLang.last_week}}</div>
				<div @click.stop="selectList('month')">{{$store.state.system.webLang.last_month}}</div>
			</div>
			
			<div class="sales-list">
				<div class="list-title">
					<!-- <span>{{$store.state.system.webLang.total}}</span> -->
					<span>Commission</span>
					<span>{{$store.state.system.webLang.deposit}}</span>
					<span>{{$store.state.system.webLang.withdraw}}</span>
					<span>{{$store.state.system.webLang.Bet}}</span>
				</div>
				<div class="list-cell">
					<span>{{total.all_recharge_points*0.1}}</span>
					<span>₹{{total.all_recharge_points | NumFormat}}</span>
					<span>₹{{total.all_draw_points | NumFormat}}</span>
					<span>₹{{total.all_bet_points | NumFormat}}</span>
				</div>
				<div class="list-cell list-cell-a" v-for="item in salesList.data">
					<span @click="openUserInfo(item)">{{item.custom_name?item.custom_name:item.nickname}}</span>
					<span>₹{{item.recharge_points | NumFormat}}</span>
					<span>₹{{item.draw_points  | NumFormat}}</span>
					<span>₹{{item.bets_points | NumFormat}}</span>
				</div>
				<!--<div class="list-cell-bottom" v-if="salesList.rebate_points>=0">
					{{$store.state.system.webLang.total_bonus}}: ₹{{salesList.rebate_points}}
					
				</div>-->
			</div>
			
		</div>
		
		<div class="question-wrap" v-if="tabIndex==1">
			<p>{{$store.state.system.webLang.tips_text}}</p>
			<p>{{$store.state.system.webLang.promote_text}}</p>
			<p>{{$store.state.system.webLang.contact_email}}: bd@lottoplus.cc</p>
		</div>
		
		
		<van-loading type="spinner" color="#1989fa" v-if="reqLoading">{{$store.state.system.webLang.loading_text}}</van-loading>

		
		<!--展示下线用户信息-->
		<van-popup position='bottom' class="promote-popup" v-model="showUserInfo">
			<i class="iconfont iconguanbi1" @click="showUserInfo=false"></i>
			<div class="promote-avatar">
				<img :src="downLineUserInfo.avatar" />
				<div class="promote-avatar-right">
					<p @click="openShowchangeName">{{$store.state.system.webLang.UserName}}:{{downLineUserInfo.custom_name?downLineUserInfo.custom_name:downLineUserInfo.nickname}} <i class="iconfont iconxiugai"></i> </p>
					<p>{{$store.state.system.webLang.ID}}:{{downLineUserInfo.id}}</p>
				</div>
			</div>
			
			
			<div class="promote-time">
				<div>{{$store.state.system.webLang.registration}}:{{downLineUserInfo.creation_time}}</div>
				<div>{{$store.state.system.webLang.last_login}}:{{downLineUserInfo.last_login_time}}</div>
				<div>{{$store.state.system.webLang.link_number}}:{{downLineUserInfo.mobile}}</div>
			</div>
			
			
			<div class="promote-amount">
				<div>
					<p>
						{{$store.state.system.webLang.Balance}}:{{downLineUserInfo.points}}
					</p>
					<p>
						{{$store.state.system.webLang.total_deposit}}:{{downLineUserInfo.recharge_points}}
					</p>
				</div>
				
				<div>
					<p>
						{{$store.state.system.webLang.bonus}}:{{downLineUserInfo.lotto_points}}
					</p>
					<p>
						{{$store.state.system.webLang.total_withdraw}}:{{downLineUserInfo.draw_points}}
					</p>
				</div>
				
				<div>
					<p>
						{{$store.state.system.webLang.withdrawable_amount}}:{{downLineUserInfo.frozen_points}}
					</p>
					<p>
						{{$store.state.system.webLang.total_bets}}:{{downLineUserInfo.bets_points}}
					</p>
				</div>
				
			</div>
		
		
		</van-popup>
		<!--展示下线用户信息-->
		
		
		
		<van-overlay :show="showchangeName" class="promote-popup-overlay" :duration="0.1" @click="showchangeName=false" />

		  	<transition name="slide-popupShow"> 
			    <div class="pay-pwd-wrap"  v-if="showchangeName">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.edit_nickname}}</div>
			      <input ref="payInput"   maxlength="16" v-model="newUserName"  :placeholder="$store.state.system.webLang.please_enter_a_new_nickname"/>
			
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn"  @click="showchangeName=false">
			            {{$store.state.system.webLang.cancel}}
			        </van-button>
			        <van-button type="primary" class="pay-submit-btn" :loading="clickBol" @click="updateName">
			            {{$store.state.system.webLang.Submit}}
			        </van-button>
			      </div>
			      
			  </div>
			</transition>
	
		
		
		
		<!--提现-->
			<van-dialog class="draw-dialog" v-model="showDraw" :title="$store.state.system.webLang.application_for_withdrawal"  :closeOnClickOverlay="true" :before-close="beforeClose"   @cancel="showDraw=false" @confirm="submitDraw" show-cancel-button>
		 		
		 		<div class="draw-wrap">
		 			<div class="draw-block">
			 			<p class="block-title">{{$store.state.system.webLang.collection_account}</p>
			 			<select @change="selectBankCard($event)" >
			 				<option v-for="(item,index) in bankCardList"  :value='index'>**** **** **** {{item.name.substr(item.name.length - 4)}}</option>
			 			</select>
			 		</div>
			 		<div class="draw-block">
			 			<p class="block-title">{{$store.state.system.webLang.cash_withdrawal_amount}} (Rs.{{userInfo.disposable_points | NumFormat}})</p>
			 			<input  type="text" v-model="drawAmount"/>
			 		</div>
			 		<div class="draw-block">
			 			<p class="block-title">{{$store.state.system.webLang.pin_number}}</p>
			 			<input  type="password" v-model="drawPassword"/>
			 		</div>
			 		
			 		<div class="draw-tips">{{$store.state.system.webLang.withdrawal_tips}} </div>
		 		</div>
		 		
			</van-dialog>
		
		
		<!--提现-->
		
		
		
		<!--日历-->
		<van-calendar :title="$store.state.system.webLang.calendar" :confirm-text="$store.state.system.webLang.btn_confirm" v-model="calendarShow" type="range" :min-date="minDate"
  :max-date="maxDate" :default-date="defaultDate" :overlay="false" :max-range="90" :range-prompt="$store.state.system.webLang.filter_for_up_to_3_months"   @confirm="onConfirm" @select="onSelect" />
		
		<!--日历-->
		
		
		<div class="pop-up-bg" v-if="showRecharge||copyAccoutShow||showQuestion||showKefu" @click="closeBg"></div>
		  	<transition name="slide-popupShow"> 
	
			  <!--充值-->
			  <div class="pay-pwd-wrap"  v-if="showRecharge">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.pls_contact_agent_for_deposit}}</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn  clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile">
			           {{$store.state.system.webLang.copy}} 
			        </van-button>
			         <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share">{{$store.state.system.webLang.message_now}}</a>
			      </div>
			      
			  </div>
			  <!--充值-->
			  
			  
			  <!--开户成功复制帐号-->
			  <div class="pay-pwd-wrap"  v-if="copyAccoutShow">
			      <div class="pay-pwd-title">{{agentType==1?$store.state.system.webLang.downline_player:$store.state.system.webLang.agent}} {{$store.state.system.webLang.account_opened_successfully}}</div>
			     
					<div class="pay-text">{{$store.state.system.webLang.account}}:{{userName}}</div>
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn  clip-btn"  @click="toPhone"  :data-clipboard-text="userName" >
						{{$store.state.system.webLang.copy}}  
			        </van-button>
			        <van-button type="primary" class="pay-submit-btn"@click="copyAccoutShow=false">
			            {{$store.state.system.webLang.cancel}}
			        </van-button>
			      </div>
			      
			  </div>
			  <!--开户成功复制帐号-->
			  
			  
			  	<!--问号弹窗-->
				<div class="question-popup" v-if="showQuestion">
					<i class="iconfont iconguanbi1" @click="showQuestion=false"></i> 
					<div class="question-title"> FantasyLand</div>
					<div class="question-wrap">
						<p>1.Introduce LottoPlus to friends, 10% of their deposit will becoming your bonus! </p>
						<p>2.Becoming our agent get up to 20% deposit bonus.</p>
						<p>3.Contact number: 0085297954910</p>
						<p>4.The right of final interpretation belongs to the LottoPlus.</p>
					</div>
				</div>

				<!--问号弹窗-->
				
				
				<!--客服-->
			  <div class="pay-pwd-wrap"  v-if="showKefu">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.please_contact_service}}</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn  clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile" @click="closeBtn">
						{{$store.state.system.webLang.copy}}
			        </van-button>
			        <!--<van-button type="primary" class="pay-submit-btn">-->
			            <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share" @click="closeBtn">{{$store.state.system.webLang.message_now}}</a>
			            
			        <!--</van-button>-->
			       
			      </div>
			      
			  </div>
			  <!--客服-->
			  
			  
			</transition>
			
			
			
			
			<!--转账-->
			<van-dialog class="draw-dialog" v-model="showTransfer" :title="$store.state.system.webLang.transfer_application" :confirmButtonText="$store.state.system.webLang.btn_confirm" :cancelButtonText="$store.state.system.webLang.cancel" :closeOnClickOverlay="true" :before-close="beforeClose"  @cancel="showTransfer=false" @confirm="arentTransferPoints" show-cancel-button>
		 		
		 		<div class="draw-wrap">
		 			<div class="draw-block">
			 			<p class="block-title">{{$store.state.system.webLang.account_or_ID}}</p>
			 			<input v-model="transferUsername" type="text" :placeholder="$store.state.system.webLang.payee_account_or_ID"/>
			 		</div>
			 		<div class="draw-block">
			 			<p class="block-title">{{$store.state.system.webLang.transfer_amount}</p>
			 			<input v-model="transferAmount" type="text" :placeholder="$store.state.system.webLang.minimum_drawdown_amount"/>
			 		</div>
			 		<div class="draw-block">
			 			<p class="block-title">{{$store.state.system.webLang.pin_number}}</p>
			 			<input v-model="drawPassword"  type="password" :placeholder="$store.state.system.webLang.enter_6_digit_pin_number"/>
			 		</div>
			 		
			 	
		 		</div>
		 		
			</van-dialog>
			<!--转账-->
			
			
			<van-overlay :show="$store.state.system.showGuide&&$store.state.system.guideType==7" lock-scroll class="guide-overlay"/>	
			 <!--推广员系统引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==7" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
	
				
				
				<div v-if="$store.state.system.guideIndex==3" class="guide-0 guide-wrap">
					
					<i class="iconfont iconxiangxia"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				<div v-if="$store.state.system.guideIndex==4" class="guide-1 guide-wrap">
					
					<i class="iconfont iconxiangxia"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				<div v-if="$store.state.system.guideIndex==5" class="guide-2 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				<div v-if="$store.state.system.guideIndex==6" class="guide-3 guide-wrap">
				
					<!--<i class="iconfont iconxiangxia"></i>-->
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click="closeGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				
				
			</transition>
			</div>
			<!--推广员系统引导-->
			
			
			
		
		
		

	</div>
</template>

<script src="./Promote.js"></script>
<style lang="scss">
	@import './Promote';
</style>