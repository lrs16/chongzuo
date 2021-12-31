import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'dva';
import { Upload, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { getFileSecuritySuffix } from '@/services/upload';
import UploadContext from '@/layouts/MenuContext';

function SysUpload(props) {
  const { dispatch, fileslist, ChangeFileslist, banOpenFileDialog, remark } = props;
  // const [uploadfiles, setUploadFiles] = useState([]);
  const [filetype, setFileType] = useState('');
  const [showIcon, setShowIcon] = useState(true);
  const { getUploadStatus } = useContext(UploadContext);

  const sendUploadStatus = (v) => {
    dispatch({
      type: 'viewcache/getolduploadstatus',
      payload: {
        olduploadstatus: v
      }
    })
  };

  useEffect(() => {
    sendUploadStatus(false);
    // let doCancel = false;
    // if (fileslist && fileslist.length && fileslist.length > 0 && !doCancel) {
    //   setUploadFiles(fileslist);
    // }
    return () => {
      // doCancel = true;
      sendUploadStatus(false);
    };
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
    showUploadList: { showDownloadIcon: showIcon, showRemoveIcon: showIcon },
    defaultFileList: fileslist,
    multiple: true,
    openFileDialogOnClick: !banOpenFileDialog,

    beforeUpload(file, fileList) {
      return new Promise((resolve, reject) => {
        setShowIcon(false);
        if (getUploadStatus) { getUploadStatus(true) };
        sendUploadStatus(true)
        const type = file.name.lastIndexOf('.');
        const filesuffix = file.name.substring(type + 1, file.name.length);
        const correctfiletype = filetype.indexOf(filesuffix);
        if ((!fileslist && fileList.length > 20) || (fileslist && (fileslist.length + fileList.length) > 20)) {
          if (getUploadStatus) { getUploadStatus(false) };
          sendUploadStatus(false);
          message.error(`最多可上传20个文件`);
          setShowIcon(true);
          return reject();
        } if (type > 100) {
          message.error('附件名过长，附件名称最长100个字符');
          if (getUploadStatus) { getUploadStatus(false) };
          sendUploadStatus(false);
          return reject();
        } if (correctfiletype === -1) {
          message.error(`${file.name}文件不符合上传规则,禁止上传...`);
          return reject();
        }
        return resolve(file);
      });
    },
    onChange({ file, fileList }) {
      const allsuccess = fileList.map(item => item.response && item.response.fileUploadInfo && item.response.fileUploadInfo.length > 0);
      const alldone = fileList.map(item => item.status !== 'done');
      if (file.status === 'done' && alldone.indexOf(true) === -1 && file.response && file.response.code === 200 && allsuccess.indexOf(true) === -1) {
        message.success(`文件上传成功`);
        const arr = [...fileList];
        const newarr = [];
        for (let i = 0; i < arr.length; i += 1) {
          const vote = {};
          vote.uid = arr[i]?.response?.data[0]?.id ? arr[i]?.response?.data[0]?.id : arr[i].uid;
          vote.name = arr[i].name;
          vote.nowtime = arr[i]?.response?.data[0]?.createTime ? arr[i]?.response?.data[0]?.createTime : arr[i].createTime;
          vote.fileUrl = '';
          vote.status = arr[i].status;
          newarr.push(vote);
        }
        // setUploadFiles([...newarr]);
        ChangeFileslist({ arr: newarr, ischange: true });
        setShowIcon(true);
        if (getUploadStatus) { getUploadStatus(false) };
        sendUploadStatus(false)
      }
    },
    onPreview(file) {
      if (showIcon) {
        handledownload(file);
      }
    },
    onDownload(file) {
      handledownload(file);
    },
    onRemove(file) {
      // 删除记录,更新父级fileslist
      const newfilelist = fileslist.filter(item => item.uid !== file.uid);
      if (file && !file.lastModified) {
        ChangeFileslist({ arr: newfilelist, ischange: true });
        // 删除文件
        dispatch({
          type: 'sysfile/deletefile',
          payload: {
            id: file.uid,
          },
        });
      } else {
        message.success('已中止文件上传');
        setShowIcon(true);
        if (getUploadStatus) { getUploadStatus(false) };
        sendUploadStatus(false)
      }
    },
  };

  return (
    <>
      <Upload {...uploadprops}>
        <Button type="primary" onClick={() => { if (banOpenFileDialog) { message.info('文件正在上传中，请稍后再上传') } }}>
          <DownloadOutlined /> 上传附件
        </Button>
      </Upload>
      {!remark && filetype && filetype.length > 0 && (
        <div style={{ color: '#ccc', lineHeight: '20px' }}>
          <p style={{ marginBottom: '6px', }}>1、仅能上传{filetype.join('，')}类型文件;</p>
          <p style={{ marginBottom: '6px', }}>2、最多可上传20个文件;</p>
          <p style={{ marginBottom: '6px', }}>3、附件名称最长100个字符;</p>
        </div>
      )}
    </>
  );
}

export default connect(({ sysfile, loading }) => ({
  sysfile,
  loading: loading.models.sysfile,
}))(SysUpload);
