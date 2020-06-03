<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-button
          style="float:right;margin-bottom:10px;"
          type="primary"
          @click="add()"
          v-if="common.haveRight('AddPopTaskTemplateTicket')"
        >添加卡券</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TicketName" align="center" label="卡券名称"></el-table-column>
        <!-- <el-table-column prop="TicketTypeName" align="center" label="卡券类型"></el-table-column> -->
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="deleted(scope.row)"
              class="red"
              v-if="common.haveRight('DeletePopTaskTemplateTicket')"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加卡券 -->
    <el-dialog title="添加卡券" :visible.sync="addVisible" width="633px">
      <el-form ref="addForm" :model="addForm" label-width="100px">
        <el-form-item label="选择卡券:" prop="TicketCard">
          <el-select
            v-model="addForm.TicketCard"
            placeholder="请选择卡券"
            filterable
            multiple
            style="width:100%"
          >
            <el-option
              v-for="item in TicketCardList"
              :label="item.TicketTemplateName"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="medium">取 消</el-button>
        <el-button @click="addOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetPopTaskTemplateTicketList,
  DeletePopTaskTemplateTicket,
  AddPopTaskTemplateTicket
} from "api/pop.js";
import { GetTicketTemplateList } from "api/ticket.js";
export default {
  name: "TaskTicket",
  data() {
    return {
      taskId: "", //任务Id
      listTable: [], //列表数据
      TicketCardList: [], //可选卡券列表
      addVisible: false,
      addForm: {
        TicketCard: []
      }
    };
  },
  created() {
    this.taskId = this.$route.params.id;
    this._getPopTaskTemplateTicketList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.taskId = this.$route.params.id;
      this._getPopTaskTemplateTicketList();
    }
  },
  methods: {
    deleted(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deletePopTaskTemplateTicket(item.Id).then(val => {
            this._getPopTaskTemplateTicketList();
          });
        })
        .catch(() => {});
    },
    add() {
      this._getTicketTemplateList();
      this.addForm.TicketCard = this.listTable.map(e => {
        return e.TicketId;
      });
      this.addVisible = true;
    },
    addOk() {
      this._addPopTaskTemplateTicket().then(val => {
        this.addVisible = false;
        this._getPopTaskTemplateTicketList();
      });
    },

    //获取任务模板卡券奖励列表
    _getPopTaskTemplateTicketList() {
      var par = {
        Id: this.taskId
      };
      return GetPopTaskTemplateTicketList(par, 312).then(res => {
        this.listTable = res;
      });
    },
    //删除任务模板奖励卡券
    _deletePopTaskTemplateTicket(id) {
      var par = {
        Id: id
      };
      return DeletePopTaskTemplateTicket(par, 313);
    },
    //获取卡券模板列表
    _getTicketTemplateList() {
      var par = {
        Status: 1,
        PageIndex: 1,
        PageCount: 1000
      };
      return GetTicketTemplateList(par, 314).then(res => {
        this.TicketCardList = res.List;
      });
    },
    //添加任务模板奖励卡券
    _addPopTaskTemplateTicket() {
      var par = {
        TaskId: this.taskId,
        TicketIdList: this.addForm.TicketCard
      };
      return AddPopTaskTemplateTicket(par, 314);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
