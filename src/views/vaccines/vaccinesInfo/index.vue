<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="疫苗名称" prop="vaccinesName">
        <el-input
            v-model="queryParams.vaccinesName"
            placeholder="请输入疫苗名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="疫苗标识" prop="vaccinesCode">
        <el-input
            v-model="queryParams.vaccinesCode"
            placeholder="请输入疫苗标识"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接种方式" prop="vaccinationMethodCode">
        <el-select v-model="queryParams.vaccinationMethodCode" placeholder="请选择接种方式" clearable>
          <el-option
              v-for="dict in vaccinationMethodInfo"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="最小年龄(天)" prop="ageMin">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.ageMin"-->
      <!--            placeholder="请输入最小年龄(天)"-->
      <!--            clearable-->
      <!--            @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="最大年龄(天)" prop="ageMax">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.ageMax"-->
      <!--            placeholder="请输入最大年龄(天)"-->
      <!--            clearable-->
      <!--            @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
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
            v-hasPermi="['vaccines:vaccinesInfo:add']"
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
            v-hasPermi="['vaccines:vaccinesInfo:edit']"
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
            v-hasPermi="['vaccines:vaccinesInfo:remove']"
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
            v-hasPermi="['vaccines:vaccinesInfo:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vaccinesInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="疫苗名称" align="center" prop="vaccinesName" width="180"/>
      <el-table-column label="疫苗标识" align="center" prop="vaccinesCode"/>
      <el-table-column label="接种方式" align="center" prop="vaccinationMethodCode"/>
      <el-table-column label="最小年龄(天)" align="center" prop="ageMin"/>
      <el-table-column label="最大年龄(天)" align="center" prop="ageMax"/>
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用数量" align="center" prop="ext1" :show-overflow-tooltip="true"/>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['vaccines:vaccinesInfo:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['vaccines:vaccinesInfo:remove']"
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

    <!-- 添加或修改疫苗信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="疫苗名称" prop="vaccinesName">
          <el-input v-model="form.vaccinesName" placeholder="请输入疫苗名称"/>
        </el-form-item>
        <el-form-item label="疫苗标识" prop="vaccinesCode">
          <el-input v-model="form.vaccinesCode" placeholder="请输入疫苗标识"/>
        </el-form-item>
        <el-form-item label="接种方式" prop="vaccinationMethodCode">
          <el-select v-model="form.vaccinationMethodCode" placeholder="请选择接种方式">
            <el-option
                v-for="dict in vaccinationMethodInfo"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最小年龄(天)" prop="ageMin">
          <el-input v-model="form.ageMin" type="number" placeholder="请输入最小年龄(天)"/>
        </el-form-item>
        <el-form-item label="最大年龄(天)" prop="ageMax">
          <el-input v-model="form.ageMax" type="number" placeholder="请输入最大年龄(天)"/>
        </el-form-item>
        <el-form-item label="可用数量" prop="ext1">
          <el-input v-model="form.ext1" type="number" placeholder="请输入可用的疫苗数量"/>
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listVaccinesInfo,
  getVaccinesInfo,
  delVaccinesInfo,
  addVaccinesInfo,
  updateVaccinesInfo
} from "@/api/vaccines/vaccinesInfo";
import {getVaccinationMethodByMapToLV} from "@/api/vaccines/vaccinationMethodInfo";

export default {
  name: "VaccinesInfo",
  dicts: ['sys_normal_disable'],
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
      // 疫苗信息表格数据
      vaccinesInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        vaccinesName: null,
        vaccinesCode: null,
        vaccinationMethodCode: null,
        ageMin: null,
        ageMax: null,
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
        vaccinesName: [
          {required: true, message: "疫苗名称不能为空", trigger: "blur"}
        ],
        vaccinesCode: [
          {required: true, message: "疫苗标识不能为空", trigger: "blur"}
        ],
        vaccinationMethodCode: [
          {required: true, message: "接种方式不能为空", trigger: "change"}
        ],
        ageMin: [
          {required: true, message: "最小年龄(天)不能为空", trigger: "blur"}
        ],
        ageMax: [
          {required: true, message: "最大年龄(天)不能为空", trigger: "blur"}
        ],
        ext1: [
          {required: true, message: "数量不能为空", trigger: "blur"}
        ],
        state: [
          {required: true, message: "状态不能为空", trigger: "change"}
        ],
      },
      vaccinationMethodInfo: []
    };
  },
  created() {
    this.getList();
    this.getVaccinationMethodByMapToLV();
  },
  methods: {
    getVaccinationMethodByMapToLV() {
      let map = {};
      getVaccinationMethodByMapToLV(map).then(response => {
        this.vaccinationMethodInfo = response.data;
      });
    },
    /** 查询疫苗信息列表 */
    getList() {
      this.loading = true;
      listVaccinesInfo(this.queryParams).then(response => {
        this.vaccinesInfoList = response.rows;
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
        vaccinesName: null,
        vaccinesCode: null,
        vaccinationMethodCode: null,
        ageMin: null,
        ageMax: null,
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
      this.title = "添加疫苗信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getVaccinesInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改疫苗信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateVaccinesInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVaccinesInfo(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除疫苗信息编号为"' + ids + '"的数据项？').then(function () {
        return delVaccinesInfo(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('vaccines/vaccinesInfo/export', {
        ...this.queryParams
      }, `vaccinesInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
