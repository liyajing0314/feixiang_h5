<template>
  <div class="container" ref="container">
    <div ref="content">
      <div class="head" @click="changeTime">{{month}}
        <img src="@/assets/images/icon_change.png" srcset='../../assets/images/icon_change.png 1x,
                   ../../assets/images/icon_change@2x.png 2x'
          class="icon-change" v-show="!picFlag"/>
      </div>
      <table class="reort-table" ref="reortTable">
        <thead>
          <tr>
            <th>
              <div class="search-box" @click="changePeople" v-show="!picFlag"> <img src="@/assets/images/task/icon_search@2x.png" class="icon-search" />查找人</div>
            </th>
            <th class="yd">应到</th>
            <th class="sd">实到</th>
            <th class="cd">迟到</th>
            <th class="zt">早退</th>
            <th class="kg">矿工</th>
            <th class="qj">请假</th>
          </tr>
        </thead>
        <tbody ref="tbody">
          <tr v-for="(item,index) in list" :class="{'active':active === index}" :key="index" :ref="'anchor'+index">
            <td><span class="name">{{item.name}}</span></td>
            <td>{{item.shouldDayNum}}</td>
            <td :class="{'sd':item.actuallyDayNum < item.shouldDayNum}">{{item.actuallyDayNum}}</td>
            <td :class="{'cd':item.lateNum >0}">{{item.lateNum}}</td>
            <td :class="{'zt':item.eaveEarlyNum >0}">{{item.eaveEarlyNum}}</td>
            <td :class="{'kg':item.absenteeismNum >0}">{{item.absenteeismNum}}</td>
            <td :class="{'qj':item.leaveNum > 0}">{{item.leaveNum}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bottom-box">
      <van-button type="primary" class="btn" @click="createImg"><img src="~@/assets/images/kanban/icon_pic@2x.png"
          class="icon-pic" />保存为图片至相册</van-button>
    </div>
    <sel-picker ref="selPicker" @selPicker="selPicker"></sel-picker>
    <select-people-single ref="selectPeople" :list="list" @selPeople="selPeople"></select-people-single>
  </div>
</template>

<script>
  import {
    parseTime
  } from '@/utils/index'
  // import SelectPeople from '@/components/SelectPeople'
  import SelectPeopleSingle from '@/components/SelectPeopleSingle'
  import SelPicker from '@/components/SelPicker'
  import {
    attendanceReport
  } from '@/api/kanban'
  import html2canvas from 'html2canvas'
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
        picFlag:false
      }
    },
    mounted() {
      let time = new Date().getTime()
      this.month = parseTime(time, '{y}-{m}')

      this.getData()
      window.addEventListener('scroll', () => {
        let scrollTop = this.$refs.reortTable.scrollTop
        console.info('scrollTop', scrollTop)
      });
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
        console.info('this.$refs', this.$refs, top)
        let anchor = this.$refs['anchor'+index][0]
        let height = anchor.clientHeight * index

        console.info('height',height)
        this.$refs.tbody.scrollTo({
          top: height,
          behavior: "smooth" // 平滑滚动
        })

      },
      createImg() {
        this.picFlag = true
        this.$nextTick(()=>{
          let content = this.$refs.content
          let scrollHeight = content.scrollHeight + 200
          let scrollWidth = content.scrollWidth
          html2canvas(content, {
            scale: window.devicePixelRatio * 2,
            useCORS: true, //开启跨域配置，但和allowTaint不能共存
            width: scrollWidth,
            height: scrollHeight,
            windowWidth: scrollWidth,
            windowHeight: scrollHeight,
            x: 0,
            y: 0
          }).then((canvas) => {
            this.operType = 'edit'
            let dataURL = canvas.toDataURL("image/jpg");
            let link = document.createElement("a");
            link.href = dataURL;
            let filename = `${new Date().getTime()}.jpg`; //文件名称
            link.setAttribute("download", filename);
            link.style.display = "none"; //a标签隐藏
            document.body.appendChild(link);
            link.click();
            this.picFlag = false
            this.savePicture(dataURL)

          })
        })

      },
      saveImage(dataURL) {
        console.info('dataURL', dataURL)
        console.info(window.plus)
        if (!window.plus) return;
        plus.gallery.save(dataURL, function() {
          plus.nativeUI.alert("保存图片到相册成功");
        }, function() {
          plus.nativeUI.alert("保存失败");
        });
      },
      savePicture(imgurl) {
        var that = this;
        var b = new plus.nativeObj.Bitmap("bitblmap");
        console.log("☆☆☆☆☆☆ 保存图片到相册中");
        console.log(b);
        b.loadBase64Data(imgurl, function() {
          console.log("图片创建成功");
          var fileName = "_doc/img1.png";
          b.save(fileName, {
            overwrite: true
          }, object => {
            plus.gallery.save(fileName, () => {
              console.log("保存图片到相册成功");
            }, () => {
              console.log("保存图片到相册失败");
            });
          }, () => {
            console.log("保存失败");
          });
        }, function() {
          console.log("图片创建失败");
        });
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

  .reort-table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    text-align: center;
    margin-bottom: 90px;

    td,
    th {
      padding: 8px 10px;
      font-weight: 400;
      min-width: 48px;
    }

    thead {
      position: sticky;
      width: 100%;
      top: 48px;
      background-color: #ffffff;
      font-size: 14px;

      th {
        border-bottom: 1px solid rgba(151, 151, 151, 0.1);
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
      background-color: rgba(216, 216, 216, 0.6);

      &:first-of-type {
        border-radius: 4px 0 0 4px;
      }

      &:last-of-type {
        border-radius: 0 4px 4px 0;
      }
    }

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
