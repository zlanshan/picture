/**
 * 日期：2018-12-14
 * 作者：Chenzx
 * 描述：弹出选人公共页面控制类
 */
var _className = "chooseUserPopupController";

// 获取页面请求参数集
var queryParams = chooseUserPopupService.getQueryString();

// 全局变量
var globalParams = {
	sTreeId: "tree", 
	sTagsId: "chosen", 
	eStepList: ".step-list",
	sCheckBoxId: "#stepList", 
	// 步骤接口数据地址
	// sStepUrl: wui.contextPath +apiContextName +"/BaseWorkflowController/queryWorkflowNextSteps",
	// sStepUrl: wui.contextPath + "common-pages/json/_queryNext.json",
	sStepUrl: wui.serviceInterface.chooseUserServiceAPI,
	oStepsData: [], 
	iStepIndex: -1,
	isOnlyOne: false, 
	oOnlyStep: null, 
	isAllowSelect: true,
	isInitTree: false,
	oTree: null,
	oTags: null,
	// 是否增加公司节点(南宁需求,设置为true)
	isAddCompany: true,
	// 树结构数据源字段名
	stepTreeField: "stepOrgs",
	oJsonReader: null
}

/**
 * 加载页面信息
 * @return {[type]} [description]
 */
function loadPageInfo(){
	wui.logMethodCalled("loadPageInfo", _className);

	if(globalParams.isAddCompany){
		globalParams.oJsonReader = {
			// 分支(部门)节点关键字段名,默认是"key"
		    branchId: "key",     	
		    // 分支(部门)节点文本字段名,默认是"title"
		    branchName: "title",  
		    // 叶子(人员)节点关键字段名,默认是"key"
		    leaveId: "userId",      
		    // 叶子(人员)节点文本字段名,默认是"title"
		    leaveName: "userName",  
		    // 子节点字段名,默认是"children"
		    children: "children"     
		}

		globalParams.stepTreeField = "stepCompanys";
	}else{
		globalParams.oJsonReader = {
			// 分支(部门)节点关键字段名,默认是"key"
		    branchId: "orgId",
		    // 分支(部门)节点文本字段名,默认是"title"
		    branchName: "orgName",
		    // 叶子(人员)节点关键字段名,默认是"key"
		    leaveId: "userId",      
		    // 叶子(人员)节点文本字段名,默认是"title"
		    leaveName: "userName",  
		    // 是否父节点标识字段名,默认是"folder"
		    folder: "stepUsers",
		    // 子节点字段名,默认是"children"
		    children: "stepUsers"
		}
	}

	// 初始化页面结构
	_initPage();

	// 绑定事件
	_bindEvent();
}

/**
 * 初始化页面结构
 * @return {[type]} [description]
 */
function _initPage(){
	wui.logMethodCalled("_initPage", _className);

	_initWidgets();

    var formData={};
    var reqData = {
    	procId: queryParams.procId,
    	taskId: queryParams.taskId,
    	appCode: queryParams.appCode,
    	currentActivityName: queryParams.currentActivityName
    };

    if(queryParams.wfExtendAttr){
    	// reqData.wfExtendAttr = queryParams.wfExtendAttr;
    	var wfExtentAttrArrs=queryParams.wfExtendAttr.split("&");
    	for (var i = 0; i < wfExtentAttrArrs.length; i++) {
    		var attrObj=wfExtentAttrArrs[i].split(":");
    		formData[attrObj[0]]=attrObj[1];
		}
    }

    if(queryParams.userId){
    	reqData.userId = queryParams.userId;
    }

	wui.logParamValue("reqData", reqData);
    var url = wui.buildUrl(globalParams.sStepUrl, reqData);

	// wui.getAjax({
	// 	"url": url,
	// 	"successCallback": function(res){
	// 		// console.info(res);
	// 		_initStepsModule(res);
	// 	}, 
	// 	"errorCallback": function(res){
	// 		wui.logError(res, "_initPage");
	// 	}
	// })

	wui.getAjax({
		"url": url,
		"data":JSON.stringify(formData),
		"successCallback": function(res){
			// console.info(res);
			_initStepsModule(res);
		}, 
		"errorCallback": function(res){
			wui.logError(res, "_initPage");
		}
	})
}

/**
 * 初始化组件
 * @return {[type]} [description]
 */
function _initWidgets(){
	wui.logMethodCalled("_initWidgets", _className);
	globalParams.oTags = wui.tagsinput(globalParams.sTagsId, {
	    // text: "{{stepName-" + _text + "}}",
	    text: queryParams.text,
	    name: queryParams.name,
	    maxNumber: queryParams.maxNumber,
	    isFreeInput: false
	}).on("itemAdded", function(event){
		globalParams.oTree.getNodeStatus(event.item[queryParams.name], function(isSelected, node){
			if(!isSelected){
				node.setSelected(true);
			}
		});
		// var theStepData = globalParams.oStepsData[globalParams.iStepIndex];
		globalParams.oStepsData[globalParams.iStepIndex].selectUsers = event.items;
	}).on("itemRemoved", function(event){
		// console.info(event)
		globalParams.oTree.getNodeStatus(event.item[queryParams.name], function(isSelected, node){
			if(isSelected){
				node.setSelected(false);
			}
		});
		globalParams.oStepsData[globalParams.iStepIndex].selectUsers = event.items;
	})
}

/**
 * 初始化步骤模块
 * @param  {Object} res 接口数据源
 * @return {[type]}     [description]
 */
function _initStepsModule(res){
	wui.logMethodCalled("_initStepsModule", _className);

	globalParams.oStepsData = res.businessObject;
	if(!globalParams.oStepsData){
		wui.warnNotice("没有步骤数据!!!");
		return false;
	}

	/**
	 * 南宁需求: 当只有一个步骤且只有一位用户可选时，用文本显示
	 * @Author   Chenzx
	 * @DateTime 2018-10-24
	 */
	if(globalParams.isAddCompany && globalParams.oStepsData.length==1){
		//如果返回只有1个人，无需选择直接确定发送
		if(globalParams.oStepsData[0][globalParams.stepTreeField].length == 1){
			var data = globalParams.oStepsData[0][globalParams.stepTreeField][0];
			// var levelNumber = 0;
			var findLevelNumber = function(node){
				if(node[globalParams.oJsonReader.children]){
					if(node[globalParams.oJsonReader.children].length > 1){
						return false;
					}else if(node[globalParams.oJsonReader.children].length == 1){
						var childNode = node[globalParams.oJsonReader.children][0];
						if(childNode[globalParams.oJsonReader.leaveId]){
							var stepUser= {
								"userId": childNode[globalParams.oJsonReader.leaveId],
				                "orgId": node[globalParams.oJsonReader.branchId],
				                "orgName": node[globalParams.oJsonReader.branchName],
				                "userName": childNode[globalParams.oJsonReader.leaveName]
							}
							return stepUser;
						}else{
							return findLevelNumber(childNode);
						}
					}
				}else{
					return false;
				}
			}

			var stepUser = findLevelNumber(data);
			if(stepUser){
				globalParams.isOnlyOne = true;
				globalParams.oOnlyStep= {
					stepName: globalParams.oStepsData[0].stepName,
					stepLabel: globalParams.oStepsData[0].stepLabel,
					responseType: undefined,
					stepUsers: [stepUser]
				}
				$("#nonUnique").removeClass("col-xs-6").addClass("col-xs-12 light only-one-step");
				$(".dialog-body-r").hide();
				// $("#nonUnique").html("将发送给步骤【<strong>" + globalParams.oStepsData[0].stepLabel + "</strong>】中,部门【<strong>" + stepUser.orgName + "</strong>】下的【<strong>" + stepUser.userName + "</strong>】,点击确定发送");
				$("#nonUnique").html("将发送给部门【<strong>" + stepUser.orgName + "</strong>】下的【<strong>" + stepUser.userName + "</strong>】,点击确定发送");
				return true;
			}
		}else if(globalParams.oStepsData[0]["stepLabel"] == "完成任务"){	// 步骤为"完成任务"时，直接发送下一步
			globalParams.isOnlyOne = true;
			globalParams.oOnlyStep= {
				stepName: globalParams.oStepsData[0].stepName,
				stepLabel: globalParams.oStepsData[0].stepLabel,
				responseType: undefined,
				stepUsers: []
			}
			$("#nonUnique").removeClass("col-xs-6").addClass("col-xs-12 light only-one-step");
			$(".dialog-body-r").hide();
			$("#nonUnique").html("<strong>将直接发送给下一个步骤,点击确定发送</strong>");
			return true;
		}
			
	}

	var html = template("radioTemplate", res);
	$(globalParams.sCheckBoxId).html(html);

	wui.scroll($(globalParams.eStepList));

	$(globalParams.eStepList).find('input[_action="step"]').on("change", function(){
		_doStepSelectEvent(this);
	})

	$(globalParams.eStepList).find('.wui-checkbox-text').on("click", function(){
		var theCheckBox = $(this).prevAll("input").eq(0);
		if(theCheckBox.prop("checked")){
			_doSelectedSteps(theCheckBox.get(0));
		}else{
			// wui.message("还没选中");
		}
	})
	// 如果只有一个步骤，那默认勾选上
	if(globalParams.oStepsData && globalParams.oStepsData.length == 1){
		var theSingleBox = $(globalParams.eStepList).find('input[_action="step"]').eq(0);
		theSingleBox.prop("checked", true);
		_doStepSelectEvent(theSingleBox.get(0));
	}
}

/**
 * 步骤选项选中执行方法
 * @param  {Element} self 选中的步骤选项节点元素
 * @return {[type]}      [description]
 */
function _doSelectedSteps(self){
	wui.logMethodCalled("_doSelectedSteps", _className);

	var $theParent = $(self).parent();
		// 步骤名称
	var stepName = $(self).val(),
		// 数组索引
		index = parseInt($theParent.attr("data-index")),
		// 多选标记
		multipleSelectTag = $theParent.attr("data-multipleSelectTag"),
		// 是否单选,获取到的是字符串
		singleSelect = $theParent.attr("data-singleSelect");

	$theParent.siblings().removeClass("active");
	$theParent.parent().siblings().each(function(i, item){
		$(item).children().removeClass("active");
	})
	// console.info($theParent)
	$theParent.addClass("active");

	// console.info(index)
	// 当前展示值为选中项
	if(globalParams.iStepIndex == index){
		return true;
	}
	globalParams.iStepIndex = index;

	var selectStepData = globalParams.oStepsData[index];
	var maxNumber = false;
	if(selectStepData.singleSelect == true){
		maxNumber = 1;
	}

	var orgsTreeSource = selectStepData[globalParams.stepTreeField];
	globalParams.isAllowSelect = selectStepData.allowSelect;

	// 清空已选的标签节点,并不触发单个节点移除事件
	globalParams.oTags.empty(false);

	// console.error(orgsTreeSource)
	// 若是已有初始化树，则直接更新数据
	if(globalParams.isInitTree){
		globalParams.oTree.enabled();
		globalParams.oTree.unselectAll();
		// 刷新组织树
		_refreshOrgsTree(orgsTreeSource, maxNumber);
	}else{
		_initOrgsTree(orgsTreeSource, maxNumber);
		globalParams.isInitTree = true;
	}

	if(globalParams.oStepsData[globalParams.iStepIndex].autoSelectAll){
		globalParams.oTree.selectAll();
	}else{
		var selectUsers = globalParams.oStepsData[globalParams.iStepIndex].selectUsers;
		// 添加选中节点
		globalParams.oTags.add(selectUsers, true, globalParams.oStepsData[globalParams.iStepIndex].allowSelect);
	}

	if(!globalParams.oStepsData[globalParams.iStepIndex].allowSelect){
		globalParams.oTree.selectAll();
		globalParams.oTree.disabled();
	}else{
		// 如果当前节点的最后一个子节点为该层级的第一个子节点，即该层级只有一个节点时，默认勾选上
		if(orgsTreeSource.length == 1){
			var stepOrg = orgsTreeSource[0];
			if(stepOrg[globalParams.oJsonReader.children] && stepOrg[globalParams.oJsonReader.children].length == 1){
				var secondLevelNode = stepOrg[globalParams.oJsonReader.children][0];
				if(globalParams.isAddCompany){
					if(secondLevelNode[globalParams.oJsonReader.children] && secondLevelNode[globalParams.oJsonReader.children].length <= 1){
						globalParams.oTree.selectAll();
					}
				}else{
					globalParams.oTree.selectAll();
				}
			}
		}
	}

	_changeCheckboxType(stepName, multipleSelectTag);
}

/**
 * 执行步骤选择事件
 * @Author   Chenzx
 * @DateTime 2018-10-19
 * @param    {[type]}   self [description]
 * @return   {[type]}        [description]
 */
function _doStepSelectEvent(self){
	if($(self).prop("checked")){
		// 触发步骤选项选中方法
		_doSelectedSteps(self);
	}else{
		$(self).parent().removeClass("active");
	}
}

/**
 * 初始化组织树结构
 * @param  {Object} orgsTreeData 组织树数据源
 * @param  {Number/False} maxNumber    可选个数,若为false,表示不限制
 */
function _initOrgsTree(orgsTreeData, maxNumber){
	wui.logMethodCalled("_initOrgsTree", _className);
	wui.logParamValue("orgsTreeData", orgsTreeData, "_initOrgsTree");
	wui.logParamValue("maxNumber", maxNumber, "_initOrgsTree");

	var onSelectedNode = function(item, node){
    	// console.info(node.parent.parent.getLevel());
    	var data = node.data;
		data.orgId = node.parent.key;
		data.orgName = node.parent.title;
		if(item.selected){
			globalParams.oTags.add(data, true, globalParams.isAllowSelect);
		}else{
			globalParams.oTags.remove(data);
		}
    }
	var theTreeParams = chooseUserPopupService.getTreeConfig(orgsTreeData, maxNumber, globalParams.oJsonReader, onSelectedNode);
	// console.info(theTreeParams)
	// 初始化树
	globalParams.oTree = wui.tree(globalParams.sTreeId, theTreeParams);
}

/**
 * 刷新组织树结构
 * @param  {Object} orgsTree     组织树组件对象
 * @param  {Object} orgsTreeData 组织树数据源
 * @param  {Number/False} maxNumber    可选个数,若为false,表示不限制
 * @return null
 */
function _refreshOrgsTree(orgsTreeData, maxNumber){
	wui.logMethodCalled("_refreshOrgsTree", _className);
	wui.logParamValue("orgsTreeData", orgsTreeData, "_refreshOrgsTree");
	wui.logParamValue("maxNumber", maxNumber, "_refreshOrgsTree");

	var theTreeParams = {
		loadDataUrl: orgsTreeData,
		maxNumber: maxNumber
	}

	globalParams.oTree.option(theTreeParams);
}

/**
 * 执行改变步骤单复选切换
 * @param  {Element} element 改变的步骤选项节点元素
 * @param  {Boolean} isToggleRadio 是否切换到单选
 * @return {[type]}      [description]
 */
function _doToggleCheckBox(element, isToggleRadio, isChecked){
	wui.logMethodCalled("_doToggleCheckBox", _className);
	wui.logParamValue("element", element, "_doToggleCheckBox");
	wui.logParamValue("isToggleRadio", isToggleRadio, "_doToggleCheckBox");
	wui.logParamValue("isChecked", isChecked, "_doToggleCheckBox");

	if(isToggleRadio){
		if(element.hasClass("wui-form-check")){
			element.removeClass("wui-form-check").addClass("wui-form-radio");
			var $input = element.children('input[type="checkbox"]').eq(0);
			var inputHtml = $input.prop("outerHTML");
			var newInputHtml = inputHtml.replace("checkbox", "radio");
			// console.info(newInputHtml);
			var $newInput = $(newInputHtml);
			$input.remove();
			element.prepend($newInput);
			if(isChecked){
				$newInput.prop("checked", true);
			}
			
			$newInput.off("change").on("change", function(){
				_doStepSelectEvent(this);
			})
		}
	}else{
		if(element.hasClass("wui-form-radio")){
			element.removeClass("wui-form-radio").addClass("wui-form-check");
			var $input = element.children('input[type="radio"]').eq(0);
			var inputHtml = $input.prop("outerHTML");
			var newInputHtml = inputHtml.replace("radio","checkbox");
			// console.info(newInputHtml);
			var $newInput = $(newInputHtml);
			$input.remove();
			element.prepend($newInput);
			if(isChecked){
				$newInput.prop("checked", true);
			}
			$newInput.off("change").on("change", function(){
				_doStepSelectEvent(this);
			})
		}
	}
	element.removeClass("active");
}

/**
 * 根据当前步骤是否可多选,改变步骤选项类型
 * @param  {String} stepName 当前步骤名称
 * @param  {Boolean} multipleSelectTag 当前步骤是否多选
 * @return null
 */
function _changeCheckboxType(stepName, multipleSelectTag){
	wui.logMethodCalled("_changeCheckboxType", _className);

	var theSelectType = "radio";
	var oMultipleSelectTag = [];
	if(!!multipleSelectTag){
		oMultipleSelectTag = multipleSelectTag.split(",");
	}
		
	// console.info(oMultipleSelectTag);
	if(oMultipleSelectTag.length > 0){
		// 选中节点有多选标记时
		$(globalParams.sCheckBoxId).find('input[name="stepSelect"]').each(function(){
			var theStepName = $(this).val();	// 步骤名称
			var theParents = $(this).parent();
			if(theStepName == stepName){
				// 设置当前节点为复选,且选中
				_doToggleCheckBox(theParents, false, true);
				theParents.addClass("active");
			}else{
				if(oMultipleSelectTag.indexOf(theStepName) > -1){
					// 设置与当前节点可同时选中的节点为多选,且不改变
					_doToggleCheckBox(theParents, false);
				}else{
					// 设置与当前节点可同时选中的节点为单选,且不选中
					_doToggleCheckBox(theParents, true, false);
				}
			}
		})
		theSelectType = "checkbox";
	}else{
		// 选中节点没有多选标记时
		$(globalParams.sCheckBoxId).find('input[name="stepSelect"]').each(function(){
			var theStepName = $(this).val();	// 步骤名称
			var theParents = $(this).parent();
			if(theStepName == stepName){
				// 设置当前节点为单选，且选中
				_doToggleCheckBox(theParents, true, true);
			}else{
				// 设置其余节点为单选，且不选中
				_doToggleCheckBox(theParents, true, false);
			}
		})
	}
	return theSelectType;
}

/**
 * 获取数据
 * @return {[type]} [description]
	// [
	//     {
	//         "stepName": "部门初审",
	//         "stepLabel": "经办人拟稿->部门初审",
	//         "responseType": "undefined",
	//         "stepUsers": [
	//             {
	//                 "userId": "B1C6F539-85FA-4008-AD47-10972D5BFC09",
	//                 "orgId": "7CC312F0-FA7A-4E10-9967-8ED10C32CB67",
	//                 "userName": "曹佳"
	//             },
	//             {
	//                 "userId": "59FD2F36-B7ED-4C3E-9D73-A31D5570D542",
	//                 "orgId": "7CC312F0-FA7A-4E10-9967-8ED10C32CB67",
	//                 "userName": "李杨"
	//             }
	//         ]
	//     }
	// ]
 */
/**
 * 获取选人树表单数据
 * @return {[type]} [description]
 */
function _getForm(){
	wui.logMethodCalled("_getForm", _className);

	var stepNodes = [];
	if(globalParams.isOnlyOne){
		stepNodes.push(globalParams.oOnlyStep);
	}else{
		$(globalParams.eStepList).find('input[_action="step"]:checked').each(function(){
			var index = parseInt($(this).parent().attr("data-index"));
			var selectStepData = globalParams.oStepsData[index];
			var type = $(this).attr("type");
			// console.info(selectStepData);

			// if(!selectStepData.multipleSelectTag)
			var step = {
				stepName: selectStepData.stepName,
				stepLabel: selectStepData.stepLabel,
				responseType: undefined,
				// 获取选中步骤下的选中人员
				stepUsers: []
			}

			if(selectStepData.selectUsers){
				step.stepUsers = selectStepData.selectUsers
			}

			// 用户为空
			if(!(selectStepData.selectUsers)){
				// 违反用户必选规则
				if(selectStepData.needUser){
					if(type === "radio"){
						wui.warnNotice("该单选步骤 \"" + selectStepData.stepName + "\" 至少要选一位用户");
					}else{
						wui.warnNotice("该多选步骤 \"" + selectStepData.stepName + "\" 至少要选一位用户");
					}
					stepNodes = false;
					return false;
				}else{
					stepNodes.push(step);
				}
			}

			if(selectStepData.needUser && !wui.isEmptyType(selectStepData.selectUsers)){
				stepNodes.push(step);
			}
			
		})
	}
		
	return stepNodes;
}

/**
 * 规则：
 * 1、needUser下的步骤是否选用户，必须和这个字段值一致，否则会警告
 */

/**
 * 绑定事件
 * @return {[type]} [description]
 */
function _bindEvent(){
	wui.logMethodCalled("_bindEvent", _className);

	// 保存成功按钮点击事件
	$("#btnSure").click(function () {
	    wui.logMethodCalled("btnSure.click", _className);
	    if(!$("#" + globalParams.sRadioId).find('input[_action="step"]').length || $("#" + globalParams.sRadioId).find('input[_action="step"]:checked').length){
	    	var formDate = _getForm();

	    	// var content = '<pre class="language-js"><code class="language-js">' + JSON.stringify(formDate, null, 4) + '</code></pre>';
      //       var options = {
      //           title: "数据检查",
      //           area: [ "640px", "80%" ]
      //       };
      //       var onSure = function (index) {
      //       	alert(!wui.isEmptyType(formDate))
      //           if(!wui.isEmptyType(formDate)){
		    // 		// console.info(JSON.stringify(formDate));
				  //   var serviceResult = {};
				  //   serviceResult.isSuccess = true;
				  //   serviceResult.data = JSON.stringify(formDate);
				  //   serviceResult.message = "保存成功!";
				  //   // wui.successNotice(serviceResult.message);
				  //   wui.closeModalDialog(serviceResult);
		    // 	}else if(typeof(formDate) === "object"){
		    // 		wui.warnNotice("至少要选一个步骤或用户!!!");
		    // 	}
      //           // wui.closeIndex(index);  // 关闭当前层
      //       }
      //       var onCancel = function () {
      //           wui.message("您点击了取消", {
      //               icon: 5
      //           });
      //       }
      //       wui.confirm(content, options, onSure, onCancel);
	    	
	    	if(formDate && !wui.isEmptyType(formDate)){
	    	// if(formDate){
	    		// console.info(JSON.stringify(formDate));
			    var serviceResult = {};
			    serviceResult.isSuccess = true;
			    serviceResult.data = JSON.stringify(formDate);
			    serviceResult.message = "保存成功!";
			    // wui.successNotice(serviceResult.message);
			    wui.closeModalDialog(serviceResult);
	    	}else if(typeof(formDate) === "object"){
	    		wui.warnNotice("至少要选一个步骤或用户!!!");
	    	}
	    }else{
	    	wui.warnNotice("单选的步骤最少要选一个步骤");
	    }
	});

	// 取消按钮点击事件
	$("#btnCancel").click(function () {
	    wui.logMethodCalled("btnCancel.click", _className);

	    // 取消模态窗口
	    wui.cancelModalDialog();
	})
}