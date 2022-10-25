<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="船名" prop="shipName">
        <el-input
          v-model="queryParams.shipName"
          placeholder="请输入船名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="IMO号" prop="imo">
        <el-input
          v-model="queryParams.imo"
          placeholder="请输入IMO号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" :disabled="this.queryParams.imo=='' && this.queryParams.shipName==''" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="船舶信息" :visible.sync="dialogTableVisible" width="30%">
      <el-table :data="gridData" border >
        <el-table-column property="shipName" label="船名" width="150" header-align="center" align="center" ></el-table-column>
        <el-table-column property="imo" label="IMO号" width="200" header-align="center" align="center"></el-table-column>
        <el-table-column  label="添加" header-align="center" align="center" >
          <template slot-scope="scope">
            <el-tooltip content="添加" placement="top">
              <el-button type="primary" icon="el-icon-plus" circle size="mini"
                         @click="add(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <div slot="empty" style="text-align: left;">
          <el-empty description="哎呀，你是不是忘记查询啦！"/>
        </div>
      </el-table>
    </el-dialog>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
      <div slot="empty" style="text-align: left;">
        <el-empty description="哎呀，你是不是忘记查询啦！"/>
      </div>
    </el-table>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "forecast",
  data(){
    return {
      showSearch:true,
      queryParams: {
        shipName: '',
        imo: '',
      },
      gridData:{},
      tableData:{},
      dialogTableVisible:false
    }
  },
  methods:{
    handleQuery(){
      this.dialogTableVisible=true
      axios.post("http://localhost:8080/baseShip/list",this.queryParams).then((res)=>{
        this.gridData=res.data

      })
    },
    resetQuery(){
      this.queryParams.imo=''
      this.queryParams.shipName=''
    },
    add(row){
      console.log(row)
    }
  },
}
</script>

<style scoped>

</style>
