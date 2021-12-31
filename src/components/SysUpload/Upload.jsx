import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'dva';
import { Upload, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { getFileSecuritySuffix } from '@/services/upload';
import UploadContext from '@/layouts/MenuContext';

message.config({
  top: 100,
  duration: 2,
  maxCount: 2,
});

function SysUpload(props) {
  const { dispatch, filelist, banOpenFileDialog, openFileMsg, msgType, remark } = props;
  const [filetype, setFileType] = useState('');
  const [showIcon, setShowIcon] = useState(true);
  const [nowFiles, setNowFiles] = useState([]);
  const { files, ChangeFiles, getUploadStatus } = useContext(UploadContext);

  const sendUploadStatus = (v) => {
    dispatch({
      type: 'viewcache/getuploadstatus',
      payload: {
        uploadstatus: v
      }
    })
  };

  // 不允许上传类型
  useEffect(() => {
    sendUploadStatus(false);
    getFileSecuritySuffix().then(res => {
      if (res.code === 200) {
        const arr = [...res.data];
        setFileType(arr);
      }
    });
    return () => {
      sendUploadStatus(false);
    }
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
    showUploadList: { showDownloadIcon: showIcon, showRemoveIcon: showIcon },
    defaultFileList: filelist || files,
    // fileList: filelist || files,
    multiple: true,
    openFileDialogOnClick: !banOpenFileDialog,

    beforeUpload(file, fileList) {
      return new Promise((resolve, reject) => {
        setShowIcon(false);
        if (getUploadStatus) { getUploadStatus(true) };
        sendUploadStatus(true);
        const type = file.name.lastIndexOf('.');
        const filesuffix = file.name.substring(type + 1, file.name.length);
        const correctfiletype = filetype.indexOf(filesuffix);
        if ((!filelist && !files && (fileList.length > 20 || (nowFiles.length + fileList.length) > 20)) ||
          (!files && filelist && (filelist.length + fileList.length) > 20) ||
          (!filelist && files && (files.length + fileList.length) > 20)) {
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
          if (getUploadStatus) { getUploadStatus(false) };
          sendUploadStatus(false);
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
        ChangeFiles(newarr);
        setNowFiles(newarr);
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
      const newfilelist = (filelist || files).filter(item => file.response ? item.uid !== file.response.data[0].id : item.uid !== file.uid);
      if (file && !file.lastModified) {
        ChangeFiles(newfilelist);
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
        <Button
          type="primary"
          onClick={() => {
            if (banOpenFileDialog) {
              if (openFileMsg) {
                message[msgType](openFileMsg);
              } else {
                message.info('文件正在上传中，请稍后再上传');
              }
            }
          }}>
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
