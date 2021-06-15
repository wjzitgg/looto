<template>
    <div class="swiper"
         :class="[direction, {'dragging': dragging}]"
         @touchstart="_onTouchStart"
         @touchmove="_onTouchMove"
         @mousedown="_onTouchStart"
         @wheel="_onWheel">
        <div class="swiper-wrap"
             ref="swiperWrap"
             :style="{
                'transform':`translate3d(${translateX},${translateY}, 0)`,
                'transition-duration':`${transitionDuration}ms`
                }"
             @transitionend="_onTransitionEnd">
            <slot></slot>
        </div>
        <div class="swiper-pagination"
             v-show="paginationVisible">
            <span class="swiper-pagination-bullet"
                  v-for="(slide,index) in slideEls"
                  :class="{'active': index+1===currentPage}"
                  @click="paginationClickable && setPage(index+1)"
                  @change="paginationClickable && setPage(index+1)"></span>
        </div>
    </div>
</template>
<script type="text/babel">
    const VERTICAL = 'vertical';
    const HORIZONTAL = 'horizontal';
    export default {
        props: {
            direction: {
                type: String,
                default: VERTICAL,
                validator: (value) => [VERTICAL, HORIZONTAL].indexOf(value) > -1
            },
            mousewheelControl: {
                type: Boolean,
                default: false
            },
            performanceMode: {
                type: Boolean,
                default: false
            },
            paginationVisible: {
                type: Boolean,
                default: false
            },
            paginationClickable: {
                type: Boolean,
                default: false
            },
            loop: {
                type: Boolean,
                default: false
            },
            speed: {
                type: Number,
                default: 500
            },
            auto:{
                type: Number,
                default: 3000
            }
        },
        data() {
            return {
                currentPage: 1,
                lastPage: 1,
                translateX: 0,
                translateY: 0,
                startTranslate: 0,
                delta: 0,
                dragging: false,
                startPos: null,
                transitioning: false,
                slideEls: [],
                translateOffset: 0,
                transitionDuration: 0,
                timer:null
            };
        },
        watch:{
            auto(newVal){
                if(newVal){
                    this.setAutoPlay()
                }else{
                    clearInterval(this.timer)
                    this.timer=null
                }
            }
        },
        mounted() {
            this._onTouchMove = this._onTouchMove.bind(this);
            this._onTouchEnd = this._onTouchEnd.bind(this);
            this.slideEls = [].map.call(this.$refs.swiperWrap.children, el => el);
            if (this.loop) {
                this.$nextTick(function () {
                    this._createLoop();
                    this.setPage(this.currentPage, true);
                });
            } else {
                this.setPage(this.currentPage);
            }
            this.setAutoPlay()

        },
        methods: {
            setAutoPlay(){
                if(this.auto>0){
                    clearInterval(this.timer)
                    this.timer=setInterval(()=>{
                        this.next()
                    },this.auto)
                }
            },
            next() {
                var page = this.currentPage;
                if (page < this.slideEls.length || this.loop) {
                    this.setPage(page + 1);
                } else {
                    this._revert();
                }
            },
            prev() {
                var page = this.currentPage;
                if (page > 1 || this.loop) {
                    this.setPage(page - 1);
                } else {
                    this._revert();
                }
            },
            setPage(page, noAnimation) {
                var self = this;
                this.lastPage = this.currentPage;
                if (page === 0) {
                    this.currentPage = this.slideEls.length;
                } else if (page === this.slideEls.length + 1) {
                    this.currentPage = 1;
                } else {
                    this.currentPage = page;
                }
                if (this.loop) {
                    if (this.delta === 0) {
                        this._setTranslate(self._getTranslateOfPage(this.lastPage));
                    }
                    setTimeout(function () {
                        self._setTranslate(self._getTranslateOfPage(page));
                        if (noAnimation) return;
                        self._onTransitionStart();
                    }, 0);
                } else {
                    this._setTranslate(this._getTranslateOfPage(page));
                    if (noAnimation) return;
                    this._onTransitionStart();
                }
            },
            isHorizontal() {
                return this.direction === HORIZONTAL;
            },
            isVertical() {
                return this.direction === VERTICAL;
            },
            _onTouchStart(e) {
                if(this.timer){
                    clearInterval(this.timer)
                    this.timer=null
                }
                this.startPos = this._getTouchPos(e);
                this.delta = 0;
                this.startTranslate = this._getTranslateOfPage(this.currentPage,'px');
                this.startTime = new Date().getTime();
                this.dragging = true;
                this.transitionDuration = 0;
                document.addEventListener('touchmove', this._onTouchMove, false);
                document.addEventListener('touchend', this._onTouchEnd, false);
                document.addEventListener('mousemove', this._onTouchMove, false);
                document.addEventListener('mouseup', this._onTouchEnd, false);
            },
            _onTouchMove(e) {
                this.delta = this._getTouchPos(e) - this.startPos;

                if (!this.performanceMode) {
                    this._setTranslate(this.startTranslate + this.delta+'px');
                    this.$emit('slider-move', this._getTranslate());
                }
                if (this.isVertical() || this.isHorizontal() && Math.abs(this.delta) > 10) {
                    e.preventDefault();
                }
            },
            _onTouchEnd(e) {
                this.setAutoPlay()
                this.dragging = false;
                this.transitionDuration = this.speed;
                var isQuickAction = new Date().getTime() - this.startTime < 1000;
                if (this.delta < -100 || (isQuickAction && this.delta < -15)) {
                    this.next();
                } else if (this.delta > 100 || (isQuickAction && this.delta > 15)) {
                    this.prev();
                } else {
                    this._revert();
                }
                document.removeEventListener('touchmove', this._onTouchMove);
                document.removeEventListener('touchend', this._onTouchEnd);
                document.removeEventListener('mousemove', this._onTouchMove);
                document.removeEventListener('mouseup', this._onTouchEnd);
            },
            _onWheel(e) {
                if (this.mousewheelControl) {
                    // TODO Support apple magic mouse and trackpad.
                    if (!this.transitioning) {
                        if (e.deltaY > 0) {
                            this.next();
                        } else {
                            this.prev();
                        }
                    }
                    if (this._isPageChanged()) e.preventDefault();
                }
            },
            _revert() {
                this.setPage(this.currentPage);
            },
            _getTouchPos(e) {
                var key = this.isHorizontal() ? 'pageX' : 'pageY';
                return e.changedTouches ? e.changedTouches[0][key] : e[key];
            },
            _onTransitionStart() {
                this.transitioning = true;
                this.transitionDuration = this.speed;
                if (this._isPageChanged()) {
                    this.$emit('slide-change-start', this.currentPage);
                } else {
                    this.$emit('slide-revert-start', this.currentPage);
                }
            },
            _onTransitionEnd() {
                this.transitioning = false;
                this.transitionDuration = 0;
                this.delta = 0;
                if (this._isPageChanged()) {
                    this.$emit('slide-change-end', this.currentPage);
                } else {
                    this.$emit('slide-revert-end', this.currentPage);
                }
            },
            _isPageChanged() {
                return this.lastPage !== this.currentPage;
            },
            _setTranslate(value) {
                var translateName = this.isHorizontal() ? 'translateX' : 'translateY';
                this[translateName] = value;
            },
            _getTranslate(){
                var translateName = this.isHorizontal() ? 'translateX' : 'translateY';
                return this[translateName];
            },
            _getTranslateOfPage(page,unit) {
                if (page === 0) return 0;
                if(typeof unit =="undefined"||unit=="%")
                    return -100*page+"%"
                else if(unit=="px"){
                    var propName = this.isHorizontal() ? 'clientWidth' : 'clientHeight';
                    return -this.$refs.swiperWrap[propName]*page
                }else{
                    console.error("Swiper:_getTranslateOfPage不支持unit参数类型")
                }
            },
            _createLoop() {
                var propName = this.isHorizontal() ? 'clientWidth' : 'clientHeight';
                var swiperWrapEl = this.$refs.swiperWrap;
                var duplicateFirstChild = swiperWrapEl.firstElementChild.cloneNode(true);
                var duplicateLastChild = swiperWrapEl.lastElementChild.cloneNode(true);
                swiperWrapEl.insertBefore(duplicateLastChild, swiperWrapEl.firstElementChild);
                swiperWrapEl.appendChild(duplicateFirstChild);
                this.translateOffset = -duplicateLastChild[propName];
            }
        }
    };
</script>

<style>
    .swiper {position: absolute; overflow: hidden;top:0;left:0; right: 0;bottom:0;width:100%;height: 100%;}
    /*.swiper {position: relative; overflow: hidden;}*/
    .swiper .swiper-wrap{/*box*/ display: -webkit-box; /*flex*/ display: -webkit-flex; display: flex; width: 100%; height: 100%;transition: all 0ms ease;}
    .swiper .swiper-wrap>div{overflow: hidden; flex-shrink: 0; width: 100%; height: 100%;}
    .swiper.horizontal .swiper-wrap {-webkit-box-orient:horizontal; box-orient:horizontal; -webkit-flex-direction:row; flex-direction:row; }
    .swiper.vertical .swiper-wrap {-webkit-box-orient:vertical; box-orient:vertical;-webkit-flex-direction:column; flex-direction:column; }
    .swiper-pagination { position: absolute;}
    .swiper-pagination-bullet { width: 6px; height: 6px; border-radius: 50%; background-color: #fff; opacity: .2; transition: all .5s ease; }
    .swiper-pagination-bullet.active { background: #fff; opacity: 1; }
    .swiper.vertical .swiper-pagination { right: 10px; top: 50%; transform: translate3d(0, -50%, 0);}
    .swiper.vertical .swiper-pagination-bullet { display: block; margin: 6px 0; }
    .swiper.horizontal .swiper-pagination { bottom: 10px; width: 100%; text-align: center;}
    .swiper.horizontal .swiper-pagination-bullet { display: inline-block; margin: 0 2px; }

</style>