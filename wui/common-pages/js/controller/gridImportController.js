/**
 * 日期：2018-09-04
 * 作者：Chenzx
 * 描述：列表数据导入页面控制类
 */
var _className = "gridImportController";

var _fileId = "file";

function initPageInfo(){
	$("#btnSubmit").hide();

	var queryParams = filePopupService.getQueryString();
	$('[data-maxFilesize]').text(queryParams.maxFilesize);
	if(queryParams.acceptedFiles){
		$('[data-acceptedFiles]').text("只能上传 " + queryParams.acceptedFiles + " 类型文件。");
	}else{
		$('[data-acceptedFiles]').text("可以上传任意类型文件");
	}

	// 初始化组件
	_initWidget();

	// 绑定按钮事件
	_bindBtnEvent();
}

function _initWidget(){
	var onSuccess = function(file, response){
		var queryParams = filePopupService.getQueryString();
		wui.ajax({
			url: queryParams.importUrl, 
            data: {
            	filePath: response.rows[0].filePath
            },
            onSuccess: function(res){
                console.info(res);
                $("#btnSubmit").show();
            }, 
            onError: function(res){
                console.error(res);
                wui.errorNotice(res);
            }
		})
	}
	var onFail = function(file, response){
		wui.errorNotice(response);
	}
	wui.file(_fileId, filePopupService.getFileConfig(onSuccess, onFail));
}


function _bindBtnEvent(){
	// 保存按钮
	$("#btnSubmit").on("click", function(){
		var data = wui.file(_fileId).get("value");
		var response = {
			isSuccess: true,
			message: "导入成功",
			data: data
		}
	    wui.closeModalDialog(response);
	})

	// 关闭按钮
	$("#btnCancel").on("click", function(){
		// 取消模态窗口
        wui.cancelModalDialog();
	})
}

