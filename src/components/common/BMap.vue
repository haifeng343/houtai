<template>
  <div>
    <div style="margin:0 auto;">
      <div id="allmap" v-bind:style="mapStyle"></div>
      <div class="mapInput">
        <el-input
          type="text"
          id="suggestId"
          size="20"
          style="width:320px;"
          placeholder="请输入搜索关键字"
          v-model="mapInput"
        />
      </div>
    </div>
    <div
      id="searchResultPanel"
      style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
    ></div>
  </div>
</template>

<script>
export default {
  name: "BMap",
  data() {
    return {
      mapInput: "",
      mapStyle: {
        width: "100%",
        height: this.mapHeight + "px",
        margin: "0 auto"
      }
    };
  },
  props: {
    // 地图在该视图上的高度
    mapHeight: {
      type: Number,
      default: 500
    },
    data: Object
  },
  mounted() {
    this.BMapInit();
  },
  methods: {
    BMapInit() {
      var _self = this;
      // 百度地图API功能
      function G(id) {
        return document.getElementById(id);
      }

      var map = new BMap.Map("allmap");
      var marker;
      if (this.data != null) {
        var new_point = new BMap.Point(this.data.lng, this.data.lat);
        map.centerAndZoom(new_point, 18);
        marker = new BMap.Marker(new_point);
        map.addOverlay(marker); //添加标注
        marker.enableDragging();
        marker.addEventListener("dragend", () => {
          var p = marker.getPosition();
          _self.$emit("location", p);
        });
      } else {
        map.centerAndZoom("杭州", 12); // 初始化地图,设置城市和地图级别。
      }

      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

      var ac = new BMap.Autocomplete({ input: "suggestId", location: map }); //建立一个自动完成的对象

      ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        G("searchResultPanel").innerHTML = str;
      });

      var myValue;
      ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        G("searchResultPanel").innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          myValue;

        setPlace();
      });

      function setPlace() {
        map.clearOverlays(); //清除地图上所有覆盖物
        function myFun() {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          _self.$emit("location", pp);
          console.log(local.getResults().getPoi(0));

          map.centerAndZoom(pp, 18);
          marker = new BMap.Marker(pp);
          map.addOverlay(marker); //添加标注
          marker.enableDragging();
          marker.addEventListener("dragend", () => {
            var p = marker.getPosition();
            _self.$emit("location", p);
          });
        }
        var local = new BMap.LocalSearch(map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
      }
    }
  }
};
</script>

<style scoped lang='less'>
.mapInput {
  position: relative;
  width: 410px;
  bottom: 486px;
  left: 18px;
}
</style>
<style>
.tangram-suggestion-main {
  z-index: 99999;
}
</style>

