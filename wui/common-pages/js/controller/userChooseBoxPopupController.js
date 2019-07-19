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
    // {String} 组织树初始化id
var treeId = "orgsTree",
    // {String} 子组织列表初始化id
    gridId = "userList",
    // {String} 选中标签组件初始化id
    chosenId = "chosen", 
    // {string} 选项卡工具初始化ID
    tabsId = "selectTabs";
    
    
// 获取URL请求参数
// var queryParams = _formatQueryString();
// wui.logParamValue("queryParams", queryParams, _className);
// 获取页面请求参数集
var queryParams = userChooseBoxPopupService.getQueryString();
wui.logParamValue("queryParams", queryParams, _className);

/**
 * 初始化页面入口
 * @return {[type]} [description]
 */
// 1、初始化布局
// 2、
function initPage(){
    wui.logMethodCalled("initPage", _className);

    // 初始化页面布局
    _initPageLayout();

    // 初始化页面组件
    _initWidget();

    // 绑定按钮事件
    _bindBtnEvent();
}


/**
 * 初始化页面组件
 * @Author   Chenzx
 * @DateTime 2018-11-30
 * @return   {[type]}   [description]
 */
function _initWidget(){
    wui.logMethodCalled("_initWidget", _className);

    // 初始化标签结果集模块
    _initChosen();

    oTabs = wui.tabs(tabsId, {
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
                    _initTree();
                    $(self).attr("isInit", "1");
                }else{
                    _refreshUsersGrid();
                }
            }
        }
    })
}

/**
 * 初始化页面布局
 * @Author   Chenzx
 * @DateTime 2018-11-30
 * @return   {[type]}   [description]
 */
function _initPageLayout(){
    wui.logMethodCalled("_initPageLayout", _className);

    var tabSize = wui.getFullScreenSize(".popup-page-tab");
    $(".popup-page-tab").height(tabSize.height - 65);
    $(".popup-tab-container").height(tabSize.height - 65);
}

/**
 * 初始化选中标签组件模块
 * @return {[type]} [description]
 */
function _initChosen(){
    wui.logMethodCalled("_initChosen", _className);
    // 初始化标签组件
    oTags = wui.tagsinput(chosenId, userChooseBoxPopupService.getChosenConfig());

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
 * 初始化树结构
 * @param  {Boolean} isShowCheckBox [description]
 * @param  {[type]}  onActivate     [description]
 * @param  {[type]}  onSelectedNode [description]
 * @return {[type]}                 [description]
 */
function _initTree(){
    wui.logMethodCalled("_initTree", _className);

    // 树节点点击触发事件
    var onActivate = function(event, data) {
        var node = data.node, otherParams = {};
        // 获取到当前tree选中节点的要传递到列表页面的数据{parentId: node.key}
        if(queryParams.otherParams){
            otherParams = queryParams.otherParams
        }
        otherParams.parentId = node.key;

        if(oGrid){
            // 刷新列表
            _refreshUsersGrid(otherParams);
        }else{
            // 初始化列表
            _initUsersGrid(otherParams);
        }
    }
    var treeConfig = userChooseBoxPopupService.getTreeConfig(onActivate);
    wui.logParamValue("treeConfig", treeConfig);
    oTree = wui.tree(treeId, treeConfig);

    $('[name="cnLowerLevel"]').on("change", function(event){
        var isInclude = $(this).prop("checked");
        otherParams.isInclude = isInclude;
        _refreshUsersGrid(otherParams);
    })
}

/**
 * 初始化列表组件
 * @return {[type]}            [description]
 */
function _initUsersGrid(otherParams){
    wui.logMethodCalled("_initUsersGrid", _className);

    var colModel = [
        { label: '员工号', name: 'userNum', sortable: true, search: true, width: "80px" },
        { label: '姓名', name: 'userName', search: true, sopt: 'eq', width: "100px"},
        { label: '账号', name: 'userId', search: true, sopt: 'eq', width: "200px"},
        { label: '所属部门', name: 'orgName', search: true, sopt: 'eq', width: "200px"}
    ];
    var gridConfig = userChooseBoxPopupService.getGridConfig(colModel, otherParams, _gridComplete);
    wui.logParamValue("gridConfig", gridConfig);
    oGrid = wui.grid(gridId, gridConfig);
}

/**
 * 刷新列表
 * @return {[type]} [description]
 */
function _refreshUsersGrid(otherParam){
    var gridUrl = wui.buildUrl(queryParams.gridUrl, otherParam);
    oGrid.option({url: gridUrl});
}

/**
 * Grid加载完成执行方法
 * @return {[type]} [description]
 */
function _gridComplete(){

    var selectValue = getResultNode()
    if (selectValue.length > 0) {
        var rowKeys = [];
        $.each(selectValue, function (index, json) {
            var key = json[queryParams.name];   // name字段
            if(key !== undefined){
                rowKeys.push(key);
            }
        })
        oGrid.select(rowKeys);
    }

    // 监听Grid事件
    oGrid.on("selectedRow", function(e){
        updateResultNode(e.row, e.status);
    }).on("selectedAll", function(e){
        updateResultNode(e.rows, e.status);
    })
}

/**
 * 加载常用人员选项页数据
 * @return {[type]} [description]
 */
function _loadCommonUserTab(){
    wui.logMethodCalled("_loadCommonUserTab", _className);

    var _onSuccess = function(res){

        var htmlStr = template('commonUsersListTemplate', {
            users: res.rows
        });

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

        var htmlStr = template('customGroupListTemplate', {
            groups: res.rows
        })

        $("#customGroupList").html(htmlStr);

        $("#customGroupList").find('a[_data]').on("click", function(){
            var value = $(this).attr("_data");
            updateResultNode(value, true);
        })
    }

    var _onError = function(){}

    var _url = "json/_queryCustomGroup.json";
    var url = wui.buildUrl(_url, {"userId": "010101"});
    wui.getAjax({
        url: url,
        onSuccess: _onSuccess,
        onError: _onError
    })
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
 * 更新组件页结果值
 * @param  {json}  node      [更新的节点数据]
 * @param  {Boolean} isChecked [是否选中]
 * @param  {Boolean} [isTriggerEvent] [是否触发改变事件监听,默认是false,不触发]
 * @return null
 */
function updateResultNode(node, isChecked, isTriggerEvent){
    isChecked = isChecked || false;
    isTriggerEvent = isTriggerEvent || false;   // 是否触发选择改变事件
    // console.error(node)
    if(isChecked){
        if(queryParams.maxNumber == 1){
            oTags.set(node, isTriggerEvent);
        }else{
            oTags.add(node, isTriggerEvent);
        }
    }else{
        oTags.remove(node, isTriggerEvent);
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
        key = node[queryParams.name];
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
