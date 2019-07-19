$(document).ready(function () {
  var _url = "http://10.105.183.22:8080/portal-api/";
  var scheduleData;

  var myDate = wui.date("date", {
    "format": "yyyy-mm-dd",
    "value": wui.getDate(0),
    "isShowClearBtn": false,
    "isShowTodayBtn": false,
    // 周期从周一开始是1，周日开始数值为0，默认是周日
    "weekStart": 1
    // "startView":-1
  })

  /**
   * 日期遍历
   * @param  $:月份遍历的jq对象
   * @param  month:月份
   * @param  length:当前月份的日期数量
   * @param  startTime:判断的开始时间
   * @param  endTime:判断的结束时间
   */
  var dateTraverse = function ($, month, length, startTime, endTime) {
    for (var i = 0; i < length; i++) {
      var dayo = $.eq(i).text();
      if ((month + "-" + dayo) == startTime || (month + "-" + dayo) == endTime) {
        if ($.eq(i).children().length == 0) {
          // 但这样加元素的话就是占位置的可将其高度设置为0，那可否是添加伪元素的形式？？
          var childdiv = $('<div class="circle"></div>');
          $.eq(i).append(childdiv);
        }
      }
    }
  }


  // 小红圆点的添加
  /**
   * 
   * @param {*} param 请求成功后后台返回的数据
   * @param {*} time 当天时间
   */
  var addCircle = function (param, time) {
    var rows = param.rows;
    rows.forEach(function (e, index) {
      // 获取到返回数据所有数据的开始和结束时间
      var startTime = wui.formatDate(e.startTime);
      var endTime = wui.formatDate(e.endTime) || "";
      var month = wui.formatDate(time, "yyyy-mm");
      // console.log(startTime, endTime,month);
      var days = $(".day");
      // 获取到新旧数据的长度
      var dayso = $(".day.old").length;
      var daysn = $(".day.new").length;
      var mo = parseInt(month.substr(5)) - 1;
      mo = mo < 10 ? "0" + mo : mo;
      var month1 = month.substr(0, 5) + mo;
      // console.log(month1);
      // 上一月的日期遍历
      dateTraverse($(".day.old"), month1, dayso, startTime.endTime);
      // 下一个月的日期遍历
      var mn = parseInt(month.substr(5)) + 1;
      mn = mn < 10 ? "0" + mn : mn;
      var month2 = month.substr(0, 5) + mn;
      // console.log(month2);

      dateTraverse($(".day.new"), month2, daysn, startTime, endTime);

      // 当月的日期遍历
      for (var i = dayso; i < days.length - daysn; i++) {
        // 获取当月列表中的日期
        var day = days.eq(i).text();
        day = day < 10 ? "0" + day : day;
        if ((month + "-" + day) == startTime || (month + "-" + day) == endTime) {
          if (days.eq(i).children().length == 0) {
            // 但这样加元素的话就是占位置的可将其高度设置为0，那可否是添加伪元素的形式？？
            var childdiv = $('<div class="circle"></div>');
            days.eq(i).append(childdiv);
          }
        }
      }
    })
  }
  
  /**
   * dateRender  渲染数据
   * @param {*} res  请求成功后后台返回的数据
   * @param {*} time 当前点击时间
   */
  var dateRender = function (res, time) {
    var rows = res.rows;
   
    // 存放已经找寻到当前时间对应的日程安排
    var result = [];
    var obj = {};
    rows.forEach(function (e, index) {
      // 获取到返回数据所有数据的开始和结束时间
      // var startTime = wui.formatDate(e.startTime);
      // var endTime = wui.formatDate(e.endTime) || "";
      var month = wui.formatDate(time, "yyyy-mm");

      // 要判断res数组的每一项的开始时间和结束时间和当前的是否一致
      result.push(e);

      result.forEach(function (ev, i) {
        ev.startTime = wui.formatDate(ev.startTime, "yyyy-mm-dd hh:ii");
      })
   
        var html = template("arrangeTask",{data:result});
        
        $(".workTask").html(html);
        // 计算高度，判断设置滚动
        var lis = $(".taskDetail");
        var liHeight = 0;
        for (var i = 0; i < lis.length; i++) {
          liHeight += lis.eq(i).height();
        }

        if (liHeight > 60) {
          $(".workTask").addClass("scrollH");
        } else {
          $(".workTask").removeClass("scrollH");
        }

        $.each(lis, function (i, event) {
          event.onclick = function () {
            // 获取每个li下面隐藏的input框的自定义属性值id
            var id = $(this).children().attr("data-id");
            var title = $(this).children("span").text();
            var url = wui.buildUrl("form.html", {
              id: id
            });
            // 每个li点击弹出模态窗口
            wui.openModalDialog({
              url: url,
              // url: "index2.html",
              width: "800px",
              height: "600px",
              title: title,
              isMaxmin: true,
              // 是否点击遮罩层关闭
              isShadeClose: true
            });
          }
        })
      })
    
  }
  /**
   * dataConversion
   * @param {*} a 当前的月份
   */
  var dataConversion = function (a) {
    if (a == "一月") {
      a = 1;
    } else if (a == "二月") {
      a = 2;
    } else if (a == "三月") {
      a = 3;
    } else if (a == "四月") {
      a = 4;
    } else if (a == "五月") {
      a = 5;
    } else if (a == "六月") {
      a = 6;
    } else if (a == "七月") {
      a = 7;
    } else if (a == "八月") {
      a = 8;
    } else if (a == "九月") {
      a = 9;
    } else if (a == "十月") {
      a = 10;
    } else if (a == "十一月") {
      a = 11;
    } else if (a == "十二月") {
      a = 12;
    }
    return a;
  }
  
  /**
   * init 初始化
   * @param {*} time 当前点击的时间
   */
  // 初始化读取日期安排数据
  var init = function (time) {
    //  获取日程的url接口
    var url = _url + "schedule";
    //  小红点获取时url携带的参数
    var data = {
      rows: 10,
      // total:1,
      page: 1,
      filters: JSON.stringify({
        rules: [{
            "field": "start_time",
            "op": "ge",
            "data": wui.getDate(0, "yyyy-mm-dd")
          },
          {
            "field": "start_time",
            "op": "le",
            "data": wui.getDate(7, "yyyy-mm-dd")
          }
        ]
      }),
      // userToken: "c7ecd4eb-5689-41a4-a6de-58996e4bf951";
      userToken:"30A9F316-5680-4B37-89D9-F805F48A45C7"
    }
    var dateUrl = wui.buildUrl(url, data);
    // 小红点的添加
    // circle(dateUrl, time);
    var success = function (param) {
      scheduleData = param;
      addCircle(param, time);
    }
    var fail = function (param) {
      console.error(param);
    }
    wui.getAjax(dateUrl, null, success, fail);

    mySchedule(time);
    
  }

  var mySchedule = function (time) {
    //  获取日程的url接口
    var url = _url + "schedule";
    //  点击时间获取时url携带的参数
    var time1 = time + " 00:00:00";
    var time2 = time + " 23:59:59";
    var data = {
      rows: 10,
      // total:1,
      page: 1,
      filters: JSON.stringify({
        rules: [{
          "field": "start_time",
          "op": "ge",
          "data": time1
        }, {
          "field": "start_time",
          "op": "le",
          "data": time2
        }]
      }),
      userToken: "30A9F316-5680-4B37-89D9-F805F48A45C7"
    }
    
    var url1 = wui.buildUrl(url, data);
    var success = function (param) {
      if (param.rows.length > 0) {
        dateRender(param, time);
      } else {
         // 清除滚动
         $(".workTask").removeClass("scrollH");
         // 重写workTask中的内容
         $(".workTask").html("暂无行程");
      }
    }
    var fail = function (param) {
      console.error(param);
    }
    wui.getAjax(url1, null, success, fail);
  }



  // 获取到当前日期的值
  var date = myDate.get();
  // console.log(date);
  // 初始化日期列表
  init(date);

  // wui.date自带的on事件
  myDate.on("changeValue", function (event) {
    init(wui.getDate(0));
    // alert(event.date);
    mySchedule(event.date);
  })

  // 日程的右箭头点击事件
  $(".next").on("click", function () {
    // 获取当前的月份，点击后其月份加1
    var a = $($(".switch").text().split(" ")).eq(1);
    var b = $($(".switch").text().split(" ")).eq(2)[0].substr(0, 4);
    a = a[0];
    // 月份-汉字转换为数字
    a = dataConversion(a) + 1;
    console.log(a);
    if (a == 13) {
      a = 1;
      b = parseInt(b) + 1;
    }
    a = a < 10 ? "0" + a : a;
    c = b + "-" + a;
    console.log(c);
    init(c)
  })
  // 日程的左箭头点击事件
  $(".prev").on("click", function () {
    // 获取当前的月份，点击后其月份加1
    var a = $($(".switch").text().split(" ")).eq(1);
    var b = $($(".switch").text().split(" ")).eq(2)[0].substr(0, 4);
    a = a[0];
    // 月份-汉字转换为数字
    a = dataConversion(a) - 1;
    if (a == 0) {
      a = 12;
      b = parseInt(b) + 1;
    }
    a = a < 10 ? "0" + a : a;
    // console.log(a);
    c = b + "-" + a;
    init(c)
  })

  // 添加按钮绑定事件即新增日程
  $("button").on("click", function () {
    wui.openModalDialog({
      url: "form.html",
      width: "800px",
      height: "600px",
      title: "日程",
      isMaxmin: true,
      isShadeClose: true
    })
  })
})