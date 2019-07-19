
;(function (ui,$, undefined){
	/**
	 * <h3>工作流意见审批流程组件</h3>
     * <ol>
     * <li>传入后台服务接口，配置解析参数,直接渲染页面; </li>
     * <li>自定义数据解析配置。</li>
     * </ol>
     * <h3>预览地址：<a href="../../examples/index.html?isShowMenu=1&rootId=wuiOpinionBox" target="_blank">demo</a></h3>
     * <h3 style="display:none">方法说明：</h3>
     * <ol style="display:none">
     * <li>{{#crossLink "wui.opinionBox/init"}}{{/crossLink}}: 初始化 </li>
     * <li>{{#crossLink "wui.opinionBox/get"}}{{/crossLink}}: 获取组件值 </li>
     * <li>{{#crossLink "wui.opinionBox/set"}}{{/crossLink}}: 设置节点值 </li>
     * <li>{{#crossLink "wui.opinionBox/empty"}}{{/crossLink}}: 清空节点值 </li>
     * <li>{{#crossLink "wui.opinionBox/enabled"}}{{/crossLink}}: 允许输入意见栏 </li>
     * <li>{{#crossLink "wui.opinionBox/disabled"}}{{/crossLink}}: 禁用输入意见栏 </li>
     * <li>{{#crossLink "wui.opinionBox/destroy"}}{{/crossLink}}: 销毁组件 </li>
     * </ol>
     * @namespace wui
     * @class opinionBox
     * @constructor 
     * @param selector {DOM选择器} 初始化组件容器选择器,用来保存组件对象一般取当前form表单选择器,比如'[role="form"]'、"#form"
     * @param {object} option  
     * @param {String/Object} option.source 组件数据源,默认是空,当传入String,默认是Global.workflow,当传入Object,会解析成渲染数据
     * @param {JSON} [option.otherParams] 提交到后台的其他参数,默认是{}
     * @param {String} [option.method] 请求方法,默认是"get"
     * @param {String} [option.value] 初始化时赋给意见框的值,默认是""
     * @param {String} [option.nameValue] 组件标签name字段值(用wui.getForm()取值会用这个字段值作为Key),当初始化标签没有name属性时,会默认将此值赋给name属性值,默认是"opinionMessage"
     * @param {Array} [option.commonOpinions] 常用意见列表,默认是["同意。", "不同意。", "阅。", "照拟。","传阅"]
     * @param {String} [option.opinionTemplateId] 单条意见模板ID,默认是null,采用组件默认的渲染方式,若不为空则采用传递的模板ID渲染
     * @param {String} [option.commonOpinionsTemplateId] 常用意见模板ID,默认是"CommonOpinionsTmpl"
     * @param {JSON} [option.jsonReader] 数据格式解析配置
     * @param {String} option.jsonReader.itemsRoot 解析全部审批流程节点数据字段名,若为null,则返回数据作为实际加载数据,默认是"workItems"
     * @param {String} option.jsonReader.opinionAreaField 流程意见区域编号字段名,默认是"opinionArea"
     * @param {String} option.jsonReader.finishTimeField 意见列表中审批时间字段名,默认是"finishTime"
     * @param {String} option.jsonReader.dateFormat 意见列表中审批时间字段转化的日期格式,默认是"yyyy-mm-dd hh:ii:ss"
     * @return {Object}  组件初始化对象
     * @example
     *  
     *   js: 
     *   
            wui.opinionBox("#opinionBox", {
				source: "json/_getFormData.json"
            });	// 返回组件初始化结果对象集
     *
     */
	ui.opinionBox = function(element, options){
		// 控件常规配置
        var _pluginName = "uiOpinionBox",
            _pluginDataName = 'plugin_'+_pluginName,
            _widgetName = "opinionBox";

        ui.logMethodCalled({
            className: FRAME_NAME,
            methodName: _widgetName,
            isDebug: true,
            id: element
        });

        if(!ui.checkIsLoadPlugins(_widgetName)){
            return false;
        }
        
        if(!$("#" + element).exist()){
            ui.logError("【" + _widgetName + "】" + "当前页面不存在 ID 为" + element + " 的DOM节点", FRAME_NAME + "." + _widgetName, true);
            return false;
        }

        //默认配置项
        var config = {
        	// {string/Object} 组件数据源,默认是空,当传入String,默认是后台服务接口,当传入Object,会解析成渲染数据
            source: ui.serviceInterface.opinionBoxSource
            // {JSON} 提交到后台的其他参数,默认是{}
            , otherParams: {}	
            // {String} 请求方法,默认是"get"
            , method: "get"
            // {String} 初始化时赋给意见框的值
            , value: ""
            // {String} 组件标签name字段值(用wui.getForm()取值会用这个字段值作为Key),默认是"opinionMessage"
            , nameValue: "opinionMessage"
            // {Number} 当前流程意见区域编号,默认是"0"
            , opinionArea: 0
            // {Array} 审批意见常用意见可选列表
            , commonOpinions: ui.commonOpinions
            // {String} 意见模板ID(参照第三方插件art-template格式)
            // , opinionTemplateId: "OpinionTmpl"
            , opinionTemplateId: ""
            // {String} 常用意见模板ID,默认是null,若不为空则采用传递的模板ID渲染
            // , commonOpinionsTemplateId: "CommonOpinionsTmpl"
            , commonOpinionsTemplateId: null

            // 数据解析配置
            , jsonReader: {
                // {String} 服务器返回的实际加载数据字段名,若为null,则返回数据作为实际加载数据
                itemsRoot: "workItems"
                // {String} 解析当前流程审批节点数据字段名
                // , currentItemRoot: "workItem"
                // 流程意见区域编号字段名
                , opinionAreaField: "opinionArea"	
                // 意见列表中审批时间字段名
                , finishTimeField: "finishTime"
                // 意见列表中审批时间字段转化的日期格式
                , dateFormat: "yyyy-mm-dd hh:ii:ss"
            },
            commonOpinionsSetting: $.extend(true, {}, {
                url: ui.commonPageBasePath + "wui.commonOpinion.html",
                successCallback: null,
                width: "220px",    // 设置全屏,可不传递此参数
                height: "300px", // 设置全屏,可不传递此参数
                title: "常用意见选择",
                isFull: true,
                onPoped: null
            }, ui.commonOpinionsSetting)
        };

        // console.error($.extend(true, {}, {
        //         url: ui.commonPageBasePath + "wui.commonOpinion.html",
        //         successCallback: null,
        //         // width: "220px",    // 设置全屏,可不传递此参数
        //         // height: "auto", // 设置全屏,可不传递此参数
        //         title: "常用意见选择",
        //         isFull: true,
        //         onPoped: null
        //     }, ui.commonOpinionsSetting))

        // 不改动的参数配置
        var defaults = {
            // 审批意见框对应的文本域jQuery对象
            opinionBox: null 
        }

        function uiOpinionBox(element, options){
            //调用初始函数
            this.init();    
        }

        uiOpinionBox.prototype = {
        	constructor: uiOpinionBox,
        	// 组件初始化
        	init: function(){
        		/* 初始化对象静态属性 */
                // 缓存插件名字
				this.pluginName = _widgetName;    
                // 保存初始化标签id  
                this.element = element;     
                // 保存初始化标签jQuery        
                this.$element = $("#" + element);
                // 保存静态默认配置项
				this.defaults = defaults;

                /* 初始化对象动态属性 */
                // 保存是否已经初始化此页面结构
                this.hasDom = false;        
				this.initDom = this.$element.prop("outerHTML");
				// 获取元素绑定的参数数据
				var AttributeParams = ui.getAttributeParams(this.$element, config);
				// console.info(AttributeParams);
				this._opt = $.extend(true, {}, config, options, AttributeParams);	// 覆盖默认配置项

				/* 初始化对象页面结构 */
                // 组件最外层容器(.wui-selectBox): $element + $viewBox + $textBox
				this.$Maxcontainer = null; 
                // 组件可视框
                this.$viewBox = null;
                // 文本域
                this.$textBox  = null;

				/* 初始化对象监听事件容器 */
                //自定义事件,用于监听插件的用户交互
                this.listeners = []; 
            	this.handlers = {};

				// 格式化组件配置参数
                this._formatParams();
                // 构建组件页面容器结构:创建DOM节点,并返回$Maxcontainer的HTML字符串
                this.dom = this._buildContainer(); 
        	},
            _buildContainer: function(){
                var self = this, params = this._opt, $selector = this.$element;
                // 绑定name属性(可供wui.getForm调用)
                if(!($selector.attr('name'))){
                    if(params.nameValue){
                        $selector.attr('name', params.nameValue);
                    }else{
                        $selector.attr('name', self.element);
                    }
                    
                }
                this.name = $selector.attr('name'); //  保存name属性值
                
                if(!($selector.parent().hasClass('wui-opinionBox'))){
                    var parentDiv = '<div class="wui-opinionBox"></div>';
                    $selector.wrap(parentDiv);    // 增加父容器
                }
                this.$Maxcontainer = $selector.parent(); // 组件最外层容器(.wui-tagsinput): $element + $viewBox
                
                var isDisabled = $selector.attr("disabled") ? true : false;
                var isReadOnly = $selector.attr("readonly") ? true : false;
                if((!isDisabled) && (!isReadOnly)){
                    var textBoxHtml = '';
                    textBoxHtml += '<div>';
                    textBoxHtml += '    <button type="button" class="wui-btn wui-btn-link" _action="popup_common_opinions" style="padding-left: 0px;" ><i class="fa fa-plus"></i> 常用意见</button>';
                    textBoxHtml += '    <textarea wui-widget-hidden="true" _action="opinion_box" class="wui-textarea">' + params.value + '</textarea>';
                    textBoxHtml += '    <input type="hidden" name="' + params.jsonReader.opinionAreaField + '" id="' + params.jsonReader.opinionAreaField + '" value="' + params.opinionArea + '" />';
                    textBoxHtml += '</div>';
                    this.$textBox = $(textBoxHtml);
                    $selector.after(this.$textBox);

                    if($selector.attr("required")){
                        $selector.removeAttr("required");
                        $selector.attr("validate", "widgetRequired");;
                        // this.$textBox.find('textarea').attr("required", true);
                        // this.$textBox.find('textarea').attr("validate", "required");
                    }else if($selector.attr(ui.validateAttributeField)){
                        this.$textBox.find('textarea').attr(ui.validateAttributeField, $selector.attr(ui.validateAttributeField));
                    }
                }else if(!!params.value){
                    var textBoxHtml = '';
                    textBoxHtml += '<div>';
                    textBoxHtml += '    <textarea wui-widget-hidden="true" _action="opinion_box" disabled class="wui-textarea">' + params.value + '</textarea>';
                    textBoxHtml += '    <input type="hidden" name="' + params.jsonReader.opinionAreaField + '" id="' + params.jsonReader.opinionAreaField + '" value="' + params.opinionArea + '" />';
                    textBoxHtml += '</div>';
                    this.$textBox = $(textBoxHtml);
                    $selector.after(this.$textBox);
                }else{
                    $selector.attr("wui-widget-hidden", "true");
                }
                // this.$textBox.attr("disabled", $selector.attr("disabled"));

                this.$viewBox = $('<ul class="exam-list"></ul>');
                $selector.before(this.$viewBox);

                $selector.attr("ui-type", self.pluginName);
                $selector.hide();

                self._load();
            },
            _createCommonOpinion: function(data){
                var html = '';
                html += '<div class="wui-form-radio">';
                html += '    <input type="radio" name="commonOpinions" _text="' + data + '" value="' + data + '" />';
                html += '    <label for="' + data + '">';
                html += '        <i></i>';
                html += '    </label>';
                html += '    <span>' + data + '</span>';
                html += '</div>';

                return html;
            },
            _createCommonOpinions: function(commonOpinions){
                var self = this, html = '';
                html += '<div class="common-opinions">';
                if(commonOpinions){
                    for(var i = 0; i < commonOpinions.length; i++){
                        html += self._createCommonOpinion(commonOpinions[i]);
                    }
                }
                html += '</div>';

                return html;
            },
            _load: function(){
                ui.load(2);
                var self = this, params = this._opt, $selector = this.$element;
                var jsonReader = params.jsonReader;
                var _onSuccess = function(res){
                    var opinionBoxData;
                    if(!jsonReader.itemsRoot){
                        opinionBoxData = res;
                    }else if(ui.isJson(res) && ui._hasOwnProperty(res, jsonReader.itemsRoot)){
                        opinionBoxData = res[jsonReader.itemsRoot];
                    }else{
                        opinionBoxData = null;
                    }

                    self._fillOpinions(opinionBoxData);
                    self._fillOpinionText();
                    // var currentOpinionData;
                    // if(!jsonReader.currentItemRoot){
                    //     currentOpinionData = res;
                    // }else{
                    //     currentOpinionData = res[jsonReader.currentItemRoot];
                    // }
                    // self._fillOpinionText(currentOpinionData);
                    
                    // 设置页面滚动条
                    ui.scroll($("body"));
                    ui.closeIndex();
                };
                if(typeof(params.source) === "string"){
                    // 请求数据
                    ui.ajax({
                        url: params.source,
                        method: params.method,
                        data: JSON.stringify(params.otherParams),
                        onBeforeSend: function(){
                            
                        },
                        onSuccess: _onSuccess,
                        onError: function(res){
                            ui.errorNotice("加载数据失败!" + JSON.stringify(res));
                        },
                        onComplete: function(){
                            
                        }
                    })
                }else if(typeof(params.source) === "object"){
                    _onSuccess(params.source);
                }else{
                    ui.logWarn("传入source参数类型不是Object或者String", FRAME_NAME + "." + _widgetName, true);
                }  
            },
        	_formatParams: function(){
                var self = this, params = this._opt, $selector = this.$element;
                // console.info(params);
                // if(!params.opinionTemplateId){
                //     ui.logError("意见模板Id不能为空");
                //     return false;
                // }

                if(!!$selector.val()){
                    params.value = $selector.val();
                }

                if(!params.commonOpinionsSetting.successCallback){
                    params.commonOpinionsSetting.successCallback = function(text){
                        var val = self.defaults.opinionBox.val();
                        self.defaults.opinionBox.val(val + text);
                    }
                }
                if(!params.commonOpinionsSetting.onPoped){
                    params.commonOpinionsSetting.onPoped = function(dom, index){
                        $(dom).find("input[type=\"radio\"]").on("change", function(){
                            var text = $(this).attr("_text");
                            // ui.notice($(this).val());
                            var val = self.defaults.opinionBox.val();
                            self.defaults.opinionBox.val(val + text);
                            ui.closeIndex();
                        })
                    }
                }
        	},
            // 规则：
            // 1、当finishTimeField字段值对应的值为空时,不显示();(模板里面判断)
            // 2、日期格式规范;
            // 3、当意见内容为空时,不显示该条数据;(模板里面判断);
            _fillOpinions: function(opinionBoxData){
                var self = this, params = this._opt, jsonReader = this._opt.jsonReader; 
                var opinionAreaField = jsonReader.opinionAreaField, 
                    finishTimeField = jsonReader.finishTimeField,
                    dateFormat = jsonReader.dateFormat,
                    opinionArea = params.opinionArea,
                    result = [];
                if(!!opinionBoxData){
                    for(var i = 0; i < opinionBoxData.length; i++){
                        var theOpinionData = opinionBoxData[i];
                        var theOpinionArea = theOpinionData[opinionAreaField];

                        if(Number(opinionArea) == Number(theOpinionArea)){
                            if(theOpinionData[finishTimeField]){
                                theOpinionData[finishTimeField] = ui.formatDate(theOpinionData[finishTimeField], dateFormat);
                            }
                            result.push(theOpinionData);
                            self._templateOpinionList(theOpinionData);
                        }
                    }
                }
                    
                return result;
            },
            _templateOpinionList: function(opinion){
                var self = this, params = this._opt;
                opinion = opinion || [];

                if(params.opinionTemplateId){
                    var opinionHtml = template(params.opinionTemplateId, opinion);
                    self.$viewBox.append(opinionHtml);
                }else{
                    var opinionHtml = '';
                    if(opinion.opinionContent){
                        opinionHtml += '<li item-id="' + opinion.itemId + '">';
                        opinionHtml += '    <strong class="name">' + opinion.userName + '的意见：</strong>';
                        if(opinion.finishTime){
                            opinionHtml += '    <span class="wui-text-default time">(' + opinion.finishTime + ')</span>';
                        }
                        opinionHtml += '    <span class="wui-text-danger">' + opinion.opinionContent + '</span>';
                        opinionHtml += '</li>';
                    }
                    self.$viewBox.append(opinionHtml);
                }
            },
            _fillOpinionText: function(){
                if(!this.$textBox){
                    return;
                }
                var self = this, params = this._opt, $selector = this.$element;
                var jsonReader = params.jsonReader;
                var openHtmlStr = '';
                if(!!params.commonOpinionsTemplateId){
                    openHtmlStr = template(params.commonOpinionsTemplateId, params);
                }else{
                    openHtmlStr = self._createCommonOpinions(params.commonOpinions);
                }
                
                // 弹出常用意见
                self.$textBox.find('[_action="popup_common_opinions"]').on("click", function(e){

                    if(params.commonOpinionsSetting.url){
                        // ui.openIframe({
                        //     title: params.commonOpinionsSetting.title,  // "常用意见选择"
                        //     url: "../../base/common/popup/wui.commonOpinion.html", 
                        //     width: params.commonOpinionsSetting.width,  // "800px"
                        //     height: params.commonOpinionsSetting.height, // "600px"
                        //     onPoped: function(dom, index){
                        //          $(dom).find("iframe").contents().find("li").on("click", function(){
                        //             var selectText=$(this).text();
                        //             var opinionText= $(dom).find("iframe").contents().find("#opinionText");
                        //             var currentOpinion=opinionText.val();
                        //             opinionText.val(currentOpinion+=selectText);
                        //          })
                        //           $(dom).find("iframe").contents().find("#opinionText").on("change", function(){
                        //              self.defaults.opinionBox.val($(this).val());
                        //          })  
                        //          $(dom).find("iframe").contents().find("#confirm").on("click", function(){
                        //              self.defaults.opinionBox.val($(dom).find("iframe").contents().find("#opinionText").val());
                        //             ui.closeIndex();
                        //          })
                        //     }
                        // })

                        var index = wui.openModalDialog(params.commonOpinionsSetting); 
                    }else{
                        ui.openHtml({
                            title: params.commonOpinionsSetting.title,
                            content: openHtmlStr,
                            width: params.commonOpinionsSetting.width,  // "220px"
                            height: params.commonOpinionsSetting.height,// "300px"
                            onPoped: function(dom, index){
                                $(dom).find("input[type=\"radio\"]").on("change", function(){
                                    var text = $(this).attr("_text");
                                    // ui.notice($(this).val());
                                    var val = self.defaults.opinionBox.val();
                                    self.defaults.opinionBox.val(val + text);
                                    ui.closeIndex();
                                })
                            }
                        })
                    }
                })

                self.defaults.opinionBox = self.$textBox.find('[_action="opinion_box"]');
            },
        	get: function(){
                if(this.defaults.opinionBox){
                    return this.defaults.opinionBox.val();
                }else{
                    return "";
                }
        	},
        	set: function(text){
                if(this.defaults.opinionBox){
                    this.defaults.opinionBox.val(text); 
                }
        	},
            empty: function(){
                if(this.defaults.opinionBox){
                    this.defaults.opinionBox.val(""); 
                }
            },
            rules: function(isAddRequired, message){
                // console.info(this.$element.get(0).form)
                // var form = this.$element.get(0).form;
                if(isAddRequired){
                    this.$element.rules("add", {
                        widgetRequired: true,
                        messages:{  
                            widgetRequired: message  
                        }
                    });
                }else{
                    this.$element.rules("remove");
                }
            },
            disabled: function(){
                if(this.defaults.opinionBox){
                    this.defaults.opinionBox.attr('disabled', true);
                }
            },
            enabled: function(){
                if(this.defaults.opinionBox){
                    this.defaults.opinionBox.removeAttr('disabled');
                }
            },
            readonly: function(){
                if(this.defaults.opinionBox){
                    this.defaults.opinionBox.attr('readonly', true);
                }
            },
            readwrite: function(){
                if(this.defaults.opinionBox){
                    this.defaults.opinionBox.removeAttr('readonly');
                }
            },
            destroy: function(){
                // this.$Maxcontainer.remove();
                this.$element.removeData(_pluginDataName);
                this.$element.removeAttr("ui-type");
                this.$Maxcontainer.replaceWith(this.initDom);

                return this;
            },
            option: function(newOptions){
                var params = this._opt;
                
                if(!!newOptions){

                    if(typeof newOptions === "object"){
                        this._opt = $.extend(true, {}, config, newOptions);
                        this.init();  // 重置配置
                    }else if(typeof newOptions === "string"){
                        if(newOptions === "getDefOpt"){
                            return config;
                        }else{
                            return params[newOptions] == undefined ? ui.logWarn("查找的属性值不存在", FRAME_NAME + "." + _widgetName + ".option", true) : params[newOptions];
                        }
                    }
                }else{
                    return params;
                }
            }
        }

        //fn就是prototype
        $.fn[_pluginName] = function(param1){
            //each表示对多个元素调用，用return 是为了返回this，进行链式调用
            return this.each(function(){
                //判断有没有插件名字 如果你不愿意加if 直接new就好了
                if(!$.data(document.getElementById(element), _pluginDataName)){
                    //生成插件类实例。
                    $.data(document.getElementById(element), _pluginDataName, new uiOpinionBox(this, param1));
                }
            });
        }

        // 执行组件的拓展方法
        // @method _executeMethod
        // @param funcName {string} 组件的拓展方法名
        // @param params {Array} 组件的拓展方法传递参数
        // @return 组件拓展方法的返回值
        function _executeMethod(funcName, params){
            var data = $.data(document.getElementById(element), _pluginDataName);
            if(!data){
                ui.logError("wui.opinionBox 未初始化或已被销毁", FRAME_NAME + "." + _widgetName, true);
                return;
            }

            var args = Array.prototype.slice.call(arguments,1);

            if(typeof (data[funcName]) === "function"){
                return data[funcName].apply(data, args);
            }else{
                ui.logWarn('wui.opinionBox 中不存在 ' + funcName + '() 方法', FRAME_NAME + "." + _widgetName, true);
            }
        }

        /**
         * 初始化方法
         * @method init
         * @param [options] {json} 组件配置参数
         * @return {Object} 若是已经初始化过,则根据传递参数重新配置参数,并返回该组件对象,否则初始化并返回该组件对象
         * @since 0.0.1
         * @example 
            // 重新初始化组件
            var myOpinionBox = uiOpinionBox.init();
                
         */
        function _init(opt){
            if(!$.data(document.getElementById(element), _pluginDataName)){
                $('#' + element)[_pluginName](opt);
            }else{
                if(opt && ui.isJson(opt)){
                    return _executeMethod("option", opt);
                }else{
                    return;
                }
            }
        }

        /**
         * 获取组件意见框的值
         * @method get
         * @return {String} 组件意见框的值
         * @since 0.0.1
         * @example 
            // 获取组件值
            var opinionValue = uiOpinionBox.get();
                
         */
        function _get(){
        	return _executeMethod("get");
        }

        /**
         * 设置组件意见框的值
         * @method set
         * @param value {String} 组件意见框的值
         * @return {Boolean} 是否赋值成功
         * @since 0.0.1
         * @example 
            // 设置组件值
            uiOpinionBox.set("同意。");
                
         */
        function _set(value){
        	return _executeMethod("set", value);
        }

        /**
         * 清空组件意见框值
         * @method empty
         * @return {Boolean} 是否清空成功
         * @since 0.0.1
         * @example 
            // 清空组件值
            uiOpinionBox.empty();
                
         */
        function _empty(){
            return _executeMethod("empty");
        }

        /**
         * 禁用填写组件意见框
         * @method disabled
         * @return {Boolean} 是否禁用成功
         * @since 0.0.1
         * @example 
            // 设置组件值
            uiOpinionBox.disabled();
                
         */
        function _disabled(){
            return _executeMethod("disabled");
        }

        /**
         * 启用填写组件意见框
         * @method enabled
         * @return {Boolean} 是否启用成功
         * @since 0.0.1
         * @example 
            // 设置组件值
            uiOpinionBox.enabled();
                
         */
        function _enabled(){
            return _executeMethod("enabled");
        }

        /**
        * 设置组件只读
        * @method readonly
        * @since 0.0.1
        * @example 
            
            // 设置组件只读
            uiOpinionBox.readonly();
                
        */
        function _readonly(){
            return _executeMethod("readonly");
        }

        /**
        * 设置组件可读可写
        * @method readwrite
        * @since 0.0.1
        * @example 
            
            // 设置组件可读可写
            uiOpinionBox.readwrite();
                
        */
        function _readwrite(){
            return _executeMethod("readwrite");
        }

        /**
         * 给组件动态添加或者删除必填校验规则
         * @method rules
         * @param isAddRequired {Boolean} 是否给组件意见框添加必填校验规则
         * @param [message] {String} 当isAddRequired为true时,必填提示信息
         * @return {Boolean} 是否添加成功
         * @since 0.0.1
         * @example 
            // 设置组件值必填
            uiOpinionBox.rules(true, "必须填写意见");
            // 设置组件值非必填
            uiOpinionBox.rules(false);
                
         */
        function _rules(isAddRequired, message){
            return _executeMethod("rules", isAddRequired, message);
        }

        /**
        * 销毁组件：销毁之后可通过重新初始化组件启用组件
        * @method destroy
        * @since 0.0.1
        * @example 
            
            // 销毁组件：销毁之后可通过重新初始化组件启用组件
            uiOpinionBox.destroy();
                
        */
        function _destroy(){
            return _executeMethod("destroy");
        }

        _init(options);

	    return {
            // 初始化组件
	    	init: _init,
            // 获取组件意见框的值
	    	get: _get,
            // 设置组件意见框的值
	    	set: _set,
            // 清空组件意见框值
            empty: _empty,
            // 禁用填写组件意见框
            disabled: _disabled,
            // 启用填写组件意见框
            enabled: _enabled,
            // 可读可写
            readwrite: _readwrite,
            // 只读
            readonly: _readonly,
            // 给组件动态添加或者删除必填校验规则
            rules: _rules,
            // 销毁组件
            destroy: _destroy
	    };
	};
	return ui;
})(wui || {}, libs);