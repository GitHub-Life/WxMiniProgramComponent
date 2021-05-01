// pages/im-calendar/calendar.js
Component({
  properties: {
    /** 组件背景色 */
    backgroundColor: {
      type: String,
      value: "#fff"
    },
    /** 文字主题色 */
    themeColor: {
      type: String,
      value: "#555"
    },
    /** 周末文字色 */
    weekendColor: {
      type: String,
      value: "#c00"
    },
    /** 选中日期的背景色 */
    selectedBgColor: {
      type: String,
      value: "#555"
    },
    /** 是否只显示当前月 */
    onlyShowCurrentMonth: {
      type: Boolean,
      value: false
    },
    /** 禁用跳转至其它月份 */
    disableToOtherMonth: {
      type: Boolean,
      value: false
    },
    /** 禁止选择 */
    disableSelect: {
      type: Boolean,
      value: false
    },
    /** 只读，相当于 disableToOtherMonth 和 disableSelect 都为 true */
    readonly: {
      type: Boolean,
      value: false
    },
    /** 当前显示的年份 */
    year: {
      type: Number
    },
    /** 当前显示的月份 */
    month: {
      type: Number
    },
  },
  data: {
    weekHeader: ['日', '一', '二', '三', '四', '五', '六'],
    monthDays: [],
    lastMonthDays: [],
    nextMonthDays: [],
  },
  lifetimes: {
    /** 在组件完全初始化完毕、进入页面节点树后 */
    attached: function () {
      if (this.properties.year == 0 || this.properties.month == 0) {
        this.showCurrentMonth();
      } else {
        this._refreshMonthDaysView();
      }
    },
  },
  methods: {
    /**
     * 计算日历视图数据并刷新页面
     */
    _refreshMonthDaysView: function () {
      const firstDayWeek = this._calculateWeek(this.properties.year + "-" + this.properties.month + "-1");
      const days = this._daysFromMonth(this.properties.year, this.properties.month);

      // 上个月  
      var lastMonthDays = new Array();
      var showLastMonthDayNum = firstDayWeek;
      if (!this.properties.onlyShowCurrentMonth) {
        var lastMonthDayNum = 0;
        var lastMonth = this.properties.month - 1;
        var lastMonth_year = this.properties.year;
        if (lastMonth < 1) {
          lastMonth = 12;
          lastMonth_year -= 1;
        }
        lastMonthDayNum = this._daysFromMonth(lastMonth_year, lastMonth);
        while (showLastMonthDayNum--) {
          var week = firstDayWeek - showLastMonthDayNum - 1;
          lastMonthDays.push({
            "year": lastMonth_year,
            "month": lastMonth,
            "day": lastMonthDayNum - showLastMonthDayNum,
            "week": week
          });
        }
      } else {
        while (showLastMonthDayNum--) {
          lastMonthDays.push({
            "day": ""
          });
        }
      }

      // 当月
      var monthDays = new Array();
      for (var i = 0; i < days; i++) {
        var week = (firstDayWeek + i) % 7;
        monthDays.push({
          "year": this.properties.year,
          "month": this.properties.month,
          "day": (i + 1),
          "week": week
        });
      }

      // 下个月
      var nextMonthDays = new Array();
      if (!this.properties.onlyShowCurrentMonth) {
        var nextMonth = this.properties.month + 1;
        var nextMonth_year = this.properties.year;
        if (nextMonth > 12) {
          nextMonth = 12;
          nextMonth_year += 1;
        }
        const lastLineDayNum = (lastMonthDays.length + monthDays.length) % 7;
        if (lastLineDayNum > 0) {
          var showNextMonthDayNum = 7 - lastLineDayNum;
          var dayNum = 1;
          while (showNextMonthDayNum--) {
            nextMonthDays.push({
              "year": nextMonth_year,
              "month": nextMonth,
              "day": dayNum++,
              "week": lastLineDayNum + dayNum - 2
            });
          }
        }
      }
      this.setData({
        lastMonthDays: lastMonthDays,
        monthDays: monthDays,
        nextMonthDays: nextMonthDays,
      })
    },

    /**
     * 计算该日期是星期几【基姆拉尔森计算公式】
     * @param {string} dateStr 日期字符串，格式为：“yyyy-MM-dd”
     */
    _calculateWeek: function (dateStr) {
      var nums = dateStr.split("-");
      var y = parseInt(nums[0]);
      var m = parseInt(nums[1]);
      var d = parseInt(nums[2]);
      if (m < 3) {
        m += 12;
        y -= 1;
      }
      // 基姆拉尔森计算公式 w=(d+2*m+3*(m+1)/5+y+y/4-y/100+y/400+1)%7【结果：0→周日…3→周三…6→周六】
      return (d + 2 * m + Math.floor(3 * (m + 1) / 5) + y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1) % 7;
    },

    /**
     * 返回该月份一共有几天
     * @param {int} year 年份
     * @param {int} month 月份
     */
    _daysFromMonth: function (year, month) {
      var leapYear = (year / 4 == Math.floor(year / 4) && year / 100 != Math.floor(year / 100)) || (year / 400 == Math.floor(year / 400) && year / 3200 != Math.floor(year / 3200)) || year / 172800 == Math.floor(year / 172800);
      return [31, (leapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    },

    /**
     * 显示上个月的日历
     */
    _lastMonth: function () {
      var month = this.properties.month - 1;
      if (month < 1) {
        this.setData({
          year: this.properties.year - 1,
          month: 12
        })
      } else {
        this.setData({
          month: month
        })
      }
      this._refreshMonthDaysView();
    },
    /**
     * 显示下个月的日历
     */
    _nextMonth: function () {
      var month = this.properties.month + 1;
      if (month > 12) {
        this.setData({
          year: this.properties.year + 1,
          month: 1
        })
      } else {
        this.setData({
          month: month
        })
      }
      this._refreshMonthDaysView();
    },
    /**
     * 显示去年这月的日历
     */
    _lastYear: function () {
      this.setData({
          year: this.properties.year - 1,
        }),
        this._refreshMonthDaysView();
    },
    /**
     * 显示明年这月的日历
     */
    _nextYear: function () {
      this.setData({
          year: this.properties.year + 1,
        }),
        this._refreshMonthDaysView();
    },

    /**
     * 某一天的点击事件
     * @param {*} dayView 
     */
    _dayTap: function (dayView) {
      if (this.properties.readonly || this.properties.disableSelect) return;
      var idx = dayView.currentTarget.dataset.idx;
      var days = this.data.monthDays;
      var item = days[idx];
      item.selected = !item.selected;
      days.splice(idx, 1, item);
      this.setData({
        monthDays: days
      })
      this.triggerEvent('daytap', item);
    },

    /**
     * 显示当前现实日期所在月份
     */
    showCurrentMonth: function () {
      var now = new Date();
      this.setData({
        year: now.getFullYear(),
        month: now.getMonth() + 1
      })
      this._refreshMonthDaysView();
    },

    /**
     * 跳转至参数对应的年月
     * @param {Object} yearMonth 格式为：{year:2020,month:06}
     */
    jumpToYearMonth: function (yearMonth) {
      this.setData({
        year: yearMonth.year,
        month: yearMonth.month
      })
      this._refreshMonthDaysView();
    },

    /**
     * 选中的日期集合
     */
    getSelectedDates: function () {
      var selectedDates = new Array();
      for (let day of this.data.monthDays) {
        if (day.selected) {
          selectedDates.push(day);
        }
      }
      return selectedDates;
    },

    /**
     * 设置选中的日期集合，自动跳转到集合第一个元素所示月份显示，只能显示此月份的选中
     * @param {Array} dates 日期集合，格式为：[{year:2021,month:4,day:24},{year:2021,month:4,day:26},……]
     */
    setSelectedDates: function (dates) {
      let showYear = dates[0].year;
      let showMonth = dates[0].month;
      if (showYear != this.properties.year || showMonth != this.properties.month) {
        this.setData({
          year: showYear,
          month: showMonth
        });
        this._refreshMonthDaysView();
      } else {
        for (const date of this.data.monthDays) {
          date.selected = false;
        }
      }

      let days = this.data.monthDays;
      for (const date of dates) {
        if (date.year != showYear || date.month != showMonth || date.day > days.length) continue;
        var item = days[date.day - 1];
        item.selected = true;
        days.splice(date.day - 1, 1, item);
      }
      this.setData({
        monthDays: days
      })
    },

    /**
     * 取消所有选中
     */
    cancelAllSelected: function () {
      var days = this.data.monthDays;
      for (const date of days) {
        date.selected = false;
      }
      this.setData({
        monthDays: days
      })
    }

  }
})