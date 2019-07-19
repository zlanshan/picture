/**
 * 日期：2018-09-04
 * 作者：Chenzx
 * 描述：弹出文件上传公共服务类
 */
var filePopupService = (function () {
	
	var _className = "filePopupService";
    
	// var fileQueryString = {
	//     "url": "http://111.230.47.180:7070/Upload.aspx",
	//     "otherParam": "{}",
	//     "maxNumber": "1",
	//     "maxFilesize": "256",
	//     "acceptedFiles": ".doc,.docx,.pdf,.xlsx,.jpg,.jpeg,.bmp,.xls",
	//     "jsonReader": "{}"
	// }

    /**
	 * 获取页面请求的参数
	 * @return {JSON} 页面请求参数集
	 */
    var _getQueryString = function(){
    	wui.logMethodCalled("_formatQueryString", _className);

	    var queryString = wui.getQueryString();
	    var oFormat = {
	        // {String} 父页面chooseBox组件id
	        parentSelectorId: queryString.selectorId
	        // {String} 列表数据文件上传服务接口地址,默认是""
	        , url: queryString.url
	        // {String} 列表数据导入服务接口地址,默认是""
	        , importUrl: queryString.importUrl || ""
	        // {JSON} 传递给选择接口的其他参数
	        , otherParam: wui.formatOtherParam(queryString.otherParam)
	        // {Number} 可选个数
	        , maxNumber: wui.formatMaxNumber(queryString.maxNumber)
	        // {String} 选项页页面导航标题
	        , maxFilesize: wui.formatMaxNumber(queryString.maxFilesize)
	        // {String} 选项页页面地址集
	        , acceptedFiles: queryString.acceptedFiles === "" ? null : queryString.acceptedFiles
	        // {Stirng} 树结构服务地址
	        , jsonReader: wui.parseToObj(queryString.jsonReader) ? wui.parseToObj(queryString.jsonReader) : {}
	    };
	    // console.info(oFormat);

    	return oFormat;
    }

    /**
     * 获取文件组件配置参数
     * @return {JSON}  文件组件配置参数
     */
    var _getFileConfig = function(onSuccess, onFail){
    	wui.logMethodCalled("_getFileConfig", _className);

    	var queryParams = _getQueryString();
    	var config = {
    		url: queryParams.url,
			otherParam: queryParams.otherParam,
			maxNumber: queryParams.maxNumber,
			acceptedFiles: queryParams.acceptedFiles,
			maxFilesize: queryParams.maxFilesize,	// 最大上传大小,单位是"MB"
			jsonReader: queryParams.jsonReader,
			conMinWidth: "320px",     // {String} 外层容器最小宽度,默认是"auto"(根据内部自适应)
	        conMinHeight: "180px",    // {String} 外层容器最小高度,默认是"auto"(根据内部自适应)
	        thumbnailWidth: 320,      // {int} 设置缩略图的宽度,最小值100
	        thumbnailHeight: 170,
	        buttonSetting: {
	            imageUrl: wui.FRAME_PATH + '/themes/images/picture.png',
	            width: 320,
	            height: 170
	        },
			onSuccess: function(file, response){
				if(onSuccess && typeof(onSuccess) === "function"){
					onSuccess(file, response);
				}
			},
			onFail: function(file, response){
				wui.scroll($(".page-container"));
				if(onFail && typeof(onFail) === "function"){
					onFail(file, response);
				}
			}
    	}

    	return config;
    }

    // 对外调用方法
    return {
    	// 获取页面请求的参数
        getQueryString: _getQueryString
        // 获取文件组件配置参数
        , getFileConfig: _getFileConfig
    }
})();
