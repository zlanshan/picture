/**
 * <h3>WUI 拓展组件库</h3>
 * <h5>工作流模块</h5>
 * <ol>
 * <li>{{#crossLink "wui.opinionBox"}}{{/crossLink}}: 意见审批 </li>
 * <li>{{#crossLink "wui.orgChooseBox"}}{{/crossLink}}: 组织选择 </li>
 * <li>{{#crossLink "wui.userChooseBox"}}{{/crossLink}}: 人员选择 </li>
 * <li>{{#crossLink "wui.dictionaryCode"}}{{/crossLink}}: 数据字典编码 </li>
 * </ol>
 * @module Expand
 */
;(function (ui,$, undefined){
	/**
	 * <h3>数据字典编码下拉组件</h3>
     * <ol>
     * <li>支持加载后台服务作为下拉数据源; </li>
     * <li>支持下拉数据即时查找; </li>
     * <li>支持多选个数限制; </li>
     * <li>自定义开启全选/全不选按钮; </li>
     * </ol>
     * <h3>预览地址：<a href="../../examples/index.html?isShowMenu=1&rootId=wuiDictionaryCode" target="_blank">demo</a></h3>
     * @namespace wui
     * @class dictionaryCode
     *  @constructor 
     *  @param {string} id  初始化组件元素ID名  
     *  @param {object} option  
     *  @param {string} [option.code=""]  字典项编码
     *  @param {Array} [option.data=null]   字典项数据,注意格式[{"id": "item1", "name": "itemName1"}, ...],"id"和"name"有对应的name和text参数配置的
     *  @param {string} [option.value=""]   初始化完成时,选中值的value属性值 
     *  @param {string} [option.text="name"] 选中值保存的text字段
     *  @param {string} [option.name="id"] 选中值保存的name字段
     *  @param {string} [option.direction="auto"]   下拉视图展开方向,"dropup":向上,"dropdown"/不填:向下
     *  @param {boolean} [option.isEnabledLiveSearch=true]   是否启用即时搜索
     *  @param {string} [option.width="100%"]   组件宽度
     *  @param {number} [option.maxHeight=0]   下拉选项最大高度,单位"px",默认为0,表示自适应高度 
     *  @param {Function} [option.onLoadComplete]   组件加载完成触发方法(当采用异步加载数据时,可能会产生数据加载不同步,可将后续操作在此方法内执行),传递参数data:下拉视图数据 
     *  @example
     * 
     *   html:
     *
            <input type="text" id="dictionaryCodeId" />
     *      
     *   js: 
     *   
            // 初始化
            var uiDictionaryCode = wui.dictionaryCode( "dictionaryCodeId" );
     *
     */
	ui.dictionaryCode = function(id, options){
        
        var _pluginDataName = 'plugin_uiSelectBox',
            _widgetName = "dictionaryCode";

        /*
         * 拓展组件配置
         * @Author   Chenzx
         * @DateTime 2018-12-26
         * @param    {string}   opt 组件配置
         * @return   {[type]}   [description]
         */
        function _extendOpt(opt){
            // console.error(opt)
            // 组件默认配置
            var defaultSetting = {
                // {string} 后台服务地址
                // loadUrl: ui.serviceInterface.dictionaryCodeServiceAPI             
                // {string} 请求后台服务方法
                // , method: "get"         
                // {String} 请求后台服务的其他参数,将自动转换为请求字符串格式。GET 请求中将附加在 URL 后
                // , otherParam: {}
                // {Boolean} 是否异步加载数据,默认为false
                // , async: false       
                // {json}   选项的JSON数据,注意格式[{ "fieldValue":"value1","fieldText":"text1" },{ "fieldValue":"value2","fieldText":"text2" },...]    
                // , loadData: null        
                // {string} 初始化完成时,默认选中值的value属性值
                value: "" 
                // 请求数据源
                , source: function(){
                    var that = this;

                    if(opt.code){
                        if(opt.data){
                            that.renderNodes(opt.data[opt.code])
                        }else if(ui.dictCodeSetting && ui.dictCodeSetting.items){
                            that.renderNodes(ui.dictCodeSetting.items[opt.code])
                        }
                    }else{
                        ui.logError("【code】参数不能为空", FRAME_NAME + "." + _widgetName, true)
                    }
                }
                // {string}  非空,选中值保存的text字段
                , text: ui.dictCodeSetting.text
                // {string}  非空,选中值保存的value字段
                , name: ui.dictCodeSetting.name
                // {string} 下拉数据框展开方向,dropup:向上,dropdown/不填则默认向下
                , direction: "auto" 
                // {number} 最多可选个数,false代表无限制
                , maxNumber: 1
                // {number} 下拉选项视图最大高度,单位"px",默认为0,表示自适应到页面底部高度
                , maxHeight: 0  
                // {Number} 组件宽度,默认"100%"
                , width: ""  
                // {Number} 设置下拉视图宽度,默认和组件宽度一致
                , menuWidth: "" 
                // {JSON} 默认显示文本设置         
                , defaultText: {
                    // 没有选中选项时,显示文本
                    noneSelectedText : $("#" + id).attr("placeholder") ? $("#" + id).attr("placeholder") : "没有选中任何项"    
                    // 下拉搜索匹配不到内容时显示文本
                    , noneResultsText : "匹配不到'{0}'"     
                    // 选中下拉分组提示文本
                    // , countSelectedText : "选中{1}中的{0}项" 
                    // 超过最大可选个数限制时提示文本
                    // , maxOptionsText : ['超出限制 (最多选择{n}项)', '组选择超出限制(最多选择{n}组)'] 
                     // 下拉视图中,"全不选"按钮文本
                    , deselectAllText : "全不选" 
                    // 下拉视图中,"全选"按钮文本
                    , selectAllText : "全选"      
                    // 下拉视图中,"关闭"按钮文本
                    , doneButtonText : "关闭"     
                    // 下拉视图中,搜索框提示语
                    , liveSearchPlaceholder : "查找选项" 
                    // 下拉视图中,没有下拉选项时提示语
                    , noneOptionText: "没有可选的选项"
                    // 下拉视图中,数据加载失败提示语
                    , queryErrorText: "<span class=\"wui-text-danger\">Sorry,尽力了,但数据还是加载失败..</span>"
                }
            }

            $.extend(true, defaultSetting, ui.dictCodeSetting);

            var _opt = $.extend(true, {}, defaultSetting, opt);

            // console.info(_opt)
            return _opt;
        }

        /*
         * 执行组件的拓展方法
         * @Author   Chenzx
         * @DateTime 2018-12-26
         * @param    {string}   funcName 组件的执行方法名
         * @param    {Array}   params   方法传递参数
         * @return   组件拓展方法的返回值
         */
        function _executeMethod(funcName, params){
            var data = $.data(document.getElementById(id), _pluginDataName);
            if(!data){
                ui.logError("组件未初始化或已被销毁", FRAME_NAME + "." + _widgetName, true);
                return;
            }

            var args = Array.prototype.slice.call(arguments,1);

            if(typeof (data[funcName]) === "function"){
                return data[funcName].apply(data, args);
            }else{
                ui.logWarn('组件中不存在 ' + funcName + '() 方法', FRAME_NAME + "." + _widgetName, true);
            }
        }

        /**
         * 增加组件事件监听
         * @event on
         * @param eventType {string} 可监听事件类型如下：<br/>
            <table class="table table-bordered table-condensed">
                <thead>
                    <tr>
                        <td> eventType </td>
                        <td> 含义 </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>"beforeItemSelect"</td>
                        <td>单个节点选中之前触发</td>
                    </tr>
                    <tr>
                        <td>"itemSelectError"</td>
                        <td>单个节点选中出错触发</td>
                    </tr>
                    <tr>
                        <td>"itemSelected"</td>
                        <td>单个节点选中之后触发</td>
                    </tr>
                    <tr>
                        <td>"beforeItemUnselect"</td>
                        <td>单个节点取消选中之前触发</td>
                    </tr>
                    <tr>
                        <td>"itemUnselectError"</td>
                        <td>单个节点取消选中出错触发</td>
                    </tr>
                    <tr>
                        <td>"itemUnselected"</td>
                        <td>单个节点取消选中之后触发</td>
                    </tr>
                </tbody>
            </table>
         * @param func {function} 事件类型触发之后的执行方法
         * @return 组件对象
         * @example 
            
            // 组件添加节点出错时被触发
            uiSelectBox.on("itemSelectError", function(e){
                console.log("itemSelectError");
            });
                
         */
        function _on(eventType, func){
            _executeMethod("on", eventType, func);
            return this;
        }

        /**
         * 取消组件事件监听
         * @event off
         * @param eventType {string} 可监听事件类型同"on"方法的eventType参数
         * @param func {function} 选填,事件类型触发之后的执行方法,不传则默认取消该类型绑定的全部事件方法
         * @return 组件对象
         * @example 
            
            // 取消组件事件监听
            uiSelectBox.off("itemSelectError");
                
         */
        function _off(eventType, func){
            _executeMethod("off", eventType, func);
            return this;
        }

        /**
        * 设置组件值
        * @method set
        * @param value {string/object} 选中选项的value属性值,多个数据用","分隔或者数组封装传递
        * @since 0.0.1
        * @example 
            // 选中组件值
            uiSelectBox.set("tianjin,guangzhou");
                
        */
        function _set(value, isTriggerUnselectEvent){
            return _executeMethod("set", value, isTriggerUnselectEvent);
        }

        /**
        * 获取组件值
        * @method get
        * @since 0.0.1
        * @param type {string} 获取的组件值的类型,可选:value/text/json,默认是"json"
        * @return 传递的类型参数的组件值
        * @example 
            
            // 获取组件选中的日期字符串
            var value = uiSelectBox.get("value");   // "beijing,guangzhou"
                
        */
        function _get(type){
            return _executeMethod("get", type);
        }

        /**
        * 选中选项
        * @method select
        * @param value {string/object} 选中选项的value属性值,多个数据用","分隔或者数组封装传递
        * @since 0.0.1
        * @example 
            // 选中组件值
            uiSelectBox.select("beijing");
                
        */
        function _select(value){
            return _executeMethod("select", value);
        }

        /**
        * 取消选项选中
        * @method unselect
        * @param value {string/object} 取消选中选项的value属性值,多个数据用","分隔或者数组封装传递
        * @since 0.0.1
        * @example 
            // 取消选中组件值
            uiSelectBox.unselect("tianjin");
                
        */
        function _unselect(value){
            return _executeMethod("unselect", value);
        }

        /**
        * 全部选项选中
        * @method selectAll
        * @since 0.0.1
        * @example 
            // 选中组件值
            uiSelectBox.selectAll();
                
        */
        function _selectAll(){
            return _executeMethod("selectAll");
        }

        /**
        * 全部选项不选中
        * @method unselectAll
        * @since 0.0.1
        * @example 
            // 不选中组件值
            uiSelectBox.unselectAll();
                
        */
        function _unselectAll(){
            return _executeMethod("unselectAll");
        }

        /**
        * 阻止点击弹出下拉框
        * @method disabled
        * @since 0.0.1
        * @example 
            
            // 阻止点击弹出下拉框
            uiSelectBox.disabled();
                
        */
        function _disabled(){
            return _executeMethod("disabled");
        }

        /**
        * 允许点击弹出下拉框
        * @method enabled
        * @since 0.0.1
        * @example 
            
            // 允许点击弹出下拉框
            uiSelectBox.enabled();
                
        */
        function _enabled(){
            return _executeMethod("enabled");
        }

        /**
        * 刷新下拉数据,以下两种可能会用到这个方法:<br/>
            1、向初始化的SELECT标签中新增选项之后,重新排列下拉选项;<br/>
            2、重新加载数据源:loadUrl/loadData
        * @method reload
        * @param [source] {string/Array} [重新加载下拉数据源,若为空,则重新加载传递参数]
        * @since 0.0.1
        * @example 
            html:
            <select>
                <option value="option1">选项1</option>
                <option value="option2">选项2</option>
            </select>
            JS:
            // 添加下拉选项
            $("select").append("<option value="option3">选项3</option>");
            // 刷新组件下拉选项
            uiSelectBox.reload();
                
        */
        function _reload(data){
            return _executeMethod("reload", data);
        }
        
        /**
        * 向初始化的SELECT标签中新增选项之后,重新排列下拉选项(只针对初始化标签是SELECT有效)(不会重新请求数据源)
        * @method refresh
        * @since 0.0.1
        * @example 
            html:
            <select>
                <option value="option1">选项1</option>
                <option value="option2">选项2</option>
            </select>
            JS:
            // 添加下拉选项
            $("select").append("<option value="option3">选项3</option>");
            // 刷新组件下拉选项
            uiSelectBox.refresh();
                
        */
        function _refresh(){
            return _executeMethod("refresh");
        }
        
        /**
        * 设置或者获取组件参数
        * @method option
        * @param params {More} 可传递参数类型如下表,传递不同的参数类型含义不同<br/>
            <table class="table table-bordered table-condensed">
                <thead>
                    <tr>
                        <td> 传递参数类型 </td>
                        <td> 含义 </td>
                        <td> 返回值 </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td> undefined </td>
                        <td> 获取组件的配置参数 </td>
                        <td> JSON 组件的配置参数 </td>
                    </tr>
                    <tr>
                        <td> String </td>
                        <td> 获取传入字符串对应的参数值 </td>
                        <td> 传递的字符串对应的组件配置值 </td>
                    </tr>
                    <tr>
                        <td> JSON </td>
                        <td> 重置组件参数配置 </td>
                        <td> 组件对象 </td>
                    </tr>
                </tbody>
            </table>
        * @since 0.0.1
        * @example 
            
            // 获取组件参数
            uiSelectBox.option();   // 返回组件配置对象
                
        */
        function _option(params){
            return _executeMethod("option", params);
        }

        /**
        * 清空组件值
        * @method empty
        * @param {Boolean} [isTriggerUnselectEvent] 是否触发单个节点删除事件,默认是true
        * @since 0.0.1
        * @example 
            
            // 清空组件值
            uiSelectBox.empty();
                
        */
        function _empty(isTriggerUnselectEvent){
            return _executeMethod("empty", isTriggerUnselectEvent);
        }

        /**
        * 销毁组件：销毁之后可通过重新初始化组件启用组件
        * @method destroy
        * @since 0.0.1
        * @example 
            
            // 销毁组件：销毁之后可通过重新初始化组件启用组件
            uiSelectBox.destroy();
                
        */
        function _destroy(){
            return _executeMethod("destroy");
        }

        /**
        * 获取wui组件的内部定义组件,可自定义拓展,不建议修改默认属性值,除非你清楚该属性含义
        * @method component
        * @since 0.0.1
        * @example 
            
            var component = uiSelectBox.component();
            console.info(component);
        */
        function _component(){
            return _executeMethod("component");
        }

        /**
         * 初始化方法
         * @method init
         * @param [options] {json} 组件配置参数
         * @return {Object} 若是已经初始化过,则根据传递参数重新配置参数,并返回该组件对象,否则初始化并返回该组件对象
         * @since 0.0.1
         * @example 
            // 重新初始化组件,若是传递参数，则
            var myDictionaryCode = uiDictionaryCode.init();
                
         */
        function _init(opt){
            if(!$.data(document.getElementById(id), _pluginDataName)){
                ui.selectBox(id, _extendOpt(opt));
            }else{
                if(opt && ui.isJson(opt)){
                    return _executeMethod("option", opt);
                }else{
                    return;
                }
            }

        }


        // 初始化组件
        _init(options);

        return {
            init: _init,
            on: _on,
            off: _off,
            set: _set,
            get: _get,
            select: _select,
            unselect: _unselect,
            selectAll: _selectAll,
            unselectAll: _unselectAll,
            enabled: _enabled,      // 允许点击弹出下拉框
            disabled: _disabled,    // 阻止点击弹出下拉框
            option: _option,
            reload: _reload,
            refresh: _refresh,
            empty: _empty,
            // 获取wui组件的内部定义组件
            component: _component,
            destroy: _destroy
        }
    }
    
	return ui;
})(wui || {}, libs);