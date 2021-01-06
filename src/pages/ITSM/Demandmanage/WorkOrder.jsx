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
  const { dispatch, location, records, info, userinfo, loading } = props;
  const [activeKey, setActiveKey] = useState(['form']);
  const { pangekey, id, mainId, type, validate } = location.query;
  // const [ischeck, setIscheck] = useState(false); // 是否在校验状态
  const [flowtype, setFlowtype] = useState('1'); // 流转类型

  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'eventregist/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'demand');
  }, []);
  // 更新流转类型
  useEffect(() => {
    sessionStorage.setItem('flowtype', flowtype);
  }, [flowtype]);

  // 刷新路由
  const routerRefresh = () => {
    router.push({
      pathname: `${props.match.url}`,
      query: {
        pangekey,
        id,
        mainId,
        validate: false,
        next: sessionStorage.getItem('Nextflowmane'),
      },
    });
  };

  // 登记表单
  const RegistratRef = useRef();
  const getregistrats = () => {
    RegistratRef.current.validateFields((err, values) => {
      if (!err) {
        switch (type) {
          case 'save': {
            dispatch({
              type: 'demandtodo/demandregisterupdate',
              payload: {
                paloadvalues: {
                  ...values,
                  creationTime: values.creationTime.format(),
                  registerTime: values.registerTime.format(),
                  functionalModule: values.functionalModule.join('/'),
                  nextUser: sessionStorage.getItem('userauthorityid'),
                  // nextUser: sessionStorage.getItem('userName'),
                },
                processInstanceId: mainId,
              },
            });
            break;
          }
          case 'flow':
            console.log('走流转接口');
            break;
          default:
            break;
        }
        routerRefresh();
      }
    });
  };
  // 表单
  const ExamineRef = useRef();
  const getdemandexamine = () => {
    ExamineRef.current.validateFields((err, values) => {
      if (!err) {
        switch (type) {
          case 'save': {
            dispatch({
              type: 'demandtodo/demandregisterupdate',
              payload: {
                paloadvalues: {
                  ...values,
                  creationTime: values.creationTime.format(),
                  registerTime: values.registerTime.format(),
                  functionalModule: values.functionalModule.join('/'),
                  nextUser: sessionStorage.getItem('NextflowUserId'),
                  // nextUser: sessionStorage.getItem('userName'),
                },
                processInstanceId: mainId,
              },
            });
            break;
          }
          case 'flow':
            console.log('走流转接口');
            break;
          default:
            break;
        }
      }
    });
  };
  // 表单
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
  // 表单
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

  const handleflow = () => {
    switch (pangekey) {
      case '需求登记': {
        getregistrats(type);
        break;
      }
      case '需求审核':
      case '运维审核':
        getdemandexamine();
        break;
      case '需求复核':
        // getreviewref();
        break;
      case '开发跟踪':
        // getverificationref();
        break;
      case '需求验证':
        // getdemandexamine();
        break;
      case '需求确认':
        // getdemandexamine();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (validate === true) {
      handleflow();
    }
  }, [validate]);

  const callback = key => {
    setActiveKey(key);
  };
  // 加载流程记录，加载编辑历史
  useEffect(() => {
    dispatch({
      type: 'demandtodo/demandrecords',
      payload: {
        processId: mainId,
      },
    });
    dispatch({
      type: 'demandtodo/demandopenflow',
      payload: {
        processInstanceId: mainId,
      },
    });
  }, [mainId]);

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
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
              ref={RegistratRef}
              register={info.demandForm}
              userinfo={userinfo}
            />
          )}
          {pangekey === '需求审核' && (
            <Examine
              ref={ExamineRef}
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
              text="复核"
              // register={info.demandForm}
              userinfo={userinfo}
            />
          )}
          {pangekey === '运维审核' && (
            <Examine
              ref={ExamineRef}
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
              text="运维"
              // register={info.demandForm}
              userinfo={userinfo}
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

export default connect(({ demandtodo, itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
  records: demandtodo.records,
  info: demandtodo.info,
  loading: loading.models.demantodo,
}))(WorkOrder);
