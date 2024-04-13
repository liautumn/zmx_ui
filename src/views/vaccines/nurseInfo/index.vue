<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="护士编号" prop="nurseCode">
        <el-input
            v-model="queryParams.nurseCode"
            placeholder="请输入护士编号"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="护士姓名" prop="nurseName">
        <el-input
            v-model="queryParams.nurseName"
            placeholder="请输入护士姓名"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="具体职称" prop="nurseJob">
        <el-input
            v-model="queryParams.nurseJob"
            placeholder="请输入具体职称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工龄" prop="seniority">
        <el-input
            v-model="queryParams.seniority"
            placeholder="请输入工龄"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="nurseSex">
        <el-select v-model="queryParams.nurseSex" placeholder="请选择性别" clearable>
          <el-option
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生日" prop="nurseBirthday">
        <el-date-picker clearable
                        v-model="queryParams.nurseBirthday"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择生日">
        </el-date-picker>
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['vaccines:nurseInfo:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['vaccines:nurseInfo:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['vaccines:nurseInfo:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['vaccines:nurseInfo:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="nurseInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="ID" align="center" prop="id"/>-->
      <el-table-column label="照片" align="center" prop="nursePhoto" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.nursePhoto" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="护士编号" align="center" prop="nurseCode" show-overflow-tooltip/>
      <el-table-column label="护士姓名" align="center" prop="nurseName"/>
      <el-table-column label="具体职称" align="center" prop="nurseJob"/>
      <el-table-column label="工龄" align="center" prop="seniority"/>
      <el-table-column label="性别" align="center" prop="nurseSex">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.nurseSex"/>
        </template>
      </el-table-column>
      <el-table-column label="生日" align="center" prop="nurseBirthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.nurseBirthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="简介" align="center" prop="biography"/>-->
      <el-table-column label="排序" align="center" prop="ext1"/>
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180px" fixed="right">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleUpdate(scope.row, true)"
              v-hasPermi="['vaccines:nurseInfo:detail']"
          >查看
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row, false)"
              v-hasPermi="['vaccines:nurseInfo:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['vaccines:nurseInfo:remove']"
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

    <!-- 添加或修改护士信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" @close="cancel" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :disabled="isShow">
        <el-form-item label="照片" prop="nursePhoto">
          <image-upload v-model="form.nursePhoto" v-if="!isShow || isAdd"/>
          <image-preview :src="form.nursePhoto" :width="170" :height="170" v-if="isShow && !isAdd"/>
        </el-form-item>
        <!--        <el-form-item label="护士编号" prop="nurseCode">-->
        <!--          <el-input v-model="form.nurseCode" placeholder="请输入护士编号"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="护士姓名" prop="nurseName">
          <el-input v-model="form.nurseName" placeholder="请输入护士姓名"/>
        </el-form-item>
        <el-form-item label="具体职称" prop="nurseJob">
          <el-input v-model="form.nurseJob" placeholder="请输入具体职称"/>
        </el-form-item>
        <el-form-item label="工龄" prop="seniority">
          <el-input v-model="form.seniority" type="number" placeholder="请输入工龄"/>
        </el-form-item>
        <el-form-item label="性别" prop="nurseSex">
          <el-radio-group v-model="form.nurseSex">
            <el-radio
                v-for="dict in dict.type.sys_user_sex"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日" prop="nurseBirthday">
          <el-date-picker clearable
                          v-model="form.nurseBirthday"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择生日">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="简介" prop="biography">
          <el-input v-model="form.biography" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="排序" prop="biography">
          <el-input v-model="form.ext1" type="number" placeholder="按顺序，不重复"/>
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
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="!isShow">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listNurseInfo, getNurseInfo, delNurseInfo, addNurseInfo, updateNurseInfo} from "@/api/vaccines/nurseInfo";

export default {
  name: "NurseInfo",
  dicts: ['sys_user_sex', 'sys_normal_disable'],
  data() {
    return {
      isShow: false,
      isAdd: true,
      // 遮罩层
      loading: true,
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
      // 护士信息表格数据
      nurseInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nurseCode: null,
        nurseName: null,
        nurseJob: null,
        seniority: null,
        nurseSex: null,
        nurseBirthday: null,
        state: null,
        ext1: null,
        ext2: null,
        ext3: null,
        ext4: null,
        ext5: null,
        ext6: null,
        ext7: null,
        ext8: null,
        ext9: null,
        ext10: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        nurseName: [
          {required: true, message: "不能为空", trigger: "blur"}
        ],
        nurseJob: [
          {required: true, message: "不能为空", trigger: "blur"}
        ],
        seniority: [
          {required: true, message: "不能为空", trigger: "blur"}
        ],
        nurseSex: [
          {required: true, message: "不能为空", trigger: "blur"}
        ],
        nurseBirthday: [
          {required: true, message: "不能为空", trigger: "blur"}
        ],
        state: [
          {required: true, message: "不能为空", trigger: "blur"}
        ],

      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询护士信息列表 */
    getList() {
      this.loading = true;
      listNurseInfo(this.queryParams).then(response => {
        this.nurseInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.isShow = false;
      this.isAdd = true;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        nursePhoto: null,
        nurseCode: null,
        nurseName: null,
        nurseJob: null,
        seniority: null,
        nurseSex: null,
        nurseBirthday: null,
        biography: null,
        state: '0',
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        ext1: null,
        ext2: null,
        ext3: null,
        ext4: null,
        ext5: null,
        ext6: null,
        ext7: null,
        ext8: null,
        ext9: null,
        ext10: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isAdd = true;
      this.title = "添加护士信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row, flag) {
      this.reset();
      const id = row.id || this.ids
      getNurseInfo(id).then(response => {
        this.form = response.data;
        this.isShow = flag;
        this.isAdd = false;
        this.open = true;
        this.title = "修改护士信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNurseInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNurseInfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除护士信息编号为"' + ids + '"的数据项？').then(function () {
        return delNurseInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('vaccines/nurseInfo/export', {
        ...this.queryParams
      }, `nurseInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
