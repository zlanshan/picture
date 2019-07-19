/**
 * 日期：2018-10-08
 * 作者：Chenzx
 * 描述：列表与弹出页面交互的公共服务类
 */
var gridPopupCommonService = (function () {
	
	var _className = "gridPopupCommonService";

	/**
     * 监听Tags事件
     * @Author   Chenzx
     * @DateTime 2018-10-08
     * @param    {String}   tagsId        标签组件初始化ID
     * @param    {[type]}   onItemRemoved 节点移除之后监听事件
     * @param    {[type]}   onItemAdded   节点新增之后监听事件
     * @return   {[type]}                 [description]
     */
	var _listenTagsEvent = function(tagsId, updateSelectedNode, onItemRemoved, onItemAdded){
		wui.logMethodCalled("_listenTagsEvent", _className);

		if(!tagsId){
			wui.errorNotice("传入的tagsId为空!!!", _className + ".listenTagsEvent")
			return;
		}
		window.GLOBAL_TAGS_ID = tagsId;

		var oTagsInfo = wui.tagsinput(tagsId)

		if(!(updateSelectedNode && typeof(updateSelectedNode) === "function")){
			updateSelectedNode =  function(){}
		}

		// 设置初始化值
		// oTagsInfo.set(wui.getChooseBoxNode(), false, !(queryParams.isDisableRemove));

		oTagsInfo.on("itemRemoved", function(e){
	        var item = e.item;

			updateSelectedNode(item, false);
	    }).on("itemAddError", function(e){ 
	    	// 监听标签添加失败时，取消子页面节点选中
	        if(e.code != 2){
	            wui.warnNotice(e.message);
	            var item = e.item;
	            updateSelectedNode(item, false);
	        }
	    }).on("itemRemoveError", function(e){ 
	    	// 监听标签删除失败时，增加子页面节点选中
	        if(e.code != 2){
	            wui.warnNotice(e.message);
	            var item = e.item;
	            updateSelectedNode(item, true);
	        } 
	    });
	}

	/**
	 * 获取选中节点
	 * @Author   Chenzx
	 * @DateTime 2019-01-03
	 * @param    {String}   type 组件值类型: "json"|"value"|"text",默认是"json"
	 * @return   {Array} 
	 */
	var _getParentResultNode = function(type){
    	wui.logMethodCalled("_getParentResultNode", _className);

	    type = type || "json";

	    if(window.GLOBAL_TAGS_ID){
	    	return wui.tagsinput(window.GLOBAL_TAGS_ID).get(type);
	    }
	}

	/**
	 * 更新组件结果值
	 * @param  {json}    node               更新的节点数据
	 * @param  {Boolean} isChecked          是否选中
	 * @param  {Boolean} [isTriggerEvent]   是否触发改变事件监听,默认是false,不触发
	 * @return null
	 */
	var _updateResultNode = function(node, isChecked, isTriggerEvent){
	    isChecked = isChecked || false;
	    isTriggerEvent = isTriggerEvent || false;   // 是否触发选择改变事件

	    if(!window.GLOBAL_TAGS_ID){
			wui.logError("您没有在初始化wui.tagsinput之后调用gridPopupCommonService.listenTagsEvent()方法!!!", _className + ".listenIframeGridEvent")
			return;
		}
		var oTagsInfo = wui.tagsinput(window.GLOBAL_TAGS_ID), maxNumber;
		maxNumber = oTagsInfo.option("maxNumber");

	    // console.error(maxNumber)
	    if(isChecked){
	        // 显示保存按钮
	        // $("#btnSubmit").show(); 
	        if(maxNumber == 1){
	            oTagsInfo.empty(false);
	            oTagsInfo.set(node, isTriggerEvent);
	        }else{
	            oTagsInfo.add(node, isTriggerEvent);
	        }
	    }else{
	        oTagsInfo.remove(node, isTriggerEvent);
	    }

	    if(wui.getQueryStringByName("widgetName")){
	    	var parentPageWidgetName = wui.getQueryStringByName("widgetName"),
	    		parentSelectorId =  wui.getQueryStringByName("selectorId"),
	    		maxNumber = wui.getQueryStringByName("maxNumber");

	    	var component = window.parent.wui[parentPageWidgetName](parentSelectorId);
		    if(isChecked){
		        if(maxNumber == 1){
		            component.empty(false);
		            component.select(node, true, false);
		        }else{
		            component.select(node, true, false);
		        }
		    }else{
		        component.unselect(node, true, false);
		    }
	    }
	}

	/**
     * 初始化Iframe下的Grid组件值并与父页面绑定选择事件关联
     * @Author   Chenzx
     * @DateTime 2018-10-08
     * @param    {String}   gridId         列表初始化ID
     * @param    {[type]}   onSelectedRow 行数据选择事件监听事件
     * @param    {[type]}   onSelectedAll 列表单页数据全选或全不选监听事件
     * @return   {[type]}                 [description]
     */
	var _initIframeGrid = function(gridId, keyField, onSelectedRow, onSelectedAll){
		
		if(!gridId){
			wui.errorNotice("传入的gridId为空!!!", _className + ".initIframeGrid")
			return;
		}
		window.GLOBAL_GRID_ID = gridId;

		keyField = keyField || wui.getQueryStringByName("name");

		// 获取父页面结果值
	    var selectValue = [], oGridInfo = wui.grid(gridId);
	    // 获取父页面结果值
	    if(window.parent && window.parent.gridPopupCommonService 
            && typeof(window.parent.gridPopupCommonService) === "object"
                && typeof(window.parent.gridPopupCommonService.getParentResultNode) === "function"){
            // 调用父页面方法更新节点
	        selectValue = window.parent.gridPopupCommonService.getParentResultNode();
        }

	    if (selectValue && selectValue.length > 0) {
	        var rowKeys = [];
	        $.each(selectValue, function (index, json) {
	            var key = json[keyField];   // name字段
	            if(key != undefined){
	                rowKeys.push(key);
	            }
	        })

	        if(oGridInfo){
	        	oGridInfo.selectRows(rowKeys);
	        }
	        
	    }

	    // 监听Grid事件
	    if(oGridInfo){
	    	// 初始化本页面选中节点：不同的页面可能选中方法不同
		    oGridInfo.on("selectedRow", function(e){
		    	if(onSelectedRow && typeof(onSelectedRow) === "function"){
		    		if(onSelectedRow.call(this, e) === false){
		    			return false;
		    		}
		    	}
		    	
		        _updateParentSelectNode(e.row, e.status);
		    }).on("selectedAll", function(e){
		        if(onSelectedAll && typeof(onSelectedAll) === "function"){
		    		if(onSelectedAll.call(this, e) === false){
		    			return false;
		    		}
		    	}
		        _updateParentSelectNode(e.rows, e.status);
		    })
	    }
	}

	/**
	 * 根据节点更新父页面选中节点
	 * @param  {JSON}  		node      	节点数据
	 * @param  {Boolean} 	isChecked 	是否选中
	 * @return null
	 */
	var _updateParentSelectNode = function(node, isChecked) {
    	wui.logMethodCalled("_updateParentSelectNode", _className);

	    isChecked = isChecked || false;
	    // 获取父页面结果值
	    if(window.parent && window.parent.gridPopupCommonService 
            && typeof(window.parent.gridPopupCommonService) === "object"
                && typeof(window.parent.gridPopupCommonService.updateResultNode) === "function"){
            // 调用父页面方法更新节点
	        window.parent.gridPopupCommonService.updateResultNode(node, isChecked, false);
        }
	}

	/**
	 * 更新Iframe下的Grid选中行
	 * @param  {JSON}  		item      节点数据
	 * @param  {Boolean} 	isChecked 是否选中
	 * @return NULL
	 */
	var _updateIframeSelectedNode = function(item, isChecked, keyField) {
    	wui.logMethodCalled("_updateIframeSelectedNode", _className);

	    isChecked = isChecked || false;
	    
	    var key = item;

	    if (typeof item === "object") {
	    	keyField = keyField || wui.getQueryStringByName("name");
	        key = item[keyField];
	    }
	    
	    if(!window.GLOBAL_GRID_ID){
			wui.logError("您没有在wui.grid的完成事件中调用gridPopupCommonService.initIframeGrid()方法!!!", _className + ".listenIframeGridEvent")
			return;
		}
	    wui.grid(window.GLOBAL_GRID_ID).selectRows(key);
	}

    // 对外调用方法
    return {
    	// 监听Tags事件
    	listenTagsEvent: _listenTagsEvent,
        // 获取父页面结果值
        getParentResultNode: _getParentResultNode,
        // 更新节点数据
        updateResultNode: _updateResultNode,

    	// 初始化Iframe下的Grid组件值并与父页面绑定选择事件关联
    	initIframeGrid: _initIframeGrid,
    	// 更新Iframe下的Grid选中行
    	updateIframeSelectedNode: _updateIframeSelectedNode
    }
})();