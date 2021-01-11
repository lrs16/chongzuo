import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form,Steps,Divider   } from 'antd';

let image;
let id;
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
            <Steps  
            progressDot 
            current={list.length - 1}
            direction="vertical"
            >{list}</Steps>
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
