<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="家长姓名" prop="userName">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入家长姓名"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家长性别" prop="userSex">
        <el-select v-model="queryParams.userSex" placeholder="请选择家长性别" clearable>
          <el-option
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="孩子姓名" prop="childrenName">
        <el-input
            v-model="queryParams.childrenName"
            placeholder="请输入孩子姓名"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="孩子性别" prop="childrenSex">
        <el-select v-model="queryParams.childrenSex" placeholder="请选择孩子性别" clearable>
          <el-option
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="孩子出生日期" prop="childrenBirthday" label-width="80">
        <el-date-picker clearable
                        v-model="queryParams.childrenBirthday"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择孩子出生日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="填报日期" prop="today">
        <el-date-picker clearable
                        v-model="queryParams.today"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择填报日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="家长手机号码" prop="userPhone" label-width="80">
        <el-input
            v-model="queryParams.userPhone"
            placeholder="请输入家长手机号码"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评分" prop="score">
        <el-input
            v-model="queryParams.score"
            placeholder="请输入评分"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input
            v-model="queryParams.state"
            placeholder="请输入状态"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="创建者" prop="createBy">-->
<!--        <el-input-->
<!--            v-model="queryParams.createBy"-->
<!--            placeholder="请输入创建者"-->
<!--            clearable-->
<!--            @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable
                        v-model="queryParams.createTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择创建时间">
        </el-date-picker>
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
            v-hasPermi="['vaccines:userFillInfo:add']"
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
            v-hasPermi="['vaccines:userFillInfo:edit']"
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
            v-hasPermi="['vaccines:userFillInfo:remove']"
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
            v-hasPermi="['vaccines:userFillInfo:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userFillInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="家长姓名" align="center" prop="userName"/>
      <el-table-column label="家长性别" align="center" prop="userSex">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.userSex"/>
        </template>
      </el-table-column>
      <el-table-column label="孩子姓名" align="center" prop="childrenName"/>
      <el-table-column label="孩子性别" align="center" prop="childrenSex">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.childrenSex"/>
        </template>
      </el-table-column>
      <el-table-column label="孩子出生日期" align="center" prop="childrenBirthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.childrenBirthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="填报日期" align="center" prop="today" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.today, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="孩子过敏事项" align="center" prop="childrenAllergy" width="100"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="家长手机号码" align="center" prop="userPhone" width="100"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="家庭住址" align="center" prop="address" :show-overflow-tooltip="true"/>
      <el-table-column label="注意事项" align="center" prop="takeCare" :show-overflow-tooltip="true"/>
      <el-table-column label="评分" align="center" prop="score"/>
      <el-table-column label="意见建议" align="center" prop="opinions" :show-overflow-tooltip="true"/>
      <el-table-column label="状态" align="center" prop="state"/>
      <el-table-column label="创建者" align="center" prop="createBy"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="备注" align="center" prop="remark"/>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['vaccines:userFillInfo:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['vaccines:userFillInfo:remove']"
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

    <!-- 添加或修改用户填报信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <!--        <el-form-item label="用户ID" prop="userId">-->
        <!--          <el-input v-model="form.userId" placeholder="请输入用户ID"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="家长姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入家长姓名"/>
        </el-form-item>
        <el-form-item label="家长性别" prop="userSex">
          <el-radio-group v-model="form.userSex">
            <el-radio
                v-for="dict in dict.type.sys_user_sex"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="孩子姓名" prop="childrenName">
          <el-input v-model="form.childrenName" placeholder="请输入孩子姓名"/>
        </el-form-item>
        <el-form-item label="孩子性别" prop="childrenSex">
          <el-radio-group v-model="form.childrenSex">
            <el-radio
                v-for="dict in dict.type.sys_user_sex"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="孩子出生日期" prop="childrenBirthday">
          <el-date-picker clearable
                          v-model="form.childrenBirthday"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择孩子出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="填报日期" prop="today">
          <el-date-picker clearable disabled
                          v-model="form.today"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择填报日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="孩子过敏事项" prop="childrenAllergy">
          <el-input v-model="form.childrenAllergy" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="家长手机号码" prop="userPhone">
          <el-input v-model="form.userPhone" placeholder="请输入家长手机号码"/>
        </el-form-item>
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="注意事项">
          <editor v-model="form.takeCare" :min-height="192"/>
        </el-form-item>
        <el-form-item label="评分" prop="score">
          <el-rate style="margin-top: 8px"
                   v-model="form.score"
                   :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
        </el-form-item>
        <el-form-item label="意见建议">
          <editor v-model="form.opinions" :min-height="192"/>
        </el-form-item>
        <!--        <el-form-item label="备注" prop="remark">-->
        <!--          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUserFillInfo,
  getUserFillInfo,
  delUserFillInfo,
  addUserFillInfo,
  updateUserFillInfo
} from "@/api/vaccines/userFillInfo";

export default {
  name: "UserFillInfo",
  dicts: ['sys_user_sex'],
  data() {
    return {
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
      // 用户填报信息表格数据
      userFillInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        userSex: null,
        childrenName: null,
        childrenSex: null,
        childrenBirthday: null,
        today: null,
        childrenAllergy: null,
        userPhone: null,
        address: null,
        takeCare: null,
        score: null,
        opinions: null,
        state: null,
        createBy: null,
        createTime: null,
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
        userId: [
          {required: true, message: "用户ID不能为空", trigger: "blur"}
        ],
        userName: [
          {required: true, message: "家长姓名不能为空", trigger: "blur"}
        ],
        userSex: [
          {required: true, message: "家长性别不能为空", trigger: "change"}
        ],
        childrenName: [
          {required: true, message: "孩子姓名不能为空", trigger: "blur"}
        ],
        childrenSex: [
          {required: true, message: "孩子性别不能为空", trigger: "change"}
        ],
        childrenBirthday: [
          {required: true, message: "孩子出生日期不能为空", trigger: "blur"}
        ],
        today: [
          {required: true, message: "填报日期不能为空", trigger: "blur"}
        ],
        childrenAllergy: [
          {required: true, message: "孩子过敏事项不能为空", trigger: "blur"}
        ],
        userPhone: [
          {required: true, message: "家长手机号码不能为空", trigger: "blur"}
        ],
        address: [
          {required: true, message: "家庭住址不能为空", trigger: "blur"}
        ],
        takeCare: [
          {required: true, message: "注意事项不能为空", trigger: "blur"}
        ],
        score: [
          {required: false, message: "评分不能为空", trigger: "blur"}
        ],
        opinions: [
          {required: true, message: "意见建议不能为空", trigger: "blur"}
        ],
        state: [
          {
            required: true,
            message: "状态不能为空",
            trigger: "blur"
          }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户填报信息列表 */
    getList() {
      this.loading = true;
      listUserFillInfo(this.queryParams).then(response => {
        this.userFillInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        userName: null,
        userSex: null,
        childrenName: null,
        childrenSex: null,
        childrenBirthday: null,
        today: new Date(),
        childrenAllergy: null,
        userPhone: null,
        address: null,
        takeCare: null,
        score: null,
        opinions: null,
        state: null,
        createBy: null,
        createTime: null,
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
      this.title = "添加用户填报信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUserFillInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户填报信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateUserFillInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUserFillInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户填报信息编号为"' + ids + '"的数据项？').then(function () {
        return delUserFillInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('vaccines/userFillInfo/export', {
        ...this.queryParams
      }, `userFillInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
