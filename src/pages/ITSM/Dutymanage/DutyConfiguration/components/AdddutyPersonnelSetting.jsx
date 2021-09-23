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
import { connect } from 'dva';
import styles from '../index.less';
import SysDict from '@/components/SysDict';

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
    form: { getFieldDecorator, validateFields, setFieldsValue },
    title,
    children,
    onSubmit,
    onDelete,
    loading,
    dispatch,
    searchUsersarr,
    personnelSetting
  } = props;
  const [directorlist, setDirectorlist] = useState([]); 
  const [spinloading, setSpinLoading] = useState(true);
  const [select, setSelect] = useState([]);
  const [selectdata, setSelectData] = useState('');
  const required = true;

  console.log(personnelSetting, 'personnelSetting')
  // 自动完成责任人
  // 自动完成责任人
  const directoruser = directorlist.map((opt, index) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      {/* <Spin spinning={spinloading}> */}
      <div className={styles.disableuser}>
        <span>{opt.userName}</span>
      </div>
      {/* </Spin> */}
    </Option>
  ));

  //  请求选人
  const SearchDisableduser = (value, type) => {
    const requestData = {
      providerName: value,
      pageNum: 1,
      pageSize: 1000,
      status: '1',
    };
    switch (type) {
      case 'director':
        searchUsers({ userName: value }).then(res => {
          if (res) {
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
        id:personnelSetting.id || '',
        ...values
      }
      if (!err) {
        onSubmit(newdata);
        setVisible(false)
      }
    })
  }

  const handleDelete = (id) => {
    onDelete(id)
  }

  const handleChange = (value, option,type) => {
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
    const { id, userMobile, deptNameExt, assessType, userName } = opt.props.disableuser;
    switch (type) {
      case 'director':
        setFieldsValue({
          staffName: userName, // 用户名称
          directorId: id, // 用户id
          deptName: deptNameExt,
          phone: userMobile
        });
        break;

      default:
        break;
    }
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  const teamname = getTypebyTitle('班组名称');
  const teamjobName = getTypebyTitle('所属岗位');


  return (
    <>
      <SysDict
        typeid="1438058740916416514"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      {withClick(children, handleopenClick)}
      <Drawer
        visible={visible}
        title={title}
        width={720}
        centered='true'
        maskClosable='true'
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label="责任人">
            {getFieldDecorator('staffName', {
              rules: [
                {
                  required,
                  message: '请选择责任人',
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

          <Form.Item style={{display:'none'}}>
            {
              getFieldDecorator('userId',{
                initialValue:personnelSetting.userId
              })
            }
          </Form.Item>

          <Form.Item label='所属部门'>
            {
              getFieldDecorator('deptName', {
                // rules: [
                //   {
                //     required,
                //     message: '请输入所属部门'
                //   }
                // ],
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
                <Select placeholder="请选择" onChange={(value, option)=>handleChange(value, option,'jobName')}>
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



          <Form.Item label='班组名称'>
            {getFieldDecorator('groupId', {
              rules: [
                {
                  required,
                  message: '请选择班组名称'
                }
              ],
              initialValue: personnelSetting.groupId
            })(
              <Select placeholder="请选择" onChange={(value, option)=>handleChange(value, option,'group')}>
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
                // rules: [
                //   {
                //     required,
                //     message: '请输入联系电话'
                //   }
                // ]
              })(<Input disabled />)
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

          {/* {
            id && (
              <Button onClick={handleDelete} type='danger' ghost>
                删除
              </Button>
            )
          } */}




        </div>
      </Drawer>
    </>
  )
}
AdddutyPersonnelSetting.defaultProps = {
  personnelSetting: {
    staffName: '',
    userId:'',
    deptName: '',
    deptId: '',
    groupId: '',
    jobName: '',
    jobId: ''
  }
}


export default Form.create({})(
  connect(({ dutyandtypesetting, loading }) => ({
    searchUsersarr: dutyandtypesetting.searchUsersarr,
    loading: loading.models.dutyandtypesetting
  }))(AdddutyPersonnelSetting)
)