<template>
	<div class="agent-wrap" >
		

		<app-header :title="$store.state.system.webLang.agent_center" v-on:clickLeft="returnBack" :right="true">
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
						{{$store.state.system.webLang.withdrawable_amount}}:
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
						<p>{{$store.state.system.webLang.deposit_amount}}</p>
					
					</div>
					<img src="../../assets/images/agent/invest-1.png" />
				</div>
				<div @click="showTransfer=true">
					<div class="info-text">
						<p>{{$store.state.system.webLang.send_chips}}</p>
				
					</div>
					<img src="../../assets/images/agent/转账-1.png" />
				</div>
				<div @click="openDraw" :class="{'gray':userInfo.is_agent=='Y'}">
					<div class="info-text">
						<p>{{$store.state.system.webLang.withdraw_money}}</p>
	
					</div>
					<img src="../../assets/images/agent/提现-1.png" v-if="userInfo.is_agent=='N'"/>
				</div>
			</div>
		</div>
		
		
		<van-tabs v-model="tabIndex">
		  	<van-tab :title="item" v-for="(item,index) in tabList" :disabled="index==4"></van-tab>
		</van-tabs>
		
		
		<div class="open-account" v-if="tabIndex==0">
			<div class="account-wrap">
				<div>
					<div class="wrap-title">{{$store.state.system.webLang.account}}</div>
					<van-field v-model="userName" :error-message="errorMsgA"  maxlength="12"  clearable  :placeholder="$store.state.system.webLang.account" />
					<div class="tips">{{$store.state.system.webLang.number_alphabe}}</div>
				</div>
			</div>
			<div class="account-wrap">
				<div>
					<van-field  :placeholder="$store.state.system.systemInfo.default_password" readonly />
					<div class="tips">{{$store.state.system.webLang.default_password_for_agent}}</div>
				</div>
			</div>
			
			
			<div class="account-btn">
				<div class="btn-top">
					<van-radio-group v-model="agentType" checked-color="#47B544">
					 	<van-radio name="1">{{$store.state.system.webLang.downline_player}}</van-radio>
					  	<van-radio name="2" :disabled="userInfo.agent_level_count==3" >{{$store.state.system.webLang.downline_agent}}</van-radio>
					</van-radio-group>
				</div>
				<div class="btn-bottom">
					<van-button type="primary" size="large" :loading="submitBol" color="#47B544" @click="agentCreate">{{$store.state.system.webLang.Submit}}</van-button>
				</div>
				
			</div>
			

		</div>
		
		
		
		<div class="registration-link" v-if="tabIndex==1">
			<div class="link-block">
				
				<div class="block-left">
					<!--<img src="../../assets/images/agent/选中@2x.png" @click="agentUpdata('agent',1)" v-if="userInfo.agent_invitation_is_open=='Y'"/>
					<img src="../../assets/images/agent/禁用@2x.png" @click="agentUpdata('agent',2)" v-if="userInfo.agent_invitation_is_open=='N'"/>-->
					<i class="iconfont iconcopy clip-btn" :data-clipboard-text="$store.state.system.systemInfo.invitation_url+userInfo.agent_invitation_code" ></i>
				</div>
				<div class="block-center">
					<p>{{$store.state.system.webLang.downline_agent_registration_link}}</p>
					<p><i class="iconfont iconV"></i> {{$store.state.system.webLang.transferring_chips}}</p>
					<p>{{$store.state.system.systemInfo.invitation_url+userInfo.agent_invitation_code}}</p>
				</div>
			<!--	<span class="copy-btn clip-btn" :data-clipboard-text="$store.state.system.systemInfo.invitation_url+userInfo.agent_invitation_code" v-if="userInfo.agent_invitation_is_open=='Y'">{{$store.state.system.webLang.copy}} </span>-->
	
			</div>
			
			<div class="link-block">
				
				<div class="block-left">
					<!--<img src="../../assets/images/agent/选中@2x.png" @click="agentUpdata('player',1)" v-if="userInfo.invitation_is_open=='Y'"/>
					<img src="../../assets/images/agent/禁用@2x.png" @click="agentUpdata('player',2)" v-if="userInfo.invitation_is_open=='N'"/>-->
					<i class="iconfont iconcopy clip-btn" :data-clipboard-text="$store.state.system.systemInfo.invitation_url+userInfo.invitation_code" ></i>
				</div>
				<div class="block-center">
					<p>{{$store.state.system.webLang.downline_player_registration_link}}</p>
					<p></p>
					<p>{{$store.state.system.systemInfo.invitation_url+userInfo.invitation_code}}</p>
				</div>
			<!--	<span class="copy-btn clip-btn"  :data-clipboard-text="$store.state.system.systemInfo.invitation_url+userInfo.invitation_code" v-if="userInfo.invitation_is_open=='Y'">{{$store.state.system.webLang.copy}} </span>-->
		
			</div>
		</div>
		
		
		<div class="team-sales" v-if="tabIndex==2">
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
					<span></span>
					<span>{{$store.state.system.webLang.from_upper_agent}}</span>
					<span>{{$store.state.system.webLang.sent_out_to_downline}}</span>
					<span>{{$store.state.system.webLang.total_bets}}</span>
				</div>
				<div class="list-cell">
					<span>{{$store.state.system.webLang.total}}</span>
					<span>₹{{total.allPoints | NumFormat}}</span>
					<span>₹{{total.transfer_points  | NumFormat}}</span>
					<span>₹{{total.all_bet_points | NumFormat}}</span>
				</div>
				<div class="list-cell" v-for="item in salesList">
					<span>{{item.name}}</span>
					<span>₹{{item.points | NumFormat}}</span>
					<span>₹{{item.transfer_points  | NumFormat}}</span>
					<span>₹{{item.bet_points | NumFormat}}</span>
				</div>

			</div>
		</div>
		
		
		<div class="team-sales" v-if="tabIndex==3">

			
			<div class="sales-list">
				<div class="list-title">
					<span>{{$store.state.system.webLang.ID}}</span>
					<span>{{$store.state.system.webLang.User}}</span>
					<span>{{$store.state.system.webLang.Identity}}</span>
					<span>{{$store.state.system.webLang.Balance}}</span>
					<span style="flex: 3;">{{$store.state.system.webLang.last_login}}</span>
				</div>

				<div class="list-cell" v-for="item in Subordinates">
					<span>{{item.id}}</span>
					<span style="color: #666666;">{{item.username}}</span>
					<span style="color: #666666;">{{item.is_agent=='Y'?'Agent':'Player'}}</span>
					<span style="color: #666666;">₹{{item.points  | NumFormat}}</span>
					<span style="flex: 3;">{{getTime(item.last_login_time)}}</span>
				</div>
			</div>
		</div>
		
		
		
		
		<!--提现-->
			<van-dialog class="draw-dialog" v-model="showDraw" :title="$store.state.system.webLang.application_for_withdrawal" :closeOnClickOverlay="true" :before-close="beforeClose"   @cancel="showDraw=false" @confirm="submitDraw" show-cancel-button>
		 		
		 		<div class="draw-wrap">
		 			<div class="draw-block">
			 			<p class="block-title">{{$store.state.system.webLang.collection_account}}</p>
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
  :max-date="maxDate" :default-date="defaultDate" :overlay="false" :max-range="90" :range-prompt="$store.state.system.webLang.filter_for_up_to_3_months"  @confirm="onConfirm" @select="onSelect" />
		
		<!--日历-->
		
		
		<div class="pop-up-bg" v-if="showRecharge||copyAccoutShow||showKefu" @click="closeBg"></div>
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
			        <van-button type="primary" class="pay-submit-btn" @click="copyAccoutShow=false">
			            {{$store.state.system.webLang.cancel}}
			        </van-button>
			      </div>
			      
			  </div>
			  <!--开户成功复制帐号-->
			  

				
				
				
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
			 			<p class="block-title">{{$store.state.system.webLang.transfer_amount}}</p>
			 			<input v-model="transferAmount" type="text" :placeholder="$store.state.system.webLang.minimum_drawdown_amount"/>
			 		</div>
			 		<div class="draw-block">
			 			<p class="block-title">{{$store.state.system.webLang.pin_number}}</p>
			 			<input v-model="drawPassword"  type="password" :placeholder="$store.state.system.webLang.enter_6_digit_pin_number"/>
			 		</div>
			 		
			 	
		 		</div>
		 		
			</van-dialog>
			<!--转账-->
			
			
			
		
		
		

	</div>
</template>

<script src="./Agent.js"></script>
<style lang="scss">
	@import './Agent';
</style>