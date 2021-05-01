// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedDates: [],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    calendar: Component
  },
  onLoad: function () {
    this.setData({
      calendar: this.selectComponent("#calendar")
    })
  },
  dayTap: function (e) {
    console.log(e.detail);
  },
  getSelectedDates: function () {
    this.setData({
      selectedDates: this.data.calendar.getSelectedDates()
    })
  },
  setSelectedDates: function () {
    this.data.calendar.setSelectedDates([{
      year: 2021,
      month: 4,
      day: 5
    }, {
      year: 2021,
      month: 4,
      day: 24
    }, {
      year: 2021,
      month: 4,
      day: 28
    }, {
      year: 2021,
      month: 5,
      day: 2
    }]);
    this.getSelectedDates();
  },
  cancelAllSelected: function () {
    this.data.calendar.cancelAllSelected();
    this.getSelectedDates();
  }


})