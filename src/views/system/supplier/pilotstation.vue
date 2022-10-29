<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="引航站名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入引航站名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="助记码" prop="helpCode">
        <el-input
          v-model="queryParams.helpCode"
          placeholder="请输入助记码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button type="primary" size="small" plain icon="el-icon-plus" :disabled="add" @click="addByOne">新增</el-button>
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

    <el-table
      :data="tableData"
      stripe
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="引航站名称"
        width="180">
        <template slot-scope="{row}">
          <el-form ref="row" :model="row"
            v-if="row.edit"
          >
            <el-form-item prop="name" ref="name" :rules="[{ required:true, message: '名称不能为空'}]">
              <el-input v-model="row.name" placeholder="请输入名称"/>
            </el-form-item>
          </el-form>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="helpCode"
        label="助记码"
        width="180">
        <template slot-scope="{row}">
          <el-form ref="row1" :model="row"
            v-if="row.edit"
          >
            <el-form-item prop="helpCode" ref="helpCode" :rules="[{ required:true, message: '助记码不能为空'},{pattern:/^[a-zA-Z]+$/,message:'助记码必须是英文字母'}]">
              <el-input v-model="row.helpCode" placeholder="请输入助记码"/>
            </el-form-item>
          </el-form>
          <span v-else>{{ row.helpCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160" :resizable="false">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.edit" content="保存" placement="top">
            <el-button
              type="success"
              size="small"
              icon="el-icon-check"
              @click="checkEditSaveOk(scope.row)"
            />
          </el-tooltip>
          <el-tooltip v-else content="编辑" placement="top">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="scope.row.edit=!scope.row.edit"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" size="small"  @click="deleteByIds(scope.$index, scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tableData: [{}],
      showSearch: true,
      queryParams: {},
      loading:false,
      pageSize:5,
      pageNum:1,
      total:0,
      single: true, //修改按钮默认是false，只有是一个的时候才是true
      multiple: true,//多选选中情况下是true，否则为true
      multipleSelection: [], //多选列表
      ids: [],
      add:false,
    }
  },
  created() {
    this.loading=true
    setTimeout(()=>this.getAll(),500)
  },
  methods: {
    handleQuery(){
      this.loading=true
     setTimeout(()=>{
       this.pageNum = 1;
       this.getAll()
       this.loading=false
     },1000)
    },
    resetQuery() {
      this.queryParams.name = null
      this.queryParams.helpCode=null
      this.getAll()
    },
    checkEditSaveOk(row) {
      console.log(row)
      this.loading=true
      let arr=[]
      let data1=this.$refs.row.validate()
      let data2=this.$refs.row1.validate()
      arr.push(data1)
      arr.push(data2)
      setTimeout(()=>Promise.all(arr).then((valids)=>{
        if (valids.filter((el) => !el).length == 0){
          row.helpCode=row.helpCode.toUpperCase()
          if (row.id!=''){//有id则是更新
            axios.put("/pilotStation/updateOrAdd",row,{timeout:2000}).then(res=>{
              console.log(res)
              row.edit = !row.edit
              if (res.data.status=200){
                this.$message.success(res.data.message)
                this.getAll()
                this.loading=false
              }else {
                this.$message.error(res.data.message)
                this.getAll()
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
          }else {//没有id则是新增
              axios.put("/pilotStation/updateOrAdd",row,{timeout:2000}).then(res=>{
                row.edit = !row.edit
                if (res.data.status=200){
                  this.$message.success(res.data.message)
                  this.getAll()
                  this.loading=false
                }else {
                  this.$message.error(res.data.message)
                  this.getAll()
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
          }
        }
      }).catch(error=>{
        this.$message.error("请检查表单数据是否合法")
        this.loading=false
        this.add=true
        return false;
      }),1000)
      this.add=false
    },
    getAll(){
      this.loading=true
      axios.post("/pilotStation/list/"+this.pageNum+'/'+this.pageSize,this.queryParams,{timeout:5000}).then(res=>{
        console.log(res)
        let detail={edit:false}
        let map=res.data.data.list.map(map=>{
          return Object.assign(map,detail)
        })
        let list=[]
        list.push(map)
         // console.log(list)
        this.tableData=list[0]

        this.total=res.data.data.total
        this.loading=false
      }).catch(error=>{
            this.$router.push({
              path: "404error"//要跳转的页面的路由
            });
        }
      )
    },
    update(){
      let item = this.tableData.map(map=>{
        return map
      })
      console.log(item)
      for (let i = 0; i <item.length; i++) {
        if (this.ids[0]===item[i].id){
          item[i].edit=true
        }
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
      console.log(val)
      this.ids = val.map(item => item.id)
      console.log(this.ids)
      this.single = val.length != 1;
      this.multiple = !val.length;
    },
    addByOne() {
      const circle = this.tableData[0]; //取出数组中第一个对象
      if (circle) {
        const newObj = {};
        for (let key in circle) { //把第一个对象的属性都赋值给新对象newObj  然后每个属性的值都设置为空；
          newObj[key] = '';
          newObj.edit =!newObj.edit
        }

        this.tableData.splice(0 , 0, newObj);
      }
      let count=0
      let item = this.tableData.map(map=>{
        return map
      })
      for (let i = 0; i <item.length; i++) {
        if (item[i].edit==true){
          count+=1
        }
      }
      console.log(count)
      this.add = count > 0;
    },
    deleteByIds(index, row){
      //有三种状态：一种行尾删除，传入row.id，一种批量删除，传入this.ids，最后一种新增状态下删除，传入edit=true
      //前两种需要访问数据库删除，最后一种是js删除
      console.log(index)
      console.log(row)
      if (row!=undefined){
        if (row.id==''){
          this.tableData.splice(index, 1);
          this.add=false
        }else {
          this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(()=>{
            axios.delete("/pilotStation/delete/"+row.id).then(res=>{
              this.$message.success(res.data.message)
              this.getAll()
            }).catch(error=>{
              if (error.status=500){
                this.$alert('服务器内部错误，请联系管理员！',{
                  confirmButtonText: '确定',
                  callback: action =>{
                    this.$router.push({
                      path: "500error"//要跳转的页面的路由
                    });
                  }
                })
              }else {
                this.$alert('服务器开小差了，请稍后再试！',{
                  confirmButtonText: '确定',
                  callback: action =>{
                    this.$router.push({
                      path: "404error"//要跳转的页面的路由
                    });
                  }
                })
              }
            })
          })
        }
      } else if (row==undefined){
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(()=>{
          axios.delete("/pilotStation/delete/"+this.ids).then(res=>{
            this.$message.success(res.data.message)
            this.getAll()
          }).catch(error=>{
            if (error.status=500){
              this.$alert('服务器内部错误，请联系管理员！',{
                confirmButtonText: '确定',
                callback: action =>{
                  this.$router.push({
                    path: "500error"//要跳转的页面的路由
                  });
                }
              })
            }else {
              this.$alert('服务器开小差了，请稍后再试！',{
                confirmButtonText: '确定',
                callback: action =>{
                  this.$router.push({
                    path: "404error"//要跳转的页面的路由
                  });
                }
              })
            }
          })
        })
      }
    },
  }
}
</script>



<style scoped>
</style>
