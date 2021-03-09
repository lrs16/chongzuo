import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Upload, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

function SysUpload(props) {
  const { dispatch, fileslist, ChangeFileslist } = props;
  const [uploadfiles, setUploadFiles] = useState([]);

  useEffect(() => {
    if (fileslist.length > 0) {
      setUploadFiles(fileslist);
    }
  }, []);

  // 上传文件类型
  // const filestype = `application/msword,application/vnd.ms-excel,application / vnd.openxmlformats - officedocument.spreadsheetml.sheet,image/png,image/jpeg, `;

  // 下载附件
  const handledownload = info => {
    dispatch({
      type: 'sysfile/downloadfile',
      payload: {
        id: info.uid,
      },
    }).then(res => {
      // console.log(res);
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
    // action: { FileUpload },
    action: '/sys/file/upload',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    // multiple: true,
    // baccept: '.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,',
    showUploadList: { showDownloadIcon: true },
    defaultFileList: fileslist,
    onChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          message.success(`${info.file.name} 上传成功`);
          const voice = {};
          voice.uid = info.file.response.data.id;
          voice.name = info.file.response.data.fileName;
          voice.nowtime = info.file.response.data.createTime;
          voice.status = 'done';
          voice.fileUrl = '';
          uploadfiles.push(voice);
          ChangeFileslist({ arr: uploadfiles, ischange: true });
        }
        if (info.file.response.code === -1) {
          message.error(`${info.file.name} 上传失败`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
      }
    },
    onPreview(info) {
      handledownload(info);
    },
    onDownload(info) {
      handledownload(info);
    },
    onRemove(info) {
      // 删除记录,更新父级fileslist
      const newfilelist = fileslist.filter(item => item.uid !== info.uid);
      ChangeFileslist({ arr: newfilelist, ischange: true });
      // 删除文件
      dispatch({
        type: 'sysfile/deletefile',
        payload: {
          id: info.uid,
        },
      });
    },
  };

  return (
    <>
      <Upload {...uploadprops}>
        <Button type="primary">
          <DownloadOutlined /> 上传附件
        </Button>
      </Upload>
    </>
  );
}

export default connect(({ sysfile, loading }) => ({
  sysfile,
  loading: loading.models.sysfile,
}))(SysUpload);
