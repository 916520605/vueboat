<template>
  <div class="errPage-container">
    <el-button icon="arrow-left" class="pan-back-btn" @click="back">
      返回
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          500错误!
        </h1>
        <h2>系统繁忙，请刷新页面或稍后重试！</h2>
        <h2>网站功能正在进行升级或维护，请过一段时间再试！</h2>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link to="/">
              回首页
            </router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="500" height="500" alt="500 error.">
      </el-col>
    </el-row>
  </div>
</template>

<script>


export default {
  name: 'Page500',
  data() {
    return {
      errGif: require('@/assets/500_images/500.png') + '?' + +new Date()
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style  scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
}

.errPage-container .pan-back-btn {
  background: #008489;
  color: #fff;
  border: none !important;
}

.errPage-container .pan-gif {
  margin: 0 auto;
  display: block;
}

.errPage-container .pan-img {
  display: block;
  margin: 0 auto;
  width: 100%;
}

.errPage-container .text-jumbo {
  font-size: 60px;
  font-weight: 700;
  color: #484848;
}

.errPage-container .list-unstyled {
  font-size: 14px;
}

.errPage-container .list-unstyled li {
  padding-bottom: 5px;
}

.errPage-container .list-unstyled a {
  color: #008489;
  text-decoration: none;
}

.errPage-container .list-unstyled a:hover {
  text-decoration: underline;
}

</style>
