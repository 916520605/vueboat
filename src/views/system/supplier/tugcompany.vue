<template>
  <div v-loading="loading"
       element-loading-text="加载中"
       element-loading-spinner="el-icon-loading">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司编码" prop="companyCode">
        <el-input
          v-model="queryParams.companyCode"
          placeholder="请输入公司编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        <el-button type="success" icon="el-icon-plus" size="small" @click="addCompany">新增</el-button>
      </el-form-item>
    </el-form>


    <el-card class="box-card" v-for="item in data" :key="item.tugCompanyId" style="margin-top:40px;width: 60% "
    >
      <el-descriptions class="margin-top" :title="item.companyName" :column="4" border direction="vertical">
        <template slot="extra">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="update(item)">修改</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteById(item)">删除</el-button>
          <el-button type="info" size="small" icon="el-icon-chat-line-square" @click="getmore(item)">更多</el-button>
        </template>
        <el-descriptions-item labelStyle="width: 150px;text-align:center" contentStyle="width: 250px;text-align:center">
          <template slot="label">
            <i class="el-icon-suitcase-1"></i>
            公司名称
          </template>
          {{ item.companyName }}
        </el-descriptions-item>
        <el-descriptions-item labelStyle="width: 150px;text-align:center" contentStyle="width: 250px;text-align:center">
          <template slot="label">
            <i class="el-icon-postcard"></i>
            公司编码
          </template>
          {{ item.companyCode }}
        </el-descriptions-item>
        <el-descriptions-item labelStyle="width: 150px;text-align:center" contentStyle="width: 250px;text-align:center">
          <template slot="label">
            <i class="el-icon-time"></i>
            更新时间
          </template>
          <span v-if="item.updateTime!=null">{{ item.updateTime }}</span>
          <span v-else>暂无信息</span>
        </el-descriptions-item>

        <el-descriptions-item labelStyle="width: 150px;text-align:center" contentStyle="width: 250px;text-align:center">
          <template slot="label">
            <i class="el-icon-date"></i>
            创建时间
          </template>
          {{ item.creatTime }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
<!--更多抽屉-->
    <el-drawer
      :title="title"
      :visible.sync="drawer"
      size="50%">
      <div style="width: 80%;margin: 0 auto">


        <el-button type="success" icon="el-icon-plus" size="small" @click="addTug">新增</el-button>


        <el-table
          :data="gridData"
          border
          v-loading="girdloading"
          element-loading-text="加载中"
          element-loading-spinner="el-icon-loading"
          style="margin-top: 20px"
          >
          <el-table-column
            prop="creatTime"
            label="创建时间"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="tugName"
            label="拖轮名称"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="tugCode"
            label="拖轮代码"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit"  size="mini"
                         @click="updatetug(scope.$index, scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete"  size="mini"
                         @click="deleteByTugId(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-drawer
          :title="title1"
          :append-to-body="true"
          :before-close="handleClose2"
          :visible.sync="innerDrawer">
          <div class="demo-drawer__content" style="width: 50%;margin: 0 auto">
            <el-form :model="form1" ref="form1">
              <el-form-item label="拖轮名称" ref="tugName" prop="tugName" :label-width="formLabelWidth" :rules="[{ required:true, message: '拖轮名称不能为空'}]">
                <el-input v-model="form1.tugName" autocomplete="off" placeholder="请输入拖轮名称"></el-input>
              </el-form-item>
              <el-form-item label="拖轮编码" ref="tugCode" prop="tugCode" :label-width="formLabelWidth" :rules="[{ required:true, message: '拖轮编码不能为空'},{pattern:/^[A-Za-z0-9]+$/,message:'拖轮编码必须是字母或数字组合'}]">
                <el-input v-model="form1.tugCode" autocomplete="off" placeholder="请输入拖轮编码"></el-input>
              </el-form-item>

              <div style="text-align: center" >
                <el-form-item>
                <el-button type="primary" @click="onSubmit1('form1')" :loading="commitloading">{{ commitloading ? '提交中 ...' : '确 定' }}</el-button>
                <el-button @click="cancelForm1">取 消</el-button>
                </el-form-item>
              </div>

            </el-form>

          </div>
        </el-drawer>
      </div>
    </el-drawer>
<!--新增抽屉和修改-->
    <el-drawer
      :title="title"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      :wrapperClosable="false"
    >
      <div class="demo-drawer__content" style="width: 50%;margin: 0 auto">
        <el-form :model="form" ref="form">
          <el-form-item label="公司名称" ref="companyName" prop="companyName" :label-width="formLabelWidth" :rules="[{ required:true, message: '公司名称不能为空'}]">
            <el-input v-model="form.companyName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="公司编码" ref="companyCode" prop="companyCode" :label-width="formLabelWidth" :rules="[{ required:true, message: '公司编码不能为空'},{pattern:/^[a-zA-Z]+$/,message:'公司编码必须是英文字母'}]">
            <el-input v-model="form.companyCode" autocomplete="off"></el-input>
          </el-form-item>
          <div style="text-align: center" >
            <el-button type="primary" @click="onSubmit('form')" :loading="commitloading">{{ commitloading ? '提交中 ...' : '确 定' }}</el-button>
            <el-button @click="cancelForm">取 消</el-button>
          </div>
        </el-form>

      </div>
    </el-drawer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "tugcompany",
  data() {
    return {
      data: [{
        companyName: '',
        companyCode: '',
        updateTime: ''
      }],
      pageNum: 1, //当前页
      pageSize: 5,//每一页多少条
      total: 0,//总页数
      showSearch: true,
      queryParams: {
        companyCode: '',
        companyName: ''
      },
      loading: false,
      girdloading:false,
      drawer: false,
      innerDrawer: false,
      title:'',
      title1:'',
      gridData:[],
      dialog:false,
      formLabelWidth:'80px',
      timer:null,
      form:{},
      commitloading:false,
      form1:{},
      id:'',//全局公司id
      middle:{}
    }
  },
  created() {
    this.getAll()
  },
  mounted() {

  },
  methods: {
    deleteByTugId(index,row){
      this.$confirm('此操作将永久删除该信息, 是否继续?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(()=>{
        console.log(row)
        setTimeout(()=>{
          axios.delete('/tug/delete?tugId='+row.tugId).then(res=>{
            if (res.data.status==200){
              this.$message.success("删除成功")
            }else {
              this.$message.error("删除失败")
            }
            console.log(res)
            this.getmore(this.middle)
          }).catch(error=>{
            this.$router.push({
              path: "404error"//要跳转的页面的路由
            });
          })
        },500)
      })

    },
    handleClose2(){
      this.innerDrawer=false
      this.form1.tugId=undefined
      this.$refs['form1'].resetFields()
    },
    addTug(){
      this.innerDrawer=true
      this.title1='新增拖轮'
    },
    update(item){
      this.dialog=true
      this.title='修改公司'
      axios.get("/tugCompany/selectById?tugCompanyId="+item.tugCompanyId).then(res=>{
        this.form=res.data.data

      }).catch(error=>{
        this.$router.push({
          path: "404error"//要跳转的页面的路由
        });
      })
    },
    deleteById(item){
      this.$confirm('此操作将同步删除该公司名下的拖轮, 是否继续?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(()=>{
        this.loading=true
        setTimeout(()=>{
          axios.delete('/tugCompany/delete?tugCompanyId='+item.tugCompanyId).then(res=>{
            if (res.data.status=200){
              this.$message.success("删除成功")
              this.loading=false
              this.getAll()
            }else {
              this.$message.error(res.data.message)
              this.loading=false
            }
          }).catch(error=>{
            if (error.status=500){
              this.$router.push({
                path: "500error"//要跳转的页面的路由
              });
            }else {
              this.$router.push({
                path: "404error"//要跳转的页面的路由
              });
            }
          })
        },500)
      })
    },
    handleClose(){
      this.dialog=false
      this.form.tugCompanyId=undefined
      this.$refs['form'].resetFields()
    },
    addCompany(){
      this.dialog=true
      this.title='新增公司'
    },
    onSubmit(form){
      this.form.companyCode=this.form.companyCode.toUpperCase()
      this.$refs[form].validate((valid) => {
        if (valid){
          this.commitloading=true
          setTimeout(()=>{
            axios.post("/tugCompany/insertOrUpdate",this.form).then(res=>{

              this.commitloading=false
              this.dialog=false
              this.$message.success(res.data.message)
              this.getAll()
              this.$refs['form'].resetFields()
              this.form.tugCompanyId=undefined
            }).catch(error=>{
              if (error.status=500){
                this.$router.push({
                  path: "500error"//要跳转的页面的路由
                });
              }else {
                this.$router.push({
                  path: "404error"//要跳转的页面的路由
                });
              }
            })
          },500)
        }
      })
    },
    onSubmit1(form1){
      console.log(this.id)
      this.form1.tugCode=this.form1.tugCode.toUpperCase()
      this.form1.tugCompanyId=this.id
      this.$refs[form1].validate((valid)=>{
        if (valid){
          this.commitloading=true
          axios.post('/tug/updateOrAdd',this.form1).then(res=>{
            console.log(res)
            this.commitloading=false
            this.$message.success(res.data.message)
            this.innerDrawer=false
            this.$refs["form1"].resetFields()
            this.getmore(this.middle)
            this.form1.tugId=undefined
          }).catch(error=>{
            this.$router.push({
              path: "404error"//要跳转的页面的路由
            });
          })
        }
      })
    },
    updatetug(index,row){
      console.log(row)
      this.girdloading=true
      setTimeout(()=>{
        axios.get('/tug/selectByTugId?tugId='+row.tugId).then(res=>{
          this.innerDrawer=true
          this.title1='修改拖轮'
          console.log(res)
          this.form1=res.data.data
          this.girdloading=false

        }).catch(error=>{
          this.$router.push({
            path: "404error"//要跳转的页面的路由
          });
        })
      },500)

    },
    cancelForm() {
      this.commitloading = false;
      this.dialog = false;
      clearTimeout(this.timer);
      this.$refs['form'].resetFields()
    },
    cancelForm1(){
      this.$refs['form1'].resetFields()
      this.innerDrawer=false
    },

    getmore(item){
      this.drawer=true
     this.title=item.companyName
      this.id=item.tugCompanyId
      this.middle=item
      this.girdloading=true
      setTimeout(()=>{
        axios.get("/tug/list/"+item.tugCompanyId).then(res=>{
          console.log(res)
          this.gridData=res.data.data

          this.girdloading=false
        }).catch(error=>{
          this.$router.push({
            path: "404error"//要跳转的页面的路由
          });
        })
      },500)
    },
    handleQuery() {
      this.getAll()
      this.pageNum = 1

    },
    resetQuery() {
      this.queryParams.companyCode = null
      this.queryParams.companyName = null
      this.getAll()
    },
    getAll() {
      this.loading = true
      setTimeout(() => {
        axios.post("/tugCompany/list/" + this.pageNum + '/' + this.pageSize, this.queryParams).then(res => {
          console.log(res)
          this.data = res.data.data.list
          this.total = res.data.data.total
          this.loading = false
        }).catch(error => {
          this.$router.push({
            path: "404error"//要跳转的页面的路由
          });
        })
      }, 500)
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
  },
}
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}
</style>
