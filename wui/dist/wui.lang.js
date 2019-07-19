/**
* 日期：2018-11-23
* 作者：Chenzx
* 版本：0.0.1
* 描述：WUI 组件语言包配置项。可以在这里配置整个框架的特性
*/
/**************************提示********************************
 * 所有被注释的配置项均为 WUI 默认值,必须在wui.min.js之前加载到页面。
 * 修改默认配置请首先确保已经完全明确该参数的真实用途。
 * 主要有两种修改方案，一种是取消此处注释，然后修改成对应参数；另一种是在实例化组件时传入对应参数。
 * 当升级框架时，可直接使用旧版配置文件替换新版配置文件,不用担心旧版配置文件中因缺少新功能所需的参数而导致脚本报错。
 **************************提示********************************/
(function () {

	// 框架全局文本配置(以下为默认值，如需自定义，开启配置即可)
	window.WUI_LANGUAGE = {
        // date: {
        //     days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
        //     , daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        //     , daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"]
        //     , months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
        //     , monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
        //     , today: "今日"
        //     , clear: "清空"
        //     , suffix: []
        //     , meridiem: ["上午", "下午"]
        //     // 日期组件按钮组默认清空按钮文本,默认是"<i class='fa fa-remove'></i>"
        //     , clearBtn: "<i class='fa fa-remove'></i>"
        // },
        // chooseBox: {
        //     // 编辑按钮文本
        //     editBtn: "<i class='fa fa-edit'></i>"
        //     // 清空按钮文本
        //     , clearBtn: "<i class='fa fa-trash'></i>"
        // },
        // file: {
        //     dictDefaultMessage: ""
        //     , dictFallbackMessage : "您的浏览器不支持拖放文件上传."
        //     , dictFallbackText : ""
        //     , dictFileTooBig : "文件 ({{filesize}}MB)字节过大。允许上传的最大文件大小: {{maxFilesize}}MB."
        //     , dictInvalidFileType : "此类型文件不被支持上传"
        //     , dictResponseError : "服务器返回状态代码为 {{statusCode}}"
        //     , dictUploadCanceled : "文件上传被取消"                    // 取消上传按钮文本
        //     , dictCancelUploadConfirmation : "您确定取消上传吗?"
        //     // 未上传之前单个文件移除按钮文本
        //     , dictRemoveFile : "<i class=\"fa fa-trash\"></i>"
        //     // 单个上传按钮文本
        //     , dictUploadFile : "<i class=\"fa fa-cloud-upload\"></i>"
        //     // 上传完成之后的取消删除按钮文本
        //     , dictCancelUpload : "<i class=\"fa fa-close\"></i>" 
        //     , dictMaxFilesExceeded : "您上传文件数量达到上限。"
        // },
        // img: {
        //     // 取消上传按钮文本
        //     dictCancelUpload : "<i class=\"fa fa-close\"></i>" 
        //     // 编辑按钮文本
        //     , dictEditFile : "<i class=\"fa fa-edit\"></i>" 
        //     // 删除按钮文本
        //     , dictRemoveFile : "<i class=\"fa fa-trash\"></i>" 
        // },
        // grid: {
        //     // 搜索栏
        //     searchBar: {
        //         // 查询按钮文本
        //         searchBtn: "<i class=\"fa fa-search\"></i>"        

        //         // 重置按钮文本
        //         , resetBtn: "<i class=\"fa fa-refresh\"></i>"  

        //         // 展开更多搜索条件文本
        //         , showMoreBtn: "<i class=\"fa fa-chevron-down\"></i>"  

        //         // 隐藏更多搜索条件文本
        //         , hideMoreBtn: "<i class=\"fa fa-chevron-up\"></i>"  
        //     },
        //     // 工具栏
        //     toolBar: {
        //         // 重置按钮文本
        //         resetBtn: "<i class=\"fa fa-refresh\"></i> 重置"
        //         // 显示数据过滤文本
        //         , showFilterBtn: "<i class=\"fa fa-filter\"></i> 显示数据过滤"
        //         // 高级搜索按钮文本
        //         , highSearchBtn: "<i class=\"fa fa-search\"></i> 高级搜索"
        //         // 导出按钮文本
        //         , exportBtn: "<i class=\"fa fa-sign-out\"></i> 导出"
        //         // 导入按钮文本
        //         , importBtn: "<i class=\"fa fa-sign-in\"></i> 导入"
        //         // 筛选按钮文本
        //         , screenBtn: "<i class=\"fa fa-filter\"></i> 筛选"
        //         // 数据过滤文本中,显示控制切换字符串
        //         , filterShowString: "显示"
        //         // 数据过滤文本中,隐藏控制切换字符串
        //         , filterHideString: "隐藏"
        //     },
        //     // 导入页面标题
        //     importPageTitle: "列表数据导入",
        //     // 树结构图标样式
        //     treeIcon: {
        //         // 文件夹展开之前的图标
        //         plus:'fa fa-angle-right wui-fa-middle'  
        //         // 文件夹展开之后的图标
        //         , minus:'fa fa-angle-down wui-fa-middle'    
        //         // 文件图标 
        //         , leaf:'wui-text-primary'         
        //         // plus:'fa fa-caret-right wui-text-default',   // 文件夹展开之前的图标
        //         // minus:'fa fa-caret-down wui-text-default',     // 文件夹展开之后的图标
        //         // leaf:'fa fa-circle-o wui-text-primary'         // 文件图标
        //     },
        //     // 表格显示文本
        //     defaultText: {
        //         emptyrowstext: "<div>** 暂无数据 **</div>",
        //         recordtext: "{0} - {1}\u3000共 {2} 条", // 共字前是全角空格
        //         emptyrecords: "",
        //         // loadtext: "加载中...",
        //         loadtext: "<img src='" + ui.FRAME_PATH + "themes/images/loading-1.gif' title='加载中...' />",
        //         savetext: "保存中...",
        //         pgtext : " {0} 共 {1} 页",
        //         pgfirst : "首页",
        //         pglast : "尾页",
        //         pgnext : "下一页",
        //         pgprev : "上一页",
        //         pgrecs : "页码记录",
        //         showhide: "列表折叠或展开",
        //         overPageNumberText: "当前列表最多只有 {0} 页",
        //         // mobile
        //         pagerCaption : "Grid::页码设置",
        //         pageText : "页码:",
        //         recordPage : "每页记录",
        //         nomorerecs : "没有更多的记录了...",
        //         scrollPullup: "上拉加载更多...",
        //         scrollPulldown : "下拉刷新...",
        //         scrollRefresh : "释放刷新..."
        //     },
        //     // 单选列头显示文本
        //     singleColHead: "选择"
        // },
        // selectBox: {
        //     // 没有选中选项时,显示文本
        //     noneSelected : "没有选中任何项"    
        //     // 下拉搜索匹配不到内容时显示文本
        //     , noneResults : "匹配不到'{0}'" 
        //      // 下拉视图中,"全不选"按钮文本
        //     , deselectAll : "全不选" 
        //     // 下拉视图中,"全选"按钮文本
        //     , selectAll : "全选"      
        //     // 下拉视图中,"关闭"按钮文本
        //     , doneButton : "关闭"     
        //     // 下拉视图中,搜索框提示语
        //     , liveSearchPlaceholder : "查找选项"
        // },
        // selectComboBox: {
        //     // 没有选中选项时,显示文本
        //     noneSelected : "没有选中任何项" 
        // },
        // tagBox: {
        //     // 输入框提示文本
        //     placeholder : ""
        //     // {string} 没有选中节点时显示内容
        //     , noneItem : "没有标签" 
        // },
        // tagComboBox: {
        //     // {string} 没有选中节点时显示内容
        //     noneItem : "" 
        // },
        // tagsinput: {
        //     // {string} 没有选中节点时显示内容
        //     noneItem : "" 
        // },
        // tree: {
        //     // 虚拟根节点标题
        //     virtualRootTitle: "虚拟根节点"
        // },
        // ueditor: {
        //     // {String} 初始化编辑器的内容,也可以通过textarea/script/input的value赋值,默认是""
        //     initialContent:''    
        //     // {String} 超出字数限制提示  留空支持多语言自动切换,否则按此配置显示
        //     , wordOverFlowMsg:'<span style="color:red;">你输入的字符个数已经超出最大允许值,服务器可能会拒绝保存！</span>'   
        // }
    }

})();
