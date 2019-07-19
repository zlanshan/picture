/**
 * 日期：2018-07-12
 * 作者：Chenzx
 * 描述：弹出选择层公共服务类
 */

var popupService = (function () {
	
	var _className = "popupService";

	var isDev = true,
		// 收藏为常用联系人接口
		collectUrl = "",
		// 请求常用联系人接口
		commonUseUsersUrl = "",
		// 自定义分组接口
		customGroupsUrl = "";
	
	// 弹窗获取到链接参数
	// var popupQueryString = {
	//     "selectorId": "orgChooseBox",
	//     "treeTitle": "组织树结构",
	//     "treeUrl": "/wui/examples/widgets/json/_getOrgsTree.json",
	//     "lazyField": "parentDeptId",
	//     "isEnabledSearch": true,
	//     "tabUrl": "",
	//     "tabTitle": "",
	//     "gridUrl": "",
	//     "gridTitle": "组织列表",
	//     "text": "{{orgId}}-{{orgName}}",
	//     "name": "orgId",
	//     "maxNumber": false,
	//     "isAllowDuplicates": false,
	//     "isRewrite": false,
	//     "isDisableRemove": false,
	//     "otherParam": {},
	//     "treeExtSetting": {
	//         "text": "orgName"
	//     },
	//     "tabsExtSetting": null,
	//     "gridExtSetting": null,
	//     "tagsExtSetting": null,
	//     "value": "",
	//     "randomCode": 1546498938265
	// }

    /**
	 * 获取页面请求的参数
	 * @return {JSON} 页面请求参数集
	 */
    var _getQueryString = function(){
    	wui.logMethodCalled("_formatQueryString", _className);

	    var queryString = wui.getQueryString();
	    // console.error(JSON.stringify(queryString));
	    // console.error(queryString);
	    var oFormat = {
	        // {String} 父页面chooseBox组件id
	        parentSelectorId: queryString.selectorId
	        // {Array} 获取父页面选中节点
	        , parentNodes: wui.getChooseBoxNode()
	        // {JSON} 传递给选择接口的其他参数
	        , otherParam: queryString.otherParam
	        // {Boolean} 是否每次打开弹窗都重置数据,即不要旧数据,默认是false
	        // , isRewrite: wui.formatParamToBool(queryString.isRewrite)

	        , isDisableRemove: queryString.isDisableRemove

	        , isAllowDuplicates: queryString.isAllowDuplicates
	        // {String} 获取节点的name字段名
	        , name: queryString.name
	        // {String} 获取节点的text字段名
	        , text: queryString.text
	        // {Number} 可选个数
	        , maxNumber: queryString.maxNumber
	        // {String} 列表标题
	        , caption: queryString.gridTitle
	        // {String} 列表服务地址
	        , gridUrl: queryString.gridUrl === "" ? null : queryString.gridUrl
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

            // 拓展参数:树组件拓展配置,具体参数详见"wui.tree",不支持传递方法属性值
            , treeExtSetting: queryString.treeExtSetting
            // 拓展参数:列表组件拓展配置,具体参数详见"wui.grid",不支持传递方法属性值
            , gridExtSetting: queryString.treeExtSetting
            // 拓展参数:选项卡组件拓展配置,具体参数详见"wui.tabs",不支持传递方法属性值
            , tabsExtSetting: queryString.tabsExtSetting
            // 拓展参数:标签组件拓展配置,具体参数详见"wui.tagsinput",不支持传递方法属性值
            , tagsExtSetting: queryString.tagsExtSetting

	        // 自定义树的配置
	        // , treeSetting: wui.parseToObj(queryString.treeSetting) ? wui.parseToObj(queryString.treeSetting) : {}
	    };
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
	        isFullScreen: true,
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
     * 获取列表配置参数
     * @param  {Array} colModel       列配置参数
     * @param  {JSON} otherParams    请求参数
     * @param  {Function} onGridComplete 列表加载完成执行方法
     * @return {[type]}                [description]
     */
    var _getGridConfig = function(colModel, otherParams, onGridComplete){
    	wui.logMethodCalled("_getGridConfig", _className);

    	colModel = colModel || [];
    	var queryParams = _getQueryString();
    	var gridUrl = wui.buildUrl(queryParams.gridUrl, otherParams);
    	var config = {
	        url: gridUrl,
	        caption: queryParams.caption,
        	maxNumber: queryParams.maxNumber,
	        onGridComplete : function(){
	            if(onGridComplete && typeof(onGridComplete) === "function"){
	            	onGridComplete();
	            }
	        },
	        onBeforeSearchGrid: function(postData){
	            wui.logMethodCalled("onBeforeSearchGrid");
	        },
	        onOverMaxNumber: function(selectedRowIds, maxNumber){
	            wui.warnNotice("最多可选择 " + maxNumber + " 行!!!");
	        }
	    }

	    // 设置key字段
	    for(var i = 0; i < colModel.length; i++){
	        if(colModel[i].name === queryParams.name){
	            colModel[i].key = true;
	        }
	    }

	    config.colModel = colModel;

    	$.extend(true, config, queryParams.gridExtSetting);

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

    /**
     * 设置收藏
     * @Author   Chenzx
     * @DateTime 2018-11-29
     * @param    {String}     userId    当前用户ID
     * @param    {Boolean}    isCollect 是否设为常用联系人
     * @param    {Function}   onSuccess [请求成功回调方法]
     * @param    {Function}   onFail    [请求失败回调方法]
     */
    var _setCollect = function(userId, isCollect, onSuccess, onFail){
    	wui.logMethodCalled("_setCollect", _className);

    	if(isDev){	// 模拟测试开启
    		if(isCollect){
	    		collectUrl = "json/collect.txt";
	    	}else{
	    		collectUrl = "json/cancelCollect.txt";
	    	}
    	}
	    	

    	var params = {
			url: collectUrl, 
			data: {
				userId: userId,
				isCollect: isCollect
			},
			onSuccess: function(res){

				if(onSuccess && typeof(onSuccess) === "function"){
					onSuccess(res);
				}else{
					wui.successNotice(res, "", {
						timeOut: 1000,
						target: window.parent.document.body
					});
				}
			}, 
			onError: function(res){
				if(onFail && typeof(onFail) === "function"){
					onFail(res);
				}else{
					wui.errorNotice(res, "", {
						timeOut: 1000,
						target: window.parent.document.body
					});
				}
			}, 
			async: true, 
			dataType: "text"
       }

    	wui.getAjax(params);
    }

    /**
     * 请求常用联系人数据
     * @Author   Chenzx
     * @DateTime 2018-11-30
     * @param    {String}     userId    当前用户ID
     * @param    {Function}   onSuccess [请求成功回调方法]
     * @param    {Function}   onFail    [请求失败回调方法]
     * @return   {[type]}             [description]
     */
    var _queryCommonUseUsers = function(userId, onSuccess, onFail){

    	if(isDev){
    		commonUseUsersUrl = "json/_queryCommonUsers.json";
    	}
    	// ajax请求配置
    	var params = {
			url: commonUseUsersUrl, 
			data: {
				userId: userId
			},
			onSuccess: function(res){

				if(onSuccess && typeof(onSuccess) === "function"){
					onSuccess(res);
				}else{
					wui.successNotice("常用联系人请求成功:" + res, "", {
						timeOut: 1000,
						target: window.parent.document.body
					});
				}
			}, 
			onError: function(res){
				if(onFail && typeof(onFail) === "function"){
					onFail(res);
				}else{
					wui.errorNotice("常用联系人请求失败:" + res, "", {
						timeOut: 1000,
						target: window.parent.document.body
					});
				}
			}
       }

    	wui.getAjax(params);
    }

    /**
     * 请求自定义联系人分组数据
     * @Author   Chenzx
     * @DateTime 2018-11-30
     * @param    {String}     userId    当前用户ID
     * @param    {Function}   onSuccess [请求成功回调方法]
     * @param    {Function}   onFail    [请求失败回调方法]
     * @return   {[type]}             [description]
     */
    var _queryCustomGroups = function(userId, onSuccess, onFail){

    	if(isDev){
    		customGroupsUrl = "json/_queryCustomGroup.json";
    	}
    	// ajax请求配置
    	var params = {
			url: customGroupsUrl, 
			data: {
				userId: userId
			},
			onSuccess: function(res){

				if(onSuccess && typeof(onSuccess) === "function"){
					onSuccess(res);
				}else{
					wui.successNotice("自定义分组数据请求成功:" + res, "", {
						timeOut: 1000,
						target: window.parent.document.body
					});
				}
			}, 
			onError: function(res){
				if(onFail && typeof(onFail) === "function"){
					onFail(res);
				}else{
					wui.errorNotice("自定义分组数据请求失败:" + res, "", {
						timeOut: 1000,
						target: window.parent.document.body
					});
				}
			}
       }

    	wui.getAjax(params);
    }

    // 对外调用方法
    return {
    	// 获取页面请求的参数
        getQueryString: _getQueryString
        // 获取标签结果集配置参数
        , getChosenConfig: _getChosenConfig
        // 获取树结构配置参数
        , getTreeConfig: _getTreeConfig
        // 获取列表结构配置参数
        , getGridConfig: _getGridConfig
        // 获取选项卡页面配置参数
        , getTabsConfig: _getTabsConfig
        // 设置常用联系人
        , setCollect: _setCollect
        // 请求常用联系人数据
        , queryCommonUseUsers: _queryCommonUseUsers
        // 请求自定义联系人分组数据
        , queryCustomGroups: _queryCustomGroups
    }
    
})();