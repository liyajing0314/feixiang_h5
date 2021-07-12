<template>
  <div>
    <p>万达</p>
    <div style="position: relative;">
      <!-- <img :src="imgSrc" style="width:100%;"/> -->
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
        img:null,
        icon:null,
        imgSrc:'',
        imgIsLoaded:false,
        locationList:[],
        iconArr:[],
        initArr:[],
        ratioImgCanvas:0,
        ratioImgCanvas1:0,
        imgScale:0.5,
        imgX:0,
        imgY:0,
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

        this.formatMap()
      },
      formatMap () {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.loadImg()
      },
      loadImg(){
        this.canvasWidth = this.canvas.width;    // canvas画布宽度
        this.canvasHeight = this.canvas.height;  // canvas互补画布
        console.info('data===>',this.canvasWidth,this.canvasHeight)
        let this_ = this;
        this.img = new Image();
        this.img.onload = function(){
          this_.imgIsLoaded = true;
          console.log(this_.img.width);
           // this_.imgWidthHeightRatio = this_.img.width/this_.img.height; 原计划是画布宽高比根据所上传的图片确定修改为固定比例
          this_.ratioImgCanvas = this_.img.width/this_.canvasWidth;     // 图片的宽度/canvas画布宽度
          this_.ratioImgCanvas1 = this_.img.height/this_.canvasHeight;  // 图片的高度/canvas画布高度

          for (let i=0; i<this_.locationList.length;i++) {      // locationList 为后端取来的坐标数组 longitude 横坐标x，latitude 纵坐标y，包含一些其他相机数据
            this_.initArr[i] ={};                            // 初始化原有坐标集合，相对背景定位 eg：[{x:110,y:110},{x:220,y:220},{x:330,y:330},{x:110,y:69}];
            this_.initArr[i].x = (this_.locationList[i].x)/this_.ratioImgCanvas;    // 根据 图片与canvas宽高比换算出，当图片平铺在canvas上时，坐标在canvas上的坐标，方便绘图函数绘制坐标为位置，（放大缩小时需要原有坐标，该数组值不会根据惭怍变化而变化，放大缩小或者拖动）。
            this_.initArr[i].y = (this_.locationList[i].y)/this_.ratioImgCanvas1;
          }
          console.log(this_.initArr);
          for (let k=0;k<this_.initArr.length;k++) {       // iconArr 绘图函数绘图时坐标为位置，放大缩小/拖动，坐标在canvas上的坐标会一直变化（相对背景图片不会变化）
            this_.iconArr[k] = {};
            this_.iconArr[k].x = this_.initArr[k].x;
            this_.iconArr[k].y = this_.initArr[k].y;
          }
          this_.drawImageCanvas();   // 调用绘图函数
        }
        this.img.src = this.imgSrc; //矢量图
        // /*icon图片对象*/
        this.icon = new Image();
        this.icon.onload = function(){
          this_.iconIsLoaded = true;
          this_.drawImageCanvas();
        }
        // this.icon.src = "/static/images/location.png";
        this.icon.src = "location.png";
        // this.icon.src ="http://s9.rr.itc.cn/r/wapChange/20165_30_13/a1cra419863361386596.jpg"
      },
      drawImageCanvas (x,y) {
        console.log('执行次数',this.iconArr);
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);      // 清空背景
        // 画背景
        this.context.drawImage(this.img,0,0,this.img.width,this.img.height,this.imgX,this.imgY,this.canvas.width*this.imgScale,this.canvas.height*this.imgScale);
        for (let i = 0;i < this.iconArr.length;i++) {
          this.context.drawImage(this.icon,this.iconArr[i].x-16,this.iconArr[i].y-16,16,16) // 画原有坐标（坐标集合）
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .canvas {
    height:800px;
    position: absolute;
    top:0;
    left:0;
  }
</style>
