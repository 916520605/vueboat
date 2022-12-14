<template>
  <div>
    <!--查询功能    -->
    <el-form :model="queryParams" label-width="68px" ref="queryForm" :inline="true" size="small" v-show="showSearch">
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          v-model="queryParams.dictName"
          placeholder="请输入字典名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="type">
        <el-input
          v-model="queryParams.type"
          placeholder="请输入字典类型"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" style="width: 240px" clearable placeholder="字典状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterange"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          :default-time="['00:00:00', '23:59:59']"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
<!--中间按钮    -->
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
    </el-row>
<!--表格数据-->
    <el-table v-loading="loading" :header-cell-style="{
      background:'#f8f8f9'}" :data="typeList" @selection-change="handleSelectionChange" style="margin-top: 10px">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="字典编号" align="center" prop="id" width="100px"/>
      <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true"/>
      <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'dict-data'+scope.row.id" class="link-type">
            <span>{{ scope.row.type }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag :value="scope.row.status" v-if="scope.row.status==0">正常</el-tag>
          <el-tag :value="scope.row.status" v-else type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述信息" align="center" prop="description" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" >
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
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="type" >
          <el-input v-model="form.type" placeholder="请输入字典类型" disabled/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in options" :key="item.value"
                      :label="item.value">{{item.label}}</el-radio>
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
  name: "Dictionary",
  data() {
    return {
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ]
      },
      daterange: [],
      typeList: [],
      queryParams: {
        dictName: '',
        type: '',
        status: '',
        starTime: '',
        endTime: ''
      },
      loading:true,
      showSearch: true,
      options: [{
        label: '正常',
        value: 0
      },
        {
          label: '停用',
          value: 1
        }]
    }
  },
  created() {
    this.getAll()
  },
  methods: {
    handleQuery() {
      this.queryParams.starTime = this.daterange[0]
      this.queryParams.endTime = this.daterange[1]
      this.getAll()
    },
    resetQuery() {
      this.queryParams.dictName = undefined
        this.queryParams.type = undefined
        this.queryParams.status = undefined
        this.queryParams.starTime = undefined
      this.queryParams.endTime = undefined
      this.daterange=undefined
      this.getAll()
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        dictName: undefined,
        type: undefined,
        status: 0,
        description: undefined
      };

    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典类型";
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
      axios.get("/sysDict/id?id="+dictId).then(res=>{
        this.open=true
        this.title="修改字典类型"
        this.form=res.data.data
      }).catch(error=>{
        this.$router.push({
          path: "404error"//要跳转的页面的路由
        });
      })
    },
    /*提交按钮操作*/
    submitForm(){
      this.$refs["form"].validate(valid => {
        if (valid){
          axios.post("/sysDict/insertOrUpdate",this.form).then(res=>{
            if (res.data.status==200){
              this.$message.success(res.data.message)
              this.open=false
              this.getAll()
            }else {
              this.$message.error(res.data.message)
              this.open=false
              this.getAll()
            }
          })
        }
      })
    },
    handleDelete(row) {
      const dictIds = row.id || this.ids;
      this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？').then(function() {
        return axios.delete("/sysDict/delete/"+dictIds)
      }).then((res) => {
        if (res.data.status==200){
          this.getAll()
          this.$message.success(res.data.message);
        }else {
          this.getAll()
          this.$message.error(res.data.message);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    getAll() {
      this.loading=true
      axios.post("/sysDict/list", this.queryParams).then(res => {
        this.typeList = res.data.data
        this.loading=false
      }).catch(error=>{
        this.$router.push({
          path: "404error"//要跳转的页面的路由
        });
      })
    }
  }
}
</script>

<style scoped>



a {
  text-decoration: none;
  color: #337ab7;
}
</style>
