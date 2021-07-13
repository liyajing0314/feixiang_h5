<template>
  <div class="container">
    <p>万达</p>
    <div style="position: relative;width:100%;" :style="{height:contentHeight+'px'}">
      <img ref="bacImg" :src="imgSrc" style="width:100%;"/>
      <canvas id="canvas" class="canvas"></canvas>
    </div>
  </div>
</template>

<script>
  import {loadproject,location_now_v2} from '@/api/index'
  export default {
    data(){
      return {
        canvas:null,
        context:null,
        icon:null,
        imgSrc:'',
        imgIsLoaded:false,
        locationList:[],
        iconArr:[],
        ratioImgCanvas:0,
        ratioImgCanvas1:0,
        contentHeight:0,
      }
    },
    mounted() {
      this.getData()
    },
    methods:{
      getData(){
        // loadproject({ID: 22}).then(res=>{

        // })

        let loadproject = {
          "code":0,
          "message":"加载完成",
          "result":{
            "address":"北京","beaconNum":"226","scale":3.0,
            "TodayWorkTime":"5197.10","cardNum":"25",
            "personnumber":22,"roomNum":"102","kaoqinID":"12345678934",
            "TodayPersonNum":"24","errorkaoqin":"0","name":"德必WE文创园(天坛)",
            "mapurl":"https://52mibee.oss-cn-beijing.aliyuncs.com/58qifu/a67ce855401348bd806dda7c52bd5483.png",
            "projecttype":"企业总部","ID":22,"workerNum":"24","info":"德必试点项目","status":0,
          },
          "type":null,
        }

        let now = {
          "code":0,
          "message":"查询完成",
          "result":
          {
            "Error":[
              {"username":"袁国平","status":"信号弱"},
              {"username":"高淑芹","status":"信号弱"},
              {"username":"魏宪英","status":"信号弱"},{"username":"竹蕊霞","status":"信号弱"},
              {"username":"陈元英","status":"信号弱"}],
              "Normal":[
                {"x":1607.5,"y":2805.625,"time":"07-12 21:00","roomName":"2层-休息间","username":"徐桂芳","status":"success"},
                {"x":1617.5,"y":2805.625,"time":"07-12 21:01","roomName":"2层-休息间","username":"相咸英","status":"success"},
                {"x":1567.5,"y":2815.625,"time":"07-12 21:00","roomName":"2层-休息间","username":"刘连贵","status":"success"},
                {"x":1567.5,"y":2815.625,"time":"07-12 21:01","roomName":"2层-休息间2","username":"李丙堂","status":"success"},
                {"x":1567.5,"y":2815.625,"time":"07-12 21:00","roomName":"2层-休息间","username":"将大珍","status":"success"},
              ]
          },
          "type":null,
        }


        this.imgSrc = loadproject.result.mapurl
        this.locationList = now.result.Normal
        this.$nextTick(()=>{
          this.formatMap()
        })

      },
      formatMap () {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.loadImg()
        this.canvasEventsInit()
      },
      loadImg(){
        let bacImg = this.$refs.bacImg
        let imgWidth = bacImg.clientWidth
        let imgHeight = bacImg.clientHeight
        let naturalWidth = bacImg.naturalWidth //图片真实宽度
        let naturalHeight = bacImg.naturalHeight //图片正式高度

        this.contentHeight = imgHeight

        console.info('bacImg',this.$refs,imgWidth,imgHeight)

        let this_ = this;
        this.$nextTick(()=>{
          this.canvas.width = imgWidth
          this.canvas.height = imgHeight
          this.canvasWidth = this.canvas.width;
          this.canvasHeight = this.canvas.height;
          console.info('data===>',this.canvasWidth,this.canvasHeight)

          this.ratioImgCanvas = naturalWidth/this.canvasWidth;     // 图片的宽度/canvas画布宽度
          this.ratioImgCanvas1 = naturalHeight/this.canvasHeight;  // 图片的高度/canvas画布高度
          for (let i=0; i<this.locationList.length;i++) {
            this.iconArr[i] ={};
            this.iconArr[i].x = (this.locationList[i].x)/this.ratioImgCanvas;    // 根据 图片与canvas宽高比换算出，当图片平铺在canvas上时，坐标在canvas上的坐标，方便绘图函数绘制坐标为位置，（放大缩小时需要原有坐标，该数组值不会根据惭怍变化而变化，放大缩小或者拖动）。
            this.iconArr[i].y = (this.locationList[i].y)/this.ratioImgCanvas1;
          }

          // /*icon图片对象*/
          this.icon = new Image();
          this.icon.onload = function(){
            this_.iconIsLoaded = true;
            this_.drawImageCanvas();
          }
          let location = require('@/assets/images/location.png')
          this.icon.src = location;
        })

      },
      drawImageCanvas (x,y) {
        console.log('执行次数',this.iconArr);
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);      // 清空背景
        // 画背景
        for (let i = 0;i < this.iconArr.length;i++) {
          this.context.drawImage(this.icon,this.iconArr[i].x,this.iconArr[i].y,16,16) // 画原有坐标（坐标集合）
        }
      },
      canvasEventsInit(){
        this.canvas.onmousewheel = this.canvas.onwheel = function (event) {    //滚轮放大缩小
          var pos = windowToCanvas (event.clientX, event.clientY);
          event.wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltalY * (-40));  //获取当前鼠标的滚动情况
          if (event.wheelDelta > 0) {
              imgScale *= 2;
              imgX = imgX * 2 - pos.x;
              imgY = imgY * 2 - pos.y;
          } else {
              imgScale /= 2;
              imgX = imgX * 0.5 - pos.x * 0.5;
              imgY = imgY * 0.5 - pos.y * 0.5;
          }
          this.drawImageCanvas();   //重新绘制图片
        };
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
  }
  .canvas {
    width: 100%;
    height:100%;
    position: absolute;
    top:0;
    left:0;
  }
</style>
