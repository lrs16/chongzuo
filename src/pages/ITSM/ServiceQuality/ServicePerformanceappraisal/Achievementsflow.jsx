import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Steps,
} from 'antd';

import styles from './index.less';


const { Step } = Steps;

function Achievementsflow(props) {
  const {
    taskId,
    readResourceImg,
    flowhisTaskArr,
    loading,
    dispatch
  } = props;

  console.log(readResourceImg, 'readResourceImg')

  const imgsrc = () => {
    const img = document.createElement('img');
    img.src = window.URL.createObjectURL(readResourceImg);
    document.getElementById('divimg').appendChild(img);
  };

  useEffect(() => {
    console.log(document.getElementsByTagName('img').length,'ll')
    if (readResourceImg !== '' && document.getElementsByTagName('img').length < 2) {
      imgsrc();
    }
  }, [readResourceImg]);

  const getFlowImage = () => {
    dispatch({
      type: 'performanceappraisal/readResource',
      payload: taskId,
    });
  };

  useEffect(() => {
    getFlowImage()
  }, [])



  return (
    <>
     <Card title="流程图">
        <div style={{ background: '#fff' }} id="divimg"/>
      </Card>

      <Card title='流转日志'>
        <div className={styles.processstept}>
          <Steps
            current={flowhisTaskArr.length - 1}
            progressDot
            direction="vertical"
            style={{ background: '#fff', padding: 24 }}
          >
            {flowhisTaskArr.map((obj, index) => {
              const desc = (
                <div>
                  <div>当前环节:{obj.name}</div>
                  <div>处理人：{obj.formHandler}</div>
                  <div>开始时间:{obj.startTime}</div>
                  <div>状态:{obj.status}</div>
                  {
                    obj.status === '退回' && (
                      <div>回退原因:{obj.backReason}</div>
                    )
                  }
                </div>
              );
              // return <Step title={`${obj.nodeName}${backoff}`} description={desc} />;
              return <Step description={desc} key={index} />;
            })}
          </Steps>
        </div>
      </Card>
    </>
  )
}

export default Form.create({})(
  connect(({ performanceappraisal, loading }) => ({
    readResourceImg: performanceappraisal.readResourceImg,
  }))(Achievementsflow)
)

