<template>
  <div>
    <div class="sheetItemFrame">
      <div class="sheetItemTitle">
        课程列表
        <el-button
          class="right-button"
          @click="showAddItemDialog()"
          type="primary"
          size="medium"
          v-if="common.haveRight('AddSheetItemGroup')"
        >添加课程</el-button>
      </div>
      <div class="item-border" v-if="groupList!=null && groupList.length>0">
        <div class="item-group" v-for="item in groupList" :key="item.GroupId">
          <div class="item-group-title">
            <span class="item-group-title-left">{{item.GroupName}}(</span>
            <span v-if="item.MinCount>0">可同时选择{{item.MinCount}}个，最多{{item.MaxCount}}个</span>
            <span v-if="item.MinCount==0 && item.MaxCount>=item.ItemList.length">包含全部</span>
            <span
              v-if="item.MinCount==0 && item.MaxCount<item.ItemList.length"
            >{{item.ItemList.length}}选{{item.MaxCount}}</span>
            <span>)</span>
            <span class="item-group-title-right">
              <el-button
                v-if="common.haveRight('ModifySheetItemGroup')"
                @click="showEditItemDialog(item)"
                type="text"
              >编 辑</el-button>
              <el-button
                v-if="common.haveRight('DeleteSheetItemGroup')"
                @click="deleteItem(item)"
                type="text"
                class="red"
              >删 除</el-button>
            </span>
          </div>
          <div>
            <el-collapse v-model="item.storeIdList">
              <el-collapse-item
                v-for="y in item.StoreList"
                :key="y.StoreId"
                :title="y.StoreName"
                :name="y.StoreId"
                style="margin-left:20px;"
              >
                <div class="item-group-content">
                  <span v-for="x in y.ItemList" :key="x.SheetItemRelId" class="item">
                    <img :src="x.ItemCoverShowImg" style="margin-top:20px;" />
                    <span>
                      <label>{{x.ItemName}}</label>
                      <label style="float:right;color:red">￥{{x.Price*1.0/100}}</label>
                    </span>
                  </span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
    <div class="cell_dashed"></div>
    <div class="sheetItemFrame">
      <div class="sheetItemTitle">
        基础价格列表
        <div class="right-button">
          <el-button
            v-if="common.haveRight('CopySheetPrice1')"
            @click="showCopyDialog(1)"
            type="primary"
            size="medium"
          >批量拷贝</el-button>
          <el-button
            v-if="common.haveRight('AddSheetNormalPrice')"
            @click="showAddBasePriceDialog()"
            type="primary"
            size="medium"
          >添加价格</el-button>
        </div>
      </div>
      <el-table :data="basePriceTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" width="61px;" fixed></el-table-column>
        <el-table-column prop="Count" align="center" label="选择数量"></el-table-column>
        <el-table-column prop="Price" align="center" label="价格（元）">
          <template slot-scope="scope">{{scope.row.Price*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="Status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeBasePriceStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySheetNormalPriceStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="common.haveRight('ModifySheetNormalPrice')"
              type="text"
              @click="showEditBasePriceDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="common.haveRight('DeleteSheetNormalPrice')"
              type="text"
              @click="deleteBasePrice(scope.row)"
              class="red"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cell_dashed"></div>
    <div class="sheetItemFrame">
      <div class="sheetItemTitle">
        特殊价格列表
        <el-button
          class="right-button"
          @click="showAddSpecialPriceDialog()"
          type="primary"
          size="medium"
          v-if="common.haveRight('AddSheetSpecialPrice')"
        >添加价格</el-button>
      </div>
      <el-table :data="specialPriceTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" width="61px;" fixed></el-table-column>
        <el-table-column prop="ItemName" align="center" label="课程名称"></el-table-column>
        <el-table-column prop="Price" align="center" label="价格（元）">
          <template slot-scope="scope">{{scope.row.Price*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="Status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeSpecialPriceStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySheetSpecialPriceStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="common.haveRight('ModifySheetSpecialPrice')"
              type="text"
              @click="showEditSpecialPriceDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="common.haveRight('DeleteSheetSpecialPrice')"
              type="text"
              @click="deleteSpecialPrice(scope.row)"
              class="red"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cell_dashed"></div>
    <div class="sheetItemFrame">
      <div class="sheetItemTitle">
        验券后退款规则
        <div class="right-button">
          <el-button
            @click="showCopyDialog(2)"
            type="primary"
            size="medium"
            v-if="common.haveRight('CopySheetPrice2')"
          >批量拷贝</el-button>
          <el-button
            class="right-button"
            @click="showAddRefundRulesDialog()"
            type="primary"
            size="medium"
            v-if="common.haveRight('AddSheetRefundRules')"
          >添加规则</el-button>
        </div>
      </div>
      <el-table :data="refundRulesTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" width="61px;" fixed></el-table-column>
        <el-table-column prop="Name" align="center" label="规则名称"></el-table-column>
        <el-table-column prop="Count" align="center" label="课程数量/门"></el-table-column>
        <el-table-column prop="Status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeRefundRulesStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySheetRefundRulesStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="jumpToRefundRulesBasePrice(scope.row)">基础价格</el-button>
            <el-button type="text" @click="jumpToRefundRulesSpecialPrice(scope.row)">特殊价格</el-button>
            <el-button
              v-if="common.haveRight('ModifySheetRefundRules')"
              type="text"
              @click="showEditRefundRulesDialog(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="common.haveRight('DeleteSheetRefundRules')"
              type="text"
              @click="deleteRefundRules(scope.row)"
              class="red"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cell_dashed"></div>
    <div class="sheetItemFrame" v-loading="loading" element-loading-text="正在初始化特殊价格">
      <div class="sheetItemTitle">
        验券后奖励规则
        <div class="right-button">
          <el-button
            @click="PrizeSpecialPriceInit()"
            type="primary"
            size="medium"
            v-if="prizeRulesTable.length>0 && common.haveRight('PrizeSpecialPriceInit')"
          >初始化特殊价格</el-button>
          <el-button @click="showCopyDialog(3)" type="primary" size="medium"  v-if="common.haveRight('CopySheetPrice3')" >批量拷贝</el-button>
          <el-button
            class="right-button"
            @click="showAddPrizeRulesDialog()"
            type="primary"
            size="medium"
            v-if="common.haveRight('AddSheetPrizeRules')"
          >添加规则</el-button>
        </div>
      </div>
      <el-table :data="prizeRulesTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" width="61px;" fixed></el-table-column>
        <el-table-column prop="Name" align="center" label="规则名称"></el-table-column>
        <el-table-column prop="Count" align="center" label="课程数量/门"></el-table-column>
        <el-table-column prop="Status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changePrizeRulesStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySheetPrizeRulesStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="jumpToPrizeRulesBasePrice(scope.row)">基础价格</el-button>
            <el-button type="text" @click="jumpToPrizeRulesSpecialPrice(scope.row)">特殊价格</el-button>
            <el-button v-if="common.haveRight('ModifySheetPrizeRules')" type="text" @click="showEditPrizeRulesDialog(scope.row)">编辑</el-button>
            <el-button v-if="common.haveRight('DeleteSheetPrizeRules')" type="text" @click="deletePrizeRules(scope.row)" class="red">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加项目弹窗 -->
    <el-dialog title="添加课程" :visible.sync="addItemVisible" width="1030px">
      <el-form ref="addItemForm" :model="addItemForm" label-width="100px" :rules="ItemFormRules">
        <el-form-item label="分组名称:" prop="groupName">
          <el-input v-model="addItemForm.groupName"></el-input>
        </el-form-item>
        <el-form-item label="课程列表:">
          <div class="item-border">
            <el-collapse v-model="allItemList2IdList">
              <el-collapse-item
                v-for="y in allItemList2"
                :key="y.StoreId"
                :title="y.StoreName"
                :name="y.StoreId"
                style="margin-left:20px;"
              >
                <el-checkbox-group v-model="addItemForm.itemCheckList">
                  <div class="item-group-content">
                    <div v-for="item in y.ItemList" :key="item.Id" class="item">
                      <img :src="item.ItemCoverShowImg" />
                      <div>
                        <el-checkbox
                          :label="item.Id"
                          :disabled="item.Disabled==true"
                        >{{item.ItemName}}</el-checkbox>
                        <span style="float:right;color:red;">￥{{item.Price*1.0/100}}</span>
                      </div>
                    </div>
                  </div>
                </el-checkbox-group>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form-item>
        <label>
          您已选择{{addItemForm.itemCheckList.length}}个课程，可同时选择最少
          <el-input style="width:100px;" v-model="addItemForm.minCount"></el-input>个，最多
          <el-input style="width:100px;" v-model="addItemForm.maxCount"></el-input>个（-1表示全部）
        </label>
        <br />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-checkbox
          v-model="addItemForm.tolerate"
          style="float:left;margin-top:10px;margin-left:20px;"
        >商家端默认团单分类</el-checkbox>
        <el-checkbox
          v-model="addItemForm.isShowName"
          style="float:left;margin-top:10px;margin-left:20px;"
        >前端是否展示分组名称</el-checkbox>
        <el-button @click="addItemVisible = false" size="medium">取 消</el-button>
        <el-button @click="addItemOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑项目弹窗 -->
    <el-dialog
      :title="`编辑课程-${editItemForm.groupName}`"
      :visible.sync="editItemVisible"
      width="1030px"
    >
      <el-form ref="editItemForm" :model="editItemForm" label-width="100px" :rules="ItemFormRules">
        <el-form-item label="分组名称:" prop="groupName">
          <el-input v-model="editItemForm.groupName"></el-input>
        </el-form-item>
        <el-form-item label="课程列表:">
          <div class="item-border">
            <el-collapse v-model="allItemList2IdList">
              <el-collapse-item
                v-for="y in allItemList2"
                :key="y.StoreId"
                :title="y.StoreName"
                :name="y.StoreId"
                style="margin-left:20px;"
              >
                <el-checkbox-group v-model="editItemForm.itemCheckList">
                  <div class="item-group-content">
                    <div v-for="item in y.ItemList" :key="item.Id" class="item">
                      <img :src="item.ItemCoverShowImg" />
                      <div>
                        <el-checkbox
                          :label="item.Id"
                          :disabled="item.Disabled==true"
                        >{{item.ItemName}}</el-checkbox>
                        <span style="float:right;color:red;">￥{{item.Price*1.0/100}}</span>
                      </div>
                    </div>
                  </div>
                </el-checkbox-group>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form-item>
        <label>
          您已选择{{editItemForm.itemCheckList.length}}个课程，可同时选择最少
          <el-input style="width:100px;" v-model="editItemForm.minCount"></el-input>个，最多
          <el-input style="width:100px;" v-model="editItemForm.maxCount"></el-input>个（-1表示全部）
        </label>
        <br />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-checkbox
          v-model="editItemForm.tolerate"
          style="float:left;margin-top:10px;margin-left:20px;"
        >商家端默认团单分类</el-checkbox>
        <el-checkbox
          v-model="editItemForm.isShowName"
          style="float:left;margin-top:10px;margin-left:20px;"
        >前端是否展示分组名称</el-checkbox>
        <el-button @click="editItemVisible = false" size="medium">取 消</el-button>
        <el-button @click="editItemOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加基础价格弹窗 -->
    <el-dialog title="添加基础价格" :visible.sync="addBasePriceVisible" width="633px">
      <el-form
        ref="addBasePriceForm"
        :model="addBasePriceForm"
        label-width="120px"
        :rules="BasePriceFormRules"
      >
        <el-form-item label="选择数量:" prop="count">
          <el-input v-model="addBasePriceForm.count"></el-input>
        </el-form-item>
        <el-form-item label="价格（分）：" prop="price">
          <el-input v-model="addBasePriceForm.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBasePriceVisible = false" size="medium">取 消</el-button>
        <el-button @click="addBasePriceOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑基础价格弹窗 -->
    <el-dialog title="编辑基础价格" :visible.sync="editBasePriceVisible" width="633px">
      <el-form
        ref="editBasePriceForm"
        :model="editBasePriceForm"
        label-width="120px"
        :rules="BasePriceFormRules"
      >
        <el-form-item label="选择数量:" prop="count">
          <el-input v-model="editBasePriceForm.count" disabled></el-input>
        </el-form-item>
        <el-form-item label="价格（分）：" prop="price">
          <el-input v-model="editBasePriceForm.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBasePriceVisible = false" size="medium">取 消</el-button>
        <el-button @click="editBasePriceOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加特殊价格弹窗 -->
    <el-dialog title="添加特殊价格" :visible.sync="addSpecialPriceVisible" width="633px">
      <el-form
        ref="addSpecialPriceForm"
        :model="addSpecialPriceForm"
        label-width="120px"
        :rules="SpecialPriceFormRules"
      >
        <el-form-item label="选择课程:" prop="itemRelId">
          <el-select v-model="addSpecialPriceForm.itemRelId" filterable placeholder="请选择">
            <el-option
              v-for="item in allItemList"
              :key="item.Id"
              :label="item.ItemName"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格（分）：" prop="price">
          <el-input v-model="addSpecialPriceForm.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSpecialPriceVisible = false" size="medium">取 消</el-button>
        <el-button @click="addSpecialPriceOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑特殊价格弹窗 -->
    <el-dialog title="编辑特殊价格" :visible.sync="editSpecialPriceVisible" width="633px">
      <el-form
        ref="editSpecialPriceForm"
        :model="editSpecialPriceForm"
        label-width="120px"
        :rules="SpecialPriceFormRules"
      >
        <el-form-item label="选择课程:" prop="itemRelId">
          <el-select v-model="editSpecialPriceForm.itemRelId" filterable placeholder="请选择" disabled>
            <el-option
              v-for="item in allItemList"
              :key="item.Id"
              :label="item.ItemName"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格（分）：" prop="price">
          <el-input v-model="editSpecialPriceForm.price"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSpecialPriceVisible = false" size="medium">取 消</el-button>
        <el-button @click="editSpecialPriceOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加退款规则弹窗 -->
    <el-dialog title="添加退款规则" :visible.sync="addRefundRulesVisible" width="633px">
      <el-form
        ref="addRefundRulesForm"
        :model="addRefundRulesForm"
        label-width="120px"
        :rules="RefundRulesFormRules"
      >
        <el-form-item label="课程数量/门：" prop="count">
          <el-input v-model="addRefundRulesForm.count"></el-input>
        </el-form-item>
        <el-form-item label="规则名称:" prop="rulesName">
          <el-input v-model="addRefundRulesForm.rulesName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRefundRulesVisible = false" size="medium">取 消</el-button>
        <el-button @click="addRefundRulesOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑退款规则弹窗 -->
    <el-dialog title="编辑退款规则" :visible.sync="editRefundRulesVisible" width="633px">
      <el-form
        ref="editRefundRulesForm"
        :model="editRefundRulesForm"
        label-width="120px"
        :rules="RefundRulesFormRules"
      >
        <el-form-item label="课程数量/门：" prop="count">
          <el-input v-model="editRefundRulesForm.count" disabled></el-input>
        </el-form-item>
        <el-form-item label="规则名称:" prop="rulesName">
          <el-input v-model="editRefundRulesForm.rulesName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRefundRulesVisible = false" size="medium">取 消</el-button>
        <el-button @click="editRefundRulesOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加奖励规则弹窗 -->
    <el-dialog title="添加奖励规则" :visible.sync="addPrizeRulesVisible" width="633px">
      <el-form
        ref="addPrizeRulesForm"
        :model="addPrizeRulesForm"
        label-width="120px"
        :rules="PrizeRulesFormRules"
      >
        <el-form-item label="课程数量/门：" prop="count">
          <el-input v-model="addPrizeRulesForm.count"></el-input>
        </el-form-item>
        <el-form-item label="规则名称:" prop="rulesName">
          <el-input v-model="addPrizeRulesForm.rulesName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPrizeRulesVisible = false" size="medium">取 消</el-button>
        <el-button @click="addPrizeRulesOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑奖励规则弹窗 -->
    <el-dialog title="编辑奖励规则" :visible.sync="editPrizeRulesVisible" width="633px">
      <el-form
        ref="editPrizeRulesForm"
        :model="editPrizeRulesForm"
        label-width="120px"
        :rules="PrizeRulesFormRules"
      >
        <el-form-item label="课程数量/门：" prop="count">
          <el-input v-model="editPrizeRulesForm.count" disabled></el-input>
        </el-form-item>
        <el-form-item label="规则名称:" prop="rulesName">
          <el-input v-model="editPrizeRulesForm.rulesName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPrizeRulesVisible = false" size="medium">取 消</el-button>
        <el-button @click="editPrizeRulesOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量拷贝弹窗 -->
    <el-dialog title="批量拷贝" :visible.sync="copyVisible" width="633px">
      <el-form ref="copyForm" :model="copyForm" label-width="120px" :rules="copyRules">
        <el-form-item label="拷贝团单:" prop="sheetId">
          <el-select v-model="copyForm.sheetId" filterable placeholder="请选择">
            <el-option
              v-for="item in copyForm.sheetList"
              :key="item.SheetId"
              :label="item.SheetName"
              :value="item.SheetId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyVisible = false" size="medium">取 消</el-button>
        <el-button @click="copyOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetSheetItemGroupList,
  GetSheetNormalPriceList,
  GetSheetSpecialPriceList,
  GetSheetRefundRulesList,
  GetSheetPrizeRulesList,
  activitygroupStoreList,
  AddSheetItemGroup,
  ModifySheetItemGroup,
  DeleteSheetItemGroup,
  AddSheetNormalPrice,
  ModifySheetNormalPrice,
  DeleteSheetNormalPrice,
  ModifySheetNormalPriceStatus,
  AddSheetSpecialPrice,
  ModifySheetSpecialPrice,
  DeleteSheetSpecialPrice,
  ModifySheetSpecialPriceStatus,
  AddSheetRefundRules,
  ModifySheetRefundRules,
  DeleteSheetRefundRules,
  ModifySheetRefundRulesStatus,
  AddSheetPrizeRules,
  ModifySheetPrizeRules,
  DeleteSheetPrizeRules,
  ModifySheetPrizeRulesStatus,
  sheetList,
  CopySheetPrice,
  PrizeSpecialPriceInit
} from "api/sheet.js";
export default {
  name: "SheetItem",
  data() {
    return {
      w: [],
      sheetId: 0, //团单Id
      activityGroupId: 0, //活动组列表
      groupId: 0,
      groupList: [], //分组列表
      basePriceTable: [], //基础价格列表
      specialPriceTable: [], //特殊价格列表
      refundRulesTable: [], //退款规则列表
      prizeRulesTable: [], //奖励规则列表
      allItemList: [], //所有项目列表
      allItemList2: [], //所有项目列表2
      allItemList2IdList: [],
      ItemFormRules: {
        groupName: [
          { required: true, message: "请输入分组名称", trigger: "blur" }
        ]
      },
      addItemVisible: false, //添加项目弹窗是否显示
      addItemForm: {
        groupName: "", //分组名称
        itemCheckList: [], //选中的项目
        minCount: "", //可选择最少数量
        maxCount: "", //可选择最多数量
        isShowName:true,//前端是否显示分组名称
        tolerate: false //是否开放权限给商家
      },
      editItemVisible: false, //编辑弹窗
      editItemForm: {
        groupId: 0, //分组Id
        groupName: "", //分组名称
        itemCheckList: [], //选中的项目
        minCount: "", //可选择最少数量
        maxCount: "", //可选择最多数量
        isShowName:true,//前端是否显示分组名称
        tolerate: false //是否开放权限给商家
      },
      BasePriceFormRules: {
        count: [{ required: true, message: "请输入数量", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }]
      },
      addBasePriceVisible: false, //添加基础价格弹窗是否显示
      addBasePriceForm: {
        count: "",
        price: ""
      },
      editBasePriceVisible: false, //编辑基础价格弹窗是否显示
      editBasePriceForm: {
        id: 0,
        count: "",
        price: ""
      },
      SpecialPriceFormRules: {
        itemRelId: [{ required: true, message: "请选择课程", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }]
      },
      addSpecialPriceVisible: false, //添加特殊价格弹窗是否显示
      addSpecialPriceForm: {
        itemRelId: "",
        price: ""
      },
      editSpecialPriceVisible: false, //编辑特殊价格弹窗是否显示
      editSpecialPriceForm: {
        id: 0,
        itemRelId: "",
        price: ""
      },
      RefundRulesFormRules: {
        rulesName: [
          { required: true, message: "请输入规则名称", trigger: "blur" }
        ],
        count: [{ required: true, message: "请输入课程数量", trigger: "blur" }]
      },
      addRefundRulesVisible: false, //添加退款规则弹窗是否显示
      addRefundRulesForm: {
        rulesName: "",
        count: ""
      },
      editRefundRulesVisible: false, //编辑退款规则弹窗是否显示
      editRefundRulesForm: {
        id: 0,
        rulesName: "",
        count: ""
      },
      PrizeRulesFormRules: {
        rulesName: [
          { required: true, message: "请输入规则名称", trigger: "blur" }
        ],
        count: [{ required: true, message: "请输入课程数量", trigger: "blur" }]
      },
      addPrizeRulesVisible: false, //添加奖励规则弹窗是否显示
      addPrizeRulesForm: {
        rulesName: "",
        count: ""
      },
      editPrizeRulesVisible: false, //编辑奖励规则弹窗是否显示
      editPrizeRulesForm: {
        id: 0,
        rulesName: "",
        count: ""
      },
      copyRules: {
        sheetId: [
          { required: true, message: "请选择复制的团单", trigger: "blur" }
        ]
      },
      copyVisible: false, //批量拷贝弹窗是否显示
      copyForm: {
        sheetList: [],
        sheetId: "",
        type: 0
      },
      loading: false
    };
  },
  created() {
    this.sheetId = this.$route.params.id;
    this.activityGroupId = this.$route.query.activityGroupId;
    this._getSheetItemGroupList();
    this._getSheetNormalPriceList();
    this._getSheetSpecialPriceList();
    this._getSheetRefundRulesList();
    this._getSheetPrizeRulesList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.sheetId = this.$route.params.id;
      this.activityGroupId = this.$route.query.activityGroupId;
      this._getSheetItemGroupList();
      this._getSheetNormalPriceList();
      this._getSheetSpecialPriceList();
      this._getSheetRefundRulesList();
      this._getSheetPrizeRulesList();
    }
  },
  methods: {
    //跳转到退款基础价格
    jumpToRefundRulesBasePrice(item) {
      this.$router.push({
        path: `/RefundRulesBasePrice/${item.Id}`,
        query: {
          name: item.Name
        }
      });
    },
    //跳转到退款特殊价格
    jumpToRefundRulesSpecialPrice(item) {
      this.$router.push({
        path: `/RefundRulesSpecialPrice/${item.Id}`,
        query: {
          name: item.Name,
          activityGroupId: this.activityGroupId
        }
      });
    },
    //跳转到奖励基础价格
    jumpToPrizeRulesBasePrice(item) {
      this.$router.push({
        path: `/PrizeRulesBasePrice/${item.Id}`,
        query: {
          name: item.Name
        }
      });
    },
    //跳转到奖励特殊价格
    jumpToPrizeRulesSpecialPrice(item) {
      this.$router.push({
        path: `/PrizeRulesSpecialPrice/${item.Id}`,
        query: {
          name: item.Name,
          activityGroupId: this.activityGroupId
        }
      });
    },
    //显示添加项目弹窗
    showAddItemDialog() {
      this.addItemForm.groupName = "";
      this.addItemForm.itemCheckList = [];
      this.addItemForm.minCount = "";
      this.addItemForm.maxCount = "";
      this.addItemForm.tolerate = "";
      this.addItemForm.isShowName = true;
      this.groupId = -1;
      this._getActivityGroupStoreList(82);
      this.addItemVisible = true;
    },
    //添加项目确认
    addItemOk() {
      this.$refs["addItemForm"].validate(valid => {
        if (valid) {
          if (
            this.addItemForm.maxCount == "" ||
            this.addItemForm.maxCount < -1
          ) {
            this.$message.error("请输入可选择最大数量");
            return false;
          }
          if (this.addItemForm.itemCheckList.length <= 0) {
            this.$message.error("请选择课程");
            return false;
          }
          this._addSheetItemGroup().then(val => {
            this.addItemVisible = false;
            this._getSheetItemGroupList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑弹窗
    showEditItemDialog(item) {
      this.editItemForm.groupId = item.GroupId;
      this.editItemForm.groupName = item.GroupName;
      this.editItemForm.tolerate = item.IsOpen == 1 ? true : false;
      this.editItemForm.isShowName = item.IsShowName;
      let arr = [];
      item.ItemList.forEach(item => {
        arr.push(item.SheetItemRelId);
      });
      this.editItemForm.itemCheckList = arr;
      this.editItemForm.minCount = item.MinCount;
      this.editItemForm.maxCount = item.MaxCount;
      this.groupId = item.GroupId;
      this._getActivityGroupStoreList(83);
      this.editItemVisible = true;
    },
    //编辑确定
    editItemOk() {
      this.$refs["editItemForm"].validate(valid => {
        if (valid) {
          if (
            this.editItemForm.maxCount == "" ||
            this.editItemForm.maxCount < -1
          ) {
            this.$message.error("请输入可选择最大数量");
            return false;
          }
          if (this.editItemForm.itemCheckList.length <= 0) {
            this.$message.error("请选择课程");
            return false;
          }
          this._modifySheetItemGroup().then(val => {
            this.editItemVisible = false;
            this._getSheetItemGroupList();
          });
        } else {
          return false;
        }
      });
    },
    //删除项目
    deleteItem(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSheetItemGroup(item).then(val => {
            this._getSheetItemGroupList();
          });
        })
        .catch(() => {});
    },
    //显示新增基础价格弹窗
    showAddBasePriceDialog() {
      this.addBasePriceForm.count = "";
      this.addBasePriceForm.price = "";
      this.addBasePriceVisible = true;
    },
    //新增基础价格确定
    addBasePriceOk() {
      this.$refs["addBasePriceForm"].validate(valid => {
        if (valid) {
          this._addSheetNormalPrice().then(val => {
            this.addBasePriceVisible = false;
            this._getSheetNormalPriceList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑基础价格弹窗
    showEditBasePriceDialog(item) {
      this.editBasePriceForm.id = item.Id;
      this.editBasePriceForm.count = item.Count;
      this.editBasePriceForm.price = item.Price;
      this.editBasePriceVisible = true;
    },
    //编辑基础价格确定
    editBasePriceOk() {
      this.$refs["editBasePriceForm"].validate(valid => {
        if (valid) {
          this._modifySheetNormalPrice().then(val => {
            this.editBasePriceVisible = false;
            this._getSheetNormalPriceList();
          });
        } else {
          return false;
        }
      });
    },
    //删除基础价格
    deleteBasePrice(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSheetNormalPrice(item).then(val => {
            this._getSheetNormalPriceList();
          });
        })
        .catch(() => {});
    },
    //修改基础价格状态
    changeBasePriceStatus(status, item) {
      this._modifySheetNormalPriceStatus(item.Id, status);
    },
    //显示新增特殊价格弹窗
    showAddSpecialPriceDialog() {
      this._getActivityGroupStoreList(94);
      this.addSpecialPriceForm.itemRelId = "";
      this.addSpecialPriceForm.price = "";
      this.addSpecialPriceVisible = true;
    },
    //新增特殊价格确定
    addSpecialPriceOk() {
      this.$refs["addSpecialPriceForm"].validate(valid => {
        if (valid) {
          this._addSheetSpecialPrice().then(val => {
            this.addSpecialPriceVisible = false;
            this._getSheetSpecialPriceList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑特殊价格弹窗
    showEditSpecialPriceDialog(item) {
      this._getActivityGroupStoreList(95);
      this.editSpecialPriceForm.id = item.Id;
      this.editSpecialPriceForm.itemRelId = item.ItemRelId;
      this.editSpecialPriceForm.price = item.Price;
      this.editSpecialPriceVisible = true;
    },
    //编辑特殊价格确定
    editSpecialPriceOk() {
      this.$refs["editSpecialPriceForm"].validate(valid => {
        if (valid) {
          this._modifySheetSpecialPrice().then(val => {
            this.editSpecialPriceVisible = false;
            this._getSheetSpecialPriceList();
          });
        } else {
          return false;
        }
      });
    },
    //删除特殊价格
    deleteSpecialPrice(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSheetSpecialPrice(item).then(val => {
            this._getSheetSpecialPriceList();
          });
        })
        .catch(() => {});
    },
    //修改特殊价格状态
    changeSpecialPriceStatus(status, item) {
      this._modifySheetSpecialPriceStatus(item.Id, status);
    },
    //显示添加退款规则弹窗
    showAddRefundRulesDialog() {
      this.addRefundRulesForm.rulesName = "";
      this.addRefundRulesForm.count = "";
      this.addRefundRulesVisible = true;
    },
    //添加退款规则确认
    addRefundRulesOk() {
      this.$refs["addRefundRulesForm"].validate(valid => {
        if (valid) {
          this._addSheetRefundRules().then(val => {
            this.addRefundRulesVisible = false;
            this._getSheetRefundRulesList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑退款规则弹窗
    showEditRefundRulesDialog(item) {
      this.editRefundRulesForm.id = item.Id;
      this.editRefundRulesForm.rulesName = item.Name;
      this.editRefundRulesForm.count = item.Count;
      this.editRefundRulesVisible = true;
    },
    //编辑退款规则确定
    editRefundRulesOk() {
      this.$refs["editRefundRulesForm"].validate(valid => {
        if (valid) {
          this._modifySheetRefundRules().then(val => {
            this.editRefundRulesVisible = false;
            this._getSheetRefundRulesList();
          });
        } else {
          return false;
        }
      });
    },
    //删除退款规则
    deleteRefundRules(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSheetRefundRules(item).then(val => {
            this._getSheetRefundRulesList();
          });
        })
        .catch(() => {});
    },
    //修改退款规则状态
    changeRefundRulesStatus(status, item) {
      this._modifySheetRefundRulesStatus(item.Id, status);
    },
    //显示添加奖励规则弹窗
    showAddPrizeRulesDialog() {
      this.addPrizeRulesForm.rulesName = "";
      this.addPrizeRulesForm.count = "";
      this.addPrizeRulesVisible = true;
    },
    //添加退款规则确认
    addPrizeRulesOk() {
      this.$refs["addPrizeRulesForm"].validate(valid => {
        if (valid) {
          this._addSheetPrizeRules().then(val => {
            this.addPrizeRulesVisible = false;
            this._getSheetPrizeRulesList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑退款规则弹窗
    showEditPrizeRulesDialog(item) {
      this.editPrizeRulesForm.id = item.Id;
      this.editPrizeRulesForm.rulesName = item.Name;
      this.editPrizeRulesForm.count = item.Count;
      this.editPrizeRulesVisible = true;
    },
    //编辑退款规则确定
    editPrizeRulesOk() {
      this.$refs["editPrizeRulesForm"].validate(valid => {
        if (valid) {
          this._modifySheetPrizeRules().then(val => {
            this.editPrizeRulesVisible = false;
            this._getSheetPrizeRulesList();
          });
        } else {
          return false;
        }
      });
    },
    //删除退款规则
    deletePrizeRules(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSheetPrizeRules(item).then(val => {
            this._getSheetPrizeRulesList();
          });
        })
        .catch(() => {});
    },
    //修改退款规则状态
    changePrizeRulesStatus(status, item) {
      this._modifySheetPrizeRulesStatus(item.Id, status);
    },
    //显示批量拷贝弹窗
    showCopyDialog(type) {
      this._getSheetList(type == 1 ? 90 : type == 2 ? 104 : 120);
      this.copyForm.sheetId = "";
      this.copyForm.type = type;
      this.copyVisible = true;
    },
    copyOk() {
      this._copySheetPrice(
        this.copyForm.type == 1 ? 90 : this.copyForm.type == 2 ? 104 : 120
      ).then(val => {
        this.copyVisible = false;
        if (this.copyForm.type == 1) {
          this._getSheetNormalPriceList();
        }
        if (this.copyForm.type == 2) {
          this._getSheetRefundRulesList();
        }
        if (this.copyForm.type == 3) {
          this._getSheetPrizeRulesList();
        }
      });
    },
    //验券奖励特殊价格初始化
    PrizeSpecialPriceInit() {
      this.$confirm("此操作将覆盖原来已配置的特殊价格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this._prizeSpecialPriceInit()
            .then(val => {
              this.loading = false;
              this.$message({
                type: "success",
                message: "初始化成功",
                showClose: true
              });
            })
            .catch(val => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    //获取团单项目分组列表
    _getSheetItemGroupList() {
      var par = {
        Id: this.sheetId
      };
      return GetSheetItemGroupList(par, 279).then(res => {
        res.forEach(item => {
          item.storeIdList = item.StoreList.map(v => {
            return v.StoreId;
          });
        });
        this.groupList = res;
      });
    },
    //获取团单基础价格列表
    _getSheetNormalPriceList() {
      var par = {
        Id: this.sheetId
      };
      return GetSheetNormalPriceList(par, 279).then(res => {
        this.basePriceTable = res;
      });
    },
    //获取团单特殊价格列表
    _getSheetSpecialPriceList() {
      var par = {
        Id: this.sheetId
      };
      return GetSheetSpecialPriceList(par, 279).then(res => {
        this.specialPriceTable = res;
      });
    },
    //获取团单退款规则列表
    _getSheetRefundRulesList() {
      var par = {
        Id: this.sheetId
      };
      return GetSheetRefundRulesList(par, 279).then(res => {
        this.refundRulesTable = res;
      });
    },
    //获取团单奖励规则列表
    _getSheetPrizeRulesList() {
      var par = {
        Id: this.sheetId
      };
      return GetSheetPrizeRulesList(par, 279).then(res => {
        this.prizeRulesTable = res;
      });
    },
    //获取活动组参与门店列表
    _getActivityGroupStoreList(rightId) {
      var par = {
        ActivityGroupId: this.activityGroupId,
        StoreName: "",
        PageIndex: 1,
        PageCount: 100,
        SheetId: this.sheetId,
        GroupId: this.groupId
      };
      return activitygroupStoreList(par, rightId).then(res => {
        this.allItemList = res.List;
        this.allItemList2 = [];
        this.allItemList2IdList = [];
        res.List.forEach(item => {
          let tempArr = this.allItemList2.filter(e => {
            return e.StoreId == item.StoreId;
          });
          if (tempArr.length <= 0) {
            this.allItemList2.push({
              StoreId: item.StoreId,
              StoreName: item.StoreName,
              ItemList: [item]
            });
            this.allItemList2IdList.push(item.StoreId);
          } else {
            tempArr[0].ItemList.push(item);
          }
        });
      });
    },
    //添加团单项目分组
    _addSheetItemGroup() {
      var par = {
        SheetId: this.sheetId,
        GroupName: this.addItemForm.groupName,
        MinCount: this.addItemForm.minCount,
        IsOpen: this.addItemForm.tolerate == true ? 1 : 0,
        MaxCount: this.addItemForm.maxCount,
        ItemList: this.addItemForm.itemCheckList,
        IsShowName:this.addItemForm.isShowName
      };
      return AddSheetItemGroup(par, 82);
    },
    //编辑团单项目分组
    _modifySheetItemGroup() {
      var par = {
        GroupId: this.editItemForm.groupId,
        IsOpen: this.editItemForm.tolerate == true ? 1 : 0,
        GroupName: this.editItemForm.groupName,
        MinCount: this.editItemForm.minCount,
        MaxCount: this.editItemForm.maxCount,
        ItemList: this.editItemForm.itemCheckList,
        IsShowName:this.editItemForm.isShowName
      };
      return ModifySheetItemGroup(par, 83);
    },
    //删除团单项目分组
    _deleteSheetItemGroup(item) {
      var par = {
        Id: item.GroupId
      };
      return DeleteSheetItemGroup(par, 84);
    },
    //添加团单基础价格
    _addSheetNormalPrice() {
      var par = {
        SheetId: this.sheetId,
        Count: this.addBasePriceForm.count,
        Price: this.addBasePriceForm.price
      };
      return AddSheetNormalPrice(par, 86);
    },
    //编辑团单基础价格
    _modifySheetNormalPrice() {
      var par = {
        Id: this.editBasePriceForm.id,
        Price: this.editBasePriceForm.price
      };
      return ModifySheetNormalPrice(par, 87);
    },
    //删除团单基础价格
    _deleteSheetNormalPrice(item) {
      var par = {
        Id: item.Id
      };
      return DeleteSheetNormalPrice(par, 89);
    },
    //修改团单基础价格状态
    _modifySheetNormalPriceStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySheetNormalPriceStatus(par, 88);
    },
    //添加团单特殊价格
    _addSheetSpecialPrice() {
      var par = {
        SheetId: this.sheetId,
        ItemRelId: this.addSpecialPriceForm.itemRelId,
        Price: this.addSpecialPriceForm.price
      };
      return AddSheetSpecialPrice(par, 94);
    },
    //编辑团单特殊价格
    _modifySheetSpecialPrice() {
      var par = {
        Id: this.editSpecialPriceForm.id,
        Price: this.editSpecialPriceForm.price
      };
      return ModifySheetSpecialPrice(par, 95);
    },
    //删除团单特殊价格
    _deleteSheetSpecialPrice(item) {
      var par = {
        Id: item.Id
      };
      return DeleteSheetSpecialPrice(par, 97);
    },
    //修改团单特殊价格状态
    _modifySheetSpecialPriceStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySheetSpecialPriceStatus(par, 96);
    },
    //添加团单退款规则
    _addSheetRefundRules() {
      var par = {
        SheetId: this.sheetId,
        Count: this.addRefundRulesForm.count,
        Name: this.addRefundRulesForm.rulesName
      };
      return AddSheetRefundRules(par, 99);
    },
    //编辑团单退款规则
    _modifySheetRefundRules() {
      var par = {
        Id: this.editRefundRulesForm.id,
        Name: this.editRefundRulesForm.rulesName
      };
      return ModifySheetRefundRules(par, 100);
    },
    //删除团单退款规则
    _deleteSheetRefundRules(item) {
      var par = {
        Id: item.Id
      };
      return DeleteSheetRefundRules(par, 102);
    },
    //修改团单退款规则状态
    _modifySheetRefundRulesStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySheetRefundRulesStatus(par, 101);
    },
    //添加团单奖励规则
    _addSheetPrizeRules() {
      var par = {
        SheetId: this.sheetId,
        Count: this.addPrizeRulesForm.count,
        Name: this.addPrizeRulesForm.rulesName
      };
      return AddSheetPrizeRules(par,116);
    },
    //编辑团单奖励规则
    _modifySheetPrizeRules() {
      var par = {
        Id: this.editPrizeRulesForm.id,
        Name: this.editPrizeRulesForm.rulesName
      };
      return ModifySheetPrizeRules(par,117);
    },
    //删除团单奖励规则
    _deleteSheetPrizeRules(item) {
      var par = {
        Id: item.Id
      };
      return DeleteSheetPrizeRules(par,119);
    },
    //修改团单奖励规则状态
    _modifySheetPrizeRulesStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySheetPrizeRulesStatus(par,118);
    },
    //获取团单列表
    _getSheetList(rightId) {
      var par = {
        SheetName: "",
        PageIndex: 1,
        PageCount: 100
      };
      return sheetList(par, rightId).then(res => {
        this.copyForm.sheetList = res.List;
      });
    },
    //复制团单价格信息
    _copySheetPrice(rightId) {
      var par = {
        SheetId: this.sheetId,
        CopySheetId: this.copyForm.sheetId,
        Type: this.copyForm.type
      };
      return CopySheetPrice(par, rightId);
    },
    //团单验券奖励特殊价格初始化
    _prizeSpecialPriceInit() {
      var par = {
        SheetId: this.sheetId
      };
      return PrizeSpecialPriceInit(par,121);
    }
  }
};
</script>

<style scoped lang='less'>
.sheetItemFrame {
  margin: auto 50px;
  margin-bottom: 30px;
}
.sheetItemTitle {
  margin-bottom: 30px;
}
.right-button {
  float: right;
}
.item-border {
  border: 1px solid #ccc;
  height: auto;
  max-height: 500px;
  overflow-y: scroll;
  width: 100%;
  min-height: 200px;
}
.item-group {
  width: 100%;
}
.item-group-title {
  background-color: #f8f8f8;
  width: 100%;
  height: auto;
  line-height: 40px;
}
.item-group-content {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
.item-group-title-left {
  margin-left: 20px;
}
.item-group-title-right {
  float: right;
  margin-right: 20px;
}
.item {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-left: 30px;
  margin-right: 60px;
  max-width: 150px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.item img {
  width: 180px;
  height: 100px;
}
.cell_dashed {
  height: 10px;
  border-bottom: 8px solid #ccc;
  overflow: hidden;
  opacity: 0.2;
  margin-bottom: 30px;
  margin-top: 30px;
}
.el-checkbox-group {
  font-size: 13px;
}
</style>
