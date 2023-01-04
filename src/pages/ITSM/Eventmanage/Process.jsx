import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Steps } from 'antd';

const { Step } = Steps;

let image;

function Process(props) {
  const { location, dispatch, imgblob, records } = props;
  const { mainId, id } = location.query;

  // const imgsrc = () => {
  //   const img = document.createElement('img');
  //   img.src = window.URL.createObjectURL(imgblob);
  //   document.getElementById('divimg').appendChild(img);
  // };

  useEffect(() => {
    dispatch({
      type: 'eventtodo/eventimage',
      payload: {
        mainId: mainId || id,
      },
    });
    dispatch({
      type: 'eventtodo/eventrecords',
      payload: {
        processId: mainId || id,
      },
    });
  }, []);

  // 二进制展示流程图
  const blob = new Blob([imgblob]);
  image = (window.URL || window.webkitURL).createObjectURL(blob);

  return (
    <>
      <Card title="流程图">
        <div style={{ background: '#fff' }} className='blobimg' >
          <img src={image} alt="" />
        </div>
      </Card>
      <Card title="流转日志" style={{ marginTop: '-1px' }}>
        {records !== '' && (
          <div className='processstept'>
            <Steps
              current={records.length - 1}
              progressDot
              direction="vertical"
              style={{ background: '#fff', padding: 24 }}
            >
              {records.map((obj, index) => {
                const backoff = obj.fallbackMsg === '' ? '' : '（回退）';
                const desc = (
                  <div>
                    <div>处理人：{obj.user}</div>
                    <div>{obj.addTime}</div>
                    <div>{obj.endTime}</div>
                    {obj.fallbackMsg !== '' && <div>回退原因：{obj.fallbackMsg}</div>}
                  </div>
                );
                return (
                  <Step
                    title={`${obj.nodeName}${backoff}`}
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

export default connect(({ eventtodo, loading }) => ({
  imgblob: eventtodo.imgblob,
  records: eventtodo.records,
  loading: loading.models.eventtodo,
}))(Process);
