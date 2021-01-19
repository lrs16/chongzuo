import React, { useEffect,useState, createContext, useRef } from 'react';
import { Form, Button, Collapse } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Registrat from './components/Registrat';
import styles from './index.less';

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

export const RegistratContext = createContext();

function Registration(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
    list,
    newno,
    useInfo,
    info,
    startid,
    loading
  } = props;
  const [show, setShow] = useState(false);
  const [activeKey, setActiveKey] = useState(['1']);
  const [flowtype, setFlowtype] = useState('2');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  console.log(files.arr,'files.arr');
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
    getUserinfo();
    getNewno();
  }, []);

  const callback = key => {
    setActiveKey(key);
  };

  const handlesubmit = (jumpType) => {
    RegistratRef.current.validateFields((err, values) => {
      if (!err) {
        const saveData = values;
        saveData.registerTime =  (saveData.registerTime).format('YYYY-MM-DD HH:mm:ss');
        saveData.registerOccurTime = (saveData.registerOccurTime).format('YYYY-MM-DD HH:mm:ss');
        saveData.registerExpectTime = (saveData.registerExpectTime).format('YYYY-MM-DD HH:mm:ss');
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

    // 上传附件触发保存
    useEffect(() => {
      const jumpType = 1;
      if (files.ischange) {
        const values = RegistratRef.current.getFieldsValue();
        const saveData = values;
        saveData.taskId = startid;
        saveData.registerExpectTime =  values.registerOccurTime.format('YYYY-MM-DD HH:mm:ss');
        saveData.registerTime =  values.registerTime.format('YYYY-MM-DD HH:mm:ss');
        saveData.registerOccurTime = values.registerOccurTime.format('YYYY-MM-DD HH:mm:ss');
        saveData.registerAttachments = JSON.stringify(files.arr);
        saveData.editState = 'add';
        dispatch({
          type:'problemmanage/getAddid',
          payload:{saveData,jumpType}
        })
      }
    }, [files]);

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
                files={files.arr}
                ChangeFiles={newvalue => {
                  setFiles(newvalue);
                }}
              />
            </RegistratContext.Provider>
          </Panel>
        </Collapse>
      </div>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, demandtodo, itsmuser, loading }) => ({
    list: problemmanage.list,
    id: problemmanage.id,
    newno: problemmanage.newno,
    useInfo: problemmanage.useInfo,
    info: demandtodo.info,
    startid: problemmanage.startid,
    loading: loading.models.problemmanage,
  }))(Registration),
);
