import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Upload, Button, message } from 'antd';
import { getFileSecuritySuffix } from '@/services/upload';

function SysLeadinCabinet(props) {
  const { dispatch,  ChangeFileslist } = props;
  const [filetype, setFileType] = useState('');


  // 不允许上传类型
  useEffect(() => {
    getFileSecuritySuffix().then(res => {
      if (res.code === 200) {
        const arr = [...res.data];
        setFileType(arr);
      }
    });
  }, []);

  // 下载附件
  const handledownload = info => {
    dispatch({
      type: 'sysfile/downloadfile',
      payload: {
        id: info.uid,
      },
    }).then(res => {
      const filename = info.name;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const uploadprops = {
    name: 'file',
    action: '/assets/cabinet/upload',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    // showUploadList: { showDownloadIcon: true },
    // defaultFileList: fileslist,
    multiple: true,

    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const type = file.name.lastIndexOf('.');
        const filesuffix = file.name.substring(type + 1, file.name.length);
        const correctfiletype = filetype.indexOf(filesuffix);
        if (correctfiletype !== -1) {
          message.error(`${file.name}文件上传失败，不可上传${filetype.join('/')}类型文件！`);
          return reject();
        }
        return resolve(file);
      });
    },
    onChange({ file, fileList }) {
      const alldone = fileList.map(item => item.status !== 'done');
      if (file.status === 'done' && alldone.indexOf(true) === -1) {
        if(file.response.code === 200) {
          message.success(`导入数据成功`);
        } else {
          message.error(`文件格式不正确，请按照文件下载模板上传`);
        }
  
        const newarr = [];
        ChangeFileslist({ arr: newarr, ischange: true });
      }
    },
    onPreview(file) {
      handledownload(file);
    },
    onDownload(file) {
      handledownload(file);
    },
    onRemove(file) {
      // 删除文件
      dispatch({
        type: 'sysfile/deletefile',
        payload: {
          id: file.uid,
        },
      });
    },
  };

  return (
    <>
      <Upload {...uploadprops}>
        <Button type='primary' style={{ marginRight: 8 }}>
          导入
        </Button>
      </Upload>
    </>
  );
}

export default connect(({ sysfile, loading }) => ({
  sysfile,
  loading: loading.models.sysfile,
}))(SysLeadinCabinet);
