<template>
  <div class="container" ref="container">
    <div ref="content" id="content">
      <div class="head" @click="changeTime">{{month}}
        <!-- <img src="@/assets/images/icon_change.png" srcset='../../assets/images/icon_change.png 1x,
                   ../../assets/images/icon_change@2x.png 2x'
          class="icon-change" v-show="!picFlag"/> -->
        <svg-icon icon-class="icon_change" class-name="icon-change" v-show="!picFlag"></svg-icon>
      </div>
      <div>
        <div class="table-row table-head">
          <div class="table-col table-col-1">
            <div class="search-box" @click="changePeople" v-show="!picFlag">
              <svg-icon icon-class="icon_search" class-name="icon-search"></svg-icon>
              查找人
            </div>
          </div>
          <div class="yd table-col">应到</div>
          <div class="sd table-col">实到</div>
          <div class="cd table-col">迟到</div>
          <div class="zt table-col">早退</div>
          <div class="kg table-col">矿工</div>
          <div class="qj table-col">请假</div>
        </div>
        <div class="table-body" ref="tableBody">
          <div class="table-row" v-for="(item,index) in list" :class="{'active':active === index}" :key="index" :ref="'anchor'+index">
            <div class="table-col table-col-1"><span class="name">{{item.name}}</span></div>
            <div class="table-col">{{item.shouldDayNum}}</div>
            <div class="table-col" :class="{'sd':item.actuallyDayNum < item.shouldDayNum}">{{item.actuallyDayNum}}</div>
            <div class="table-col" :class="{'cd':item.lateNum >0}">{{item.lateNum}}</div>
            <div class="table-col" :class="{'zt':item.eaveEarlyNum >0}">{{item.eaveEarlyNum}}</div>
            <div class="table-col" :class="{'kg':item.absenteeismNum >0}">{{item.absenteeismNum}}</div>
            <div class="table-col" :class="{'qj':item.leaveNum > 0}">{{item.leaveNum}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-box" @click="downImg" v-show="!btnFlag">
      <van-button type="primary" class="btn" >
        <!-- <img src="~@/assets/images/kanban/icon_pic@2x.png" class="icon-pic" /> -->
        <svg-icon icon-class="icon_pic" class-name="icon-pic"></svg-icon>
        <span>长按保存为图片至相册</span>
      </van-button>
    </div>
    <img :src="picUrl" class="down-pic" @click="downImg" v-show="!btnFlag">
    <sel-picker ref="selPicker" @selPicker="selPicker"></sel-picker>
    <select-people-single ref="selectPeople" :list="list" @selPeople="selPeople"></select-people-single>
  </div>
</template>

<script>
  import {parseTime} from '@/utils/index'
  import SelectPeopleSingle from '@/components/SelectPeopleSingle'
  import SelPicker from '@/components/SelPicker'
  import {attendanceReport} from '@/api/kanban'
  // import html2canvas from 'html2canvas'
  import html2canvas from "@/assets/js/html2canvas";
  export default {
    components: {
      SelPicker,
      SelectPeopleSingle
    },
    data() {
      return {
        month: '',
        list: [],
        active: '',
        picFlag:false,
        btnFlag:false,
        picUrl:''
      }
    },
    mounted() {
      let time = new Date().getTime()
      this.month = parseTime(time, '{y}-{m}')
      this.getData()
    },
    computed: {
      project: {
        get() {
          return this.$store.getters.getSelProject
        },
        set(data) {
          this.$store.commit('SET_SEL_PROJECT', data)
        }
      }
    },
    methods: {
      getData() {
        let param = {
          pid: this.project.id,
          recordDate: this.month
        }
        attendanceReport(param).then(res => {
          if (res.code === 200) {
            let data = res.data
            data.map((item,index)=>{
               item.id = index
            })
            this.list = data
            this.$nextTick(()=>{
              this.createImg()
            })
          } else {
            this.list = []
          }
        })
      },
      changeTime() {
        this.$refs.selPicker.showPopup()
      },
      selPicker(val) {
        this.month = val
        this.getData()
      },
      changePeople() {
        this.$refs.selectPeople.showPopup('global')
      },
      selPeople(item, index) {
        this.active = index
        let top = 40 * index
        let anchor = this.$refs['anchor'+index][0]
        let height = anchor.clientHeight * index

        this.$refs.tableBody.scrollTo({
          top: height,
          behavior: "smooth" // 平滑滚动
        })

      },
      createImg() {
        this.$nextTick(()=>{
          this.picFlag = true
          this.btnFlag = true
          let content = this.$refs.content
          // let content = document.getElementById("content");
          let tableBody = this.$refs.tableBody
          let scrollHeight = tableBody.scrollHeight + 100
          let scrollWidth = tableBody.scrollWidth
          console.info('去生成图片');

          // html2canvas(content, {
          //   scale: 0.9, //window.devicePixelRatio * 2
          //   useCORS: true, //开启跨域配置，但和allowTaint不能共存
          //   width: scrollWidth,
          //   height: scrollHeight,
          //   windowWidth: scrollWidth,
          //   windowHeight: scrollHeight,
          //   x: 0,
          //   y: 0
          // }).then((canvas) => {
          //   console.info('生成图片成功')

          //   let that = this
          //   let isAndroid = that.isAndroid()
          //   if(isAndroid){
          //     let dataURL = canvas.toDataURL("image/jpg");
          //     that.picUrl = dataURL
          //   }else{
          //     canvas.toBlob(function(blob) {
          //       var url = URL.createObjectURL(blob);
          //       that.picUrl = url
          //     });
          //   }
          //   this.btnFlag = false
          // }).catch(err=>{
          //   console.info('报错')
          // })



          // 使用, 全局window对象加入html2canvas，如果没有window就调用原来的，所以需要做判断
          (window.html2canvas || html2canvas)(content,
          {
            scale: window.devicePixelRatio, //window.devicePixelRatio * 2
            useCORS: true, //开启跨域配置，但和allowTaint不能共存
            width: scrollWidth,
            height: scrollHeight,
            windowWidth: scrollWidth,
            windowHeight: scrollHeight,
            x: 0,
            y: 0
          }).then(canvas => {
            let url = canvas.toDataURL("image/jpg");
            console.log(url)
            this.picUrl = url
            this.btnFlag = false
          })
          .catch(err => {
            // do sth
          });

          this.picFlag = false
        })
      },
      isAndroid(){
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //如果输出结果是true就判定是android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //根据输出结果true或者false来判断ios终端
        //!!双叹号一般用来将后面的表达式转换为布尔型的数据（boolean）
        if(isAndroid){
          return true
        }else if(isioS){
          return false
        }
      },
      downImg(){
        let link = document.createElement("a");
        link.href = this.picUrl;
        let filename = `${new Date().getTime()}.jpg`; //文件名称
        link.setAttribute("download", filename);
        link.style.display = "none"; //a标签隐藏
        document.body.appendChild(link);
        link.click();
      }

    }
  }
</script>

<style scoped lang="scss">
  .container {
    background-color: #FFFFFF;
    min-height: 100vh;
    padding-top: 50px;
  }

  .head {
    background-color: #ffffff;
    padding: 16px;
    width: 100%;
    position: fixed;
    top: 0;
    font-size: 16px;
    font-weight: 600;

    .icon-change {
      width: 16px;
      height: 16px;
      margin-left: 4px;
      position: relative;
      top: 2px;
    }
  }

  .table-row {
    display: flex;
    font-size: 16px;
    .table-col {
      flex: 1;
      text-align: center;
      padding: 10px 2px;
      font-weight: 400;
    }
    .table-col-1 {
      min-width: 84px;
    }
  }
  .table-head {
    position: fixed;
    top:50px;
    width:100%;
    background-color: #FFFFFF;
    font-size: 14px;
    border-bottom: 1px solid rgba(151, 151, 151, 0.1);
  }
  .table-body {
    padding-top:50px;
    padding-bottom: 80px;
    height:calc(100vh - 52px);
    overflow: auto;
    .name {
      font-size: 14px;
      color: #808896;
    }
  }
  .active {
    background-color: rgba(216, 216, 216, 0.6);
    border-radius: 4px;
    .name {
      color: #333333;
    }
  }
  .bottom-box {
    height: 88px;
    background: rgba(255, 255, 255, 0.8);
    position: fixed;
    width: 100%;
    bottom: 0;
    padding: 8px;

    .btn {
      width: 240px;
      height: 42px;
      opacity: 1;
      background: #2574f0;
      border-radius: 6px;
      color: #ffffff;
      font-size: 16px;
      border: none;
      margin: 0 auto;
      display: block;
      position: relative;
    }
    .icon-pic {
      width: 16px;
      height: 16px;
      margin-right: 4px;
      vertical-align: middle;
      position: relative;
      top: -2px;
    }
  }
  .down-pic {
    width:100%;
    height: 88px;
    position: fixed;
    left:0;
    bottom:0;
    opacity: 0;
    z-index: 20;
    // -webkit-touch-callout: default !important;
  }

  .yd {
    color: #2574f0;
  }

  .sd {
    color: #4ccec7;
  }

  .cd {
    color: #ea933c;
  }

  .zt {
    color: #97a637;
  }

  .kg {
    color: #e85d50;
  }

  .qj {
    color: #9759c8;
  }

  .search-box {
    width: 64px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background: rgba(37, 116, 240, 0.10);
    border-radius: 6px;
    color: #2574f0;
    font-size: 12px;

    .icon-search {
      width: 12px;
      height: 12px;
      margin-right: 4px;
      vertical-align: middle;
    }
  }
</style>
