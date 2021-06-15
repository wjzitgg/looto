<template>
    <div class="footer">
    
        <div class="inner" :style="`position:${$store.state.system.guideType==1&&($store.state.system.guideIndex==5||$store.state.system.guideIndex==6||$store.state.system.guideIndex==13)?'absolute':'fixed'};z-index:${$store.state.system.guideType==1&&($store.state.system.guideIndex==5||$store.state.system.guideIndex==6||$store.state.system.guideIndex==13)?'initial':'1999'}`">
            <div @click="toUrl('/purchase')" class="route" :class="{'active':$route.path.includes('purchase')}">
                <img src="../assets/images/home/tab-1-select.png" v-if="$route.path.includes('purchase')" style="margin-bottom: 0.02rem;"/>
                <img src="../assets/images/home/tab-1.png" v-else/>
                <p>{{$store.state.system.webLang.Purchase}}</p>
            </div>
         
           

            <div @click="toUrl('/results')" class="route" :class="{'guideActive':$store.state.system.guideType==1&&$store.state.system.guideIndex==6,'active':$route.path.includes('results')}">
            	<img src="../assets/images/home/tab-2-select.png" v-if="$route.path.includes('results')"/>
                <img src="../assets/images/home/tab-2.png" v-else/>
                <p>{{$store.state.system.webLang.Results}}</p>
            </div>
      
            <div  @click="toUrl('/tickets')"  class="route" :class="{'guideActive':$store.state.system.guideType==1&&($store.state.system.guideIndex==5||$store.state.system.guideIndex==13),'active':$route.path.includes('tickets')}">
            	<img src="../assets/images/home/tab-3-select.png" v-if="$route.path.includes('tickets')"/>
            	<img src="../assets/images/home/tab-3.png" v-else/>
                <p :class="{'active-add':$store.state.user.addBol}">{{$store.state.system.webLang.Tickets}}</p>
           	</div>
    
             <div @click="toUrl('/predict')" class="route" :class="{'guideActive':$store.state.system.guideType==1&&$store.state.system.guideIndex==6,'active':$route.path.includes('predict')}">
            	<img src="../assets/images/home/tongji2.png" style="width: .4rem;" v-if="$route.path.includes('predict')"/>
                <img src="../assets/images/home/tongji.png" style="width: .4rem;" v-else/>
                <p>Predict</p>
            </div>
        </div>
        <audio preload="auto" ref="audio" src="../assets/mp3/ButtonClick.mp3"></audio>
    </div>
</template>

<script>
	import * as types from '../store/types';
    export default {
    	props: ['selecteIndex'],
        data() {
            return{
                // hasTicket: false
            }
        },
        computed: {
        	userInfo() {
				return this.$store.state.user.info;
			},
			isLogin() {
				return this.$store.state.user.loginStatus;
			}
        },
        activated() {
            // api.user.getLoginStatus(res=>{
            //     if( res.res_content.status ) {
            //         api.lottery.queryMyLotteryTickets({status:1,ticketsType:0}, res=>{
            //             if(res.res_content.datasRowsCount) {
            //                 this.hasTicket = true;
            //             }
            //         }, err=>{
                        
            //         })
            //     }
            // })
        },
        methods: {
        	toUrl(url) {
                this.play();
        		if(this.$store.state.system.showGuide)return
        		this.$router.push(url)
        	}

        }
    }
</script>

<style lang="scss">
    .footer {
    	z-index: 1999;
        height:1rem;
    /*    box-shadow: 1px 1px 0.13rem #252424;*/
        .inner{
        	z-index: 1999;
            position:fixed;bottom: 0;left: 0;display: flex;flex-flow: row nowrap;justify-content: center;align-items: center;
            background-color: #fff;
            width: 100%;height: 1.15rem;padding: 0.15rem;
            box-shadow: 3px 2px 8px #d2cece;
        }
        .icon{display: inline-block;width:0.37rem;height:0.32rem;background-size: 0.37rem auto;background-position: top center;}
        /*.i-home{background-image: url(../assets/images/bottom-home.png);}
        .i-strategy{background-image: url(../assets/images/bottom-strategy.png);}*/
        .i-gift{
          /*  position:relative;background-image: url(../assets/images/bottom-gift.png);*/
            &.hasTicket:after{
                content:'';display:block;position:absolute;right:-0.14rem;top:-0.06rem;width:.1rem;height:.1rem;background:#ff0000;border:.02rem solid #fff;border-radius:50%;
            }
        }
       /* .i-my{background-image: url(../assets/images/bottom-my.png);}*/
        .route {
            width: 100%;text-align: center;color:#696969;
            img{display:inline-block;width:.6rem;}
            .iconfont {color:#666;font-size: .42rem;}
            p{font-size:.25rem;line-height:.3rem;margin-top: 0.05rem;transition: all 0.2s;}
            .active-add {
            	animation:scaleADd 2s forwards;
                -moz-animation:scaleADd 2s forwards; /* Firefox */
                -webkit-animation:scaleADd 2s forwards; /* Safari and Chrome */
                -o-animation:scaleADd 2s forwards; /* Opera */
            }
            @keyframes scaleADd{
                    0% {
                        -webkit-transform: scale(1);
                        -moz-transform: scale(1);
                        -ms-transform: scale(1);
                        -o-transform: scale(1);
                        transform: scale(1);
                    }
                    50%{
                        -webkit-transform: scale(1.4);
                        -moz-transform: scale(1.4);
                        -ms-transform: scale(1.4);
                        -o-transform: scale(1.4);
                        transform: scale(1.4);
                    }
                    100%{
                        -webkit-transform: scale(1);
                        -moz-transform: scale(1);
                        -ms-transform: scale(1);
                        -o-transform: scale(1);
                        transform: scale(1);
                    }
                }
            &.router-link-active p,&.router-link-active .iconfont {
                color: #CA1D28;font-size: 0.27rem;
            }
            &.router-link-active .icon {
                background-position: bottom center;
            }
            
        }
        .active {
        	.iconfont,p {
        		color: #CA1D28!important;
        		font-size: 0.27rem;

        	}
     	 }
        .guideActive {
            z-index: 9999999;
            box-shadow:initial!important;
            p {
            	color: #fff!important;
            }
        }
    }
</style>

