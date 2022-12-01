<template>
  <el-container style="height:100% ">

    <el-aside width="200px"  >
      <div class="main">
      <el-row class="tac">
        <el-col >
      <el-menu
        router
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"

        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="home">
          <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">首页</span>
          </template>
        </el-menu-item>
        <el-menu-item index="baseboat">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">船舶信息</span>
          </template>
        </el-menu-item>
        <el-submenu index="inPortManagement">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span >进港管理</span>
          </template>
            <el-menu-item index="forecastManagement" >预报管理</el-menu-item>
            <el-menu-item index="AllBoat" >确报管理</el-menu-item>
        </el-submenu>
        <el-submenu index="atPortManagement">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span >在港管理</span>
          </template>
          <el-menu-item index="inPortManagement" >预报管理</el-menu-item>
          <el-menu-item index="AllBoat" >确报管理</el-menu-item>
        </el-submenu>
        <el-submenu  index="system">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span >系统管理</span>
          </template>
          <el-menu-item index="nationality" >国籍管理</el-menu-item>
          <el-menu-item index="wordPort" >港口管理</el-menu-item>
          <el-menu-item index="dictionary" >字典管理</el-menu-item>
          <el-submenu index="supplier">
            <template slot="title">
              <span >供应商管理</span>
            </template>
            <el-menu-item index="pilotsation">引航站</el-menu-item>
            <el-menu-item index="tugcompany">拖轮公司</el-menu-item>
            <el-menu-item index="dock">码头</el-menu-item>

          </el-submenu>
          <el-menu-item index="delegation">委托方管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
        </el-col>
      </el-row>
      </div>
    </el-aside>

    <el-container>
      <el-header style="text-align: center; font-size: 16px">
        <span class="one">欢迎来到朱哥船舶管理系统 </span>
      </el-header>
      <Breadcrumb></Breadcrumb>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'

export default {
  name: "Index",
  components:{
    Breadcrumb
  },
  methods:{
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

  }
}
</script>

<style scoped >
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
.el-menu{
  border-right: solid 0 #e6e6e6;
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
  background-color: #FFF;
}

.el-aside{
  height: 100%;

  z-index: 100001;
}
.main{
  width: 200px;
  height: 100%;
  background-color:#545c64 ;
  position: fixed;
  left: 0;
}

.one{
  text-align: left;
}
.two{
  text-align: right;
}
.el-menu-item, .el-submenu__title{
  height: 60px;
  line-height: 56px;
  position: relative;
  -webkit-box-sizing: border-box;
  white-space: nowrap;
  list-style: none;
}

</style>
