<template>
  <div>
    <p>万达</p>
    <div>
      <img src=""/>
      <canvas id="canvas" class="canvas"></canvas>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        canvas:null,
        context:null,
        img:null,
        icon:null,
        imgSrc:'',
      }
    },
    mounted() {
      this.formatMap()
    },
    methods:{
      formatMap () {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.loadImg()
      },
      loadImg(){
        this.canvasWidth = this.canvas.width;    // canvas画布宽度
        this.canvasHeight = this.canvas.height;  // canvas互补画布
        let this_ = this;
        this.img = new Image();
        this.img.onload = function(){
          this_.imgIsLoaded = true;
          console.log(this_.img.width);
           // this_.imgWidthHeightRatio = this_.img.width/this_.img.height; 原计划是画布宽高比根据所上传的图片确定修改为固定比例
          this_.ratioImgCanvas = this_.img.width/this_.canvasWidth;     // 图片的宽度/canvas画布宽度
          this_.ratioImgCanvas1 = this_.img.height/this_.canvasHeight;  // 图片的高度/canvas画布高度

          for (let i=0; i<this_.resPosArr.length;i++) {      // resPosArr 为后端取来的坐标数组 longitude 横坐标x，latitude 纵坐标y，包含一些其他相机数据
            this_.initArr[i] ={};                            // 初始化原有坐标集合，相对背景定位 eg：[{x:110,y:110},{x:220,y:220},{x:330,y:330},{x:110,y:69}];
            this_.initArr[i].x = (this_.resPosArr[i].longitude)/this_.ratioImgCanvas;    // 根据 图片与canvas宽高比换算出，当图片平铺在canvas上时，坐标在canvas上的坐标，方便绘图函数绘制坐标为位置，（放大缩小时需要原有坐标，该数组值不会根据惭怍变化而变化，放大缩小或者拖动）。
            this_.initArr[i].y = (this_.resPosArr[i].latitude)/this_.ratioImgCanvas1;
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
        /*icon图片对象*/
        this.icon = new Image();
        this.icon.onload = function(){
          this_.iconIsLoaded = true;
          this_.drawImageCanvas();
        }
        this.icon.src = "../../static/images/location.png"; // 地图上原有的图标

      },
      drawImageCanvas (x,y) {
        console.log('执行次数');
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);      // 清空背景
        // 画背景
        this.context.drawImage(this.img,0,0,this.img.width,this.img.height,this.imgX,this.imgY,this.canvas.width*this.imgScale,this.canvas.height*this.imgScale);
        for (let i = 0;i < this.iconArr.length;i ++) {
          this.context.drawImage(this.icon,this.iconArr[i].x-16,this.iconArr[i].y-16,32,32) // 画原有坐标（坐标集合）
        }


      },
    }
  }
</script>

<style scoped lang="scss">
  .canvas {
    height:500px;
  }
</style>
