/**
* 日期：2019-06-05
* 作者：Chenzx
* 版本：0.0.5
* 描述：WUI 完整配置项。可以在这里配置整个框架的特性
*/
/**************************提示********************************
 * 所有被注释的配置项均为 WUI 默认值,必须在wui.min.js之前加载到页面。
 * 修改默认配置请首先确保已经完全明确该参数的真实用途。
 * 主要有两种修改方案，一种是取消此处注释，然后修改成对应参数；另一种是在实例化组件时传入对应参数。
 * 当升级框架时，可直接使用旧版配置文件替换新版配置文件,不用担心旧版配置文件中因缺少新功能所需的参数而导致脚本报错。
 **************************提示********************************/
// $.support.cros=true;

(function () {

    /**
     * 框架资源文件上下文路径
     */
 //    var isDev = true;
    var CONTEXT = "/";
	// var FILECONTEXT = isDev ? CONTEXT : "/frameworkFile";
	// var CONTEXTPATH = document.location.protocol + "//" + document.location.host + CONTEXT;
	var CONTEXTPATH = "/wui/";
	
	var _getWindowSecond = function(theWindow){
		// console.info(theWindow);
		if(theWindow.top == theWindow.parent){
			return theWindow;
		}else{
			if(theWindow.parent){
				return _getWindowSecond(theWindow.parent);
			}else{
				return theWindow;
			}
		}
	}

	/**
	 * 公共API接口参数
	 * @type {Object}
	 */
	var commonAPI = {

		// {String} 后台服务地址
		// hostAddress: "http://localhost:8888/bingosoft-framework-main"
		hostAddress: "http://111.230.47.180:7070"
		// , hostAddress: "http://localhost:7070"
		// hostAddress : "http://localhost:53890"
		
		// {String} 组织树服务接口地址,默认是"",主要用于组织选择和人员选择组件全局设置
		, orgServiceAPI: CONTEXTPATH + "examples/widgets/json/_getOrgsTree.json" 

		// {String} 子组织列表服务接口地址,默认是"",主要用于组织选择组件全局设置
		, subOrgServiceAPI: CONTEXTPATH + "examples/widgets/json/_querySubOrgsByOrgId.json"

		// {String} 用户列表服务接口地址,默认是"",主要用于人员选择组件全局设置
		, userServiceAPI: CONTEXTPATH + "examples/widgets/json/_queryUsersByOrgId.json"

		// {String} 选人公共页面服务接口地址,默认是"",主要用于选人公共页面全局设置
		, chooseUserServiceAPI: CONTEXTPATH + "common-pages/json/_queryNext.json"

        // {String} 列表数据文件上传服务接口地址,默认是""
        , gridFileUploadServiceAPI: "http://111.230.47.180:7070/Upload.aspx"

        // {String} 列表数据导入服务接口地址,默认是""
        , gridImportServiceAPI: "http://111.230.47.180:7070/Upload.aspx"

		// {Object} 审批意见组件全局数据源,默认是null
		// , opinionBoxSource: null
		
		// {String} 数据字典服务接口
		// , dictionaryCodeServiceAPI: CONTEXTPATH + "examples/expands/json/_querydictionaryCode.json"
	}

    /**
     * 配置项主体
     */
    window.WUI_PARAMS = {

	    // {Boolean} 是否测试模式,默认是false
        isDev : true
	    
		// {Boolean} 是否开启组件调试模式,默认是true
		, isDebug : true

		// {String} 上下文路径
		, contextPath: CONTEXTPATH
	
		// {String} 公共页面存放文件夹路径(鉴于可能会在不同的页面使用公共页面，所以此参数建议使用绝对路径)
		, commonPageBasePath: CONTEXTPATH + "common-pages/"
		
		// 自定义模态框弹出的窗口,默认是"top": self(本窗口)/parent(父窗口)/top(顶层窗口,默认)
		// , modalWindow: function(win){
		// 	// 返回首页的第二层窗口
		// 	return _getWindowSecond(win);
		// }
		
		// 日志工具全局配置
        // , logUtilConfig: {
        //     // {Boolean} 是否打印开发日志,此参数可以一次性关闭下列五类日志的打印
        //     // isLog : true

        //     // {Boolean} 是否打印方法日志
        //     // isLogMethodCalled : true

        //     // {Boolean} 是否打印参数日志
        //     // , isLogParamValue : true 

        //     // {Boolean} 是否打印消息日志
        //     // , isLogMessage : true

        //     // {Boolean} 是否打印错误日志
        //     // , isLogError : true

        //     // {Boolean} 是否打印警告日志
        //     // , isLogWarn: true
            
        //     // 调试模式下日志输入配置
        //     // , debugConfig: {

        //     //     // {Boolean} 是否打印方法日志
        //     //     isLogMethodCalled : false

        //     //     // {Boolean} 是否打印参数日志
        //     //     , isLogParamValue : false 

        //     //     // {Boolean} 是否打印消息日志
        //     //     , isLogMessage : false

        //     //     // {Boolean} 是否打印错误日志
        //     //     , isLogError : true

        //     //     // {Boolean} 是否打印警告日志
        //     //     , isLogWarn: true
        //     // }
        // }
    	
        // {string} 弹出层页面默认高度(chooseBox/orgChooseBox/userChooseBox),默认是'570px'
        , pageHeight: '96%'   
        // {string} 弹出层页面默认宽度(chooseBox/orgChooseBox/userChooseBox),默认是'1200px'
        , pageWidth: '96%' 

        // {Object} 列表默认配置
        // , gridSetting: {
        //     // 默认Grid列配置参数
        //     defaultColConfig: {
        //         /* 字段基础 */
        //         // 当从服务器端返回的数据中没有id时,将此作为唯一rowid使用只有一个列可以做这项设置。如果设置多于一个,那么只选取第一个,其他被忽略
        //         key: false,     
        //         // 如果colNames为空则用此值来作为列的显示名称,如果都没有设置则使用name 值
        //         label : "",
        //         // 表格列的名称,所有关键字,保留字都不能作为名称使用包括subgrid, cb and rn.
        //         name : "",
        //         // 水平对齐方式,center,left,right,不填表示根据wstype参数进行判断
        //         align : "",
        //         // 在初始化表格时是否要隐藏此列         
        //         hidden: false,
        //         // 是否显示隐藏此列,若设置为true,且hidden为false时,一开始不显示,但是可通过筛选按钮显示出来
        //         hidedlg: false,

        //         /* 列操作 */
        //         // 是否冻结列
        //         frozen : false,
        //         // 列宽度是否要固定不可变
        //         fixed: true,
        //         // 默认列的宽度,只能是象素值,不能是百分比
        //         // width : 100,
        //         drap: false,
        //         // 是否允许排序
        //         sortable : false,
        //         // 设置列的css。多个class之间用空格分隔,如：'class1 class2' 。表格默认的css属性是ui-ellipsis
        //         // classes: "", 
        //         // ”/”, ”-”, and ”.”都是有效的日期分隔符。y,Y,yyyy 年YY, yy 月m,mm for monthsd,dd 日.默认值ISO Date (Y-m-d)         
        //         // datefmt: "Y-m-d",
        //         // 查询字段的默认值         
        //         // defval: "123",       
        //         // 单元格是否可编辑         
        //         editable: false,
        //         // 编辑的一系列选项.{name:’__department_id’,index:’__department_id’,width:200,editable:true,edittype:’select’,editoptions: {dataUrl:”${ctx}/admin/deplistforstu.action”}},这个是演示动态从服务器端获取数据  
        //         // editoptions: {},
        //         // 编辑的规则{name:’age’,index:’age’, width:90,editable:true,editrules: {edithidden:true,required:true,number:true,minValue:10,maxValue:100}},设定 年龄的最大值为100,最小值为10,而且为数字类型,并且为必输字段         
        //         // editrules: {},
        //         // 可以编辑的类型。可选值：text, textarea, select, checkbox, password, button, image and file.         
        //         // edittype: "text",
        //         // 用在当datatype为local时,定义搜索列的类型,可选值：int/integer - 对integer排序float/number/currency - 排序数字date - 排序日期text - 排序文本         
        //         // sorttype: "text",
        //         // 对列进行格式化时设置的函数名或者类型           
        //         formatter: "",

        //         // 对列进行格式化时设置的类型
        //         wstype: "",
                
        //         /* 字段搜索 */ 
        //         // 是否允许查询
        //         search : false,        
        //         // 搜索数据时的url         
        //         // surl: "",
        //         // 定义搜索元素的类型
        //         stype: "text",
        //         // 设置搜索参数   
        //         searchoptions : { 
        //             // // {string} 只有当搜索类型为select才起效
        //             // dataUrl: "",
        //             // // {function} 只有当dataUrl设置时此参数才起效，通过一个function来构建下拉框
        //             // buildSelect: function(){},
        //             // // {function} 初始化时调用,通常用在日期的选择上，用法：dataInit: function(elem) {do something}
        //             // dataInit: function (elem) {$(elem).datepicker();},
        //             // // {array} 事件列表，用法：dataEvents: [{ type: 'click', data: { i: 7 }, fn: function(e) { console.log(e.data.i); }},{ type: 'keypress', fn: function(e) { console.log('keypress'); } }]
        //             // dataEvents: [
        //             //     { 
        //             //         type: 'click', 
        //             //         data: { i: 7 }, 
        //             //         fn: function(e) { 
        //             //             console.log(e.data.i); 
        //             //         }
        //             //     },{ 
        //             //         type: 'keypress', 
        //             //         fn: function(e) { 
        //             //             console.log('keypress'); 
        //             //         } 
        //             //     }
        //             // ],
        //             // // {object} 设置属性值。attr : { title: “Some title” }
        //             // attr: { 
        //             //     title: "自定义标题属性值" 
        //             // },
        //             // // {array} 此参数只用到单列搜索上,说明搜索条件
        //             // sopt: [],
        //             // // {string} 默认值
        //             // defaultValue: "",
        //             // // {mixed} 只用在搜索类型为select下。可以是string或者object；
        //             // // 如果为string则格式为value:label，且以“;”结尾；
        //             // // 如果为object格式为editoptions:{value:{1:'One';2:'Two'}}
        //             // value: "",
                    
        //             // 自定义搜索字段名
        //             // customSearchName: "",

        //             // {boolean} 隐藏列是否可在高级查询中作为查询项,默认为true
        //             searchhidden: true
        //         },
        //         // 当formatter为"date"/"dateRange"时,显示内容格式
        //         formatDate: "yyyy-mm-dd",
        //         // 查询字段默认值
        //         searchDefVal: "",
        //         // 搜索栏排序值,默认是8
        //         searchSort: 8,
        //         // 查询格式限制
        //         searchrules : {}
        //         // 对于form进行编辑时的属性设置
        //         // formoptions: {},
        //         // 对某些列进行格式化的设置         
        //         // formatoptions: {},
        //         // 对列进行格式化时设置的函数名或者类型
        //     }
        // }

        // 数据字典配置
        , dictCodeSetting: {
            // 数据字典项,格式{"dirctName": [{"id": "item1", "name": "itemName1"}, ...], ...}
            items: {
                "statusText": [
                    {
                        "id": 1,
                        "name": "启用"
                    },
                    {
                        "id": 0,
                        "name": "禁用"
                    }
                ],
                "status": [
                    {
                        "id": "enabled",
                        "name": "启用"
                    },
                    {
                        "id": "disabled",
                        "name": "禁用"
                    }
                ],
                "sex": [
                    {
                        "id": "man",
                        "name": "男性"
                    },
                    {
                        "id": "woman",
                        "name": "女性"
                    },
                    {
                        "id": "other",
                        "name": "其他"
                    }
                ],
                "education": [
                    {
                        "id": "primary-school",
                        "name": "小学"
                    },
                    {
                        "id": "junior-high-school",
                        "name": "初中"
                    },
                    {
                        "id": "senior-high-school",
                        "name": "高中"
                    },
                    {
                        "id": "undergraduate",
                        "name": "本科"
                    },
                    {
                        "id": "postgraduate",
                        "name": "研究生"
                    },
                    {
                        "id": "doctoral",
                        "name": "博士"
                    },
                    {
                        "id": "postdoctoral",
                        "name": "博士后"
                    }
                ]
            },
            
            // 字典项value字段名
            name: "id",

            // 字典项文本字段名
            text: "name"
        }


        // 审批意见框公共意见弹窗全局配置
        , commonOpinionsSetting: {
            url: null
            // successCallback: null,
            // width: "220px",    // 设置全屏,可不传递此参数
            // height: "300px", // 设置全屏,可不传递此参数
            // title: "常用意见选择",
            // isFull: true,
            // onPoped: null
        }

        // {JSON} 框架常用服务接口集合
		, serviceInterface: commonAPI
    };
})();
