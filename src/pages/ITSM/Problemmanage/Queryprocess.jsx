import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Tabs,
  Upload,
  Icon,
  message,
  Select,
  Collapse,
  Steps,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import route from 'umi/router';
import Regexp, { phone_reg } from '@/utils/Regexp';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Problemworkorder from './components/Problemworkorder';
import Problemflow from './components/Problemflow';
import Problemsolving from './components/Problemsolving';
import Problemreview from './components/Problemreview';
import Problemconfirmation from './components/Problemconfirmation';
import Problemregistration from './components/Problemregistration';
import Confirmationcountersignature from './components/Confirmationcountersignature';
import Problemclosed from './components/Problemclosed';
import Associateworkorder from './components/Associateworkorder';
import Circulation from './components/Circulation';
import Reasonregression from './components/Reasonregression';
import SelectUser from '@/components/ProblemSelectuser';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;
const { Step } = Steps;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
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
let currntStatus = '';
let circulationSign = '';
let showEdit = false;
let saveSign = '';
let circaSign = 'circa';
let confirmType;
let closecircu = '关闭';
const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  multiple: true, //  支持多个文件
  showUploadList: true, //  展示文件列表
};

function Techprocess(props) {
  const pagetitle = props.route.name;
  useEffect(() => {
    getInformation();
    solvingDisbled();
  }, []);

  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
    todoDetail,
    // location: {
    //   state: { currentObj },
    // },
    todoDetail: { check, handle, confirm,close },
  } = props;

  const {
    params: { id },
  } = props.match;
  const panes = ['1', '2', '3'];
  const required = true;
  const [filelist, setFilelist] = useState([]);
  const [activekey, setActivekey] = useState(panes[0]);
  console.log(closecircu,activekey,currntStatus,'closecircu');
  // const [receiveOrders,setReceiveOrders] = useState(false);
  const list = [];
  if (todoDetail) {
    // console.log('todoDetail: ', todoDetail);
    currntStatus = Number(todoDetail.main.status);
    if((currntStatus === 69) || (currntStatus === 85)) {
      closecircu = '';
    }
    const { problemFlowLogs } = todoDetail;
    // problemFlowLogs.shift();
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
    validateFields((err, values) => {
      //  登记时间
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

      if(params2?!err:true) {
        const saveData = values;
        saveData.registerTime = formatdatetime;
        saveData.now = createDatetime;
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
            route.push({pathname:`/ITSM/problemmanage/besolved`})
            if (params2) {
              gotoCirapi();
              route.push({pathname:`/ITSM/problemmanage/besolved`})
            }
          } else {
            message.error(res.msg);
            // props.history.push(`/ITSM/problemmanage/besolved`);
          }
        });
      } 
     
    });
  };

  //  登记保存特殊处理
  const savePrevies = params2 => {
    validateFields((err, values) => {
      const saveData = values;
      if (values.checkTime) {
        const createDateZero = num => {
          return num < 10 ? '0' + num : num;
        };
        const create = new Date(values.checkTime);
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
        saveData.checkTime = createDatetime;
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
    validateFields((err, values) => {
      const saveData = values;
      if (values.handleTime) {
        const addDateZero = num => {
          return num < 10 ? '0' + num : num;
        };
        const d = new Date(values.handleTime);
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
        saveData.handleTime = formatdatetime;
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
    validateFields((err, values) => {
      const addDateZero = num => {
        return num < 10 ? '0' + num : num;
      };
      const d = new Date(values.confirmTime);
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
          saveData.confirmTime = formatdatetime;
        }
        saveApi(saveData, params2);
      }
    });
  };

  const saveCountersignature = (params2) => {
    validateFields((err, values) => {
      const addDateZero = num => {
        return num < 10 ? '0' + num : num;
      };
      const d = new Date(values.confirmTime);
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

      if (params2?!err:true) {
        const saveData = values;
        saveData.taskId = id;
        saveData.editState = todoDetail.editState;
        saveData.confirmId = todoDetail.editGuid;
        saveData.confirmTime = formatdatetime;
        saveData.confirmType = 1;
        saveApi(saveData);
      }
    });
  };

  const saveClose = params2 => {
    validateFields((err, values) => {
      if (params2?!err:true) {
        const saveData = values;
        saveData.taskId = id;
        saveData.editState = todoDetail.editState;
        if (todoDetail.editState === 'edit') {
          saveData.closeId = todoDetail.close.id;
        } else {
          saveData.closeId = todoDetail.editGuid;
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
        route.push({pathname:`/ITSM/problemmanage/besolved`})
        if (params2) {
          console.log('params2: ', params2);
          gotoCirapi();
          // props.history.goBack();
          route.push({pathname:`/ITSM/problemmanage/besolved`})
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
      tab: '事件工单',
    },
    {
      key: 'process',
      tab: '事件流程',
    },
  ];

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

              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSubmit(saveSign)}
              >
                保存
              </Button>
     
            <Button type="default">
              <Link to="/ITSM/problemmanage/problemquery">返回</Link>
            </Button>
          </>
        </>
      }
      tabList={tabList}
    >
      <Card 
      >
         <Problemflow id={todoDetail ? todoDetail.main.id : ''} />
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
  }))(Queryprocess),
);
