/**
 * 日期：2019-05-15
 * 作者：Chenzx
 * 描述：弹出图片编辑公共服务类
 */
var imgEditService = (function () {
	
	var _className = "imgEditService";
    
	// var queryString = {
	//     "handleUrl": "http://localhost:8090/main/base/upload/crop",
	//     "otherParam": {
	// 		// 上传子路径
	// 		"subPath": "",
	// 		// 上传文件是否重命名
	// 		"isRename": false
	//     },
	//     "resolutions": "",
	//     "picSrc": "/wui/examples/images/photo3.jpg",
	//     "imageName": "photo3.jpg",
	//     "imagePath": "/images/photo3.jpg"
	// }

    /**
	 * 获取页面请求的参数
	 * @return {JSON} 页面请求参数集
	 */
    var _getQueryString = function(){
    	wui.logMethodCalled("_formatQueryString", _className);

	    var queryString = wui.getQueryString();
	    // queryString.handleUrl = "http://localhost:8090/main/base/upload/crop";
	    var oFormat = {
	        // {String} 图片编辑提交接口
	        handleUrl: queryString.handleUrl || ""
	        // {JSON} 传递给接口的其他参数
	        , otherParam: queryString.otherParam || {}
	        // {String} 显示图片地址
	        , imageUrl: queryString.picSrc || ""
	        // , imageUrl: "http://localhost:8090" + queryString.picPath
	        // {String} 文件名称
	        , imageName: queryString.imageName || ""
	        // {String} 文件虚拟路径
	        , imagePath: queryString.imagePath || ""
	        // 图片解析度,多个用","分隔
	        , resolutions: queryString.resolutions || ""
	        // 图片解析度,多个用","分隔
	        , subPath: queryString.subPath || ""
	        // 图片解析度,多个用","分隔
	        , isRename: queryString.isRename
	    };
	    // console.info(oFormat);

    	return oFormat;
    }

    /**
     * 获取图片编辑组件配置参数
     * @return {JSON}  组件配置参数
     */
    var _getImgEditConfig = function(onBuilt){
    	wui.logMethodCalled("_getImgEditConfig", _className);

    		// 用于比较两次点击之间的时间戳
    	var timestamp = 0;

    	var config = {
    		// "http://10.200.203.181:7070/Save.aspx",
    		// handleUrl: handleUrl,
	    	// 确定crop的视图模式(0, 1, 2, 3)
		    viewMode : 1,
		    // 定义crop的拖动方式('crop', 'move' or 'none')
		    dragMode : 'crop',
		    // 定义box的比例
		    aspectRatio : 1,
		    // 默认的裁剪结果数据。(Object)
		    data : null,
		    // 用于添加额外的容器来预览的jQuery选择器
		    preview : '.img-preview',
		    // 重新渲染栽在调整窗口大小
		    responsive : true,
		    // 在窗口大小调整后恢复裁剪区域
		    restore : true,
		    // 检查当前图像是否为跨域图像
		    checkCrossOrigin : true,
		    // 检查当前图像的方向的EXIF信息
		    checkOrientation : true,
		    // 是否在剪裁框上显示黑色的模态窗口
		    modal : true,
		    // 是否在剪裁框上显示虚线
		    guides : true,
		    // 显示中心指示器
		    center : true,
		    // 显示白色模式突出crop
		    highlight : true,
		    // 显示网格背景
		    background : true,
		    // 初始化时自动生成图像
		    autoCrop : true,
		    // 定义自动crop区域的百分比时，初始化
		    autoCropArea : 0.8,
		    // 是否可移动图片
		    movable : true,
		    // 是否可旋转图片
		    rotatable : true,
		    // 是否可缩放图片
		    scalable : true,
		    // 是否可放大图片
		    zoomable : true,
		    // 是否可通过拖动缩放图像
		    zoomOnTouch : true,
		    // 是否可通过鼠标缩放图片
		    zoomOnWheel : true,
		    // 定义通过鼠标缩放的比例
		    wheelZoomRatio : 0.1,
		    // 是否可移动crop框
		    cropBoxMovable : true,
		    // 是否可调整crop框
		    cropBoxResizable : true,
		    // 双击时拖动模式之间切换的“crop”和“移动”时
		    toggleDragModeOnDblclick : false, 
		    // 大小限制
		    minCanvasWidth : 0,
		    minCanvasHeight : 0,
		    minCropBoxWidth : 0,
		    minCropBoxHeight : 0,
		    minContainerWidth : 200,
		    minContainerHeight : 100,

		    // 快捷键的事件
		    built : function(){
		    	onBuilt && onBuilt();
		    },
		    // cropstart : null,
		    // cropmove : null,
		    cropend : function(e){
		        // 300毫秒延迟记录双击
		        if ((new Date()).valueOf() - timestamp < 300) {
		            // 模拟截图按钮事件
		            $('[data-method="getCroppedCanvas"]').click();
		        }
		        timestamp = (new Date()).valueOf();
		    }
    	}

    	return config;
    }

    /**
     * 图片编辑数据提交
     * @Author   Chenzx
     * @DateTime 2019-05-15
     * @param    {String}   data        图片base64位数据
     * @param    {String}   resolutions 图片解析度,多个用","分隔,比如："1x1,16x9"
     * @param    {String}   picName   源文件名称
     * @param    {String}   [subPath]    保存文件夹子路径
     * @param    {Boolean}  [isRename]   是否重命名
     * @param    {Function} onSuccess  提交成功回调
     * @return   {[type]}              [description]
     */
    var _submitEditData = function(data, onSuccess, onFail){
    	wui.logMethodCalled("_postEditData", _className);

    	if(!data){
    		wui.errorNotice("【data】参数不能为空");
    		return;
    	}

    	var queryParams = _getQueryString();

    	var handleUrl = wui.buildUrl(queryParams.handleUrl, queryParams.otherParam);

    	wui.ajax({
	        url: handleUrl,
	        dataType: "json",
	        contentType: "application/x-www-form-urlencoded",
	        data: {
	        	// 图片解析度,多个用","分隔
	        	resolutions: queryParams.resolutions,
	        	// 上传图片名称(带后缀)
	        	imageName: queryParams.imageName,
	        	// 上传子路径
	        	subPath: queryParams.subPath,
	        	// 上传文件是否重命名
	        	isRename: queryParams.isRename,
	        	// 上传图片Base64编码
	        	imageBase64: data.toDataURL('image/png').split(',')[1]
	        },
	        /**
	         * 成功回调
	         * @Author   Chenzx
	         * @DateTime 2019-05-15
	         * @param    {Object}   response 
	         *  {
				    // 数据集合
				    "rows": [
				        {
				            // 文件名
				            "fileName": "new_file.png",
				            // 文件数据库保存路径
				            "filePath": "/upload/new_file.png",
				            // 文件可预览下载地址
				            "fileUrl": "http://hostname:port/../img.png"
				        }
				    ],
				    // 是否成功
				    "isSuccess": true,
				    // 返回消息
				    "message": ""
				}
	         * @return   {[type]}            [description]
	         */
	        successCallback: function(response) {

	        	if(response.isSuccess){
	        		if(onSuccess && typeof(onSuccess) === "function"){
		            	onSuccess(response);
		            }else{
		            	wui.closeModalDialog(response);
		            }
	        	}else{
	        		if(onFail && typeof(onFail) === "function"){
		            	onFail(response);
		            }else{
		            	wui.errorNotice(response.message);
		            }
	        	}
	        },
	        errorCallback: function(err){
	            if(onFail && typeof(onFail) === "function"){
	            	onFail(err);
	            }else{
	            	wui.errorNotice(typeof(err) === "object" ? JSON.stringify(err): err);
	            }
	        }
	    })

    }

    // 对外调用方法
    return {
    	// 获取页面请求的参数
        getQueryString: _getQueryString,
        // 获取文件组件配置参数
        getImgEditConfig: _getImgEditConfig,
        // 图片编辑数据提交
        submitEditData: _submitEditData
    }
})();
