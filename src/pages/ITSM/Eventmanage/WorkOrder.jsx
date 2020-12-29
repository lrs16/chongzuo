import React, { useState, createContext, useRef, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Collapse, Steps, Spin } from 'antd';
import styles from './index.less';
import Registrat from './components/Registrat';
import Check from './components/Check';
import Handle from './components/Handle';
import ReturnVisit from './components/ReturnVisit';
import Registratdes from './components/Registratdes';
import Checkdes from './components/Checkdes';
import Handledes from './components/Handledes';
import ReturnVisitdes from './components/ReturnVisitdes';
import { DingdingOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Step } = Steps;

// panle,map
const Collapsekeymap = new Map([
  ['1', 'registratform'],
  ['2', 'checkform'],
  ['3', 'checkform'],
  ['4', 'handleform'],
  ['5', 'handleform'],
  ['6', 'visitform'],
  ['7', 'visitform'],
]);
// panel详情
const Panelheadermap = new Map([
  ['register', '事件登记'],
  ['handle', '事件处理'],
  ['check', '事件审核'],
  ['finish', '事件确认'],
]);

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

export const RegistratContext = createContext();

function WorkOrder(props) {
  const { location, dispatch, loading, recordsloading, info, records } = props;
  const { validate, pangekey, id, mainId, type } = location.query;
  const [formregistrat, setFormregistrat] = useState('');
  const [formcheck, setFormcheck] = useState('');
  const [formhandle, setFormhandle] = useState('');
  const [formvisit, setFormvisit] = useState('');
  const [ischeck, setIscheck] = useState(false); // 是否在校验状态
  const [show, setShow] = useState(false); // 是否自行处理
  const [check, setCheck] = useState(false); // 事件分类是否权限账号
  const [activeKey, setActiveKey] = useState([]);
  const [finishfirst, setFinishfirst] = useState(undefined); // 初始化待确认,待审核
  const [flowtype, setFlowtype] = useState('1'); // 流转类型
  const RegistratRef = useRef();
  const CheckRef = useRef();
  const HandleRef = useRef();
  const ReturnVisitRef = useRef();
  const { data, edit } = info;

  const { flow_instance_id, flow_node_instance_id, flow_node_name, _edit_state } = info; //流程基本信息
  // 保存、流转表单信息
  const paloadvalues = {
    ...formregistrat,
    ...formcheck,
    ...formhandle,
    ...formvisit,
    flow_instance_id,
    flow_node_instance_id,
    flow_node_name,
    _edit_state,
  };

  const callback = key => {
    setActiveKey(key);
  };

  const routerRefresh = () => {
    router.push({
      pathname: `${props.match.url}`,
      query: {
        pangekey,
        id,
        validate: false,
      },
    });
  };

  const getregistrats = () => {
    RegistratRef.current.validateFields((err, values) => {
      if (!err) {
        setIscheck(true);
        setFormregistrat({
          ...values,
          register_occur_time: values.register_occur_time.format('YYYY-MM-DD HH:mm:ss'),
          register_selfhandle: String(Number(values.register_selfhandle)),
        });
      } else {
        setIscheck(false);
        routerRefresh();
      }
    });
  };
  const getchecks = () => {
    CheckRef.current.validateFields((err, values) => {
      if (!err) {
        setIscheck(true);
        setFormcheck({
          ...values,
          check_check_time: values.check_check_time.format('YYYY-MM-DD HH:mm:ss'),
        });
      } else {
        setIscheck(false);
        routerRefresh();
      }
    });
  };
  const gethandles = () => {
    HandleRef.current.validateFields((err, values) => {
      if (!err) {
        setIscheck(true);
        setFormhandle({
          ...values,
          handle_end_time: values.handle_end_time.format('YYYY-MM-DD HH:mm:ss'),
        });
      } else {
        setIscheck(false);
        routerRefresh();
      }
    });
  };
  // 接单信息
  // const rechandles = () => {
  //   setTimeout(() => {
  //     HandleRef.current.validateFields((err, values) => {
  //       setFormhandle({
  //         ...values,
  //         handle_end_time: values.handle_end_time.format('YYYY-MM-DD HH:mm:ss'),
  //       });
  //     });
  //   }, 30000);

  // };
  const getreturnvisit = () => {
    ReturnVisitRef.current.validateFields((err, values) => {
      if (!err) {
        setIscheck(true);
        setFormvisit({
          ...values,
          finish_revisit_time: values.finish_revisit_time.format('YYYY-MM-DD HH:mm:ss'),
        });
      } else {
        setIscheck(false);
        routerRefresh();
      }
    });
  };

  // 保存
  const eventsave = () => {
    if (ischeck === true) {
      dispatch({
        type: 'eventtodo/eventsave',
        payload: {
          paloadvalues,
          pangekey,
        },
      });
    }
  };
  // 流转
  const eventflow = () => {
    if (ischeck === true) {
      dispatch({
        type: 'eventtodo/eventflow',
        payload: {
          flow: {
            id,
            userIds: sessionStorage.getItem('NextflowUserId'),
            type: flowtype,
          },
          paloadvalues,
        },
      });
    }
  };

  // 回退
  // const eventback = () => {
  //   if (ischeck === true) {
  //     dispatch({
  //       type: 'eventtodo/eventback',
  //       payload: {
  //         flow: {
  //           id,
  //           userIds: '1',
  //           type: '2',
  //         },
  //         paloadvalues,
  //       },
  //     });
  //   }
  // };

  // 转单
  // const eventransfer = () => {
  //   if (ischeck === true) {

  //   }
  // };
  // 点击保存，流转触发表单校验
  const handlesubmit = () => {
    switch (pangekey) {
      case '1': {
        if (show) {
          getregistrats();
          gethandles();
        } else {
          getregistrats();
        }
        break;
      }
      case '2':
      case '3':
        getchecks();
        break;
      case '5':
      case '8':
        gethandles();
        break;
      case '6':
      case '7':
        getreturnvisit();
        break;
      default:
        break;
    }
  };
  // 初始化打开编辑
  useEffect(() => {
    dispatch({
      type: 'eventtodo/eventopenflow',
      payload: {
        taskId: id,
      },
    });
  }, []);
  // 待处理自动接单
  // useEffect(() => {
  //   if (pangekey === '4' && formhandle !== '') {
  //     dispatch({
  //       type: 'eventtodo/eventflow',
  //       payload: {
  //         flow: {
  //           id,
  //           userIds: '1',
  //           type: flowtype,
  //         },
  //         paloadvalues,
  //         pangekey,
  //       },
  //     });
  //   }
  // }, [formhandle]);

  // 获取事件流程记录
  useEffect(() => {
    dispatch({
      type: 'eventtodo/eventrecords',
      payload: {
        processId: mainId,
      },
    });
  }, [mainId]);

  // 初始化值panel
  useEffect(() => {
    setActiveKey([`${Collapsekeymap.get(pangekey)}`]);
  }, [info]);

  // 初始化流转类型,自动接单value
  useEffect(() => {
    //
    if (data !== undefined && data[0].main.event_type === '005') {
      setFlowtype('3');
    }
    if (pangekey !== '1') {
      setFlowtype('1');
    }
    // 自动接单
    // if (records !== '' && pangekey === '4') {
    //   rechandles();
    // }
  }, [loading]);

  useEffect(() => {
    if (validate === true && ischeck === false) {
      handlesubmit();
    }
  }, [validate]);

  // 保存、流转
  const handletype = () => {
    switch (type) {
      case 'save':
        eventsave();
        break;
      case 'flow':
        eventflow();
        break;
      case 'other':
        // eventransfer();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (ischeck === true) {
      handletype();
      setIscheck(false);
    }
  }, [ischeck]);

  return (
    <div className={styles.collapse}>
      {recordsloading === false && (
        <Steps
          current={records.length - 1}
          progressDot
          style={{ background: '#fff', padding: 24, border: '1px solid #e8e8e8' }}
        >
          {records.map(obj => {
            const desc = (
              <div className={styles.stepDescription}>
                处理人：{obj.user}
                <DingdingOutlined />
                <div>{obj.addTime}</div>
                <div>{obj.endTime}</div>
              </div>
            );
            return <Step title={obj.nodeName} description={desc} />;
          })}
        </Steps>
      )}
      <Spin spinning={loading}>
        {loading === false && data !== undefined && (
          <Collapse
            expandIconPosition="right"
            // defaultActiveKey={['1']}
            activeKey={activeKey}
            bordered={false}
            onChange={callback}
            style={{ marginTop: '-25px' }}
          >
            {pangekey === '1' && (
              <Panel header="事件登记" key="registratform">
                <Registrat
                  ChangeShow={isshow => setShow(isshow)}
                  ChangeCheck={checked => setCheck(checked)}
                  ChangeActiveKey={keys => setActiveKey(keys)}
                  ChangeFlowtype={newtype => setFlowtype(newtype)}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  show={show}
                  ref={RegistratRef}
                  info={edit}
                  main={data[0].main}
                />
              </Panel>
            )}

            {pangekey === '2' && (
              <Panel header="事件审核" key="checkform">
                <Check
                  ChangeFlowtype={newtype => setFlowtype(newtype)}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  ref={CheckRef}
                  info={finishfirst}
                  main={data[0].main}
                />
              </Panel>
            )}
            {pangekey === '3' && (
              <Panel header="事件审核" key="checkform">
                <Check
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  ref={CheckRef}
                  info={edit}
                  main={data[0].main}
                />
              </Panel>
            )}
            {((edit !== undefined && pangekey === '5' && edit.handle === null) ||
              (show === true && pangekey === '1')) && (
              <Panel header="事件处理" key="handleform">
                <Handle
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  ref={HandleRef}
                  info={finishfirst}
                  main={data[0].main}
                />
              </Panel>
            )}
            {pangekey !== '1' &&
              (show === true ||
                (edit !== undefined && pangekey === '5' && edit.handle !== null) ||
                pangekey === 6) && (
                <Panel header="事件处理" key="handleform">
                  <Handle
                    formItemLayout={formItemLayout}
                    forminladeLayout={forminladeLayout}
                    ref={HandleRef}
                    info={edit}
                    main={data[0].main}
                  />
                </Panel>
              )}
            {pangekey === '6' && edit.finish === null && (
              <Panel header="事件确认" key="visitform">
                <ReturnVisit
                  ChangeFlowtype={newtype => setFlowtype(newtype)}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  ref={ReturnVisitRef}
                  info={finishfirst}
                  main={data[0].main}
                />
              </Panel>
            )}
            {((pangekey === '6' && edit.finish !== null) || pangekey === '7') && (
              <Panel header="事件确认" key="visitform">
                <ReturnVisit
                  ChangeFlowtype={newtype => setFlowtype(newtype)}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  ref={ReturnVisitRef}
                  info={edit}
                  main={data[0].main}
                />
              </Panel>
            )}

            {data.map((obj, index) => {
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
            })}

            {/* {pangekey !== '1' && (
              <Panel header="事件登记" key="registratdes">
                <Registratdes />
              </Panel>
            )}
            {(pangekey === '6' || pangekey === '7' || pangekey === '8') && (
              <Panel header="事件处理" key="handledes">
                <Handledes />
              </Panel>
            )}
            {(pangekey === '8') && (
              <Panel header="事件回访" key="visitdes">
                <ReturnVisitdes />
              </Panel>
            )} */}
          </Collapse>
        )}
      </Spin>
    </div>
  );
}

export default connect(({ eventtodo, loading }) => ({
  info: eventtodo.info,
  records: eventtodo.records,
  loading: loading.models.eventtodo,
  recordsloading: loading.effects['eventtodo/eventrecords'],
}))(WorkOrder);
