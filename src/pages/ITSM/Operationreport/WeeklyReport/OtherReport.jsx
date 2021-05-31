import React, { useEffect, useRef, useState } from 'react';
import {
  Form,
  Card,
  Button,
  Row,
  Col,
  Input,
  DatePicker,
  Table,
  Popconfirm,
  Divider,
  Icon
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';
import Development from './components/Development';
import ThisweekMaintenance from './components/ThisweekMaintenance';
import ServiceCompletion from './components/ServiceCompletion';
import ThisWeekitsm from './components/ThisWeekitsm';
import SoftCompletion from './components/SoftCompletion';
import RemainingDefects from './components/RemainingDefects';
import LastweekHomework from './components/LastweekHomework';
import NextweekHomework from './components/NextweekHomework';
import ServiceTableone from './components/ServiceTableone';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysUpload from '@/components/SysUpload';

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  },
};

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
const formincontentLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const { RangePicker } = DatePicker;
const { TextArea } = Input;
let startTime;
let monthStarttime;
let endTime;
function OtherReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    match: { params: { id } },
    dispatch,
    loading,
  } = props;
  let tabActiveKey = 'week';


  const required = true;
  const saveformRef = useRef();
  const developmentformRef = useRef();
  const thisWeekitsmRef = useRef();
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  // const [tableIndex, setTableIndex] = useState('1');
  const [secondbutton, setSecondbutton] = useState(false);
  const [addTitle, setAddTitle] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [fileslist, setFilesList] = useState([]);
  const [expand, setExpand] = useState(false);
  
  useEffect(() => {
    const resultColumns = [...initiacColumn]
    setColumns([...resultColumns])
  }, [])

  const titleNumber = (index) => {
    return `标题${9 + index}`
  }

  //  保存表单
  const softReportform = () => {
    props.form.validateFields((err, value) => {
      console.log('value: ', value);
    })
  }

  const defaultTime = () => {
    //  周统计
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
  }

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      softReportform();
    }
  }, [files]);


  // 上传删除附件触发保存
  useEffect(() => {
    defaultTime();
  }, [loading]);

  const handleBack = () => {
    router.push('/ITSM/operationreport/weeklyreport/myweeklyreport');
  }

  console.log(loading,startTime)



  const onChange = () => {
    validateFields((err, value) => {
      startTime = moment(value.time1[0]).format('YYYY-MM-DD');
      endTime = moment(value.time1[1]).format('YYYY-MM-DD');
    })
  }

  const newMember = () => {
    const nowNumber = addTitle.map(item => ({ ...item }));
    nowNumber.push({ 'add': '1', tableNumber: [] });
    setAddTitle(nowNumber)
  }

  const addTable = (index) => {
    const nowNumber = addTitle.map(item => ({ ...item }));
    nowNumber[index].tableNumber.push({ columns: 'aa' });
    console.log('nowNumber: ', nowNumber);
    setAddTitle(nowNumber);
  }

  // 新增一条记录
  const handleAddrows = (params) => {
    setFilesList([]);
    // setKeyUpload('');
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      id: '',
      addTime1: '新增数据',
      addTime2: '',
      addTime3: 'dd',
      addTime4: '',
      isNew: true
    });
    setData(newData);
    // setNewButton(true);
  };


  const remove = (index) => {
    addTitle.splice(index, 1);
    const resultArr = [];
    for (let i = 0; i < addTitle.length; i++) {
      resultArr.push(addTitle[i])
    }
    setAddTitle(resultArr)
  }


  const removeTable = (index, tableIndexs) => {
    addTitle.map(item => ({ ...item }));
    (addTitle[index].tableNumber).splice(tableIndexs, 1)
    const resultTable = [];
    for (let i = 0; i < addTitle.length; i++) {
      resultTable.push(addTitle[i])
    }
    setAddTitle(resultTable)
  }



  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }


  // 编辑记录
  const toggleEditable = (e, key, record) => {

    e.preventDefault();
    const newData = data.map(item => ({ ...item })
    );
    const target = getRowByKey(key, newData);
    if (target) {
      if (!target.editable) {
        setcacheOriginData({ key: { ...target } });
      }
      // target.editable = !target.editable;
      target.isNew = true;
      setData(newData);
    }
  }

  //  点击编辑生成filelist
  const handlefileedit = (key, values) => {
    if (!values) {
      setFilesList([]);
    } else {
      setFilesList(JSON.parse(values))
    }
  }

  const savedata = (target, id) => {
  }

  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};

    delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    savedata(target, id);
    if (target.isNew) {
      target.isNew = false;
      // setNewButton(false);
    }
  }


  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }




  const initiacColumn = [
    {
      title: '测试表头1',
      dataIndex: 'addTime1',
      key: 'addTime1',
      width: 150,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'addTime1', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '测试表头2',
      dataIndex: 'addTime2',
      key: 'addTime2',
      width: 150,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'addTime2', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '测试表头3',
      dataIndex: 'addTime3',
      key: 'addTime3',
      width: 150,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'addTime3', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '测试表头4',
      dataIndex: 'addTime4',
      key: 'addTime4',
      width: 150,
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'addTime4', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        // if (record.editable) {
        if (record.isNew === true) {
          return (
            <span>
              <a onClick={e => saveRow(e, record.key)}>保存</a>
              <Divider type='vertical' />
              <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }
        // }

        return (
          <span>
            <a
              onClick={e => {
                toggleEditable(e, record.key, record);
                // handlefileedit(record.key, record.attachment)
              }}
            >编辑</a>
            <Divider type='vertical' />
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ];

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button type='primary'>导出</Button>
          <Button type='primary' onClick={softReportform}>保存</Button>
          <Button type='primary' onClick={handleBack}>
            返回
          </Button>
        </>
      }
    >
      <Card>
        { startTime && (
          <Row gutter={16}>
            <Form {...formItemLayout}>

              <Col span={8}>
                <Form.Item label='周报名称'>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required,
                        message: '请输入周报名称'
                      }
                    ]
                  })
                    (
                      <Input />
                    )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label='起始时间'>
                  {getFieldDecorator('time1', {
                    initialValue: [moment(startTime), moment(endTime)]
                  })(<RangePicker
                    allowClear={false}
                    // disabledDate={startdisabledDate}
                    // placeholder='请选择'
                    onChange={onChange}
                  />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label='描述' {...formincontentLayout}>
                  {
                    getFieldDecorator('content1', {})(<TextArea />)
                  }
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label='上传附件'
                  {...formincontentLayout}
                >
                  {getFieldDecorator('field1', {})
                    (
                      <div style={{ width: 400 }}>
                        <SysUpload
                          fileslist={[]}
                          ChangeFileslist={newvalue => {
                            setFieldsValue({ field2: JSON.stringify(newvalue.arr) })
                            setFilesList(newvalue);
                            setFiles(newvalue)
                          }}
                        />
                      </div>
                    )}

                </Form.Item>
              </Col>

              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="primary"
                ghost
                onClick={() => newMember()}
                icon="plus"
                disabled={secondbutton}
              >
                新增
            </Button>


              {loading === false && (
                addTitle.map((item, index) => {
                  return (
                    <>
                      <Col span={24}>
                        <Form.Item label={titleNumber(index)} {...formincontentLayout}>
                          {getFieldDecorator(`title${index}`, {
                          })(
                            <>
                              <Input style={{ width: '60%', marginRight: 8 }} />
                              <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => remove(index)}
                              />
                            </>
                          )}
                        </Form.Item>
                      </Col>


                      <Col span={24}>
                        <Form.Item label='内容' {...formincontentLayout}>
                          {getFieldDecorator(`content${index}`, {

                          })(
                            <TextArea />
                          )}
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item label='上传附件'    {...formincontentLayout}>
                          {getFieldDecorator(`field${index}`, {

                          })(
                            <SysUpload
                              fileslist={[]}
                              ChangeFileslist={newvalue => {
                                setFieldsValue({ field1: JSON.stringify(newvalue.arr) })
                                // setFilesList(newvalue)
                              }}
                            />
                          )}
                        </Form.Item>
                      </Col>

                      <div style={{ display: 'block' }}>
                        <Button
                          type='primary'
                          onClick={() => addTable(index)}
                        >添加表格</Button>
                        {/* </Col> */}

                        {/* <Col span={24} style={{ textAlign: 'right' }}> */}

                        {/* <Button
                        type='primary'
                      >添加列</Button> */}

                      </div>

                      {
                        (addTitle[index].tableNumber).map((items,tableIndex) => {
                          return (
                            <>
                              <>
                                <Button
                                  style={{marginTop:10}}
                                  onClick={() => handleAddrows(index)}
                                  type='primary'
                                >添加行</Button>
                                <div style={{ display: 'flex' }}>
                                  <Col span={22}>
 
                                    <Table
                                      columns={initiacColumn}
                                      dataSource={data}
                                    />
                                  </Col>

                                  <Col span={2}>
                                    <Icon
                                      className="dynamic-delete-button"
                                      type="minus-circle-o"
                                      onClick={() => removeTable(index, tableIndex)}
                                    />
                                  </Col>
                                </div>

                              </>

                            </>
                          )
                        })
                      }
                    </>
                  )
                })
              )
              }

            </Form>
          </Row>

        )}

      </Card>
    </PageHeaderWrapper>

  )
}

export default Form.create({})(
  connect(({ thisweekly, loading }) => ({
    loading: loading.models.thisweekly,
  }))(OtherReport),
);
