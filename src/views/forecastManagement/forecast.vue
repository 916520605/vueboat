<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="船舶名称" prop="shipName">
        <el-input v-model="queryParams.shipName" placeholder="请输入船名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="IMO号" prop="imo">
        <el-input v-model="queryParams.imo" placeholder="请输入IMO号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="航次号" prop="voyage">
        <el-input v-model="queryParams.voyage" placeholder="请输入航次号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single"
          @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
          @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>

    </el-row>

    <el-table :data="tableData" v-loading="loading"  @selection-change="handleSelectionChange" :header-cell-style="{
      background: '#f8f8f9'
    }" style="margin-top: 10px">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="始发港">
              <span>{{ props.row.departPort }}</span>
            </el-form-item>
            <el-form-item label="上一港">
              <span>{{ props.row.lastPort }}</span>
            </el-form-item>
            <el-form-item label="下一港">
              <span>{{ props.row.nextPort }}</span>
            </el-form-item>
            <el-form-item label="拖轮公司">
              <span>{{ props.row.tugCompany }}</span>
            </el-form-item>
            <el-form-item label="拖轮">
              <span>{{ props.row.tug }}</span>
            </el-form-item>
            <el-form-item label="靠泊泊位">
              <span>{{ props.row.port }}</span>
            </el-form-item>
            <el-form-item label="来港目的" >
              <template v-for="item in $store.state.purpose">
                  <span v-if="item.itemValue == props.row.purpose">{{ item.itemText }}</span>
              </template>
            </el-form-item>
            <el-form-item label="货物名称">
              <span>{{ props.row.goodsName }}</span>
            </el-form-item>
            <el-form-item label="货物重量">
              <span>{{ props.row.quantity }}</span>
            </el-form-item>
            <el-form-item label="船舶吃水">
              <span>{{ props.row.draftWater }}</span>
            </el-form-item>
            <el-form-item label="引航站">
              <span>{{ props.row.pilotStation }}</span>
            </el-form-item>

            <el-form-item label="代理">
              <span>{{ props.row.delegation }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="船名" prop="shipName" align="center">
        <template slot-scope="scope">
          <router-link :to="{ name: '船舶信息', query: { baseShip: scope.row } }" class="link-type">
            <span>{{ scope.row.shipName }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="IMO号" prop="imo" align="center">
      </el-table-column>
      <el-table-column label="航次" prop="voyage" align="center">
      </el-table-column>
      <el-table-column label="预抵时间" prop="poreArriveTime" align="center">
      </el-table-column>
      <el-table-column label="预离时间" prop="poreLeaveTime" align="center">
      </el-table-column>
      <el-table-column label="靠泊码头" prop="dock" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum1"
      :page-sizes="[5, 10, 15, 20]" :page-size="pageSize1" layout="total, sizes, prev, pager, next, jumper" :total="total1">
    </el-pagination>
    <!--新增预抵船舶对话框-->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form :model="queryParams1" ref="queryForm" size="small" :inline="true"  label-width="90px">
        <el-form-item label="船名" prop="shipName">
          <el-input v-model="queryParams1.shipName" placeholder="请输入船名" clearable @keyup.enter.native="handleQuery1" />
        </el-form-item>
        <el-form-item label="IMO号" prop="imo">
          <el-input v-model="queryParams1.imo" placeholder="请输入IMO号" clearable @keyup.enter.native="handleQuery1" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery1">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery1">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="dataList" :header-cell-style="{ background: '#f8f8f9' }" :border="true">
        <el-table-column label="船名" align="center" prop="shipName" />
        <el-table-column label="IMO号" align="center" prop="imo" />
        <el-table-column label="国籍" align="center" prop="nationality" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-circle-plus-outline" @click="add(scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-dialog>



<!-- 修改弹出框 -->
<el-dialog :title="title" :visible.sync="updateDialog" width="30%" append-to-body>
  <el-form ref="form"  :model="form" :rules='rules' label-width="120px" >
    <el-form-item label="航次" prop="voyage">
      <el-input v-model="form.voyage" clearable placeholder="请输入航次" style="width: 220px"></el-input>
    </el-form-item>
    <el-form-item label="始发港" prop="departPort">
      <el-select v-model="form.departPort" filterable clearable placeholder="请选择港口">
        <el-option v-for="item in $store.state.wordPort" :key="item.portCode
        " :label="item.portName + '(' + item.portCode + ')'" :value="item.portCode" />
      </el-select>
    </el-form-item>
    <el-form-item label="上一港" prop="lastPort">
      <el-select v-model="form.lastPort" filterable clearable placeholder="请选择港口">
        <el-option v-for="item in $store.state.wordPort" :key="item.portCode
        " :label="item.portName + '(' + item.portCode + ')'" :value="item.portCode" />
      </el-select>
    </el-form-item>
    <el-form-item label="下一港" prop="nextPort">
      <el-select v-model="form.nextPort" filterable clearable placeholder="请选择港口">
        <el-option v-for="item in $store.state.wordPort" :key="item.portCode
        " :label="item.portName + '(' + item.portCode + ')'" :value="item.portCode" />
      </el-select>
    </el-form-item>
    <el-form-item label="预抵时间" prop="poreArriveTime">
      <el-date-picker v-model="form.poreArriveTime" type="datetime" placeholder="选择预抵日期" align="right">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="预离时间" prop="poreLeaveTime">
      <el-date-picker v-model="form.poreLeaveTime" type="datetime" placeholder="选择预离日期" align="right">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="靠泊码头及泊位">
      <el-select v-model="form.dock" filterable clearable placeholder="请选择码头" style="width:120px ;" @focus="getDocks" @change="changePort"
        >
        <el-option v-for="item in $store.state.dock" :key="item.dockId
        " :label="item.dockName" :value="item.dockId" />
      </el-select>
      <el-select v-model="form.port"  clearable placeholder="请选择泊位" style="width:120px ;" >
        <el-option v-for="item in portOptions" :key="item.id
        " :label="item.portName" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="来港目的" prop="purpose">
      <el-radio-group v-model="form.purpose">
        <el-radio   v-for="item in $store.state.purpose" :key="item.id" :label="item.itemValue" >{{item.itemText}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="货物名称" prop="goodsName">
      <el-input v-model="form.goodsName" clearable placeholder="请输入货物名称" style="width: 220px"></el-input>
    </el-form-item>
    <el-form-item label="货物数量" prop="quantity">
      <template>
        <el-input-number v-model="form.quantity" :precision="3" :step="1" :min="0" placeholder="请输入货物数量"
          style="width:220px" />
      </template>
    </el-form-item>
    <el-form-item label="吃水" prop="draftWater">
      <template>
        <el-input-number v-model="form.draftWater" :precision="2" :step="1" :min="0" placeholder="请输入吃水"
          style="width:220px" />
      </template>
    </el-form-item>
    <el-form-item label="引航站" prop="pilotStation">
      <el-select v-model="form.pilotStation" multiple filterable placeholder="请选择引航站(可多选)">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="拖轮公司及拖轮" prop="tugCompany">
      <el-select v-model="form.tugCompany" multiple filterable placeholder="请选择拖轮公司(可多选)">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="form.tug" multiple filterable placeholder="请选择拖轮(可多选)">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="代理方" prop="delegation">
      <el-select v-model="form.delegation" filterable clearable placeholder="请选择港口">
        <el-option v-for="item in $store.state.wordPort" :key="item.portCode
        " :label="item.portName + '(' + item.portCode + ')'" :value="item.portCode" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button type="info" @click="restForm">重置</el-button>
    </el-form-item>
  </el-form>

</el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "forecast",
  data() {
    return {

      queryParams: {},
      queryParams1: {},
      single: true, //修改按钮默认是false，只有是一个的时候才是true
      multiple: true,
      multipleSelection: [],
      title: '',
      total: 0,
      total1: 0,
      ids:[],
      open: false,
      updateDialog: false,
      loading: true,
      dataList: [],
      tableData: [],
      pageNum: 1,
      pageNum1: 1,
      pageSize1: 10,
      pageSize: 10,

      portOptions: [],
      form: {},
      formData:{}
    }
  },
  created() {
    this.getForecastList()
    this.getPurpose()
  },
  methods: {
    getBaseBoatList() {
      axios.post("/forecast/baseShipList?pageNum=" + this.pageNum + '&' + 'pageSize=' + this.pageSize, this.queryParams1).then((res) => {
        console.log(res)
        this.loading = false
        this.dataList = res.data.data.list
        this.total = res.data.data.total
      }).catch(() => {
        this.$router.push({
          path: "404error"//要跳转的页面的路由
        });
      })
    },
    //提交form表单
    onSubmit() {
      console.log(this.form);
    },

    handleQuery() {
      this.getForecastList()
    },
    getForecastList() {
      axios.post("/forecast/list?pageNum=" + this.pageNum1 + '&' + "pageSize=" + this.pageSize1, this.queryParams).then(res => {
        this.loading = false
        this.tableData = res.data.data.list
        this.total1 = res.data.data.total
      })
    },
    handleQuery1() {
      this.pageNum = 1
      this.getBaseBoatList()
    },
    resetQuery1() {
      this.queryParams1 = {}
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = val.map(item => item.id)
      console.log(this.ids)
      this.single = val.length != 1;
      this.multiple = !val.length;
    },
    resetQuery() {
      this.queryParams = {}
      this.getForecastList()
    },
    handleAdd() {
      this.open = true
      this.title = '新增预抵船舶'
      this.getBaseBoatList()
    },
    add(row) {
      axios.get("/baseShip/" + row.id).then((res) => {
        console.log(res)
        this.formData.shipName = res.data.shipName
        this.formData.imo = res.data.imo
        this.formData.baseShipId = res.data.id
        this.$prompt("请输入航次", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.form.voyage = value
          console.log(this.formData)
          axios.post("/forecast/insert", this.formData).then(res => {
            if (res.data.status == 200) {
              this.$message({
                type: 'success',
                message: '添加成功'
              });
              this.open = false
              this.getForecastList()
            } else {
              this.$message({
                type: 'error',
                message: '添加失败'
              });
            }

          }).catch((error) => {
            this.$router.push({
              path: "404error"//要跳转的页面的路由
            });
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        })
      })
    },

    handleUpdate(row) {
      this.updateDialog = true
      this.title = "修改预抵信息"
      axios.get("/forecast/selectById?id=" + row.id).then(res => {

        this.form = res.data.data
      })
      this.chufa()
      this.getPurpose()
    },

    chufa() {
      this.$store.dispatch('getAllPort')
    },
    getPurpose() {
      this.$store.dispatch('getPurposesLIst')
    },
    getDocks() {
      this.$store.dispatch('getAllDock')

    },
    changePort() {


      this.portOptions = []

      if (this.form.dock !='') {
        axios.get('/dock/portList?dockId=' + this.form.dock).then(res => {
          console.log(res);

          this.portOptions = res.data.data
          // 当码头的值发生变化时，泊位默认选择第一泊位
          this.form.port=this.portOptions[0].id
        })

      } else {
        this.form.port=''
      }




    },
  }

}
</script>

<style scoped>
a {
  text-decoration: none;
  color: #337ab7;
}
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
  margin-top: 10px;
  transform: translate(50%,-50%);
  color:#66b1ff
}
</style>
