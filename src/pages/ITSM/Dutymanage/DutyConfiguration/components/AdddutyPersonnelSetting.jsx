import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  AutoComplete,
  Select,
  message,
  Spin
} from 'antd';
import { phone_reg } from '@/utils/Regexp';
import { searchUsers } from '@/services/common';
import { connect } from 'dva';
import SysDict from '@/components/SysDict';
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

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />
}

function AdddutyPersonnelSetting(props) {
  const [visible, setVisible] = useState(false);
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    title,
    children,
    onSubmit,
    personnelSetting
  } = props;
  const [directorlist, setDirectorlist] = useState([]);
  const [spinloading, setSpinLoading] = useState(true);
  const [selectdata, setSelectData] = useState('');
  const required = true;

  // 自动完成责任人
  const directoruser = directorlist.map((opt) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <Spin spinning={spinloading}>
        <div className={styles.disableuser}>
          <span>{opt.userName}</span>
        </div>
      </Spin>
    </Option>
  ));

  //  请求选人
  const SearchDisableduser = (value, type) => {
    switch (type) {
      case 'director':
        searchUsers({ userName: value }).then(res => {
          if (res.code === 200) {
            const arr = [...res.data];
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
      const newdata = {
        id: personnelSetting.id || '',
        ...values
      }
      if (!err) {
        if (values.staffName) {
          onSubmit(newdata);
          setVisible(false)
        } else {
          message.error('请通过值班人员下拉值形式选择值班人员')
        }
      }
    })
  }

  const handleChange = (value, option, type) => {
    const { values } = option.props;
    switch (type) {
      case 'jobName':
        setFieldsValue(
          {
            jobName: values,
          }
        )
        break;

      case 'group':
        setFieldsValue(
          {
            groupName: values,
          }
        )
        break;

      default:
        break;
    }
  }

  // 选择下拉值，信息回填
  const handleDisableduser = (v, opt, type) => {
    const { id, userMobile, deptNameExt, deptId, userName } = opt.props.disableuser;
    switch (type) {
      case 'director':
        setFieldsValue({
          staffName: userName, // 用户名称
          teststaffName: userName,
          userId: id, // 用户id
          deptId,
          deptName: deptNameExt,
          phone: userMobile
        });
        break;

      default:
        break;
    }
  };

  const getTypebyTitle = titles => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === titles)[0].children;
    }
    return []
  };

  const teamname = getTypebyTitle('班组名称');
  const teamjobName = getTypebyTitle('所属岗位');

  return (
    <>
      <SysDict
        typeid='1021'
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      {withClick(children, handleopenClick)}
      <Drawer
        visible={visible}
        title={title}
        width={720}
        centered="true"
        destroyOnClose
        maskClosable
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label="值班人员">
            {getFieldDecorator('teststaffName', {
              rules: [
                {
                  required,
                  message: '请选择值班人员',
                },
              ],
              initialValue: personnelSetting.staffName,
            })(
              <AutoComplete
                dataSource={directoruser}
                dropdownMatchSelectWidth={false}
                getPopupContainer={e => e.parentNode}
                dropdownStyle={{ width: 600 }}
                onSelect={(v, opt) => handleDisableduser(v, opt, 'director')}
              >
                <Search
                  placeholder="可输入人名称搜索"
                  onSearch={values => SearchDisableduser(values, 'director')}
                  allowClear
                />
              </AutoComplete>,
            )}
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {
              getFieldDecorator('staffName', {
                initialValue: personnelSetting.staffName
              })(<Input />)
            }
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {
              getFieldDecorator('userId', {
                initialValue: personnelSetting.userId
              })(<Input />)
            }
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {
              getFieldDecorator('deptId', {
                initialValue: personnelSetting.deptId
              })(<Input />)
            }
          </Form.Item>

          <Form.Item label='所属部门'>
            {
              getFieldDecorator('deptName', {
                initialValue: personnelSetting.deptName
              })(<Input disabled />)
            }

          </Form.Item>

          <Form.Item label='所属部门' style={{ display: 'none' }}>
            {
              getFieldDecorator('deptId', {
                initialValue: personnelSetting.deptId
              })(<Input />)
            }
          </Form.Item>

          <Form.Item label='所属岗位'>
            {
              getFieldDecorator('jobId', {
                rules: [
                  {
                    required,
                    message: '请选择所属岗位'
                  }
                ],
                initialValue: personnelSetting.jobId
              })(
                <Select placeholder="请选择" onChange={(value, option) => handleChange(value, option, 'jobName')}>
                  {teamjobName.map(obj => [
                    <Option
                      key={obj.key}
                      values={obj.title}
                    >
                      {obj.title}
                    </Option>
                  ])}
                </Select>
              )
            }
          </Form.Item>

          <Form.Item label='' style={{ display: 'none' }}>
            {
              getFieldDecorator('jobName', {
                initialValue: personnelSetting.jobName
              })(<Input />)
            }
          </Form.Item>

          <Form.Item label='所属班组'>
            {getFieldDecorator('groupId', {
              rules: [
                {
                  required,
                  message: '请选择所属班组'
                }
              ],
              initialValue: personnelSetting.groupId
            })(
              <Select placeholder="请选择" onChange={(value, option) => handleChange(value, option, 'group')}>
                {teamname.map(obj => [
                  <Option
                    key={obj.key}
                    values={obj.title}
                  >
                    {obj.title}
                  </Option>
                ])}
              </Select>
            )}
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator('groupName', {
              initialValue: personnelSetting.groupName
            })(<Input />)}
          </Form.Item>

          <Form.Item label='联系电话'>
            {
              getFieldDecorator('phone', {
                rules: [
                  {
                    required,
                    len: 11,
                    validator: phone_reg,
                    message: '请输入正确的手机号',
                  },
                ],
                initialValue: personnelSetting.phone
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
        </div>
      </Drawer>
    </>
  )
}

AdddutyPersonnelSetting.defaultProps = {
  personnelSetting: {
    staffName: '',
    userId: '',
    deptName: '',
    deptId: '',
    groupId: '',
    jobName: '',
    jobId: '',
  }
}

export default Form.create({})(
  connect(({ dutyandtypesetting, loading }) => ({
    searchUsersarr: dutyandtypesetting.searchUsersarr,
    loading: loading.models.dutyandtypesetting
  }))(AdddutyPersonnelSetting)
)