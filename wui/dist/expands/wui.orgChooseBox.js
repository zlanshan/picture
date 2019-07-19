/**
 * @module Expand
 */

;(function (ui,$, undefined){
	/**
	 * <h3>组织选择框组件</h3>
     * <ol>
     * <li>传入后台服务接口，配置解析参数,直接渲染页面; </li>
     * <li>赋值、取值一个方法解决。 </li>
     * </ol>
     * <h3>预览地址：<a href="../../examples/index.html?isShowMenu=1&rootId=wuiOrgChooseBox" target="_blank">demo</a></h3>
     * <h3 style="display:none">方法说明：</h3>
     * <ol style="display:none">
     * <li>{{#crossLink "wui.orgChooseBox/init"}}{{/crossLink}}: 初始化 </li>
     * <li>{{#crossLink "wui.orgChooseBox/set"}}{{/crossLink}}: 设置组件值 </li>
     * <li>{{#crossLink "wui.orgChooseBox/get"}}{{/crossLink}}: 获取组件值 </li>
     * <li>{{#crossLink "wui.orgChooseBox/add"}}{{/crossLink}}: 添加组件值 </li>
     * <li>{{#crossLink "wui.orgChooseBox/remove"}}{{/crossLink}}: 移除组件值 </li>
     * <li>{{#crossLink "wui.orgChooseBox/enabled"}}{{/crossLink}}: 允许标签栏点击 </li>
     * <li>{{#crossLink "wui.orgChooseBox/disabled"}}{{/crossLink}}: 阻止标签栏点击 </li>
     * <li>{{#crossLink "wui.orgChooseBox/openPopup"}}{{/crossLink}}: 打开弹窗 </li>
     * <li>{{#crossLink "wui.orgChooseBox/option"}}{{/crossLink}}: 设置或者获取组件配置 </li>
     * <li>{{#crossLink "wui.orgChooseBox/empty"}}{{/crossLink}}: 清空组件值 </li>
     * <li>{{#crossLink "wui.orgChooseBox/destroy"}}{{/crossLink}}: 销毁组件 </li>
     * </ol>
     * @namespace wui
     * @class orgChooseBox
     *  @constructor 
     *  @param {string} id  初始化组件元素ID名  
     *  @param {object} option 组件配置 
     *  @param {string} option.name 选中值保存的name字段,默认值是"orgName" 
     *  @param {string} option.text 选中值保存的text字段,默认值是"orgName"
     *  @param {string} [option.ellipsis]   省略符号，当标签个数达到最大字符数时替换多余字符的字符串,默认是"..."
     *  @param {boolean} [option.isFreeInput]   是否可以自由输入,默认是true 
     *  @param {boolean} [option.isEnableInput]   是否启用输入框,默认是true
     *  @param {boolean} [option.isShowBtnGroup]  是否添加按钮组,默认是true
     *  @param {boolean} [option.isShowInputBar]  是否显示标签栏,若为false,就不显示输入栏,默认是true
     *  @param {Number/Boolean} [option.maxNumber]   最多可选个数，默认为false，即不限制
     *  @param {number} [option.maxChars]   是每个标签字符限制个数,默认是0,代表不限制 
     *  @param {Object} [option.otherParam]   初始化完成时，默认选中数据传递到弹出页面的各个子页面的自定义json数据,默认是{} 
     *  @param {string} [option.popPageUrl]  弹出公共页面URL,默认是 wui.commonPageBasePath + "wui.choosebox.popup.html"
     *  @param {string} [option.pageHeight]  弹出层页面高度,默认是"570px" 
     *  @param {string} [option.pageWidth]   弹出层页面宽度,默认是"1200px" 
     *  @param {boolean} [option.isFull]     弹出层是否全屏展示,默认是false    
     *  @param {string} [option.pageTitle]   弹出层页面标题,默认是"orgChooseBox弹出层页面" 
     *  @param {string} option.treeTitle   弹出层树结构标题,默认是"" 
     *  @param {string} option.treeUrl   弹出层组织树服务数据源,默认是"" 
     *  @param {string} option.gridTitle   弹出层列表标题,默认是""
     *  @param {string} option.gridUrl 弹出层子组织列表服务接口地址,默认是""(假如是相对路径,那是相对于popPageUrl参数所在页面路径。)
     *  @param {string} [option.tagClass]   标签块样式类,默认是"wui-bg-primary"
     *  @param {Object} [option.value]  初始化完成时，默认选中数据,默认是[]
     *  @param {Function} [option.onBeforeOpenPopup]  每一次弹出窗口之前执行的方法,传递参数为popupParams:表示打开弹窗传递的参数对象,若想修改参数,则修改后返回该修改对象即可,若返回false,则会阻断弹出窗口
     *  @param {Function} [option.onSuccessCallback]  关闭成功回调执行方法,参数是一个json对象,由弹出层调用wui.closeModalDialog()关闭层时返回数据决定,传递什么参数就返回什么参数
     *  @param {Function} [option.onCancelCallback]  弹出层右上角关闭按钮触发的回调,该回调携带两个参数,分别为：当前层索引参数(index)、当前层的DOM对象(layero),默认会自动触发关闭。如果不想关闭,return false即可
     *  @param {Function} [option.onClosedLayer]  无论是否成功关闭都会执行的回调方法,执行顺序: onSuccessCallback() 优先于 onClosedLayer()(即模态框的closedCallback方法,这也保证了在这个方法内可以获取到orgChooseBox的组件值),参数:chooseBoxNodes: 组件值(包括弹窗返回数据)
     *  @example
     * 
     *   html:
     *
            <input type="text" id="orgChooseBox" />
     *      
     *   js: 
     *   
            // 初始化
            var uiOrgChooseBox = wui.orgChooseBox( "orgChooseBox",{
            });
     *
     */
	ui.orgChooseBox = function(id, options){
        
        var _pluginDataName = 'plugin_uiChooseBox',
            _widgetName = "orgChooseBox";

        /*
         * 拓展组件配置
         * @Author   Chenzx
         * @DateTime 2018-12-26
         * @param    {string}   opt 组件配置
         * @return   {[type]}   [description]
         */
        function _extendOpt(opt){
            // 组件默认配置
            var defaultSetting = {
                // {string} 非空,弹出页面URL
                popPageUrl: ui.commonPageBasePath + "wui.orgChooseBox.popup.html"
                // {object} 默认选中数据
                , value: [] 
                // {String} 组件宽度,默认""
                , width: ""    
                // {String} 组件初始化高度,默认""
                , initHeight: ""    
                // {String} 组件最大宽度,默认""
                , maxHeight: ""
                // {boolean} 是否添加按钮组
                , isShowBtnGroup: true
                // {json} 传递到弹出页面的各个子页面的自定义json字符串数据
                , otherParam: {}
                // {boolean} 是否点击标签栏弹出层
                , isClickTriggerPopup: true
                // {boolean} 是否可赋值到其他标签中
                , isVoluation: false        
                // {Boolean} 是否显示标签栏,若为false,就不显示输入栏
                , isShowInputBar: true
                // {Boolean} 是否弹窗时拼接已选节点到弹出层链接里面
                , isOpenWithNodes: false
                // {Boolean} 是否在弹出层里面禁用删除传递的值
                , isDisableRemove: false

                /* 弹出层配置 */
                // {string} 弹出层页面高度
                , pageHeight: ui.pageHeight
                // {string} 弹出层页面宽度 
                , pageWidth: ui.pageWidth
                // {Boolean} 是否全屏展示,默认为false,此时pageHeight、pageWidth不起作用
                , isFull: false             
                // {string} 弹出层页面标题
                , pageTitle: '组织选择'     

                /* 树配置 */
                // {string} 树列表标题
                , treeTitle: '组织树结构' 
                // {string} 树形数据URL             
                , treeUrl: ui.serviceInterface.orgServiceAPI
                // 树结构懒加载时,每一次懒加载传递当前节点key值的字段名,默认是"parentDeptId" 
                , lazyField: 'parentDeptId'
                // 树结构是否启用搜索栏,默认是true
                , isEnabledSearch: true
                /* 选项卡/列表配置 */
                // {string} 列表标题
                , gridTitle: '组织列表'               
                // {string} 子组织列表服务接口地址,默认是"",主要用于组织选择组件全局设置
                , gridUrl: ui.serviceInterface.subOrgServiceAPI

                // 新功能:下拉查询输入数据
                // {Boolean} 是否启用数据过滤
                , isFilterable: false
                // {String} 下拉可供搜索数据URL
                , filterUrl: null
                // {String} 下拉可供搜索数据对象
                , filterData: null
                // {String} 下拉查询视图宽度
                , filterPickerWidth: ""
                // {String} 下拉查询视图最大高度
                , filterPickerMaxHeight: "auto"
                // {JSON} 过滤数据源参数解析
                , filterSourceReader: {
                    // {String} 服务器返回的实际加载数据字段名,若为null,则返回数据作为实际加载数据
                    root: null
                    // {String} 子节点集字段名
                    , children: "children"
                    // {string} 非空,节点value字段
                    // , key: "id"
                    // // {string} 非空,节点text字段
                    // , title: "name"
                }
                , filterField: "key"
                // 下拉视图展开方向
                , filterDirection: "auto"
                // 下拉视图展开最大高度
                , filterMaxHeight: 0
                // {Number} 设置下拉视图宽度,默认和组件宽度一致
                , filterMenuWidth: "auto" 

                /* tags配置 */
                // {string} 非空,节点value字段
                , name: 'orgId'
                // {string} 非空,节点text字段
                , text: 'orgName'
                // {number} 最多可选个数,false代表无限制
                , maxNumber: false   
                // {boolean} 是否可以自由输入           
                , isFreeInput: false        
                // {Boolean} 是否添加删除操作
                , isAddRemoveLink: true 
                // {boolean} 是否允许重复填充数据 
                , isAllowDuplicates: false  
                // {string} 标签块样式类
                , tagClass: 'wui-bg-primary'   
                // {number} 每个标签字符限制个数,0代表不限制
                , maxChars: 0               
                // {string} 省略符号,当标签个数达到最大字符数时替换多余字符的字符串
                , ellipsis: "..."
                // {Function} 每一次弹出窗口之前执行的方法,传递参数为popupParams:表示打开弹窗传递的参数对象,若想修改参数,则修改后返回该修改对象即可,若返回false,则会阻断弹出窗口
                , onBeforeOpenPopup: ui.CONSTANTS.EMPTYFUNC
                // {Function} 无论是否成功关闭都会执行的回调方法,执行顺序: onSuccessCallback() 优先于 onClosedLayer()(即模态框的closedCallback方法,这也保证了在这个方法内可以获取到chooseBox的组件值),参数:chooseBoxNodes: 组件值(包括弹窗返回数据)           
                , onClosedLayer: ui.CONSTANTS.EMPTYFUNC    
                // {Function} 关闭成功回调执行方法,参数是一个json对象,由弹出层调用wui.closeModalDialog()关闭层时返回数据决定,传递什么参数就返回什么参数
                , onSuccessCallback: ui.CONSTANTS.EMPTYFUNC   
                // {Function} 弹出层右上角关闭按钮触发的回调,该回调携带两个参数,分别为：当前层索引参数(index)、当前层的DOM对象(layero),默认会自动触发关闭。如果不想关闭,return false即可
                , onCancelCallback: ui.CONSTANTS.EMPTYFUNC
                // {Function} 清空触发事件
                , onEmpty: ui.CONSTANTS.EMPTYFUNC
                // {Boolean/Function} 监听输入框输入事件,若为true,则启用自动完成功能,若为false,则关闭,若为function,则用自定义方法
                , onInput: true
                // {function/Boolean} 启用自动输入时,按"Enter"键生成标签,默认是true,设置为false时禁用,可自定义方法,传递参数element:输入框节点对象;node:输入数据;event:事件对象
                , onEnter: true
                // {Boolean} 是否每次打开弹窗都重置数据,即不要旧数据,默认是true
                , isRewrite: false

                // {JSON} 设置组件文本内容
                , defaultText: {
                    // 清空按钮文本
                    editBtn: ui.language.chooseBox.editBtn,
                    // 清空按钮文本
                    clearBtn: ui.language.chooseBox.clearBtn
                }
                // 拓展参数:树组件拓展配置,具体参数详见"wui.tree",不支持传递方法属性值
                , treeExtSetting: null
                // 拓展参数:选项卡组件拓展配置,具体参数详见"wui.tabs",不支持传递方法属性值
                , tabsExtSetting: null
                // 拓展参数:列表组件拓展配置,具体参数详见"wui.grid",不支持传递方法属性值
                , gridExtSetting: null
                // 拓展参数:标签组件拓展配置,具体参数详见"wui.tagsinput",不支持传递方法属性值
                , tagsExtSetting: null

            }

            var _opt = $.extend(true, {}, defaultSetting, opt);

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
         *  @event on
         *  @param eventType {string} 可监听事件类型如下：<br/>
            <table class="table table-bordered table-condensed">
                <thead>
                    <tr>
                        <td> eventType </td>
                        <td> 含义 </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td> "beforeItemAdd" </td>
                        <td> 单个节点添加之前触发 </td>
                    </tr>
                    <tr>
                        <td>"itemAddError"</td>
                        <td> 单个节点添加出错时触发 </td>
                    </tr>
                    <tr>
                        <td>"itemAdded"</td>
                        <td> 单个节点添加成功之后触发 </td>
                    </tr>
                    <tr>
                        <td>"beforeItemRemove"</td>
                        <td> 单个节点移除之前触发 </td>
                    </tr>
                    <tr>
                        <td>"itemRemoveError"</td>
                        <td> 单个节点移除出错时触发 </td>
                    </tr>
                    <tr>
                        <td>"itemRemoved"</td>
                        <td> 单个节点移除成功之后触发 </td>
                    </tr>
                </tbody>
            </table>
         *  @param func {function} 事件类型触发之后的执行方法
         *  @example 
            
            // 单个节点添加出错时触发
            uiOrgChooseBox.on("itemAddError", function(e){
                console.log(e.message);
            });
                
         */
        function _on(eventType, func){
            // var data = $.data(document.getElementById(id), _pluginDataName);
            _executeMethod("on", eventType, func);
            return this;
        }

        /**
         * 取消组件事件监听
         * @event off
         * @param eventType {string} 可取消监听事件类型同"on"方法的eventType参数
         * @param [func] {function} 事件类型触发之后的执行方法，不传则默认取消该类型绑定的全部事件方法
         * @example 
            
            // 取消组件事件监听
            uiOrgChooseBox.off("itemAddError");
                
         */
        function _off(eventType, func){
            // var data = $.data(document.getElementById(id), _pluginDataName);
            _executeMethod("off", eventType, func);
            return this;
        }

        /**
        * 设置组件值
        * @method set
        * @since 0.0.1
        * @param data {Object/String} 设置的组件数据,可传递参数类型如下表,传递不同的参数类型含义不同<br/>
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
                        <td> String </td>
                        <td> value值和text值默认一致(多个可以用数组表示或者用","分隔开) </td>
                        <td> 组件对象 </td>
                    </tr>
                    <tr>
                        <td> Object </td>
                        <td> 必须存在配置参数name和配置参数text的参数值对应的键值对,且此值作为保存的JSON对象,比如：配置参数中{"name":"id","text":"title"},那传入键值对必须包含"id"、"title"的键值对 </td>
                        <td> 组件对象 </td>
                    </tr>
                </tbody>
            </table>
        * @example  
            
            // 设置组件值
            uiOrgChooseBox.set({"id" :"0cce8be5-d07e-e2b0-501a-44cb4d78b8be","name":"李文","sex":"男","age":"25","email":"15875354693@163.com"});
                
        */
        function _set(data){
            return _executeMethod("set", data);
        }

        /**
        * 获取组件值
        * @method get
        * @since 0.0.1
        * @param type {string} 获取的组件值的类型，可选:value/text/json，默认是"json"
        * @return 传递的类型参数的组件值
        * @example 
            
            // 获取组件值
            var value = uiOrgChooseBox.get("value");   // "0cce8be5-d07e-e2b0-501a-44cb4d78b8be"
                
        */
        function _get(type){
            return _executeMethod("get", type);
        }

        /**
        * 添加组件值
        * @method add
        * @since 0.0.1
        * @param data {Object/String} 添加的组件数据,可传递参数类型如下表,传递不同的参数类型含义不同<br/>
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
                        <td> String </td>
                        <td> value值和text值默认一致(多个可以用数组表示或者用","分隔开) </td>
                        <td> 组件对象 </td>
                    </tr>
                    <tr>
                        <td> Object </td>
                        <td> 必须存在配置参数name和配置参数text的参数值对应的键值对,且此值作为保存的JSON对象,比如：配置参数中{"name":"id","text":"title"},那传入键值对必须包含"id"、"title"的键值对 </td>
                        <td> 组件对象 </td>
                    </tr>
                </tbody>
            </table>
        * @example 
            
            // 设置组件值
            uiOrgChooseBox.add({"id" :"0cce8be5-d07e-e2b0-501a-44cb4d78b8be","name":"李文","sex":"男","age":"25","email":"15875354693@163.com"});
                
        */
        function _add(data){
            return _executeMethod("add", data);
        }

        /**
        * 移除组件节点
        * @method remove
        * @since 0.0.1
        * @param data {Object/String} 可传递参数类型如下表,传递不同的参数类型含义不同<br/>
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
                        <td> String </td>
                        <td> 移除组件值的name参数对应的值集合(多个值用数组表示或者用","分隔开) </td>
                        <td> 组件对象 </td>
                    </tr>
                    <tr>
                        <td> Object </td>
                        <td> 移除组件值,必须存在name参数和text参数对应的键值对(不建议使用，但是存在多个重复name值时,可采用此参数),(多个值用数组表示) </td>
                        <td> 组件对象 </td>
                    </tr>
                </tbody>
            </table>
        * @example 
            
            // 移除组件节点和值
            uiOrgChooseBox.remove("0cce8be5-d07e-e2b0-501a-44cb4d78b8be");
                
        */
        function _remove(data){
            return _executeMethod("remove", data);
        }

        /**
         * 打开弹窗
         * @method openPopup
         * @param [newParam] {json} 打开弹窗的自定义参数配置，不填则采用默认参数，参数内容如下
         * @param newParam.url {string} 打开的弹窗页面地址
         * @param newParam.width {string} 打开弹窗宽度，需要带单位
         * @param newParam.height {string} 打开弹窗高度，需要带单位
         * @param newParam.title {string} 打开弹窗的标题
         * @param {Function} [newParam.onSuccessCallback]  关闭成功回调执行方法,参数是一个json对象,由弹出层调用wui.closeModalDialog()关闭层时返回数据决定,传递什么参数就返回什么参数
         * @param {Function} [newParam.onCancelCallback]  弹出层右上角关闭按钮触发的回调,该回调携带两个参数,分别为：当前层索引参数(index)、当前层的DOM对象(layero),默认会自动触发关闭。如果不想关闭,return false即可
         * @param {Function} [newParam.onClosedLayer]  无论是否成功关闭都会执行的回调方法,执行顺序: onSuccessCallback() 优先于 onClosedLayer()(即模态框的closedCallback方法,这也保证了在这个方法内可以获取到organChooseBox的组件值),参数:organChooseBoxNodes: 组件值(包括弹窗返回数据)
         * @since 0.0.1
         * @example 
            
            // 打开弹窗
            uiOrgChooseBox.openPopup({
                "title": "弹窗新标题",
                "url": "http://hostname:post/new.html"
            });
                
        */
        function _openPopup(newParam){
            newParam = newParam || {};
            return _executeMethod("open", newParam);
        }

        /**
        * 阻止点击弹出层和删除标签
        * @method disabled
        * @since 0.0.1
        * @example 
            
            // 阻止点击弹出层和删除标签
            uiOrgChooseBox.disabled();
                
        */
        function _disabled(){
            return _executeMethod("disabled");
        }

        /**
        * 允许点击弹出层和删除标签
        * @method enabled
        * @since 0.0.1
        * @example 
            
            // 允许点击弹出层和删除标签
            uiOrgChooseBox.enabled();
                
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
            uiOrgChooseBox.readonly();
                
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
            uiOrgChooseBox.readwrite();
                
        */
        function _readwrite(){
            return _executeMethod("readwrite");
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
            uiOrgChooseBox.option();
                
        */
        function _option(params){
            return _executeMethod("option", params);
        }

        /**
        * 清空组件值
        * @method empty
        * @since 0.0.1
        * @param {Boolean} [isTriggerUnselectEvent] 是否触发单个节点删除事件,默认是true
        * @example 
            
            // 清空组件值：设置不可自由输入时，可通过此方法清除选中值
            uiOrgChooseBox.empty();
                
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
            uiOrgChooseBox.destroy();
                
        */
        function _destroy(){
            return _executeMethod("destroy");
        }

        /**
         * 初始化方法
         * @method init
         * @param [options] {json} 组件配置参数
         * @return {Object} 若是已经初始化过,则根据传递参数重新配置参数,并返回该组件对象,否则初始化并返回该组件对象
         * @since 0.0.1
         * @example 
            // 重新初始化组件,若是传递参数，则
            var myOrgChooseBox = uiOrgChooseBox.init();
                
         */
        function _init(opt){

            if(!$.data(document.getElementById(id), _pluginDataName)){
                ui.chooseBox(id, _extendOpt(opt));
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
            // 初始化组件
            init: _init,
            // 监听组件事件            
            on: _on,
            // 取消绑定组件事件
            off: _off,
            // 获取组件值
            get: _get,
            // 设置组件值
            set: _set,
            // 增加组件节点和值
            add: _add,
            // 移除组件节点和值
            remove: _remove,
            // 启用组件
            enabled: _enabled,
            // 禁用组件
            disabled: _disabled,
            // 可读可写
            readwrite: _readwrite,
            // 只读
            readonly: _readonly,
            // 弹出窗口
            openPopup: _openPopup,
            // 销毁组件
            destroy: _destroy,
            // 设置或者获取组件参数
            option: _option,
            // 清空组件值
            empty: _empty
        }
    }
    
	return ui;
})(wui || {}, libs);