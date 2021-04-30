# WxMiniProgramComponent 
# 微信小程序组件
---

> ## 日历小组件 im-calendar
>![日历小组件](https://github.com/GitHub-Life/WxMiniProgramComponent/blob/main/Picture/calendar_shot.png?raw=true)
>
>>#### 日历组件wxml参数
>>|字段名称|类型|默认值|必填|描述|
>>|:-:|:-:|:-:|:-:|:-:|
>>|config|object||☑|组件配置(详情如下)|
>>|binddattap|eventhandler|||日期选择事件，返回值(e.detail)为日期object|
```wxml
<im-calendar config="{{calendarConfig}}"></im-calendar>
```
>>>config下属性
>>>|字段名称|类型|默认值|必填|描述|
>>>|:-:|:-:|:-:|:-:|:-:|
>>>|backgroundColor|string|#fff|☑|日历组件背景色|
>>>|themeColor|string|#555|☑|文字主题色|
>>>|weekendColor|string|#b00|☑|周末文字色|
>>>|selectedBgColor|string|#555|☑|选中日期的背景色|
>>>|onlyShowCurrentMonth|bool|false||是否只显示当前月|
>>>|disableToOtherMonth|bool|false||禁用跳转至其它月份|
>>>|disableSelect|bool|false||禁止选择|
>>>|readonly|bool|false||只读，此值为 true 相当于 disableToOtherMonth 和 disableSelect 都为 true|
```javascript
calendarConfig: {
      /** 日历组件背景色 */
      backgroundColor: "#fff",
      /** 文字主题色 */
      themeColor: "#555",
      /** 周末文字色 */
      weekendColor: "#b00",
      /** 选中日期的背景色 */
      selectedBgColor: "#555",
      /** 是否只显示当前月 */
      onlyShowCurrentMonth: false,
      /** 禁用跳转至其它月份 */
      disableToOtherMonth: false,
      /** 禁止选择 */
      disableSelect: false,
      /** 只读，相当于 disableToOtherMonth 和 disableSelect 都为 true */
      readonly: false,
    }
```
