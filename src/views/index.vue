<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-badge :value="100" :max="99" class="item">
        <el-button size="small">未读</el-button>
      </el-badge>
      <el-badge :value="50" :max="99" class="item">
        <el-button size="small">待评价</el-button>
      </el-badge>
      <el-badge class="item">
        <el-button size="small">已读</el-button>
      </el-badge>

      <el-form-item label="公司名称" prop="companyName">
        <el-input
            v-model="queryParams.companyName"
            placeholder="请输入公司名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司标识" prop="companyCode">
        <el-input
            v-model="queryParams.companyCode"
            placeholder="请输入公司标识"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable>
          <el-option
              v-for="dict in dict.type.sys_normal_disable"
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

    <el-table v-loading="loading" :data="companysList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id" v-if="false"/>
      <el-table-column label="公司名称" align="center" prop="companyName"/>
      <el-table-column label="公司标识" align="center" prop="companyCode"/>
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['colorDiff:companys:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['colorDiff:companys:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改公司记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-descriptions class="margin-top" title="个人信息" :column="3" border>
<!--        <template slot="extra">-->
<!--          <el-button type="primary" size="small">操作</el-button>-->
<!--        </template>-->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          18100000000
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            居住地
          </template>
          苏州市
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            备注
          </template>
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            联系地址
          </template>
          江苏省苏州市吴中区吴中大道 1188 号
        </el-descriptions-item>
      </el-descriptions>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="margin-top: 10px">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称"/>
        </el-form-item>
        <el-form-item label="公司标识" prop="companyCode">
          <el-input v-model="form.companyCode" placeholder="请输入公司标识"/>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="1"/>
        </el-form-item>

        <el-form-item label="评分" prop="pf">
          <el-rate style="margin-top: 6px"
                   v-model="form.pf"
                   show-text>
          </el-rate>
        </el-form-item>

        <el-form-item label="意见评价" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">已 读</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


export default {
  name: "Index",
  dicts: ['sys_normal_disable'],
  data() {
    return {

      iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],

      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 公司记录表格数据
      companysList: [
        {
          "id": 45345,
          "companyName": "hello",
          "companyCode": "dada",
          "state": '0',
          "sort": 1,
          "remark": "fnfhalkfhasi",
          "createTime": "2024-01-19",
          "pf": ""
        }
      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: null,
        companyCode: null,
        state: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},

    };
  },
  created() {

    // 设置定时器，每2分钟触发一次事件
    setInterval(this.myEvent, 2 * 1000); // 2分钟 = 2 * 60秒 * 1000毫秒

    this.getList();
  },
  methods: {
    myEvent() {
      console.log("事件被触发了！");
      // 在这里添加你想要执行的代码
    },
    /** 查询公司记录列表 */
    getList() {
      // this.loading = true;
      // listCompanys(this.queryParams).then(response => {
      //   this.companysList = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
    }
    ,
// 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    }
    ,
// 表单重置
    reset() {
      this.form = {
        id: null,
        companyName: null,
        companyCode: null,
        state: null,
        sort: null,
        remark: null,
        createTime: null
      };
      this.resetForm("form");
    }
    ,
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    }
    ,
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
    ,
// 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    }
    ,
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公司记录";
    }
    ,
    /** 修改按钮操作 */
    handleUpdate(row) {

      this.form = row;

      // this.reset();
      // const id = row.id || this.ids
      // getCompanys(id).then(response => {
      //   this.form = response.data;
      this.open = true;
      this.title = "修改公司记录";
      // });
    }
    ,
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        console.log(this.form)
        // if (valid) {
        //   if (this.form.id != null) {
        //     updateCompanys(this.form).then(response => {
        //       this.$modal.msgSuccess("修改成功");
        //       this.open = false;
        //       this.getList();
        //     });
        //   } else {
        //     addCompanys(this.form).then(response => {
        //       this.$modal.msgSuccess("新增成功");
        //       this.open = false;
        //       this.getList();
        //     });
        //   }
        // }
      });
    }
    ,
    /** 删除按钮操作 */
    handleDelete(row) {
      // const ids = row.id || this.ids;
      // this.$modal.confirm('是否确认删除公司记录编号为"' + ids + '"的数据项？').then(function () {
      //   return delCompanys(ids);
      // }).then(() => {
      //   this.getList();
      //   this.$modal.msgSuccess("删除成功");
      // }).catch(() => {
      // });
    }
    ,
    /** 导出按钮操作 */
    handleExport() {
      // this.download('colorDiff/companys/export', {
      //   ...this.queryParams
      // }, `companys_${new Date().getTime()}.xlsx`)
    }
  }
}
;
</script>

<style lang="scss" scoped>
.item {
  margin: 0px 30px 15px 0px;
}
</style>
