/**
 * 开发版本的文件导入
 * 注意：以下路径写对应webapp下的绝对路径
 */
(function (){
	var paths  = [
		'./umeditor-1.2.3/umeditor.art.config.js',
		/* 以上为添加属性配置 */
		'./umeditor-1.2.3/_src/editor.js',
		/* 基础库 - 判别浏览器 */
		'./umeditor-1.2.3/_src/core/browser.js',
		/* 基础库 - 定义基本工具方法 */
		'./umeditor-1.2.3/_src/core/utils.js',
		/* 基础库 - 定义了事件绑定、解绑方法 */
		'./umeditor-1.2.3/_src/core/EventBase.js',
		/* 基础库 - 这个有点复杂、没看懂 */
		'./umeditor-1.2.3/_src/core/dtd.js',
		'./umeditor-1.2.3/_src/core/domUtils.js',
		'./umeditor-1.2.3/_src/core/Range.js',
		/* 基础库 - 选区的各种方法 */
		'./umeditor-1.2.3/_src/core/Selection.js',
		/* 基础库 - 编辑器方法 */
		'./umeditor-1.2.3/_src/core/Editor.js',
		/* 基础库 - 过滤word粘贴过来的字符串方法 */
		'./umeditor-1.2.3/_src/core/filterword.js',
		/* 基础库 - 节点类方法 */
		'./umeditor-1.2.3/_src/core/node.js',
		/* 基础库 - html代码加工处理方法 */
		'./umeditor-1.2.3/_src/core/htmlparser.js',
		/* 基础库 - 根据给定规则过滤节点 */
		'./umeditor-1.2.3/_src/core/filternode.js',
		/* 插件 - 各种功能模块 */
		'./umeditor-1.2.3/_src/plugins/inserthtml.js',
		'./umeditor-1.2.3/_src/plugins/image.js',
		'./umeditor-1.2.3/_src/plugins/justify.js',
		'./umeditor-1.2.3/_src/plugins/font.js',
		'./umeditor-1.2.3/_src/plugins/link.js',
		'./umeditor-1.2.3/_src/plugins/print.js',
		'./umeditor-1.2.3/_src/plugins/paragraph.js',
		'./umeditor-1.2.3/_src/plugins/horizontal.js',
		'./umeditor-1.2.3/_src/plugins/cleardoc.js',
		'./umeditor-1.2.3/_src/plugins/undo.js',
		'./umeditor-1.2.3/_src/plugins/paste.js',
		'./umeditor-1.2.3/_src/plugins/list.js',
		'./umeditor-1.2.3/_src/plugins/source.js',
		'./umeditor-1.2.3/_src/plugins/enterkey.js',
		'./umeditor-1.2.3/_src/plugins/preview.js',
		'./umeditor-1.2.3/_src/plugins/basestyle.js',
		'./umeditor-1.2.3/_src/plugins/video.js',
		'./umeditor-1.2.3/_src/plugins/selectall.js',
		'./umeditor-1.2.3/_src/plugins/removeformat.js',
		'./umeditor-1.2.3/_src/plugins/keystrokes.js',
		'./umeditor-1.2.3/_src/plugins/autosave.js',
		'./umeditor-1.2.3/_src/plugins/autoupload.js',
		'./umeditor-1.2.3/_src/plugins/formula.js',
		'./umeditor-1.2.3/_src/plugins/xssFilter.js',
		
		'./umeditor-1.2.3/_src/ui/widget.js',
		'./umeditor-1.2.3/_src/ui/button.js',
		'./umeditor-1.2.3/_src/ui/toolbar.js',
		'./umeditor-1.2.3/_src/ui/menu.js',
		'./umeditor-1.2.3/_src/ui/dropmenu.js',
		'./umeditor-1.2.3/_src/ui/splitbutton.js',
		'./umeditor-1.2.3/_src/ui/colorsplitbutton.js',
		'./umeditor-1.2.3/_src/ui/popup.js',
		'./umeditor-1.2.3/_src/ui/scale.js',
		'./umeditor-1.2.3/_src/ui/colorpicker.js',
		'./umeditor-1.2.3/_src/ui/combobox.js',
		'./umeditor-1.2.3/_src/ui/buttoncombobox.js',
		'./umeditor-1.2.3/_src/ui/modal.js',
		'./umeditor-1.2.3/_src/ui/tooltip.js',
		'./umeditor-1.2.3/_src/ui/tab.js',
		'./umeditor-1.2.3/_src/ui/separator.js',
		'./umeditor-1.2.3/_src/ui/scale.js',
		
		'./umeditor-1.2.3/_src/adapter/adapter.js',
		'./umeditor-1.2.3/_src/adapter/button.js',
		'./umeditor-1.2.3/_src/adapter/fullscreen.js',
		'./umeditor-1.2.3/_src/adapter/dialog.js',
		'./umeditor-1.2.3/_src/adapter/popup.js',
		'./umeditor-1.2.3/_src/adapter/imagescale.js',
		'./umeditor-1.2.3/_src/adapter/autofloat.js',
		'./umeditor-1.2.3/_src/adapter/source.js',
		'./umeditor-1.2.3/_src/adapter/combobox.js',
		/* 添加语言解析 */
		'./umeditor-1.2.3/lang/zh-cn/zh-cn.js'
	];
	for (var i=0,pi;pi = paths[i++];) {
		document.write('<script type="text/javascript" src="'+ pi +'?V=1.0"></script>');
	}
})();
