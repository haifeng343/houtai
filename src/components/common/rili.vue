<template>
  <div id="app">
    <div class="rili-container">
      <div class="rili-header">
        <i class="el-icon-arrow-left" @click="preMonthChange"></i>
        <p class="rili-timeHeader">{{currentYear}}年{{currentMonth+1}}月</p>
        <i class="el-icon-arrow-right" @click="nextMonthChange"></i>
      </div>
      <div class="rili-week">
        <div class="rili-weekDay" v-for="item in weekList" :key="item.id">{{item.name}}</div>
      </div>
      <div class="rili-content">
        <div v-for="item in dayList" :key="item.id" class="rili-item">
          <div
            v-if="item.id>0"
            @click="choseDateChange(item)"
            class="rili-item-day"
            :class="item.chose?'rili-item-chose':((item.special?'rili-item-special':'rili-item-base')+(item.isToday?' rili-item-istoday':''))"
          >{{item.name}}</div>
          <div v-else>{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 外部传入的参数名
  props: ["specialDate", "year", "month", "date"],
  data() {
    return {
      //星期列表
      weekList: [
        { id: 0, name: "日" },
        { id: 1, name: "一" },
        { id: 2, name: "二" },
        { id: 3, name: "三" },
        { id: 4, name: "四" },
        { id: 5, name: "五" },
        { id: 6, name: "六" }
      ],
      //日期列表
      dayList: [],
      currentYear: "", //当前年份
      currentMonth: "", //当前月份
      currentDate: "", //当前日期天数
      specialDateList: this.specialDate //特殊样式日期列表
    };
  },
  created() {
    //当前日期
    let dateNow = new Date();
    if (this.year) {
      this.currentYear = Number(this.year);
    } else {
      this.currentYear = dateNow.getFullYear();
    }
    if (this.month) {
      this.currentMonth = Number(this.month)-1;
    } else {
      this.currentMonth = dateNow.getMonth();
    }
    if (this.date) {
      this.currentDate = Number(this.date);
    } else {
      this.currentDate = dateNow.getDate();
    }
    this.getDayList();
  },
  methods: {
    //计算当前月份日期列表
    getDayList() {
      //清空日期表
      this.dayList = [];
      //计算当前月份1号是星期几
      var dt = new Date(this.currentYear, this.currentMonth, 1);
      let firstWeekDay = dt.getDay();
      for (var i = 0; i < firstWeekDay; i++) {
        this.dayList.push({
          id: -i,
          name: "",
          special: false,
          chose: false,
          isToday: false
        });
      }
      //判断当前月份有几天
      dt = new Date(this.currentYear, this.currentMonth + 1, 0);
      let dateNow = new Date();
      let maxDate = dt.getDate();
      for (var i = 1; i <= maxDate; i++) {
        let special = false;
        if (this.specialDateList.indexOf(i) != -1) {
          special = true;
        } else {
          special = false;
        }
        //判断是否当天
        let isToday = false;
        if (
          dateNow.getFullYear() == this.currentYear &&
          dateNow.getMonth() == this.currentMonth &&
          dateNow.getDate() == i
        ) {
          isToday = true;
        } else {
          isToday = false;
        }
        //判断默认选中哪一天
        let chose = false;
        if (i == this.currentDate) {
          chose = true;
        } else {
          chose = false;
        }
        this.dayList.push({
          id: i,
          name: i,
          special: special,
          chose: chose,
          isToday: isToday
        });
      }
      //计算最后一天是星期几
      dt = new Date(this.currentYear, this.currentMonth, maxDate);
      let lastWeekDay = dt.getDay();
      for (var i = 6; i > lastWeekDay; i--) {
        this.dayList.push({
          id: -i,
          name: "",
          special: false,
          chose: false,
          isToday: false
        });
      }
    },
    //上月切换
    preMonthChange() {
      let preYear = this.currentYear;
      let preMonth = this.currentMonth;
      if (this.currentMonth > 0) {
        this.currentMonth = this.currentMonth - 1;
      } else {
        this.currentYear = this.currentYear - 1;
        this.currentMonth = 11;
      }
      this.currentDate="";
      this.getDayList();
      this._self.$emit("preMonth", {
        preYear: preYear,
        preMonth: preMonth,
        currYear: this.currentYear,
        currMonth: this.currentMonth
      });
    },
    //下月切换
    nextMonthChange() {
      let preYear = this.currentYear;
      let preMonth = this.currentMonth;
      if (this.currentMonth < 11) {
        this.currentMonth = this.currentMonth + 1;
      } else {
        this.currentYear = this.currentYear + 1;
        this.currentMonth = 0;
      }
      this.currentDate="";
      this.getDayList();
      this._self.$emit("nextMonth", {
        preYear: preYear,
        preMonth: preMonth,
        currYear: this.currentYear,
        currMonth: this.currentMonth
      });
    },
    //选择日期
    choseDateChange(date) {
      if (date.special == false) {
        return;
      }
      this.dayList.forEach(item => {
        if (item.id == date.id) {
          item.chose = true;
        } else {
          item.chose = false;
        }
      });
      this._self.$emit("choseDate", {
        year: this.currentYear,
        month: this.currentMonth,
        day: date.id
      });
    }
  }
};
</script>

<style scoped lang='less'>
#app {
  border: 1px solid #ccc;
  border-radius: 12px;
  max-width: 420px;
  height: auto;
}
.rili-container {
  width: 100%;
  height: auto;
}
.rili-header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #409eff;
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rili-timeHeader {
  margin: 40px 0;
}
.rili-week {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
}
.rili-weekDay {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 17px;
  color: #000;
}
.rili-content {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
}
.rili-item {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.rili-item-day {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
}
.rili-item-istoday {
  background: #6e8194;
  border-radius: 100%;
}
.rili-item-base {
  color: #ccc;
}
.rili-item-special {
  color: #000;
  cursor: pointer;
}
.rili-item-chose {
  color: #fff;
  background: #409eff;
  border-radius: 100%;
}
</style>
