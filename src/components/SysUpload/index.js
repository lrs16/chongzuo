import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Upload, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { getFileSecuritySuffix } from '@/services/upload';

function SysUpload(props) {
  const { dispatch, fileslist, ChangeFileslist } = props;
  const [uploadfiles, setUploadFiles] = useState([]);
  const [filetype, setFileType] = useState('');

  useEffect(() => {
    if (fileslist.length > 0) {
      setUploadFiles(fileslist);
    }
  }, []);

  // 不允许上传类型
  useEffect(() => {
    getFileSecuritySuffix().then(res => {
      if (res.code === 200) {
        const arr = [...res.data];
        setFileType(arr);
      }
    });
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
    action: '/sys/file/upload',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
    },
    showUploadList: { showDownloadIcon: true },
    defaultFileList: fileslist,
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
        message.success(`文件上传成功`);
        const arr = [...fileList];
        const newarr = [];
        for (let i = 0; i < arr.length; i += 1) {
          const vote = {};
          vote.uid =
            arr[i]?.response?.data[0]?.id !== undefined
              ? arr[i]?.response?.data[0]?.id
              : arr[i].uid;
          vote.name = arr[i].name;
          vote.nowtime =
            arr[i]?.response?.data[0]?.createTime !== undefined
              ? arr[i]?.response?.data[0]?.createTime
              : arr[i].createTime;
          vote.fileUrl = '';
          vote.status = arr[i].status;
          newarr.push(vote);
        }
        setUploadFiles([...newarr]);
        //  ChangeFileslist({ arr: newarr, ischange: true });
      }
    },
    onPreview(file) {
      handledownload(file);
    },
    onDownload(file) {
      handledownload(file);
    },
    onRemove(file) {
      // 删除记录,更新父级fileslist
      const newfilelist = fileslist.filter(item => item.uid !== file.uid);
      ChangeFileslist({ arr: newfilelist, ischange: true });
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
