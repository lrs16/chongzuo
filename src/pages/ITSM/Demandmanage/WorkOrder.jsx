import React, { useState, createContext, useRef, useEffect } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import { Collapse, Steps, Spin } from 'antd';
import { DatePicker } from 'antd';
import styles from './index.less';
import { DingdingOutlined } from '@ant-design/icons';
import Registrat from './components/Registrat';
import Examine from './components/Examine';
import Review from './components/Review';
import Verification from './components/Verification';

const { Panel } = Collapse;
const { Step } = Steps;

// const Panelheadermap = new Map([
//   ['register', '事件登记'],
//   ['handle', '事件处理'],
//   ['check', '事件审核'],
//   ['finish', '事件确认'],
// ]);

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

function WorkOrder(props) {
  const { dispatch, location, records, loading } = props;
  const [activeKey, setActiveKey] = useState(['form']);
  const [formregistrat, setFormregistrat] = useState('');
  const { pangekey, processId, validate } = location.query;
  console.log(validate);
  //  const [flowtype, setFlowtype] = useState('1'); // 流转类型
  const RegistratRef = useRef();
  const getregistrats = () => {
    RegistratRef.current.validateFields((err, values) => {
      if (!err) {
        setFormregistrat({
          ...values,
        });
      }
    });
  };
  const ExamineRef = useRef();
  const getdemandexamine = () => {
    ExamineRef.current.validateFields((err, values) => {
      if (!err) {
        setFormregistrat({
          ...values,
        });
      }
    });
  };
  const ReviewRef = useRef();
  const getreviewref = () => {
    ReviewRef.current.validateFields((err, values) => {
      if (!err) {
        setFormregistrat({
          ...values,
        });
      }
    });
  };
  const VerificationRef = useRef();
  const getverificationref = () => {
    ReviewRef.current.validateFields((err, values) => {
      if (!err) {
        setFormregistrat({
          ...values,
        });
      }
    });
  };

  const callback = key => {
    setActiveKey(key);
  };

  useEffect(() => {
    dispatch({
      type: 'demandtodo/demandrecords',
      payload: {
        processId,
      },
    });
  }, [processId]);

  const handleflow = pangekey => {
    switch (pangekey) {
      case '需求登记':
        getregistrats();
        break;
      case '需求审核':
      case '运维审核':
        getdemandexamine();
        break;
      case '需求复核':
        getreviewref();
        break;
      case '开发跟踪':
        getverificationref();
        break;
      case '需求验证':
        getreturnvisit();
        break;
      case '需求确认':
        getreturnvisit();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (validate === true) {
      getdemandexamine();
    }
  }, [validate]);

  return (
    <div className={styles.collapse}>
      {records !== '' && (
        <Steps
          current={records.length - 1}
          progressDot
          style={{
            background: '#fff',
            padding: 24,
            border: '1px solid #e8e8e8',
            overflowX: 'auto',
          }}
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
      <Collapse
        expandIconPosition="right"
        activeKey={activeKey}
        bordered={false}
        onChange={callback}
        style={{ marginTop: '-25px' }}
      >
        <Panel header={pangekey} key="form">
          {pangekey === '需求登记' && (
            <Registrat
              ref={RegistratRef}
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
            />
          )}
          {(pangekey === '需求审核' || pangekey === '运维审核') && (
            <Examine
              ref={ExamineRef}
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
            />
          )}
          {pangekey === '需求复核' && (
            <Review
              ref={ReviewRef}
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
            />
          )}
          {pangekey === '需求验证' && (
            <Verification
              ref={VerificationRef}
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
            />
          )}
        </Panel>

        {/* {data.map((obj, index) => {
              // panel详情组件
              const Paneldesmap = new Map([
                ['register', <Registratdes info={Object.values(obj)[0]} main={data[0].main} />],
                ['handle', <Handledes info={Object.values(obj)[0]} main={data[0].main} />],
                ['check', <Checkdes info={Object.values(obj)[0]} main={data[0].main} />],
                ['finish', <ReturnVisitdes info={Object.values(obj)[0]} main={data[0].main} />],
              ]);

              if (index > 0)
                return (
                  <Panel Panel header={Panelheadermap.get(Object.keys(obj)[0])} key={index}>
                    {Paneldesmap.get(Object.keys(obj)[0])}
                  </Panel>
                );
            })} */}
      </Collapse>
    </div>
  );
}

export default connect(({ demandtodo, loading }) => ({
  records: demandtodo.records,
  loading: loading.models.demantodo,
}))(WorkOrder);
