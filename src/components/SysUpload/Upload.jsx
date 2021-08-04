import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'dva';
import { Upload, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { getFileSecuritySuffix } from '@/services/upload';
import UploadContext from '@/layouts/MenuContext';

function SysUpload(props) {
  const { dispatch, filelist } = props;
  const [filetype, setFileType] = useState('');
  const { files, ChangeFiles } = useContext(UploadContext);

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
        id: info.response ? info.response.data[0].id : info.uid,
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
    defaultFileList: filelist || files,
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
        ChangeFiles(newarr)
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
      const newfilelist = (filelist || files).filter(item => file.response ? item.uid !== file.response.data[0].id : item.uid !== file.uid);
      ChangeFiles(newfilelist);
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
