(function () {
    /**
     * 自定义模块，添加工具面板类
     * toolbar 类
     * @auth: zyx
     * @data: 2017-07-23 20:30
     */
    UM.ui.define('toolbar', {
        /**
         * 工具面板模板html
         */
        tpl: [
            '<div class="edui-toolbar">',
                '<div class="edui-btn-toolbar" unselectable="on" onmousedown="return false"  ></div>',
            '</div>'
        ].join(''),
        /*  */
        init: function () {
            var $root = this.root($(this.tpl));
            this.data('$btnToolbar', $root.find('.edui-btn-toolbar'))
        },
        appendToBtnmenu: function (data) {
            var $cont = this.data('$btnToolbar');
            data = $.isArray(data) ? data : [data];
            $.each(data,function(i, $item) {
                $cont.append($item);
            })
        }
    });
})();
