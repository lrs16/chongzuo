import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form,Steps,Divider   } from 'antd';
import styles from '../index.less';


const { Step } = Steps;
function Problemflow(props) {
  const { id, imageSource, flowlog, dispatch } = props;
  const list = [];
  if (flowlog) {
    flowlog.forEach(function(item) {
      list.push(
        <Step
          // key={item.id}
          title={`处理人:${item.formHandler}`}
          description={`${item.startTime}`}
          subTitle={item.backReason}
        />
      ) 
    });
  }
  
  const imgsrc = () => {
    const img = document.createElement('img');
    img.src = window.URL.createObjectURL(imageSource);
    document.getElementById('divimg').appendChild(img);
  };

  useEffect(() => {
    if (imageSource !== '' && document.getElementsByTagName('img').length < 2) {
      imgsrc();
    }
  }, [imageSource]);

  const getFlowImage = () => {
    dispatch({
      type: 'problemmanage/getgetFlowImage',
      payload: { mainId: id },
    });
  };

  const getFlowlog = () => {
    dispatch({
      type: 'problemmanage/getFlowlogdata',
      payload: { id },
    });
  };

  useEffect(() => {
    getFlowImage();
    getFlowlog();
  }, []);

  return (
    <>
      <Card title="流程图">
        <div style={{ background: '#fff' }} id="divimg"/>
      </Card>

      <Card title='流转日志'>
      {flowlog && (
          <div className={styles.processstept}>
            <Steps
              current={flowlog.length - 1}
              progressDot
              direction="vertical"
              style={{ background: '#fff', padding: 24}}
            >
              {flowlog.map((obj,index) => {
                // const backoff = obj.fallbackMsg === '' ? '' : '（回退）';
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
                return <Step description={desc} key={index}/>;
              })}
            </Steps>
          </div>
        )}
      </Card>
     
   
    </>
  );
}
export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    imageSource: problemmanage.imageSource,
    flowlog: problemmanage.flowlog,
    loading: loading.models.problemmanage,
  }))(Problemflow),
);
