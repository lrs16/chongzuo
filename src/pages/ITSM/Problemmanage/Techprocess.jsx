import React, { useState, useEffect,useRef } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Tabs,
  message,
  Select,
  Collapse,
  Steps,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import route from 'umi/router';
import Regexp, { phone_reg } from '@/utils/Regexp';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Problemworkorder from './components/Problemworkorder';
import Problemflow from './components/Problemflow';
import Registrat from './components/Registrat';
import Previewedit from './components/Previewedit';
import Handleedit from './components/Handleedit';
import Problemconfirmedit from './components/Problemconfirmedit';
import Closeedit from './components/Closeedit';

import Reasonregression from './components/Reasonregression';
import SelectUser from '@/components/ProblemSelectuser';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { Step } = Steps;


let currntStatus = '';
let problemFlowid;
let showEdit = false;
const saveSign = '';
let circaSign = 'circa';
let closecircu = '关闭';

function Techprocess(props) {
  const pagetitle = props.route.name;
  const RegistratRef = useRef();
  const PreviesRef = useRef();
  const HandleRef = useRef();
  const ProblemconfirmRef = useRef();
  const CloseRef = useRef();
  useEffect(() => {
    getInformation();
    solvingDisbled();
  }, []);

  const {
    form: { validateFields },
    dispatch,
    todoDetail,
    todoDetail: { confirm },
  } = props;

  const {
    params: { id },
  } = props.match;
  const list = [];
  if (todoDetail.main) {
    currntStatus = Number(todoDetail.main.status);
    problemFlowid =  todoDetail.main.id;
    if((currntStatus === 69) || (currntStatus === 85)) {
      closecircu = '';
    }
    const { problemFlowLogs } = todoDetail;
    problemFlowLogs.forEach(function(item) {
      list.push(
        <Step
          key={item.id}
          title={`${item.name}(${item.status})`}
          subTitle={item.startTime}
          description={`登记人:${item.formHandler}`}
        />,
      );
    });
    list.shift();
  }

  if(todoDetail['confirmType']){
    confirmType =todoDetail.confirmType;
  }else if(confirm){
    confirmType = confirm.confirmType;
  }
  // console.log(confirmType,'confirmType');

  

  const solvingDisbled = () => {
    if ((currntStatus === 29 ) || (currntStatus === 9)) {
      showEdit = true;
    }
  };

  const onChange = activekey => {
    setActivekey(activekey);
  };

  const getInformation = () => {
    dispatch({
      type: 'problemmanage/ToDodetails',
      payload: { id },
    })
    };
  

  const handleSubmit = params2 => {
    switch (currntStatus) {
      case 5:
        // circulationSign = currntStatus;
        saveRegister(params2);
        break;
      case 25:
        savePrevies(params2);
        break;
      case 9:
        savePrevies(params2);
        break;
      case 29:
        saveHandle(params2);
        break;
      case 45:
        saveHandle(params2);
        break;
      case 49:
        saveConfirm(params2);
        break;
      case 65:
        saveConfirm(params2);
        break;
      case 69:
        saveClose(params2);
        break;
      case 85:
        saveClose(params2);
        break;
      default:
        break;
    }
  };

  const saveRegister = (params2) => {
    console.log('params2: ', params2);
    RegistratRef.current.validateFields((err, values) => {
      if(params2?!err:true) {
        const saveData = values;
        saveData.registerTime = (saveData.registerTime).format('YYYY-MM-DD HH:mm:ss');
        saveData.registerOccurTime = (saveData.registerOccurTime).format('YYYY-MM-DD HH:mm:ss');
        saveData.taskId = id;
        if (todoDetail.editState === 'edit') {
          saveData.registerId = todoDetail.register.id;
          saveData.editState = 'edit';
        } else {
          saveData.editState = 'add';
          saveData.registerId = todoDetail.editGuid;
        }

        return dispatch({
          type: 'problemmanage/tobeSave',
          payload: { saveData },
        }).then(res => {
          if (res.code === 200) {
            message.info(res.msg);
            // route.push({pathname:`/ITSM/problemmanage/besolved`})
            if (params2) {
              gotoCirapi();
            }
          } else {
            message.error(res.msg);
            // route.push({pathname:`/ITSM/problemmanage/besolved`})
          }
        });
      } 
     
    });
  };

  //  登记保存特殊处理
  const savePrevies = params2 => {
    PreviesRef.current.validateFields((err, values) => {
      const saveData = values;
      if (values.checkTime) {
        saveData.checkTime = (saveData.checkTime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        saveData.checkTime = '';
      }

      if (params2?!err:true) {
        saveData.taskId = id;
        if (todoDetail.editState === 'edit') {
          saveData.checkId = todoDetail.check.id;
          saveData.editState = todoDetail.editState;
        } else {
          saveData.checkId = todoDetail.editGuid;
          saveData.editState = 'add';
        }
        saveApi(saveData, params2);
      }
    });
  };

  const saveHandle = params2 => {
    HandleRef.current.validateFields((err, values) => {
      const saveData = values;
      if (values.handleTime) {
        saveData.handleTime = ( saveData.handleTime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        saveData.handleTime = '';
      }
      if (params2?!err:true) {
        saveData.taskId = id;
        saveData.editState = todoDetail.editState;
        if (todoDetail.editState === 'edit') {
          saveData.handleId = todoDetail.handle.id;
          saveData.editState = todoDetail.editState;
        } else {
          saveData.handleId = todoDetail.editGuid;
          saveData.editState = 'add';
        }
        saveApi(saveData, params2);
      }
    });
  };

  const saveConfirm = params2 => {
    ProblemconfirmRef.current.validateFields((err, values) => {
      if (params2?!err:true) {
        const saveData = values;
        saveData.taskId = id;
        saveData.editState = todoDetail.editState;
        if (todoDetail.editState === 'edit') {
          saveData.confirmId = todoDetail.confirm.id;
        } else {
          saveData.confirmId = todoDetail.editGuid;
        }

        if (todoDetail.flowNodeName === '确认会签') {
          saveData.confirmType = 1;
          saveData.confirmTime = '';
        } else {
          saveData.confirmType = 0;
          saveData.confirmTime = (saveData.confirmTime).format('YYYY-MM-DD HH:mm:ss');
        }
        saveApi(saveData, params2);
      }
    });
  };

  const saveClose = params2 => {
    CloseRef.current.validateFields((err, values) => {
      if (params2?!err:true) {
        const saveData = values;
        saveData.taskId = id;
        if (todoDetail.editState === 'edit') {
          saveData.closeId = todoDetail.close.id;
          saveData.editState = 'edit';
        } else {
          saveData.closeId = todoDetail.editGuid;
          saveData.editState = 'add';
        }
        saveApi(saveData, params2);
      }
    });
  };

  const saveApi = (saveData, params2) => {
    return dispatch({
      type: 'problemmanage/tobeSave',
      payload: { saveData },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        getInformation();
        if (params2) {
          gotoCirapi();
        }
      } else {
        message.error(res.msg);
      }
    });
  };

  const reasonSubmit = values => {
    dispatch({
      type: 'problemmanage/tobeBack',
      payload: { id, values },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        route.push({pathname:`/ITSM/problemmanage/besolved`})
      } else {
        message.error(res.msg);
      }
    });
  };

  const gotoCirapi = () => {
    const result = 1;
    const taskId = id;
    dispatch({
      type: 'problemmanage/gotoCirculation',
      payload: { taskId, result },
    });
  };

  const handleDelete = () => {
    const id = todoDetail.main.id;
    dispatch({
      type: 'problemmanage/delete',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        props.history.push('/ITSM/problemmanage/besolved');
      } else {
        message.error(res.msg);
      }
    });
  };


  const tabList = [
    {
      key: 'workorder',
      tab: '问题工单',
    },
    {
      key: 'process',
      tab: '问题流程',
    },
  ];

  
  const handleTabChange = key => {
    switch (key) {
      case 'workorder':
        route.push(`/ITSM/problemmanage/besolveddetail/workorder/${id}`);
        break;
      case 'process':
        route.push(`/ITSM/problemmanage/besolveddetail/process/${id}`);
        break;
      default:
        break;
    }
  }
  const { match, location } = props;

  return (
    <PageHeaderWrapper 
      title={pagetitle}
      extra={
        <>
          <>
              <Reasonregression reasonSubmit={values => reasonSubmit(values)}>
                <Button type="primary" ghost style={{ marginRight: 8 }}>
                  回退
                </Button>
              </Reasonregression>
{/* 
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSubmit(saveSign)}
              >
                保存
              </Button> */}
     
            <Button type="default">
              <Link to="/ITSM/problemmanage/problemquery">返回</Link>
            </Button>
          </>
        </>
      }
      tabList={tabList}
      tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
      onTabChange={handleTabChange}
    >
      <Card 
      >
         <Problemflow id={problemFlowid} />
      </Card>
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    todoDetail: problemmanage.todoDetail,
    reviewInfo: problemmanage.reviewInfo,
    eventtableList: problemmanage.eventtableList,
    solvingInfo: problemmanage.solvingInfo,
    confirmInfo: problemmanage.confirmInfo,
    counterInfo: problemmanage.counterInfo,
    closeInfo: problemmanage.closeInfo,
    loading: loading.models.problemmanage,
  }))(Techprocess),
);
