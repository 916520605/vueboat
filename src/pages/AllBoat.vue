<template>
  <div class="app-container">
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
          rules="rules"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="航次" prop="shipNumber">
        <el-input
          v-model="queryParams.shipNumber"
          placeholder="请输入航次"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="时间" prop="shipNumber">

        <el-date-picker
          v-model="queryParams.shipArriveTime"
          type="datetime"
          default-time="00:00:00"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="预抵日期">
        </el-date-picker>
        <span>-</span>
        <el-date-picker
          v-model="queryParams.shipLeaveTime"
          type="datetime"
          default-time="23:59:59"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="预离日期">
        </el-date-picker>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table  :data="tableData" stripe >
      <el-table-column prop="shipName" label="船名" >
      </el-table-column>
      <el-table-column prop="shipNumber" label="航次">
      </el-table-column>
      <el-table-column prop="imo" label="IMO号">
      </el-table-column>
      <el-table-column prop="callNumber" label="呼号">
      </el-table-column>
      <el-table-column prop="shipArriveTime" label="预抵日期" width="160">
      </el-table-column>
      <el-table-column prop="shipLeaveTime" label="预离日期" width="160">
      </el-table-column>
      <el-table-column prop="length" label="船长">
      </el-table-column>
      <el-table-column prop="width" label="船宽">
      </el-table-column>
      <el-table-column prop="draftWater" label="吃水">
      </el-table-column>
      <el-table-column prop="shipOwner" label="船东" width="190">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pageSize"
      layout="total,sizes, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>



</template>
  <script>
        import axios from "axios";

    export default {
        name:'AllBoat',
        data() {
      return {

        tableData:[{
        }],
        input: '',
        queryParams:{
          shipName:'',
          shipNumber:'',
          imo:'',
          shipArriveTime:'',
          shipLeaveTime:''
        },
        showSearch:true,
        pageNum: 1, //当前页
        pageSize: 1,//每一页多少条肌理
        total:0 //总页数

      };


    },
    created() {
          this.getAll()


    },
      methods: {

        getAll(){
          this.loading=true
           axios.post('http://localhost:8080/boat/list/'+this.pageNum+'/'+this.pageSize,this.queryParams).then((res)=>{
            console.log(res)
            this.tableData=res.data.list
             this.total=res.data.total

           })
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.pageNum = 1;
          this.pageSize = val;
          this.getAll()

        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.pageNum = val;
          this.getAll()
        },
        handleQuery(){
          if (this.queryParams.shipArriveTime>this.queryParams.shipLeaveTime){
            this.$alert("预离时间不能小于预抵时间!")
          }else {

            console.log(this.queryParams.shipArriveTime)
            this.pageNum=1
            this.getAll()
          }

        },
        resetQuery(){
          this.queryParams.shipName=null
          this.queryParams.imo=null
          this.queryParams.value=null
          this.queryParams.shipNumber=null
          this.queryParams.shipArriveTime=null
          this.queryParams.shipLeaveTime=null
          this.getAll()
        }
      }
    }
  </script>
  <style scoped>
  .el-form--inline .el-form-item{
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
    margin-left: -40px;
  }
  .el-button--mini, .el-button--mini.is-round{
    margin-left: 40px;
  }
  .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{
    line-height: 32px;
    margin-left: -3px;
  }
  </style>
