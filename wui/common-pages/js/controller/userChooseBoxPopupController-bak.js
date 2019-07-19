/**
 * 日期：2018-07-06
 * 作者：Chenzx
 * 描述：userChooseBox弹出公共页面控制类
 */

var _className = "userChooseBoxPopupController";

/*
{
    "selectorId": "userChooseBox_chooseBox_userChooseBox",
    "treeTitle": "组织树结构",
    "treeUrl": "http://localhost:9090/examples/widgets/json/_getOrgsTree.json",
    "tabUrl": "",
    "tabTitle": "",
    "text": "userName",
    "name": "userId",
    "maxNumber": "false",
    "isAllowDuplicates": "0",
    "isRewrite": "0",
    "pageHeight": "570px",
    "isDisableRemove": "0",
    "otherParam": "{}",
    "treeSetting": "{}",
    "gridSetting": "{}",
    "gridUrl": "http://localhost:9090/examples/widgets/json/_queryUsersByOrgId.json",
    "gridTitle": "人员列表",
    "value": "",
    "randomCode": "1530856319299"
}
 */
var oGrid = null, oTags = null, oTree = null, oTabs = null;
// 获取URL请求参数
var queryParams = _formatQueryString();
wui.logParamValue("queryParams", queryParams, _className);
// 页面默认参数设置
var pageParams = {
    // {String} 组织树初始化id
    orgTreeId: "orgsTree"    
    // {String} 子组织列表初始化id
    , userListId: "userList"     
    // {String} 选中标签组件初始化id
    , chosenTagsId: "chosen"
    // {string} 选项卡工具初始化ID
    , tabsId: "selectTabs"

    , otherParam: {orgId: ""}
    // 树结构设置
    , treeSetting: {
        isEnabledSearch: true
        // 懒加载时请求的字段名
        , lazyField: "parentDeptId"
        // 设置只展开第一层,即根节点层
        , expandLevel: 1
        , offset: {
            bottom: 65
        }
        , searchBarSetting: {
            isLocalData: false
            // 自定义搜索服务地址
            // , searchUrl: ""  
        }
        , onActivate: function(event, data) {
            var node = data.node;
            // 获取到当前tree选中节点的要传递到列表页面的数据{parentId: node.key}
            pageParams.otherParam.parentId = node.key;
            // chooseBoxPopSetting.otherParam[chooseBoxPopSetting.name] = node.key;
            if(oGrid){
                _refreshUsersGrid();
            }else{
                _initUsersGrid();
            }
        }
    }

    , gridSetting: {
    	offset: {
            bottom: 65
        }
    }

    , tagsSetting: {
        isFreeInput: false
    }
    // 常用人员数据
    , commonUserData: []
    // 自定义分组数据
    , customGroupData: []
    // "全部"选项页数据
    , treeGridData: []
}
/**
 * 格式化页面请求的参数
 * @return {[type]} [description]
 */
function _formatQueryString(){
    wui.logMethodCalled("_formatQueryString", _className);

    var queryString = wui.getQueryString();
    console.error(JSON.stringify(queryString));
    // var queryString = {
    //     "selectorId": "userChooseBox",
    //     "treeTitle": "组织树结构",
    //     "treeUrl": "/wui/examples/widgets/json/_getOrgsTree.json",
    //     "lazyField": "parentDeptId",
    //     "isEnabledSearch": true,
    //     "tabUrl": "",
    //     "tabTitle": "",
    //     "gridUrl": "/wui/examples/widgets/json/_queryUsersByOrgId.json",
    //     "gridTitle": "人员列表",
    //     "text": "userName",
    //     "name": "userId",
    //     "maxNumber": false,
    //     "isAllowDuplicates": false,
    //     "isRewrite": false,
    //     "isDisableRemove": false,
    //     "otherParam": {},
    //     "treeExtSetting": null,
    //     "tabsExtSetting": null,
    //     "gridExtSetting": null,
    //     "tagsExtSetting": null,
    //     "value": "",
    //     "randomCode": 1547088776666
    // }
    // var isRewrite = wui.formatParamToBool(queryString.isRewrite);
    var oFormat = {
        // {String} 父页面chooseBox组件id
        parentSelectorId: queryString.selectorId
        // {Array} 获取父页面选中节点
        , parentNodes: wui.getChooseBoxNode()
        // {String} 子组织列表服务地址
        , gridUrl: queryString.gridUrl
        // {JSON} 传递给选择接口的其他参数
        , otherParam: queryString.otherParam

        // , isRewrite: wui.formatParamToBool(queryString.isRewrite)

        , isDisableRemove: queryString.isDisableRemove

        , name: queryString.name
    };

    var treeSetting = {
        // 树标题
        title: queryString.treeTitle
        // 树请求服务地址,传递参数parentId
        , loadDataUrl: queryString.treeUrl
        , name: "orgId"
        , text: "orgName"
        , maxNumber: queryString.maxNumber
        // 测试懒加载
        , onLazyLoad: function(event, data){
            var node = data.node;
            var lazyData = {};
            lazyData["parentDeptId"] = node.key;
            data.result = {
                url : queryString.treeUrl, // 自定义懒加载服务地址
                data : lazyData,  // 自定义懒加载参数
                debugDelay : 200
            };
        }
    };
    oFormat.treeSetting = treeSetting;

    var gridSetting = {
        caption: queryString.gridTitle
        , maxNumber: queryString.maxNumber
    };
    oFormat.gridSetting = gridSetting;

    var tagsSetting = {
        name: queryString.name
        , text: queryString.text
        , maxNumber: queryString.maxNumber
        , isAllowDuplicates: queryString.isAllowDuplicates
    };
    oFormat.tagsSetting = tagsSetting;

    return oFormat;
}


/**
 * 获取列表配置参数
 * @return {JSON} 用户列表组件配置参数
 */
function _getUserGridConfig(){
    wui.logMethodCalled("_getUserGridConfig" ,_className);

	var gridUrl = wui.buildUrl(queryParams.gridUrl, pageParams.otherParam);
	var config = {
		url: gridUrl
        , searchColNum: 2
        , searchBarSetting: {
            // 搜索条件格中内容格宽度比例
            contentColWidthRec: 2    

            // 搜索条件格中按钮格占整行比例
            , btnColWidth: "19%" 
        }
        , onGridComplete : function(){
            _gridComplete();
        }
        , onBeforeSearchGrid: function(postData){
            wui.logMethodCalled("onBeforeSearchGrid");
        }
        , onOverMaxNumber: function(selectedRowIds, maxNumber){
            wui.warnNotice("最多可选择 " + maxNumber + " 行!!!");
        }
	}

	var colModel = [
        { label: '员工号', name: 'userNum', sortable: true, search: true, width: "80px" },
        { label: '姓名', name: 'userName', search: true, sopt: 'eq', width: "100px"},
        { label: '账号', name: 'userId', search: true, sopt: 'eq', width: "200px"},
        { label: '所属部门', name: 'orgName', search: true, sopt: 'eq', width: "200px"}
    ];
    // 设置key字段
	for(var i = 0; i < colModel.length; i++){
		if(colModel[i].name === queryParams.name){
			colModel[i].key = true;
		}
	}

	config.colModel = colModel;
	return config;
}

/**
 * 初始化选中标签组件模块
 * @return {[type]} [description]
 */
function _initChosenTags(){
    var chosenTagsConfig = $.extend(true, {}, queryParams.tagsSetting, pageParams.tagsSetting)
    oTags = wui.tagsinput(pageParams.chosenTagsId, chosenTagsConfig);
    // 设置默认的标签节点
    oTags.set(queryParams.parentNodes, false, !(queryParams.isDisableRemove));

    oTags.on("itemRemoved", function(e){
        var item = e.item;
        updateSelectedNode(item, false);
    }).on("itemAddError", function(e){ // 监听标签添加失败时，取消子页面节点选中
        if(e.code != 2){
            wui.warnNotice(e.message);
            var item = e.item;
            updateSelectedNode(item, false);
        }
            
    }).on("itemRemoveError", function(e){  // 监听标签删除失败时，增加子页面节点选中
        if(e.code != 2){
            wui.warnNotice(e.message);
            var item = e.item;
            updateSelectedNode(item, true);
        } 
    });
}

/**
 * 初始化组织树
 * @return {[type]} [description]
 */
function _initOrgsTree(){
    var orgTreeConfig = $.extend(true, {}, queryParams.treeSetting, pageParams.treeSetting);
    
    oTree = wui.tree(pageParams.orgTreeId, orgTreeConfig);

    $('[name="cnLowerLevel"]').on("change", function(event){
        var isInclude = $(this).prop("checked");
        pageParams.otherParam.isInclude = isInclude;
        if(pageParams.isHasList){
            _refreshUsersGrid();
        }else{
            // console.info(orgTreeConfig)
            oTags.empty();
            if(queryParams.treeSetting.maxNumber !== 1){
                orgTreeConfig.value = "";
                orgTreeConfig.isChangeAllChildren = isInclude;
            }
            oTree.option(orgTreeConfig);
        }
    })
}

/**
 * Grid加载完成执行方法
 * @return {[type]} [description]
 */
function _gridComplete(){
    _setGridSelectedRow(true);

    // 监听Grid事件
    // 初始化本页面选中节点：不同的页面可能选中方法不同
    oGrid.on("selectedRow", function(e){
        updateResultNode(e.row, e.status);
    }).on("selectedAll", function(e){
        updateResultNode(e.rows, e.status);
    })
}

/**
 * 设置用户列表默认选中项
 */
function _setGridSelectedRow(isChecked){
	isChecked = isChecked || false;
	// 初始化默认选中值
    var selectValue = getResultNode()
    if (selectValue.length > 0) {
        var rowKeys = [];
        $.each(selectValue, function (index, json) {
            var key = json[queryParams.tagsSetting.name];   // name字段
            if(key !== undefined){
                rowKeys.push(key);
            }
        })
        if(isChecked){
            oGrid.select(rowKeys);
        }else{
            oGrid.unselect(rowKeys);
        }
        // oGrid.selectRows(rowKeys);
    }
}

/**
 * 初始化子组织列表
 * @return {[type]} [description]
 */
function _initUsersGrid(){
    var usersGridConfig = $.extend(true, {}, queryParams.gridSetting, _getUserGridConfig(), pageParams.gridSetting);
    oGrid = wui.grid(pageParams.userListId, usersGridConfig);
}

/**
 * 刷新子组织列表
 * @return {[type]} [description]
 */
function _refreshUsersGrid(){
    var gridUrl = wui.buildUrl(queryParams.gridUrl, pageParams.otherParam);
    oGrid.option({url: gridUrl});
}

/**
 * 加载常用人员选项页数据
 * @return {[type]} [description]
 */
function _loadCommonUserTab(){
    wui.logMethodCalled("_loadCommonUserTab", _className);

    var _onSuccess = function(res){
    	var users = res.rows;
    	pageParams.commonUserData = users;
    	var len = users.length;

    	var htmlStr = '';
    	for(var i = 0; i < len; i++){
    		var user = users[i];

    		htmlStr += '<div class="wui-form-check">';
            htmlStr += '    <input type="checkbox" name="' + user.userId + '" value="' + user.userName + '" />';
            htmlStr += '    <label for="' + user.userId + '" class="fa">';
            htmlStr += '    </label>';
            htmlStr += '    <span>' + user.userText + '</span>';
            htmlStr += '</div>';
    	}

    	$("#commonUsersList").html(htmlStr);
    	$("#commonUsersList").find('[type="checkbox"]').on("change", function(){
    		var value = $(this).val();
    		var isChecked = $(this).prop("checked");
    		updateResultNode(value, isChecked);
    	})
    }

    var _onError = function(){

    }

    var _url = "json/_queryCommonUsers.json";
    var url = wui.buildUrl(_url, {"userId": "010101"});
    wui.getAjax({
    	url: url,
    	onSuccess: _onSuccess,
    	onError: _onError
    })
}

/**
 * 加载自定义组选项页数据
 * @return {[type]} [description]
 */
function _loadCustomGroupTab(){
    wui.logMethodCalled("_loadCustomGroupTab", _className);

    var _onSuccess = function(res){
    	// console.info(res);
    	var groups = res.rows;
    	pageParams.customGroupData = groups;
    	var len = groups.length;
    	var htmlStr = '';
    	for(var i = 0; i < len; i++){
    		var group = groups[i];

    		htmlStr += '<li>';
            htmlStr += '    <a href="javascript:void(0);" _data="' + group.groupName + '">' + (i+1) + '、' + group.groupText + '</a>';
            htmlStr += '</li>';

    		// htmlStr += '<div class="wui-form-check">';
      //       htmlStr += '    <input type="checkbox" name="' + group.groupId + '" value="' + group.groupName + '" />';
      //       htmlStr += '    <label for="' + group.groupId + '" class="fa">';
      //       htmlStr += '    </label>';
      //       htmlStr += '    <span>' + group.groupName + '</span>';
      //       htmlStr += '</div>';
    	}

    	$("#customGroupList").html(htmlStr);
    	// $("#customGroupList").find('[type="checkbox"]').on("change", function(){
    	// 	var value = $(this).val();
    	// 	var isChecked = $(this).prop("checked");
    	// 	updateResultNode(value, isChecked);
    	// })
    	$("#customGroupList").find('a[_data]').on("click", function(){
    		var value = $(this).attr("_data");
    		updateResultNode(value, true);
    	})
    }

    var _onError = function(){

    }

    var _url = "json/_queryCustomGroup.json";
    var url = wui.buildUrl(_url, {"userId": "010101"});
    wui.getAjax({
    	url: url,
    	onSuccess: _onSuccess,
    	onError: _onError
    })
}

/**
 * 绑定按钮事件
 * @return NULL
 */
function _bindBtnEvent(){

    $("#btnSubmit").on("click", function(){
        var data = getResultNode();
        var params = {
            selectorId: queryParams.parentSelectorId,
            data: data
        }
        wui.closeModalDialog(params);
    })

    $('#btnCancel').click(function(){
        // 取消模态窗口
        wui.cancelModalDialog();
    });
}


/**
 * 更新组件页结果值
 * @param  {json}  node      [更新的节点数据]
 * @param  {Boolean} isChecked [是否选中]
 * @param  {Boolean} [isTriggerEvent] [是否触发改变事件监听,默认是false,不触发]
 * @return null
 */
function updateResultNode(node, isChecked, isTriggerEvent){
    isChecked = isChecked || false;
    isTriggerEvent = isTriggerEvent || false;   // 是否触发选择改变事件
    if(isChecked){
        if(queryParams.tagsSetting.maxNumber == 1){
            oTags.set(node, isTriggerEvent);
        }else{
            oTags.add(node, isTriggerEvent);
        }
    }else{
        oTags.remove(node, isTriggerEvent);
    }
}

/**
 * 更新常用人员选中节点
 * @param  {String}  value     更新节点的值
 * @param  {Boolean} isChecked 是否选中,默认是false
 * @return 
 */
function _updateCommonUsersList(value, isChecked){
	isChecked = isChecked || false;
	if(value){
		$("#commonUsersList").find('[type="checkbox"][value="' + value + '"]').each(function(el, index){
			$(this).prop("checked", isChecked);
		})
	}
}

/**
 * 更新选项卡选中值
 * @param  {json}  node      [更新的节点数据]
 * @param  {Boolean} isChecked [是否选中]
 * @return null
 */
function updateSelectedNode(node, isChecked){
    isChecked = isChecked || false;

    var key = node;
    if (typeof(node) === "object") {
        key = node[queryParams.tagsSetting.name];
    }

    oTabs.index(function(activeIndex, element, dom){
        // console.info(activeIndex);
        // console.info(element);
        // console.info(dom);
        if($(dom).attr("id") === "commonUsers"){
        	_updateCommonUsersList(key, isChecked);
        }else if($(dom).attr("id") === "all"){
        	if(oGrid){
		        if(isChecked){
		            oGrid.select(key);
		        }else{
		            oGrid.unselect(key);
		        }
		        // oGrid.selectRows(key);
		    }else if(oTree){
		        if(isChecked){
		            oTree.select(key);
		        }else{
		            oTree.unselect(key);
		        }
		    }
        }
   });   
}

/**
 * 获取选中节点
 * @return {Array} 选中节点集
 */
function getResultNode(type){
    type = type || "json";
    return oTags.get(type);
}

/**
 * 初始化页面容器的规格
 * @return {[type]} [description]
 */
function _initPageSize(){
	var tabSize = wui.getFullScreenSize(".popup-page-tab");
    $(".popup-page-tab").height(tabSize.height - 65);
    $(".popup-tab-container").height(tabSize.height - 65);
}

/**
 * 初始化页面
 * @return {[type]} [description]
 */
function _initPage(){

    _initChosenTags();

    oTabs = wui.tabs(pageParams.tabsId, {
        index: 2,
        onShown: function(event){
        	var self = event.target;
	        if($(self).attr("href") === "#commonUsers"){
	        	// 加载常用人员选项页数据
	            if(!$(self).attr("isInit")){
	            	_loadCommonUserTab();
	            	$(self).attr("isInit", "1");
	            }else{
	            	$("#commonUsersList").find('[type="checkbox"]').each(function(){
	            		$(this).prop("checked", false);
	            	})
	            	var selectedNode = getResultNode("value");
	            	for(var i = 0; i < selectedNode.length; i++){
	            		_updateCommonUsersList(selectedNode[i], true);
	            	}
	            }
	        }else if($(self).attr("href") === "#customGroup"){
	        	// 加载自定义组选项页数据
	            if(!$(self).attr("isInit")){
	            	_loadCustomGroupTab();
	            	$(self).attr("isInit", "1");
	            }
	        }else if($(self).attr("href") === "#all"){
	        	if(!$(self).attr("isInit")){
	            	_initOrgsTree();
	            	$(self).attr("isInit", "1");
	            }else{
	            	_refreshUsersGrid();
	            }
	        }
        }
    })
}