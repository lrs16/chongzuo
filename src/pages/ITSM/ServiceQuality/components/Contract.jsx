import React, { useState } from 'react';
import { Table, Drawer, Form, Input, Button, DatePicker, Select, message } from 'antd';
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
  const [newbutton, setNewButton] = useState(false);

  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      if(fieldName === 'bb') {
        console.log(moment(e).startOf('quarter').format("YYYY-MM-DD"),'e')
        console.log(moment(e).endOf('quarter').format("YYYY-MM-DD"),'e4')
        target.dd =  e
      } else {
        target[fieldName] = e;
        setData(newData)
      }
    }
  }

  // console.log(moment().format("YYYY-02-01").startOf('quarter').format("YYYY-MM-DD"), 'quarter')

  const columns = [
    {
      title: '考核年份',
      dataIndex: 'aa',
      key: 'aa',
      render: (text, record) => {
        return (
          <DatePicker
            value={moment(text)}
            format='YYYY'
            mode="year"
            onPanelChange={value => handleFieldChange(value.format('YYYY'), 'aa', record.key)}
          />
        )
      }
    },
    {
      title: '考核周期',
      dataIndex: 'bb',
      key: 'bb',
      render: (text, record) => {
        return (
          <Select onChange={(e) => handleFieldChange(e,'bb',record.key)}>
            <Option value={record.aa ? moment(`${record.aa}-01-01`):''}>第一季度</Option>
            <Option value={record.aa ? moment(`${record.aa}-04-01`):''}>第二季度</Option>
            <Option value={record.aa ? moment(`${record.aa}-07-01`):''}>第三季度</Option>
            <Option value={record.aa ? moment(`${record.aa}-10-01`):''}>第四季度</Option>
          </Select>
        )
      }
    },
    {
      title: '考核时段',
      dataIndex: 'cc',
      key: 'cc'
    },
    {
      title: '操作',
      dataIndex: '',
      key: ''
    },
  ]

  const required = true;

  const newMember = () => {
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      aa: moment().format('YYYY'),
      bb: '',
      cc: '',
      dd:'',
      editable: true,
    });
    setData(newData);
    setNewButton(true);
  }

  const handleopenClick = () => {
    setVisible(true);
  };

  const handleOk = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        const submitData = {
          ...values,
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
        width={720}
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
                  message: '请输入签订日期',
                },
              ],
              initialValue: contract.signTime ? moment(contract.signTime) : '',
            })(
              <div>
                <DatePicker
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
                  message: '请输入到期日期',
                },
              ],
              initialValue: contract.dueTime ? moment(contract.dueTime) : '',
            })(
              <div>
                <DatePicker
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

          {/* <Form.Item label="考核周期">
            {getFieldDecorator('dueTime', {
              rules: [
                {
                  required,
                  message: '请输入到期日期',
                },
              ],
              initialValue: '',
            })(
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
              />
            )}
          </Form.Item>

          <Button
            style={{ width: '100%', marginTop: '16', marginBottom: '8' }}
            type='primary'
            ghost
            onClick={newMember}
          >新增</Button> */}

          <Form.Item label="状态">
            {getFieldDecorator('status', {
              rules: [
                {
                  required,
                  message: '请输入状态',
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

          <Button onClick={handleOk} type="primary">
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
