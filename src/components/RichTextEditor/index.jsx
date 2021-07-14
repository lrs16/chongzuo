import React, { useEffect, useState, forwardRef, useContext } from 'react';
import { message } from 'antd';
import EditContext from '@/layouts/MenuContext';
import E from 'wangeditor';

function Editor(props, ref) {
  const { ChangeValue, cachevalue } = props;
  const [content, setContent] = useState(undefined);
  const { editable } = useContext(EditContext);
  let editor = null;
  useEffect(() => {
    editor = new E('#div1');
    editor.config.onchange = function (html) {
      ChangeValue(html)
    };

    editor.config.showLinkImg = false;           // 隐藏网络图片
    editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 上传图片大小2M
    //  editor.config.uploadImgServer = `/sys/file/upload`;  // 路径
    // 限制一次最多上传 1 张图片
    editor.config.uploadImgMaxLength = 1;
    editor.config.customUploadImg = function (files, insert) {
      if (files[0]) {
        const formData = new window.FormData();
        formData.append('file', files[0], files[0].name);
        fetch('/sys/file/upload', {
          method: 'POST',
          body: formData,
        }).then(response => response.json())
          .then((data) => {
            if (data.code === 200) {
              const arr = data.data[0].fileUrl?.split('/');
              const imgsrc = `/image/${arr[arr.length - 2]}/${arr[arr.length - 1]}`;
              insert(imgsrc)
            } else {
              message.error('上传失败，请重新上传')
            }
          });
      } else {
        message.info('请选择要上传的图片');
      }
    };
    editor.config.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      // 'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo', // 重复
      ''
    ];
    editor.config.lang = {
      设置标题: 'Title',
      字号: 'Size',
      文字颜色: 'Color',
      设置列表: 'List',
      有序列表: '',
      无序列表: '',
      对齐方式: 'Align',
      靠左: '',
      居中: '',
      靠右: '',
      正文: 'p',
      链接文字: 'link text',
      链接: 'link',
      上传图片: 'Upload',
      网络图片: 'Web',
      图片link: 'image url',
      插入视频: 'Video',
      格式如: 'format',
      上传: 'Upload',
      创建: 'init'
    };
    /** 一定要创建 */
    editor.create();
    editor.$textElem.attr('contenteditable', editable);
    return () => {
      // 组件销毁时销毁编辑器
      editor.destroy();
    };
  }, []);
  useEffect(() => {
    getHtml();
  }, [content]);
  // 获取html方法1
  function getHtml() {
    editor.txt.html(content);
  }

  return (
    <div id="div1" ref={ref} />
  );
}

export default forwardRef(Editor);