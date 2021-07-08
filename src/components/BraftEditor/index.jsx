import React, { useState } from 'react';
import { Button, Divider, Upload, message } from 'antd';
import { EyeOutlined, FileImageOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import Table from 'braft-extensions/dist/table';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';

const options = {
  defaultColumns: 5, // 默认列数
  defaultRows: 5, // 默认行数
  withDropdown: true, // 插入表格前是否弹出下拉菜单
  columnResizable: true, // 是否允许拖动调整列宽，默认false
  exportAttrString: '', // 指定输出HTML时附加到table标签上的属性字符串
  // includeEditors: ['id-1'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // excludeEditors: ['id-2']  // 指定该模块对哪些BraftEditor无效
};
const Editor = () => {
  const [content, setContent] = useState(BraftEditor.createEditorState(null));
  const [outputHTML, setOutputHTML] = useState(null);
  BraftEditor.use(Table(options));

  const handleChange = (v) => {
    setContent(v);
    setOutputHTML(v.toHTML())
  };

  const uploadprops = {
    name: 'file',
    action: '/sys/file/upload',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          setContent(ContentUtils.insertMedias(content, [{
            type: 'IMAGE',
            // url: URL.createObjectURL
            // url: `${window.location.host}${info.file.response.data[0].filePath}/${info.file.response.data[0].fileName}`
            url: `${info.file.response.data[0].fileUrl}`
          }]));
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    },
  };

  const uploadHandler = (param) => {
    if (!param.file) {
      return false
    }
    setContent(ContentUtils.insertMedias(content, [{
      type: 'IMAGE',
      url: URL.createObjectURL(param.file)
      // url: 'http://wx2.sinaimg.cn/large/705793b8gy1g503pv9yazj20jy0imgmf.jpg'
    }]));
  };

  const preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close()
    }

    window.previewWindow = window.open();
    window.previewWindow.document.write(buildPreviewHtml());
    window.previewWindow.document.close()
  };

  const buildPreviewHtml = () => {
    return `
              <!Doctype html>
              <html lang="">
                <head>
                  <title>Preview Content</title>
                  <style>
                    html,body{
                      height: 100%;
                      margin: 0;
                      padding: 0;
                      overflow: auto;
                      background-color: #f1f2f3;
                    }
                    .container{
                      box-sizing: border-box;
                      width: 1000px;
                      max-width: 100%;
                      min-height: 100%;
                      margin: 0 auto;
                      padding: 30px 20px;
                      overflow: hidden;
                      background-color: #fff;
                      border-right: solid 1px #eee;
                      border-left: solid 1px #eee;
                    }
                    .container img,
                    .container audio,
                    .container video{
                      max-width: 100%;
                      height: auto;
                    }
                    .container p{
                      white-space: pre-wrap;
                      min-height: 1em;
                    }
                    .container pre{
                      padding: 15px;
                      background-color: #f1f1f1;
                      border-radius: 5px;
                    }
                    .container blockquote{
                      margin: 0;
                      padding: 15px;
                      background-color: #f1f1f1;
                      border-left: 3px solid #d1d1d1;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">${content.toHTML()}</div>
                </body>
              </html>
        `;
  };

  const extendControls = [
    {
      key: 'custom-button',
      type: 'component',
      component: (
        <Button
          className="control-item button upload-button"
          data-title="内容预览"
          onClick={preview}
        >
          <EyeOutlined />
        </Button>
      ),
    },
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload
          accept="image/*"
          showUploadList={false}
          customRequest={uploadHandler}
        // {...uploadprops}
        >
          <Button
            className="control-item button upload-button"
            data-title="插入图片"
          >
            <FileImageOutlined />
          </Button>
        </Upload>
      )
    }
  ];

  return (
    <>
      <div>
        <div className="editor-wrapper">
          <BraftEditor
            value={content}
            onChange={handleChange}
            extendControls={extendControls}
          />
        </div>
        <Divider />
        <div>
          <h4>源码：</h4>
          <div
            className="output-content"
          >
            {outputHTML}
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
