<template>
  <div class="container">
    <van-tabs v-model="active" type="card" :sticky="true" background="#F1F3F6" title-active-color="#333333" title-inactive-color="#808896" color="#ffffff">
      <van-tab title="员工列表">
        <employee-list></employee-list>
      </van-tab>
      <van-tab title="异常定位列表">
        <exception-locating-list></exception-locating-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import ExceptionLocatingList from './components/exceptionLocatingList'
  import EmployeeList from './components/employeeList'
  export default {
    components:{EmployeeList,ExceptionLocatingList},
    data(){
      return{
        active:0
      }
    }
  }
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 12px;
}
.titleClass {

}
/deep/.van-tabs__wrap {
  background-color: #F1F3F6;
  height:42px;
  border-radius: 4px;
}
/deep/.van-tabs__nav--card {
  height:36px;
  border:none;
  margin:3px 3px;
  border-radius: 4px;
  font-size: 14px;
}
/deep/.van-tab.van-tab--active{
  border-radius: 4px;
  font-weight: 600;
}
</style>
