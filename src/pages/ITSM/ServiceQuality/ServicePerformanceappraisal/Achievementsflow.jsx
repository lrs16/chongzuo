import React, { useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Steps } from 'antd';
import styles from '../index.less';


const { Step } = Steps;
let image;
function Achievementsflow(props) {
  const {
    taskId,
    imageSource,
    flowlog,
    flowhisTaskArr,
    dispatch
  } = props;
  const list = [];

  if (flowlog) {
    flowlog.forEach((item) => {
      list.push(
        <Step
          key={item.id}
          title={`处理人:${item.formHandler}`}
          description={`${item.startTime}`}
          subTitle={item.backReason}
        />
      )
    })
  }

  const blob = new Blob([imageSource]);
  image = (window.URL || window.webkitURL).createObjectURL(blob);

  const getFlowImage = () => {
    dispatch({
      type: 'performanceappraisal/readResource',
      payload: taskId,
    });
  };


  useEffect(() => {
    getFlowImage();
  }, []);

  return (
    <>
      <Card title="流程图">
        <div style={{ background: '#fff' }} className={styles.blobimg} >
          <img src={image} alt="" />
        </div>
      </Card>

      <Card title='流转日志'>
        <div className={styles.processstept}>
          <Steps
            current={flowhisTaskArr.length - 1}
            progressDot
            direction="vertical"
            style={{ background: '#fff', padding: 24 }}
          >
            {flowhisTaskArr.map((obj) => {
              const desc = (
                <div>
                  <div>当前环节:{obj.name}</div>
                  <div>处理人：{obj.assignee}</div>
                  <div>开始时间:{moment(obj.startTime).format('YYYY-MM-DD HH:mm')}</div>
                  <div>结束时间:{obj.endTime ? moment(obj.endTime).format('YYYY-MM-DD HH:mm') : ''}</div>
                  <div>状态:{obj.taskStatus}</div>
                  {
                    obj.taskStatus === '退回' && (
                      <div>回退原因:{obj.backReason}</div>
                    )
                  }
                </div>
              );
              return <Step description={desc} key={obj.id} />;
            })}
          </Steps>
        </div>
      </Card>


    </>
  );
}
export default Form.create({})(
  connect(({ problemmanage, performanceappraisal, loading }) => ({
    imageSource: performanceappraisal.imageSource,
    flowlog: problemmanage.flowlog,
    loading: loading.models.performanceappraisal,
  }))(Achievementsflow),
);
