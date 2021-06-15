<template>
	<div class="mine-wrap" >
		
		<app-header :title="$store.state.system.webLang.profile" v-on:clickLeft="returnBack" :right="true" :class="{'activeHeader':$store.state.system.guideType==14&&$store.state.system.guideIndex==2}">
			<template slot="right">
				<img src="../../assets/images/mine/kefu@2x.png" />
                <span  @click="openKefu">FAQ</span>
		    </template>
		</app-header>
		
		
		<div class="mine-info">
			<div class="info-top">
				<van-uploader :after-read="afterRead">
						<img :src="$store.state.user.info.avatar" class="avatar" v-if="$store.state.user.info.avatar"/>
						<img :src="$store.state.system.systemInfo.default_avatar" class="avatar" v-else/>
				</van-uploader>
				<p @click="toEditInfo">{{userInfo.nickname}} <i class="iconfont iconxiugai1"></i>  </p>
				<p>{{$store.state.system.webLang.ID}}:{{userInfo.id}}</p>
			</div>
			<div class="info-bottom">
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
				<!--<div class="bottom-right" @click="cancelDraw">
					<span>Revoke withdrawal</span>
				</div>-->
			</div>
		</div>
		
		<van-overlay :show="show1" lock-scroll='true'>
			<van-loading type="spinner" size="24px">
				Uploading...
			</van-loading>
		</van-overlay>
		
		<div class="mine-btn-img">
			<div @click="openShowRecharge">
				<span>{{$store.state.system.webLang.deposit}}</span>
				<img src="../../assets/images/mine/setting/invest.png" />
			</div>
			<div @click="openDraw" :class="{'gray':$store.state.user.info.is_agent=='Y'}">
				<span>{{$store.state.system.webLang.withdraw}}</span>
				<img src="../../assets/images/mine/setting/Draw.png"  v-if="$store.state.user.info.is_agent=='N'"/>
			</div>
		</div>
		
		
		<div class="mine-safe" @click="toSafetyGrade" :class="{'guideActive':$store.state.system.guideType==3&&$store.state.system.guideIndex==2}">
			<div class="safe-left">
				<div class="safe-pie">
					<div class="pie"  v-if="safePercent>0" :class="{'aaa':safePercent==25,'bbb':safePercent==50,'ccc':safePercent==75,'ddd':safePercent==100}"></div>
				</div>
				<div v-if="safePercent>0" >{{safePercent}}%</div>
			</div>
			<div class="safe-center" >
				<div>{{$store.state.system.webLang.security_level}}：{{safePercent<50?$store.state.system.webLang.low:safePercent<75?$store.state.system.webLang.medium:$store.state.system.webLang.high}}</div>
				<div>{{$store.state.system.webLang.complete_he_information}}</div>
			</div>
			<div class="safe-right">
				<i class="iconfont iconxiangyou"></i>
			</div>
		</div>
		
		
		<div class="mine-route-list">
			
			
			<!--推广-->
			<div class="mine-route" @click="toPromote"  v-if="$store.state.user.info.is_agent=='N'" :class="{'guideActive':$store.state.system.guideType==7&&$store.state.system.guideIndex==2}">
				<img src="../../assets/images/title-agent.png"/>
				{{$store.state.system.webLang.promotion_center}}
				<i class="iconfont iconxiangyou"></i>
			</div>
			
			
			<!--代理-->
			<div class="mine-route" @click="toAgent" v-if="$store.state.user.info.is_agent=='Y'">
				<img src="../../assets/images/title-agent.png"/>
				{{$store.state.system.webLang.agent_center}}
				<i class="iconfont iconxiangyou"></i>
			</div>
			
			<!--资金变动记录-->
			<div class="mine-route" @click="$router.push('/changeRecord')">
				<img src="../../assets/images/mine/change@2x.png" />
				 {{$store.state.system.webLang.transaction_records}}
				<i class="iconfont iconxiangyou"></i>
			</div>
			
			<!--账户 管理-->
			<div class="mine-route" @click="toAccountManage">
				<img src="../../assets/images/mine/account@2x.png" />
				 {{$store.state.system.webLang.funds_transfer_to_bank_account}}
				<i class="iconfont iconxiangyou"></i>
			</div>
			
			<!--修改密码-->
			<div class="mine-route" @click="toEditPassword">
				<img src="../../assets/images/mine/pwd@2x.png" />
				 {{$store.state.system.webLang.change_password}}
				<i class="iconfont iconxiangyou"></i>
			</div>
			
			
			<!--修改资金密码-->
			<div class="mine-route" @click="toEditPinNumber">
				<img src="../../assets/images/mine/pwd@2x.png" />
				 {{$store.state.system.webLang.setting_pin_number}}
				<i class="iconfont iconxiangyou"></i>
			</div>
			
			<!--站内信件-->
			<!--<div class="mine-route" @click="$router.push('/message')">
				<img src="../../assets/images/mine/notifi@2x.png" />
				Notification
				<i class="iconfont iconxiangyou"/></i>
				<span class="messageNum" v-if="userInfo.unread_msg_count>0">{{userInfo.unread_msg_count}}</span>
			</div>-->
			
			
			
			
			
			<!--语言切换-->
			<div class="mine-route" @click="toSettingLang">
				<img src="../../assets/images/mine/english@2x.png" />
				   {{$store.state.system.webLang.language}}
				<i class="iconfont iconxiangyou"></i>
			</div>
			<!-- 声音开关 -->
			<div class="mine-route">
				<img src="../../assets/images/mine/shenyingicon.png" />
				   Sound
				<div class="iconfont"><van-switch v-model="$store.state.system.sound" size="24px" inactive-color="#dcdee0" /></div>
			</div>
			
			<!--退出账号-->
			<div class="mine-route" @click="loginOut">
				<img src="../../assets/images/mine/login out@2x.png" />
				<span class="route-text"> {{$store.state.system.webLang.log_out}}</span>
				<i class="iconfont iconxiangyou"></i>
			</div>
		</div>
		
		
		
		<!--提现-->
			<van-dialog class="draw-dialog" v-model="showDraw" :closeOnClickOverlay="true" :title="$store.state.system.webLang.application_for_withdrawal"  :before-close="beforeClose"   @cancel="showDraw=false"  @confirm="submitDraw" show-cancel-button>
		 		
		 		<div class="draw-wrap">
		 			<div class="draw-block">
			 			<p class="block-title">{{$store.state.system.webLang.collection_account}}</p>
			 			<select @change="selectBankCard($event)" >
			 				<option v-for="(item,index) in bankCardList" :key="index"  :value='index'>
								 **** **** **** {{item.name.substr(item.name.length - 4)}}</option>
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
		
		
		
		<div class="pop-up-bg" v-if="showRecharge || showKefu" @click="closeBg"></div>
		  	<transition name="slide-popupShow"> 
	
			  <!--充值-->
			  <div class="pay-pwd-wrap"  v-if="showRecharge">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.pls_contact_agent_for_deposit}}</div>
			     
					<div class="pay-text">WhatsApp:{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <!--<van-button type="primary" class="pay-cancel-btn"  @click="toPhone">
			           {{$store.state.system.webLang.dial_now}} 
			           
			        </van-button>-->
			        <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share">{{$store.state.system.webLang.dial_now}} </a>
			        <van-button type="primary" class="pay-submit-btn clip-btn" :data-clipboard-text="$store.state.system.rechargeMobile">
			            {{$store.state.system.webLang.copy_number}}
			        </van-button>
			      </div>
			      
			  </div>
			  <!--充值-->
			  
			  
			  <!--客服-->
			  <div class="pay-pwd-wrap"  v-if="showKefu">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.please_contact_service}}</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn  clip-btn" :disabled="$store.state.system.showGuide" :data-clipboard-text="$store.state.system.rechargeMobile" @click="closeBtn">
						{{$store.state.system.webLang.copy}}
			        </van-button>
			        <!--<van-button type="primary" class="pay-submit-btn">-->
			
			         <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share"  @click="closeBtn">{{$store.state.system.webLang.message_now}}</a>
			        <!--</van-button>-->
			       
			      </div>
			      
			  </div>
			  <!--客服-->
			  
			  
			   <!--客服引导-->
			  <div class="pay-pwd-wrap"  v-if="showKefuGuide">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.please_contact_service}}</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <van-button type="primary" class="pay-cancel-btn"  @click="closeBtn">
			           {{$store.state.system.webLang.copy}}
			        </van-button>
			        <van-button type="primary" class="pay-submit-btn">
						{{$store.state.system.webLang.message_now}}
			        </van-button>
			       
			      </div>
			      
			  </div>
			  <!--客服引导-->
			  
			  
			</transition>
			
			
			<van-overlay :show="$store.state.system.showGuide&&($store.state.system.guideType==3||$store.state.system.guideType==7||$store.state.system.guideType==14)" lock-scroll class="guide-overlay"/>	
			<!--绑定手机号引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==3" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
	
				
				
				<div v-if="$store.state.system.guideIndex==2" class="guide-0 guide-wrap">
					
					<i class="iconfont iconxiangxia"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
			</transition>
			</div>
			<!--绑定手机号引导-->
			
			<!--推广员系统引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==7&&$store.state.user.info.is_agent=='N'" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
	
				
				
				<div v-if="$store.state.system.guideIndex==2" class="guide-1 guide-wrap">
					
					<i class="iconfont iconxiangxia"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
			</transition>
			</div>
			<!--推广员系统引导-->
			
			
			<!--代理咨询引导-->
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==14" @click="stopKeyBoaddText"> 
				<transition name="slide-popupShow"> 	
					
	
				
				
				<div v-if="$store.state.system.guideIndex==2" class="guide-2 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				<div v-if="$store.state.system.guideIndex==3" class="guide-3 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click="closeGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
			</transition>
			</div>
			<!--代理咨询引导-->
		
		

	</div>
</template>

<script src="./Mine.js"></script>
<style lang="scss">
	@import './Mine';
</style>