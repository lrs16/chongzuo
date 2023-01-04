import React from 'react';
import { connect } from 'dva';
import { PaperClipOutlined } from '@ant-design/icons';

function Downloadfile(props) {
  const { dispatch, files } = props;
  const handledownload = uploadinfo => {
    dispatch({
      type: 'sysfile/downloadfile',
      payload: {
        id: uploadinfo.uid,
      },
    }).then(res => {
      // console.log(res);
      const filename = uploadinfo.name;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };
  return (
    <>
      {files && JSON.parse(files).map(obj => {
        return (
          <div key={obj.uid} style={{ float: 'left', marginRight: 30 }}>
            <PaperClipOutlined
              style={{ marginRight: 8, fontSize: 11, color: 'rgba(0, 0, 0, 0.45)' }}
            />
            <a onClick={() => handledownload(obj)}>{obj.name}</a>
          </div>
        );
      })}
    </>
  );
}

export default connect(({ sysfile }) => ({
  sysfile,
}))(Downloadfile);
