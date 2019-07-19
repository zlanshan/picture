/**
 * 日期：2018-06-26
 * 作者：Chenzx
 * 描述：orgChooseBox弹出公共页面控制类
 */

/**
 * 场景：
 * 1、树+列表+标签
 * 2、树+标签：单选
 * 3、树+标签：多选
 */

var _className = "orgChooseBoxPopupController";
var oGrid = null, oTags = null, oTree = null;
var treeId = "tree", gridId = "list", chosenId = "chosen";
var otherParams = {}

// 获取页面请求参数集
var queryParams = popupService.getQueryString();
wui.logParamValue("queryParams", queryParams, _className);

/**
 * 初始化页面入口
 * @return {[type]} [description]
 */
// 1、初始化布局
// 2、
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
    if( queryParams.gridUrl ){
        queryParams.isHasList = true;
        onActivate = function(event, data) {
            var node = data.node;
            // 获取到当前tree选中节点的要传递到列表页面的数据{parentId: node.key}
            otherParams.parentId = node.key;
            if(oGrid){
                // 刷新选项卡
                _refreshSubOrgsGrid(otherParams);
            }else{
                // 初始化选项卡
                _initSubOrgsGrid(otherParams);
            }
        }
    }else{
        $("body").addClass("page-hide-list");
        queryParams.isHasList = false;
        isShowCheckBox = true;
        onSelectedNode = function(item, node){
            // updateResultNode(node, node.selected);
            item.parentKey = node.parent.key;
            console.error(node)
            gridPopupCommonService.updateResultNode(item, item.selected);
        }
        // 若仅有树，且可选个数为1,则隐藏"包含下级"复选框
        if(queryParams.maxNumber === 1){
            $('.wui-form-check').hide();
        }
    }

    // 判断是否有树地址
    if( queryParams.treeUrl ){
        queryParams.isHasTree = true;

        // 初始化页面布局
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
        _initSubOrgsGrid();
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
    oTags = wui.tagsinput(chosenId, popupService.getChosenConfig());

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

    var treeConfig = popupService.getTreeConfig(isShowCheckBox, onActivate, onSelectedNode);
    wui.logParamValue("treeConfig", treeConfig);
    oTree = wui.tree(treeId, treeConfig);

    $('[name="cnLowerLevel"]').on("change", function(event){
        var isInclude = $(this).prop("checked");
        otherParams.isInclude = isInclude;
        if(queryParams.isHasList){
            _refreshSubOrgsGrid(otherParams);
        }else{
            // console.info(orgTreeConfig)
            oTags.empty();
            if(queryParams.maxNumber !== 1){
                // treeConfig.value = "";
                treeConfig.isChangeAllChildren = isInclude;
            }
            // oTree.option(treeConfig);
            oTree.option({isChangeAllChildren: isInclude});
        }
    })
}

/**
 * 初始化列表组件
 * @return {[type]}            [description]
 */
function _initSubOrgsGrid(){
    wui.logMethodCalled("_initSubOrgsGrid", _className);

    var colModel = [
        { label: '部门编号', name: 'orgId', sortable: true, search: true, width: "80px" },
        { label: '部门简称', name: 'orgName', search: true, sopt: 'eq', width: "100px"},
        { label: '部门全称', name: 'orgFullName', search: true, sopt: 'eq', width: "200px"}
    ];
    var gridConfig = popupService.getGridConfig(colModel, otherParams, _gridComplete);
    wui.logParamValue("gridConfig", gridConfig);
    oGrid = wui.grid(gridId, gridConfig);
}

/**
 * Grid加载完成执行方法
 * @return {[type]} [description]
 */
function _gridComplete(){
    // 初始化默认选中值
    var selectValue = gridPopupCommonService.getParentResultNode()
    if (selectValue.length > 0) {
        var rowKeys = [];
        $.each(selectValue, function (index, json) {
            var key = json[queryParams.name];   // name字段
            if(key !== undefined){
                rowKeys.push(key);
            }
        })
        oGrid.selectRows(rowKeys);
    }

    // 监听Grid事件
    // 初始化本页面选中节点：不同的页面可能选中方法不同
    oGrid.on("selectedRow", function(e){
        // updateResultNode(e.row, e.status);
        gridPopupCommonService.updateResultNode(e.row, e.status, false);
    }).on("selectedAll", function(e){
        // updateResultNode(e.rows, e.status);
        gridPopupCommonService.updateResultNode(e.rows, e.status, false);
    })
}


/**
 * 刷新列表组件
 * @return {[type]} [description]
 */
function _refreshSubOrgsGrid(){
    wui.logMethodCalled("_refreshSubOrgsGrid", _className);

    var gridUrl = wui.buildUrl(queryParams.gridUrl, otherParams);
    oGrid.option({url: gridUrl});
}

/**
 * 绑定按钮事件
 * @return NULL
 */
function _bindBtnEvent(){

    $("#btnSubmit").on("click", function(){
        var data = gridPopupCommonService.getParentResultNode();
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
 * 更新选择区域的选中值
 * @param  {json}    node       更新的节点数据 
 * @param  {Boolean} isChecked  是否选中
 * @return null
 */
function updateSelectedNode(node, isChecked){
    isChecked = isChecked || false;
    if(oGrid){
        isChecked = isChecked || false;
        var key = node;
        if (typeof node === "object") {
            key = node[queryParams.name];
        }
        oGrid.selectRows(key);
    }else if(oTree){
        if(isChecked){
            oTree.select(node);
        }else{
            oTree.unselect(node);
        }
    }
}
