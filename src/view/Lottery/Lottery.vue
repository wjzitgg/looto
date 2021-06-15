<template>
	<!-- 第一次登陆进度条 -->
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
	
	
	
	
			<!--3：Dear evening；2：Dear day；1：Dear morning-->
	<div class="lottery-wrap" v-else :style="`padding-top: ${$store.state.system.messageList.length&&!$store.state.system.showGuide?0.95:0}rem;`">
		
		<index-header></index-header>

		<lottery-Notice v-if="!$store.state.system.showGuide"></lottery-Notice>
		
		
		<div class="lottery-buy">
			<van-tabs v-model="active" @click="onSelectLotteryClass" title-active-color="#f50000">
				<van-tab title="3 Mins/Draw"></van-tab>
				<van-tab title="Nagaland Lottery"></van-tab>
			</van-tabs>
			<!-- 新加兰 -->
			<div class="lottery-title" v-if="lotteryIndex!=0">
				NAGALAND STATE LOTTERIES <br>
				<!-- <div @click="lotteryClassShow = true">
					<img src="../../assets/images/mulu.png"/>
				</div> -->
				<div class="buy-top"  v-if="lotteryClass.length">
					<div :class="{'guideActiveA':($store.state.system.guideType==1&&$store.state.system.guideIndex==1)||($store.state.system.guideType==1&&$store.state.system.guideIndex==8)}"  >
						<p @click="lotterySelect">{{lotteryClass[lotteryIndex].name}} </p>
						<i class="iconfont iconxiajiang_huaban"></i>
						<i class="iconfont iconwenhao" :class="{'guideActiveB':($store.state.system.guideType==1&&$store.state.system.guideIndex==1)||($store.state.system.guideType==1&&$store.state.system.guideIndex==8)}" @click="toRules(lotteryClass[lotteryIndex].name)" ></i>
						
					</div>
					<p v-if="lotteryIndex!=0 && !coDown"  class="select-text select-textA">
							{{$store.state.system.webLang.pick_numbers}}
					</p>
					<p v-if="coDown && lotteryIndex!=0" class="calculagraph">
						Drawing Results
					</p>
				</div>
			</div>
			<!-- 新加兰说明问号 -->
			<!-- <div class="buy-top"  v-if="lotteryClass.length">
				<div :class="{'guideActiveA':($store.state.system.guideType==1&&$store.state.system.guideIndex==1)||($store.state.system.guideType==1&&$store.state.system.guideIndex==8)}"  >
					<p :class="{'guideActiveB':($store.state.system.guideType==1&&$store.state.system.guideIndex==1)||($store.state.system.guideType==1&&$store.state.system.guideIndex==8)}"  @click="lotteryClassShow = true" >{{lotteryClass[lotteryIndex].name}} <i class="iconfont iconwenhao" @click="toRules(lotteryClass[lotteryIndex].name)" ></i></p>
					<p v-if="lotteryIndex!=0" class="select-text select-textA">
						{{$store.state.system.webLang.pick_numbers}}
					</p>
				</div>
				<div @click="lotteryClassShow = true" v-if="lotteryIndex==0">
					<img src="../../assets/images/mulu.png"/>
				</div>
			</div> -->
			
			
			<div class="bse-wrap" v-if="bseShow">
				<!-- 指数下拉选择 -->
				<div class="bse-title" v-if="sysMonth">
					<span @click="openBseChaseShow" :class="{'guideActive':$store.state.system.guideType==1&&$store.state.system.guideIndex==9}">
						{{bseChaseList[bseIndex].name}}
					</span>
					<i class="iconfont iconxiajiang_huaban"></i> 
					<i class="iconfont iconwenhao" :class="{'guideActive':$store.state.system.guideType==1&&$store.state.system.guideIndex==8}" @click="toRules(lotteryClass[lotteryIndex].name)" ></i>
					<span>{{sysMonth}} {{sysTime/1000 | formatDate('dd hh:mm')}}</span>
				</div>
				
				
				
				<div v-if="!bseDataLoading">
				<div v-if="bseIndex==1" class="u-mb-20 u-text-center">
						<!-- 圆点虚线 -->
					<div class="linear"></div>
					<div class="explain">
						CURRENT RESULTS
					</div>
					<p :class="{'rise':bseDataInfo.contrast_percent>0,'decline':bseDataInfo.contrast_percent<0,'active-bse-current':bseTypeIndex==1}"> <span class="front">₹ {{front}}</span>{{shuzhi}}
						<i class="iconfont iconGroup-" v-if="bseDataInfo.contrast_percent>0"></i>
						<i class="iconfont iconplus-shiftdown" v-if="bseDataInfo.contrast_percent<0"></i>
					</p>
					<!-- <div class="current-bse"> -->
						<!-- <div>
							<b  :class="{'rise':bseDataInfo.contrast_percent>0,'decline':bseDataInfo.contrast_percent<0,'active-bse-current':bseTypeIndex==1}">{{bseDataInfo.current_value}}
							<i class="iconfont iconGroup-" v-if="bseDataInfo.contrast_percent>0"></i>
							<i class="iconfont iconplus-shiftdown" v-if="bseDataInfo.contrast_percent<0"></i>
							</b> -->
					<!--		<span :class="{'rise':bseDataInfo.contrast_percent>0,'decline':bseDataInfo.contrast_percent<0}" v-if="bseDataInfo.contrast_value">{{bseDataInfo.contrast_value}}({{bseDataInfo.contrast_percent+'%'}})</span>-->
						<!-- </div> -->
						<!-- <div>
							<b>{{$store.state.system.webLang.OPEN}}：</b><span :class="{'active-bse-data':bseTypeIndex==2}">{{bseDataInfo.open}}</span>
						</div> -->
					<!-- </div> -->
					
					<!-- <div class="day-bse">
						<div></div>
						<div>
							<span><b>{{$store.state.system.webLang.HIGH}}：</b><span :class="{'active-bse-data':bseTypeIndex==3}">{{bseDataInfo.high}}</span></span>
							<span><b>{{$store.state.system.webLang.LOW}}：</b><span :class="{'active-bse-data':bseTypeIndex==4}">{{bseDataInfo.low}}</span></span>
						</div>
					</div> -->
				</div>
				
				
				<!--btc-->
				<div v-else class="u-mb-20 u-text-center">
					<!-- 圆点虚线 -->
					<div class="linear"></div>
					<div class="explain">
						CURRENT RESULTS
					</div>
					<p :class="{'rise':bseDataInfo.contrast_percent>0,'decline':bseDataInfo.contrast_percent<0,'active-bse-current':bseTypeIndex==1}"><span class="front">₹ {{front}}</span>{{shuzhi}}
						<i class="iconfont iconGroup-" v-if="bseDataInfo.contrast_percent>0"></i>
						<i class="iconfont iconplus-shiftdown" v-if="bseDataInfo.contrast_percent<0"></i>
					</p>
					
				</div>
				<!--btc-->
				</div>
				
				<van-loading size="24px" v-else>{{$store.state.system.webLang.loading_text}}...</van-loading>
				
				
				<div class="bse-select">
					<div class="select-tab" v-if="!complexBol && !coDown">
						<!--oddEvenIndex==0:猜数字   complexBol：复合投注  &&!complexBol"-->
						<span v-for="(item,index) in bseClassList" :key="index" :class="{'activeType':bseClassIndex==index}" @click="selectBseClassIndex(index)">
								<div>{{item}}</div>
							<i v-if="index==0" class="ball">
								{{maxWeishu}}
							</i>
							<i v-if="index==1">
								{{sanweishu}}
							</i>
							<i v-if="index==2">
								[{{arrString[0]}}+{{arrString[1]}}+{{arrString[2]}}]={{maxWeishu}}
							</i>
						</span>
					</div>
					<div class="btc-time" v-else>
						<p class="calculagraph">Drawing Results</p>
						<p>No:{{kaijiang.no}}</p>
					</div>
					<!-- <div class="select-tab" v-else-if="oddEvenIndex==1">
						<span class="activeType">Sum Number</span>
					</div>
					<div class="select-tab" v-else-if="complexBol">
						<span class="activeType">Ending Number</span>
					</div> -->
					
					
					
					<!--<van-checkbox-group v-model="bseTypeIndex" max="1">
					  <van-checkbox :name="item.type"   v-for="(item,index) in bseTypeList" @click="watchBseTypeIndex(index)" icon-size="16px" :disabled="item.select"  checked-color="#35a2f2"  shape="square" >{{item.name}}</van-checkbox>
					</van-checkbox-group>-->
					
					<!-- <van-radio-group v-model="bseTypeIndex">
					  	<van-radio :name="item.type" v-for="(item,index) in bseTypeList" shape="square" icon-size="16px" :disabled="bseIndex==0&&index>0">{{item.name}}</van-radio>
					</van-radio-group> -->
					
					
				</div>
				
				
				
			</div>
			
			
			<!--<div class="buy-num" ref="lotteryInfo" v-if="bseShow">
				<div v-for="(item,index) in selectNumListBse"   class="buy-block" :class="{'active-num':selectNumIndexBse==index,'active-animation':selectNumIndexBse==index&&item.num==''}" >
					<div :ref="'selectNum'+index" v-if="randomBol">
						<p @click="selectNumIndexBse=index" v-for="(item1,index1) in item.randomList" :ref="'selectP'+index1">{{item1}}</p>
					</div>
					<span  @click="selectNumIndexBse=index" v-else>{{item.num?item.num:'+'}}</span>
				</div>
			</div>
			<span @click="Reinvest">复投</span>-->
			
			
			<!-- 猜数字和位数切换 -->
			<div class="select-odd-or-even" v-if="lotteryIndex==0&&lotteryClass.length">
	<!--			<span v-for="(item,index) in oddEvenList" class="odd-span" :class="{'activeOddEven':oddEvenIndex==index}" @click="changeOddEvenIndex(index)"  v-if="!complexBol">{{item}}</span>-->
				
				<!-- 原来最里层tab -->
				<!-- <van-tabs  v-if="!complexBol&&bseInfo&&lotteryIndex==0&&bseShow" v-model="oddEvenIndex">
				  <van-tab v-for="(item,index) in oddEvenList" :title="item" @click="changeOddEvenIndex(index)">
				   
				  </van-tab>
				</van-tabs> -->
				
				
				
				<i class="iconfont iconxiangzuo" v-if="complexBol" @click="closeComplexBol"></i>
				<div class="reinvest-right" v-if="complexBol">
					<!--<van-button type="danger" :loading="reinvestLoading" @click="reinvest">确定</van-button>-->
					
					<span @click="reinvestDetail=true" class="reinvest-right-detail">{{$store.state.system.webLang.your_pick}} </span>
				</div>

			</div>
			
			
			<van-popup v-model="reinvestDetail" position="bottom" :round="true" :close-on-popstate="true" :closeable="true" class="reinvestDetail-detail-popup">
				<div class="reinvestDetail-title">{{$store.state.system.webLang.multiple_bet_text}} </div>
				
				<div class="reinvest-list">
					
					<van-swipe-cell right-width="50" :before-close="beforeCloseNum" ref="reinvestDetailSwipe"  @open="numIndex=index"  v-for="(item,index) in reinvestList" :key="index" >
						<div class="reinvest-num" :class="{'leave':numIndex==index&&leaveBol}"><span>{{index+1}}</span></div>
						<div class="reinvest-list-block-wrap" :class="{'leave':numIndex==index&&leaveBol}">
							
							
								
								<div class="reinvest-list-block" v-for="itemA in item" :key="itemA.index">
									{{itemA}}
								</div>
								<b  class="point">.</b>
								
						</div>
						<template #right >
									<i class="iconfont iconshanchu"></i>
									<!--<p>删除</p>-->
							  	</template>
						</van-swipe-cell>	
				</div>
				
			</van-popup>
			
			
			
			
			
			
			<!--tab猜数字-->
			<div v-if="oddEvenIndex==0">
				<!-- <p v-if="lotteryIndex==0" class="select-text">{{$store.state.system.webLang.pick_numbers}}</p> -->
				
<!--				
				<div v-if="complexBol" class="">
					<div v-for="(item,index) in selectNumList"   class="buy-block" :class="{'active-num':selectNumIndex==index,'active-animation':selectNumIndex==index&&item.num=='','bseSelectNum':lotteryIndex==3}" v-if="item.list.length">
						<div :ref="'selectNum'+index" v-if="randomBol">
							<p @click="selectNumIndex=index" v-for="(item1,index1) in item.randomList" :ref="'selectP'+index1">{{item1}}</p>
						</div>
						
						<span  @click="selectNumIndex=index" v-else-if="lotteryIndex==3">{{item.num?item.num:'+'}}</span>
						
						<span  @click="selectNumIndex=index" v-if="lotteryIndex!=3" class="selectNum-active">{{item.num?item.num:'+'}}</span>
								
					</div>
				</div>-->
				
				<!-- 新加兰 -->
				<div class="buy-num" ref="lotteryInfo" v-if="!complexBol && active==1">
					<!-- <p v-if="coDown" class="calculagraph">Drawing Results(10s)</p> -->
					<div v-for="(item,index) in selectNumList" :key="index" class="buy-block" :class="{'active-num':selectNumIndex==index,'active-animation':selectNumIndex==index&&item.num=='','bseSelectNum':lotteryIndex==0,'oushuqiu':item.num%2!=1,'jishuqiu':item.num%2!=0,'kongqiu':item.num==''}" v-if="item.list.length">
						<div :ref="'selectNum'+index" v-if="randomBol">
							<p @click="selectNumIndex=index" v-for="(item1,index1) in item.randomList" :key="index1" :ref="'selectP'+index1">{{item1}}</p>
						</div>
						
			
						<span  @click="selectNumIndex=index" v-if="lotteryIndex!=0" class="selectNum-active">{{item.num?item.num:'+'}}</span>
								
					</div>
					<!-- <b v-if="lotteryIndex==0&&selectNumList[1].list.length" class="point">.</b> -->
				</div>
				<!-- 索引 1 ending Number -->
				<div class="buy-num" ref="lotteryInfo" v-else-if="!complexBol && bseClassIndex==1">
					<div v-for="(item,index) in selectNumList" :key="item.index"   class="buy-block" 
					:class="{'active-num':selectNumIndex==index,'active-animation':selectNumIndex==index&&item.num=='','bseSelectNum':lotteryIndex==0,'oushuqiu':item.num%2!=1,'jishuqiu':item.num%2!=0,'kongqiu':item.num==''}" 
					v-if="item.list.length">
						<div :ref="'selectNum'+index" v-if="randomBol">
							<p @click="selectNumIndex=index" v-for="(item1,index1) in item.randomList" :key="index1" :ref="'selectP'+index1">{{item1}}</p>
						</div>
						<span  @click="selectNumIndex=index" v-else-if="lotteryIndex==0">{{item.num?item.num:'+'}}</span>
						<span  @click="selectNumIndex=index" v-if="lotteryIndex!=0" class="selectNum-active">{{item.num?item.num:'+'}}</span>
					</div>
				</div>
				<!-- 索引 2 sum Number -->
				<div class="buy-num" ref="lotteryInfo" v-else-if="!complexBol && bseClassIndex==2">
					<div v-for="(item,index) in selectNumList" :key="index"  class="buy-block" :class="{'active-num':selectNumIndex==index,'active-animation':selectNumIndex==index&&item.num=='','bseSelectNum':lotteryIndex==0,'oushuqiu':item.num%2!=1,'jishuqiu':item.num%2!=0,'kongqiu':item.num==''}" v-if="item.list.length">
						<div :ref="'selectNum'+index" v-if="randomBol">
							<p @click="selectNumIndex=index" v-for="(item1,index1) in item.randomList" :key="index1" :ref="'selectP'+index1">{{item1}}</p>
						</div>
						<span  @click="selectNumIndex=index" v-else-if="lotteryIndex==0">{{item.num?item.num:'+'}}</span>
						<span  @click="selectNumIndex=index" v-if="lotteryIndex!=0" class="selectNum-active">{{item.num?item.num:'+'}}</span>
					</div>
				</div>
				
				<!-- 不清楚这个buy-num干嘛用 -->
				<div class="buy-num" ref="lotteryInfo" v-if="complexBol">
					<div v-for="(item,index) in selectNumList" :key="index"  class="buy-block" :class="{'active-num':selectNumIndex==index,'active-animation':selectNumIndex==index&&item.num=='','bseSelectNum':lotteryIndex==0}" v-if="item.list.length&&index<=futouSelectIndex">
						<div :ref="'selectNum'+index" v-if="randomBol">
							<p @click="selectNumIndex=index" v-for="(item1,index1) in item.randomList" :key="index1" :ref="'selectP'+index1">{{item1}}</p>
						</div>
						
						<span  @click="selectNumIndex=index" v-else-if="lotteryIndex==0">{{item.num?item.num:'+'}}</span>
						
						<span  @click="selectNumIndex=index" v-if="lotteryIndex!=0" class="selectNum-active">{{item.num?item.num:'+'}}</span>
								
					</div>
			
				
				</div>
					<!--索引 0 猜单双-->
				<div v-if="!complexBol && bseClassIndex==0 && active==0 ">
					<div class="odd-even-select"  ref="lotteryInfo">
						<div class="buy-block u-f10" v-for="(item,index) in eList" :key="index" @click="eIndex=index+1" 
						:class="{'activeEindex':eIndex==index+1}"
						>
							{{item}}
						</div>
					</div>
				</div>
				
				
				
				
				
				
			</div>
			<!--猜数字-->
			
			<!--猜单双-->
			<!-- <div v-if="oddEvenIndex==1">
				<p	 v-if="lotteryIndex==0" class="select-text">{{$store.state.system.webLang.pick_numbers}}</p>
				<div class="odd-even-select"  ref="lotteryInfo">
					<div class="buy-block u-f10" v-for="(item,index) in eList" @click="eIndex=index+1" :class="{'activeEindex':eIndex==index+1}">{{item}}</div>
				</div>
			</div> -->
			<!--猜单双-->
			
			
			
		</div>
		
		<div class="lottery-buy-btn"  :class="{'timeOut':countDownTime.hou=='00'&&countDownTime.min=='00'&&countDownTime.sec<10&&lotteryIndex==0,'yingchang':$store.state.system.guideIndex>=8}" v-if="active == 1">	<!--源代码 v-if="!complexBol" -->
			<p v-if="coDown" class="serial-number">No:{{kaijiang.no}}</p>
			<div v-else>
					<div @click="randomNum" :class="{'no-click':complexBol,'guideActive':($store.state.system.guideType==1&&$store.state.system.guideIndex==2)||($store.state.system.guideType==1&&$store.state.system.guideIndex==2)}" >
						<img src="../../assets/images/lottery/random.png" />
						{{$store.state.system.webLang.random}}
					</div>
					<div @click="resetNum">
						<img src="../../assets/images/lottery/reset.png" />
						{{$store.state.system.webLang.reset}}
					</div>
					<div @click="openPayPwd(1)" :class="{'no-click':complexBol}">
						<img src="../../assets/images/lottery/save.png" />
						{{$store.state.system.webLang.save}}
					</div>
			</div>
			
		</div>
		
		

		
		
		<div class="lottery-select-list">
			<div v-for="(item,index) in selectNumList[selectNumIndex].list" :key="index" @click="selectNum(item,index)"  v-if="oddEvenIndex==0" :class="{'noZero':item.zeroBol==2}" >
				<span  :class="{'active-select':selectNumList[selectNumIndex].num==item,'no-zero':selectNumList[selectNumIndex].zeroBol==2&&item==0}">{{item}}</span>
			</div>
		</div>
		<!-- 飞进飞出 -->
		<transition name="move">

			<div class="fly-out" v-if="coDown">
				<!-- <van-icon name="arrow-left" class="arrow-left" @click="coDown=false"/> -->
				<div class="lottery-buy">
					
			<!-- 新加兰 -->
					<div class="lottery-title" v-if="lotteryIndex!=0">
						NAGALAND STATE LOTTERIES <br>
						
						<div class="buy-top"  v-if="lotteryClass.length">
							<div :class="{'guideActiveA':($store.state.system.guideType==1&&$store.state.system.guideIndex==1)||($store.state.system.guideType==1&&$store.state.system.guideIndex==8)}"  >
								<p @click="lotterySelect">{{lotteryClass[lotteryIndex].name}} </p>
								<i class="iconfont iconxiajiang_huaban"></i>
								<i class="iconfont iconwenhao" :class="{'guideActiveB':($store.state.system.guideType==1&&$store.state.system.guideIndex==1)||($store.state.system.guideType==1&&$store.state.system.guideIndex==8)}" @click="toRules(lotteryClass[lotteryIndex].name)" ></i>
								
							</div>
							<p v-if="lotteryIndex!=0 && !coDown"  class="select-text select-textA">
									{{$store.state.system.webLang.pick_numbers}}
							</p>
							<p v-if="coDown && lotteryIndex!=0" class="calculagraph">
								Drawing Results
							</p>
							</div>
						</div>
		
			
			
					<div class="bse-wrap" v-if="bseShow">
						<!-- 指数下拉选择 -->
						<div class="bse-title" v-if="sysMonth">
							<span @click="openBseChaseShow" :class="{'guideActive':$store.state.system.guideType==1&&$store.state.system.guideIndex==9}">{{bseChaseList[bseIndex].name}}</span>   <i class="iconfont iconxiajiang_huaban"></i> <i class="iconfont iconwenhao" :class="{'guideActive':$store.state.system.guideType==1&&$store.state.system.guideIndex==8}" @click="toRules(lotteryClass[lotteryIndex].name)" ></i>
							<span>{{sysMonth}} {{sysTime/1000 | formatDate('dd hh:mm')}}</span>
						</div>
						
						
						
						<div v-if="!bseDataLoading">
						<div v-if="bseIndex==1" class="u-mb-20 u-text-center">
								<!-- 圆点虚线 -->
							<div class="linear"></div>
							<div class="explain">
								CURRENT RESULTS
							</div>
							<p :class="{'rise':bseDataInfo.contrast_percent>0,'decline':bseDataInfo.contrast_percent<0,'active-bse-current':bseTypeIndex==1}"> <span class="front">₹ {{front}}</span>{{shuzhi}}
								<i class="iconfont iconGroup-" v-if="bseDataInfo.contrast_percent>0"></i>
								<i class="iconfont iconplus-shiftdown" v-if="bseDataInfo.contrast_percent<0"></i>
							</p>
						
						</div>
						
						
						<!--btc-->
						<div v-else class="u-mb-20 u-text-center">
							<!-- 圆点虚线 -->
							<div class="linear"></div>
							<div class="explain">
								CURRENT RESULTS
							</div>
							<p :class="{'rise':bseDataInfo.contrast_percent>0,'decline':bseDataInfo.contrast_percent<0,'active-bse-current':bseTypeIndex==1}"><span class="front">₹ {{front}}</span>{{shuzhi}}
								<i class="iconfont iconGroup-" v-if="bseDataInfo.contrast_percent>0"></i>
								<i class="iconfont iconplus-shiftdown" v-if="bseDataInfo.contrast_percent<0"></i>
							</p>
							
						</div>
						<!--btc-->
						</div>
						
						<van-loading size="24px" v-else>{{$store.state.system.webLang.loading_text}}...</van-loading>
						
						
						<div class="bse-select">
							<div class="select-tab" v-if="!complexBol && !coDown">
								<!--oddEvenIndex==0:猜数字   complexBol：复合投注  &&!complexBol"-->
								<span v-for="(item,index) in bseClassList" :key="index" :class="{'activeType':bseClassIndex==index}" @click="selectBseClassIndex(index)">
										<div>{{item}}</div>
									<i v-if="index==0" class="ball">
										{{maxWeishu}}
									</i>
									<i v-if="index==1">
										{{sanweishu}}
									</i>
									<i v-if="index==2">
										[{{arrString[0]}}+{{arrString[1]}}+{{arrString[2]}}]={{maxWeishu}}
									</i>
								</span>
							</div>
							<div class="btc-time" v-else>
								<p class="calculagraph">Drawing Results</p>
								<p>No:{{kaijiang.no}}</p>
							</div>
					
							
							
						</div>
						
						
						
					</div>
					
			
			<div class="select-odd-or-even" v-if="lotteryIndex==0&&lotteryClass.length">
				
				<i class="iconfont iconxiangzuo" v-if="complexBol" @click="closeComplexBol"></i>
				<div class="reinvest-right" v-if="complexBol">
					<!--<van-button type="danger" :loading="reinvestLoading" @click="reinvest">确定</van-button>-->
					
					<span @click="reinvestDetail=true" class="reinvest-right-detail">{{$store.state.system.webLang.your_pick}} </span>
				</div>

			</div>
			
			<van-popup v-model="reinvestDetail" position="bottom" :round="true" :close-on-popstate="true" :closeable="true" class="reinvestDetail-detail-popup">
				<div class="reinvestDetail-title">{{$store.state.system.webLang.multiple_bet_text}} </div>
				
				<div class="reinvest-list">
					
					<van-swipe-cell right-width="50" :before-close="beforeCloseNum" ref="reinvestDetailSwipe"  @open="numIndex=index"  v-for="(item,index) in reinvestList" :key="index" >
						<div class="reinvest-num" :class="{'leave':numIndex==index&&leaveBol}"><span>{{index+1}}</span></div>
						<div class="reinvest-list-block-wrap" :class="{'leave':numIndex==index&&leaveBol}">
							
								<div class="reinvest-list-block" v-for="itemA in item" :key="itemA.index">
									{{itemA}}
								</div>
								<b  class="point">.</b>
								
						</div>
						<template #right >
									<i class="iconfont iconshanchu"></i>
									<!--<p>删除</p>-->
							  	</template>
						</van-swipe-cell>	
				</div>
				
			</van-popup>
			
		
			
			<!--tab猜数字-->
			<div v-if="oddEvenIndex==0">
	
				
				<!-- 新加兰 -->
				<div class="buy-num" ref="lotteryInfo" v-if="!complexBol && active==1">
					<!-- <p v-if="coDown" class="calculagraph">Drawing Results(10s)</p> -->
					<div v-for="(item,index) in selectNumList" :key="index" ref="tagItem"  class="buy-block" :class="{'active-animation':selectNumIndex==index&&item.num=='','bseSelectNum':lotteryIndex==0,'oushuqiu':item.num%2!=1,'jishuqiu':item.num%2!=0,'kongqiu':item.num==''}" v-if="item.list.length">
						<div :ref="'selectNum'+index" v-if="randomBol">
							<p @click="selectNumIndex=index" v-for="(item1,index1) in item.randomList" :key="index1" :ref="'selectP'+index1">{{item1}}</p>
						</div>
						
						<span  @click="selectNumIndex=index" v-else-if="lotteryIndex==0">{{item.num?item.num:'+'}}</span>
						
						<span  @click="selectNumIndex=index" v-if="lotteryIndex!=0" class="selectNum-active">{{item.num?item.num:'+'}}</span>
								
					</div>

				</div>
				<!-- 索引 1 ending Number -->
				<div class="buy-num" ref="lotteryInfo" v-else-if="!complexBol && bseClassIndex==1">
					<div v-for="(item,index) in selectNumList" :key="item.index" ref="tagItem"  class="buy-block" 
					:class="{'active-animation':selectNumIndex==index&&item.num=='','bseSelectNum':lotteryIndex==0,'oushuqiu':item.num%2!=1,'jishuqiu':item.num%2!=0,'kongqiu':item.num==''}" 
					v-if="item.list.length">
						<div :ref="'selectNum'+index" v-if="randomBol">
							<p @click="selectNumIndex=index" v-for="(item1,index1) in item.randomList" :key="index1" :ref="'selectP'+index1">{{item1}}</p>
						</div>
						<span  @click="selectNumIndex=index" v-else-if="lotteryIndex==0">{{item.num?item.num:'+'}}</span>
						<span  @click="selectNumIndex=index" v-if="lotteryIndex!=0" class="selectNum-active">{{item.num?item.num:'+'}}</span>
					</div>
				</div>
				<!-- 索引 2 sum Number -->
				<div class="buy-num" ref="lotteryInfo" v-else-if="!complexBol && bseClassIndex==2">
					<div v-for="(item,index) in selectNumList" :key="index"   class="buy-block" :class="{'active-num':selectNumIndex==index,'active-animation':selectNumIndex==index&&item.num=='','bseSelectNum':lotteryIndex==0,'oushuqiu':item.num%2!=1,'jishuqiu':item.num%2!=0,'kongqiu':item.num==''}" v-if="item.list.length">
						<div :ref="'selectNum'+index" v-if="randomBol">
							<p @click="selectNumIndex=index" v-for="(item1,index1) in item.randomList" :key="index1" :ref="'selectP'+index1">{{item1}}</p>
						</div>
						<span  @click="selectNumIndex=index" v-else-if="lotteryIndex==0">{{item.num?item.num:'+'}}</span>
						<span  @click="selectNumIndex=index" v-if="lotteryIndex!=0" class="selectNum-active">{{item.num?item.num:'+'}}</span>
					</div>
				</div>
				
			
					<!--索引 0 猜单双-->
				<div v-if="!complexBol && bseClassIndex==0 && active==0 ">
					<div class="odd-even-select"  ref="lotteryInfo">
						<div class="buy-block u-f10" v-for="(item,index) in eList" :key="index" @click="eIndex=index+1" 
						:class="{'activeEindex':eIndex==index+1}"
						>
							{{item}}
						</div>
					</div>
				</div>
				
			</div>
		
		</div>
				<!-- 下面按钮球 -->
				<div class="lottery-select-list">
						<div v-for="(item,index) in selectNumList[selectNumIndex].list" :key='index' @click="selectNum(item,index)"  :class="{'noZero':item.zeroBol==2}" >
							<span  :class="{'active-select':selectNumList[selectNumIndex].num==item,'no-zero':selectNumList[selectNumIndex].zeroBol==2&&item==0}">{{item}}</span>
						</div>
				 </div>
			</div>
  	</transition>
		
	
		<van-loading type="spinner" color="#1989fa" v-if="lotLoading">{{$store.state.system.webLang.loading_text}}</van-loading>
		
		<div v-if="!coDown" class="lottery-buy-bottom" :style="`position:${$store.state.system.showGuide&&$store.state.system.guideType==1?'absolute':'fixed'}`">
			<!-- 新手开关  -->
			<!-- <van-switch v-model="condition" size="16px" active-color="#f50000" inactive-color="#dcdee0" /> -->
			<div class="toggle-button-wrapper" >
        <input type="checkbox" id="toggle-button" name="switch" @click.stop="conditionStatus">
        <label for="toggle-button" class="button-label" >
              <span class="circle"></span>
              <span class="text on">Master</span>
              <span class="text off">Novice</span>
         </label>
  		</div>
			<!-- 倒计时 -->
			<div class="bottom-text" :class="{'swicenter':!condition}" v-if="lottery_no_id&&countDownTime">
				<span v-if="countDownTime.hou&&countDownTime.min&&countDownTime.sec" class="bottom-time" :class="{'actSec':countDownTime.hou=='00'&&countDownTime.min=='00'&&countDownTime.sec<Number(bseInfo.end_bets_time),'swicenter':!condition}">
				{{$store.state.system.webLang.next_draw}}: {{countDownTime.hou}} : {{countDownTime.min}} : {{countDownTime.sec}}
				</span>
				<span :class="{'swicenter':!condition}" v-else>{{$store.state.system.webLang.launching_soon}}</span>
			</div>
			<!-- 新西兰下 -->
			<div v-else class="bottom-text" :class="{'swicenter':!condition}">
				{{$store.state.system.webLang.launching_soon}}
			</div>
			<div class="bottom-shopCart">
				<div class="shopCart-right" v-if="condition">
					<div class="right-top">
						
						<div class="right-text">{{$store.state.system.webLang.times}}</div>
						<van-stepper v-model="mul" integer min="1" max="100" async-change @input="watchMul"/>
					</div>
						
					<div class="right-bottom">
						<!--<van-checkbox v-model="chaseBol" shape="square" checked-color="#5677FC" icon-size="17px"></van-checkbox>-->

						<div class="right-bottom-block" @click="zhuitou" :class="{'activeChase':chaseNum>0}">
							{{chaseNum?$store.state.system.webLang.chasing+chaseNum:$store.state.system.webLang.chasing+' 0'}}
							<i class="iconfont iconico_arrowdown"></i>
						</div>
						<!-- 索引等于0显示多个选项 -->
						<div class="reinvest" v-if="lotteryIndex==0&&bseClassIndex==1&&oddEvenIndex==0">
							<van-checkbox v-model="complexBol" shape="square" checked-color="#35a2f2" icon-size="14px">{{$store.state.system.webLang.multiple_bet}}</van-checkbox>
						</div>
						
					</div>	
						
				</div>
				
				
				
				
				<div class="shopCart-left" @click="openPayPwd(2)" :class="{'guideActive':($store.state.system.guideType==1&&$store.state.system.guideIndex==3)||($store.state.system.guideType==1&&$store.state.system.guideIndex==11),
				'swicenter':!condition}">
					<!--<img src="../../assets/images/lottery/buy.png" />
					<div class="buy-amount">₹ {{mul*6 | NumFormat}}</div>-->
					<div class="left-block"  :class="{'no-noId':lottery_no_id=='' || (countDownTime.hou=='00'&&countDownTime.min=='00'&&countDownTime.sec<Number(bseInfo.end_bets_time)) || !countDownTime,'activeBuy':selectNumLengthA>=selectNumLength&&(countDownTime.hou!='00'&&countDownTime.min!='00')&&lottery_no_id!=''&&countDownTime&&!$store.state.system.showGuide,'buy-nowadd':!condition}">
						<div>{{$store.state.system.webLang.buy_now}}</div>
					
						<div v-if="lotteryIndex==0">
							<span v-if="complexBol">
								<!--复投-->
								<span v-if="oddEvenIndex==0&&bseClassIndex==1">
									₹ {{mul*bseChaseList[bseIndex].bets_points_guess*(chaseNum==''?1:chaseNum)*1*(reinvestList.length?reinvestList.length:1) | NumFormat}}
								</span>
								<span v-if="oddEvenIndex==1&&bseClassIndex==1">
									₹ {{mul*bseChaseList[bseIndex].bets_points_single*(chaseNum==''?1:chaseNum)*1*(reinvestList.length?reinvestList.length:1) | NumFormat}}
								</span>
								<span v-if="bseClassIndex==0">
									₹ {{mul*bseChaseList[bseIndex].bets_points*(chaseNum==''?1:chaseNum)*1*(reinvestList.length?reinvestList.length:1) | NumFormat}}
								</span>
							</span>
							
							<span v-else>
								<span v-if="oddEvenIndex==0&&bseClassIndex==2">
									₹ {{mul*bseChaseList[bseIndex].bets_points_guess*(chaseNum==''?1:chaseNum)*1 | NumFormat}}
								</span>
								<span v-if="oddEvenIndex==0&&bseClassIndex==0">
									₹ {{mul*bseChaseList[bseIndex].bets_points_single*(chaseNum==''?1:chaseNum)*1 | NumFormat}}
								</span>
								<span v-if="bseClassIndex==1">
									₹ {{mul*bseChaseList[bseIndex].bets_points*(chaseNum==''?1:chaseNum)*1 | NumFormat}}
								</span>
							</span>
						</div>
						<div v-else>₹ {{mul*lotteryClass[lotteryIndex].bets_points*(chaseNum==''?1:chaseNum) | NumFormat}}</div>
					</div>
				</div>
				
			</div>
		</div>
		
		
		<!--指数种类选择弹窗-->
			<van-action-sheet v-model="bseChaseShow" :title="$store.state.system.webLang.select_base_lottery_sheet" :actions="bseChaseList" @select="onSelectBseChase" @cancel="onCancelBseChase" @click-overlay="onCancelBseChase" :cancel-text="$store.state.system.webLang.cancel"/>
		<!--指数种类选择弹窗-->
		
		
		<!--追投期数选择弹窗-->
			<van-action-sheet class="zhuitou" v-model="chaseShow" :title="$store.state.system.webLang.number_of_draws_to_chase" :actions="chaseList" @select="onSelectChase" @cancel="onCancelChase" @click-overlay="onCancelChase" :cancel-text="$store.state.system.webLang.cancel"/>
		<!--追投期数选择弹窗-->
		
		
		
		<!--彩种选择弹窗-->
			<van-action-sheet v-model="lotteryClassShow" :actions="lotteryClass" @select="onSelectLotteryClass" @cancel="onCancel" @click-overlay="onCancel" :cancel-text="$store.state.system.webLang.cancel"/>
		<!--彩种选择弹窗-->
		
		
	
			
			<div>
		<transition
		@before-enter="beforeEnter"
		@enter="enter"
		@after-enter="afterEnter"
		>
		<div class="animation-num"  v-show="flag"  >
			<img :src="lotteryImg" />
				<!--<div v-for="(item,index) in selectNumList">
					<span :class="{'active-num':selectNumIndex==index,'active-animation':selectNumIndex==index&&item.num==''}" @click="selectNumIndex=index">{{item.num?item.num:'+'}}</span>
				</div>-->
				
			</div>
		</transition>
			</div>
			
			
			
			<div class="pop-up-bg" v-if="showRecharge || showActivity" @click="closeBg"></div>
		
			
		  	<transition name="slide-popupShow"> 

		
			  <div class="pay-pwd-wrap"  v-if="showRecharge">
			      <div class="pay-pwd-title">{{$store.state.system.webLang.pls_contact_agent_for_deposit}}</div>
			     
					<div class="pay-text">WhatsApp:+{{$store.state.system.rechargeMobile}}</div>
			      <div class="pay-bottom-btn">
			        <!--<van-button type="primary" class="pay-cancel-btn"  @click="toPhone">
			           {{$store.state.system.webLang.dial_now}} 
			        </van-button>-->
			         <a :href="'whatsapp://send?phone='+$store.state.system.rechargeMobile" data-action="share/whatsapp/share">{{$store.state.system.webLang.dial_now}} </a>
			        <van-button type="primary" class="pay-submit-btn clip-btn" @click="tips(2)" :data-clipboard-text="$store.state.system.rechargeMobile">
						{{$store.state.system.webLang.copy_number}}
			        </van-button>
			      </div>
			      
			  </div>
			
			</transition>
			
		
			
			<!--支付密码-->
			<van-dialog class="draw-dialog" v-model="showPayPwd" :closeOnClickOverlay="true" :title="$store.state.system.webLang.buy_lottery" :confirmButtonText="$store.state.system.webLang.btn_confirm" :cancelButtonText="$store.state.system.webLang.cancel" :before-close="beforeClose"   @cancel="showPayPwd=false" @confirm="lotteryUserPay" show-cancel-button>
		 		
		 		<div class="draw-wrap">
		 			
		 			
		 			<div class="lottery-text">
		 				<div v-if="lotteryClass.length">{{$store.state.system.webLang.lottey_type}}：{{lotteryClass?lotteryClass[lotteryIndex].name:''}}</div>
		 				<div v-if="oddEvenIndex==1">{{$store.state.system.webLang.type}}：{{eIndex==1?$store.state.system.webLang.single:eIndex==2?$store.state.system.webLang.double:''}}</div>
		 				<div>{{$store.state.system.webLang.times}}：{{mul}}</div>
		 				<div v-if="chaseNum>0">{{$store.state.system.webLang.chasing}}：{{chaseNum?chaseNum:1}}</div>
		 				<div v-if="lotteryIndex==0">
		 					{{$store.state.system.webLang.all_price}}：
		 					<span v-if="complexBol">
								<!--复投-->
								<span v-if="oddEvenIndex==0&&bseClassIndex==1">
									₹ {{mul*bseChaseList[bseIndex].bets_points_guess*(chaseNum==''?1:chaseNum)*1*(reinvestList.length?reinvestList.length:1) | NumFormat}}
								</span>
								<span v-if="oddEvenIndex==1&&bseClassIndex==1">
									₹ {{mul*bseChaseList[bseIndex].bets_points_single*(chaseNum==''?1:chaseNum)*1*(reinvestList.length?reinvestList.length:1) | NumFormat}}
								</span>
								<span v-if="bseClassIndex==0">
									₹ {{mul*bseChaseList[bseIndex].bets_points*(chaseNum==''?1:chaseNum)*1*(reinvestList.length?reinvestList.length:1) | NumFormat}}
								</span>
							</span>
							<span v-else>
								<span v-if="oddEvenIndex==0&&bseClassIndex==2">
									₹ {{mul*bseChaseList[bseIndex].bets_points_guess*(chaseNum==''?1:chaseNum)*1 | NumFormat}}
								</span>
								<span v-if="oddEvenIndex==0&&bseClassIndex==0">
									₹ {{mul*bseChaseList[bseIndex].bets_points_single*(chaseNum==''?1:chaseNum)*1 | NumFormat}}
								</span>
								<span v-if="bseClassIndex==1">
									₹ {{mul*bseChaseList[bseIndex].bets_points*(chaseNum==''?1:chaseNum)*1 | NumFormat}}
								</span>
							</span>
		 				</div>
		 				<div v-else>{{$store.state.system.webLang.all_price}}：₹ {{mul*lotteryClass[lotteryIndex].bets_points*(chaseNum==''?1:chaseNum)*1 | NumFormat}}</div>
		 			</div>
		
			
			 		<!--<div class="draw-block">
			 			<p class="block-title">{{$store.state.system.webLang.pin_number}}</p>
			 			<input  type="password" v-model="payPassword" ref="passwordInput"/>
			 		</div>-->
			 		
		 		</div>
		 		
			</van-dialog>
			
			
			<!--支付密码-->
				
				
				
				
				
		
			<!-- 每次登录进来弹窗 -->
			<transition name="slide-popupShow"> 
				<div class="activity-wrap" v-if="showActivity">
					<div class="activity-title">Login Rewards</div>
					
					
					<div v-if="activityInfo.points>0">
						<div class="activity-a">Welcome back! 
	It's your {{activityInfo.count}} cumulative login days, ₹{{activityInfo.points}} for your today login, {{Number(activityInfo.next_count-activityInfo.count)}} days to go for your next rewards! Wish you the best luck!</div>
						
					</div>
				
					<div v-else>
						<div class="activity-a">Welcome back!
	It's your {{activityInfo.count}} cumulative login days, {{Number(activityInfo.next_count-activityInfo.count)}} days to go your next rewards, Wish you the best luck!</div>
					</div>
					
					
					<div class="activity-btn">
						<span @click="closeActivity(1)" v-if="activityInfo.is_receive">Received</span>
						<span v-else @click="closeActivity(2)">Confirm</span>
					</div>
					<div class="activity-c">Bonuses received by login accumulation</div>
					
					<div class="activity-d">
						<i class="iconfont iconicon_sanjiaoxing" :style="`left:${tempPrecent}%`"></i>
						<div v-for="item in activityInfo.config" :key="item.index" :class="{'receive':activityInfo.count>item.count,'active':activityInfo.is_receive&&activityInfo.count==item.count}">
							<p>{{item.count}} days</p>
							<p>{{item.points}}</p>
						</div>
					</div>
				</div>
			</transition>
			
			
		
				
			<div class="downLoad-a clip-btn"  :data-clipboard-text="channel" @click="tips(1)" v-if="$store.state.system.showAndroid">
				<a href="https://dl.lottoplus.cc/apps/FantasyLand.apk" >
					<FloatBall >	
		      		</FloatBall>
				</a>
			</div>
			
			
			
			<van-overlay :show="$store.state.system.showGuide&&$store.state.system.guideType==1" lock-scroll class="guide-overlay"/>	
			
			
			<!--那加兰购彩引导-->
			
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==1" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
					
				<div v-if="$store.state.system.guideIndex==0" class="guide-0 guide-wrap">
					<img src="../../assets/images/guide-people.jpg" class="guide-people"/>
				
					<div class="guide-text">
						<p>{{$store.state.system.guideTemp}}</p>
						<!--<p></p>-->
						<div class="guide-btn">
							<span @click.stop="nextGuide" v-if="$store.state.system.langType=='en'">Welcoming bonus {{$store.state.system.guidePoints}}</span>
							<span @click.stop="nextGuide" v-else>स्वागत बोनस{{$store.state.system.guidePoints}} है </span>
					
							<span @click="closeGuide">{{$store.state.system.webLang.I_already_knew_how}}</span>
						</div>
					</div>
				</div>	
				
				
				<div v-if="$store.state.system.guideIndex==1" class="guide-1 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
			
				<div v-if="$store.state.system.guideIndex==2" class="guide-2 guide-wrap">
					
					<i class="iconfont iconxiangxia"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				<div v-if="$store.state.system.guideIndex==3" class="guide-3 guide-wrap">
					
					<i class="iconfont iconxiangxia"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				<van-dialog class="draw-dialog guide-dialog guide-4" @confirm="nextGuide" @cancel="nextGuide"  v-model="showGuideDialog"  :title="$store.state.system.webLang.buy_lottery" :confirmButtonText="$store.state.system.webLang.btn_confirm" :cancelButtonText="$store.state.system.webLang.cancel"    show-cancel-button v-if="$store.state.system.guideIndex==4"  :overlay="false">
			 		
			 		<div class="draw-wrap">
			 			
			 			
			 			<div class="lottery-text">
			 				<div>{{$store.state.system.webLang.lottey_type}}：{{lotteryClass?lotteryClass[lotteryIndex].name:''}}</div>
			 				<div>{{$store.state.system.webLang.times}}：1</div>
			 				<div>
			 					{{$store.state.system.webLang.all_price}}：
								<span>₹ {{mul*lotteryClass[lotteryIndex].bets_points*(chaseNum==''?1:chaseNum)*1 | NumFormat}}</span>
			 				</div>
			 			</div>
			 			
			 			<i class="iconfont iconxiangxia"></i>
						<!--<div class="guide-btn">
							<span @click="next">{{$store.state.system.webLang.Next}}</span>
						</div>-->
	
			 		</div>
			 		
				</van-dialog>
				
			
				<div v-if="$store.state.system.guideIndex==5" class="guide-5 guide-wrap">
					
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
			<!--那加兰购彩引导-->
			
			
			
			
			<!--那加兰购彩引导/比特币汇率购彩引导-->
			
			<div class="guide-content" v-if="$store.state.system.showGuide&&$store.state.system.guideType==1" @click="stopKeyBoaddText">
				<transition name="slide-popupShow"> 	
					
					
				<div v-if="$store.state.system.guideIndex==8" class="guide-6 guide-wrap">
				
				
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				
				</div>	
				
				
				<div v-if="$store.state.system.guideIndex==9" class="guide-7 guide-wrap">
					
					<i class="iconfont iconxiangshang"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
			
				<div v-if="$store.state.system.guideIndex==10" class="guide-8 guide-wrap">
				
					<!-- <i class="iconfont iconxiangxia"></i> -->
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				<div v-if="$store.state.system.guideIndex==11" class="guide-9 guide-wrap">
					
					<i class="iconfont iconxiangxia"></i>
					<div class="guide-text">
						
						<p>{{$store.state.system.guideTemp}}</p>
						<div class="guide-btn">
							<span @click.stop="nextGuide">{{$store.state.system.webLang.Next}}</span>
						</div>
					</div>
				</div>
				
				
				<van-dialog class="draw-dialog guide-dialog guide-10" @confirm="nextGuide" @cancel="nextGuide"  v-model="showGuideDialog"  :title="$store.state.system.webLang.buy_lottery" :confirmButtonText="$store.state.system.webLang.btn_confirm" :cancelButtonText="$store.state.system.webLang.cancel"   show-cancel-button v-if="$store.state.system.guideIndex==12"  :overlay="false">
			 		
			 		<div class="draw-wrap">
			 			
			 			
			 			<div class="lottery-text">
			 				<div>{{$store.state.system.webLang.lottey_type}}：{{lotteryClass?lotteryClass[lotteryIndex].name:''}}</div>
			 				<div>{{$store.state.system.webLang.times}}：1</div>
			 				<div>
			 					{{$store.state.system.webLang.all_price}}：
								<span>₹ {{mul*lotteryClass[lotteryIndex].bets_points*(chaseNum==''?1:chaseNum)*1 | NumFormat}}</span>
			 				</div>
			 			</div>
			 			
			 			<i class="iconfont iconxiangxia"></i>
						<!--<div class="guide-btn">
							<span @click="next">{{$store.state.system.webLang.Next}}</span>
						</div>-->
	
			 		</div>
			 		
				</van-dialog>
				
			
				<div v-if="$store.state.system.guideIndex==13" class="guide-11 guide-wrap">
					
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
			
			<!-- cao-不中奖弹窗 -->
			<van-overlay :show="Popup" @click="show = false">
				<div class="wrapper" @click.stop>
						<!-- 关闭按钮 -->
					<img src="../../assets/images/qiu/Shutdown.png" alt="" class="guanbi2" @click="Popup=false">
					<van-swipe class="block" :touchable="false" ref="swiper2">
						
					 <van-swipe-item v-for="(item,index) in canData" :key='index'>
						 <div class="popupContent" :data-id="item.id">
							<!-- 标题 -->
							<div class="cont-titl">
								<!-- <span @click="openLotteryDetailD(item)">Details</span> -->
								<h6>My Ticket</h6>
							</div>
							<p class="btc-INR">{{item.extend.lotteryInfo.name}} {{item.extend.currentLotteryInfo.no}}</p>
							<!-- 自己购买的号码 -->
							<p class="endnum" v-if="item.extend.buyInfo.d != ''">
								Sum Number: 
								<span>{{item.extend.buyInfo.d}}</span>
							</p>
							<p class="endnum" v-if="item.extend.buyInfo.a != ''">
								Ending Number: 
								<span class="setlast">{{item.extend.buyInfo.a}}</span>
								<span  class="setlast">{{item.extend.buyInfo.b}}</span>
								<span  class="setlast">{{item.extend.buyInfo.c}}</span>
							</p>
							<p class="endnum" v-if="item.extend.buyInfo.e != ''">
								Single Or Double: 
								<span  class="setlast" v-if="item.extend.buyInfo.e==1">Single</span>
								<span  class="setlast" v-if="item.extend.buyInfo.e==2">Double</span>
							</p>

							<div class="results-tit">
								<h6>RESULTS</h6>
								<h4 :class="{'rise2':item.extend.info.contrast_percent>0,'decline2':item.extend.info.contrast_percent<0}">₹ {{item.extend.info.current_value}}</h4>
							</div>
							<div class="houhou">

							</div>
							<div class="zuidi">
								<p>Ending Number: 
									<span  class="setlast">{{item.extend.currentLotteryInfo.prize_1}}</span>
									<span  class="setlast">{{item.extend.currentLotteryInfo.prize_2}}</span>
									<span  class="setlast">{{item.extend.currentLotteryInfo.prize_3}}</span>
								</p>
								<p>Sum Number: 
									<span  class="setlast">{{item.extend.currentLotteryInfo.prize_4}}</span>
								</p>
								<p>Single Or Double: 
									<span  class="setlast">{{item.extend.currentLotteryInfo.prize_4}}</span>
								</p>

							</div>
						</div>
					 </van-swipe-item>
						<!-- 自定义指示器 -->
						 <template #indicator>
							 	<div class="fenyebottom">
								<van-pagination  v-model="currentPage2" :page-count="altogether2" mode="simple" >
								<template #prev-text>
									<van-icon name="arrow-left" v-if="indexlr>0" @click="changeSwipe2('up')" />
									<van-icon name="arrow-left" v-else/>
								</template>
								<template #next-text>
									<van-icon name="arrow" v-if="indexlr+1 < altogether2" @click="changeSwipe2('down')" />
									<van-icon name="arrow" v-else />
								</template>	
								</van-pagination>	
								</div>
						</template>
					</van-swipe>
				</div>
			</van-overlay>
			<!-- 中奖弹窗 -->
			<van-overlay :show="Popup2" @click="show = false">
				<audio v-if="Popup2" src="../../assets/mp3/Earn.mp3" autoplay></audio>
				<div class="wrapper" @click.stop>
						<!-- 关闭按钮 -->
					<img src="../../assets/images/qiu/Shutdown.png" alt="" class="guanbi" @click="Popup2=false">
					<van-swipe class="block" :touchable="false" ref="swiper">
				
						  <van-swipe-item v-for="(item,index) in winningData" :key='index'>
									<div class="popupContent" :data-id="item.id">
									<div class="cont-titl">
										<h6>{{item.title}}</h6>
									</div>
									<div class="winning-time">
										{{item.creation_time}}
									</div>
									<div class="winning-content">
										{{item.content}}
									</div>
								</div>
							</van-swipe-item>
						  
						<!-- 自定义指示器 -->
						 <template #indicator>
							 	<div class="fenyebottom">
								<van-pagination  v-model="currentPage" :page-count="altogether" mode="simple" >
								<template #prev-text>
									<van-icon name="arrow-left" v-if="indexlr>0" @click="changeSwipe('up')" />
									<van-icon name="arrow-left" v-else/>
								</template>
								<template #next-text>
									<van-icon name="arrow" v-if="indexlr+1 < altogether" @click="changeSwipe('down')" />
									<van-icon name="arrow" v-else />
								</template>	
								</van-pagination>	
								</div>
						</template>
					</van-swipe>
				</div>
			</van-overlay>
						
				<!--开奖详情-->
		<van-popup v-model="lotteryDetailShowD" position="bottom" close-on-popstate class="lottery-detail-popup">
			
			<div class="lottery-detail" v-if="lotteryDetail2.lottery_type==1">
				<i class="iconfont iconguanbi" @click="lotteryDetailShowD=false"></i>
				<div class="lottery-detail-title">
					<p>{{lotteryDetail2.extend.currentLotteryInfo.lottery_id==1?'Morning Lottery':lotteryDetail2.extend.currentLotteryInfo.lottery_id==2?'Day Lottery':lotteryDetail2.extend.currentLotteryInfo.lottery_id==3?'Evening Lottery':''}}</p>
					<p>
						<!--<span>{{$store.state.system.webLang.top_prize}}:</span>
						<span>₹ {{lotteryDetail.list[0] | NumFormat}}</span>-->
					</p>
					<p>{{getNewTime(lotteryDetail2.extend.currentLotteryInfo.creation_time)}}</p>
				</div>
				
				
				
				<div class="lottery-detail-first">
					<div class="first-wrap">
						<div  v-for="item1 in lotteryDetail2.prize_1" :key="item1.index">
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
						<p>{{$store.state.system.webLang.draw_no}}.{{lotteryDetail2.no}}</p>
						<p>{{$store.state.system.webLang.top_prize}}: <span class="amount">{{lotteryDetail2.list[0] | changeNum}}</span></p>
						<p>{{$store.state.system.webLang.held_on}}: {{lotteryDetail2.lottery_time}}</p>
					</div>
				</div>
				
				<div class="lottery-list">
					<div class="lottery-Consolation">
						<div class="list-block-title">Consolation Prize: Rs.<span class="amount">{{lotteryDetail2.list[6] | NumFormat}}</span></div>
						<div class="Consolation-list">
							<span v-for="(item1,index1) in lotteryDetail2.prize_1" :key="item1.index" v-if="index1>1">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">2nd Prize: Rs.<span class="amount">{{lotteryDetail2.list[1] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail2.prize_2" :key="item1.index">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">3rd Prize: Rs.<span class="amount">{{lotteryDetail2.list[2] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail2.prize_3" :key="item1.index" >{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">4th Prize: Rs.<span class="amount">{{lotteryDetail2.list[3] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail2.prize_4" :key="item1.index">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-price-list">
						<div class="list-block-title">5th Prize: Rs.<span class="amount">{{lotteryDetail2.list[4] | NumFormat}}</span></div>
						<div class="price-list">
							<span  v-for="item1 in lotteryDetail2.prize_5" :key="item1.index">{{item1}}</span>
						</div>
					</div>
					
					<div class="lottery-Consolation no-border">
						<div class="list-block-title">6th Prize: Rs.<span class="amount">{{lotteryDetail2.list[5] | NumFormat}}</span></div>
						<div class="Consolation-list">
							<span  v-for="item1 in lotteryDetail2.prize_6" :key="item1.index">{{item1}}</span>
						</div>
					</div>
					
				</div>
				
				<div class="lottery-detail-btn">
					<div class="detail-btn" @click="toHisResults(lotteryDetail2)">
						<img src="../../assets/images/home/time.png">
						{{$store.state.system.webLang.draw_history}} 
					</div>
					<div class="detail-btn" @click="toVideo(lotteryDetail2)">
						<img src="../../assets/images/home/video.png">
						{{$store.state.system.webLang.official_result}}
					</div>
				</div>

			</div>
			
			<!--指数-->
			<div class="lottery-detail" v-else>
				<i class="iconfont iconguanbi" @click="lotteryDetailShowD=false"></i>
				<div class="lottery-detail-title">
					<p>3 Mins/Draw</p>
					<!-- <p>{{lotteryDetail.creation_time}}</p> -->
					<p>
						<span v-if="lotteryDetail2.lotteryInfo">{{lotteryDetail2.lotteryInfo.name}}</span>
					</p>
					<p>{{getNewTime(lotteryDetail2.creation_time)}}</p>
				</div>
				
				<div class="lottery-detail-first">
					
					<div class="odd-even-text">{{lotteryDetail2.prize_5==1?$store.state.system.webLang.single:lotteryDetail2.prize_5==2?$store.state.system.webLang.double:''}}</div>

					<div class="lottery-num-bse">
						<span>{{lotteryDetail2.prize_1}}</span>
						<b>.</b>
						<span>{{lotteryDetail2.prize_2}}</span>
						<span>{{lotteryDetail2.prize_3}}</span>
						<b>-</b>
						<span>{{lotteryDetail2.prize_4}}</span>
					</div>

					<!--<div class="first-center">

						<div>{{$store.state.system.webLang.buy_now}}</div>
						<div >
							Draw Details
							
						</div>
					</div>-->
					<div class="first-bottom">
						<p>{{$store.state.system.webLang.draw_no}}.{{lotteryDetail2.no}}</p>
						<p v-if="lotteryDetail2.lottery_info">{{$store.state.system.webLang.top_prize}}: <span class="amount">{{lotteryDetail2.lottery_info.win_1_times  | changeNum}} {{$store.state.system.webLang.times}}</span></p>
						<p>{{$store.state.system.webLang.held_on}}: {{lotteryDetail2.lottery_time}}</p>
					</div>
				</div>
				
				<!--指数-->
				<div class="bse-wrap" v-if="lotteryDetail2.lottery_data&&lotteryDetail2.lottery_info.id==1">
					
					<div class="bse-title" v-if="sysMonth">
						<span>{{lotteryDetail2.lottery_info.name}}</span>  
						<span>{{sysMonth}} {{sysTime/1000 | formatDate('dd hh:mm')}}</span>
					</div>
					
					<div class="current-bse">
						<div ><b  :class="{'rise':lotteryDetail2.lottery_data.contrast_percent>0,'decline':lotteryDetail2.lottery_data.contrast_percent<0}">{{lotteryDetail2.lottery_data.current_value}}
							<i class="iconfont iconGroup-" v-if="lotteryDetail2.lottery_data.contrast_percent>0"></i>
							<i class="iconfont iconplus-shiftdown" v-if="lotteryDetail2.lottery_data.contrast_percent<0"></i>
							</b>
			<!--				<span :class="{'rise':lotteryDetail.lottery_data.contrast_percent>0,'decline':lotteryDetail.lottery_data.contrast_percent<0}" v-if="lotteryDetail.lottery_data.contrast_value">{{lotteryDetail.lottery_data.contrast_value}}({{lotteryDetail.lottery_data.contrast_percent+'%'}})</span>-->
						</div>
						<div>
							<b>{{$store.state.system.webLang.OPEN}}：</b>{{lotteryDetail2.lottery_data.open}}
						</div>
					</div>
					
					<div class="day-bse">
						<div></div>
						<div>
							<span>
								<b>{{$store.state.system.webLang.HIGH}}：</b>
								<span v-if="lotteryDetail2.lastLottery">{{lotteryDetail2.lottery_data.high?lotteryDetail2.lottery_data.high:'-'}}
								</span>
								<span v-else>{{lotteryDetail2.lottery_info.close_time}}</span>
							</span>
							
							<span>
								<b>LOW：</b>
								<span v-if="lotteryDetail2.lastLottery">{{lotteryDetail2.lottery_data.low?lotteryDetail2.lottery_data.low:'-'}}</span>
								<span v-else>{{lotteryDetail2.lottery_info.close_time}}</span>
							</span>
						</div>
					</div>
					
				</div>
				<!--指数-->
				
				<!--btc-->
				<div class="bse-wrap" v-if="lotteryDetail2.lottery_data&&lotteryDetail2.lottery_info.id==2">
					
					<div class="bse-title" v-if="sysMonth">
						<span>{{lotteryDetail2.lottery_info.name}}</span>  
						<span>{{sysMonth}} {{sysTime/1000 | formatDate('dd hh:mm')}}</span>
					</div>
					
					<div class="current-bse-btc">
						{{$store.state.system.webLang.Results}}：₹ {{lotteryDetail2.lottery_data.current_value | NumFormat}} = <span class="usd">${{lotteryDetail2.lottery_data.current_value/lotteryDetail2.lottery_data.contrast_value | NumFormat(2)}}</span>
						<p>{{$store.state.system.webLang.today_rate}}</p>
						<p>1 USD = {{lotteryDetail2.lottery_data.contrast_value}} INR</p>
					</div>
					
		
					
				</div>
				<!--btc-->
				
				<div class="lottery-detail-btn">
					
					<div class="detail-btn" @click="toHisResults(lotteryDetail2)">
						<img src="../../assets/images/home/time.png">
						{{$store.state.system.webLang.draw_history}} 
					</div>
					<!--@click="toNet(lotteryDetail.video_url)"-->
					<div class="detail-btn"  @click="toLottery(lotteryDetail2)">
						<img src="../../assets/images/home/video.png">
						{{$store.state.system.webLang.buy_now}}
					</div>
				</div>
				
			</div>
			
		</van-popup>
		
		<!--开奖详情-->
			
		<!-- 那加兰不能购买弹窗 -->
			<van-dialog v-model="najialan15" show-cancel-button :showCancelButton="false">
				<img src="../../assets/images/najialan15.png" width="100%" height="auto" />
			</van-dialog>
			
			
		<!-- 动画遮罩层 -->
		<!-- <van-overlay  /> -->
		<van-overlay :show="coDown" class="donghuamask">
			<van-icon name="arrow-left" class="arrow-left" @click="stopAnimation"/>
		</van-overlay>
		<!-- <van-loading v-if="kjloading" class="loading-zai" color="#ffffff" size="24px" vertical>The prize is drawing...</van-loading> -->

		<div id="shopCart" style="position: fixed;bottom: 0.4rem;right: 5rem;"></div>
		<audio preload="auto" ref="audio" src="../../assets/mp3/ButtonClick.mp3"></audio>
		<audio preload="auto" ref="audio2" src="../../assets/mp3/LuckyPick.mp3"></audio>
		<audio preload="auto" ref="audio3" src="../../assets/mp3/Cost.mp3"></audio>
		<audio preload="auto" ref="audio4" src="../../assets/mp3/Earn.mp3"></audio>
		<audio preload="auto" ref="jin" src="../../assets/mp3/Menu_appear.mp3"></audio>
		<audio preload="auto" ref="tui" src="../../assets/mp3/Menu_disappear.mp3"></audio>
		<tabbar></tabbar>
	</div>
</template>

<script src="./Lottery.js"></script>
<style lang="scss">
	@import './Lottery';
</style>