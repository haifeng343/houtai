<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="活动名称:">
          <el-input v-model="Popname" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item class="ml30" label="创建时间:">
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="paymentListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          v-if="common.haveRight('AddPop')"
          class="Popadd"
          type="primary"
          @click="add()"
        >创建活动</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="paymentListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" width="80" fixed></el-table-column>
        <el-table-column align="center" width="120" label="活动名称">
          <template slot-scope="scope">
            <el-button type="text" @click="showPopName(scope.row)">{{scope.row.Name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" label="展示图片">
          <template slot-scope="scope">
            <el-button type="text" @click="showImg(scope.row)">活动主图</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" label="所属商家">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showPopGroupName(scope.row)"
            >{{scope.row.GroupToken | GroupTokenStatus }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" label="库存/价格">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showBehavior(scope.row)"
            >{{scope.row.ActionType | ActionTypeStatus}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单批规则">
          <template slot-scope="scope">
            <el-button type="text" @click="showeFrequency(scope.row)">查看规则</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" width="120" label="点击行为">
          <template slot-scope="scope">
            <el-button type="text" @click="showBehavior(scope.row)">{{scope.row.Amount*1.0/100}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" label="设备标识">
          <template slot-scope="scope">
            <el-button type="text" @click="showDevice(scope.row)">{{scope.row.Amount*1.0/100}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" label="弹窗频率">
          <template slot-scope="scope">
            <el-button type="text" @click="showeFrequency(scope.row)">{{scope.row.Amount*1.0/100}}</el-button>
          </template>
        </el-table-column>-->
        <el-table-column align="center" width="120" label="抢购批次">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showTiming(scope.row)"
            >{{scope.row.CloseTime}}/{{scope.row.ShowClose==true?'显示':'隐藏'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" label="使用有效期">
          <template slot-scope="scope">
            <el-button type="text" @click="showVlideTime(scope.row)">{{scope.row.CreateTime}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" width="140" label="是否有效">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyPopStatue')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" width="320" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="common.haveRight('DeletePop')"
              type="text"
              @click="deletePop(scope.row)"
            >抢购记录</el-button>
            <el-button
              v-if="common.haveRight('DeletePop')"
              type="text"
              @click="deletePop(scope.row)"
            >活动批次</el-button>
            <el-button
              v-if="common.haveRight('DeletePop')"
              type="text"
              @click="deletePop(scope.row)"
            >活动图片</el-button>
            <el-button
              v-if="common.haveRight('DeletePop')"
              type="text"
              @click="deletePop(scope.row)"
            >额外信息</el-button>
            <el-button
              v-if="common.haveRight('DeletePop')"
              type="text"
              class="red"
              @click="deletePop(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建弹窗 -->
    <el-dialog title="创建弹窗" :visible.sync="addPopVisible" width="800px">
      <el-form ref="addPopForm" :model="addPopForm" label-width="180px" :rules="addPopRules">
        <el-form-item label="弹窗名称:" prop="Name">
          <el-input v-model="addPopForm.Name" placeholder="请输入弹窗名称"></el-input>
        </el-form-item>
        <el-form-item label="分组标识:" prop="GroupToken">
          <el-select v-model="addPopForm.GroupToken" placeholder="请选择分组标识" class="w585">
            <el-option
              v-for="item in GroupTokenForm"
              :label="item.name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展示图片:">
          <div class="addBorder">
            <el-upload
              class="avatar-uploader"
              action="../adminrocket/img/upload"
              :headers="headers"
              name="Pop.Img"
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload1"
            >
              <img v-if="addPopForm.ImgUrl" :src="addPopForm.ImgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="addClose">关闭按钮的图片:</div>
            <el-upload
              class="avatar-uploader"
              action="../adminrocket/img/upload"
              :headers="headers"
              name="Pop.Img"
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
              :before-upload="beforeAvatarUpload1"
            >
              <img v-if="addPopForm.ImgCloseUrl" :src="addPopForm.ImgCloseUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="按钮位置:">
          <div class="addBorder">
            <div class="flex-start">
              <div>X 轴偏移：</div>
              <el-input class="w160" v-model="addPopForm.ClosePositionX"></el-input>
            </div>
            <div class="flex-start ml30">
              <div>Y 轴偏移：</div>
              <el-input class="w160" v-model="addPopForm.ClosePositionY"></el-input>
            </div>
          </div>
          <div class="addBorder mtop20">
            <div class="flex-start">
              <div>按钮高度：</div>
              <el-input class="w160" v-model="addPopForm.CloseHeight"></el-input>
            </div>
            <div class="flex-start ml30">
              <div>按钮宽度：</div>
              <el-input class="w160" v-model="addPopForm.CloseWidth"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="展示图片占屏比(宽/%):" prop="ShowImgWidth">
          <el-input v-model="addPopForm.ShowImgWidth" placeholder="请输入展示图片占屏比"></el-input>
        </el-form-item>
        <el-form-item label="点击前执行参数:">
          <el-select v-model="addPopForm.ExecuteParams" placeholder="请选择点击前执行参数" class="w585">
            <el-option
              v-for="item in ExecuteParamsForm"
              :label="item.name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="点击行为:" prop="ActionType">
          <el-select v-model="addPopForm.ActionType" placeholder="请选择点击行为" class="w585">
            <el-option
              v-for="item in ActionTypeForm"
              :label="item.name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="点击参数:">
          <el-input v-model="addPopForm.ActionParams" placeholder="请输入点击参数"></el-input>
        </el-form-item>
        <el-form-item label="设备标识:" prop="PopCheckType">
          <el-select v-model="addPopForm.PopCheckType" placeholder="请选择设备标识" class="w585">
            <el-option
              v-for="item in PopCheckTypeForm"
              :label="item.name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期类型:" prop="PopCircleType">
          <el-select v-model="addPopForm.PopCircleType" placeholder="请选择日期类型" class="w585">
            <el-option
              v-for="item in PopCircleTypeForm"
              :label="item.name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单期次数:" prop="PopCircleCount">
          <el-input v-model="addPopForm.PopCircleCount" placeholder="-1表示不限次数"></el-input>
        </el-form-item>
        <el-form-item label="总次数:" prop="PopTotalCount">
          <el-input v-model="addPopForm.PopTotalCount" placeholder="-1表示不限总次数"></el-input>
        </el-form-item>
        <el-form-item label="开始时间:">
          <div class="flex-start">
            <div>：</div>
            <el-date-picker
              v-model="addPopForm.StartTime"
              class="w160"
              type="datetime"
              placeholder="选择开始时间"
            ></el-date-picker>
            <div class="ml30">结束时间：</div>
            <el-date-picker
              v-model="addPopForm.EndTime"
              class="w160"
              type="datetime"
              placeholder="选择结束时间"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="任务标识:">
          <el-select v-model="addPopForm.ReceiveToken" placeholder="请选择任务标识" class="w585">
            <el-option
              v-for="item in taskForm"
              :label="item.Name"
              :key="item.ReceiveToken"
              :value="item.ReceiveToken"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定时关闭(ms):" prop="CloseTime">
          <div class="flex-start">
            <el-input class="w160" v-model="addPopForm.CloseTime" placeholder="-1表示没有定时关闭"></el-input>
            <div class="flex-start ml30">
              显示关闭按钮
              <el-form-item>
                <el-radio-group class="ml30" v-model="addPopForm.ShowClose">
                  <el-radio :label="1">显示</el-radio>
                  <el-radio :label="2">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="排序值:" prop="OrderIndex">
          <el-input v-model="addPopForm.OrderIndex" placeholder="请输入排序值"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPopVisible = false" size="medium">取 消</el-button>
        <el-button @click="addPop('addPopForm')" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑活动名称 -->
    <el-dialog title=" 编辑活动名称" :visible.sync="editPopNameVisible" width="800px">
      <el-form
        ref="editPopNameForm"
        :model="editPopNameForm"
        label-width="135px"
        :rules="editPopNameRules"
      >
        <el-form-item label="活动名称:">
          <el-input v-model="editPopNameForm.Name" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动简介:">
          <el-input type="textarea" rows="5" v-model="editPopNameForm.Name" placeholder="请输入活动简介"></el-input>
        </el-form-item>
        <el-form-item label="URL链接:">
          <el-input v-model="editPopNameForm.Name" placeholder="请输入URL链接"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPopNameVisible = false" size="medium">取 消</el-button>
        <el-button
          v-if="common.haveRight('ModifyPopName')"
          @click="modifyPopName('editPopNameForm')"
          type="primary"
          size="medium"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分组标识 -->
    <el-dialog title=" 编辑分组标识-" :visible.sync="editPopGroupNameVisible" width="800px">
      <el-form
        ref="editPopGroupNameForm"
        :model="editPopGroupNameForm"
        label-width="135px"
        :rules="editPopGroupNameRules"
      >
        <el-form-item label="分组标识:" prop="GroupToken">
          <el-select v-model="editPopGroupNameForm.GroupToken" placeholder="请选择分组标识" class="w585">
            <el-option
              v-for="item in GroupTokenForm"
              :label="item.name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPopGroupNameVisible = false" size="medium">取 消</el-button>
        <el-button
          v-if="common.haveRight('ModifyPopGroupToken')"
          @click="modifyPopGroupName('editPopGroupNameForm')"
          type="primary"
          size="medium"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑预览图片 -->
    <el-dialog title="编辑预览图片-" :visible.sync="editPopImgVisible" width="800px">
      <el-form
        ref="editPopImgForm"
        :model="editPopImgForm"
        label-width="180px"
        :rules="editPopImgRules"
      >
        <el-form-item label="展示图片:">
          <div class="addBorder">
            <el-upload
              class="avatar-uploader"
              action="../adminrocket/img/upload"
              :headers="headers"
              name="Pop.Img"
              :show-file-list="false"
              :on-success="handleAvatarSuccess3"
              :before-upload="beforeAvatarUpload1"
            >
              <img v-if="editPopImgForm.ImgUrlShow" :src="editPopImgForm.ImgUrlShow" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="addClose">关闭按钮的图片:</div>
            <el-upload
              class="avatar-uploader"
              action="../adminrocket/img/upload"
              :headers="headers"
              name="Pop.Img"
              :show-file-list="false"
              :on-success="handleAvatarSuccess4"
              :before-upload="beforeAvatarUpload1"
            >
              <img
                v-if="editPopImgForm.CloseImgUrlShow"
                :src="editPopImgForm.CloseImgUrlShow"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="展示图片占屏比(宽/%):" prop="ShowImgWidth">
          <el-input v-model="editPopImgForm.ShowImgWidth" placeholder="请输入展示图片占屏比"></el-input>
        </el-form-item>
        <el-form-item label="按钮位置:">
          <div class="addBorder">
            <div class="flex-start">
              <div>X 轴偏移：</div>
              <el-input class="w160" v-model="editPopImgForm.ClosePositionX"></el-input>
            </div>
            <div class="flex-start ml30">
              <div>Y 轴偏移：</div>
              <el-input class="w160" v-model="editPopImgForm.ClosePositionY"></el-input>
            </div>
          </div>
          <div class="addBorder mtop20">
            <div class="flex-start">
              <div>按钮高度：</div>
              <el-input class="w160" v-model="editPopImgForm.CloseHeight"></el-input>
            </div>
            <div class="flex-start ml30">
              <div>按钮宽度：</div>
              <el-input class="w160" v-model="editPopImgForm.CloseWidth"></el-input>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPopImgVisible = false" size="medium">取 消</el-button>
        <el-button
          v-if="common.haveRight('ModifyPopShowImg')"
          @click="modifyPopImgSend()"
          type="primary"
          size="medium"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑库存价格 -->
    <el-dialog title=" 编辑库存价格" :visible.sync="editPopBehaviorVisible" width="800px">
      <el-form
        ref="editPopBehaviorForm"
        :model="editPopBehaviorForm"
        label-width="135px"
        :rules="editPopBehaviorRules"
      >
        <el-form-item label="单词抢购数量:">
          <div class="flex-start">
            <el-input v-model="editPopFrequencyForm.PopCircleCount" class="w160" placeholder></el-input>
            <div class="ml30">
              活动总分数:
              <el-input v-model="editPopFrequencyForm.PopCircleCount" class="w160" placeholder></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="价格类型:">
          <div class="flex-start">
            <el-select v-model="addPopForm.ReceiveToken" placeholder="请选择价格类型" class="w160">
              <el-option
                v-for="item in taskForm"
                :label="item.Name"
                :key="item.ReceiveToken"
                :value="item.ReceiveToken"
              ></el-option>
            </el-select>
            <div class="ml30">
              <el-input v-model="editPopFrequencyForm.PopCircleCount" class="w160" placeholder></el-input>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPopBehaviorVisible = false" size="medium">取 消</el-button>
        <el-button
          v-if="common.haveRight('ModifyPopAction')"
          @click="modifyPopBehavior('editPopBehaviorForm')"
          type="primary"
          size="medium"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑设备标识 -->
    <el-dialog title=" 编辑设备标识-" :visible.sync="editPopDeviceVisible" width="800px">
      <el-form
        ref="editPopDeviceForm"
        :model="editPopDeviceForm"
        label-width="135px"
        :rules="editPopDeviceRules"
      >
        <el-form-item label="设备标识:" prop="device">
          <el-select v-model="editPopDeviceForm.device" placeholder="请选择设备标识" class="w585">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPopDeviceVisible = false" size="medium">取 消</el-button>
        <el-button @click="modifyPopDevice()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑单批规则 -->
    <el-dialog title=" 编辑单批规则-" :visible.sync="editPopFrequencyVisible" width="800px">
      <el-form
        ref="editPopFrequencyForm"
        :model="editPopFrequencyForm"
        label-width="180px"
        :rules="editPopFrequencyRules"
      >
        <el-form-item label="单批最大分数:">
          <el-input v-model="editPopFrequencyForm.PopCircleCount" placeholder></el-input>
        </el-form-item>
        <el-form-item label="单人单批抢购次数:">
          <div class="flex-start">
            <el-input v-model="editPopFrequencyForm.PopCircleCount" class="w160" placeholder></el-input>
            <div class="ml30">
              单人抢购总次数:
              <el-input v-model="editPopFrequencyForm.PopCircleCount" class="w160" placeholder></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="单批最大有效时间(分):">
          <el-input v-model="editPopFrequencyForm.PopCircleCount" placeholder></el-input>
        </el-form-item>
        <el-form-item label="提前展示时间(分):">
          <div class="flex-start">
            <el-input v-model="editPopFrequencyForm.PopCircleCount" class="w160" placeholder></el-input>
            <div class="ml30">
              延迟展示时间(分):
              <el-input v-model="editPopFrequencyForm.PopCircleCount" class="w160" placeholder></el-input>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPopFrequencyVisible = false" size="medium">取 消</el-button>
        <el-button
          v-if="common.haveRight('ModifyPopRule')"
          @click="modifyPopFrequency('editPopFrequencyForm')"
          type="primary"
          size="medium"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑抢购批次 -->
    <el-dialog title=" 编辑抢购批次" :visible.sync="editPopTimingVisible" width="800px">
      <el-form
        ref="editPopTimingForm"
        :model="editPopTimingForm"
        label-width="135px"
        :rules="editPopTimingRules"
      >
        <el-form-item label="每批间隔类型:">
          <div class="flex-start">
            <el-select v-model="addPopForm.ReceiveToken" placeholder="请选择价格类型" class="w160">
              <el-option
                v-for="item in taskForm"
                :label="item.Name"
                :key="item.ReceiveToken"
                :value="item.ReceiveToken"
              ></el-option>
            </el-select>
            <div class="ml30">
              <el-input v-model="editPopFrequencyForm.PopCircleCount" class="w160" placeholder></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="抢购批次总数:">
          <div class="flex-start">
            <el-input v-model="editPopFrequencyForm.PopCircleCount" class="w585" placeholder></el-input>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPopTimingVisible = false" size="medium">取 消</el-button>
        <el-button
          v-if="common.haveRight('ModifyPopCloseTime')"
          @click="modifyPopTiming('editPopTimingForm')"
          type="primary"
          size="medium"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑排序值 -->
    <el-dialog title=" 编辑排序值" :visible.sync="editPopSortVisible" width="800px">
      <el-form
        ref="editPopSortForm"
        :model="editPopSortForm"
        label-width="135px"
        :rules="editPopSortRules"
      >
        <el-form-item label="排序值:" prop="OrderIndex">
          <el-input v-model="editPopSortForm.OrderIndex" placeholder="请输入排序值"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPopSortVisible = false" size="medium">取 消</el-button>
        <el-button
          v-if="common.haveRight('ModifyPopOrderIndex')"
          @click="modifyPopSort('editPopSortForm')"
          type="primary"
          size="medium"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑使用有效期 -->
    <el-dialog title=" 编辑使用有效期" :visible.sync="editPopVlideTimeVisible" width="800px">
      <el-form
        ref="editPopVlideTimeForm"
        :model="editPopVlideTimeForm"
        label-width="135px"
        :rules="editPopVlideTimeRules"
      >
        <el-form-item label="有效器类型:">
          <div class="flex-start">
            <el-select v-model="addPopForm.ReceiveToken" placeholder="请选择有效期类型" class="w160">
              <el-option
                v-for="item in taskForm"
                :label="item.Name"
                :key="item.ReceiveToken"
                :value="item.ReceiveToken"
              ></el-option>
            </el-select>
            <div class="ml30"></div>
            <el-date-picker
              v-model="editPopVlideTimeForm.end"
              type="datetime"
            ></el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPopVlideTimeVisible = false" size="medium">取 消</el-button>
        <el-button @click="modifyPopVlideTime()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="paymentListCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  popList,
  popAdd,
  popDelete,
  popStatusModify,
  popOrderindexModify,
  popNameModify,
  popGrouptokenModify,
  popActionModify,
  popClosetimenModify,
  popShowimgModify,
  popRuleModify,
  popTaskList
} from "api/pop.js";
export default {
  name: "RushBuy",
  data() {
    return {
      taskForm: [], //任务列表
      Popname: "", //弹窗名称
      searchTime: "", //创建时间
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      paymentListTable: [], //列表
      Id: "", //当前Id
      addPopVisible: false, //创建弹窗
      addPopRules: {
        Name: [{ required: true, message: "请输入弹窗名称", trigger: "blur" }],
        ActionParams: [
          { required: true, message: "请输入点击参数", trigger: "blur" }
        ],
        PopCircleCount: [
          { required: true, message: "请输入单期次数", trigger: "blur" }
        ],
        PopTotalCount: [
          { required: true, message: "请输入总次数", trigger: "blur" }
        ],
        CloseTime: [
          { required: true, message: "请输入定时关闭", trigger: "blur" }
        ],
        OrderIndex: [
          { required: true, message: "请输入排序值", trigger: "blur" }
        ],
        ActionType: [
          { required: true, message: "请选择点击行为", trigger: "change" }
        ],
        ReceiveToken: [
          { required: true, message: "请选择任务标识", trigger: "change" }
        ],
        ExecuteParams: [
          { required: true, message: "请选择点击前执行参数", trigger: "change" }
        ],
        PopCheckType: [
          { required: true, message: "请选择设备标识", trigger: "change" }
        ],
        PopCircleType: [
          { required: true, message: "请选择日期类型", trigger: "change" }
        ],
        GroupToken: [
          { required: true, message: "请选择分组标识", trigger: "change" }
        ],
        ShowImgWidth: [
          { required: true, message: "请输入展示图片占屏比", trigger: "blur" }
        ],
        imageUrl: [{ required: true, message: "请选择图片", trigger: "blur" }]
      },
      ActionTypeForm: [
        //点击行为
        {
          Id: 0,
          name: "无行为"
        },
        {
          Id: 1,
          name: "本地跳转"
        },
        {
          Id: 2,
          name: "url跳转"
        }
      ],
      ExecuteParamsForm: [
        {
          Id: "",
          name: "无行为"
        },
        {
          Id: "receiveTasks",
          name: "领取任务"
        }
      ],
      GroupTokenForm: [
        //分组标识
        {
          Id: "index",
          name: "首页"
        }
      ],
      PopCheckTypeForm: [
        //设备标识
        {
          Id: 0,
          name: "每设备每账户"
        },
        {
          Id: 1,
          name: "每设备"
        },
        {
          Id: 2,
          name: "每账户"
        }
      ],
      PopCircleTypeForm: [
        {
          Id: 1,
          name: "天"
        },
        {
          Id: 2,
          name: "月"
        }
      ],
      addPopForm: {
        //弹窗form
        Name: "", //弹窗名称
        GroupToken: "", //分组标识
        ExecuteParams: "",
        ShowImgWidth: "",
        ImgUrl: "", //展示图片
        ImgPath: "", //图片路径
        ImgClosePath: "", //关闭图片路径
        ImgCloseUrl: "", //关闭图片
        CloseTime: "", //关闭时间
        ClosePositionX: "", //关闭按钮X方向偏移量
        ClosePositionY: "", //关闭按钮Y方向偏移量
        CloseHeight: "", //关闭按钮高度
        CloseWidth: "", //关闭按钮宽度
        ActionParams: "", //点击行为参数
        PopCheckType: "", //0每设备每账户 1每设备 2每账户
        ShowClose: "", //1显示2隐藏
        ActionType: "", //点击行为 0.无行为 1.本地跳转 2.url跳转 3.执行本地代码
        ActionParams: "", //点击行为参数
        PopCircleType: "", //弹窗周期类型 1.天 2.月
        PopCircleCount: "", //单周期内弹窗次数（-1标识无限制）
        PopTotalCount: "", //弹窗总次数(-1标识无限制)
        ReceiveToken: "", //	领取标识
        OrderIndex: "", //排序值
        StartTime: "", //有效起始时间
        EndTime: "" //有效终止时间
      },

      editPopNameVisible: false, //编辑弹窗名称
      editPopNameRules: {
        Name: [{ required: true, message: "请输入弹窗名称", trigger: "blur" }]
      },
      editPopNameForm: {
        //弹窗form
        Name: ""
      },

      editPopGroupNameVisible: false, //编辑分组标识
      editPopGroupNameRules: {
        GroupToken: [
          { required: true, message: "请输入分组标识", trigger: "change" }
        ]
      },
      editPopGroupNameForm: {
        //弹窗form
        GroupToken: ""
      },

      editPopImgVisible: false, //编辑预览图片
      editPopImgRules: {
        ShowImgWidth: [
          { required: true, message: "请输入展示图片占屏比", trigger: "blur" }
        ]
      },
      editPopImgForm: {
        ImgUrl: "",
        ShowImgWidth: "",
        ImgUrlShow: "",
        CloseImgUrl: "",
        CloseImgUrlShow: "",
        ClosePositionX: "",
        ClosePositionY: "",
        CloseHeight: "",
        CloseWidth: ""
      },

      editPopBehaviorVisible: false, //编辑点击行为弹窗
      editPopBehaviorRules: {
        ActionType: [
          { required: true, message: "请选择点击行为", trigger: "change" }
        ],
        ExecuteParams: [
          { required: true, message: "请选择点击前执行参数", trigger: "change" }
        ],
        ActionParams: [
          { required: true, message: "请输入点击行为参数", trigger: "blur" }
        ]
      },
      editPopBehaviorForm: {
        ActionType: "",
        ActionParams: "",
        ExecuteParams: ""
      },

      editPopDeviceVisible: false, //编辑设备标识
      editPopDeviceRules: {},
      editPopDeviceForm: {
        device: ""
      },

      editPopFrequencyVisible: false, //编辑弹窗频率
      editPopFrequencyRules: {
        PopCheckType: [
          { required: true, message: "请选择设备标识", trigger: "change" }
        ],
        PopCircleType: [
          { required: true, message: "请选择日期类型", trigger: "change" }
        ],
        PopCircleCount: [
          { required: true, message: "请输入单期次数", trigger: "blur" }
        ],
        PopTotalCount: [
          { required: true, message: "请输入总次数", trigger: "blur" }
        ],
        StartTime: [
          { required: true, message: "请选择开始时间", trigger: "change" }
        ],
        EndTime: [
          { required: true, message: "请选择结束时间", trigger: "change" }
        ]
        // ReceiveToken: [
        //   { required: true, message: "请选择任务标识", trigger: "change" }
        // ]
      },
      editPopFrequencyForm: {
        PopCheckType: "",
        PopCircleType: "",
        PopCircleCount: "",
        PopTotalCount: "",
        StartTime: "",
        EndTime: "",
        ReceiveToken: ""
      },

      editPopTimingVisible: false, //编辑定时关闭
      editPopTimingRules: {
        CloseTime: [
          {
            required: true,
            message: "请输入关闭按钮定时关闭时间",
            trigger: "blur"
          }
        ],
        ShowClose: [
          {
            required: true,
            message: "请输入关闭按钮定时关闭时间",
            trigger: "change"
          }
        ]
      },
      editPopTimingForm: {
        CloseTime: "",
        ShowClose: ""
      },

      editPopSortVisible: false, //编辑排序值
      editPopSortRules: {
        OrderIndex: [
          { required: true, message: "请输入排序值", trigger: "blur" }
        ]
      },
      editPopSortForm: {
        OrderIndex: ""
      },

      editPopVlideTimeVisible: false, //编辑有效时间
      editPopVlideTimeRules: {},
      editPopVlideTimeForm: {
        begin: "",
        end: ""
      }
    };
  },
  filters: {
    ActionTypeStatus(param) {
      switch (param) {
        case 0:
          return "无行为";
        case 1:
          return "本地跳转";
        case 2:
          return "url跳转";
      }
    },
    GroupTokenStatus(param) {
      switch (param) {
        case "index":
          return "首页";
      }
    }
    // rechargeCode(param){
    //   switch(param){
    //     case 1:
    //     return '支付成功';
    //     case 2:
    //     return '充值成功'
    //     case 3:
    //     return '退款中';
    //     case 4:
    //     return '退款成功'
    //   }
    // }
  },
  created() {
    this._getPopList();
    this._popTaskList();
  },
  computed: {
    headers() {
      let token = localStorage.getItem("userToken");
      let obj = {
        userToken: token
      };
      return obj;
    }
  },
  methods: {
    //获取任务列表
    _popTaskList() {
      var par = {
        TaskName: "",
        StartTime: "",
        EndTime: "",
        PageCount: 100,
        PageIndex: 1,
        Status: 1
      };
      popTaskList(par, 243).then(res => {
        this.taskForm = res.List;
      });
    },
    //搜索
    paymentListSearch() {
      this.pageIndex = 1;
      this._getPopList();
    },
    //列表分页变化
    paymentListCurrentChange(val) {
      this.pageIndex = val;
      this._getPopList();
    },
    //显示修改弹窗名称
    showPopName(item) {
      this.Id = item.Id;
      this.editPopNameForm.Name = item.Name;
      this.editPopNameVisible = true;
    },

    //修改弹窗名称
    modifyPopName(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._popNameModify();
          this.editPopNameVisible = false;
        } else {
          return false;
        }
      });
    },
    _popNameModify() {
      var par = {
        Id: this.Id,
        Name: this.editPopNameForm.Name
      };
      popNameModify(par, 249).then(res => {
        this._getPopList();
      });
    },
    //创建弹窗
    add() {
      this.addPopVisible = true;
      this.addPopForm = {};
      this.$refs["addPopForm"].resetFields();
    },
    //上传图片
    handleAvatarSuccess1(res, file) {
      this.addPopForm.ImgUrl = res.Data.ImgUrl;
      this.addPopForm.ImgPath = res.Data.ImgPath;
    },
    beforeAvatarUpload1(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

    handleAvatarSuccess2(res, file) {
      this.addPopForm.ImgCloseUrl = res.Data.ImgUrl;
      this.addPopForm.ImgClosePath = res.Data.ImgPath;
    },
    //上传图片
    handleAvatarSuccess3(res, file) {
      this.editPopImgForm.ImgUrlShow = res.Data.ImgUrl;
      this.editPopImgForm.ImgUrl = res.Data.ImgPath;
    },
    //上传图片
    handleAvatarSuccess4(res, file) {
      this.editPopImgForm.CloseImgUrlShow = res.Data.ImgUrl;
      this.editPopImgForm.CloseImgUrl = res.Data.ImgPath;
    },
    //确定添加
    addPop(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._getAddPop();
          this.addPopVisible = false;
        } else {
          return false;
        }
      });
    },

    //显示修改分组标识弹窗
    showPopGroupName(item) {
      this.Id = item.Id;
      this.editPopGroupNameForm.GroupToken = item.GroupToken;
      this.editPopGroupNameVisible = true;
    },

    //修改分组标识弹窗
    modifyPopGroupName(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._popGrouptokenModify();
          this.$refs[formName].resetFields();
          this.editPopGroupNameVisible = false;
        } else {
          return false;
        }
      });
    },
    _popGrouptokenModify() {
      var par = {
        Id: this.Id,
        GroupToken: this.editPopGroupNameForm.GroupToken
      };
      popGrouptokenModify(par, 250).then(res => {
        this._getPopList();
      });
    },
    //显示预览图片弹窗
    showImg(item) {
      this.Id = item.Id;
      this.editPopImgForm.ImgUrl = item.ImgUrl;
      this.editPopImgForm.ImgUrlShow = item.ImgUrlShow;
      this.editPopImgForm.CloseImgUrl = item.CloseImgUrl;
      this.editPopImgForm.CloseImgUrlShow = item.CloseImgUrlShow;
      this.editPopImgForm.ClosePositionX = item.ClosePositionX;
      this.editPopImgForm.ClosePositionY = item.ClosePositionY;
      this.editPopImgForm.CloseHeight = item.CloseHeight;
      this.editPopImgForm.CloseWidth = item.CloseWidth;
      this.editPopImgForm.ShowImgWidth = item.ShowImgWidth;
      this.editPopImgVisible = true;
    },
    //修改预览图片
    modifyPopImgSend() {
      this._popShowimgModify();
      this.editPopImgVisible = false;
    },
    _popShowimgModify() {
      var par = {
        Id: this.Id,
        ImgUrl: this.editPopImgForm.ImgUrl,
        CloseImgUrl: this.editPopImgForm.CloseImgUrl,
        ClosePositionX: this.editPopImgForm.ClosePositionX,
        ClosePositionY: this.editPopImgForm.ClosePositionY,
        CloseHeight: this.editPopImgForm.CloseHeight,
        ShowImgWidth: this.editPopImgForm.ShowImgWidth,
        CloseWidth: this.editPopImgForm.CloseWidth
      };
      popShowimgModify(par, 253).then(res => {
        this._getPopList();
      });
    },
    //显示点击行为弹窗
    showBehavior(item) {
      this.Id = item.Id;
      this.editPopBehaviorForm.ActionType = item.ActionType;
      this.editPopBehaviorForm.ExecuteParams = item.ExecuteParams;
      this.editPopBehaviorForm.ActionParams = item.ActionParams;
      this.editPopBehaviorVisible = true;
    },
    //修改点击行为
    modifyPopBehavior(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._popActionModify();
          this.$refs[formName].resetFields();
          this.editPopBehaviorVisible = false;
        } else {
          return false;
        }
      });
    },
    _popActionModify() {
      var par = {
        Id: this.Id,
        ActionType: this.editPopBehaviorForm.ActionType,
        ActionParams: this.editPopBehaviorForm.ActionParams,
        ExecuteParams: this.editPopBehaviorForm.ExecuteParams
      };
      popActionModify(par, 251).then(res => {
        this._getPopList();
      });
    },
    //显示设备标识弹窗
    showDevice(item) {
      this.editPopDeviceVisible = true;
    },
    //修改设备标识
    modifyPopDevice() {},

    //显示弹窗规则
    showeFrequency(item) {
      this.Id = item.Id;
      this.editPopFrequencyForm.PopCheckType = item.PopCheckType;
      this.editPopFrequencyForm.PopCircleType = item.PopCircleType;
      this.editPopFrequencyForm.PopCircleCount = item.PopCircleCount;
      this.editPopFrequencyForm.PopTotalCount = item.PopTotalCount;
      this.editPopFrequencyForm.StartTime = item.StartTime;
      this.editPopFrequencyForm.EndTime = item.EndTime;
      this.editPopFrequencyForm.ReceiveToken = item.ReceiveToken;
      this.editPopFrequencyVisible = true;
    },

    //修改弹窗规则
    modifyPopFrequency(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._popRuleModify();
          this.$refs[formName].resetFields();
          this.editPopFrequencyVisible = false;
        } else {
          return false;
        }
      });
    },
    _popRuleModify() {
      var par = {
        Id: this.Id,
        PopCheckType: this.editPopFrequencyForm.PopCheckType,
        PopCircleType: this.editPopFrequencyForm.PopCircleType,
        PopCircleCount: this.editPopFrequencyForm.PopCircleCount,
        PopTotalCount: this.editPopFrequencyForm.PopTotalCount,
        StartTime: this.editPopFrequencyForm.StartTime,
        EndTime: this.editPopFrequencyForm.EndTime,
        ReceiveToken: this.editPopFrequencyForm.ReceiveToken
      };
      popRuleModify(par, 254).then(res => {
        this._getPopList();
      });
    },

    //显示弹窗定时关闭
    showTiming(item) {
      this.Id = item.Id;
      this.editPopTimingForm.CloseTime = item.CloseTime;
      this.editPopTimingForm.ShowClose = item.ShowClose == true ? 1 : 2;
      this.editPopTimingVisible = true;
    },
    //修改弹窗定时关闭
    modifyPopTiming(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._popClosetimenModify();
          this.$refs[formName].resetFields();
          this.editPopTimingVisible = false;
        } else {
          return false;
        }
      });
    },
    _popClosetimenModify() {
      var par = {
        Id: this.Id,
        CloseTime: this.editPopTimingForm.CloseTime,
        ShowClose:
          this.editPopTimingForm.CloseTime == -1
            ? true
            : this.editPopTimingForm.ShowClose == 1
            ? true
            : false
      };
      popClosetimenModify(par, 252).then(res => {
        this._getPopList();
      });
    },
    //显示排序值
    showSort(item) {
      this.editPopSortVisible = true;
      this.Id = item.Id;
      this.editPopSortForm.OrderIndex = item.OrderIndex;
    },
    //修改排序值
    modifyPopSort(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._popOrderindexModify();
          this.$refs[formName].resetFields();
          this.editPopSortVisible = false;
        } else {
          return false;
        }
      });
    },
    _popOrderindexModify() {
      var par = {
        Id: this.Id,
        OrderIndex: this.editPopSortForm.OrderIndex
      };
      popOrderindexModify(par, 248).then(res => {
        this._getPopList();
      });
    },
    //显示有效时间
    showVlideTime(item) {
      this.editPopVlideTimeVisible = true;
    },
    //修改有效时间
    modifyPopVlideTime() {},

    //修改是否有效
    changeStatus(status, item) {
      this._popStatusModify(item.Id, status);
    },
    _popStatusModify(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return popStatusModify(par, 246);
    },
    //添加弹窗
    _getAddPop() {
      var par = {
        Name: this.addPopForm.Name,
        GroupToken: this.addPopForm.GroupToken,
        ImgUrl: this.addPopForm.ImgPath,
        CloseImgUrl: this.addPopForm.ImgClosePath,
        CloseTime: this.addPopForm.CloseTime,
        ClosePositionX: this.addPopForm.ClosePositionX,
        ClosePositionY: this.addPopForm.ClosePositionY,
        CloseHeight: this.addPopForm.CloseHeight,
        CloseWidth: this.addPopForm.CloseWidth,
        ActionParams: this.addPopForm.ActionParams,
        PopCheckType: this.addPopForm.PopCheckType,
        PopCircleType: this.addPopForm.PopCircleType,
        PopCircleCount: this.addPopForm.PopCircleCount,
        PopTotalCount: this.addPopForm.PopTotalCount,
        ReceiveToken: this.addPopForm.ReceiveToken,
        OrderIndex: this.addPopForm.OrderIndex,
        ExecuteParams: this.addPopForm.ExecuteParams,
        ShowClose: this.addPopForm.ShowClose == 1 ? true : false,
        StartTime: this.addPopForm.StartTime,
        ShowImgWidth: this.addPopForm.ShowImgWidth,
        EndTime: this.addPopForm.EndTime
      };
      return popAdd(par, 244).then(res => {
        this.addPopForm = false;
        this._getPopList();
      });
    },
    //获取弹窗列表
    _getPopList() {
      var par = {
        PopName: this.Popname,
        StartTime: this.searchTime != null ? this.searchTime[0] : "",
        EndTime: this.searchTime != null ? this.searchTime[1] : "",
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return popList(par, 243).then(res => {
        this.paymentListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //删除
    deletePop(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._delete(item.Id).then(val => {
            this._getPopList();
          });
        })
        .catch(() => {});
    },
    //删除
    _delete(id) {
      var par = {
        Id: id
      };
      return popDelete(par, 245);
    }
  }
};
</script>

<style scoped lang='less'>
.Popadd {
  position: absolute;
  right: 40px;
}
.addBorder {
  display: flex;
  justify-content: flex-start;
}
.addClose {
  margin: 0 20px 0 30px;
}
.w160 {
  width: 160px;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
}
.posiLeft {
  position: absolute;
  left: -30px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px solid #ccc;
}
.mtop20 {
  margin-top: 20px;
}
.w585 {
  width: 540px;
}
.ml30 {
  margin-left: 53px;
}
</style>
<style>
.avatar {
  width: 180px !important;
  height: 180px !important;
}
</style>
