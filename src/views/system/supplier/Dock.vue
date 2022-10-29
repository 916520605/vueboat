<template>
  <div>
    <!--查询部分    -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="码头名称" prop="dockName">
        <el-input
          v-model="queryParams.dockName"
          placeholder="请输入码头名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="码头编码" prop="dockCode">
        <el-input
          v-model="queryParams.dockCode"
          placeholder="请输入码头编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>

    </el-form>
    <!--   中间按钮   -->
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
    </el-row>
    <!--  数据部分-->
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="39">
      </el-table-column>
      <el-table-column
        align="center"
        prop="dockName"
        label="码头名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="dockCode"
        label="码头编码">
      </el-table-column>
      <el-table-column
        align="center"
        prop="portName"
        label="泊位名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="portCode"
        label="泊位编码">
      </el-table-column>
      <el-table-column
        align="center"
        prop="portDraft"
        label="吃水">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-tooltip content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteByIds(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="update(scope.$index, scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>
    <!--    分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total,sizes, prev, pager, next"
      :total="total">
    </el-pagination>
    <!-- 修改弹出框   -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="modal"
      width="20%"
      :before-close="close"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="码头管理">
          <el-form ref="form" :model="form"  >
            <el-form-item label="码头名称" prop="dockName" :rules="[
      { required:true, message: '码头名称不能为空'}
    ]">
              <el-input v-model="form.dockName"></el-input>
            </el-form-item>
            <el-form-item label="码头编码" ref="dockCode" prop="dockCode" :rules="[{ required:true, message: '码头编码不能为空'},{pattern:/^\d+$/,message:'码头编码必须为数字'}]">
              <el-input v-model="form.dockCode" @blur="inputBlur"></el-input>
            </el-form-item>
            <el-form-item label="泊位名称" ref="portName" prop="portName">
              <el-input v-model="form.portName"></el-input>
            </el-form-item>
            <el-form-item label="泊位编码" ref="portCode" prop="portCode" :rules="[{ required:true, message: '泊位编码不能为空'},{pattern:/^\d+$/,message:'码头编码必须为数字'}]">
              <el-input v-model="form.portCode" @blur="inputBlur1"></el-input>
            </el-form-item>
            <el-form-item label="泊位吃水" ref="portDraft" prop="portDraft">
              <el-input v-model="form.portDraft"></el-input>
            </el-form-item>

            <div style="text-align: center">
              <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="新增泊位">
          <el-form ref="form1" :model="form1"  >
            <el-form-item label="码头名称" >
              <el-input v-model="form1.dockName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="码头编码" >
              <el-input v-model="form1.dockCode" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="泊位名称" prop="portName">
              <el-input v-model="form1.portName"></el-input>
            </el-form-item>
            <el-form-item label="泊位编码" prop="portCode" ref="portCode1" :rules="[{ required:true, message: '码头编码不能为空'},{pattern:/^\d+$/,message:'码头编码必须为数字'}]">
              <el-input v-model="form1.portCode" @blur="inputBlur2"></el-input>
            </el-form-item>
            <el-form-item label="泊位吃水" prop="portDraft" ref="portDraft">
              <el-input v-model="form1.portDraft"></el-input>
            </el-form-item>

            <div style="text-align: center">
              <el-form-item>
                <el-button type="primary" @click="onSubmit1('form1')">保存</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

      </el-tabs>


    </el-dialog>
<!--    是否继续新增泊位弹窗框-->
    <el-dialog
      :visible.sync="dialogVisible1"
      :close-on-click-modal="modal1"
      width="20%"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="新增泊位">
          <el-form ref="form1" :model="form1"  >
            <el-form-item label="码头名称" >
              <el-input v-model="form1.dockName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="码头编码" >
              <el-input v-model="form1.dockCode" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="泊位名称" prop="portName">
              <el-input v-model="form1.portName"></el-input>
            </el-form-item>
            <el-form-item label="泊位编码" prop="portCode" ref="portCode1" :rules="[{ required:true, message: '码头编码不能为空'},{pattern:/^\d+$/,message:'码头编码必须为数字'}]">
              <el-input v-model="form1.portCode" @blur="inputBlur2"></el-input>
            </el-form-item>
            <el-form-item label="泊位吃水" prop="portDraft" ref="portDraft">
              <el-input v-model="form1.portDraft"></el-input>
            </el-form-item>

            <div style="text-align: center">
              <el-form-item>
                <el-button type="primary" @click="onSubmit1('form1')">保存</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>

      </el-tabs>


    </el-dialog>
<!--    新增码头弹窗-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible2"
      :close-on-click-modal="modal"
      width="20%"
      :before-close="close"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="码头管理">
          <el-form ref="form" :model="form"  >
            <el-form-item label="码头名称" prop="dockName" :rules="[
      { required:true, message: '码头名称不能为空'}
    ]">
              <el-input v-model="form.dockName"></el-input>
            </el-form-item>
            <el-form-item label="码头编码" ref="dockCode" prop="dockCode" :rules="[{ required:true, message: '码头编码不能为空'},{pattern:/^\d+$/,message:'码头编码必须为数字'}]">
              <el-input v-model="form.dockCode" @blur="inputBlur"></el-input>
            </el-form-item>
            <el-form-item label="泊位名称" ref="portName" prop="portName">
              <el-input v-model="form.portName"></el-input>
            </el-form-item>
            <el-form-item label="泊位编码" ref="portCode" prop="portCode" :rules="[{ required:true, message: '泊位编码不能为空'},{pattern:/^\d+$/,message:'码头编码必须为数字'}]">
              <el-input v-model="form.portCode" @blur="inputBlur1"></el-input>
            </el-form-item>
            <el-form-item label="泊位吃水" ref="portDraft" prop="portDraft">
              <el-input v-model="form.portDraft"></el-input>
            </el-form-item>

            <div style="text-align: center">
              <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                <el-button @click="cancel1">取消</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>


      </el-tabs>


    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dock",
  data() {
    return {
      queryParams: {
        dockCode: '',
        dockName: '',
      },
      showSearch: true,
      tableData: [],
      pageNum: 1, //当前页
      pageSize: 5,//每一页多少条
      total: 0,//总页数
      rowSpanArr: [], //声明一个数组合并行
      loading: true,
      position: 0,
      single: true, //修改按钮默认是false，只有是一个的时候才是true
      multiple: true,//多选选中情况下是true，否则为true
      multipleSelection: [], //多选列表
      ids: [],
      dialogVisible:false,//修改和新增
      dialogVisible1:false,//继续新增泊位弹出框
      dialogVisible2:false, //新增码头弹窗框
      form:{
        dockName: '',
        dockCode: '',
        portName:'',
        portCode:'',
        portDraft:'',

      },
      form1:{
        id:'',
        dockId: '',
        dockName: '',
        dockCode: '',
        portName:'',
        portCode:'',
        portDraft:'',
      },

      title:'',
      modal:false,
      modal1:false,
    }

  },
  created() {
    this.getAll()

  },
  methods: {
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 1 || columnIndex===2) {
        //合并第一列
        const _row = this.rowSpanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row, //行
          colspan: _col //列
        };
      }

    },
    inputBlur(){
          axios.get("/dock/unique/" + this.form.dockCode).then((res) => {
            console.log(res)
            if (res.data !== '') {
              if (res.data.dockId != this.form.dockId) {
                this.$message.error("码头编码已存在，请重新输入")
                this.$refs['dockCode'].resetField()
              }
            }
          })
    },
    inputBlur1(){
      axios.get("/dock/uniqueP/"+this.form.portCode).then((res)=>{
        if (res.data!==''){
          if (res.data.id != this.form.id ){
            this.$message.error("泊位编码已存在，请重新输入")
            this.$refs['portCode'].resetField()
          }
        }
      })
    },
    inputBlur2(){
      axios.get("/dock/uniqueP/"+this.form1.portCode).then((res)=>{
        if (res.data!==''){
            this.$message.error("泊位编码已存在，请重新输入")
            this.$refs['portCode1'].resetField()
        }
      })
    },
    onSubmit(form){
      this.$refs[form].validate((valid) => {
          if (valid) {
            axios.post("/dock/updateOrAdd",this.form).then((res)=>{
              this.dialogVisible=false
              this.dialogVisible2=false
              this.$message.success("保存成功")
              this.$refs['form'].resetFields()
              this.getAll()

            })

          }else {
            this.$message.error("请检查表单数据是否合法")
            return false;
          }


      })
    },
    onSubmit1(form1){
      this.$refs[form1].validate((valid) => {
        if (valid) {
          axios.post("/dock/addAtUpdate",this.form1).then((res)=>{

            this.$message.success("保存成功")
            this.dialogVisible=false
            this.$refs['form1'].resetFields()
            this.getAll()


            this.$confirm('是否继续新增泊位?', '提示', {
              confirmButtonText: '继续',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.dialogVisible1=true
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消新增'
              });
              this.dialogVisible1=false
              this.$refs['form1'].resetFields()
            });







          })

        }else {
          this.$message.error("请检查表单数据是否合法")
          return false;
        }
      })
    },
    reset(){
      this.$refs['form'].resetFields() || this.$refs['form1'].resetFields()


    },
    cancel(){
      this.dialogVisible=false
      this.dialogVisible1=false
      this.reset()

    },
    cancel1(){
      this.$refs['form'].resetFields()
      this.dialogVisible2=false
      this.form.dockId=undefined
      this.form.id=undefined
    },
    close(){
      this.$refs['form'].resetFields()
      this.dialogVisible2=false
      this.dialogVisible1=false
     this.dialogVisible=false
      this.form.dockId=undefined
      this.form.id=undefined
    },
    getAll() {
      this.loading = true
      axios.post("/dock/list/" + this.pageNum + '/' + this.pageSize, this.queryParams).then((res) => {
        console.log(res)
        let list=[]
        for (let i = 0; i <res.data.length-1 ; i++) {
          list.push((res.data)[i])
        }
        this.tableData=list
        this.getRowSpan()
        this.total = res.data[res.data.length-1].total
        this.loading = false
      })
    },
    handleQuery() {
      this.pageNum = 1;
      this.getAll()
    },
    resetQuery() {
      this.queryParams.dockName = null
      this.queryParams.dockCode = null
      this.getAll()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageNum = 1;
      this.pageSize = val
      this.getAll()
      //this.getRowSpan()


    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val
      this.getAll()
      //this.getRowSpan()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = val.map(item => item.id)
      console.log(this.ids)
      this.single = val.length != 1;
      this.multiple = !val.length;
    },
    getRowSpan() {
      this.rowSpanArr = [];
      this.tableData.forEach((item, index) => {
        if (index == 0) {
          this.rowSpanArr.push(1);
          this.position = 0;
        } else {
          if (this.tableData[index].dockName == this.tableData[index - 1].dockName) {
            this.rowSpanArr[this.position] += 1; //名称相同，合并到同一个数组中
            this.rowSpanArr.push(0);
            //this.tableData[index].dockName = this.tableData[index - 1].dockName;
          } else {
            this.rowSpanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    update(index, row) {
      this.title='修改码头'
      this.dialogVisible=true
      if (row === undefined){
        axios.get("/dock/"+this.ids).then((res)=>{
          this.form=res.data
          this.form1.dockName=res.data.dockName
          this.form1.dockCode=res.data.dockCode
          this.form1.dockId=res.data.dockId
        })
      }else {
        axios.get("/dock/"+row.id).then((res)=>{
          this.form=res.data
          this.form1.dockName=res.data.dockName
          this.form1.dockCode=res.data.dockCode
          this.form1.dockId=res.data.dockId
        })
      }


    },
    addByOne() {

      this.form.dockId=undefined
      this.form.id=undefined
      this.title = '新增码头'
      this.dialogVisible2 = true

    },
    deleteByIds(index, row) {
      //console.log(index)
      // console.log(row)
      console.log(this.ids)

      // console.log(shipIds)
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (row==undefined ||row.id==undefined){
          axios.delete("/dock/delete/" + this.ids).then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getAll()
          })
        }else {
          axios.delete("/dock/delete/" + row.id).then((res) => {
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
  },
}
</script>

<style scoped>
.el-tabs--border-card{
  background: #FFF;
  border: 1px solid #DCDFE6;
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
