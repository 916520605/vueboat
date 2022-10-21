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
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"  style="margin-left: 40px">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="1.5">
      <el-button type="primary" size="small" plain icon="el-icon-plus" @click="addByOne">新增</el-button>
      </el-col>
      <el-col :span="1.5">
      <el-button type="success" size="small" plain icon="el-icon-edit" :disabled="single">修改</el-button>
      </el-col>
      <el-col :span="1.5">
      <el-button type="danger" size="small" plain icon="el-icon-delete" :disabled="multiple">删除</el-button>
      </el-col>
      <el-col :span="1.5">
      <el-button type="warning" size="small" plain icon="el-icon-download">导出</el-button>
      </el-col>
      <el-col :span="1.5" :offset="17">
        <el-button type="info" size="small" plain icon="el-icon-delete-solid">已删</el-button>
      </el-col>
    </el-row>
    <el-table  :data="tableData"
               stripe
               @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column prop="shipName" label="船名" align="center">
      </el-table-column>
      <el-table-column prop="shipNumber" label="航次" align="center">
      </el-table-column>
      <el-table-column prop="imo" label="IMO号" align="center">
      </el-table-column>
      <el-table-column prop="callNumber" label="呼号" align="center">
      </el-table-column>
      <el-table-column prop="shipArriveTime" label="预抵日期" width="160" align="center">
      </el-table-column>
      <el-table-column prop="shipLeaveTime" label="预离日期" width="160" align="center">
      </el-table-column>
      <el-table-column prop="length" label="船长" align="center">
      </el-table-column>
      <el-table-column prop="width" label="船宽" align="center">
      </el-table-column>
      <el-table-column prop="draftWater" label="吃水" align="center">
      </el-table-column>
      <el-table-column prop="shipOwner" label="船东" width="190" align="center">
      </el-table-column>
      <el-table-column  label="操作"  align="center" >
        <span slot-scope="scope" class="flex">
<!--          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>--><span>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"  ></el-button>
          </span>
          <span>
          <el-button type="primary" icon="el-icon-edit" circle size="mini" ></el-button>
          </span>
        </span>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total,sizes, prev, pager, next"
      :total="total">
    </el-pagination>


    <!--新增数据对话框-->
    <el-dialog title="船舶信息" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="船名" :label-width="formLabelWidth">
          <el-input v-model="form.shipName" autocomplete="off" style="width: 250px" placeholder="请输入船名"></el-input>
        </el-form-item>
        <el-form-item label="航次" :label-width="formLabelWidth">
          <el-input v-model="form.shipNumber" autocomplete="off" style="width: 250px" placeholder="请输入航次号"></el-input>
        </el-form-item>
        <el-form-item label="IMO号" :label-width="formLabelWidth">
          <el-input v-model="form.imo" autocomplete="off" style="width: 250px" placeholder="请输入IMO号"></el-input>
        </el-form-item>
        <el-form-item label="呼号" :label-width="formLabelWidth">
          <el-input v-model="form.callNumber" autocomplete="off" style="width: 250px" placeholder="请输入呼号"></el-input>
        </el-form-item>
        <el-form-item label="预抵日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.shipArriveTime"
            type="datetime"
            default-time="00:00:00"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择预抵日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预离日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.shipLeaveTime"
            type="datetime"
            default-time="23:59:59"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择预离日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name:'Management',
  data() {
    return {
      single:true, //修改按钮默认是false，只有是一个的时候才是true
      multiple:true,//多选选中情况下是true，否则为true
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
      pageSize: 10,//每一页多少条肌理
      total:0 ,//总页数
      multipleSelection: [], //多选列表
      ids:[],
      dialogFormVisible: false,
      formLabelWidth:'120px',
      form:{

      }
    };


  },
  created() {
    this.getAll()
  },
  methods: {

    getAll(){
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
        this.pageNum = 1;
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
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids =  val.map(item=>item.id)
      console.log(this.ids)
      this.single=val.length!=1;
      this.multiple = !val.length;
    },
    addByOne(){
      this.dialogFormVisible=true
    }
  }
}
</script>
<style scoped>
.el-form--inline .el-form-item{
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
  margin-left: -38px;
}


.flex{

}
</style>
