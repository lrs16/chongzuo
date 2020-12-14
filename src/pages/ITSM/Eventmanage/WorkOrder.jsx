import React, { useState, createContext, useRef, useEffect } from 'react';
import { Collapse, Steps } from 'antd';
import router from 'umi/router';
import styles from './index.less';
import Registrat from './components/Registrat';
import Handle from './components/Handle';
import ReturnVisit from './components/ReturnVisit';
import Registratdes from './components/Registratdes';
import Handledes from './components/Handledes';
import ReturnVisitdes from './components/ReturnVisitdes';

const { Panel } = Collapse;
const { Step } = Steps;

const stepstitless = [
  {
    key: 0,
    value: '事件登记',
    status: 1,
    arrivaltime: '2020-11-12 20:48',
    time: '1天23小时56分30秒',
    Handler: '李江',
  },
  { key: 1, value: '事件处理' },
  { key: 2, value: '事件回访' },
  { key: 3, value: '事件完成' },
];

const Collapsekeymap = new Map([
  [0, 'registratform'],
  [1, 'registratform'],
  [2, 'handleform'],
  [3, 'handleform'],
  [4, 'visitform'],
  [5, 'visitform'],
  [6, 'handleform'],
]);

const currentmap = new Map([
  [0, 0],
  [1, 0],
  [2, 1],
  [3, 1],
  [4, 2],
  [5, 2],
  [6, 1],
  [7, 3],
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
  const { location } = props;
  const { validate, pangekey, id } = location.query;
  const [show, setShow] = useState(false);
  const [steptitle, setTitle] = useState([]);
  const [activeKey, setActiveKey] = useState([]);
  // console.log(registratkeys);
  const RegistratRef = useRef();
  const HandleRef = useRef();
  const ReturnVisitRef = useRef();

  const stepstitle = () => {
    const retime = '15分30秒';
    const hanletime = '1天23小时56分30秒';
    const vistetime = '5小时56分30秒';
    const rename = '李江';
    const arrivaltime = '2020-11-12 20:48';
    switch (pangekey) {
      case 0: {
        const titlemap = [
          { key: 0, value: '事件登记（待登记）' },
          { key: 1, value: '事件处理' },
          { key: 2, value: '事件回访' },
          { key: 3, value: '事件完成' },
        ];
        setTitle(titlemap);
        break;
      }
      case 1: {
        const titlemap = [
          { key: 0, value: '事件登记（已登记）', description: `登记人：${rename}` },
          { key: 1, value: '事件处理' },
          { key: 2, value: '事件回访' },
          { key: 3, value: '事件完成' },
        ];
        setTitle(titlemap);
        break;
      }
      case 2: {
        const titlemap = [
          { key: 0, value: `事件登记（已登记）${retime}`, description: `登记人：${rename}` },
          { key: 1, value: '事件处理（待处理）', description: `到达时间：${arrivaltime}` },
          { key: 2, value: '事件回访' },
          { key: 3, value: '事件完成' },
        ];
        setTitle(titlemap);
        break;
      }
      case 3: {
        const titlemap = [
          { key: 0, value: `事件登记（已登记）${retime}`, description: `登记人：${rename}` },
          {
            key: 1,
            value: '事件处理（处理中）',
            description: `到达时间：${arrivaltime}处理人：${rename}`,
          },
          { key: 2, value: '事件回访' },
          { key: 3, value: '事件完成' },
        ];
        setTitle(titlemap);
        break;
      }
      case 4: {
        const titlemap = [
          { key: 0, value: `事件登记（已登记）${retime}`, description: `登记人：${rename}` },
          { key: 1, value: `事件处理（已处理）${hanletime}`, description: `处理人：${rename}` },
          { key: 2, value: '事件回访（待回访）', description: `到达时间：${arrivaltime}` },
          { key: 3, value: '事件完成' },
        ];
        setTitle(titlemap);
        break;
      }
      case 5: {
        const titlemap = [
          { key: 0, value: `事件登记（已登记）${retime}`, description: `登记人：${rename}` },
          { key: 1, value: `事件处理（已处理）${hanletime}`, description: `处理人：${rename}` },
          {
            key: 2,
            value: '事件回访（已回访）',
            description: `到达时间：${arrivaltime}处理人：${rename}`,
          },
          { key: 3, value: '事件完成' },
        ];
        setTitle(titlemap);
        break;
      }
      case 6: {
        const titlemap = [
          { key: 0, value: `事件登记（已登记）${retime}`, description: `登记人：${rename}` },
          {
            key: 1,
            value: `事件处理（已处理）${hanletime}`,
            description: `到达时间：${arrivaltime}处理人：${rename}`,
          },
          { key: 2, value: '事件回访（已回访）', description: `处理人：${rename}` },
          { key: 3, value: '事件完成' },
        ];
        setTitle(titlemap);
        break;
      }
      case 7: {
        const titlemap = [
          { key: 0, value: `事件登记（已登记）${retime}`, description: `登记人：${rename}` },
          { key: 1, value: `事件处理（已处理）${hanletime}`, description: `处理人：${rename}` },
          { key: 2, value: '事件回访（已回访）', description: `处理人：${rename}` },
          { key: 3, value: '事件完成' },
        ];
        setTitle(titlemap);
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    setActiveKey([`${Collapsekeymap.get(pangekey)}`]);
    stepstitle();
  }, []);

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
        console.log(values);
      }
      routerRefresh();
    });
  };
  const gethandles = () => {
    HandleRef.current.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
      routerRefresh();
    });
  };
  const getreturnvisit = () => {
    ReturnVisitRef.current.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
      routerRefresh();
    });
  };

  const handlesubmit = () => {
    switch (pangekey) {
      case 1: {
        if (show) {
          getregistrats();
          gethandles();
        }
        getregistrats();
        break;
      }
      case 2:
      case 3:
      case 6:
        gethandles();
        break;
      case 4:
      case 5:
        getreturnvisit();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (validate === true) {
      handlesubmit();
    }
  }, [validate]);

  const callback = key => {
    setActiveKey(key);
  };

  return (
    <div className={styles.collapse}>
      <Steps
        current={currentmap.get(pangekey)}
        size="small"
        style={{ background: '#fff', padding: 24, border: '1px solid #e8e8e8' }}
      >
        {steptitle.map(({ key, value, description }) => [
          <Step title={value} description={description} />,
        ])}
      </Steps>
      <Collapse
        expandIconPosition="right"
        // defaultActiveKey={['1']}
        activeKey={activeKey}
        bordered={false}
        onChange={callback}
        style={{ marginTop: '-25px' }}
      >
        {(pangekey === 0 || pangekey === 1) && (
          <Panel header="事件登记" key="registratform">
            <Registrat
              ChangeShow={isshow => setShow(isshow)}
              ChangeActiveKey={keys => setActiveKey(keys)}
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
              show={show}
              ref={RegistratRef}
            />
          </Panel>
        )}
        {(show === true || pangekey !== 1) && (
          <Panel header="事件登记" key="registratdes">
            <Registratdes />
          </Panel>
        )}
        {(show === true || pangekey === 2 || pangekey === 3 || pangekey === 6) && (
          <Panel header="事件处理" key="handleform">
            <Handle
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
              ref={HandleRef}
            />
          </Panel>
        )}
        {(pangekey === 4 || pangekey === 5 || pangekey === 7) && (
          <Panel header="事件处理" key="handledes">
            <Handledes />
          </Panel>
        )}
        {(pangekey === 4 || pangekey === 5) && (
          <Panel header="事件回访" key="visitform">
            <ReturnVisit
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
              ref={ReturnVisitRef}
            />
          </Panel>
        )}
        {(pangekey === 6 || pangekey === 7) && (
          <Panel header="事件回访" key="visitform">
            <ReturnVisitdes />
          </Panel>
        )}
      </Collapse>
    </div>
  );
}

export default WorkOrder;
