import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Steps } from 'antd';
import styles from './index.less';

const { Step } = Steps;

function Process(props) {
  const { location, dispatch, imgblob, records, loading } = props;
  const { mainId } = location.query;

  const imgsrc = () => {
    const img = document.createElement('img');
    // img.onload = () => {
    //   window.URL.revokeObjectURL(img.src);
    // };
    img.src = window.URL.createObjectURL(imgblob);
    document.getElementById('divimg').appendChild(img);
  };

  useEffect(() => {
    dispatch({
      type: 'eventtodo/eventimage',
      payload: {
        processInstanceId: mainId,
      },
    });
    dispatch({
      type: 'eventtodo/eventrecords',
      payload: {
        processId: mainId,
      },
    });
  }, [mainId]);

  useEffect(() => {
    if (imgblob !== '' && document.getElementsByTagName('img').length < 2) {
      imgsrc();
    }
  }, [imgblob]);

  return (
    <>
      <Card title="流程图">
        <div style={{ background: '#fff' }} id="divimg" className={styles.blobimg} />
      </Card>
      <Card title="流转日志" style={{ marginTop: '-1px' }}>
        {loading === false && (
          <div className={styles.processstept}>
            <Steps
              current={records.length - 1}
              progressDot
              direction="vertical"
              style={{ background: '#fff', padding: 24 }}
            >
              {records.map(obj => {
                const backoff = obj.fallbackMsg === '' ? '' : '（回退）';
                const desc = (
                  <div>
                    <div>处理人：{obj.user}</div>
                    <div>{obj.addTime}</div>
                    <div>{obj.endTime}</div>
                    {obj.fallbackMsg !== '' && <div>回退原因：{obj.fallbackMsg}</div>}
                  </div>
                );
                return <Step title={`${obj.nodeName}${backoff}`} description={desc} />;
              })}
            </Steps>
          </div>
        )}
      </Card>
    </>
  );
}

export default connect(({ eventtodo, loading }) => ({
  imgblob: eventtodo.imgblob,
  records: eventtodo.records,
  loading: loading.models.eventtodo,
}))(Process);
