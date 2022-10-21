<template>
  <el-container style="height:100% ">

    <el-aside width="200px"  >
      <div class="main">
      <el-row class="tac">
        <el-col >
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="goto"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="Welcome">
          <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">首页</span>
          </template>
        </el-menu-item>
        <el-menu-item index="BaseBoat">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">船舶信息</span>
          </template>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span >进港管理</span>
          </template>
            <el-menu-item index="forecast" >预报管理</el-menu-item>
            <el-menu-item index="AllBoat" >确报管理</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span >在港管理</span>
          </template>
          <el-menu-item index="BaseBoat" >预报管理</el-menu-item>
          <el-menu-item index="AllBoat" >确报管理</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span >系统管理</span>
          </template>
          <el-menu-item index="Nationality" >国籍管理</el-menu-item>
          <el-menu-item index="WordPort" >港口管理</el-menu-item>
          <el-menu-item index="Dock">码头管理</el-menu-item>
          <el-menu-item index="2-3">供应商管理</el-menu-item>
          <el-menu-item index="2-3">委托方管理</el-menu-item>
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
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="two">李云鹏</span>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Welcome",
  methods:{
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    goto(path){
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
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
