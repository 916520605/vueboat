<template>
<div>
  <!--搜索功能  -->
  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
    <el-form-item label="国名" prop="countryName">
      <el-input
        v-model="queryParams.countryName"
        placeholder="请输入国名"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="数字编码" prop="numberCode">
      <el-input
        v-model="queryParams.numberCode"
        placeholder="请输入数字编码"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="字母编码" prop="letterCode">
      <el-input
        v-model="queryParams.letterCode"
        placeholder="请输入字母编码"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
  <!--中间四个增删改查按钮 -->
  <el-row :gutter="10">
    <el-col :span="1.5">
      <el-button type="primary" size="small" plain icon="el-icon-plus" @click="addByOne">新增</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button type="success" size="small" plain icon="el-icon-edit" :disabled="single" @click="update">修改</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button type="danger" size="small" plain icon="el-icon-delete" :disabled="multiple" @click="deleteByIds">删除</el-button>
    </el-col>
  </el-row>
  <!--中间表格数据  -->
  <el-table  :data="tableData" stripe @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>

    <el-table-column prop="countryName" label="国名" >
    </el-table-column>
    <el-table-column prop="numberCode" label="数字编码">
    </el-table-column>
    <el-table-column prop="letterCode" label="字母编码">
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

  </el-table>
  <!--新增和修改弹出框表单  -->
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
  >
    <el-form ref="form" :model="form" label-width="120px"
             status-icon
    >
      <el-form-item label="国家名称" prop="countryName" :rules="[
      { required:true, message: '国家名称不能为空'}
    ]">
        <el-input v-model="form.countryName"></el-input>
      </el-form-item>


      <el-form-item label="数字编码" prop="numberCode" :rules="[
      { pattern:/^[0-9]{3}$/, message: '数字编码必须为3位数字值'},
      {required:true,message:'数字编码不能为空'}
    ]">
        <el-input  v-model="form.numberCode" @blur="inputBlur1"></el-input>
      </el-form-item>


      <el-form-item label="字母编码" prop="letterCode" :rules="[
      { required:true, message: '字母编码不能为空'},
      { pattern:/^[A-Z]{3}$/, message: '请输入3位大写字母'}
    ]">
        <el-input v-model="form.letterCode" @blur="inputBlur2"></el-input>
      </el-form-item>

      <div style="text-align: center">
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </div>

    </el-form>
  </el-dialog>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="pageNum"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="pageSize"
    layout="total,sizes, prev, pager, next"
    :total="total">
  </el-pagination>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "Nationality",
  data(){
    return{
      ids:[],
      single: true, //修改按钮默认是false，只有是一个的时候才是true
      multiple: true,//多选选中情况下是true，否则为true
      multipleSelection: [], //多选列表
      showSearch:true,
      dialogVisible: false,
      queryParams:{
        countryName:'',
        numberCode:'',
        letterCode:'',
      },
      tableData:[{}],
      pageNum: 1, //当前页
      pageSize: 10,//每一页多少条肌理
      total:0 ,//总页数
      title:'',
      form: {
        countryName:'',
        numberCode:'',
        letterCode:'',
      },
    }
  },
  created() {
    this.getAll()
  },
  methods:{
    getAll(){
      axios.post("http://localhost:8080/nationality/list/"+this.pageNum+'/'+this.pageSize,this.queryParams).then((res)=>{
        console.log(res)
        this.tableData=res.data.list
        this.total=res.data.total
      })
    },
    handleQuery(){
      this.pageNum = 1;
      this.getAll()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageNum = 1;
      this.pageSize = val;
      this.getAll()
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = val.map(item => item.id)
      //console.log(this.ids)
      this.single = val.length != 1;
      this.multiple = !val.length;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.getAll()
    },
    rest(){
      this.form.countryName=null
      this.form.numberCode=null
      this.form.letterCode=null
      this.form.id=undefined
    },
    resetQuery(){
      this.queryParams.countryName=null
      this.queryParams.numberCode=null
      this.queryParams.letterCode=null
      this.pageNum=1
      this.getAll()
    },
    addByOne() {
      this.title = '新增国籍信息'
      this.dialogVisible = true
      this.rest()
    },
    cancel(){
      this.dialogVisible = false
      this.rest()
    },
    inputBlur2(){
      if (this.form.id == null){
        axios.get("http://localhost:8080/nationality/uniqueLetterCode/"+this.form.letterCode.trim()).then((res)=>{
          console.log(res)
          if (res.data!=''){
            this.$message.error("字母编码已存在，请重新输入")
            this.form.letterCode = null
          }
        })
      }else {
        axios.get("http://localhost:8080/nationality/checkLetterCode/"+this.form.letterCode.trim()+'/'+this.form.id).then((res)=>{
          console.log(res)
          if (res.data != '') {
            if (res.data.id != this.form.id) {
              this.$message.error("字母编码已存在，请重新输入")
              this.form.letterCode = null
            }
          }
        })
      }
    },
    inputBlur1(){
      if (this.form.id == null){
        axios.get("http://localhost:8080/nationality/uniqueNumberCode/"+this.form.numberCode.trim()).then((res)=>{
          console.log(res)
          if (res.data!=''){
            this.$message.error("数字编码已存在，请重新输入")
            this.form.numberCode = null
          }
        })
      }else {
        axios.get("http://localhost:8080/nationality/checkNumberCode/"+this.form.numberCode.trim()+'/'+this.form.id).then((res)=>{

          if (res.data != '') {
            if (res.data.id != this.form.id) {
              this.$message.error("数字编码已存在，请重新输入")
              this.form.numberCode = null
            }
          }
        })
      }
    },

    onSubmit(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.id == undefined){
            axios.post("http://localhost:8080/nationality/add",this.form).then((res)=>{
              this.$message.success("新增成功")
              this.dialogVisible = false
              this.rest()
              this.getAll()
            })
          }else {
          axios.put("http://localhost:8080/nationality/update",this.form).then((res)=>{
            this.$message.success("修改成功")
            this.dialogVisible = false
            this.rest()
            this.getAll()
          })
          }

        }else {
          this.$message.error("请检查表单数据是否合法")
          return false;
        }
      })
    },
    update(index, row){
      this.rest()
      this.title = '修改国籍信息'
      this.dialogVisible = true
      if (row===undefined){
        axios.get("http://localhost:8080/nationality/getOne/"+this.ids).then((res)=>{
          console.log(res)
          this.form=res.data
        })
      }else {
        axios.get("http://localhost:8080/nationality/getOne/"+row.id).then((res)=>{
          console.log(res)
          this.form=res.data
        })
      }


    },
    deleteByIds(index, row){
      console.log(row)
      console.log(this.ids)

      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (row.id==undefined || row==undefined){
          axios.delete("http://localhost:8080/nationality/delete/" + this.ids).then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getAll()
          })
        }else {
          axios.delete("http://localhost:8080/nationality/delete/" + row.id).then((res) => {
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
    }
  }
}
</script>

<style scoped>

</style>
