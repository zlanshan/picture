/**
 * 日期：2018-07-12
 * 作者：Chenzx
 * 描述：弹出选择层公共服务类
 */

var comboPopupService = (function () {
	
	var _className = "comboPopupService";
    
	// var comboBoxQueryString = {
	//     "selectorId": "selectComboBox",
	//     "widgetName": "selectComboBox",
	//     "treeTitle": "",
	//     "treeUrl": "",
	//     "lazyField": "parentId",
	//     "tabUrl": "http://localhost:9090/examples/scene/user/list.html,http://localhost:9090/examples/scene/user/listSearch2.html,http://localhost:9090/examples/scene/user/listSingle.html",
	//     "tabTitle": "访客信息,用户信息,员工信息",
	//     "text": "name",
	//     "name": "id",
	//     "maxNumber": "false",
	//     "pageHeight": "497",
	//     "otherParam": "{\"isHideHeader\":\"1\"}",
	//     "data": "",
	//     "randomCode": "1534300020469"
	// }
	
	// var comboBoxQueryString = {
	//     "selectorId": "selectComboBox",
	//     "widgetName": "selectComboBox",
	//     "treeTitle": "",
	//     "treeUrl": "",
	//     "lazyField": "parentDeptId",
	//     "isEnabledSearch": true,
	//     "tabUrl": "/wui/examples/scene/user/list.html",
	//     "tabTitle": "",
	//     "text": "name",
	//     "name": "id",
	//     "maxNumber": false,
	//     "pageHeight": 594,
	//     "otherParam": {
	//         "isHideHeader": "1"
	//     },
	//     "data": [],
	//     "treeExtSetting": null,
	//     "tabsExtSetting": null,
	//     "randomCode": 1547032225051
	// }

    /**
	 * 获取页面请求的参数
	 * @return {JSON} 页面请求参数集
	 */
    var _getQueryString = function(){
    	wui.logMethodCalled("_formatQueryString", _className);

	    var queryString = wui.getQueryString();
	    // console.error(JSON.stringify(queryString));
	    // var isRewrite = wui.formatParamToBool(queryString.isRewrite);
	    var oFormat = {
	        // {String} 父页面chooseBox组件id
	        parentSelectorId: queryString.selectorId
	        // 组件名
	        , parentPageWidgetName: queryString.widgetName || "selectComboBox"
	        // {Array} 获取父页面选中节点
	        // , parentNodes: wui.getChooseBoxNode()
	        // {JSON} 传递给选择接口的其他参数
	        , otherParam: queryString.otherParam
	        // {String} 获取节点的name字段名
	        , name: queryString.name
	        // {String} 获取节点的text字段名
	        , text: queryString.text
	        // {Number} 可选个数
	        , maxNumber: queryString.maxNumber
	        // {String} 选项页页面导航标题
	        , tabTitle: typeof(queryString.tabTitle) === "object" ? queryString.tabTitle : queryString.tabTitle === "" ? [] : queryString.tabTitle.split(",")
	        // {String} 选项页页面地址集
	        , tabUrl: typeof(queryString.tabUrl) === "object" ? queryString.tabUrl : queryString.tabUrl === "" ? [] : queryString.tabUrl.split(",")
	        // {Stirng} 树结构服务地址
	        , treeUrl: queryString.treeUrl === "" ? null : queryString.treeUrl
	        // {Stirng} 树结构标题
	        , treeTitle: queryString.treeTitle
	        // 树形结构懒加载字段
	        , lazyField: queryString.lazyField
	        // 树形结构是否可搜索
	        , isEnabledSearch: queryString.isEnabledSearch
	        // {Number} 当前页面高度
	        // , pageHeight: parseInt(queryString.pageHeight)

            // 拓展参数:树组件拓展配置,具体参数详见"wui.tree",不支持传递方法属性值
            , treeExtSetting: queryString.treeExtSetting
            // 拓展参数:列表组件拓展配置,具体参数详见"wui.grid",不支持传递方法属性值
            , gridExtSetting: queryString.treeExtSetting
            // 拓展参数:选项卡组件拓展配置,具体参数详见"wui.tabs",不支持传递方法属性值
            , tabsExtSetting: queryString.tabsExtSetting
            // 拓展参数:标签组件拓展配置,具体参数详见"wui.tagsinput",不支持传递方法属性值
            , tagsExtSetting: queryString.tagsExtSetting

	    };
	    var parentNodes = window.parent.wui[oFormat.parentPageWidgetName](oFormat.parentSelectorId).get("json");
	    oFormat.parentNodes = parentNodes;
	    // console.error(oFormat);

    	return oFormat;
    }

    /**
     * 获取标签结果集配置参数
     * @return {JSON} 标签结果集配置参数
     */
    var _getChosenConfig = function(){
    	wui.logMethodCalled("_getChosenConfig", _className);

    	var queryParams = _getQueryString();
    	var config = {
    		isFreeInput: false,
	        name: queryParams.name,
	        text: queryParams.text,
	        isAllowDuplicates: queryParams.isAllowDuplicates,
	        maxNumber: queryParams.maxNumber,
	        maxChars: 27,
	        maxHeight: "100%"
    	}

    	$.extend(true, config, queryParams.tagsExtSetting);

    	return config;
    }

    /**
     * 获取树结构配置参数
     * @param  {Boolean} isShowCheckBox 是否显示复选框
     * @param  {Function}  onActivate     节点选中事件
     * @param  {Function}  onSelectedNode 复选框改变事件
     * @return {JSON}  树结构配置参数
     */
    var _getTreeConfig = function(isShowCheckBox, onActivate, onSelectedNode){
    	wui.logMethodCalled("_getTreeConfig", _className);

    	var queryParams = _getQueryString();
    	var config = {
    		loadDataUrl: queryParams.treeUrl,
	        isShowCheckBox: isShowCheckBox,
	        maxNumber: queryParams.maxNumber,
	        name: queryParams.name,
	        text: queryParams.text,
	        value: queryParams.parentNodes,
	        lazyField: queryParams.lazyField,
	        isEnabledSearch: queryParams.isEnabledSearch,
	        searchBarSetting: {
	        	// 向后台发起搜索请求字段名
	        	searchField: "key"
	        	// 是否本地数据过滤
	        	, isLocalData: false
	        	// 搜索地址,不传则采用初始化的服务地址
	        	// , searchUrl: ""
	        },
	        isFullScreen: false,
	        offset: {
	        	bottom: 5
	        }
    	}

    	// 若是添加复选框,则绑定复选框改变事件
    	if(isShowCheckBox){
    		config.isShowCheckBox = true;
    		config.onSelectedNode = onSelectedNode;
    		config.value = queryParams.parentNodes;
    	}else{
    		config.onActivate = onActivate;
    	}

    	$.extend(true, config, queryParams.treeExtSetting);

    	return config;
    }

    /**
     * 获取选项卡页面配置参数
     * @return {[type]} [description]
     */
    var _getTabsConfig = function(otherParams){
    	wui.logMethodCalled("_getGridConfig", _className);
    	var queryParams = _getQueryString();

    	var tabTitle = queryParams.tabTitle,
	        tabUrl = queryParams.tabUrl,
	        params = {name: queryParams.name, maxNumber: queryParams.maxNumber};
	    var tabPages = [], len = tabUrl.length, isShowTitle = true;
	    
	    for(var i = 0; i < len; i++){
	        var tabPage = {};
	        tabPage.title = tabTitle[i];
	        tabPage.dataType = "iframe";
	        tabPage.content = tabUrl[i];
	        tabPage.otherParam = $.extend(true, {}, params, queryParams.otherParam, otherParams);
	        tabPages.push(tabPage);
	    }

	    // 当第一个节点没有标题时，不显示
	    if(!tabPages[0].title){
	    	isShowTitle = false;
	    }
    	var config = {
    		tabPages: tabPages, 
    		isShowTitle: isShowTitle
    	}

    	$.extend(true, config, queryParams.tabsExtSetting);

    	return config;
    }

    // 对外调用方法
    return {
    	// 获取页面请求的参数
        getQueryString: _getQueryString
        // 获取标签结果集配置参数
        , getChosenConfig: _getChosenConfig
        // 获取树结构配置参数
        , getTreeConfig: _getTreeConfig
        // 获取选项卡页面配置参数
        , getTabsConfig: _getTabsConfig
    }
    
})();