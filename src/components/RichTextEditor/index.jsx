import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import E from 'wangeditor';

function Editor(props) {
  const [content, setContent] = useState('');
  let editor = null;

  useEffect(() => {
    editor = new E('#div1');

    editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 上传图片大小2M
    //  editor.config.uploadImgServer = `/sys/file/upload`;  // 路径
    // 限制一次最多上传 1 张图片
    editor.config.uploadImgMaxLength = 1;
    editor.config.customUploadImg = function (files, insert) {
      // files 是 input 中选中的文件列表
      console.log(files);
      if (files[0]) {
        const blob = new Blob([files[0]]);
        const image = (window.URL || window.webkitURL).createObjectURL(blob);
        insert(image);
        // const formData = new window.FormData();
        // formData.append('file', files[0], 'cover.jpg');
        // fetch(`/sys/file/upload`, {
        //   method: 'POST',
        //   body: formData,
        //   headers: {
        //     Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        //   },
        // }).then((res) => {
        //   if (res.code === 200) {
        //     const { data } = res;
        //     if (data) {
        //       // 上传代码返回结果之后，将图片插入到编辑器中
        //       insert(data.resourceUrl);
        //     } else {
        //       console.log('111');
        //     }
        //   }
        // });
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
      'redo' // 重复
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

    return () => {
      // 组件销毁时销毁编辑器  注：class写法需要在componentWillUnmount中调用
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
    <div id="div1" />
  );
}

export default Editor;