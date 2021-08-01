<template>
  <div>
    <div class="container" ref="container">
      <div class="location-head" @click="switchItems">
        <span v-if="project">{{project.name}}</span>
        <svg-icon icon-class="icon_change" class-name="icon-change"></svg-icon>
      </div>
      <!-- :style="{height:contentHeight+'px'}" -->
      <div style="position: relative;width:100%;height:100%;" ref="wrap" >
        <img ref="bacImg" :src="imgSrc"  :style="imgstyle" style="opacity: 0;"/>
        <canvas id="canvas" class="canvas"  :width="canvasWidth" :height="canvasHeight" :style="canvasstyle"></canvas>
      </div>
      <div class="bottom-fixed" @click="toList">
       <!-- <img src="@/assets/images/location/icon_location_list.png" class="icon-location-list" srcset='../../assets/images/location/icon_location_list.png 1x,
               ../../assets/images/location/icon_location_list@2x.png 2x' /> -->
        <svg-icon icon-class="icon_location_list" class-name="icon-location-list"></svg-icon>
        <span>查看定位列表</span>
      </div>
    </div>
    <select-options ref="SelectOptions" @selProject="selProject"></select-options>
  </div>
</template>

<script>
  import SelectOptions from '@/components/SelectOptions'
  import {location_now_fx} from '@/api/location'
  export default {
    components:{SelectOptions},
    data() {
      return {
        canvas: null,
        context: null,
        icon: null,
        imgSrc: '',
        imgIsLoaded: false,
        locationList: [],
        initArr: [],
        iconArr: [],
        ratioImgCanvas: 0,
        ratioImgCanvas1: 0,
        contentHeight: 0,
        imgX: 0,
        imgY: 0,
        imgScale: 1,
        customRwidth: '',    //原图与展示图片的宽度比
        customRheight: '',   //原图与展示图片的高度比
        imgstyle: '',        //根据图片大小自适应样式
        canvasstyle: '',     //根据图片大小canvas自适应样式 居中显示
        canvasWidth: '',     //根据图片大小自适应canvas宽
        canvasHeight: '',    //根据图片大小自适应canvas高
        flagPC: true,
        flag: false,
        pos: {},
        posl: {},
      }
    },
    mounted() {
      this.flagPC = this.IsPC()
      //禁止移动端页面下滑
      this.$refs.container.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, {passive: false}); //passive 参数不能省略，用来兼容ios和android
    },
    computed: {
      project:{
        get(){
          return this.$store.getters.getSelProject
        },
        set(data){
          this.$store.commit('SET_SEL_PROJECT',data)
        }
      }
    },
    watch:{
      project: {
        handler(newName, oldName) {
          this.init()
        },
        immediate: true
      }
    },
    methods: {
      init(){
        this.getData()
      },
      toList() {
        this.$store.commit('SET_LOCATION_DATA',this.data)
        this.$router.push('/locationList')
      },
      switchItems() {
        this.$refs.SelectOptions.showAction()
      },
      selProject(val){
        this.project = val
        // this.getData()
      },
      getData() {
        if(!this.project){
          return
        }
        let param = {
          pid: this.project.id
        }
        location_now_fx(param).then(res=>{
          if(res.code === 200){
            this.data = res.data
            this.locationList = res.data.Normal
            this.$nextTick(()=>{
              this.canvasInit()
            })
          }else{
            this.$toast(res.msg || '请求失败')
          }
        })
      },
      canvasInit(){
        this.imgSrc = this.project.mapurl
        this.$nextTick(() => {
          this.formatMap()
        })
      },
      formatMap() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.$nextTick(() => {
           this.loadImg()
        })
        if(this.flagPC){
          this.canvasEventsInit()
        }else{
          this.mobileCanvasEventsInit()
        }

      },
      loadImg() {
        this.imgScale = 1
        this.initArr = []
        this.iconArr = []
        this.imgX = 0
        this.imgY = 0
        let bacImg = this.$refs.bacImg
        let imgWidth = bacImg.offsetWidth
        let imgHeight = bacImg.clientHeight
        let wrap = this.$refs.wrap
        let wrapWidth = wrap.clientWidth
        let wrapHeight = wrap.clientHeight

        this.contentHeight = imgHeight


        let _this = this;
        this.$nextTick(() => {

          this.img = new Image();
          this.img.onload = function() {
            _this.imgIsLoaded = true;
            let naturalWidth = _this.img.width //图片真实宽度
            let naturalHeight = _this.img.height //图片正式高度

            let canvasleft = 0;
            let canvastop = 0;
            let WrH = naturalWidth / naturalHeight; //图片宽高比
            let RWrH = wrapWidth / wrapHeight;    //放置图片DIV的宽高比
            let aa = 0;

            // 根据宽高比大小判断确定自适应的宽和高
            if (RWrH > WrH) {
              aa = wrapHeight / naturalHeight;
              _this.canvasHeight = wrapHeight;
              _this.canvasWidth = naturalWidth * aa;
              canvasleft = (wrapWidth - _this.canvasWidth) / 2
            } else {
              aa = wrapWidth / naturalWidth;
              _this.canvasHeight =naturalHeight * aa;
              _this.canvasWidth = wrapWidth;
              canvastop = (wrapHeight - _this.canvasHeight) / 2
            }
            _this.imgstyle = ' position: relative;  width:' + _this.canvasWidth
              + ' px; height:' + _this.canvasHeight + 'px'; //img浮动定位居中显示
            _this.customRwidth = _this.canvasWidth / naturalWidth; //原图与展示图片的宽高比
            _this.customRheight = _this.canvasHeight / naturalHeight;

            _this.canvasstyle = 'position: absolute;left: ' + canvasleft
              + '; top: ' + canvastop + ';' //canvas浮动定位

            _this.ratioImgCanvas = naturalWidth / _this.canvasWidth; // 图片的宽度/canvas画布宽度
            _this.ratioImgCanvas1 = naturalHeight / _this.canvasHeight; // 图片的高度/canvas画布高度

            for (let i = 0; i < _this.locationList.length; i++) {
              _this.initArr[i] = {};
              _this.initArr[i].x = (_this.locationList[i].x) / _this.ratioImgCanvas;
              _this.initArr[i].y = (_this.locationList[i].y) / _this.ratioImgCanvas1;
            }

            for (let k = 0; k < _this.initArr.length; k++) {
              _this.iconArr[k] = {};
              _this.iconArr[k].x = _this.initArr[k].x;
              _this.iconArr[k].y = _this.initArr[k].y;
            }
            setTimeout(()=>{
              _this.drawImageCanvas();
            },100)


          }
          console.info('this.imgSrc',this.imgSrc)
          this.img.src = this.imgSrc;


          // icon图片对象
          this.icon = new Image();
          this.icon.onload = function() {
            _this.iconIsLoaded = true;
            setTimeout(()=>{
              _this.drawImageCanvas();
            },100)

          }
          let location = require('@/assets/images/location/location@2x.png')
          this.icon.src = location;
        })

      },
      drawImageCanvas() {
        console.log('执行次数',this.img, this.img.width, this.img.height, this.imgX, this.imgY, this.canvas
          .width * this.imgScale, this.canvas.height * this.imgScale);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清空背景
        // 画背景
        this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.imgX, this.imgY, this.canvas
          .width * this.imgScale, this.canvas.height * this.imgScale);
        for (let i = 0; i < this.iconArr.length; i++) {
          this.context.drawImage(this.icon, this.iconArr[i].x, this.iconArr[i].y, 32, 32) // 画原有坐标（坐标集合）
        }
      },
      canvasEventsInit() {
        let _this = this
        this.canvas.onmousewheel = this.canvas.onwheel = function(event) { //滚轮放大缩小
          let pos = _this.windowToCanvas(event.clientX, event.clientY);
          let wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltalY * (-40)); //获取当前鼠标的滚动情况
          if (wheelDelta > 0) {
            if (_this.imgScale < 3.6) {
              _this.imgScale *= 1.2;
              _this.imgX = (_this.canvas.width - _this.canvas.width * _this.imgScale) / 2;
              _this.imgY = (_this.canvas.height - _this.canvas.height * _this.imgScale) / 2;
              // 放大缩小需处理 原有坐标集合，注意点
              for (let i = 0; i < _this.initArr.length; i++) {
                _this.initArr[i].x = _this.initArr[i].x * 1.2;
                _this.initArr[i].y = _this.initArr[i].y * 1.2;
              }
              for (let j = 0; j < _this.iconArr.length; j++) {
                _this.iconArr[j].x = _this.imgX + _this.initArr[j].x;
                _this.iconArr[j].y = _this.imgY + _this.initArr[j].y;
              }
              _this.drawImageCanvas();
              return false;
            } else {
              console.info('已经最大了！！！')
            }
          } else {
            if (_this.imgScale > 1) {
              _this.imgScale /= 1.2;
              _this.imgX = (_this.canvas.width - _this.canvas.width * _this.imgScale) / 2;
              _this.imgY = (_this.canvas.height - _this.canvas.height * _this.imgScale) / 2;

              for (let i = 0; i < _this.initArr.length; i++) {
                _this.initArr[i].x = _this.initArr[i].x / 1.2;
                _this.initArr[i].y = _this.initArr[i].y / 1.2;
              }
              for (let j = 0; j < _this.iconArr.length; j++) {
                _this.iconArr[j].x = _this.imgX + _this.initArr[j].x;
                _this.iconArr[j].y = _this.imgY + _this.initArr[j].y;
              }
              _this.drawImageCanvas();
            } else {
              console.info('已经最小了')
            }
          }
        };

        this.canvas.onmousedown = function(event) {
          let pos0 = _this.windowToCanvas( event.clientX, event.clientY); // 调用窗口坐标转canvas坐标函数
          let pos = _this.windowToCanvas( event.clientX, event.clientY);
          _this.canvas.onmousemove = function(event) {
            let pos1 = _this.windowToCanvas( event.clientX, event.clientY);
            if (pos1.x >= _this.canvas.width - 20 || pos1.y >= _this.canvas.height - 20 || pos1.x <= 20 || pos1
              .y <= 20) {
              _this.canvas.onmousemove = null;
              return false;
            }
            let x = pos1.x - pos.x; // 鼠标按下坐标与移动坐标差值
            let y = pos1.y - pos.y;
            pos = pos1;
            _this.imgX += x;
            _this.imgY += y;
            /*背景拖到边缘时禁止拖动*/
            if (_this.imgX >= 0) {
              _this.imgX = 0;
            }
            if (_this.imgY >= 0) {
              _this.imgY = 0;
            }
            if (-(_this.imgX) >= (_this.canvas.width * _this.imgScale - _this.canvas.width)) {
              _this.imgX = -(_this.canvas.width * _this.imgScale - _this.canvas.width)
            }
            if (-(_this.imgY) >= (_this.canvas.height * _this.imgScale - _this.canvas.height)) {
              _this.imgY = -(_this.canvas.height * _this.imgScale - _this.canvas.height)
            }
            // console.log('画布原点',_this.imgX,_this.imgY);
            for (let j = 0; j < _this.iconArr.length; j++) { // 坐标集合移动处理 此处为拖动时坐标处理 => 不理解可以在纸上画画，确定坐标数据计算方式
              _this.iconArr[j].x = _this.imgX + _this.initArr[j].x;
              _this.iconArr[j].y = _this.imgY + _this.initArr[j].y;
            }
            _this.drawImageCanvas(); // 绘制图片/ 新增坐标相对canvas不变化 addIconX1,在拖动时为定值，拖动时在canvas上的位置没变化
          }

          _this.canvas.onmouseup = function(event) {
            let pos2 = _this.windowToCanvas( event.clientX, event.clientY);
            _this.canvas.style.cursor = "default";
            _this.canvas.onmousemove = _this.cnvs_getCoordinates; // 鼠标在canvas上越过时触发函数，为实现其他功能暂时忽略
            _this.canvas.onmouseup = null;

            /*鼠标按下抬起时，是否产生移动=》是：拖动事件，否：点击事件*/
            let x1 = pos2.x - pos0.x;
            let y1 = pos2.y - pos0.y;
            if (x1 === 0 && y1 === 0) {
              for (let i = 0; i < _this.iconArr.length; i++) {
                if (pos2.x >= _this.iconArr[i].x - 16 && pos2.x <= _this.iconArr[i].x + 16 && pos2.y >= _this
                  .iconArr[i].y - 16 && pos2.y <= _this.iconArr[i].y + 16) {
                  _this.handleCanvasIconClick(i, pos2) // 点击时 当点击在原有坐标上可进行修改操作调用函数 暂时忽略
                }
              }
            } else {
              /*当拖动新增坐标时，鼠标移动最终位置位置，为新增坐标最终位置 => 注意点*/
              if (pos.x > _this.addIconX1 - 16 && pos.x < _this.addIconX1 + 16 && pos.y > _this.addIconY1 - 16 &&
                pos.y < _this.addIconY1 + 16) {
                _this.addIconX1 = _this.addIconX2;
                _this.addIconY1 = _this.addIconY2;
              }
            }
          }
        }

      },
      mobileCanvasEventsInit(){ //移动端canvas事件
        var pageX, pageY, initX, initY;
        var start = [];
        let _this = this;
        this.canvas.ontouchstart = function(event){
          _this.flag = true;
          if(event.touches && event.touches.length < 2) {
            let touch = event.touches[0];
            _this.pos = _this.windowToCanvas(touch.clientX, touch.clientY);  //坐标转换，将窗口坐标转换成canvas的坐标
          }else{
            let touches = event.touches;
            //手指按下时的手指所在的X，Y坐标
            pageX = touches[0].pageX;
            pageY = touches[0].pageY;
            //初始位置的X，Y 坐标
            initX = event.target.offsetLeft;
            initY = event.target.offsetTop;
            //记录初始 一组数据 作为缩放使用
            if (touches.length >= 2) { //判断是否有两个点在屏幕上
              start = touches; //得到第一组两个点
            };
          }
        }

        this.canvas.ontouchmove = function (evt) {
          console.info('移动',_this.flag)
          if(_this.flag ){
            console.info('touches',evt.touches)
            if(evt.touches && evt.touches.length < 2) {
              //移动
              if (_this.imgScale > 1) {
                let touch = evt.touches[0];
                _this.posl = _this.windowToCanvas(touch.clientX, touch.clientY);
                console.info('====>',_this.pos,_this.posl)
                var x = _this.posl.x - _this.pos.x, y = _this.posl.y - _this.pos.y;
                _this.imgX  += x;
                _this.imgY  += y;

                /*背景拖到边缘时禁止拖动*/
                // if (_this.imgX >= 0) {
                //   _this.imgX = 0;
                // }
                // if (_this.imgY >= 0) {
                //   _this.imgY = 0;
                // }
                // if (-(_this.imgX) >= (_this.canvas.width * _this.imgScale - _this.canvas.width)) {
                //   _this.imgX = -(_this.canvas.width * _this.imgScale - _this.canvas.width)
                // }
                // if (-(_this.imgY) >= (_this.canvas.height * _this.imgScale - _this.canvas.height)) {
                //   _this.imgY = -(_this.canvas.height * _this.imgScale - _this.canvas.height)
                // }

                _this.pos = JSON.parse(JSON.stringify(_this.posl));

                for (let j = 0; j < _this.iconArr.length; j++) { // 坐标集合移动处理 此处为拖动时坐标处理 => 不理解可以在纸上画画，确定坐标数据计算方式
                  _this.iconArr[j].x = _this.imgX + _this.initArr[j].x;
                  _this.iconArr[j].y = _this.imgY + _this.initArr[j].y;
                }
              }
            }else{
              //放大 缩小
              let touches = evt.touches;
              // 2 根 手指执行 目标元素放大操作
              //得到第二组两个点
              var now = touches;
              //当前距离变小， getDistance 是勾股定理的一个方法
              if(_this.getDistance(now[0], now[1]) < _this.getDistance(start[0], start[1])){
                // 缩小
                if (_this.imgScale > 1) {
                  _this.imgScale /= 1.2;
                  _this.imgX = (_this.canvas.width - _this.canvas.width * _this.imgScale) / 2;
                  _this.imgY = (_this.canvas.height - _this.canvas.height * _this.imgScale) / 2;

                  for (let i = 0; i < _this.initArr.length; i++) {
                    _this.initArr[i].x = _this.initArr[i].x / 1.2;
                    _this.initArr[i].y = _this.initArr[i].y / 1.2;
                  }
                  for (let j = 0; j < _this.iconArr.length; j++) {
                    _this.iconArr[j].x = _this.imgX + _this.initArr[j].x;
                    _this.iconArr[j].y = _this.imgY + _this.initArr[j].y;
                  }
                } else {
                  console.info('已经最小了')
                }

              }else if(_this.getDistance(now[0], now[1]) > _this.getDistance(start[0], start[1])){
                // 放大
                if (_this.imgScale < 3.6) {
                  _this.imgScale *= 1.2;
                  _this.imgX = (_this.canvas.width - _this.canvas.width * _this.imgScale) / 2;
                  _this.imgY = (_this.canvas.height - _this.canvas.height * _this.imgScale) / 2;
                  // 放大缩小需处理 原有坐标集合，注意点
                  for (let i = 0; i < _this.initArr.length; i++) {
                    _this.initArr[i].x = _this.initArr[i].x * 1.2;
                    _this.initArr[i].y = _this.initArr[i].y * 1.2;
                  }
                  for (let j = 0; j < _this.iconArr.length; j++) {
                    _this.iconArr[j].x = _this.imgX + _this.initArr[j].x;
                    _this.iconArr[j].y = _this.imgY + _this.initArr[j].y;
                  }
                }else{
                  console.info('已经最大了')
                }

              }
              start = now;
            }
            _this.drawImageCanvas();  //重新绘制图片
          }
        }

        this.canvas.ontouchend = function () {
            _this.flag  = false;
        };

      },
      //缩放 勾股定理方法-求两点之间的距离
      getDistance(p1, p2) {
        var x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
        return Math.sqrt((x * x) + (y * y));
      },
      windowToCanvas(x, y) {
        let bbox = this.canvas.getBoundingClientRect();
        console.info('this.canvas.height',this.canvas.height)
        return {
          x: x - bbox.left - (bbox.width - this.canvas.width) / 2,
          y: y - bbox.top - (bbox.height - this.canvas.height) / 2
        };
      },
      IsPC(){
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
      },
    }
  }
</script>

<style scoped lang="scss">
  .container {
    height: calc(100vh - 50px);
    position: relative;
  }

  .location-head {
    width: 375px;
    height: 60px;
    line-height: 60px;
    background: rgba(242, 243, 245, 0.6);
    padding: 0 16px;
    font-size: 20px;
    color: #000508;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    >span {
      @include textoverflow()
    }
    .icon-change {
      width:16px;
      height:16px;
      margin-left: 4px;
    }
  }

  .canvas {
    // width: 100%;
    // height: 100%;
    position: absolute;
    top: 50% !important;
    // left:0;
    left: 50% !important;
    transform: translate(-50%,-50%);
  }

  .bottom-fixed {
    position: fixed;
    bottom: 65px;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
    width: 327px;
    height: 42px;
    line-height: 42px;
    background-color: #ffffff;
    color: #2574F0;
    font-size: 14px;
    border: 1px solid #eaedf1;
    border-radius: 6px;
    box-shadow: 0px 2px 6px 0px rgba(20, 69, 147, 0.10);
    cursor: pointer;

    .icon-location-list {
      width: 16px;
      height: 16px;
      margin-right: 4px;
      vertical-align: middle;
    }
  }
</style>
