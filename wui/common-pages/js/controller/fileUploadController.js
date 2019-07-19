/**
 * 日期：2018-04-27
 * 作者：Chenzx
 * 描述：文件弹出上传页面控制类
 */
var _className = "fileUploadController";
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
		$("#btnSubmit").show();
	}

	var onFail = function(file, response){
		wui.errorNotice(response);
	}
	wui.file(_fileId, filePopupService.getFileConfig(onSuccess, onFail));
}


function _bindBtnEvent(){
	// 保存按钮
	$("#btnSubmit").on("click", function(){
		var options = {
            btn: ['我就要关闭','好吧,我再加个方法'] //按钮
        }

        var yes = function(){
            var data = wui.file(_fileId).get();
			// window.parent.wui.notice(JSON.stringify(data));
	        wui.closeModalDialog(data);
        }

        var cancel = function(){
            wui.message('你要自己去代码里添加哟', {
              	time: 20000, //20s后自动关闭
              	btn: ['废话', '坑货']
            });
        }
		wui.confirm("您确定直接关闭，不自定义回调方法？", options, yes, cancel);
		
	})

	// 关闭按钮
	$("#btnCancel").on("click", function(){
		// 取消模态窗口
        wui.cancelModalDialog();
	})
}
