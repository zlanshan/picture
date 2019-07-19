/**
 * 日期：2018-04-24
 * 作者：Chenzx
 * 描述：WUI下拉公共页面控制类
 */
var _className = "comboBoxDdController";
// 获取页面请求参数集
var queryParams = comboPopupService.getQueryString();
var oTabs = null, oTree = null, oTags = null;
var treeId = "tree", tabId = "tabs", chosenId = "chosen";

/**
 * 初始化页面入口
 * @return {[type]} [description]
 */
function initPage(){
    wui.logMethodCalled("initPage", _className);

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

    var isShowCheckBox = false, onActivate, onSelectedNode;

    // 判断是否有列表链接
    if( queryParams.tabUrl && queryParams.tabUrl.length > 0 ){
        queryParams.isHasList = true;
        onActivate = function(event, data) {
            var node = data.node;
            // 获取到当前tree选中节点的要传递到列表页面的数据{parentId: node.key}
            var otherParam = {
                parentId: node.key,
                nodeKey: node.key,
                nodeTitle: node.title,
                nodeData: node.data
            }
            if(oTabs){
                // 刷新选项卡
                _refreshTabs(otherParam);
            }else{
                // 初始化选项卡
                _initTabs(otherParam);
            }
        }
    }else{
        $("body").addClass("page-hide-list");
        queryParams.isHasList = false;
        isShowCheckBox = true;
        onSelectedNode = function(node){
            gridPopupCommonService.updateResultNode(node, node.selected);
        }
    }

    // 判断是否有树地址
    if( queryParams.treeUrl ){
        queryParams.isHasTree = true;

        // 初始化页面DOM
        _initPageLayout();
        
    }else{
        $("body").addClass("page-hide-tree");
        queryParams.isHasTree = false;
    }

    if(queryParams.isHasTree){
        // 有树的情况
        _initTree(isShowCheckBox, onActivate, onSelectedNode);
    }else if(queryParams.isHasList){
        // 没有树只有列表的情况
        _initTabs();
    }else{
        // 没有树和列表的情况
        $("#btnSubmit").hide();
        wui.errorNotice("没有传入树结构地址和列表页面地址!!!");
    }
    
    // 初始化标签结果集模块
    _initChosen();
}

/**
 * 初始化页面布局
 * @Author   Chenzx
 * @DateTime 2018-11-30
 * @return   {[type]}   [description]
 */
function _initPageLayout(){
    wui.logMethodCalled("_initPageLayout", _className);

    $("#treeTitle").html(queryParams.treeTitle);

    // 设置树结构高度
    var treeModuleHeight = $('.popup-page-tree').height();
    $("#" + treeId).parent().css({
        "height": (treeModuleHeight - $(".tree-head").height() - 10) + "px",
        "width": "100%"
    })
}

/**
 * 初始化标签结果集模块
 * @return {[type]} [description]
 */
function _initChosen(){
    wui.logMethodCalled("_initChosen", _className);

    // 初始化标签组件
    oTags = wui.tagsinput(chosenId, comboPopupService.getChosenConfig());

    // 设置初始值
    oTags.set(queryParams.parentNodes, false, !(queryParams.isDisableRemove));

    gridPopupCommonService.listenTagsEvent(chosenId, updateSelectedNode);
}

/**
 * 初始化树结构
 * @param  {Boolean} isShowCheckBox [description]
 * @param  {[type]}  onActivate     [description]
 * @param  {[type]}  onSelectedNode [description]
 * @return {[type]}                 [description]
 */
function _initTree(isShowCheckBox, onActivate, onSelectedNode){
    wui.logMethodCalled("_initTree", _className);

    var treeConfig = comboPopupService.getTreeConfig(isShowCheckBox, onActivate, onSelectedNode);
    wui.logParamValue("treeConfig", treeConfig);
    oTree = wui.tree(treeId, treeConfig);
}

/**
 * 初始化选项卡组件
 * @param  {[type]} otherParam [description]
 * @return {[type]}            [description]
 */
function _initTabs(otherParam){
    wui.logMethodCalled("_initTabs", _className);

    var tabsConfig = comboPopupService.getTabsConfig(otherParam);
    oTabs = wui.tabs(tabId, tabsConfig);
}

/**
 * 刷新选项卡组件
 * @return {[type]} [description]
 */
function _refreshTabs(otherParam){
    wui.logMethodCalled("_refreshTabs", _className);

    var tabsConfig = comboPopupService.getTabsConfig(otherParam);
    oTabs.option(tabsConfig);
}

/**
 * 绑定按钮事件
 * @return NULL
 */
function _bindBtnEvent(){

    // $("#btnSubmit").on("click", function(){
        
    //     var data = gridPopupCommonService.getParentResultNode();
    //     var params = {
    //         selectorId: queryParams.parentSelectorId,
    //         data: data
    //     }
    //     wui.closeModalDialog(params);
    // })

    // $('#btnCancel').click(function(){
    //     // 取消模态窗口
    //     wui.cancelModalDialog();
    // });
}

/**
 * 更新选项卡选中值
 * @param  {json}  node      [更新的节点数据]
 * @param  {Boolean} isChecked [是否选中]
 * @return null
 */
function updateSelectedNode(node, isChecked){
    isChecked = isChecked || false;
    if(oTabs){
        oTabs.index(undefined, function(index, elemnt, iframe){
            if(iframe.contentWindow){
                var iframeContentWindow = iframe.contentWindow;
                if(iframeContentWindow.gridPopupCommonService 
                    && typeof(iframeContentWindow.gridPopupCommonService) === "object"
                        && typeof(iframeContentWindow.gridPopupCommonService.updateIframeSelectedNode) === "function"){
                    iframeContentWindow.gridPopupCommonService.updateIframeSelectedNode(node, isChecked);
                }else if(iframeContentWindow.updateSelectedNode 
                    && typeof(iframeContentWindow.updateSelectedNode) === "function"){
                    iframeContentWindow.updateSelectedNode(node, isChecked);
                }
            }
        });
    }else if(oTree){
        if(isChecked){
            oTree.select(node);
        }else{
            oTree.unselect(node);
        }
    }
}
