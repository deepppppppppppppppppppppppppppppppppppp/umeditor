(function() {

    var utils = UM.utils,
        browser = UM.browser,
        Base = {
            checkURL: function(url) {
                if (!url) return false;
                url = utils.trim(url);
                if (url.length <= 0) {
                    return false;
                }
                if (url.search(/http:\/\/|https:\/\//) !== 0) {
                    url += 'http://';
                }

                url = url.replace(/\?[\s\S]*$/, "");

                if (!/(.gif|.jpg|.jpeg|.png)$/i.test(url)) {
                    return false;
                }
                console.log(url)
                return url;
            },
            getAllPic: function(sel, $w, editor) {
                var me = this,
                    arr = [],
                    $imgs = $(sel, $w);

                $.each($imgs, function(index, node) {
                    $(node).removeAttr("width").removeAttr("height");

                    //                if (node.width > editor.options.initialFrameWidth) {
                    //                    me.scale(node, editor.options.initialFrameWidth -
                    //                        parseInt($(editor.body).css("padding-left"))  -
                    //                        parseInt($(editor.body).css("padding-right")));
                    //                }
                    return arr.push({
                        src: node.src,
                        width: node.width,
                        height: node.height
                    });
                });

                return arr;
            },
            scale: function(img, max, oWidth, oHeight) {
                console.log(img)
                var width = 0,
                    height = 0,
                    percent, ow = img.width || oWidth,
                    oh = img.height || oHeight;
                if (ow > max || oh > max) {
                    if (ow >= oh) {
                        if (width = ow - max) {
                            percent = (width / ow).toFixed(2);
                            img.height = oh - oh * percent;
                            img.width = max;
                        }
                    } else {
                        if (height = oh - max) {
                            percent = (height / oh).toFixed(2);
                            img.width = ow - ow * percent;
                            img.height = max;
                        }
                    }
                }
                console.log(this)
                return this;
            },
            close: function($img) {

                $img.css({
                    top: ($img.parent().height() - $img.height()) / 2,
                    left: ($img.parent().width() - $img.width()) / 2
                }).prev().on("click", function() {

                    if ($(this).parent().remove().hasClass("edui-image-upload-item")) {
                        //显示图片计数-1
                        Upload.showCount--;
                        Upload.updateView();
                    }

                });

                return this;
            },
            createImgBase64: function(img, file, $w) {
                if (browser.webkit) {
                    //Chrome8+
                    img.src = window.webkitURL.createObjectURL(file);
                } else if (browser.gecko) {
                    //FF4+
                    img.src = window.URL.createObjectURL(file);
                } else {
                    //实例化file reader对象
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        img.src = this.result;
                        $w.append(img);
                    };
                    reader.readAsDataURL(file);
                }
            },
            callback: function(editor, $w, url, state) {
                if (state == "SUCCESS") {
                    //显示图片计数+1
                    Upload.showCount++;
                    var $img = $("<img src='" + editor.options.imagePath + url + "' class='edui-image-pic' />"),
                        $item = $("<div class='edui-image-item edui-image-upload-item'><div class='edui-image-close'></div></div>").append($img);

                    if ($(".edui-image-upload2", $w).length < 1) {
                        $(".edui-image-content", $w).append($item);

                        Upload.render(".edui-image-content", 2)
                            .config(".edui-image-upload2");
                    } else {
                        $(".edui-image-upload2", $w).before($item).show();
                    }

                    $img.on("load", function() {
                        Base.scale(this, 120);
                        Base.close($(this));
                        $(".edui-image-content", $w).focus();
                    });

                } else {
                    currentDialog.showTip(state);
                    window.setTimeout(function() {

                        currentDialog.hideTip();

                    }, 3000);
                }

                Upload.toggleMask();

            }
        };

    /*
     * 本地上传 
     * */
    var Upload = {
        showCount: 0,
        uploadTpl: '<div class="edui-image-upload%%">' +
            '<span class="edui-image-icon"></span>' +
            '<form class="edui-image-form" method="post" enctype="multipart/form-data" target="up">' +
            '<input style=\"filter: alpha(opacity=0);\" class="edui-image-file" type="file" hidefocus name="upfile" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp"/>' +
            '</form>' +

            '</div>',
        init: function(editor, $w) {
            var me = this;

            me.editor = editor;
            me.dialog = $w;
            me.render(".edui-image-local", 1);
            me.config(".edui-image-upload1");
            me.submit();
            me.drag();

            $(".edui-image-upload1").hover(function() {
                $(".edui-image-icon", this).toggleClass("hover");
            });

            if (!(UM.browser.ie && UM.browser.version <= 9)) {
                $(".edui-image-dragTip", me.dialog).css("display", "block");
            }


            return me;
        },
        render: function(sel, t) {
            var me = this;

            $(sel, me.dialog).append($(me.uploadTpl.replace(/%%/g, t)));

            return me;
        },
        config: function(sel) {
            var me = this,
                url = me.editor.options.imageUrl;

            url = url + (url.indexOf("?") == -1 ? "?" : "&") + "editorid=" + me.editor.id; //初始form提交地址;

            $("form", $(sel, me.dialog)).attr("action", url);

            return me;
        },
        uploadComplete: function(r) {
            var me = this;
            try {
                var json = eval('(' + r + ')');
                Base.callback(me.editor, me.dialog, json.url, json.state);
            } catch (e) {
                var lang = me.editor.getLang('image');
                Base.callback(me.editor, me.dialog, '', (lang && lang.uploadError) || 'Error!');
            }
        },
        submit: function(callback) {
            var me = this,
                input = $('<input style="filter: alpha(opacity=0);" class="edui-image-file" type="file" hidefocus="" name="upfile" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp">'),
                input = input[0];

            $(me.dialog).off('change.sss').on("change.sss", ".edui-image-file", function(e) {

                // if ( !this.parentNode ) {
                //     return;
                // }

                // $('<iframe name="up"  style="display: none"></iframe>').insertBefore(me.dialog).on('load', function(){
                //     var r = this.contentWindow.document.body.innerHTML;
                //     if(r == '')return;
                //     me.uploadComplete(r);
                //     $(this).unbind('load');
                //     $(this).remove();

                // });

                // $(this).parent()[0].submit();
                // Upload.updateInput( input );
                // me.toggleMask("Loading....");
                // callback && callback();

                /**
                 * 更改为图片上传方式
                 * @auth: zyx
                 */
                //获取文件列表
                var fileList = e.originalEvent.target.files;
                var img = document.createElement('img');
                $.each(fileList, function(i, f) {
                    if (/^image/.test(f.type)) {

                        var xhr = new XMLHttpRequest();
                        xhr.open("post", 'http://123.103.86.52:11145/pand/file/upload', true);
                        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                        //模拟数据
                        var fd = new FormData();
                        fd.append('file', f);

                        xhr.send(fd);
                        xhr.addEventListener('load', function(e) {
                            var r = JSON.parse(e.target.response),
                                json;

                            console.log(r)
                            if (r.code == "1000000") {
                                //显示图片计数+1
                                Upload.showCount++;

                                var img = new Image(),
                                    url = '';
                                img.src = r.data.url;
                                img.onload = function() {
                                    console.log(this.width)
                                    console.log(this.height)
                                    var w = this.width > this.height ? this.width : this.height;
                                    w = w > 1200 ? 1200 : w;
                                    url = img.src + (!/\.gif/gi.test(img.src) ? ('?imageView2/0/w/' + w + '/format/jpg') : '?imageMogr2/size-limit/300k');


                                    var $img = $("<img src='" + url + "'class='edui-image-pic' />"),
                                        $item = $("<div class='edui-image-item edui-image-upload-item'><div class='edui-image-close'></div></div>").append($img);

                                    //$img.css({ width: this.width, height: this.height });
                                    $img.attr("width", this.width).attr("height", this.height)

                                    if ($(".edui-image-upload2", me.dialog).length < 1) {
                                        $(".edui-image-content", me.dialog).append($item);

                                        Upload.render(".edui-image-content", 2)
                                            .config(".edui-image-upload2");
                                    } else {
                                        $(".edui-image-upload2", me.dialog).before($item).show();
                                    }

                                    $img.on("load", function() {
                                        Base.scale(this, 120);
                                        Base.close($(this));
                                        $(".edui-image-content", me.dialog).focus();
                                    });
                                }


                            } else {
                                currentDialog.showTip(r.errorCode);
                                window.setTimeout(function() {

                                    currentDialog.hideTip();

                                }, 3000);
                            }

                            Upload.toggleMask();
                            if (i == fileList.length - 1) {
                                $(img).remove()
                            }
                        });

                    }
                });

            });

            return me;
        },
        //更新input
        updateInput: function(inputField) {

            $(".edui-image-file", this.dialog).each(function(index, ele) {

                ele.parentNode.replaceChild(inputField.cloneNode(true), ele);

            });

        },
        //更新上传框
        updateView: function() {

            if (Upload.showCount !== 0) {
                return;
            }

            $(".edui-image-upload2", this.dialog).hide();
            $(".edui-image-dragTip", this.dialog).show();
            $(".edui-image-upload1", this.dialog).show();

        },
        drag: function() {
            var me = this;
            //做拽上传的支持
            if (!UM.browser.ie9below) {
                me.dialog.find('.edui-image-content').on('drop', function(e) {

                    //获取文件列表
                    var fileList = e.originalEvent.dataTransfer.files;
                    var img = document.createElement('img');
                    var hasImg = false;
                    $.each(fileList, function(i, f) {
                        if (/^image/.test(f.type)) {
                            //创建图片的base64
                            Base.createImgBase64(img, f, me.dialog);

                            var xhr = new XMLHttpRequest();
                            xhr.open("post", me.editor.getOpt('imageUrl') + "?type=ajax", true);
                            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                            //模拟数据
                            var fd = new FormData();
                            fd.append(me.editor.getOpt('imageFieldName'), f);

                            xhr.send(fd);
                            xhr.addEventListener('load', function(e) {
                                var r = e.target.response,
                                    json;
                                me.uploadComplete(r);
                                if (i == fileList.length - 1) {
                                    $(img).remove()
                                }
                            });
                            hasImg = true;
                        }
                    });
                    if (hasImg) {
                        e.preventDefault();
                        me.toggleMask("Loading....");
                    }

                }).on('dragover', function(e) {
                    e.preventDefault();
                });
            }
        },
        toggleMask: function(html) {
            var me = this;

            var $mask = $(".edui-image-mask", me.dialog);
            if (html) {
                if (!(UM.browser.ie && UM.browser.version <= 9)) {
                    $(".edui-image-dragTip", me.dialog).css("display", "none");
                }
                $(".edui-image-upload1", me.dialog).css("display", "none");
                $mask.addClass("edui-active").html(html);
            } else {

                $mask.removeClass("edui-active").html();

                if (Upload.showCount > 0) {
                    return me;
                }

                if (!(UM.browser.ie && UM.browser.version <= 9)) {
                    $(".edui-image-dragTip", me.dialog).css("display", "block");
                }
                $(".edui-image-upload1", me.dialog).css("display", "block");
            }

            return me;
        }
    };

    /*
     * 网络图片
     * */
    var NetWork = {
        init: function(editor, $w) {
            var me = this;

            me.editor = editor;
            me.dialog = $w;

            me.initEvt();
        },
        initEvt: function() {
            var me = this,
                url,
                $ele = $(".edui-image-searchTxt", me.dialog);

            $(".edui-image-searchAdd", me.dialog).on("click", function() {
                    url = Base.checkURL($ele.val());

                    if (url) {

                        $("<img src='" + url + "' class='edui-image-pic' />").on("load", function() {



                            var $item = $("<div class='edui-image-item'><div class='edui-image-close'></div></div>").append(this);

                            $(".edui-image-searchRes", me.dialog).append($item);

                            Base.scale(this, 120);

                            $item.width($(this).width());

                            Base.close($(this));

                            $ele.val("");
                        });
                    }
                })
                .hover(function() {
                    $(this).toggleClass("hover");
                });
        }
    };

    /*
     * 图片大小设置 
     */
    var setSize = {
        init: function(editor, $w) {
            var me = this;

            me.editor = editor;
            me.dialog = $w;

            // 判断是否为图片
            var dom = editor.selection.getStart();
            me.initEvt(dom);
        },
        initEvt: function(dom) {
            if (/img/gi.test(dom && dom.tagName || '')) {
                $('#width').val(dom.width);
                $('#height').val(dom.height);
            }
            var w = dom.width || 0;
            var h = dom.height || 0;
            $('#width').off("input propertychange").on("input propertychange", function() {
                if ($('#lock').is(':checked')) {
                    $(dom).css('width', $(this).val());
                    $(dom).css('height', parseInt($(this).val() * h / w));
                    $('#height').val(parseInt($(this).val() * h / w));
                } else {
                    $(dom).css('width', $(this).val());
                    $(dom).css('height', h);
                }
            });
            $('#height').off("input propertychange").on("input propertychange", function() {
                if ($('#lock').is(':checked')) {
                    $(dom).css('height', $(this).val());
                    $(dom).css('width', parseInt($(this).val() * w / h));
                    $('#width').val(parseInt($(this).val() * w / h));
                } else {
                    $(dom).css('height', $(this).val());
                    $(dom).css('width', w);
                }
            });

        }
    }

    var $tab = null,
        currentDialog = null;

    UM.registerWidget('image', {
        tpl: "<link rel=\"stylesheet\" type=\"text/css\" href=\"<%=image_url%>image.css\">" +
            "<div class=\"edui-image-wrapper\">" +
            "<ul class=\"edui-tab-nav\">" +
            "<li class=\"edui-tab-item edui-active\"><a data-context=\".edui-image-local\" class=\"edui-tab-text\"><%=lang_tab_local%></a></li>" +
            // "<li  class=\"edui-tab-item\"><a data-context=\".edui-image-JimgSearch\" class=\"edui-tab-text\"><%=lang_tab_imgSearch%></a></li>" +
            "<li  class=\"edui-tab-item\"><a data-context=\".edui-image-setSize\" class=\"edui-tab-text\"><%=lang_tab_setSize%></a></li>" +
            "</ul>" +
            "<div class=\"edui-tab-content\">" +

            "<div class=\"edui-image-local edui-tab-pane edui-active\">" +
            "<div class=\"edui-image-content\"></div>" +
            "<div class=\"edui-image-mask\"></div>" +
            "</div>" +

            "<div class=\"edui-image-JimgSearch edui-tab-pane\">" +
            "<div class=\"edui-image-searchBar\">" +
            "<table><tr><td><input class=\"edui-image-searchTxt\" type=\"text\"></td>" +
            "<td><div class=\"edui-image-searchAdd\"><%=lang_btn_add%></div></td></tr></table>" +
            "</div>" +
            "<div class=\"edui-image-searchRes\"></div>" +
            "</div>" +

            "<div class=\"edui-image-setSize edui-tab-pane\">" +
            '<div class="container"><div class="row">' +
            '<label>大 小：</label>' +
            '<div class="input-group"><span style="display:table-cell;padding-right:10px;">宽度</span><input class="form-control" type="text" id="width" style="margin:15px 0;"><span style="display:table-cell;padding:0 10px;">px</span></div>' +
            '<div class="input-group"><span style="display:table-cell;padding-right:10px;">高度</span><input class="form-control" type="text" id="height" style="margin:15px 0;"><span style="display:table-cell;padding:0 10px;">px</span></div>' +
            '<div class="input-group"><label class="checkbox"><input id="lock" type="checkbox" checked="checked" style="-webkit-appearance: checkbox;">锁定宽高比例</label>' +
            '</div>' +
            "</div></div>" +

            "</div>" +
            "</div>",
        initContent: function(editor, $dialog) {
            var lang = editor.getLang('image')["static"],
                opt = $.extend({}, lang, {
                    image_url: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + 'dialogs/image/'
                });

            Upload.showCount = 0;

            if (lang) {
                var html = $.parseTmpl(this.tpl, opt);
            }

            currentDialog = $dialog.edui();

            this.root().html(html);

        },
        initEvent: function(editor, $w) {
            $tab = $.eduitab({ selector: ".edui-image-wrapper" })
                .edui().on("beforeshow", function(e) {
                    e.stopPropagation();
                });

            Upload.init(editor, $w);

            NetWork.init(editor, $w);

            setSize.init(editor, $w);
        },
        buttons: {
            'ok': {
                exec: function(editor, $w) {
                    var sel = "",
                        index = $tab.activate();

                    if (index == 0) {
                        sel = ".edui-image-content .edui-image-pic";
                    } else if (index == 1) {
                        sel = ".edui-image-searchRes .edui-image-pic";
                    }

                    var list = Base.getAllPic(sel, $w, editor);

                    if (index != -1) {
                        editor.execCommand('insertimage', list);
                    }
                }
            },
            'cancel': {}
        },
        width: 500,
        height: 220
    }, function(editor, $w, url, state) {
        Base.callback(editor, $w, url, state)
    })
})();