// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendarConfig: {
        /** 日历组件背景色 */
        backgroundColor: "#fff",
        /** 文字主题色 */
        themeColor: "#555",
        /** 周末文字色 */
        weekendColor: "#c00",
        /** 选中日期的背景色 */
        selectedBgColor: "#777",
        /** 是否只显示当前月 */
        onlyShowCurrentMonth: false,
    },
    selectedDates: [],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    calendar: Component
  },
  onLoad: function () {
    this.setData({
      calendar: this.selectComponent("#calendar")
    })
  },
  getSelectedDates: function () {
    this.setData({
      selectedDates: this.data.calendar.getSelectedDates()
    })
  },
  setSelectedDates: function () {
    this.data.calendar.setSelectedDates(["2021-4-5","2021-4-24","2021-4-28","2021-5-2"]);
    this.getSelectedDates();
  },
  cancelAllSelected: function () {
    this.data.calendar.cancelAllSelected();
    this.getSelectedDates();
  }


})