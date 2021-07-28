<template>
  <div class="container">
    <div class="location-head" @click="switchItems">
      <span>{{project.name}}</span>
      <img src="@/assets/images/icon_change.png" class="icon-change"/>
    </div>
    <!-- :style="{height:contentHeight+'px'}" -->
    <div style="position: relative;width:100%;height:100%;" ref="wrap">
      <img ref="bacImg" :src="imgSrc" style="width:100%;height:100%;" />
      <canvas id="canvas" class="canvas"></canvas>
    </div>
    <div class="bottom-fixed" @click="toList">
      <img src="@/assets/images/location/icon_location_list.png" class="icon-location-list" srcset='../../assets/images/location/icon_location_list.png 1x,
             ../../assets/images/location/icon_location_list@2x.png 2x' />
      <span>查看定位列表</span>
    </div>
    <select-options ref="SelectOptions" @selProject="selProject"></select-options>
  </div>
</template>

<script>
  import SelectOptions from '@/components/SelectOptions'
  import {location_now_fx} from '@/api/location'
  import {mapGetters } from 'vuex'
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
        data:{}
      }
    },
    computed: {
      ...mapGetters([
        'getProjectData',
      ]),
      project:{
        get(){
          return this.$store.getters.getSelProject
        },
        set(data){
          this.$store.commit('SET_SEL_PROJECT',data)
        }
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      toList() {
        this.$store.commit('SET_LOCATION_DATA',this.data)
        this.$router.push('/locationList')
      },
      switchItems() {
        this.$refs.SelectOptions.showAction()
      },
      selProject(val){
        this.project = val
        this.getData()
      },
      getData() {
        let param = {
          pid: this.project.id
        }
        location_now_fx(param).then(res=>{
          if(res.code === 200){
            this.data = res.data
            this.locationList = res.data.Normal
            this.canvasInit()
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
        this.canvasEventsInit()
      },
      loadImg() {
        console.info('this.$refs',this.$refs)
        let bacImg = this.$refs.bacImg
        let imgWidth = bacImg.offsetWidth
        let imgHeight = bacImg.clientHeight

        this.contentHeight = imgHeight

        console.info('bacImg', this.$refs, imgWidth, imgHeight)

        let this_ = this;
        this.$nextTick(() => {
          let wrap = this_.$refs.wrap
          // this.canvas.width = wrap.offsetWidth
          // this.canvas.height = wrap.offsetHeight
          this.canvas.width = imgWidth
          this.canvas.height = imgHeight
          this.canvasWidth = this.canvas.width;
          this.canvasHeight = this.canvas.height;
          console.info('data===>', this.canvasWidth, this.canvasHeight)

          this.img = new Image();
          this.img.onload = function() {
            this_.imgIsLoaded = true;
            let naturalWidth = this_.img.width //图片真实宽度
            let naturalHeight = this_.img.height //图片正式高度

            this_.ratioImgCanvas = naturalWidth / this_.canvasWidth; // 图片的宽度/canvas画布宽度
            this_.ratioImgCanvas1 = naturalHeight / this_.canvasHeight; // 图片的高度/canvas画布高度

            for (let i = 0; i < this_.locationList.length; i++) {
              this_.initArr[i] = {};
              this_.initArr[i].x = (this_.locationList[i].x) / this_.ratioImgCanvas;
              this_.initArr[i].y = (this_.locationList[i].y) / this_.ratioImgCanvas1;
            }

            for (let k = 0; k < this_.initArr.length; k++) {
              this_.iconArr[k] = {};
              this_.iconArr[k].x = this_.initArr[k].x;
              this_.iconArr[k].y = this_.initArr[k].y;
            }
            this_.drawImageCanvas();

          }

          this.img.src = this.imgSrc;


          // icon图片对象
          this.icon = new Image();
          this.icon.onload = function() {
            this_.iconIsLoaded = true;
            this_.drawImageCanvas();
          }
          let location = require('@/assets/images/location/location@2x.png')
          this.icon.src = location;
        },500)

      },
      drawImageCanvas(x, y) {
        console.log('执行次数', this.iconArr);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清空背景
        // 画背景
        this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.imgX, this.imgY, this.canvas
          .width * this.imgScale, this.canvas.height * this.imgScale);
        for (let i = 0; i < this.iconArr.length; i++) {
          this.context.drawImage(this.icon, this.iconArr[i].x, this.iconArr[i].y, 32, 32) // 画原有坐标（坐标集合）
        }
      },
      canvasEventsInit() {
        let this_ = this
        this.canvas.onmousewheel = this.canvas.onwheel = function(event) { //滚轮放大缩小
          let pos = this_.windowToCanvas(event.clientX, event.clientY);
          let wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltalY * (-40)); //获取当前鼠标的滚动情况
          if (wheelDelta > 0) {
            if (this_.imgScale < 3.6) {
              this_.imgScale *= 1.2;
              this_.imgX = (this_.canvas.width - this_.canvas.width * this_.imgScale) / 2;
              this_.imgY = (this_.canvas.height - this_.canvas.height * this_.imgScale) / 2;
              // 放大缩小需处理 原有坐标集合，注意点
              for (let i = 0; i < this_.initArr.length; i++) {
                this_.initArr[i].x = this_.initArr[i].x * 1.2;
                this_.initArr[i].y = this_.initArr[i].y * 1.2;
              }
              for (let j = 0; j < this_.iconArr.length; j++) {
                this_.iconArr[j].x = this_.imgX + this_.initArr[j].x;
                this_.iconArr[j].y = this_.imgY + this_.initArr[j].y;
              }
              this_.drawImageCanvas();
              return false;
            } else {
              console.info('已经最大了！！！')
            }
          } else {
            if (this_.imgScale > 1) {
              this_.imgScale /= 1.2;
              this_.imgX = (this_.canvas.width - this_.canvas.width * this_.imgScale) / 2;
              this_.imgY = (this_.canvas.height - this_.canvas.height * this_.imgScale) / 2;

              for (let i = 0; i < this_.initArr.length; i++) {
                this_.initArr[i].x = this_.initArr[i].x / 1.2;
                this_.initArr[i].y = this_.initArr[i].y / 1.2;
              }
              for (let j = 0; j < this_.iconArr.length; j++) {
                this_.iconArr[j].x = this_.imgX + this_.initArr[j].x;
                this_.iconArr[j].y = this_.imgY + this_.initArr[j].y;
              }
              this_.drawImageCanvas();
            } else {
              console.info('已经最小了')
            }
          }
        };



        this.canvas.onmousedown = function(event) {
          console.info('鼠标')
          let pos0 = this_.windowToCanvas(this_.canvas, event.clientX, event.clientY); // 调用窗口坐标转canvas坐标函数
          let pos = this_.windowToCanvas(this_.canvas, event.clientX, event.clientY);
          this_.canvas.onmousemove = function(event) {
            console.info('移动')
            let pos1 = this_.windowToCanvas(this_.canvas, event.clientX, event.clientY);
            if (pos1.x >= this_.canvas.width - 20 || pos1.y >= this_.canvas.height - 20 || pos1.x <= 20 || pos1
              .y <= 20) {
              this_.canvas.onmousemove = null;
              return false;
            }
            let x = pos1.x - pos.x; // 鼠标按下坐标与移动坐标差值
            let y = pos1.y - pos.y;
            pos = pos1;
            this_.imgX += x;
            this_.imgY += y;
            /*背景拖到边缘时禁止拖动*/
            if (this_.imgX >= 0) {
              this_.imgX = 0;
            }
            if (this_.imgY >= 0) {
              this_.imgY = 0;
            }
            if (-(this_.imgX) >= (this_.canvas.width * this_.imgScale - this_.canvas.width)) {
              this_.imgX = -(this_.canvas.width * this_.imgScale - this_.canvas.width)
            }
            if (-(this_.imgY) >= (this_.canvas.height * this_.imgScale - this_.canvas.height)) {
              this_.imgY = -(this_.canvas.height * this_.imgScale - this_.canvas.height)
            }
            // console.log('画布原点',this_.imgX,this_.imgY);
            for (let j = 0; j < this_.iconArr.length; j++) { // 坐标集合移动处理 此处为拖动时坐标处理 => 不理解可以在纸上画画，确定坐标数据计算方式
              this_.iconArr[j].x = this_.imgX + this_.initArr[j].x;
              this_.iconArr[j].y = this_.imgY + this_.initArr[j].y;
            }
            this_.drawImageCanvas(); // 绘制图片/ 新增坐标相对canvas不变化 addIconX1,在拖动时为定值，拖动时在canvas上的位置没变化
          }

          this_.canvas.onmouseup = function(event) {
             console.info('移动22222222')
            let pos2 = this_.windowToCanvas(this_.canvas, event.clientX, event.clientY);
            this_.canvas.style.cursor = "default";
            this_.canvas.onmousemove = this_.cnvs_getCoordinates; // 鼠标在canvas上越过时触发函数，为实现其他功能暂时忽略
            this_.canvas.onmouseup = null;

            /*鼠标按下抬起时，是否产生移动=》是：拖动事件，否：点击事件*/
            let x1 = pos2.x - pos0.x;
            let y1 = pos2.y - pos0.y;
            if (x1 === 0 && y1 === 0) {
              console.log("点击事件");
              for (let i = 0; i < this_.iconArr.length; i++) {
                if (pos2.x >= this_.iconArr[i].x - 16 && pos2.x <= this_.iconArr[i].x + 16 && pos2.y >= this_
                  .iconArr[i].y - 16 && pos2.y <= this_.iconArr[i].y + 16) {
                  this_.handleCanvasIconClick(i, pos2) // 点击时 当点击在原有坐标上可进行修改操作调用函数 暂时忽略
                }
              }
            } else {
              console.log("拖动事件");
              /*当拖动新增坐标时，鼠标移动最终位置位置，为新增坐标最终位置 => 注意点*/
              if (pos.x > this_.addIconX1 - 16 && pos.x < this_.addIconX1 + 16 && pos.y > this_.addIconY1 - 16 &&
                pos.y < this_.addIconY1 + 16) {
                this_.addIconX1 = this_.addIconX2;
                this_.addIconY1 = this_.addIconY2;
              }
            }
          }
        }



      },
      windowToCanvas(canvas, x, y) {
        let bbox = this.canvas.getBoundingClientRect();
        return {
          x: x - bbox.left - (bbox.width - this.canvas.width) / 2,
          y: y - bbox.top - (bbox.height - this.canvas.height) / 2
        };
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
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
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
