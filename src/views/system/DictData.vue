<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="字典名称" prop="type">
        <el-select v-model="queryParams.type">
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.dictName"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="itemText">
        <el-input
          v-model="queryParams.itemText"
          placeholder="请输入字典标签"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="数据状态" clearable>
          <el-option
            v-for="dict in statusOptions"
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-close"
          size="mini"
          @click="handleClose"
        >关闭</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :header-cell-style="{
      background:'#f8f8f9'}" :data="dataList" @selection-change="handleSelectionChange" style="margin-top: 10px">
      <el-table-column type="selection" width="55" align="center"  />
      <el-table-column label="字典编码" align="center" prop="id" />
      <el-table-column label="字典标签" align="center" prop="itemText">

      </el-table-column>
      <el-table-column label="字典键值" align="center" prop="itemValue" />
      <el-table-column label="字典排序" align="center" prop="sortOrder" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag :value="scope.row.status" v-if="scope.row.status==0">正常</el-tag>
          <el-tag :value="scope.row.status" v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="description" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型">
          <el-input v-model="form.type" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据标签" prop="itemText">
          <el-input v-model="form.itemText" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="itemValue">
          <el-input v-model="form.itemValue" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in this.statusOptions"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容"></el-input>
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
  name: "DictData",
  data() {
    return {
      showSearch: true,
      loading:true,
      ids: [],
      title:'',
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      open:false,
      dataList:[],
      queryParams: {
        itemText:undefined,
        dictName: undefined,
        type: undefined,
        status: undefined
      },
      typeOptions: [],
      // 默认字典类型
      defaultDictType: "",
      statusOptions: [{
        label: '正常',
        value: 0
      }, {
        label: '停用',
        value: 1
      }],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        itemText: [
          { required: true, message: "数据标签不能为空", trigger: "blur" }
        ],
        itemValue: [
          { required: true, message: "数据键值不能为空", trigger: "blur" }
        ],
        sortOrder: [
          { required: true, message: "数据顺序不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {

   let DictId=this.$route.params.id
    console.log(this.$route.params.id)
    this.getType(DictId)
    this.getTypeList()
  },
  methods: {
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典数据";
      this.form.type = this.queryParams.type;
    },
    reset() {
      this.form = {
        itemText:undefined,
        itemValue: undefined,
        type: undefined,
        status: 0,
        description: undefined,
        sortOrder:0,
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    getTypeList() {
      axios.get("/sysDictItem/list").then(res => {
        console.log(res)
        this.typeOptions = res.data.data
        this.getList()
      }).catch(error=>{
        this.$router.push({
          path: "404error"//要跳转的页面的路由
        });
      })
    },
    getType(DictId){
      axios.get('/sysDict/id?id='+DictId).then(res=>{
        console.log(res)
        this.queryParams.type = res.data.data.type;
        this.defaultDictType = res.data.data.type;
      })
    },
    getList(){
      this.loading=true
      axios.post("/sysDictItem/itemList",this.queryParams).then(res=>{
        console.log(res)
        this.dataList=res.data.data
        this.loading=false
      })
    },
    handleQuery() {
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleClose(){
      this.$router.back()
    },
    resetQuery() {
      this.queryParams.status=null,
        this.queryParams.type=null,
        this.queryParams.dictName=null,
        this.queryParams.itemText=null,
      this.queryParams.type = this.defaultDictType;
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.id || this.ids
      axios.get("/sysDictItem/selectById/"+dictId).then(res=>{
        this.open=true
        this.title="修改字典数据"
        this.form=res.data.data
      }).catch(error=>{
        this.$router.push({
          path: "404error"//要跳转的页面的路由
        });
      })
    },
    handleDelete(row) {
      const dictIds = row.id || this.ids;
      this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？').then(function() {
        return axios.delete("/sysDictItem/delete/"+dictIds)
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
    submitForm(){
      this.$refs["form"].validate(valid => {
        if (valid){
            this.form.dictId=this.$route.params.id
          console.log(this.form)
          axios.post("/sysDictItem/insertOrUpdate",this.form).then(res=>{
            if (res.data.status==200){
              this.$message.success(res.data.message)
              this.open=false
              this.getList()
            }else {
              this.$message.error(res.data.message)
              this.open=false
              this.getList()
            }
          })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
