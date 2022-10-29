<template>
  <div>
    <!--搜索功能  -->
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
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="船东" prop="shipOwner">
        <el-input
          v-model="queryParams.shipOwner"
          placeholder="请输入船东"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--中间四个增删改查按钮 -->
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
    <!--中间表格数据 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="船名">
              <span>{{ props.row.shipName }}</span>
            </el-form-item>
            <el-form-item label="IMO号">
              <span>{{ props.row.imo }}</span>
            </el-form-item>
            <el-form-item label="呼号">
              <span>{{ props.row.callNumber }}</span>
            </el-form-item>
            <el-form-item label="国籍">
              <span>{{ props.row.nationality }}</span>
            </el-form-item>
            <el-form-item label="建成日期">
              <span>{{ props.row.builtDate }}</span>
            </el-form-item>
            <el-form-item label="船长">
              <span>{{ props.row.length }}</span>
            </el-form-item>
            <el-form-item label="船宽">
              <span>{{ props.row.width }}</span>
            </el-form-item>
            <el-form-item label="总吨">
              <span>{{ props.row.grossTonnage }}</span>
            </el-form-item>
            <el-form-item label="净吨">
              <span>{{ props.row.netTons }}</span>
            </el-form-item>
            <el-form-item label="载重吨">
              <span>{{ props.row.DWT }}</span>
            </el-form-item>
            <el-form-item label="船籍港">
              <span>{{ props.row.homePort }}</span>
            </el-form-item>
            <el-form-item label="电话（海卫通）">
              <span>{{ props.row.phoneNumber }}</span>
            </el-form-item>
            <el-form-item label="船东">
              <span>{{ props.row.shipOwner }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="船名"
        prop="shipName">
      </el-table-column>
      <el-table-column
        label="IMO号"
        prop="imo">
      </el-table-column>
      <el-table-column
        label="国籍"
        prop="nationality">
      </el-table-column>
      <el-table-column
        label="船东"
        prop="shipOwner">
      </el-table-column>
      <el-table-column
        label="录入时间"
        prop="creatTime">
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
      <div slot="empty" style="text-align: left;">
        <el-empty description="哎呀，你是不是忘记查询啦！"/>
      </div>
    </el-table>
    <!--//分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total,sizes, prev, pager, next"
      :total="total">
    </el-pagination>
    <!--新增和修改弹出框表单  -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
    >
      <el-form ref="form" :model="form" label-width="120px" :inline="true"
               :label-position="labelPosition"
      >
        <el-form-item label="船名" prop="shipName" :rules="[
      { required:true, message: '船名不能为空'}
    ]">
          <el-input v-model="form.shipName"></el-input>
        </el-form-item>
        <el-form-item label="IMO号" prop="imo" :rules="[
      { type: 'number', message: 'IMO必须为数字值'}
    ]">
          <el-input type="imo" v-model.number="form.imo" @blur="inputBlur"></el-input>
        </el-form-item>
        <el-form-item label="呼号">
          <el-input v-model="form.callNumber"></el-input>
        </el-form-item>
        <el-form-item label="建成日期">
          <el-date-picker
            v-model="form.builtDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="船长">
          <el-input v-model="form.length"></el-input>
        </el-form-item>
        <el-form-item label="船宽">
          <el-input v-model="form.width"></el-input>
        </el-form-item>
        <el-form-item label="总吨">
          <el-input v-model="form.grossTonnage"></el-input>
        </el-form-item>
        <el-form-item label="净吨">
          <el-input v-model="form.netTons"></el-input>
        </el-form-item>
        <el-form-item label="载重吨">
          <el-input v-model="form.DWT"></el-input>
        </el-form-item>
        <el-form-item label="船东">
          <el-input v-model="form.shipOwner"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="船籍港">
          <el-select
            v-model="form.homePort"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod1"
            :loading="loading">
            <el-option
              v-for="item in options1"
              :key="item.portCode"
              :label="item.portName"
              :value="item.portCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国籍">
          <el-select
            v-model="form.nationality"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.letterCode"
              :label="item.countryName"
              :value="item.letterCode">
            </el-option>
          </el-select>
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
  name: "BaseBoat",
  data() {
    return {
      title: '',
      labelPosition: 'right',
      single: true, //修改按钮默认是false，只有是一个的时候才是true
      multiple: true,//多选选中情况下是true，否则为true
      showSearch: true,
      multipleSelection: [], //多选列表
      dialogVisible: false,
      ids: [],
      queryParams: {
        shipName: '',
        imo: '',
        shipOwner: ''
      },
      tableData: [{}],
      pageNum: 1, //当前页
      pageSize: 10,//每一页多少条肌理
      total: 0,//总页数
      form: {
        shipName: '',
        imo: '',
        builtDate: '',
        nationality: '',
        grossTonnage: '',
        callNumber: '',
        netTons: '',
        DWT: '',
        shipOwner: '',
        phoneNumber: '',
        length: '',
        width: '',
        homePort: '',
      },
      //国籍数据
      options: [],
      list: [],
      loading: false,
      states: [],
      //港口数据
      options1: [],
      list1: [],
      states1: [],
    }
  },
  created() {
    this.getAll()
  },

  mounted() {
    this.list = this.states.map(item => {
      return {value: `${item.letterCode}`, label: `${item.countryName}`};
    });
    this.list1 = this.states1.map(item => {
      return {value: `${item.portCode}`, label: `${item.portName}`};
    });
  },
  methods: {
    getAll() {
      this.loading=true
      setTimeout(()=>{
        axios.post("http://localhost:8080/baseShip/list/" + this.pageNum + '/' + this.pageSize, this.queryParams).then((res) => {
          console.log(res)
          this.tableData = res.data.list
          this.total = res.data.total
          this.loading=false
        }).catch(error=>{
          this.$router.push({
            path: "404error"//要跳转的页面的路由
          });
        })
      },500)

    },
    getNationality(query) {
      axios.post("http://localhost:8080/nationality/list", {
        "countryName": query
      }).then((res) => {
        this.states = res.data.map(item => {
          return item.countryName
        })
        this.options = res.data
      });
    },
    getWordPort(query) {
      axios.post("http://localhost:8080/wordPort/list", {
        "portName": query
      }).then((res) => {
        //console.log(res)
        this.states1 = res.data.map(item => {
          return item.portName
        })
        this.options1 = res.data
      });
    },
    handleQuery() {
      this.pageNum = 1;
      this.getAll()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.getNationality(query)
        setTimeout(() => {
          this.loading = false;
          this.options = this.options.filter(item => {
            return item.countryName.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    remoteMethod1(query) {
      if (query !== '') {
        this.loading = true;
        this.getWordPort(query)
        setTimeout(() => {
          this.loading = false;
          this.options1 = this.options1.filter(item => {
            return item.portName.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options1 = [];
      }
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
    resetQuery() {
      this.queryParams.shipName = null
      this.queryParams.imo = null
      this.queryParams.shipOwner = null
      this.getAll()
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
          axios.delete("http://localhost:8080/baseShip/delete/" + this.ids).then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getAll()
          })
        }else {
          axios.delete("http://localhost:8080/baseShip/delete/" + row.id).then((res) => {
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

    update(index, row) {
      this.rest()
      this.title = '修改船舶'
      this.dialogVisible = true
      if (row === undefined){
        axios.get("http://localhost:8080/baseShip/" + this.ids).then((res) => {
          console.log(typeof (res.data.imo))
          if (res.data.imo != null) {
            res.data.imo = Number(res.data.imo)
          } else {
            res.data.imo = null
          }
          this.form = res.data
          this.getNationality()
          this.getWordPort()
        })
      }else {
        axios.get("http://localhost:8080/baseShip/" + row.id).then((res) => {
          console.log(typeof (res.data.imo))
          if (res.data.imo != null) {
            res.data.imo = Number(res.data.imo)
          } else {
            res.data.imo = null
          }
          this.form = res.data
          this.getNationality()
          this.getWordPort()
        })
      }
      this.rest()
    },
    addByOne() {
      this.title = '新增船舶'
      this.dialogVisible = true
      this.getNationality()
      this.getWordPort()
      this.rest()
    },
    //重置表单
    rest() {
      this.form.shipName = null
      this.form.imo = null
      this.form.builtDate = null
      this.form.nationality = null
      this.form.grossTonnage = null
      this.form.callNumber = null
      this.form.netTons = null
      this.form.DWT = null
      this.form.shipOwner = null
      this.form.phoneNumber = null
      this.form.length = null
      this.form.width = null
      this.form.homePort = null
      this.form.countryName = null
      this.form.id=undefined
    },
    cancel() {
      this.dialogVisible = false
      this.rest()
    },
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.id == undefined) {//form表单没有id属性则是新增
            axios.post("http://localhost:8080/baseShip/add", this.form).then((res) => {
              this.$message.success("新增成功")
              this.dialogVisible = false
              this.rest()
              this.getAll()
            })
          } else {//有id属性则是修改
            axios.put("http://localhost:8080/baseShip/update", this.form).then((res) => {
              console.log(res)
              this.$message.success("修改成功")
              this.dialogVisible = false
              this.rest()
              this.getAll()
            })
          }

        } else {
          this.$message.error("请检查表单数据是否合法")
          return false;
        }
      });


    },
    inputBlur(form) {
      if (this.form.id == null) {
        axios.post("http://localhost:8080/baseShip/unique?imo=" + this.form.imo).then((res) => {
            console.log(res)
            if (res.data != '') {
              if (res.data.imo == this.form.imo) {
                this.$message.error("IMO已存在，请重新输入")
                this.form.imo = null
              }
            }

          }
        )
      } else {
        axios.get("http://localhost:8080/baseShip/checkImo/" + this.form.id + '/' + this.form.imo).then((res) => {
          console.log(res)
          if (res.data != '') {
            if (res.data.id != this.form.id) {
              this.$message.error("IMO已存在，请重新输入")
              this.form.imo = null
            }
          }

        })
      }


    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;

}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;

}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  color: #409eff;
  padding-left: 100px;

}
</style>
