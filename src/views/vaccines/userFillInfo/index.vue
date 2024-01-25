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
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable>
          <el-option
              v-for="dict in dict.type.user_fill_state"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
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
      <el-table-column :key="1" type="selection" width="55" align="center"/>
      <el-table-column :key="2" label="家长姓名" align="center" prop="userName"/>
      <el-table-column :key="3" label="家长性别" align="center" prop="userSex">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.userSex"/>
        </template>
      </el-table-column>
      <el-table-column :key="4" label="孩子姓名" align="center" prop="childrenName"/>
      <el-table-column :key="5" label="孩子性别" align="center" prop="childrenSex">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.childrenSex"/>
        </template>
      </el-table-column>
      <el-table-column :key="6" label="孩子出生日期" align="center" prop="childrenBirthday" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.childrenBirthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :key="7" label="填报日期" align="center" prop="today" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.today, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :key="8" label="孩子过敏事项" align="center" prop="childrenAllergy" width="120"
                       :show-overflow-tooltip="true"/>
      <el-table-column :key="9" label="家长手机号码" align="center" prop="userPhone" width="120"
                       :show-overflow-tooltip="true"/>
      <el-table-column :key="10" label="家庭住址" align="center" prop="address" :show-overflow-tooltip="true"/>
      <!--      <el-table-column label="注意事项" align="center" prop="takeCare" :show-overflow-tooltip="true">-->
      <!--        <template slot-scope="scope">-->
      <!--          <div v-html='scope.row.takeCare'></div>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column :key="11" label="评分" align="center" prop="score">
        <template slot-scope="scope">
          <span>
            {{ scope.row.score }}
          </span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="意见建议" align="center" prop="opinions" :show-overflow-tooltip="true">-->
      <!--        <template slot-scope="scope">-->
      <!--          <div v-html='scope.row.opinions'></div>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column :key="12" label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_fill_state" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column :key="13" label="创建者" align="center" prop="createBy"/>
      <el-table-column :key="14" label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :key="15" label="操作" align="center" class-name="small-padding fixed-width" width="130"
                       fixed="right">
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
        <el-tabs v-model="activeName">
          <el-tab-pane name="first">
            <span slot="label"><i class="el-icon-edit"></i> 填报信息</span>
            <el-row>
              <el-col :span="12">
                <el-form-item label="家长姓名" prop="userName">
                  <el-input v-model="form.userName" placeholder="请输入家长姓名"
                            :disabled="(!this.isAdmin && (this.form.state == '2' || this.form.state == '3' || this.form.state == '4' || this.form.state == '5'))"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="家长性别" prop="userSex">
                  <el-radio-group v-model="form.userSex"
                                  :disabled="(!this.isAdmin && (this.form.state == '2' || this.form.state == '3' || this.form.state == '4' || this.form.state == '5'))">
                    <el-radio
                        v-for="dict in dict.type.sys_user_sex"
                        :key="dict.value"
                        :label="dict.value"
                    >{{ dict.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="孩子姓名" prop="childrenName">
                  <el-input v-model="form.childrenName" placeholder="请输入孩子姓名"
                            :disabled="(!this.isAdmin && (this.form.state == '2' || this.form.state == '3' || this.form.state == '4' || this.form.state == '5'))"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="孩子性别" prop="childrenSex">
                  <el-radio-group v-model="form.childrenSex"
                                  :disabled="(!this.isAdmin && (this.form.state == '2' || this.form.state == '3' || this.form.state == '4' || this.form.state == '5'))">
                    <el-radio
                        v-for="dict in dict.type.sys_user_sex"
                        :key="dict.value"
                        :label="dict.value"
                    >{{ dict.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="孩子出生日期" prop="childrenBirthday">
                  <el-date-picker clearable style="width: 100%"
                                  v-model="form.childrenBirthday"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="请选择孩子出生日期"
                                  :disabled="(!this.isAdmin && (this.form.state == '2' || this.form.state == '3' || this.form.state == '4' || this.form.state == '5'))">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="填报日期" prop="today">
                  <el-date-picker clearable disabled style="width: 100%"
                                  v-model="form.today"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="请选择填报日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="孩子过敏事项" prop="childrenAllergy">
              <el-input v-model="form.childrenAllergy" type="textarea" placeholder="请输入内容"
                        :disabled="(!this.isAdmin && (this.form.state == '2' || this.form.state == '3' || this.form.state == '4' || this.form.state == '5'))"/>
            </el-form-item>
            <el-form-item label="家长手机号码" prop="userPhone">
              <el-input type="number" v-model="form.userPhone" placeholder="请输入家长手机号码"
                        :disabled="(!this.isAdmin && (this.form.state == '2' || this.form.state == '3' || this.form.state == '4' || this.form.state == '5'))"/>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
              <el-input v-model="form.address" type="textarea" placeholder="请输入内容"
                        :disabled="(!this.isAdmin && (this.form.state == '2' || this.form.state == '3' || this.form.state == '4' || this.form.state == '5'))"/>
            </el-form-item>


            <el-form-item label="选择疫苗" prop="ext3"
                          v-if="(operationFlag != 'insert') &&(this.form.ext2 == '1') && isAdmin">
              <el-select v-model="form.ext3" placeholder="请选择接种的疫苗" multiple>
                <el-option
                    v-for="dict in vaccinationInfos"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="需要接种的疫苗" prop="ext1"
                          v-if="(operationFlag != 'insert') && (isAdmin ||  form.state == '4' || form.state == '5')">
              <el-input v-model="form.ext1" type="textarea" placeholder="请输入内容"
                        :disabled="(!this.isAdmin && (this.form.state == '4' || this.form.state == '5'))"/>
            </el-form-item>

            <el-form-item label="注意事项"
                          v-if="(operationFlag != 'insert') && (isAdmin || form.state == '4' || form.state == '5')">
              <editor v-model="form.takeCare" :min-height="192"
                      :readOnly="(!this.isAdmin && (this.form.state == '4' || this.form.state == '5'))"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="second" v-if="(!(operationFlag == 'insert')) && (form.state == '4' || form.state == '5')">
            <span slot="label"><i class="el-icon-star-off"></i> 评价意见</span>
            <el-form-item label="评分" prop="score">
              <div class="feedback">
                <div class="rating" @click="()=>{
                  if(!(!this.isAdmin && (this.form.state == '4' || this.form.state == '5') && !this.form.scoreIsNull)){
                    form.score = 0
                  }
                }">
                  <input
                      :disabled="(!this.isAdmin && (this.form.state == '4' || this.form.state == '5') && !this.form.scoreIsNull)"
                      v-model="form.score" type="radio" value="5" name="rating" id="rating-5">
                  <label for="rating-5"></label>
                  <input
                      :disabled="(!this.isAdmin && (this.form.state == '4' || this.form.state == '5') && !this.form.scoreIsNull)"
                      v-model="form.score" type="radio" value="4" name="rating" id="rating-4">
                  <label for="rating-4"></label>
                  <input
                      :disabled="(!this.isAdmin && (this.form.state == '4' || this.form.state == '5') && !this.form.scoreIsNull)"
                      v-model="form.score" type="radio" value="3" name="rating" id="rating-3">
                  <label for="rating-3"></label>
                  <input
                      :disabled="(!this.isAdmin && (this.form.state == '4' || this.form.state == '5') && !this.form.scoreIsNull)"
                      v-model="form.score" type="radio" value="2" name="rating" id="rating-2">
                  <label for="rating-2"></label>
                  <input
                      :disabled="(!this.isAdmin && (this.form.state == '4' || this.form.state == '5') && !this.form.scoreIsNull)"
                      v-model="form.score" type="radio" value="1" name="rating" id="rating-1">
                  <label for="rating-1"></label>
                  <div class="emoji-wrapper">
                    <div class="emoji">
                      <svg class="rating-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <circle cx="256" cy="256" r="256" fill="#ffd93b"/>
                        <path
                            d="M512 256c0 141.44-114.64 256-256 256-80.48 0-152.32-37.12-199.28-95.28 43.92 35.52 99.84 56.72 160.72 56.72 141.36 0 256-114.56 256-256 0-60.88-21.2-116.8-56.72-160.72C474.8 103.68 512 175.52 512 256z"
                            fill="#f4c534"/>
                        <ellipse transform="scale(-1) rotate(31.21 715.433 -595.455)" cx="166.318" cy="199.829"
                                 rx="56.146" ry="56.13" fill="#fff"/>
                        <ellipse transform="rotate(-148.804 180.87 175.82)" cx="180.871" cy="175.822" rx="28.048"
                                 ry="28.08" fill="#3e4347"/>
                        <ellipse transform="rotate(-113.778 194.434 165.995)" cx="194.433" cy="165.993" rx="8.016"
                                 ry="5.296" fill="#5a5f63"/>
                        <ellipse transform="scale(-1) rotate(31.21 715.397 -1237.664)" cx="345.695" cy="199.819"
                                 rx="56.146" ry="56.13" fill="#fff"/>
                        <ellipse transform="rotate(-148.804 360.25 175.837)" cx="360.252" cy="175.84" rx="28.048"
                                 ry="28.08" fill="#3e4347"/>
                        <ellipse transform="scale(-1) rotate(66.227 254.508 -573.138)" cx="373.794" cy="165.987"
                                 rx="8.016" ry="5.296" fill="#5a5f63"/>
                        <path
                            d="M370.56 344.4c0 7.696-6.224 13.92-13.92 13.92H155.36c-7.616 0-13.92-6.224-13.92-13.92s6.304-13.92 13.92-13.92h201.296c7.696.016 13.904 6.224 13.904 13.92z"
                            fill="#3e4347"/>
                      </svg>
                      <svg class="rating-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <circle cx="256" cy="256" r="256" fill="#ffd93b"/>
                        <path
                            d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z"
                            fill="#f4c534"/>
                        <path
                            d="M328.4 428a92.8 92.8 0 0 0-145-.1 6.8 6.8 0 0 1-12-5.8 86.6 86.6 0 0 1 84.5-69 86.6 86.6 0 0 1 84.7 69.8c1.3 6.9-7.7 10.6-12.2 5.1z"
                            fill="#3e4347"/>
                        <path
                            d="M269.2 222.3c5.3 62.8 52 113.9 104.8 113.9 52.3 0 90.8-51.1 85.6-113.9-2-25-10.8-47.9-23.7-66.7-4.1-6.1-12.2-8-18.5-4.2a111.8 111.8 0 0 1-60.1 16.2c-22.8 0-42.1-5.6-57.8-14.8-6.8-4-15.4-1.5-18.9 5.4-9 18.2-13.2 40.3-11.4 64.1z"
                            fill="#f4c534"/>
                        <path
                            d="M357 189.5c25.8 0 47-7.1 63.7-18.7 10 14.6 17 32.1 18.7 51.6 4 49.6-26.1 89.7-67.5 89.7-41.6 0-78.4-40.1-82.5-89.7A95 95 0 0 1 298 174c16 9.7 35.6 15.5 59 15.5z"
                            fill="#fff"/>
                        <path
                            d="M396.2 246.1a38.5 38.5 0 0 1-38.7 38.6 38.5 38.5 0 0 1-38.6-38.6 38.6 38.6 0 1 1 77.3 0z"
                            fill="#3e4347"/>
                        <path
                            d="M380.4 241.1c-3.2 3.2-9.9 1.7-14.9-3.2-4.8-4.8-6.2-11.5-3-14.7 3.3-3.4 10-2 14.9 2.9 4.9 5 6.4 11.7 3 15z"
                            fill="#fff"/>
                        <path
                            d="M242.8 222.3c-5.3 62.8-52 113.9-104.8 113.9-52.3 0-90.8-51.1-85.6-113.9 2-25 10.8-47.9 23.7-66.7 4.1-6.1 12.2-8 18.5-4.2 16.2 10.1 36.2 16.2 60.1 16.2 22.8 0 42.1-5.6 57.8-14.8 6.8-4 15.4-1.5 18.9 5.4 9 18.2 13.2 40.3 11.4 64.1z"
                            fill="#f4c534"/>
                        <path
                            d="M155 189.5c-25.8 0-47-7.1-63.7-18.7-10 14.6-17 32.1-18.7 51.6-4 49.6 26.1 89.7 67.5 89.7 41.6 0 78.4-40.1 82.5-89.7A95 95 0 0 0 214 174c-16 9.7-35.6 15.5-59 15.5z"
                            fill="#fff"/>
                        <path
                            d="M115.8 246.1a38.5 38.5 0 0 0 38.7 38.6 38.5 38.5 0 0 0 38.6-38.6 38.6 38.6 0 1 0-77.3 0z"
                            fill="#3e4347"/>
                        <path
                            d="M131.6 241.1c3.2 3.2 9.9 1.7 14.9-3.2 4.8-4.8 6.2-11.5 3-14.7-3.3-3.4-10-2-14.9 2.9-4.9 5-6.4 11.7-3 15z"
                            fill="#fff"/>
                      </svg>
                      <svg class="rating-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <circle cx="256" cy="256" r="256" fill="#ffd93b"/>
                        <path
                            d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z"
                            fill="#f4c534"/>
                        <path
                            d="M336.6 403.2c-6.5 8-16 10-25.5 5.2a117.6 117.6 0 0 0-110.2 0c-9.4 4.9-19 3.3-25.6-4.6-6.5-7.7-4.7-21.1 8.4-28 45.1-24 99.5-24 144.6 0 13 7 14.8 19.7 8.3 27.4z"
                            fill="#3e4347"/>
                        <path d="M276.6 244.3a79.3 79.3 0 1 1 158.8 0 79.5 79.5 0 1 1-158.8 0z" fill="#fff"/>
                        <circle cx="340" cy="260.4" r="36.2" fill="#3e4347"/>
                        <g fill="#fff">
                          <ellipse transform="rotate(-135 326.4 246.6)" cx="326.4" cy="246.6" rx="6.5" ry="10"/>
                          <path d="M231.9 244.3a79.3 79.3 0 1 0-158.8 0 79.5 79.5 0 1 0 158.8 0z"/>
                        </g>
                        <circle cx="168.5" cy="260.4" r="36.2" fill="#3e4347"/>
                        <ellipse transform="rotate(-135 182.1 246.7)" cx="182.1" cy="246.7" rx="10" ry="6.5"
                                 fill="#fff"/>
                      </svg>
                      <svg class="rating-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <circle cx="256" cy="256" r="256" fill="#ffd93b"/>
                        <path
                            d="M407.7 352.8a163.9 163.9 0 0 1-303.5 0c-2.3-5.5 1.5-12 7.5-13.2a780.8 780.8 0 0 1 288.4 0c6 1.2 9.9 7.7 7.6 13.2z"
                            fill="#3e4347"/>
                        <path
                            d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z"
                            fill="#f4c534"/>
                        <g fill="#fff">
                          <path
                              d="M115.3 339c18.2 29.6 75.1 32.8 143.1 32.8 67.1 0 124.2-3.2 143.2-31.6l-1.5-.6a780.6 780.6 0 0 0-284.8-.6z"/>
                          <ellipse cx="356.4" cy="205.3" rx="81.1" ry="81"/>
                        </g>
                        <ellipse cx="356.4" cy="205.3" rx="44.2" ry="44.2" fill="#3e4347"/>
                        <g fill="#fff">
                          <ellipse transform="scale(-1) rotate(45 454 -906)" cx="375.3" cy="188.1" rx="12"
                                   ry="8.1"/>
                          <ellipse cx="155.6" cy="205.3" rx="81.1" ry="81"/>
                        </g>
                        <ellipse cx="155.6" cy="205.3" rx="44.2" ry="44.2" fill="#3e4347"/>
                        <ellipse transform="scale(-1) rotate(45 454 -421.3)" cx="174.5" cy="188" rx="12" ry="8.1"
                                 fill="#fff"/>
                      </svg>
                      <svg class="rating-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <circle cx="256" cy="256" r="256" fill="#ffd93b"/>
                        <path
                            d="M512 256A256 256 0 0 1 56.7 416.7a256 256 0 0 0 360-360c58.1 47 95.3 118.8 95.3 199.3z"
                            fill="#f4c534"/>
                        <path
                            d="M232.3 201.3c0 49.2-74.3 94.2-74.3 94.2s-74.4-45-74.4-94.2a38 38 0 0 1 74.4-11.1 38 38 0 0 1 74.3 11.1z"
                            fill="#e24b4b"/>
                        <path
                            d="M96.1 173.3a37.7 37.7 0 0 0-12.4 28c0 49.2 74.3 94.2 74.3 94.2C80.2 229.8 95.6 175.2 96 173.3z"
                            fill="#d03f3f"/>
                        <path
                            d="M215.2 200c-3.6 3-9.8 1-13.8-4.1-4.2-5.2-4.6-11.5-1.2-14.1 3.6-2.8 9.7-.7 13.9 4.4 4 5.2 4.6 11.4 1.1 13.8z"
                            fill="#fff"/>
                        <path
                            d="M428.4 201.3c0 49.2-74.4 94.2-74.4 94.2s-74.3-45-74.3-94.2a38 38 0 0 1 74.4-11.1 38 38 0 0 1 74.3 11.1z"
                            fill="#e24b4b"/>
                        <path
                            d="M292.2 173.3a37.7 37.7 0 0 0-12.4 28c0 49.2 74.3 94.2 74.3 94.2-77.8-65.7-62.4-120.3-61.9-122.2z"
                            fill="#d03f3f"/>
                        <path
                            d="M411.3 200c-3.6 3-9.8 1-13.8-4.1-4.2-5.2-4.6-11.5-1.2-14.1 3.6-2.8 9.7-.7 13.9 4.4 4 5.2 4.6 11.4 1.1 13.8z"
                            fill="#fff"/>
                        <path
                            d="M381.7 374.1c-30.2 35.9-75.3 64.4-125.7 64.4s-95.4-28.5-125.8-64.2a17.6 17.6 0 0 1 16.5-28.7 627.7 627.7 0 0 0 218.7-.1c16.2-2.7 27 16.1 16.3 28.6z"
                            fill="#3e4347"/>
                        <path
                            d="M256 438.5c25.7 0 50-7.5 71.7-19.5-9-33.7-40.7-43.3-62.6-31.7-29.7 15.8-62.8-4.7-75.6 34.3 20.3 10.4 42.8 17 66.5 17z"
                            fill="#e24b4b"/>
                      </svg>
                      <svg class="rating-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <g fill="#ffd93b">
                          <circle cx="256" cy="256" r="256"/>
                          <path
                              d="M512 256A256 256 0 0 1 56.8 416.7a256 256 0 0 0 360-360c58 47 95.2 118.8 95.2 199.3z"/>
                        </g>
                        <path
                            d="M512 99.4v165.1c0 11-8.9 19.9-19.7 19.9h-187c-13 0-23.5-10.5-23.5-23.5v-21.3c0-12.9-8.9-24.8-21.6-26.7-16.2-2.5-30 10-30 25.5V261c0 13-10.5 23.5-23.5 23.5h-187A19.7 19.7 0 0 1 0 264.7V99.4c0-10.9 8.8-19.7 19.7-19.7h472.6c10.8 0 19.7 8.7 19.7 19.7z"
                            fill="#e9eff4"/>
                        <path
                            d="M204.6 138v88.2a23 23 0 0 1-23 23H58.2a23 23 0 0 1-23-23v-88.3a23 23 0 0 1 23-23h123.4a23 23 0 0 1 23 23z"
                            fill="#45cbea"/>
                        <path
                            d="M476.9 138v88.2a23 23 0 0 1-23 23H330.3a23 23 0 0 1-23-23v-88.3a23 23 0 0 1 23-23h123.4a23 23 0 0 1 23 23z"
                            fill="#e84d88"/>
                        <g fill="#38c0dc">
                          <path
                              d="M95.2 114.9l-60 60v15.2l75.2-75.2zM123.3 114.9L35.1 203v23.2c0 1.8.3 3.7.7 5.4l116.8-116.7h-29.3z"/>
                        </g>
                        <g fill="#d23f77">
                          <path
                              d="M373.3 114.9l-66 66V196l81.3-81.2zM401.5 114.9l-94.1 94v17.3c0 3.5.8 6.8 2.2 9.8l121.1-121.1h-29.2z"/>
                        </g>
                        <path
                            d="M329.5 395.2c0 44.7-33 81-73.4 81-40.7 0-73.5-36.3-73.5-81s32.8-81 73.5-81c40.5 0 73.4 36.3 73.4 81z"
                            fill="#3e4347"/>
                        <path
                            d="M256 476.2a70 70 0 0 0 53.3-25.5 34.6 34.6 0 0 0-58-25 34.4 34.4 0 0 0-47.8 26 69.9 69.9 0 0 0 52.6 24.5z"
                            fill="#e24b4b"/>
                        <path
                            d="M290.3 434.8c-1 3.4-5.8 5.2-11 3.9s-8.4-5.1-7.4-8.7c.8-3.3 5.7-5 10.7-3.8 5.1 1.4 8.5 5.3 7.7 8.6z"
                            fill="#fff" opacity=".2"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

            </el-form-item>
            <el-form-item label="意见建议">
              <editor v-model="form.opinions" :min-height="192"
                      :readOnly="(!this.isAdmin && (this.form.state == '4' || this.form.state == '5') && !this.form.scoreIsNull)"/>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div class="dialog-footer">
        <el-button class="btnPublic" type="primary" v-if="!isAdmin && (form.state == '1' || form.state == null)"
                   @click="submitForm('1')">
          保 存
        </el-button>
        <button class="button btnPublic" @click="animateButtonClick"
                v-if="!isAdmin && (form.state == '1' || form.state == null)">
          <span class="default">send</span>
          <span class="success">提交成功</span>
          <div class="left"></div>
          <div class="right"></div>
        </button>

        <el-button class="btnPublic" type="primary" v-if="isAdmin && (form.state == '3' || form.state == '2')"
                   @click="submitForm('4')">通
          过
        </el-button>
        <el-button class="btnPublic" type="primary" v-if="!isAdmin && (form.state == '4')" @click="submitForm('5')">已
          读
        </el-button>
        <el-button class="btnPublic" type="primary" v-if="!isAdmin && (form.state == '5') && form.scoreIsNull"
                   @click="submitForm('5')">评 价
        </el-button>
        <el-button class="btnPublic" type="primary" v-if="isAdmin" @click="submitForm(null)">确 定</el-button>
        <el-button class="btnPublic" @click="cancel">取 消</el-button>
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
import {getVaccinationInfoByMapToLV} from "@/api/vaccines/vaccinesInfo";
import {gsap} from "gsap";
import "@/assets/send/style.css";


export default {
  name: "UserFillInfo",
  dicts: ['sys_user_sex', 'user_fill_state'],
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
          {required: false, message: "孩子过敏事项不能为空", trigger: "blur"}
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
      },
      activeName: 'first',
      isAdmin: false,
      operationFlag: null,
      vaccinationInfos: []
    };
  },
  created() {
    const username = this.$store.state.user.name;
    if (username == 'admin') {
      this.isAdmin = true;
    }
    this.getList();
    this.getVaccinationMethodByMapToLV();
  },
  methods: {
    animateButtonClick() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          document.querySelectorAll(".button").forEach((button) => {
            let getVar = (variable) => getComputedStyle(button).getPropertyValue(variable);
            if (!button.classList.contains("active")) {
              button.classList.add("active");
              gsap.to(button, {
                keyframes: [
                  // 动画关键帧（同提供的脚本中的内容）
                  {
                    "--left-wing-first-x": 50,
                    "--left-wing-first-y": 100,
                    "--right-wing-second-x": 50,
                    "--right-wing-second-y": 100,
                    duration: 0.2,
                    onComplete() {
                      gsap.set(button, {
                        "--left-wing-first-y": 0,
                        "--left-wing-second-x": 40,
                        "--left-wing-second-y": 100,
                        "--left-wing-third-x": 0,
                        "--left-wing-third-y": 100,
                        "--left-body-third-x": 40,
                        "--right-wing-first-x": 50,
                        "--right-wing-first-y": 0,
                        "--right-wing-second-x": 60,
                        "--right-wing-second-y": 100,
                        "--right-wing-third-x": 100,
                        "--right-wing-third-y": 100,
                        "--right-body-third-x": 60,
                      });
                    },
                  },
                  {
                    "--left-wing-third-x": 20,
                    "--left-wing-third-y": 90,
                    "--left-wing-second-y": 90,
                    "--left-body-third-y": 90,
                    "--right-wing-third-x": 80,
                    "--right-wing-third-y": 90,
                    "--right-body-third-y": 90,
                    "--right-wing-second-y": 90,
                    duration: 0.2,
                  },
                  {
                    "--rotate": 50,
                    "--left-wing-third-y": 95,
                    "--left-wing-third-x": 27,
                    "--right-body-third-x": 45,
                    "--right-wing-second-x": 45,
                    "--right-wing-third-x": 60,
                    "--right-wing-third-y": 83,
                    duration: 0.25,
                  },
                  {
                    "--rotate": 55,
                    "--plane-x": -8,
                    "--plane-y": 24,
                    duration: 0.2,
                  },
                  {
                    "--rotate": 40,
                    "--plane-x": 45,
                    "--plane-y": -180,
                    "--plane-opacity": 0,
                    duration: 0.3,
                    onComplete() {
                      setTimeout(() => {
                        button.removeAttribute("style");
                        gsap.fromTo(
                            button,
                            {
                              opacity: 0,
                              y: -8,
                            },
                            {
                              opacity: 1,
                              y: 0,
                              clearProps: true,
                              duration: 0.3,
                              onComplete() {
                                button.classList.remove("active");
                              },
                            }
                        );
                      }, 2000);
                    },
                  }
                ],
                onComplete: () => {
                  // 在动画完成后执行的代码
                  this.animationComplete();
                },
              });
              gsap.to(button, {
                keyframes: [
                  // 动画关键帧（同提供的脚本中的内容）
                  {
                    "--text-opacity": 0,
                    "--border-radius": 0,
                    "--left-wing-background": getVar("--primary-darkest"),
                    "--right-wing-background": getVar("--primary-darkest"),
                    duration: 0.1,
                  },
                  {
                    "--left-wing-background": getVar("--primary"),
                    "--right-wing-background": getVar("--primary"),
                    duration: 0.1,
                  },
                  {
                    "--left-body-background": getVar("--primary-dark"),
                    "--right-body-background": getVar("--primary-darkest"),
                    duration: 0.4,
                  },
                  {
                    "--success-opacity": 1,
                    "--success-scale": 1,
                    duration: 0.25,
                    delay: 0.25,
                  },
                ],
              });
            }
          });
        }
      });
    },
    animationComplete() {
      // 在动画完成后执行的逻辑
      console.log('动画执行完毕！');
      this.submitForm('2');
    },
    getVaccinationMethodByMapToLV() {
      let map = {};
      getVaccinationInfoByMapToLV(map).then(response => {
        this.vaccinationInfos = response.data;
      });
    },
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
        ext10: null,
        scoreIsNull: null
      };
      this.resetForm("form");
      this.activeName = "first";
      this.operationFlag = null;
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
      this.title = "添加";
      this.operationFlag = "insert";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUserFillInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
        this.operationFlag = "update";
      });
    },
    /** 提交按钮 */
    submitForm(roleFlag) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = {
            ...this.form,
            ...{
              "roleFlag": roleFlag,
              "ext3": JSON.stringify(this.form.ext3)
            }
          };
          if (this.form.id != null) {
            updateUserFillInfo(params).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUserFillInfo(params).then(response => {
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

<style scoped lang="scss">
.rating {
  display: flex;
  width: 100%;
  justify-content: center;
  overflow: hidden;
  flex-direction: row-reverse;
  height: 150px;
  position: relative;
}

.rating-0 {
  filter: grayscale(100%);
}

.rating > input {
  display: none;
}

.rating > label {
  cursor: pointer;
  width: 40px;
  height: 40px;
  margin-top: auto;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='126.729' height='126.73'%3e%3cpath fill='%23e3e3e3' d='M121.215 44.212l-34.899-3.3c-2.2-.2-4.101-1.6-5-3.7l-12.5-30.3c-2-5-9.101-5-11.101 0l-12.4 30.3c-.8 2.1-2.8 3.5-5 3.7l-34.9 3.3c-5.2.5-7.3 7-3.4 10.5l26.3 23.1c1.7 1.5 2.4 3.7 1.9 5.9l-7.9 32.399c-1.2 5.101 4.3 9.3 8.9 6.601l29.1-17.101c1.9-1.1 4.2-1.1 6.1 0l29.101 17.101c4.6 2.699 10.1-1.4 8.899-6.601l-7.8-32.399c-.5-2.2.2-4.4 1.9-5.9l26.3-23.1c3.8-3.5 1.6-10-3.6-10.5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 76%;
  transition: 0.3s;
}

.rating > input:checked ~ label,
.rating > input:checked ~ label ~ label {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='126.729' height='126.73'%3e%3cpath fill='%23fcd93a' d='M121.215 44.212l-34.899-3.3c-2.2-.2-4.101-1.6-5-3.7l-12.5-30.3c-2-5-9.101-5-11.101 0l-12.4 30.3c-.8 2.1-2.8 3.5-5 3.7l-34.9 3.3c-5.2.5-7.3 7-3.4 10.5l26.3 23.1c1.7 1.5 2.4 3.7 1.9 5.9l-7.9 32.399c-1.2 5.101 4.3 9.3 8.9 6.601l29.1-17.101c1.9-1.1 4.2-1.1 6.1 0l29.101 17.101c4.6 2.699 10.1-1.4 8.899-6.601l-7.8-32.399c-.5-2.2.2-4.4 1.9-5.9l26.3-23.1c3.8-3.5 1.6-10-3.6-10.5z'/%3e%3c/svg%3e");
}

.rating > input:not(:checked) ~ label:hover,
.rating > input:not(:checked) ~ label:hover ~ label {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='126.729' height='126.73'%3e%3cpath fill='%23d8b11e' d='M121.215 44.212l-34.899-3.3c-2.2-.2-4.101-1.6-5-3.7l-12.5-30.3c-2-5-9.101-5-11.101 0l-12.4 30.3c-.8 2.1-2.8 3.5-5 3.7l-34.9 3.3c-5.2.5-7.3 7-3.4 10.5l26.3 23.1c1.7 1.5 2.4 3.7 1.9 5.9l-7.9 32.399c-1.2 5.101 4.3 9.3 8.9 6.601l29.1-17.101c1.9-1.1 4.2-1.1 6.1 0l29.101 17.101c4.6 2.699 10.1-1.4 8.899-6.601l-7.8-32.399c-.5-2.2.2-4.4 1.9-5.9l26.3-23.1c3.8-3.5 1.6-10-3.6-10.5z'/%3e%3c/svg%3e");
}

.emoji-wrapper {
  width: 100%;
  text-align: center;
  height: 100px;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

.emoji-wrapper:before,
.emoji-wrapper:after {
  content: "";
  height: 15px;
  width: 100%;
  position: absolute;
  left: 0;
  z-index: 1;
}

.emoji-wrapper:before {
  top: 0;
  background: linear-gradient(to bottom, white 0%, white 35%, rgba(255, 255, 255, 0) 100%);
}

.emoji-wrapper:after {
  bottom: 0;
  background: linear-gradient(to top, white 0%, white 35%, rgba(255, 255, 255, 0) 100%);
}

.emoji {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.3s;
}

.emoji > svg {
  margin: 15px 0;
  width: 70px;
  height: 70px;
  flex-shrink: 0;
}

#rating-1:checked ~ .emoji-wrapper > .emoji {
  transform: translateY(-100px);
}

#rating-2:checked ~ .emoji-wrapper > .emoji {
  transform: translateY(-200px);
}

#rating-3:checked ~ .emoji-wrapper > .emoji {
  transform: translateY(-300px);
}

#rating-4:checked ~ .emoji-wrapper > .emoji {
  transform: translateY(-400px);
}

#rating-5:checked ~ .emoji-wrapper > .emoji {
  transform: translateY(-500px);
}

.feedback {
  max-width: 360px;
  background-color: #fff;
  width: 100%;
  padding: 30px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

.dialog-footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  .btnPublic {
    margin-left: 10px;
  }

}
</style>
