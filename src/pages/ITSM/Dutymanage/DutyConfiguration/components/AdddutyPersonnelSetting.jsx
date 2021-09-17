import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  AutoComplete,
  DatePicker,
  Switch,
  Select,
  Spin,
  Col
} from 'antd';
import moment from 'moment';
import { operationPerson, searchUsers } from '@/services/common';
import styles from '../index.less';

const { Search } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}

let startTime;
let endTime;
let show = true;

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />
}

function AdddutyPersonnelSetting(props) {
  const [visible, setVisible] = useState(false);
  const {
    form: { getFieldDecorator, validateFields },
    title,
    children,
    onSubmit,
    id,
    onDelete
  } = props;
  const [directorlist, setDirectorlist] = useState([]); // 详细条款
  const [spinloading, setSpinLoading] = useState(true);
  const [select, setSelect] = useState([])
  const required = true;

  console.log(directorlist, 'directorlist')
  // 自动完成责任人
  // 自动完成责任人
  const directoruser = directorlist.map((opt, index) => (
    show = true,
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.userName}</span>
        </div>
      </Spin>
    </Option>
  ));

  console.log(directoruser, 'directoruser')

  //  请求选人
  const SearchDisableduser = (value, type) => {
    const requestData = {
      providerName: value,
      pageNum: 1,
      pageSize: 1000,
      status: '1',
    };
    switch (type) {
      // case 'provider':
      //   providerList({ ...requestData }).then(res => {
      //     if (res) {
      //       const arr = [...res.data.records];
      //       setSpinLoading(false);
      //       setDisabledList(arr);
      //     }
      //   });
      //   break;
      // case 'contract':
      //   if (!providerId) {
      //     message.error('请先选择服务商哦');
      //   } else {
      //     contractProvider(providerId).then(res => {
      //       if (res) {
      //         const arr = [...res.data];
      //         setSpinLoading(false);
      //         setContractlist(arr);
      //       }
      //     });
      //   }

      //   break;
      // case 'score':
      //   scoreListpage({
      //     scoreName: value,
      //     pageNum: 1,
      //     pageSize: 1000,
      //   }).then(res => {
      //     if (res) {
      //       const arr = [...res.data.records];
      //       setSpinLoading(false);
      //       setScorelist(arr);
      //     }
      //   });
      //   break;
      // case 'clause':
      //   searchUsers({ ...requestData, scoreId, targetId: target2Type }).then(res => {
      //     if (res) {
      //       const arr = [...res.data.records];
      //       setSpinLoading(false);
      //       setScorelist(arr);
      //     }
      //   });
      //   break;
      case 'director':
        searchUsers({ userName: value }).then(res => {
          if (res) {
            const arr = [...res.data];
            show = false;
            setSpinLoading(false);
            setDirectorlist(arr);
          }
        });
        break;
      default:
        break;
    }
  };

  const handleopenClick = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
        setVisible(false)
      }
    })
  }

  const handleDelete = (id) => {
    onDelete(id)
  }

  const startOnchange = (time, timeString) => {
    startTime = timeString
    console.log('timeString: ', timeString);
  }

  const endOnchange = (time, timeString) => {
    endTime = timeString
  }

  const disabledHours = (time1, time2, time3) => {
    if (startTime) {
      const hours = startTime.split(':');
      const nums = [];
      for (let i = 0; i < hours[0] - 1; i += 1) {
        nums.push(i + 1);
      }
      return nums;
    }

  }

  const startdisabledHours = () => {
    if (endTime) {
      const hours = endTime.split(':');
      console.log('hours: ', hours);
      const nums = [];
      for (let i = 0; i < 24 - hours[0]; i += 1) {
        nums.push(Number(hours[0]) + i);
      }

      console.log(nums, 'nums')
      return nums;
    }
  }

  const disabledMinutes = (time1, time2, time3) => {

  }

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        visible={visible}
        title={title}
        width={720}
        centered='true'
      >
        <Form {...formItemLayout}>
          <Form.Item label="责任人">
            {getFieldDecorator('directorName', {
              rules: [
                {
                  required,
                  message: '请选择责任人',
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>

          <Form.Item label='所属部门'>
            {
              getFieldDecorator('unit', {
                rules: [
                  {
                    required,
                    message: '请输入所属部门'
                  }
                ]
              })(<Input />)
            }

          </Form.Item>

          <Form.Item label='所属岗位'>
            {
              getFieldDecorator('position', {
                rules: [
                  {
                    required,
                    message: '请选择所属岗位'
                  }
                ],

              })(<Input />)
            }

          </Form.Item>
          <Form.Item label='所属班组'>
            {
              getFieldDecorator('Team', {
                rules: [
                  {
                    required,
                    message: '请选择所属班组'
                  }
                ]
              })(<Input />)
            }

          </Form.Item>
          <Form.Item label='联系电话'>
            {
              getFieldDecorator('iphone', {
                rules: [
                  {
                    required,
                    message: '请输入联系电话'
                  }
                ]
              })(<Input />)
            }
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

          <Button onClick={handleOk} type='primary' style={{ marginRight: 8 }}>
            确定
          </Button>

          {
            id && (
              <Button onClick={handleDelete} type='danger' ghost>
                删除
              </Button>
            )
          }




        </div>
      </Drawer>
    </>
  )
}

export default Form.create({})(AdddutyPersonnelSetting)