import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, message, Spin, Checkbox, Divider, Form, Input, Row, Col } from 'antd';
import styles from '@/components/SelectUser/index.less';

const { TextArea } = Input;

function TemporarySelectUser(props) {
  const { dispatch, visible, taskId, type, userlist, ChangeUserVisible, indexUser, title, form, GetVal, gobacknode, taskName } = props;
  const { getFieldDecorator, validateFields, resetFields, setFieldsValue } = form;
  // const [value, setValue] = useState('');
  const required = true;

  useEffect(() => {
    if (taskId && type === '1' && visible) {
      dispatch({
        type: 'releasetemp/getuserlist',
        payload: {
          taskId,
          type,
        },
      });
    };
  }, [visible]);

  useEffect(() => {
    if (indexUser && indexUser.length && indexUser > 0) {
      setFieldsValue({ assignee: indexUser.join(',') })
    }
  }, [indexUser]);

  const handleOk = () => {
    validateFields((err, val) => {
      if (!err) {
        if (taskName === '发布验证') {
          if (type === '1') {
            const newArr = userlist && userlist.userList.map(item => item.userId)
            GetVal({ ...val, assignee: newArr.join(','), taskId, type });
            ChangeUserVisible(false);
          } else {
            GetVal({ ...val, taskId, type });
            ChangeUserVisible(false);
          };
        } else {
          GetVal({ ...val, taskId, type });
          ChangeUserVisible(false);
        }
      }
    });
  }

  const handleCancel = () => {
    ChangeUserVisible(false);
    resetFields();
  };

  const dataArr = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      if (datas[i].id === undefined) {
        const vote = {};
        vote.label = datas[i].userName;
        vote.value = datas[i].userId;
        newArr.push(vote);
      } else {
        const vote = {};
        vote.label = datas[i].userName;
        vote.value = datas[i].id;
        newArr.push(vote);
      }
    }

    return newArr;
  };

  // 多选下一环节人员
  const handleChange = checkedValues => {
    // setValue(checkedValues);
    // sessionStorage.setItem('NextflowUserId', checkedValues.join(','));
    setFieldsValue({ assignee: checkedValues.join(',') })
  };

  return (
    <Modal
      visible={visible}
      title={type === '4' && taskName === '版本管理员审核' ? '填写取消发布说明' : `填写${title}`}
      onOk={handleOk}
      onCancel={handleCancel}
      width={700}>
      <Row>
        <Form>
          {type === '1' && taskName !== '发布验证' && (<div>
            {userlist && (
              <div id='user'>
                {userlist?.describe || ''}
                {taskName !== '业务复核' && (<div style={{ marginTop: 12 }} className={styles.useritem}>
                  <Checkbox.Group
                    defaultValue={indexUser}
                    options={dataArr(userlist.userList)}
                    onChange={handleChange}
                  />
                </div>)}
              </div>
            )}
            {taskName !== '业务复核' && (<Form.Item >
              {getFieldDecorator('assignee', {
                rules: [{ required, message: '最少选择一个处理人！' }]
              })(<></>)}
            </Form.Item>)}
          </div>)}
          {type === '3' && gobacknode && (<div>回退至{gobacknode}</div>)}
          <Col span={24}>
            <Form.Item label={type === '4' && taskName === '版本管理员审核' ? '取消发布说明' : title}>
              {
                getFieldDecorator('remark', {
                  rules: [
                    {
                      required,
                      message: type === '4' && taskName === '版本管理员审核' ? '请填写取消发布说明' : `请填写${title}`
                    }
                  ]
                })(<TextArea rows={5} />)
              }

            </Form.Item>
          </Col>
        </Form>
      </Row>
    </Modal>
  );
}

export default Form.create()(
  connect(({ releasetemp, loading }) => ({
    userlist: releasetemp.userlist,
    loading: loading.models.releasetemp,
  }))(TemporarySelectUser)
);