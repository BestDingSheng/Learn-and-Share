<!--商户通对象维护-->
<template>
  <el-row >
    <!--查询-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
        <el-form-item  label="精确搜索：" label-width="90px">
        </el-form-item>
        <el-form-item  prop="name">
          <el-input v-model="formInline.name" placeholder="请输入对象姓名"></el-input>
        </el-form-item>
        <el-form-item prop="startDate">
          <el-date-picker type="datetime" placeholder="请选择开始日期" v-model="formInline.startDate"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endDate">
          <el-date-picker type="datetime" placeholder="请选择结束日期" v-model="formInline.endDate"></el-date-picker>
        </el-form-item>
        <el-form-item prop="attr">
          <el-select v-model="formInline.attr" clearable placeholder="请选择属性">
              <el-option
                v-for="item in attrList"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="examineState">
          <el-select v-model="formInline.examineState" clearable placeholder="请选择审核状态" >
            <el-option
              v-for="item in $root._data.examineState"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24" >
      <el-button-group style="margin: 5px 0px">
        <el-button type="primary" icon="search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="handleReset"><i class="iconfonts icon-reset el-icon--left"></i>重置</el-button>
        <el-button type="primary" @click="handleLead"><i class="el-icon-upload el-icon--left"></i>导入模板</el-button>
        <el-button type="primary" @click="handleAdd"><i class="el-icon-plus el-icon--left"></i>新建规则</el-button>
        <el-button type="primary" @click="handleDownload"><i class="el-icon-upload el-icon--left"></i>导入下载模板</el-button>
      </el-button-group>
    </el-col>
    <!--表格-->
    <el-col :span="24">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%">
        <el-table-column
          fixed
          prop="filmId"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="对象姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="num"
          label="对象内商户数"
          width="140">
        </el-table-column>
        <el-table-column
          prop="attr"
          label="属性"
          width="130">
        </el-table-column>
        <el-table-column
          prop="person"
          label="导入人员"
          width="130">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="170">
        </el-table-column>
        <el-table-column
          prop="states"
          label="审核状态"
          width="140"
          inline-template>
          <div :class="{success:row.states=='审核成功',error:row.states=='审核驳回',warning:row.states=='待审核'}">{{row.states}}</div>
        </el-table-column>
        <el-table-column
          inline-template
          :context="_self"
          fixed="right"
          label="操作"
          width="150">
          <div>
            <el-button  size="small" @click="handleAudit($index, row)" :plain="true" type="warning">审核</el-button>
            <el-button type="danger" size="small" @click.native="handleDelete($index, row)" >删除</el-button>
          </div>
        </el-table-column>
      </el-table>
    </el-col>
    <!--分页-->
    <el-col :span="24" class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="200">
      </el-pagination>
    </el-col>
    <!--导入-->
    <el-dialog title="导入模板" v-model="leadDataVisible" size="tiny">
        <el-form :model="drdx" :label-width="'70px'" ref="drdx">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="drdx.name" auto-complete="off" placeholder="请输入规则名称"></el-input>
          </el-form-item>
          <el-form-item label="文件导入" prop="file" class="loadSize">
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="leadDataVisible = false">取 消</el-button>
          <el-button type="primary" @click="leadConfirm">确 定</el-button>
        </div>
    </el-dialog>
    <!--新建-->
    <el-dialog title="新建规则" v-model="addDataVisible" custom-class="dialogAdd">
      <el-row :gutter="20">
        <el-col :span="17" :offset="4">
          <el-form :model="addData" :rules="addRule" ref="addData" :label-width="'100px'">
              <el-form-item label="规则名称"  prop="name">
                  <el-input v-model="addData.name" auto-complete="off" placeholder="规则名称"></el-input>
              </el-form-item>
              <el-form-item label="操作系统"  prop="system">
                  <el-select v-model="addData.system" placeholder="请选择操作系统">
                      <el-option
                              v-for='item in $root._data.systemList'
                              :label="item.label"
                              :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="地区" prop="area">
                  <el-select v-model="addData.area" placeholder="请选择地区">
                      <el-option
                              v-for="item in $root._data.areaList"
                              :label="item.label"
                              :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="注册时长" :label-width="'100px'" prop="times">
                  <el-col :span="8">
                      <el-select v-model="addData.times" placeholder="请选择"  @change="changeTime(value)">
                          <el-option
                                  v-for="item in rangeList"
                                  :label="item.label"
                                  :value="item.value">
                          </el-option>
                      </el-select>
                  </el-col>
                  <el-col :span="12" :offset="2" v-show="showTime">
                      <el-col :span="12">
                          <el-form-item>
                              <el-input type="number" min="0" placeholder="0"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="2" :offset="2">天</el-col>
                  </el-col>
                  <el-col :span="12" :offset="2" v-show="!showTime">
                      <el-col :span="10">
                          <el-form-item>
                              <el-input type="number" min="0" placeholder="0"></el-input>
                          </el-form-item>
                      </el-col>
                      <el-col :span="2" :offset="1">-</el-col>
                      <el-col :span="10" :offset="1">
                          <el-form-item>
                              <el-input type="number" min="0" placeholder="0"></el-input>
                          </el-form-item>
                      </el-col>
                  </el-col>
              </el-form-item>
              <el-form-item label="交易总笔数" prop="tradeNum">
                  <el-row>
                      <el-col :span="8">
                          <el-select v-model="addData.tradeNum" placeholder="请选择" @change="changeStatus(value)">
                              <el-option
                                      v-for="item in rangeList"
                                      :label="item.label"
                                      :value="item.value">
                              </el-option>
                          </el-select>
                      </el-col>
                      <el-col :span="12" :offset="2" v-show="showNum">
                          <el-col :span="12">
                              <el-form-item>
                                  <el-input type="number" min="0" placeholder="0"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="2" :offset="2">次</el-col>
                      </el-col>
                      <el-col :span="12" :offset="2" v-show="!showNum">
                          <el-col :span="10">
                              <el-form-item>
                                  <el-input type="number" min="0" placeholder="0"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="2" :offset="1">-</el-col>
                          <el-col :span="10" :offset="1">
                              <el-form-item>
                                  <el-input type="number" min="0" placeholder="0"></el-input>
                              </el-form-item>
                          </el-col>
                      </el-col>
                  </el-row>
              </el-form-item>
              <el-form-item label="交易总金额"  prop="trade">
                  <el-row>
                      <el-col :span="8">
                          <el-select v-model="addData.trade" placeholder="请选择" @change="changeAmount(value)">
                              <el-option
                                      v-for="item in rangeList"
                                      :label="item.label"
                                      :value="item.value">
                              </el-option>
                          </el-select>
                      </el-col>
                      <el-col :span="12" :offset="2" v-show="showTrade">
                          <el-col :span="12">
                              <el-form-item>
                                  <el-input type="number" min="0" placeholder="0"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="2" :offset="2">天</el-col>
                      </el-col>
                      <el-col :span="12" :offset="2" v-show="!showTrade">
                          <el-col :span="10">
                              <el-form-item>
                                  <el-input type="number" min="0" placeholder="0"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="2" :offset="1">-</el-col>
                          <el-col :span="10" :offset="1">
                              <el-form-item>
                                  <el-input type="number" min="0" placeholder="0"></el-input>
                              </el-form-item>
                          </el-col>
                      </el-col>
                  </el-row>
              </el-form-item>
              <el-form-item label="账户类型" prop="accType">
                  <el-select v-model="addData.accType" placeholder="请选择账户类型">
                      <el-option
                              v-for="item in $root._data.accountTypeList"
                              :label="item.label"
                              :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="商户等级" prop="grade">
                  <el-select v-model="addData.grade" placeholder="请选择商户等级" multiple>
                      <el-option
                              v-for="item in $root._data.merchantGradeList"
                              :label="item.label"
                              :value="item.value">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="分组等级" prop="groupGrade">
                  <el-input v-model="addData.groupGrade" auto-complete="off" placeholder="分组等级"></el-input>
              </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addConfirm">立即创建</el-button>
      </div>
    </el-dialog>
    <!--审核-->
    <el-dialog title="对象审核" custom-class="auditdialog" v-model="auditDataVisible">
      <el-row class="auditbox">
        <el-col :span="12" class="item">
          <label>对象名称：</label><span>{{auditData.name}}</span>
        </el-col>
        <el-col :span="12" class="item">
          <label>模板类型：</label><span>{{auditData.type}}</span>
        </el-col>
        <el-col :span="12" class="item">
          <label>作用于：</label><span>{{auditData.apply}}</span>
        </el-col>
        <el-col :span="12" class="item">
          <label>创建时间：</label><span>{{auditData.time}}</span>
        </el-col>
        <el-col :span="12" class="item">
          <label>导入人员：</label><span>{{auditData.person}}</span>
        </el-col>
      </el-row>
      <el-radio class="radio" v-model="auditVal" label="1">审核通过</el-radio>
      <el-radio class="radio" v-model="auditVal" label="2">审核不通过</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="auditConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>
  export default {
    data () {
        return {
            tableData:[],
            leadDataVisible: false,
            auditDataVisible: false,
            addDataVisible: false,
            formInline: {
                name: '',
                startDate: '',
                endDate: '',
                examineState: '',
                attr: '',
                pageIndex:1,
                pageSize:10
            },
            auditData: {
                name: '',
                type: '',
                apply: '',
                time: '',
                person: ''
            },
            auditVal: '1',
            drdx: {
                name: '',
                file: ''
            },
            addData: {
                name: '',
                system: '',
                times: '',
                area:'',
                tradeNum:'',
                trade:'',
                accType:'',
                grade:[],
                groupGrade:''
            },
            attrList: [
                {
                    value: '1',
                    label: '对象'
                },{
                    value: '2',
                    label: '范围'
                }],
            rangeList: [
                {
                    value: "1",
                    label: "大于等于"
                },{
                    value: "2",
                    label: "小于等于"
                },{
                    value: "3",
                    label: "等于",
                },{
                    value: "4",
                    label: "区间",
                }],
            addRule: {
                name: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                system: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'change'
                }],
                times: [{
                    required: true,
                    message: '请输入验证码',
                    trigger: 'change'
                }],
                area:[{
                    required:true,
                    message:'请选择地区',
                    trigger:'change'
                }],
                tradeNum:[{
                    required:true,
                    message:'请选择地区',
                    trigger:'change'
                }],
                trade:[{
                    required:true,
                    message:'请选择地区',
                    trigger:'change'
                }],
                accType:[{
                    required:true,
                    message:'请选择地区',
                    trigger:'change'
                }],
                groupGrade:[{
                    required:true,
                    message:'请选择地区',
                    trigger:'blur'
                }]
            },
            showTime:true,
            showNum:true,
            showTrade:true,
            id:""
        }
    },
    mounted: function(){
      this.handleSearch ();
    },
    methods: {
      handleSearch () {
        
      },
      handleReset () {
          this.$refs.formInline.resetFields();
      },
      handleLead () {
          this.leadDataVisible = true;
      },
      handleAdd () {
          this.addDataVisible = true;
      },
      handleDownload () {

      },
      handleAudit (index, row) {
      },
      handleDelete (index, row) {
          var vm=this;
          this.$confirm('确定删除此条数据吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {

          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });
          });
      },
      handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
      },
      auditConfirm () {
      },
      addConfirm () {
      },
      leadConfirm () {
      },
      changeTime () {
          if (this.addData.times==4){
              this.showTime=false;
          }else {
              this.showTime=true;
          }
      },
      changeStatus () {
          if (this.addData.tradeNum==4){
              this.showNum=false;
          }else {
              this.showNum=true;
          }
      },
      changeAmount () {
          if (this.addData.trade==4){
              this.showTrade=false;
          }else {
              this.showTrade=true;
          }
      }
    }
  }
</script>
<style lang="sass">
  .el-dialog__header{
    border-top: 4px solid #20A0FF;
    padding: 15px;
    background: #FAFAFC;
    border-bottom: 1px solid #f2f2f2;
  }
  .el-button--text{
    padding-left: 0;
    padding-right: 0;
  }
  .auditdialog {
    .el-dialog__body{
        padding: 20px 20px 0 20px;
    }
    .auditbox{
        padding: 20px 20px 0 20px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        .item{
            margin-bottom: 20px;
        }
    }
  }
  .el-loading-mask {
    background: rgba(0,0,0,0.7);
  }
</style>