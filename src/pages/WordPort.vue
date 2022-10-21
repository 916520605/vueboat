<template>
<div>
  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
    <el-form-item label="港口名称" prop="portName">
      <el-input
        v-model="queryParams.portName"
        placeholder="请输入港口名称"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="港口编码" prop="portCode">
      <el-input
        v-model="queryParams.portCode"
        placeholder="请输入港口编码"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
<!--中间四个增删改查按钮-->
  <el-row :gutter="10">
    <el-col :span="1.5">
      <el-button type="primary" size="small" plain icon="el-icon-plus" @click="addByOne">新增</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button type="success" size="small" plain icon="el-icon-edit" :disabled="single" @click="update">修改
      </el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button type="danger" size="small" plain icon="el-icon-delete" :disabled="multiple" @click="deleteByIds">删除
      </el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button type="warning" size="small" plain icon="el-icon-download">导出</el-button>
    </el-col>
    <el-col :span="1.5" :offset="17">
      <el-button type="info" size="small" plain icon="el-icon-delete-solid">已删</el-button>
    </el-col>
  </el-row>
<!--中间表格数据-->
  <el-table
    :data="tableData"
    stripe
    style="width: 100%"  @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="portName"
      label="港口名称"
      width="180"
      align="center"
    >
    </el-table-column>
    <el-table-column
      prop="portCode"
      label="港口编码"
      width="180"
      align="center">
    </el-table-column>
    <el-table-column
      label="操作"
      align="center"
    >
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
  </el-table>
<!--分页  -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="pageNum"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="pageSize"
    layout="total,sizes, prev, pager, next"
    :total="total">
  </el-pagination>
<!--新增或修改弹出框  -->
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
  >
    <el-form ref="form" :model="form" label-width="120px" :inline="true"

    >
      <el-form-item label="港口名称" prop="portName" :rules="[
      { required:true, message: '港口名不能为空'}
    ]">
        <el-input v-model="form.portName"></el-input>
      </el-form-item>

      <el-form-item label="港口编码" prop="portCode" :rules="[
      { required:true, message: '港口编码不能为空'},{pattern:/^[A-Za-z]+$/, message: '港口编码必须为字母形式'}
    ]">
        <el-input type="portCode" v-model="form.portCode" @blur="inputBlur"></el-input>
      </el-form-item>

      <div style="text-align: center">
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </div>

    </el-form>
  </el-dialog>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "WordPort",
  data(){
    return{
      dialogVisible:false,
      title:'',
      ids:[],
      form:{
        portCode:'',
        portName:'',
      },
      showSearch:true,
      single: true, //修改按钮默认是false，只有是一个的时候才是true
      multiple: true,//多选选中情况下是true，否则为true
      multipleSelection: [], //多选列表
      queryParams:{
        portCode:'',
        portName:'',
      },
      tableData:{

      },
      pageNum: 1, //当前页
      pageSize: 10,//每一页多少条肌理
      total: 0,//总页数
    }
  },
  created() {
    this.getAll()
  },
  methods:{
    getAll(){
      axios.post("http://localhost:8080/wordPort/list/"+this.pageNum+'/'+this.pageSize,this.queryParams).then((res)=>{
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = val.map(item => item.id)
      console.log(this.ids)
      this.single = val.length != 1;
      this.multiple = !val.length;
    },
    handleQuery(){
      this.getAll()
      this.pageNum=1
    },
    rest(){
      this.form.portCode=null
      this.form.portName=null
      this.form.id=null
    },
    resetQuery(){
      this.queryParams.portCode=null
      this.queryParams.portName=null
      this.getAll()
    },
    addByOne(){
      this.rest()
      this.dialogVisible=true
    },
    inputBlur(form){
      if (this.form.id==null){
        axios.get("http://localhost:8080/wordPort/unique/"+this.form.portCode.trim().toUpperCase()).then((res)=>{
          console.log(res)
          if (res.data!=''){
            this.$message.error("港口编码已存在,请重新输入！")
            this.form.portCode=null
          }
        })
      }else {
        axios.get("/wordPort/UniqueInEdit/"+this.form.portCode+'/'+this.form.id).then((res)=>{
          console.log(res)
          if (res.data != '') {
            if (res.data.id != this.form.id) {
              this.$message.error("港口编码已存在，请重新输入")
              this.form.portCode = null
            }
          }
        })
      }
    },
    onSubmit(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.portCode=this.form.portCode.toUpperCase()
        axios.post("/wordPort/insertOrUpdate",this.form).then((res)=>{
          console.log(res)
          this.$message.success("保存成功")
          this.dialogVisible=false
          this.getAll()
          this.rest()

        })

        }else {
          this.$message.error("请检查表单数据是否合法")
          return false;
        }
      })
    },
    cancel(){
      this.dialogVisible=false
      this.rest()
    },
    update(index, row){
      this.title = '修改港口'
      this.dialogVisible = true
      if (row===undefined){
        axios.get("/wordPort/"+this.ids).then((res)=>{
          console.log(res)
          this.form=res.data
        })
      }else {
        axios.get("/wordPort/"+row.id).then((res)=>{
         // console.log(res)
          this.form=res.data
        })
      }

    },
    deleteByIds(index,row){
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (row==undefined ||row.id==undefined){
          axios.delete("/wordPort/delete/" + this.ids).then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getAll()
          })
        }else {
          axios.delete("/wordPort/delete/" + row.id).then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getAll()
          })
        }


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  }
}
</script>

<style scoped>

</style>
