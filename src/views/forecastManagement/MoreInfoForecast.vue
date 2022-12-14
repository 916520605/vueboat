<template>
  <div>
    <el-page-header @back="goBack" content="详情页面" style="margin-bottom:50px ;"/>
    
    <el-card class="box-card" >
      
      <el-form ref="form" :model="form" :rules='rules' label-width="120px" v-show="showform">
        <el-form-item label="始发港" prop="departPort">
          <el-select v-model="form.departPort" filterable clearable placeholder="请选择港口">
            <el-option v-for="item in $store.state.wordPort" :key="item.portCode
            " :label="item.portName + '(' + item.portCode + ')'" :value="item.portCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="上一港" prop="lastPort">
          <el-select v-model="form.lastPort" filterable clearable placeholder="请选择港口">
            <el-option v-for="item in $store.state.wordPort" :key="item.portCode
            " :label="item.portName + '(' + item.portCode + ')'" :value="item.portCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="下一港" prop="nextPort">
          <el-select v-model="form.nextPort" filterable clearable placeholder="请选择港口">
            <el-option v-for="item in $store.state.wordPort" :key="item.portCode
            " :label="item.portName + '(' + item.portCode + ')'" :value="item.portCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="预抵时间" prop="poreArriveTime">
          <el-date-picker v-model="form.poreArriveTime" type="datetime" placeholder="选择预抵日期" align="right"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预离时间" prop="poreLeaveTime">
          <el-date-picker v-model="form.poreLeaveTime" type="datetime" placeholder="选择预离日期" align="right"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="靠泊码头及泊位">
          <el-select v-model="form.dock"  filterable clearable placeholder="请选择码头" style="width:120px ;" @focus="getDocks"
            @change="changeport">
            <el-option v-for="item in $store.state.dock" :key="item.dockId
            " :label="item.dockName" :value="item.dockId" />
          </el-select>
          <el-select v-model="form.port"  v-show="form.dock!=''"  clearable placeholder="请选择泊位" style="width:120px ;">
            <el-option v-for="item in portOptions" :key="item.id
            " :label="item.portName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="来港目的" prop="purpose">
          <el-radio-group v-model="form.purpose">
            <el-radio :label="0" border>卸货</el-radio>
            <el-radio :label="1" border>装货</el-radio>
            <el-radio :label="2" border>其他</el-radio>
            <el-radio :label="3" border>修船</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="货物名称" prop="goodsName">
          <el-input v-model="form.goodsName" clearable placeholder="请输入货物名称" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="货物数量" prop="quantity">
          <template>
            <el-input-number v-model="form.quantity" :precision="3" :step="1" :min="0" placeholder="请输入货物数量"
              style="width:220px" />
          </template>
        </el-form-item>
        <el-form-item label="吃水" prop="draftWater">
          <template>
            <el-input-number v-model="form.draftWater" :precision="2" :step="1" :min="0" placeholder="请输入吃水"
              style="width:220px" />
          </template>
        </el-form-item>
        <el-form-item label="引航站" prop="pilotStation">
          <el-select v-model="form.pilotStation" multiple  filterable placeholder="请选择引航站(可多选)">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button type="info" @click="onSubmit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "MoreInfoForecast",
  data() {
    let validatorTime = (rule, value, callback) => {
     
        if (this.form.poreLeaveTime < this.form.poreArriveTime) {
          callback(new Error('预离日期必须大于或等于预抵日期'))
          this.form.poreLeaveTime = null,
          this.form.poreArriveTime = null
          
        } else {
          callback()

        }
      
        
      
      
    }
    return {
      form: {},
      portOptions: [],
      showform:false,
      rules: {
        poreLeaveTime: [{
          validator: validatorTime,  trigger: 'blur'
        }]
      }
    }
  },
  created() {
    let id = this.$route.query.baseShip
    console.log(id)
    this.getForecast(id)
    this.chufa()
    
  },
  methods: {
    chufa() {
      this.$store.dispatch('getAllPort')

    },
    getDocks() {
      this.$store.dispatch('getAllDock')

    },
    changeport() {
      axios.get('/dock/portList?dockId=' + this.form.dock).then(res => {
        console.log(res);
        this.portOptions = res.data.data
        
      })

    },
    goBack() {
      this.$router.back()
    },
    getForecast(id) {
      axios.get("/forecast/selectById?id=" + id).then(res => {
        console.log(res);
        this.form = res.data.data
      })
    },
    
  },
}
</script>

<style scoped>
.box-card {
  margin: 0 15%;
  width: 40%;
}
</style>
