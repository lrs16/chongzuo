import React, { useEffect, useState } from 'react';
import {
  Table,
  Drawer,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Row,
  Col
} from 'antd';
import moment from 'moment';

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

let startTime;
let endTime;

const { Option } = Select;
// let isopen = false;
const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
function Contract(props) {
  const [visible, setVisible] = useState(false);
  const {
    form: { getFieldDecorator, setFieldsValue },
    children,
    contract,
    title,
    onSumit,
    isEdit,
  } = props;
  const [data, setData] = useState([]);
  const [deleteSign, setDeleteSign] = useState(false);

  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      switch (fieldName) {
        case 'assessYear':
        case 'assessCycle':
          // 获取季度时间
          // target.start = moment(e).startOf('quarter').format("YYYY-MM-DD");
          // target.end = moment(e).endOf('quarter').format("YYYY-MM-DD")
          target[fieldName] = e;
          setData(newData);
          break;
        case 'beginTime':
        case 'endTime':
          target[fieldName] = moment(e).format('YYYY-MM-DD');
          setData(newData);
          break;
        default:
          break;
      }
      setFieldsValue({
        phases: newData
      })
    }
  }

  const deleteObj = (key, newData) => {
    return (newData || data).filter(item => item.key !== key);
  }

  const remove = key => {
    const target = deleteObj(key);
    const newarr = target.map((item, index) => {
      return Object.assign(item, { key: index })
    })
    setData(newarr);
    setFieldsValue({
      phases: newarr
    })
    setDeleteSign(true)
  }


  useEffect(() => {
    if (deleteSign) {
      setDeleteSign(false)
    }
  }, [data, deleteSign])

  const columns = [
    {
      title: '考核年份',
      dataIndex: 'assessYear',
      key: 'assessYear',
      width: 120,
      render: (text,record,index) => {
        return (
          <DatePicker
            getPopupContainer={() => document.querySelector('.ant-drawer-body')}
            allowClear={false}
            // open={isopen}
            value={text ? moment(text.toString()):undefined}
            format='YYYY'
            mode="year"
            placeholder='请选择年份'
            // onFocus={() => { isopen = true }}
            onPanelChange={value => {
              handleFieldChange(value.format('YYYY'), 'assessYear', record.key);
              // isopen = false
            }
            }
          />
        )
      }
    },
    {
      title: '考核周期',
      dataIndex: 'assessCycle',
      key: 'assessCycle',
      width: 120,
      render: (text, record) => {
        return (
          <Select
            onChange={(e) => handleFieldChange(e, 'assessCycle', record.key)}
            style={{ width: '100%' }}
            defaultValue={text}
          >
            {/* <Option value={record.aa ? moment(`${record.aa}-01-01`) : ''}>第一季度</Option>
                <Option value={record.aa ? moment(`${record.aa}-04-01`) : ''}>第二季度</Option>
                <Option value={record.aa ? moment(`${record.aa}-07-01`) : ''}>第三季度</Option>
                <Option value={record.aa ? moment(`${record.aa}-10-01`) : ''}>第四季度</Option> */}
            {/* 现在后端自己算了 */}
            <Option value='第一周期'>第一周期</Option>
            <Option value='第二周期'>第二周期</Option>
            <Option value='第三周期'>第三周期</Option>
            <Option value='第四周期'>第四周期</Option>
          </Select>
        )
      }
    },
    {
      title: '考核时段',
      dataIndex: 'duringTime',
      key: 'duringTime',
      width: 300,
      render: (text, record) => {
        return (
          <Row>
            <Col span={10}>
              <DatePicker
                allowClear={false}
                onChange={(value) => { handleFieldChange(value.format('YYYY-MM-DD'), 'beginTime', record.key) }}
                defaultValue={record.beginTime ? moment(record.beginTime) : undefined}
                placeholder="开始时间"
                format='YYYY-MM-DD'
                style={{ minWidth: 100, width: '100%' }}
              />
            </Col>
            <Col span={1} style={{ textAlign: 'center' }}>-</Col>
            <Col span={10}>
              <DatePicker
                allowClear={false}
                onChange={(value) => { handleFieldChange(value.format('YYYY-MM-DD'), 'endTime', record.key) }}
                defaultValue={record.endTime ? moment(record.endTime) : undefined}
                placeholder="结束时间"
                format='YYYY-MM-DD'
                style={{ minWidth: 100, width: '100%' }}
              />
            </Col>
          </Row>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (text, record) => {
        return (
          <span>
            <Popconfirm
              title='是否要删除此行'
              onConfirm={() => remove(record.key)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    },
  ]

  const required = true;

  const newMember = () => {
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      assessYear: '',
      assessCycle: '',
      beginTime: '',
      endTime: '',
      editable: true,
    });
    setData(newData);
    setFieldsValue({
      phases: newData
    });
  }

  const handleopenClick = () => {
    const newarr = (contract.phases || []).map((item, index) => {
      return Object.assign(item, { editable: false, key: index + 1 })
    })
    setData(newarr);
    setFieldsValue({
      phases: newarr
    })
    setVisible(true);
  };

  const handleOk = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const newArray = data.map((item) => {
          return {
            assessYear: item.assessYear,
            assessCycle: item.assessCycle,
            beginTime: item.beginTime,
            endTime: item.endTime,
          }
        });
        const result = newArray.every((val => (
          val.assessYear && val.assessCycle && val.beginTime && val.endTime && (val.beginTime).valueOf() < (val.endTime).valueOf()
        )))
        const submitData = {
          ...values,
          phases: newArray,
          id: contract.id || '',
        };
        switch (submitData.status) {
          case '在用':
            submitData.status = '1';
            break;
          case '停用':
            submitData.status = '0';
            break;
          case '过期':
            submitData.status = '2';
            break;
          default:
            break;
        }

        if (
          moment(values.signTime).format('YYYY-MM-DD') ===
          moment(values.dueTime).format('YYYY-MM-DD')
        ) {
          message.error('签订日期必须小于到期日期哦');
        } else if (!result) { // 动态表格必填没有写完时提醒
          message.error('请填完考核周期的数据且开始时间小于结束时间才能保存');
        } else {
          onSumit(submitData);
          startTime = '';
          endTime = '';
          setVisible(false);
        }
      }
    });
  };

  const handleCancel = () => {
    startTime = '';
    endTime = '';
    setVisible(false);
  };

  const startdisabledDate = current => {
    if (endTime) {
      return current > moment(endTime);
    }

    if (!endTime && contract.dueTime) {
      return current > moment(contract.dueTime);
    }

    return null;
  };

  const enddisabledDate = current => {
    if (startTime) {
      return current < moment(startTime);
    }

    if (!startTime && contract.signTime) {
      return current < moment(contract.signTime);
    }
    return null;
  };

  const onChange = (date, dateString) => {
    startTime = dateString;
    setFieldsValue({ signTime: moment(dateString) });
    enddisabledDate(startTime);
  };

  const endonChange = (date, dateString) => {
    endTime = dateString;
    setFieldsValue({ dueTime: moment(dateString) });
    startdisabledDate(endTime);
  };

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={title}
        visible={visible}
        width={900}
        centered="true"
        maskClosable="true"
        destroyOnClose="true"
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label="合同编号">
            {getFieldDecorator('contractNo', {
              initialValue: contract.contractNo,
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="合同名称">
            {getFieldDecorator('contractName', {
              rules: [
                {
                  required,
                  message: '请输入合同名称',
                },
              ],
              initialValue: contract.contractName,
            })(<Input disabled={isEdit} />)}
          </Form.Item>

          <Form.Item label="签订日期">
            {getFieldDecorator('signTime', {
              rules: [
                {
                  required,
                  message: '请选择签订日期',
                },
              ],
              initialValue: contract.signTime ? moment(contract.signTime) : '',
            })(
              <div>
                <DatePicker
                  allowClear={false}
                  defaultValue={
                    startTime || contract.signTime ? moment(startTime || contract.signTime) : ''
                  }
                  disabled={isEdit}
                  format="YYYY-MM-DD"
                  disabledDate={startdisabledDate}
                  onChange={onChange}
                />
              </div>,
            )}
          </Form.Item>

          <Form.Item label="到期日期">
            {getFieldDecorator('dueTime', {
              rules: [
                {
                  required,
                  message: '请选择到期日期',
                },
              ],
              initialValue: contract.dueTime ? moment(contract.dueTime) : '',
            })(
              <div>
                <DatePicker
                  allowClear={false}
                  defaultValue={
                    endTime || contract.dueTime ? moment(endTime || contract.dueTime) : ''
                  }
                  disabled={isEdit}
                  format="YYYY-MM-DD"
                  disabledDate={enddisabledDate}
                  onChange={endonChange}
                />
              </div>,
            )}
          </Form.Item>

          {
            deleteSign === false && (
              <Form.Item label="考核周期">
                {getFieldDecorator('phases', {
                  rules: [
                    {
                      required,
                      message: '请填写考核周期',
                    },
                  ],
                  initialValue: data,
                })(
                  <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    style={{ overflowX: 'scroll' }}
                  />
                )}
              </Form.Item>
            )
          }

          <div style={{ textAlign: 'right', marginBottom: 18 }}>
            <Button
              style={{ width: '75%' }}
              type='primary'
              ghost
              onClick={newMember}
            >新增</Button>
          </div>

          <Form.Item label="状态">
            {getFieldDecorator('status', {
              rules: [
                {
                  required,
                  message: '请选择状态',
                },
              ],
              initialValue: contract.status,
            })(
              <Select disabled={isEdit}>
                <Option key="1" value="在用">
                  在用
                </Option>
                <Option key="0" value="停用">
                  停用
                </Option>
                <Option key="2" value="过期">
                  过期
                </Option>
              </Select>,
            )}
          </Form.Item>
        </Form>

        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>

          <Button
            onClick={handleOk}
            type="primary">
            确定
          </Button>


        </div>
      </Drawer>
    </>
  );
}

Contract.defaultProps = {
  contract: {
    no: '',
    name: '',
    signTime: '',
    dueTime: '',
    // data: new Date(),
    // enddata: new Date(),
    status: '',
  },
};
export default Form.create({})(Contract);
