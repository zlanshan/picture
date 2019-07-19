/**
 * 日期：2018-04-24
 * 作者：Chenzx
 * 描述：img 编辑页面控制类
 */
var _className = "imgEditController";
var $image = $("#cropImg");

/**
 * 初始化页面信息
 * @return {[type]} [description]
 */
function initPageInfo(){
	wui.logMethodCalled("initPageInfo", _className);

	// 初始化图片容器
	_initImage();

	// 初始化编辑控件
	_initEditWidget();
	
	// 绑定按钮事件
	_bindBtnEvents();
}

/**
 * 初始化图片容器
 * @Author   Chenzx
 * @DateTime 2019-05-15
 * @return   {[type]}   [description]
 */
function _initImage(){
	wui.logMethodCalled("_initImage", _className);

	var queryString = imgEditService.getQueryString();

	if(!queryString.imageUrl){
        wui.warnNotice("没有传入初始化图片，请选择编辑图片");
        return;
    }

	$image.attr("src", queryString.imageUrl);
}

/**
 * 初始化编辑控件
 * @Author   Chenzx
 * @DateTime 2019-05-15
 * @return   {[type]}   [description]
 */
function _initEditWidget(){
	wui.logMethodCalled("_initEditWidget", _className);

	var imgEditConfig = imgEditService.getImgEditConfig(_onBuilt);

	$image.cropper(imgEditConfig);
}

/**
 * 绑定按钮事件
 * @Author   Chenzx
 * @DateTime 2019-05-15
 * @return   {[type]}   [description]
 */
function _bindBtnEvents(){
	wui.logMethodCalled("_bindBtnEvent", _className);

	var _uploadedImageURL = null;

	// 导入图片按钮事件
	$('[data-method="inputImage"]').on('change', function() {
	    var files = this.files, file = null;

	    if (files && files.length) {
	        file = files[0];

	        if (/^image\/\w+$/.test(file.type)) {
	            if (_uploadedImageURL) {
	                URL.revokeObjectURL(_uploadedImageURL);
	            }

	            _uploadedImageURL = URL.createObjectURL(file);
	            // console.info(_uploadedImageURL);
	            $image.cropper('replace', _uploadedImageURL);
	            $image.val('');
	        } else {
	            wui.errorNotice('请选择图片文件！！！');
	        }
	    }
	});

	// 重置按钮
	$('[data-method="reset"]').click(function(){
	    $image.cropper('reset');
	});

	// 获取裁剪图片按钮
	$("#btnSubmit").on("click", function(e){

		var imageData = $image.cropper('getCroppedCanvas');

	    imgEditService.submitEditData(imageData);
	});

	// 取消按钮点击事件
	$("#btnCancel").click(function() {
		wui.logMethodCalled("btnCancel.click");
		// 取消模态窗口
		wui.cancelModalDialog();
	})
}

/**
 * 组件快捷键的事件监听
 * @Author   Chenzx
 * @DateTime 2019-05-15
 * @return   {[type]}   [description]
 */
function _onBuilt(){
	// console.error("onkeydown");
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];

        // console.error(e.keyCode);
        if (!$image || this.scrollTop > 300) {
            return;
        }
        // console.info(typeof(e.keyCode));
        switch (e.keyCode) {
            case 37:
                e.preventDefault();
                $image.cropper('move', -1, 0);
                break;

            case 38:
                e.preventDefault();
                $image.cropper('move', 0, -1);
                break;

            case 39:
                e.preventDefault();
                $image.cropper('move', 1, 0);
                break;

            case 40:
                e.preventDefault();
                $image.cropper('move', 0, 1);
                break;
        }
    };
}