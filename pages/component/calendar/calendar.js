// pages/im-calendar/calendar.js
Component({
  properties: {
    config: {
      type: Object,
      value: {
        /** 日历组件背景色 */
        backgroundColor: "#fff",
        /** 文字主题色 */
        themeColor: "#555",
        /** 周末文字色 */
        weekendColor: "#b00",
        /** 选中日期的背景色 */
        selectedBgColor: "#555",
        /** 是否只显示当前月 */
        onlyShowCurrentMonth: true,
      }
    },
  },
  data: {
    weekHeader: ['日', '一', '二', '三', '四', '五', '六'],
    monthDays: [],
    lastMonthDays: [],
    nextMonthDays: [],
    year: 2020,
    month: 1,
  },
  lifetimes: {
    /** 组件实例刚刚被创建好时 */
    created: function () {
      var now = new Date();
      this.setData({
        year: now.getFullYear(),
        month: now.getMonth() + 1
      })
    },
    /** 在组件完全初始化完毕、进入页面节点树后 */
    attached: function () {
      this._refreshMonthDaysView();
    },
  },
  methods: {
    /**
     * 计算日历视图数据并刷新页面
     */
    _refreshMonthDaysView: function () {
      const firstDayWeek = this._calculateWeek(this.data.year + "-" + this.data.month + "-1");
      const days = this._daysFromMonth(this.data.year, this.data.month);

      // 上个月  
      var lastMonthDays = new Array();
      var showLastMonthDayNum = firstDayWeek;
      if (!this.data.config.onlyShowCurrentMonth) {
        var lastMonthDayNum = 0;
        var lastMonth = this.data.month - 1;
        var lastMonth_year = this.data.year;
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
          "year": this.data.year,
          "month": this.data.month,
          "day": (i + 1),
          "week": week
        });
      }

      // 下个月
      var nextMonthDays = new Array();
      if (!this.data.config.onlyShowCurrentMonth) {
        var nextMonth = this.data.month + 1;
        var nextMonth_year = this.data.year;
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
      var month = this.data.month - 1;
      if (month < 1) {
        this.setData({
          year: this.data.year - 1,
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
      var month = this.data.month + 1;
      if (month > 12) {
        this.setData({
          year: this.data.year + 1,
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
          year: this.data.year - 1,
        }),
        this._refreshMonthDaysView();
    },
    /**
     * 显示明年这月的日历
     */
    _nextYear: function () {
      this.setData({
          year: this.data.year + 1,
        }),
        this._refreshMonthDaysView();
    },

    /**
     * 某一天的点击事件
     * @param {*} dayView 
     */
    _dayClick: function (dayView) {
      var idx = dayView.currentTarget.dataset.idx;
      var days = this.data.monthDays;
      var item = days[idx];
      item.selected = !item.selected;
      days.splice(idx, 1, item);
      this.setData({
        monthDays: days
      })
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
     * @param {Array} dates 日期集合["2021-4-21","2021-4-25",……]
     */
    setSelectedDates: function (dates) {
      var showYear = 0;
      var showMonth = 1;
      var days = this.data.monthDays;
      for (const date of days) {
        date.selected = false;
      }
      for (const date of dates) {
        let nums = date.split("-");
        let year = parseInt(nums[0]);
        let month = parseInt(nums[1]);
        if (showYear == 0) {
          showYear = year;
          showMonth = month;
        }
        if (year != showYear || month != showMonth) continue;
        let day = parseInt(nums[2]);
        if (day >= days.length) continue;
        var item = days[day - 1];
        item.selected = true;
        days.splice(day - 1, 1, item);
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