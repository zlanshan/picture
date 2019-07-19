$(document).ready(function () {
  var myDateStart = null, myDateEnd = null;
  // 开始时间设置
  myDateStart = wui.date("startTime", {
    "format": "yyyy-mm-dd hh:ii:ss",
    "isShowClearBtn": false,
    "isShowTodayBtn": false,
    // 日期视图选择开始的时间
    "startDate": wui.getDate()
  }).on("changeDate", function () {
    // 设置结束时间的开始可选时间为所选日期
    myDateEnd.option({
      startDate: myDateStart.get()
    })
  });
// 结束时间设置
  myDateEnd = wui.date("endTime", {
    "format": "yyyy-mm-dd hh:ii:ss",
    "isShowClearBtn": false,
    "isShowTodayBtn": false,
    "startDate": wui.getDate()
  }).on("changeDate", function () {
    // 设置开始时间的结束可选时间为所选日期
    myDateStart.option({
      endDate: myDateEnd.get()
    })
  });

  // 发布状态
  var publish = wui.selectBox("publish", {
    loadUrl: "",
    name: "value",
    text: "text",
    maxNumber: 1,
    isShowActionsBox: false,
    "loadData": [{
      "value": "1",
      "text": "草稿"
    }, {
      "value": "2",
      "text": "发布"
    }]
  })
  // 日程执行状态
  var status = wui.selectBox("status", {
    loadUrl: "",
    name: "value",
    text: "text",
    maxNumber: 1,
    isShowActionsBox: false,
    "loadData": [{
      "value": "1",
      "text": "未开始"
    },
    {
      "value": "2",
      "text": "进行中"
    },
    {
      "value": "3",
      "text": "已完成"
    },
    {
      "value": "4",
      "text": "已取消"
    },
    {
      "value": "5",
      "text": "已删除"
    }
    ]
    
  })

  // 富文本
  var myUeditor = wui.ueditor("content");
 // 初始化表单数据
 

 
  
  var _url = "http://10.105.183.22:8080/portal-api/";
  // 获取url上携带的参数
  var obj = wui.getQueryString();
  var data = {};
  // id存在的话，编辑日程；不存在，就是新增日程
  if (obj.id) {
    // 添加刪除的按鈕
    var btn = $('<button type="button" data-button="delete" class="wui-btn wui-btn-warning">删除</button>');
    $(".text-center").append(btn);

    getData();
  } else {
    // 移除刪除的按鈕
    $('.wui-btn.wui-btn-warning').remove();
  }

  // 表单中的按钮事件调用
  _bindBtnEvent();

  // 编辑日程的初始化
   function getData() {
    var url1= _url + "schedule/"+obj.id;
    wui.ajax({
      method: "get",
      url: url1,
      data: {},
      onSuccess: function (res) {   
        // 获取当前日程id的所有的数据
        data = res;
        // 数据填充到表单中
        wui.fillForm(res);
        if (res.publish == "发布") {
          // set对应的输入对应的value值
          publish.set(2);
        } else {
          publish.set(1)
        }
        if (res.status == "未开始") {
          status.set(1)
        } else if (res.status == "进行中") {
          status.set(2)
        } else if (res.status == "已完成") {
          status.set(3)
        } else if (res.status == "已取消") {
          status.set(4)
        } else if (res.status == "已删除") {
          status.set(5);
        }        
      },
      onError: function (res) {
        console.error(11);
      },
      async: true,
      dataType: "json",
      contentType: "application/x-www-form-urlencoded"
    })
  }
  

  // 表单中的事件设置
  function _bindBtnEvent() {
    var url2 = _url + 'schedule';
    // var url = "http://192.168.1.100:8080/" + 'schedule';
    $('[data-button]').each(function (i, elem) {
      $(elem).on("click", function () {
        var action = $(this).attr("data-button");
        if (action == "save") {
          var theValidate = wui.validate("#widgetForm");

          var isValid = theValidate.valid();
          // 自动获取表单中的所有数据
          var d = wui.getForm("#widgetForm");
          // d.startTime = wui.formatDate(d.startTime, "yyyy-mm-dd hh:mm:ss");
          // d.endTime = wui.formatDate(d.endTime, "yyyy-mm-dd hh:mm:ss");
          if (d.publish == 1) {
            d.publish="草稿"
          } else if(d.publish==2){
            d.publish="发布"
          }
          if (d.status == 1) {
            d.status = "未开始";
          } else if (d.status == 2) {
            d.status = "进行中";
          } else if (d.status == 3) {
            d.status = "已完成";
          } else if (d.status == 4) {
            d.status="已取消"
          } else if (d.status == 5) {
            d.status="已删除"
          }
          // 设置单选框的值
          var checkBox = $('input[type="checkbox"]').attr('checked');
          if (checkBox == "checked") {
            d.isPrivate = true;
          } else {
            d.isPrivate = false;
          }
          // 删除对象中多加的一个属性
          delete d.content_ueditor;
          if (obj.id) {
            var data11 = {};
            $.extend(true,data11, data, d);
            // var url1 = "http://192.168.1.101:8080/" + "schedule";
          
          //  将数据转成json格式的
            var obj2 = JSON.stringify(data11);
          } else {
            d.scheduleId = "";
            //
            d.userId = "c7ecd4eb-5689-41a4-a6de-58996e4bf951";
            d.tenantCode = "TenantCode2";
            var obj2 = JSON.stringify(d);
          }
          var url3 = wui.buildUrl(url2, { "userToken": "c7ecd4eb-5689-41a4-a6de-58996e4bf951"});
       
          if (isValid) {
            wui.ajax({
              method:"post",
              url: url3,
              data:obj2,
              onSuccess: function (res) {
                // 信息提醒后再关闭窗口？
                wui.successNotice("日程新建或更新成功");
                wui.backhome();
              },
              onError: function (res) {
                wui.notice("信息有误");
              },
              async: true,
              dataType: "json",
              contentType: "application/json"
            })
            // 应该还添加个成功后自动跳转到先前的页面
          } else {
            wui.notice("数据没填写完成")
          }
        } else if (action == "empty") {
          // 清空当前表单的数据
          wui.emptyForm("#widgetForm")
          
        } else if (action == "cancel") {
          // 取消的话，先将数据清空，再考虑回退到先前页，也可以是设置成关闭这个弹出层
          wui.emptyForm("#widgetForm")
          wui.backhome();          
        } else if (action == "delete") {
          var url1 = _url + "schedule/" + obj.id;
          wui.deleteAjax({
            url: url1,
            data: {},
            onSuccess: function (res) {
              wui.successNotice("删除成功");
              wui.backhome();
            },
            async: true,
            dateType: "json",
            contentType: "application/x-www-form-urlencoded"
          })
        }
         })
       })
    }
  
 
   
 })