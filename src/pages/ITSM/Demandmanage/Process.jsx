import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Steps } from 'antd';
import styles from './index.less';

const { Step } = Steps;

function Process(props) {
  const { location, dispatch, imgblob, processs, loading } = props;
  const { id, mainId } = location.query;

  const imgsrc = () => {
    const img = document.createElement('img');
    img.src = window.URL.createObjectURL(imgblob);
    document.getElementById('divimg').appendChild(img);
  };

  useEffect(() => {
    if (mainId !== undefined) {
      dispatch({
        type: 'demandtodo/demandimage',
        payload: {
          processId: mainId,
        },
      });
      dispatch({
        type: 'demandtodo/demandprocess',
        payload: {
          processId: mainId,
        },
      });
    }
  }, [mainId]);
  console.log(mainId)

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
        <div className={styles.processstept}>
          {processs !== '' && (
            <Steps
              current={processs.length - 1}
              progressDot
              direction="vertical"
              style={{ background: '#fff', padding: 24 }}
            >
              {processs.map((obj, index) => {
                const backoff = obj.opinion === null ? '' : '（回退）';
                const desc = (
                  <div>
                    {/* <div>处理人：{obj.user}</div> */}
                    <div>{obj.startTime}</div>
                    <div>{obj.endTime}</div>
                    {obj.opinion !== null && <div>回退原因：{obj.opinion}</div>}
                  </div>
                );
                return <Step
                  title={`${obj.taskName}${backoff}`}
                  description={desc}
                  key={index.toString()}
                />;
              })}
            </Steps>
          )}
        </div>
      </Card>
    </>
  );
}

export default connect(({ demandtodo, loading }) => ({
  imgblob: demandtodo.imgblob,
  processs: demandtodo.processs,
  loading: loading.models.demantodo,
}))(Process);
