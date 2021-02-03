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
    keyVallist,
    typelist,
    prioritylist,
    scopeList,
    projectList,
    startid,
    loading
  } = props;
  const [show, setShow] = useState(false);
  const [activeKey, setActiveKey] = useState(['1']);
  const [flowtype, setFlowtype] = useState('2');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const RegistratRef = useRef();

  // const getNewno = () => {
  //   dispatch({
  //     type: 'problemmanage/getregisterNo',
  //   });
  // };

  const getUserinfo = () => {
    dispatch({
      type: 'problemmanage/fetchUseinfo',
    });
  };

  const getSourceapi = (dictModule,dictType) => {
    dispatch({
      type: 'problemdropdown/keyvalsource',
      payload:{ dictModule, dictType}
    });
  }
//  问题来源
  const getSource = () => {
    const dictModule = 'problem';
    const dictType = 'source';
    getSourceapi(dictModule,dictType);
  }
//  问题分类
  const gettype = () => {
    const dictModule = 'problem';
    const dictType = 'type';
    getSourceapi(dictModule,dictType);
  }
//  重要程度
  const getpriority = () => {
    const dictModule = 'public';
    const dictType = 'priority';
    getSourceapi(dictModule,dictType);
  }
//  影响范围
  const getscope = () => {
    const dictModule = 'public';
    const dictType = 'effect';
    getSourceapi(dictModule,dictType);
  }

  // 所属项目
  const getProject = () => {
    const dictModule = 'public';
    const dictType = 'project';
    getSourceapi(dictModule,dictType);
  }



  useEffect(() => {
    getUserinfo();
    // getNewno();
    getSource();
    gettype();
    getpriority();
    getscope();
    getProject();
  }, []);


  const callback = key => {
    setActiveKey(key);
  };

  const handlesubmit = (jumpType) => {
    RegistratRef.current.validateFields((err, values) => {
      if (jumpType?!err:true) {
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
    handlesubmit(0);
  };

  const handClose = () => {
    props.history.push('/ITSM/problemmanage/besolved');
  }

    // 上传附件触发保存
    useEffect(() => {
      const jumpType = 0;
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
       <Button type="primary" style={{ marginRight: 8 }} onClick={handleCirculation}>
          保 存
        </Button>
        {/* <Button type="primary" style={{ marginRight: 8 }} onClick={handleCirculation}>
          流 转
        </Button> */}
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
                useInfo={useInfo}
                files={files.arr}
                ChangeFiles={newvalue => {
                  setFiles(newvalue);
                }}
                source={keyVallist.source}
                type={typelist.type}
                priority={prioritylist.priority}
                scope={scopeList.effect}
                project={projectList.project}

              />
            </RegistratContext.Provider>
          </Panel>
        </Collapse>
      </div>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, demandtodo, problemdropdown, loading }) => ({
    list: problemmanage.list,
    id: problemmanage.id,
    newno: problemmanage.newno,
    useInfo: problemmanage.useInfo,
    info: demandtodo.info,
    keyVallist: problemdropdown.keyVallist,
    typelist: problemdropdown.typelist,
    prioritylist: problemdropdown.prioritylist,
    scopeList: problemdropdown.scopeList,
    projectList: problemdropdown.projectList,
    startid: problemmanage.startid,
    loading: loading.models.problemmanage,
  }))(Registration),
);
