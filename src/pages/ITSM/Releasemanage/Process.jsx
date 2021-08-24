import React from 'react';
import { connect } from 'dva';
import { Card, Steps } from 'antd';
import styles from './index.less';

const { Step } = Steps;

let image;

function Process(props) {
  const { imgblob, records } = props;

  // 二进制展示流程图
  const blob = new Blob([imgblob]);
  image = (window.URL || window.webkitURL).createObjectURL(blob);

  return (
    <>
      <Card title="流程图">
        <div style={{ background: '#fff' }} className={styles.blobimg} >
          <img src={image} alt="" />
        </div>
      </Card>
      <Card title="流转日志" style={{ marginTop: '-1px' }}>
        {records !== '' && (
          <div className={styles.processstept}>
            <Steps
              current={records.length - 1}
              progressDot
              direction="vertical"
              style={{ background: '#fff', padding: 24 }}
            >
              {records.map((obj, index) => {
                const backoff = obj.timeoutReason ? '（回退）' : '';
                const desc = (
                  <div>
                    <div>处理人：{obj.assignee}</div>
                    <div>{obj.prevCompleteTime}</div>
                    <div>{obj.completeTime}</div>
                    {obj.timeoutReason && <div>回退原因：{obj.timeoutReason}</div>}
                  </div>
                );
                return (
                  <Step
                    title={`${obj.taskName}${backoff}`}
                    description={desc}
                    key={index.toString()}
                  />
                );
              })}
            </Steps>
          </div>
        )}
      </Card>
    </>
  );
}

export default connect(({ releaseview, loading }) => ({
  imgblob: releaseview.imgblob,
  records: releaseview.tasklinks || [],
  loading: loading.models.releasetodo,
}))(Process);
