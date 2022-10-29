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
      style="width: 100%"
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="船名">
              <span>{{ props.row.shipName }}</span>
            </el-form-item>
            <el-form-item label="IMO号">
              <span>{{ props.row.imo }}</span>
            </el-form-item>
            <el-form-item label="呼号">
              <span>{{ props.row.callNumber }}</span>
            </el-form-item>
            <el-form-item label="国籍">
              <span>{{ props.row.nationality }}</span>
            </el-form-item>
            <el-form-item label="建成日期">
              <span>{{ props.row.builtDate }}</span>
            </el-form-item>
            <el-form-item label="船长">
              <span>{{ props.row.length }}</span>
            </el-form-item>
            <el-form-item label="船宽">
              <span>{{ props.row.width }}</span>
            </el-form-item>
            <el-form-item label="总吨">
              <span>{{ props.row.grossTonnage }}</span>
            </el-form-item>
            <el-form-item label="净吨">
              <span>{{ props.row.netTons }}</span>
            </el-form-item>
            <el-form-item label="载重吨">
              <span>{{ props.row.DWT }}</span>
            </el-form-item>
            <el-form-item label="船籍港">
              <span>{{ props.row.homePort }}</span>
            </el-form-item>
            <el-form-item label="电话（海卫通）">
              <span>{{ props.row.phoneNumber }}</span>
            </el-form-item>
            <el-form-item label="船东">
              <span>{{ props.row.shipOwner }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="船名"
        prop="shipName">
      </el-table-column>
      <el-table-column
        label="IMO号"
        prop="imo">
      </el-table-column>
      <el-table-column
        label="国籍"
        prop="nationality">
      </el-table-column>
      <el-table-column
        label="船东"
        prop="shipOwner">
      </el-table-column>
      <el-table-column
        label="录入时间"
        prop="creatTime">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-tooltip content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle size="mini"
                       @click="deleteByIds(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
                       @click="update(scope.$index, scope.row)"></el-button>
          </el-tooltip>
        </template>
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
      gridData:[{}],
      tableData:[{}],
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
      this.dialogTableVisible=false
      this.tableData.push(row)
    }
  },
}
</script>

<style scoped>

</style>
