/**
 * 日期：2018-09-21
 * 作者：Chenzx
 * 描述：选人页面公共服务类
 */

var chooseUserPopupService = (function () {
	
	var _className = "chooseUserPopupService";
    
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

    /**
	 * 获取页面请求的参数
	 * @return {JSON} 页面请求参数集
	 */
    var _getQueryString = function(){
    	wui.logMethodCalled("_getQueryString", _className);

	    var queryString = wui.getQueryString();
	    var oFormat = {
	        // {String} 
	        name: queryString.name || "userId"
	        // {String} 显示文本
	        , text: queryString.text || "{{orgName}}-{{userName}}"
	        // {String} 传递给选择接口的其他参数
	        , procId: queryString.procId || ""
	        // {String} 传递给选择接口的其他参数
	        , taskId: queryString.taskId || ""
	        // {String} 传递给选择接口的其他参数
	        , appCode: queryString.appCode || ""
	        // {String} 传递给选择接口的其他参数
	        , currentActivityName: queryString.currentActivityName || ""
	        // {String} 传递给选择接口的其他参数
	        , wfExtendAttr: queryString.wfExtendAttr || false
	        // {String} 传递给选择接口的其他参数
	        , userId: queryString.userId || false
	    };
	    // console.info(oFormat);

    	return oFormat;
    }

    /**
     * 获取树结构配置参数
	 * @param  {Object} orgsTreeData 组织树数据源
	 * @param  {Number/False} maxNumber    可选个数,若为false,表示不限制
     * @param  {Function}  onSelectedNode 复选框改变事件
     * @return {JSON}  树结构配置参数
     */
    var _getTreeConfig = function(orgsTreeData, maxNumber, jsonReader, onSelectedNode){
    	wui.logMethodCalled("_getTreeConfig", _className);

    	var config = {
    		loadDataUrl: orgsTreeData,
			maxNumber: maxNumber,
		    jsonReader: jsonReader,
		    isFullScreen: true,
		    expandLevel: false,
		    isShowCheckBox: true,
		    isChangeAllChildren: true,
		    isEnabledSearch: true,
	    	// height: "413px",
	    	offset: {
	    		bottom: 75
	    	},
	    	onAfterLoad: function(event, data){
	    		// console.error("onAfterLoad");
	    		// 获取第一层级的节点
	    		var firstLevelNodes = data.node.getChildren();
	    		// 全展开
	    		// 1、若只有一个分支，则展开该分支；
	    		// 2、若和当前组织名一致，则展开该分支；
	    		// 3、默认展开第一个分支
	    		$.each(firstLevelNodes, function(i, node){
	    			if(node.getChildren() && node.getChildren().length == 1){
                    	node.setExpanded(true);
                    	node.visit(function(childNode){
                    		 childNode.setExpanded(true);
                    	})
                    	return false;
                    }else if(window.Global && Global.currentUserCompanyName && node.key === Global.currentUserCompanyName){
                    	node.setExpanded(true);
                    	node.visit(function(childNode){
                    		 childNode.setExpanded(true);
                    	})
                    	return false;
                    }else if(node.isLastSibling()){
                    	// 如果当前节点为第一层级的最后一个节点，且不满足前面两个条件，则设置第一个节点展开
                    	var siblingNode = node.getParent().getChildren();
                    	// console.info(siblingNode);
                    	siblingNode[0].setExpanded(true);
                    	siblingNode[0].visit(function(childNode){
                    		 childNode.setExpanded(true);
                    	})
                    	return false;
                    }
	    		});
	    	},
            onBeforeSelect: function(event, data){
            	var node = data.node;
                if(node.getChildren()){
                    node.setExpanded(true);
                }
            },
		    onSelectedNode: function(item, node){
		    	onSelectedNode && (typeof(onSelectedNode) === "function") && onSelectedNode(item, node);
		    }
    	}

    	return config;
    }

    // 对外调用方法
    return {
    	// 获取页面请求的参数
        getQueryString: _getQueryString
        // 获取树结构配置参数
        , getTreeConfig: _getTreeConfig
    }
})();