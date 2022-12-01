<template>
  <div>
  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
    <el-form-item label="公司名称" prop="companyName">
      <el-input
        v-model="queryParams.companyName"
        placeholder="请输入公司名称"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="联系人" prop="contactName">
      <el-input
        v-model="queryParams.contactName"
        placeholder="请输入联系人姓名"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="启用状态" prop="enableState">
      <el-select v-model="queryParams.enableState" placeholder="启用状态" clearable>
        <el-option
          v-for="dict in statusOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="代理状态" prop="agentState">
      <el-select v-model="queryParams.agentState" placeholder="代理状态" clearable>
        <el-option
          v-for="dict in agentOptions"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>

  <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
      >新增
      </el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
        type="success"
        icon="el-icon-edit"
        size="mini"
        :disabled="single"
        @click="handleUpdate"
      >修改
      </el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="mini"
        :disabled="multiple"
        @click="handleDelete"
      >删除
      </el-button>
    </el-col>
    <el-col :span="1.5" :offset="19">
      <el-button icon="el-icon-search" circle size="mini" @click="hidden" ></el-button>
    </el-col>
  </el-row>
    <el-table v-loading="loading"
              :header-cell-style="{background:'#f8f8f9'}"
              :data="dataList"
              element-loading-text="加载中"
              element-loading-spinner="el-icon-loading"
              @selection-change="handleSelectionChange"
              style="margin-top: 10px">
      <el-table-column type="selection" width="55" align="center"  />
      <el-table-column label="公司名称" align="center" prop="companyName" />
      <el-table-column label="组织机构代码" align="center" prop="codeOfOrganization">

      </el-table-column>
      <el-table-column label="公司性质" align="center" prop="companyNature" >
        <template slot-scope="scope" >
          <span :value="scope.row.companyNature" v-if="scope.row.companyNature==0">股份有限公司</span>
          <span :value="scope.row.companyNature" v-else >有限责任公司</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人姓名" align="center" prop="contactName" />
      <el-table-column label="联系方式" align="center" prop="phoneNumber" />
      <el-table-column label="启用状态" align="center" prop="enableState">
        <template slot-scope="scope">
          <el-tag :value="scope.row.enableState" v-if="scope.row.enableState==0">正常</el-tag>
          <el-tag :value="scope.row.enableState" v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="代理状态" align="center" prop="agentState" >
        <template slot-scope="scope">
          <el-tag :value="scope.row.agentState" v-if="scope.row.agentState==0">正常</el-tag>
          <el-tag :value="scope.row.agentState" v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
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
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body >
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="组织机构代码" prop="codeOfOrganization">
          <el-input v-model="form.codeOfOrganization" placeholder="请输入组织机构代码" />
        </el-form-item>
        <el-form-item label="公司性质" prop="companyNature">
          <el-radio-group v-model="form.companyNature">
            <el-radio
              v-for="dict in natureOptions"
              :key="dict.itemValue"
              :label="dict.itemValue"
            >{{dict.itemText}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="form.contactName"  placeholder="请输入联系人姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber">
          <el-input v-model="form.phoneNumber"  placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="启用状态" prop="enableState">
          <el-radio-group v-model="form.enableState">
            <el-radio
              v-for="dict in this.statusOptions"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="代理状态" prop="agentState">
          <el-radio-group v-model="form.agentState">
            <el-radio
              v-for="dict in this.agentOptions"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Delegation",
  data(){
    return {
      queryParams:{},
      count:0,
      ids:[],
      rules: {
        companyName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        codeOfOrganization: [
          { required: true, message: "组织机构代码不能为空", trigger: "blur" }
        ],
        contactName: [
          { required: true, message: "联系人姓名不能为空", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "联系人电话不能为空", trigger: "blur" }
        ]
      },
      dataList:[],
      page:1,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      open:false,
      form:{},
      title:'',
      total:0,
      pageSize:5,
      loading:true,
      showSearch:true,
      natureOptions:[{
        itemText:'股份有限公司',
        itemValue: 0
      },{
        itemText:'有限责任公司',
        itemValue: 1
      }],
      statusOptions: [{
        label: '正常',
        value: 0
      }, {
        label: '停用',
        value: 1
      }],
      agentOptions: [{
        label: '正常',
        value: 0
      }, {
        label: '停用',
        value: 1
      }],
    }
  },
  created() {
  this.getList()
  },
  methods:{
    hidden(){
      this.count++
      if (this.count%2==0){
        this.showSearch=true
      }else {
        this.showSearch=false
      }
    },
    getList() {
      axios.post('/delegation/list?page='+this.page+'&'+'pageSize='+this.pageSize,this.queryParams).then(res=>{
        this.dataList=res.data.list
        this.total=res.data.total
        this.loading=false
      })
    },
    handleQuery(){
      this.getList()
    },
    resetQuery(){
      this.queryParams.companyName=null
      this.queryParams.contactName=null
      this.queryParams.enableState=null
      this.queryParams.agentState=null
      this.getList()
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    submitForm(){
      this.$refs["form"].validate(valid => {
        if (valid){
          console.log(this.form)
          axios.post("/delegation/insertOrUpdate",this.form).then(res=>{
            if (res.data.status==200){
              this.$message.success(res.data.message)
              this.open=false
              this.getList()
            }else {
              this.$message.error(res.data.message)
              this.open=false
              this.getList()
            }
          }).catch(error=>{
            this.$router.push({
              path: "404error"//要跳转的页面的路由
            });
          })
        }
      })
    },
    handleDelete(row) {
      const dictIds = row.id || this.ids;
      this.$confirm('是否确认删除编号为"' + dictIds + '"的数据项？').then(function() {
        return axios.delete("/delegation/delete/"+dictIds)
      }).then((res) => {
        if (res.data.status==200){
          this.getList()
          this.$message.success(res.data.message);
        }else {
          this.getList()
          this.$message.error(res.data.message);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    reset() {
      this.form = {
        companyName:undefined,
        codeOfOrganization: undefined,
        companyNature: 1,
        enableState: 0,
        agentState:0,
        contactName: undefined,
        phoneNumber:undefined,
      };
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公司数据";
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page = 1;
      this.pageSize = val;
      this.getList()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.id || this.ids
      axios.get("/delegation/selectById/"+dictId).then(res=>{
        this.open=true
        this.title="修改公司数据"
        this.form=res.data.data
      }).catch(error=>{
        this.$router.push({
          path: "404error"//要跳转的页面的路由
        });
      })
    },
  }
}
</script>

<style scoped>
.search{

}
</style>
