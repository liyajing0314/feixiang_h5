<template>
  <div class="container">
    <div class="head" @click="changeTime">2021年6月
      <img src="@/assets/images/icon_change.png"
        srcset='../../assets/images/icon_change.png 1x,
                 ../../assets/images/icon_change@2x.png 2x' class="icon-change"/>
    </div>
    <div ref="content">
      <table class="reort-table" >
        <thead>
          <tr>
            <th><div class="search-box" @click="changePeople"> <img src="@/assets/images/task/icon_search@2x.png" class="icon-search"/>查找人</div></th>
            <th class="yd">应到</th>
            <th class="sd">实到</th>
            <th class="cd">迟到</th>
            <th class="zt">早退</th>
            <th class="kg">矿工</th>
            <th class="qj">请假</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in 50" :class="{'active':index=== 2}">
            <td><span class="name">盖玲{{index}}</span></td>
            <td>25</td>
            <td>0</td>
            <td>1</td>
            <td>2</td>
            <td>2</td>
            <td>2</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bottom-box">
      <van-button type="primary" class="btn"  @click="createImg">保存为图片至相册</van-button>
    </div>
    <sel-picker ref="selPicker" @selPicker="selPicker"></sel-picker>
    <select-people ref="selectPeople"></select-people>
  </div>
</template>

<script>
  import SelectPeople from '@/components/SelectPeople'
  import SelPicker from '@/components/SelPicker'
  import {attendanceReport} from '@/api/kanban'
  import html2canvas from 'html2canvas'
  export default {
    components:{SelPicker,SelectPeople},
    data(){
      return{
        month:'2017-07',
        list:[]
      }
    },
    mounted() {
      // this.getData()
    },
    methods:{
      getData(){
        let param ={
          pid:22,
          recordDate:this.month
        }

        attendanceReport(param).then(res=>{
          if(res.code === 200){
            this.list = res.data
          }else{
            this.list = []
          }
        })
      },
      changeTime(){
        this.$refs.selPicker.showPopup()
      },
      selPicker(val){
        this.month = val
        this.getData()
      },
      changePeople(){
        this.$refs.selectPeople.showPopup()
      },
      createImg(){
        let content = this.$refs.content
        let scrollHeight = content.scrollHeight
        let scrollWidth = content.scrollWidth
        html2canvas(content,{
            scale: window.devicePixelRatio*2,
            useCORS: true , //开启跨域配置，但和allowTaint不能共存
            width:scrollWidth,
            height:scrollHeight,
            windowWidth:scrollWidth,
            windowHeight:scrollHeight,
            x:0,
            y:0
          }).then((canvas) => {
            this.operType = 'edit'
            let dataURL = canvas.toDataURL("image/jpg");
            let link = document.createElement("a");
            link.href = dataURL;
            let filename = `${new Date().getTime()}.jpg`;  //文件名称
            link.setAttribute("download", filename);
            link.style.display = "none"; //a标签隐藏
            document.body.appendChild(link);
            link.click();
          })
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    background-color: #FFFFFF;
    min-height:100vh;
    padding-top: 50px;
  }
  .head {
    background-color: #ffffff;
    padding: 16px;
    width: 100%;
    position: fixed;
    top:0;
    font-size: 16px;
    font-weight: 600;
    .icon-change {
      width:16px;
      height:16px;
      margin-left: 4px;
    }
  }
  .reort-table {
    width:100%;
    border-collapse: collapse;
    border-spacing: 0;
    text-align: center;
    margin-bottom: 80px;
    td ,th {
      padding: 8px 10px;
      font-weight: 400;
    }
    thead {
      position: sticky;
      width: 100%;
      top:48px;
      background-color: #ffffff;
      font-size: 14px;
      th {
        border-bottom: 1px solid rgba(151,151,151,0.1);
      }
    }
    tbody {
      font-size: 16px;
    }
    .name {
      font-size: 14px;
      color: #808896;
    }
  }
  .active {
    td {
      background-color: rgba(216,216,216,0.6);
      &:first-of-type {
        border-radius: 4px 0 0 4px;
      }
      &:last-of-type {
        border-radius: 0 4px 4px 0;
      }
    }
    .name {
      color:#333333;
    }
  }
  .bottom-box {
    height: 88px;
    background: rgba(255,255,255,0.8);
    position: fixed;
    width: 100%;
    bottom:0;
    padding: 8px;
    .btn {
      width: 240px;
      height: 42px;
      opacity: 1;
      background: #2574f0;
      border-radius: 6px;
      color: #ffffff;
      font-size: 16px;
      border:none;
      margin: 0 auto;
      display: block;
    }
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
    background: rgba(37,116,240,0.10);
    border-radius: 6px;
    color: #2574f0;
    font-size: 12px;
    .icon-search {
      width:12px;
      height:12px;
      margin-right: 4px;
      vertical-align: middle;
    }
  }
</style>
