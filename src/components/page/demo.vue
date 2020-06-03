<template>
  <div>
    <div class="search-top">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="formInline.user" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-input v-model="formInline.mobile" placeholder="商品分类"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="add" class="add">增加</el-button>
      </div>
    </div>
    <el-table :data="tableData" center style="width: 100%">
      <el-table-column type="expand" align="ceter">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="商品 ID" align="ceter" prop="id"></el-table-column>
      <el-table-column label="商品名称" align="ceter" prop="name"></el-table-column>
      <el-table-column label="商品状态" align="ceter">
        <template slot-scope="scope">
          <el-switch
            style="display: block"
            v-model="value4"
            active-value="1"
            inactive-value="2"
            active-color="#61A4FE"
            inactive-color="#CDCCCA"
            active-text="有效"
            inactive-text="无效"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="预览图片" align="ceter">
        <template slot-scope="scope">
          <el-button type="text" @click="ImgDialog(scope.row)">预览图片</el-button>
        </template>
      </el-table-column>

      <el-table-column label="描述" prop="desc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-button type="text" class="red" @click="deleteData(scope.row)" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="linkage">
    <el-select
      v-model="sheng"
      @change="choseProvince"
      placeholder="省级地区">
      <el-option
        v-for="item in province"
        :key="item.id"
        :label="item.value"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select
      v-model="shi"
      @change="choseCity"
      placeholder="市级地区">
      <el-option
        v-for="item in shi1"
        :key="item.id"
        :label="item.value"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select
      v-model="qu"
      @change="choseBlock"
      placeholder="区级地区">
      <el-option
        v-for="item in qu1"
        :key="item.id"
        :label="item.value"
        :value="item.id">
      </el-option>
    </el-select>
  </div>

    <!--添加数据-->
    <el-dialog title="增加" :visible.sync="addVisible" width="800px">
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="addForm.region" placeholder="请选择活动区域">
            <el-option
              v-for="item in selectList"
              :value="item.id"
              :label="item.label"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="addForm.date1"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="addForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="具体内容" prop="content">
          <quill-editor
            v-model="addForm.content"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          ></quill-editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAdd">关 闭</el-button>
        <el-button type="primary" @click="submit('addForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--查看图片-->
    <el-dialog :title="`查看-${tableData.id}`" :visible.sync="ImgVisible" width="500px">
      <img :src="ImgUrl" class="imgDialog" alt>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ImgVisible = false">关 闭</el-button>
        <el-button type="primary" @click="ImgVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑-->
    <el-dialog :title="`编辑-${editForm.id}`" :visible.sync="editVisible" width="500px">
      <el-form
        :model="editForm"
        :rules="editrules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="小吃名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="特产分类" prop="category">
          <el-input v-model="editForm.category"></el-input>
        </el-form-item>
        <el-form-item label="所属地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="所属人员" prop="shop">
          <el-input v-model="editForm.shop"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">关 闭</el-button>
        <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--分页-->
    <div class="pagination">
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        :pager-count="11"
        layout="prev, pager, next"
        :total="TotalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
      mapJson:'../static/json/map.json',
      province:'',
      sheng: '',
      shi: '',
      shi1: [],
      qu: '',
      qu1: [],
      city:'',
      block:'',
      userName: "",
      phone: "",
      content: "", //富文本内容
      editorOption: {}, //富文本配置
      value4: 1,//状态值初始化
      ImgVisible: false,//图片弹窗
      addVisible: false,//添加弹窗
      editVisible: false,//编辑弹窗
      formInline:{//顶部搜索条件内容
        name:'',
        mobile:'',
      },
      editForm: {//编辑弹窗内容初始化
        name: "",
        category: "",
        address: "",
        shop: ""
      },
      selectList: [//下拉框的内容初始化 :value="item.id" :label="item.label" :key="item.id"
        {
          id: 1,
          label: "全部"
        },
        {
          id: 2,
          label: "作废"
        },
        {
          id: 3,
          label: "过期"
        },
        {
          id: 4,
          label: "停滞"
        },
        {
          id: 5,
          label: "做工"
        }
      ],
      ImgUrl: "",
      TotalCount: 500,
      pageSize: 10,
      editrules: {
        name: [{ required: true, message: "请输入小吃名称", trigger: "blur" }],
        category: [
          { required: true, message: "请选择小吃类别", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入店铺地址", trigger: "blur" }
        ],
        shop: [
          { required: true, message: "请输入所属店铺 ", trigger: "blur" }
        ]
      },
      addForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        content: ""
      },
      addrules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ],
      },
      tableData: [
        {
          id: "12987122",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          ImgUrl: "http://k.zol-img.com.cn/sjbbs/7692/a7691515_s.jpg",
          shop: "王小虎夫妻店",
          shopId: "10333"
        },
        {
          id: "12987123",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          ImgUrl: "http://pic37.nipic.com/20140113/8800276_184927469000_2.png",
          shop: "王小虎夫妻店",
          shopId: "10333"
        },
        {
          id: "12987125",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          ImgUrl:
            "http://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/lvpics/w=1000/sign=9b38971c908fa0ec7fc7600d16a758ee/c8ea15ce36d3d5394fe85aec3b87e950342ab0cc.jpg",
          shop: "王小虎夫妻店",
          shopId: "10333"
        },
        {
          id: "12987126",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          ImgUrl:
            "http://www.cnr.cn/junshi/ztl/leifeng/smlf/201202/W020120226838451234901.jpg",
          shop: "王小虎夫妻店",
          shopId: "10333"
        }
      ]
    };
  },
  created:function(){
      this.getCityData()
    },
  methods: {
     getCityData:function(){
        var that = this
        axios.get(this.mapJson).then(function(response){
          if (response.status==200) {
            var data = response.data
            that.province = []
            that.city = []
            that.block = []
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {//省
                that.province.push({id: item, value: data[item], children: []})
              } else if (item.match(/00$/)) {//市
                that.city.push({id: item, value: data[item], children: []})
              } else {//区
                that.block.push({id: item, value: data[item]})
              }
            }
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
                  that.province[index].children.push(that.city[index1])
                }
              }
            }
            // 分类区级
            for(var item1 in that.city) {
              for(var item2 in that.block) {
                if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
                  that.city[item1].children.push(that.block[item2])
                }
              }
            }
          }
          else{
            console.log(response.status)
          }
        }).catch(function(error){console.log(typeof+ error)})
      },
      // 选省
      choseProvince:function(e) {
        for (var index2 in this.province) {
          if (e === this.province[index2].id) {
            this.shi1 = this.province[index2].children
            this.shi = this.province[index2].children[0].value
            this.qu1 =this.province[index2].children[0].children
            this.qu = this.province[index2].children[0].children[0].value
            this.E = this.qu1[0].id
          }
        }
      },
      // 选市
      choseCity:function(e) {
        for (var index3 in this.city) {
          if (e === this.city[index3].id) {
            this.qu1 = this.city[index3].children
            this.qu = this.city[index3].children[0].value
            this.E = this.qu1[0].id
            // console.log(this.E)
          }
        }
      },
      // 选区
      choseBlock:function(e) {
        this.E=e;
        // console.log(this.E)
      },
    ImgDialog(row) {
      this.tableData.id = row.id;
      this.ImgUrl = row.ImgUrl;
      this.ImgVisible = true;
    },
    add() {
      this.addVisible = true;
    },
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorReady(editor, html, text) {
      //编辑器文本发生变化
      //this.content可以实时获取当前编辑器里面的文本内容
      console.log(this.addForm.content);
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            message: "添加成功",
            type: "success",
            showClose: true
          });
          this.addVisible = false;
          this.addForm = {};
          console.log(this.addForm);
        } else {
          console.log("error submit！");
          return false;
        }
      });
    },
    closeAdd() {
      this.addForm = {};
      this.$refs["addForm"].resetFields();
      this.addVisible = false;
    },
    search() {
      console.log(111);
    },
    //编辑
    edit(item) {
      this.editVisible = true;
      this.editForm = Object.assign({},item);
    },
    editSubmit() {},
    //删除
    deleteData(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", '删除-'+item.id, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: ""
      }).then(() => {
        this._deleteManagerCallCenterDelegateDistribution({Id:item.id}).then(val => {
          // this._getManagerCallCenterDelegateDistributionList();
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
        });
      }).catch(err => {
        
      })
      console.log(item);
    },
    //删除接口
    // _deleteManagerCallCenterDelegateDistribution(Id) {
    //   const params = {
    //     Id: Id
    //   };
    //   return deleteManagerCallCenterDelegateDistribution(params);
    // }
  }
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
