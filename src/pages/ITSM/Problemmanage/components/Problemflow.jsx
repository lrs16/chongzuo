import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Timeline, Form } from 'antd';

let image;
function Problemflow(props) {
  const { id, imageSource, flowlog, dispatch } = props;
  const list = [];
  if (flowlog) {
    flowlog.forEach(function(item) {
      list.push(
        <Timeline.Item>
          {item.name}
          {item.startTime}
        </Timeline.Item>,
      );
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
      <div title="流转日志">
        <img src={image} alt="" />
      </div>

      <Card title="流转日志" bordered={false}>
        {list}
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
