<template>
	<div class="tickets-wrap2">
		<index-header></index-header>
		<!-- <lottery-Notice v-if="!$store.state.system.showGuide"></lottery-Notice> -->
		<!-- tab -->
		<van-tabs v-model="active" :animated="true" @change="activeTab">
			<van-tab title="BTC/INR"></van-tab>
			<van-tab title="SENSEX INDEX"></van-tab>
			<van-tab title="Ranking"></van-tab>
		</van-tabs>
		<div class="content">
			<div class="tab-select">
				<div v-show="active==0 || active == 1">
								<!-- 筛选 -->
						<div class="filtrate">
							<div class="filtrate-lf">
								<van-dropdown-menu v-if="value2==0" >
									<van-dropdown-item v-model="value1" :options="dropdownMenu" @change="digit" />
								</van-dropdown-menu>
							</div>
							<div class="filtrate-rt">
								<van-tabbar v-model="active2" :fixed='false' :border='false' @change="timeTab">
									<van-tabbar-item>24 Hours</van-tabbar-item>
									<van-tabbar-item>Last Week</van-tabbar-item>
									<van-tabbar-item>Last Month</van-tabbar-item>
								</van-tabbar>
							</div>
						</div>
						<!-- chart -->
						<div id="myChart"></div>
						
						<div class="tab-number">
							<div class="ziehung">Draw Times：{{date.total}}</div>
							<div class="line">
								<span></span>
								<span>Hit times</span>
							</div>
							<van-dropdown-menu>
								<van-dropdown-item v-model="value2" :options="dropdownMenu2" @change="bseType"/>
							</van-dropdown-menu>
						</div>
						<!-- 跳转购买 -->
						<div class="Jumpto-buy">
							<span v-if="value2 == 0">Recommend digital：{{numberFirst}}、{{numberFirst2}}、{{numberFirst3}}</span>
							<span v-if="value2 == 1">Recommend digital：{{sumNumber}}</span>
							<span v-if="value2 == 2 && honglu <= 5">Predict the next time：Single</span>
							<span v-if="value2 == 2 && honglu > 5">Predict the next time：Double</span>
							<van-button type="primary" size="small" :to="{name:'lottery',query:{type:2}}">Buy Now</van-button>
						</div>
						<!-- 单双 -->
						<!-- <div class="Jumpto-buy" v-else>
							<span>Predict the next time：Green</span>
							<van-button type="primary" size="small" :to="{name:'lottery',query:{type:2}}">Buy Now</van-button>
						</div> -->
						<!-- 留言板 -->
						<van-list
							v-model="loadly"
							:finished="weihao"
							:finished-text="$store.state.system.webLang.all_data_loaded"
							:loading-text="$store.state.system.webLang.loading_text"
							@load="onLoadLy"
							:offset="10"
						>
							<div class="msg-board" ref="msgTop">
								<!-- 每一个 -->
								<div class="list-msg" v-for="(item,index) in comments" :key="index">
									<div>
										<div class="img-msg">
											<img :src="item.avatar" alt="">
										</div>
									</div>
									<div class="text">
										<p>{{item.nickname}}</p>
										{{item.content}}
									</div>
								</div>
							</div>
						</van-list>
						<div class="msg-send">
							<input type="text" maxlength="128" placeholder="Please leave a message" v-model="content" >
							<van-button type="primary" @click="publishComment" class="send-img"/>
						</div>
				</div>
			
				<div v-show="active == 2" ref="item3" class="tab-item">
					<div class="pull-down"  @click="reveal = true">{{thasName}}{{ctime.substring(0,7)}} <van-icon name="arrow-down" />
					</div>
					<div class="bangdan" v-if="gouzi">
							<!-- 榜单 -->
							<div class="bd-top">
								<div class="monthly" v-for="(item,index) in seniority" :key="index">
										<!-- 头像 -->
										<div class="head-img">
											<img :src="item.avatar" alt="">
										</div>
										<div class="hg-img">
											<img :src="`./assets/diyi0${index}.png`" alt="">
											<span>{{item.nickname}}</span>
										</div>
										<p>Rs.{{item.stat_value | toThousandFilter}}</p>
								</div>
							</div>
							<ul class="list">
								<li v-for="(item,index) in seniority2" :key="index">
									<span class="paixu" v-if="index+4<10">0{{index + 4}}</span>
									<span class="paixu" v-if="index+4>=10">{{index + 4}}</span>
									<div class="header-img">
										<img :src="item.avatar" alt="">
									</div>
									<div class="list-rt">{{item.nickname}}</div>
									<span class="money">Rs.{{item.stat_value | toThousandFilter}}</span>
								</li>
							</ul>
					</div>
				
					<!-- 说明 -->
					<div class="explain" v-if="actions.length!==0">
							<!-- <h6>说明</h6> -->
							<p>1、Reset data and send the prize every 01:00 first of month.</p>
							<p>2、Prize as:<br> &nbsp;&nbsp;&nbsp;&nbsp; 1st Prize：Rs.{{jiangli[0].ranking_1}} <br> &nbsp;&nbsp;&nbsp;&nbsp; 2nd Prize：Rs.{{jiangli[0].ranking_2}} <br> &nbsp;&nbsp;&nbsp;&nbsp; 3rd Prize：Rs.{{jiangli[0].ranking_3}} <br> &nbsp;&nbsp;&nbsp;&nbsp; 4~10Prize：Rs.{{jiangli[0].ranking_4_10}}</p>
							<p>3、Right of final explanation belongs Fantasyland</p>
					</div>
				</div>
	 		</div>
		 </div>
		<!-- 排行榜下拉选择 -->
		<van-action-sheet v-model="reveal" :actions="actions" @select="onSelect" />
		<tabbar></tabbar>
	</div>
</template>

<script src="./Predict.js"></script>
<style lang="scss">
	@import './Predict';
	// .active22 {
	// 	overflow: hidden !important;
	// }
</style>
<style scoped>
/* .tickets-wrap2{
	position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
	overflow: hidden;
} */
</style>
