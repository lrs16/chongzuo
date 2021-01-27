import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form,Steps,Divider   } from 'antd';
import styles from '../index.less';

let image;
let id;
const { Step } = Steps;
function Problemflow(props) {
  const { id, imageSource, flowlog, dispatch } = props;
  console.log('flowlog: ', flowlog);
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
  
  // const [image,setImage] = useState('');
  const blob = new Blob([imageSource]);
  image = (window.URL || window.webkitURL).createObjectURL(blob);

  useEffect(() => {
    getFlowImage();
    getFlowlog();
  }, []);

  const getFlowImage = () => {
    dispatch({
      type: 'problemmanage/getgetFlowImage',
      payload: { id },
    });
  };

  const getFlowlog = () => {
    dispatch({
      type: 'problemmanage/getFlowlogdata',
      payload: { id },
    });
  };

  return (
    <>
     <Card>
      <p>流程图</p>
          <Divider />
        {/* <Card title="流转日志" style={{margin:'0px'}}> */}
            <img src={image} alt="" />
        {/* </Card> */}

          {/* <Card title="流转日志"> */}
          <p>流转日志</p>
          <Divider />
          {flowlog && (
          <div className={styles.processstept}>
            <Steps
              current={flowlog.length - 1}
              progressDot
              direction="vertical"
              style={{ background: '#fff', padding: 24, border: '1px solid #e8e8e8' }}
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
    
          {/* </Card> */}
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
