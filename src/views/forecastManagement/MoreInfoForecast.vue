<template>
<div>
  <el-page-header @back="goBack" content="详情页面">
  </el-page-header>


</div>
</template>

<script>
export default {
  name: "MoreInfoForecast",
  data(){
    return{

    }
  },
  created() {
    let id=this.$route.query.baseShip.id
    console.log(id)
  },
  methods:{
    goBack(){
      this.$router.back()
    }
  },
}
</script>

<style scoped>

</style>
