import React, { useEffect,useState, createContext, createRef, useRef } from 'react';
import { Card, Form, Button, Collapse } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { connect } from 'dva';
// import Handle from './components/Handle';
import Registrat from './components/Registrat';

const { Panel } = Collapse;

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
let formatdatetime;
let createDatetime;
let jumpType = 0;
export const RegistratContext = createContext();

function Registration(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
    list,
    newno,
    useInfo
  } = props;
  const [show, setShow] = useState(false);
  const [activeKey, setActiveKey] = useState(['1']);
  // console.log(registratkeys);
  const RegistratRef = useRef();

  const getNewno = () => {
    dispatch({
      type: 'problemmanage/getregisterNo',
    });
  };

  const getUserinfo = () => {
    dispatch({
      type: 'problemmanage/fetchUseinfo',
    });
  };
  useEffect(() => {
    // dispatch({
    //   type:'problemmanage/fetchlist',
    // });
    // getADDid();
    getUserinfo();
    getNewno();
  }, []);

  const callback = key => {
    setActiveKey(key);
  };

  const handlesubmit = (jumpType) => {
    RegistratRef.current.validateFields((err, values) => {
      const addDateZero = num => {
        return num < 10 ? '0' + num : num;
      };
      const d = new Date(values.registerTime);
      formatdatetime =
        d.getFullYear() +
        '-' +
        addDateZero(d.getMonth() + 1) +
        '-' +
        addDateZero(d.getDate()) +
        ' ' +
        addDateZero(d.getHours()) +
        ':' +
        addDateZero(d.getMinutes()) +
        ':' +
        addDateZero(d.getSeconds());
      //  建单时间
      const createDateZero = num => {
        return num < 10 ? '0' + num : num;
      };
      const create = new Date(values.now);
      createDatetime =
        create.getFullYear() +
        '-' +
        createDateZero(create.getMonth() + 1) +
        '-' +
        createDateZero(create.getDate()) +
        ' ' +
        createDateZero(create.getHours()) +
        ':' +
        createDateZero(create.getMinutes()) +
        ':' +
        createDateZero(create.getSeconds());

      if (!err) {
        const saveData = values;
        saveData.registerTime = formatdatetime;
        saveData.now = createDatetime;
        // saveData.taskId = id.flowTaskId;
        saveData.editState = 'add';
        dispatch({
          type: 'problemmanage/getAddid',
          payload: { saveData,jumpType },
        });
      }
    });
  };

  const handleCirculation = () => {
    handlesubmit(1);
  };

  const handClose = () => {
    props.history.push('/ITSM/problemmanage/besolved');
  }

  return (
    <PageHeaderWrapper 
    title={pagetitle}
    extra={
      <>
       <Button type="primary" style={{ marginRight: 8 }} onClick={()=>handlesubmit(0)}>
          保 存
        </Button>
        <Button type="primary" style={{ marginRight: 8 }} onClick={handleCirculation}>
          流 转
        </Button>
        <Button type="default" onClick={handClose}>关 闭</Button>
      </>
    }
    >
      <div className={styles.collapse} style={{marginTop:'20px'}}>
        <Collapse
          expandIconPosition="right"
          activeKey={activeKey}
          bordered={false}
          onChange={callback}
        >
          <Panel header="问题登记" key="1" >
            <RegistratContext.Provider value={{ setActiveKey, setShow }}>
              <Registrat
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                show={show}
                ref={RegistratRef}
                list={list}
                newno={newno}
                useInfo={useInfo}
              />
            </RegistratContext.Provider>
          </Panel>
        </Collapse>
      </div>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    list: problemmanage.list,
    id: problemmanage.id,
    newno: problemmanage.newno,
    useInfo: problemmanage.useInfo,
    loading: loading.models.problemmanage,
  }))(Registration),
);
