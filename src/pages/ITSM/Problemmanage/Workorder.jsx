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
import styles from './index.less';
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
import SelectUser from '@/components/SelectUser';

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
let handleTime;
let  receivingTime;

function Workorder(props) {
  const pagetitle = props.route.name;
  useEffect(() => {
    getInformation();
    solvingDisbled();
    getUserinfo();
    // getNewno();
  }, []);

  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
    todoDetail,
    todoDetail: { check, handle, confirm,close },
    useInfo,
  } = props;

  const {
    params: { id },
  } = props.match;
  const panes = ['1', '2', '3'];
  const required = true;
  const [filelist, setFilelist] = useState([]);
  const list = [];
  const { problemFlowLogs } = todoDetail;
  if (todoDetail.main) {
    currntStatus = Number(todoDetail.main.status);
    console.log('currntStatus: ', currntStatus);
    if((currntStatus === 69) || (currntStatus === 85)) {
      closecircu = '';
    }
    // const { problemFlowLogs } = todoDetail;
    // problemFlowLogs.forEach(function(item) {
    //   list.push(
    //     <Step
    //       // key={item.id}
    //       // title={`${item.name}(${item.status})`}
    //       subTitle={item.name}
    //       description={`处理人:${item.formHandler}
    //                    开始时间:${item.startTime}`}
      
    //     />,

    //   );
    // });
    // list.shift();
  }

  if(todoDetail['confirmType']){
    confirmType =todoDetail.confirmType;
  }else if(confirm){
    confirmType = confirm.confirmType;
  }

  if(handle) {
    if(handle.handleTime) {
      handleTime = moment(handle.handleTime)
    }
  }else {
    handleTime = moment(new Date());
    console.log('handleTime: ', handleTime);
  }

  if(handle) {
    if(handle.addtime) {
      receivingTime = moment(handle.addtime)
    }
  }else {
    receivingTime = moment(new Date());
  }

  

  const solvingDisbled = () => {
    if ((currntStatus === 29 ) || (currntStatus === 9)) {
      showEdit = true;
    }
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
        // route.push({pathname:`/ITSM/problemmanage/besolved`})
        
        // route.push(`/ITSM/problemmanage/besolved`)
        if (params2) {
          gotoCirapi();
          // route.push({pathname:`/ITSM/problemmanage/besolved`})
          // route.push(`/ITSM/problemmanage/besolved`)
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
        route.push(`/ITSM/problemmanage/besolved`)
      } else {
        message.error(res.msg);
      }
    });
  };

  const gotoCirapi = () => {
    const result = 1;
    const taskId = id;
    return dispatch({
      type: 'problemmanage/gotoCirculation',
      payload: { taskId, result },
    }).then(res => {
      if(res.code === 200) {
        route.push(`/ITSM/problemmanage/besolved`)
      }
    })
  };

  const handleDelete = () => {
    const id = todoDetail.main.id;
    dispatch({
      type: 'problemmanage/delete',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        route.push({pathname:`/ITSM/problemmanage/besolved`})
      } else {
        message.error(res.msg);
      }
    });
  };

  const fileUpload = () => {
    return dispatch({
      type: 'problemmanage/tobaUpload',
      // payload:{saveData}
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
      } else {
        message.error(res.msg);
      }
    });
  };

  const problemHandleOrder = () => {
    return dispatch({
      type: 'problemmanage/problemHandleOrder',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        showEdit = false;
        currntStatus = 45;
        getInformation();
      } else {
        message.error(res.msg);
      }
    });
  };

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

  // const transferOrder = () => {
  //   return dispatch({
  //     type:'problemmanage/transferOrder',
  //     payload:{id}
  //   }).then(res => {
  //     if(res.code === 200) {
  //       message.info(res.msg);
  //     }else {
  //       message.error(res.msg);
  //     }
  //   })
  // }


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
    const { match } = props;
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
  const { match, children, location } = props;
  return (
    <PageHeaderWrapper 
      title={pagetitle}
      extra={
        <>
          <>
            { currntStatus === 5 && (
              <Button type="danger" ghost style={{ marginRight: 8 }} onClick={handleDelete}>
                删除
              </Button>
            )}
             {/* <Button type="danger" ghost style={{ marginRight: 8 }} onClick={handleDelete}>
                删除
              </Button> */}

            { ( currntStatus !== 5 && currntStatus !== 45) && (
              <Reasonregression reasonSubmit={values => reasonSubmit(values)}>
                <Button type="primary" ghost style={{ marginRight: 8 }}>
                  回退
                </Button>
              </Reasonregression>
            )}

            { currntStatus !== 29 && (
              <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSubmit(saveSign)}
              >
                保存
              </Button>
            )}

            {/* {
              currntStatus === 45 &&(
                <SelectUser
                taskId={id}
                currentObj={currntStatus}
                onSubmit={transferOrder}
              >
                <Button
                  type="primary"
                  style={{ marginRight: 8 }}
                  // onClick={() => handleSubmit(circaSign)}
                >
                  转单
                </Button>
              </SelectUser>

              )
            } */}


            { currntStatus === 29 && (
              <Button type="primary" style={{ marginRight: 8 }} onClick={problemHandleOrder}>
                接单
              </Button>
            )}

            {(currntStatus !== 29) && (currntStatus !== 69) && (
                <SelectUser
                taskId={id}
                currentObj={currntStatus}
                onSubmit={()=>handleSubmit(circaSign)}
              >
                <Button
                  type="primary"
                  style={{ marginRight: 8 }}
                  // onClick={() => handleSubmit(circaSign)}
                >
                  流转
                </Button>
              </SelectUser>

              )
            }

            { ((currntStatus === 69) || (currntStatus === 85)) && closecircu === ''&& (
                <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => handleSubmit(circaSign)}
              >
                流转
              </Button>
               )

            } 

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
      {/* <Card 
      >
        <div title="流转日志" style={{ backgroundColor: 'white', paddingTop: '20px' }}>
          <Steps size="small" current={list.length - 1}>{list}</Steps>
        </div>
      </Card> */}
    <div  className={styles.collapse}>
    { problemFlowLogs && (
          <Steps
          current={problemFlowLogs.length -1} 
          size="small"
          // progressDot
          style={{
            background: '#fff',
            padding: 24,
            border: '1px solid #e8e8e8',
            overflowX: 'auto',
          }}
        >
          {problemFlowLogs.map(obj => {
            const desc = (
              <div className={styles.stepDescription}>
                处理人：{obj.formHandler}
                <div>开始时间：{obj.startTime}</div>
              </div>
            );
            return <Step title={obj.name} description={desc} />;
          })}
        </Steps>
      
        )
      }

    </div>

   

  

        {/* 编辑页 */}
      {/* 问题登记 */}
      { currntStatus === 5 && (
        <>
          <Collapse 
          expandIconPosition="right" 
          style={{ backgroundColor: 'white'}}
          defaultActiveKey={['1']}
          >
            <Panel header="问题登记" key="1">
              <Row gutter={16}>
                <Form {...formItemLayout}>
                  <Col span={8}>
                    <Form.Item label="问题编号">
                      {getFieldDecorator('no', {
                        rules: [
                          {
                            // required,
                            message: '请输入问题编号',
                          },
                        ],
                        initialValue: todoDetail ? todoDetail.main.no : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="登记时间">
                      {getFieldDecorator('registerTime', {
                        rules: [
                          {
                            required,
                            message: '请输入登记时间',
                          },
                        ],
                        initialValue: todoDetail ? moment(todoDetail.register.registerTime) : moment(new Date()),
                      })(<DatePicker 
                      showTime 
                      format="YYYY-MM-DD HH:mm"
                      // disabled
                       />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="发生时间">
                      {getFieldDecorator('registerTime', {
                        rules: [
                          {
                            required,
                            message: '请输入发生时间',
                          },
                        ],
                        initialValue: todoDetail ? moment(todoDetail.register.registerTime) : moment(new Date()),
                      })(<DatePicker 
                      showTime 
                      format="YYYY-MM-DD HH:mm"
                      // disabled
                       />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="问题来源">
                      {getFieldDecorator('source', {
                        rules: [
                          {
                            // required,
                            message: '请输入问题来源',
                          },
                        ],
                        initialValue: todoDetail ? todoDetail.main.source : '',
                      })(
                        <Select>
                          <Option key={1} value="重复性分析事件">重复性分析事件</Option>
                          <Option key={2} value="事件升级">事件升级</Option>
                          <Option key={3} value="巡检发现">巡检发现</Option>
                          <Option key={4} value="系统监控发现">系统监控发现</Option>
                          <Option key={5} value="其他">其他</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="问题分类">
                      {getFieldDecorator('type', {
                        rules: [
                          {
                            // required,
                            message: '请输入问题分类',
                          },
                        ],
                        initialValue: todoDetail ? todoDetail.main.type : '',
                      })(
                        <Select>
                          <Option key={6} value="功能">功能</Option>
                          <Option key={7} value="程序">程序</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="联系电话">
                      {getFieldDecorator('phone', {
                        rules: [
                          {
                            required,
                            len: 11,
                            validator: phone_reg,
                            message: '请输入正确的手机号码',
                          },
                        ],
                        initialValue: todoDetail ? todoDetail.register.phone : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="紧急度">
                      {getFieldDecorator('emergent', {
                        rules: [
                          {
                            // required,
                            message: '请输入紧急度',
                          },
                        ],
                        initialValue: todoDetail ? todoDetail.main.emergent : '',
                      })(
                        <Select>
                          <Option  key={8} value="低">低</Option>
                          <Option  key={9} value="中">中</Option>
                          <Option  key={10} value="高">高</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="影响度">
                      {getFieldDecorator('effect', {
                        rules: [
                          {
                            // required,
                            message: '请输入影响度',
                          },
                        ],
                        initialValue: todoDetail ? todoDetail.main.effect : '',
                      })(
                        <Select>
                          <Option  key={11} value="低">低</Option>
                          <Option  key={12} value="中">中</Option>
                          <Option  key={13} value="高">高</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="优先级">
                      {getFieldDecorator('priority', {
                        rules: [
                          {
                            // required,
                            message: '请输入优先级',
                          },
                        ],
                        initialValue: todoDetail ? todoDetail.main.priority : '',
                      })(
                        <Select>
                          <Option key={14} value="低">低</Option>
                          <Option key={15} value="中">中</Option>
                          <Option key={16} value="高">高</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="建单时间">
                      {getFieldDecorator('now', {
                        rules: [
                          {
                            required,
                            message: '请输入建单时间',
                          },
                        ],
                        initialValue: todoDetail ? moment(todoDetail.now) : '',
                        })(<DatePicker 
                            showTime 
                            format="YYYY-MM-DD HH:mm"
                            disabled
                       />)}
                    </Form.Item>
                  </Col>

                  <Col span={22}>
                    <Form.Item label="问题标题" {...forminladeLayout}>
                      {getFieldDecorator('title', {
                        rules: [
                          {
                            //  required,
                            message: '请输入问题标题',
                          },
                        ],
                        initialValue: todoDetail ? todoDetail.main.title : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>

                  <Col span={23}>
                    <Form.Item label="问题描述" {...forminladeLayout}>
                      {getFieldDecorator('content', {
                        rules: [
                          {
                            //  required,
                            message: '请输入问题描述',
                          },
                        ],
                        initialValue: todoDetail ? todoDetail.main.content : '',
                      })(<TextArea />)}
                    </Form.Item>
                  </Col>

                  <Col span={23}>
                    <Form.Item label="上传附件" {...forminladeLayout}>
                      {getFieldDecorator(
                        'file',
                        {},
                      )(
                        <Upload {...props} fileList={filelist}>
                          <Button type="primary">
                            <Icon type="upload" />
                            上传附件
                          </Button>
                        </Upload>,
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="填报人">
                      {getFieldDecorator('registerUser', {
                        rules: [
                          {
                            // required,
                            message: '请输入优先级',
                          },
                        ],
                        initialValue: useInfo?useInfo.loginCode:'',
                      })(<Input disabled/>)}
                    </Form.Item>
                  </Col>

                  
                  <Col span={8}>
                    <Form.Item label="填报人单位">
                      {getFieldDecorator('registerUnit', {
                        rules: [
                          {
                            // required,
                            message: '请输入填报人单位',
                          },
                        ],
                        initialValue: '单位',
                      })(
                        <Select disabled>
                          <Option key={17} value="单位">单位</Option>
                          <Option key={18} value="部门">部门</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="填报人部门">
                      {getFieldDecorator('registerDept', {
                        rules: [
                          {
                            // required,
                            message: '请输入填报人部门',
                          },
                        ],
                        initialValue: useInfo?useInfo.deptNameExt:'',
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Form>
              </Row>
            </Panel>
          </Collapse>
        </>
      )}

      {/* 问题审核 */}
      { (currntStatus === 9 || currntStatus === 25) && (
        <>
          <Collapse
            defaultActiveKey={['1']}
            expandIconPosition="right"
            style={{ backgroundColor: 'white'}}
          >
            <Panel header="问题审核" key="1">
              <Row gutter={16}>
                <Form {...formItemLayout}>
                  <Col span={8}>
                    <Form.Item label="审核时间">
                      {getFieldDecorator('checkTime', {
                        rules:[
                          {
                            required,
                            message:'请输入审核时间'
                          }
                        ],
                        initialValue: check ? moment(check.checkTime) : moment(new Date()),
                      })(<DatePicker 
                           showTime 
                           format="YYYY-MM-DD HH:mm:ss" 
                      />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="所属项目">
                      {getFieldDecorator('checkInfo', {
                        rules:[
                        {
                          required,
                          message:'请输入所属项目'
                        }
                      ],
                        initialValue: check ? check.checkInfo : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>
               
                  <Col span={23}>
                    <Form.Item label="审核意见" {...forminladeLayout}>
                      {getFieldDecorator('checkOpinion', {
                        rules: [
                          {
                            required,
                            message: '请输入审核意见',
                          },
                        ],
                        initialValue: check ? check.checkOpinion : '',
                      })(<TextArea />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="审核人">
                      {getFieldDecorator('checkUser', {
                        // rules: [
                        //   {
                        //     required,
                        //     message: '请输入审核人',
                        //   },
                        // ],
                        initialValue: useInfo?useInfo.loginCode:'',
                      })(<Input disabled/>)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="审核单位">
                      {getFieldDecorator('checkUnit', {
                        initialValue: '单位',
                      })(<Input disabled/>)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="审核部门">
                      {getFieldDecorator('checkDept', {
                       initialValue: useInfo?useInfo.deptNameExt:'',
                      })(<Input disabled/>)}
                    </Form.Item>
                  </Col>
                </Form>
              </Row>
            </Panel>
          </Collapse>
        </>
      )}

      {/* 问题处理 */}
      { (currntStatus === 29 || currntStatus === 45)  && (
        <>
          <Collapse
            defaultActiveKey={['1']}
            expandIconPosition="right"
            style={{ backgroundColor: 'white'}}
          >
            <Panel header="问题处理" key="1">
              <Row gutter={16}>
                <Form {...formItemLayout}>
                  <Col span={8}>
                    <Form.Item label='接单时间'>
                      { getFieldDecorator('orderReceivingtime',{
                         initialValue: receivingTime
                      })(<DatePicker
                            showTime
                            disabled={showEdit}
                        />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="处理完成时间">
                      {getFieldDecorator('handleTime', {
                        rules: [
                          {
                            required,
                            message: '请输入处理完成时间',
                          },
                        ],
                        initialValue: handleTime,
                      })((<DatePicker 
                            showTime
                            disabled={showEdit}
                       />))}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="处理结果">
                      {getFieldDecorator('handleResult', {
                        required,
                        initialValue: handle ? handle.handleResult : '',
                      })(
                        <Select disabled={showEdit}>
                          <Option key={19} value="根本解决">根本解决</Option>
                          <Option key={20} value="替代解决">替代解决</Option>
                          <Option key={21} value="需要发布">需要发布</Option>
                          <Option key={22} value="误报">误报</Option>
                          <Option key={23} value="自动恢复">自动恢复</Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item label="解决方案" {...forminladeLayout}>
                      {getFieldDecorator('handleContent', {
                        rules:[
                          {
                            required,
                            message:'请输入解决方案' 
                          }
                        ],
                        initialValue: handle ? handle.handleContent : '',
                      })(<TextArea disabled={showEdit} />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="处理人">
                      {getFieldDecorator('handler', {
                        // rules: [
                        //   {
                        //     required,
                        //     message: '请输入处理人',
                        //   },
                        // ],
                        initialValue: useInfo?useInfo.loginCode:'',
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="处理单位">
                      {getFieldDecorator('handleUnit', {
                        initialValue: '单位',
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="处理部门">
                      {getFieldDecorator('handleDept', {
                        initialValue: useInfo?useInfo.deptNameExt:'',
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>


                </Form>
              </Row>
            </Panel>
          </Collapse>
        </>
      )}

      {/* 问题确认 */}
      { confirmType === '0' && (currntStatus === 65 || currntStatus === 49) &&
         (
          <>
            <Collapse
              expandIconPosition="right"
              style={{ backgroundColor: 'white'}}
              defaultActiveKey={['1']}
            >
              <Panel header="问题确认" key="1">
                <Row gutter={16}>
                  <Form {...formItemLayout}>
                  <Col span={8}>
                      <Form.Item label="确认人">
                        {getFieldDecorator('confirmUser', {
                          rules: [
                            {
                              required,
                              message: '请输入确认人',
                            },
                          ],
                          initialValue: confirm ? confirm.confirmUser : '',
                        })(<Input />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="确认单位">
                        {getFieldDecorator('confirmUnit', {
                          initialValue: confirm ? confirm.confirmUnit : '',
                        })(<Input />)}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="确认部门">
                        {getFieldDecorator('confirmDept', {
                          initialValue: confirm ? confirm.confirmDept : '',
                        })(<Input />)}
                      </Form.Item>
                    </Col>
               
                    <Col span={8}>
                      <Form.Item label="确认结果">
                        {getFieldDecorator('confirmResult', {
                          rules: [
                            {
                              required,
                              message: '请输入确认结果',
                            },
                          ],
                          initialValue: confirm ? confirm.confirmResult : '',
                        })(
                          <Select>
                            <Option key={24} value="根本解决">根本解决</Option>
                            <Option key={25} value="变通方法">变通方法</Option>
                            <Option key={26} value="无法解决">无法解决</Option>
                          </Select>,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="确认时间">
                        {getFieldDecorator('confirmTime', {
                          rules: [
                            {
                              required,
                              message: '请输入确认时间',
                            },
                          ],
                          initialValue: confirm ? moment(confirm.confirmTime) : moment(Date.now()),
                        })(<DatePicker showTime />)}
                      </Form.Item>
                    </Col>

                    <Col span={22}>
                      <Form.Item label="确认意见" {...forminladeLayout}>
                        {getFieldDecorator('confirmContent', {
                           rules: [
                            {
                              required,
                              message: '请输入确认意见',
                            },
                          ],
                          initialValue: confirm ? confirm.confirmContent : '',
                        })(<TextArea />)}
                      </Form.Item>
                    </Col>
                  </Form>
                </Row>
              </Panel>
            </Collapse>
          </>
        )}

      {/* 完成确认*/}
      { confirmType === '1' && currntStatus === 65  && (
        <>
          <Collapse
            expandIconPosition="right"
            style={{ backgroundColor: 'white'}}
            defaultActiveKey={['1']}
          >
            <Panel header="确认会签" key="1">
              <Row gutter={16}>
                <Form {...formItemLayout}>
                  <Col span={8}>
                    <Form.Item label="会签单位">
                      {getFieldDecorator('confirmUnit', {
                        initialValue: confirm?confirm.confirmUnit:''
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="会签部门">
                      {getFieldDecorator('confirmDept', {
                        initialValue: confirm?confirm.confirmDept:''
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="会签人">
                      {getFieldDecorator('confirmUser', {
                        initialValue: confirm?confirm.confirmUser:''
                      })(<Input />)}
                    </Form.Item>
                  </Col>

                  <Col span={22}>
                    <Form.Item label="会签意见" {...forminladeLayout}>
                      {getFieldDecorator('confirmContent', {
                        rules: [
                          {
                            required,
                            message: '请输入会签意见',
                          },
                        ],
                        initialValue: confirm?confirm.confirmContent:''
                      })(<TextArea />)}
                    </Form.Item>
                  </Col>
                </Form>
              </Row>
            </Panel>
          </Collapse>
        </>
      )}

      {/* 问题关闭 */}
      { (currntStatus === 69 || currntStatus === 85) && (
        <>
          <Collapse
            expandIconPosition="right"
            style={{ backgroundColor: 'white'}}
            defaultActiveKey={['1']}
          >
            <Panel header="问题关闭" key="1">
              <Row gutter={16}>
                <Form {...formItemLayout}>
                <Col span={8}>
                    <Form.Item label="关闭人">
                      {getFieldDecorator('closeUser', {
                        rules: [
                          {
                            required,
                            message: '请输入关闭人',
                          },
                        ],
                         initialValue: close?close.closeUser:''
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="关闭单位">
                      {getFieldDecorator('closeUnit', {
                        initialValue: close?close.closeUnit:''
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="关闭部门">
                      {getFieldDecorator('closeDept', {
                        initialValue: close?close.closeDept:''
                      })(<Input />)}
                    </Form.Item>
                  </Col>

                  <Col span={22}>
                    <Form.Item label="问题总结" {...forminladeLayout}>
                      {getFieldDecorator('closeContent', {
                        rules: [
                          {
                            required,
                            message: '请输入问题总结',
                          },
                        ],
                        initialValue: close?close.closeContent:''
                      })(<TextArea />)}
                    </Form.Item>
                  </Col>
                </Form>
              </Row>
            </Panel>
          </Collapse>
        </>
      )}

      {/* 展示详情页  */}
      { currntStatus !== 5 && (
        <Problemregistration
          registrationDetail={todoDetail}
          statue={currntStatus}
          // queryStatue={queryStatue}
        />
      )}

      { currntStatus >= 29 && (
        <Problemreview reviesDetail={todoDetail} />
      )}

      { currntStatus > 45 && (
        <Problemsolving solvingDetail={todoDetail} />
      )}

      { currntStatus > 65 && (
        <Problemconfirmation confirmationDetail={todoDetail} />
      )}

      {/* {currntStatus > 65 && (
        <Confirmationcountersignature countersignatureDetail={todoDetail} />
      )} */}

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
    newno: problemmanage.newno,
    useInfo: problemmanage.useInfo,
    loading: loading.models.problemmanage,
  }))(Workorder),
);
