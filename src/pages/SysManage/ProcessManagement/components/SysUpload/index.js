import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Upload, Button, message } from 'antd';
import { getFileSecuritySuffix } from '@/services/upload';

function SysUpload(props) {
  // const { fileslist, ChangeFileslist } = props;
  const [filetype, setFileType] = useState('');
  const [show, setShow] = useState(true);
  // 不允许上传类型
  useEffect(() => {
    getFileSecuritySuffix().then(res => {
      if (res.code === 200) {
        const arr = [...res.data];
        setFileType(arr);
      }
    });
  }, []);

  const uploadprops = {
    name: 'file',
    action: '/activiti/definition/upload',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    showUploadList: { showDownloadIcon: true },
    //  defaultFileList: fileslist,
    multiple: false,

    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const type = file.name.lastIndexOf('.');
        const filesuffix = file.name.substring(type + 1, file.name.length);
        const correctfiletype = filetype.indexOf(filesuffix);
        if (correctfiletype === -1) {
          message.error(`${file.name}文件不符合上传规则,禁止上传...`);
          return reject();
        }
        return resolve(file);
      });
    },
    // ChangeFileslist({ arr: uploadfiles, ischange: true });
    onChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          message.success(`${info.file.name} 上传成功`);
          setShow(false);
        }
        if (info.file.response.code === -1) {
          message.error(`${info.file.name} 上传失败`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    },

  };

  return (
    <>
      <Upload {...uploadprops}>
        <Button type="primary">
          部署流程图
        </Button>
        {
          show === true && (
            <p className="ant-upload-hint" style={{ color: 'red' }}>
              查看流程图模糊时,可选择.bpmn和.png一同打成zip包部署
            </p>
          )
        }
      </Upload>
    </>
  );
}

export default SysUpload;
