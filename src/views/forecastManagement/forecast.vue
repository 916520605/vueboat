<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="船舶名称" prop="shipName">
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
      <el-form-item label="航次号" prop="voyage">
        <el-input
          v-model="queryParams.voyage"
          placeholder="请输入航次号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini"  @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"

          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"

          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
          >导出</el-button>
        </el-col>

      </el-row>

    <el-table v-loading="loading" :data="tableData" @selection-change="handleSelectionChange" :header-cell-style="{
      background:'#f8f8f9'}" style="margin-top: 10px">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="船名" align="center" prop="shipName" >
        <template slot-scope="scope">
          <router-link :to="{name:'船舶信息',query:{baseShip:scope.row}}" class="link-type">
            <span>{{ scope.row.shipName }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="IMO号" align="center" prop="imo"/>
      <el-table-column label="航次" align="center" prop="voyage" />
      <el-table-column label="" align="center"  >
        <template slot-scope="scope">
          <router-link :to="{name:'预抵详情',query:{baseShip:scope.row}}" class="link-type">
            <span>更多</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--新增预抵船舶对话框-->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form :model="queryParams1" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px" >
        <el-form-item label="船名" prop="shipName">
          <el-input
            v-model="queryParams1.shipName"
            placeholder="请输入船名"
            clearable
            @keyup.enter.native="handleQuery1"
          />
        </el-form-item>
        <el-form-item label="IMO号" prop="imo">
          <el-input
            v-model="queryParams1.imo"
            placeholder="请输入IMO号"
            clearable
            @keyup.enter.native="handleQuery1"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery1">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery1">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="dataList" :header-cell-style="{background:'#f8f8f9'}" :border="true">
        <el-table-column label="船名" align="center" prop="shipName" />
        <el-table-column label="IMO号" align="center" prop="imo"/>
        <el-table-column label="国籍" align="center" prop="nationality" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-plus-outline"
              @click="add(scope.row)"
            >添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-dialog>


  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "forecast",
  data(){
    return {
      showSearch:true,
      queryParams: {},
      queryParams1:{},
      title:'',
      total:0,
      total1:0,
      open:false,
      loading:true,
      dataList:[],
      tableData:[],
      pageNum: 1,
      pageNum1:1,
      pageSize1:10,
      pageSize: 10,
      form:{},
    }
  },
  created() {
    this.getForecastList()
  },
  methods:{
    getBaseBoatList(){
      axios.post("/forecast/baseShipList?pageNum=" + this.pageNum + '&' +'pageSize='+ this.pageSize, this.queryParams1).then((res)=>{
        console.log(res)
        this.loading=false
        this.dataList=res.data.data.list
        this.total=res.data.data.total
      }).catch(()=>{
        this.$router.push({
          path: "404error"//要跳转的页面的路由
        });
      })
    },
    getInfo(row){
      console.log(row)
    },
    reset1(){

    },
    handleQuery(){
      this.getForecastList()
    },
    getForecastList(){
      axios.post("/forecast/list?pageNum="+this.pageNum1+'&'+"pageSize="+this.pageSize1,this.queryParams).then(res=>{
        this.loading=false
        this.tableData=res.data.data.list
        this.total1=res.data.data.total
      })
    },
    handleQuery1(){
      this.pageNum=1
      this.getBaseBoatList()
    },
    resetQuery1(){
      this.queryParams1={}
      this.handleQuery1()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageNum = 1;
      this.pageSize = val;
     this.getBaseBoatList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.getBaseBoatList()
    },
    resetQuery(){
      this.queryParams={}
      this.getForecastList()
    },
    handleAdd(){
      this.open=true
      this.title='新增预抵船舶'
      this.getBaseBoatList()
    },
    add(row){
      axios.get("/baseShip/"+row.id).then((res)=>{
        console.log(res)
        this.form.shipName=res.data.shipName
        this.form.imo=res.data.imo
        this.form.baseShipId = res.data.id
        this.$prompt("请输入航次",'提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
        }).then(({value})=>{
          this.form.voyage=value
          console.log(this.form)
          axios.post("/forecast/insert",this.form).then(res=>{
            if (res.data.status ==200){
              this.$message({
                type: 'success',
                message:'添加成功'
              });
              this.open=false
              this.getForecastList()
            }else {
              this.$message({
                type: 'error',
                message:'添加失败'
              });
            }

          }).catch((error)=>{
            this.$router.push({
              path: "404error"//要跳转的页面的路由
            });
          })

        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        })
      })
    },
  },
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: #337ab7;
}
</style>
