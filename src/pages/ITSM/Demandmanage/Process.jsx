import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Steps } from 'antd';
import styles from './index.less';

const { Step } = Steps;

function Process(props) {
  const { location, dispatch, imgblob, records, loading } = props;
  //  const { mainId } = location.query;

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
      type: 'demandtodo/demandimage',
      payload: {
        processId: '10053',
      },
    });
    dispatch({
      type: 'demandtodo/demandrecords',
      payload: {
        processId: '10053',
      },
    });
  }, []);

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
        {records !== '' && (
          <Steps
            current={records.length - 1}
            progressDot
            direction="vertical"
            style={{ background: '#fff', padding: 24 }}
          >
            {records.map((obj, index) => {
              const desc = (
                <div>
                  <div>{moment(obj.time).format('YYYY-MM-DD hh:mm:ss')}</div>
                </div>
              );
              return <Step title={obj.taskName} description={desc} key={index} />;
            })}
          </Steps>
        )}
      </Card>
    </>
  );
}

export default connect(({ demandtodo, loading }) => ({
  imgblob: demandtodo.imgblob,
  records: demandtodo.records,
  loading: loading.models.demantodo,
}))(Process);
