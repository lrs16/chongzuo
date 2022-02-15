import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, message, Spin, Checkbox, Divider } from 'antd';
import styles from './index.less';

const User = props => {
  const {
    dispatch,
    // defaultvalue,
    // demandvalue,
    userlist,
    loading,
    changorder,
    taskId,
    visible,
    ChangeUserVisible,
    ChangeChoice,
    ChangeType,
    describe,
    indexUser,      // 默认选中人
    defaultUsers,   //
  } = props;
  // const [isnew, setIsNew] = useState(false);
  const [demandvalue, setDemandValue] = useState([])
  const [defaultvalue, setDefaultValue] = useState([])
  const type = sessionStorage.getItem('Processtype');

  // useEffect(() => {
  //   if (loading) {
  //     setIsNew(true);
  //   }
  //   return () => {
  //     setIsNew(false);
  //     setDemandValue([]);
  //     setDefaultValue([]);
  //   };
  // }, [userlist]);

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

  const [value, setValue] = useState('');


  // 单选下一环节人员
  // const handleChange = e => {
  //   setValue(e.target.value);
  //   sessionStorage.setItem('NextflowUserId', e.target.value);
  // };
  // 多选下一环节人员
  const handleChange = checkedValues => {
    setValue(checkedValues);
    sessionStorage.setItem('NextflowUserId', checkedValues.join(','));
  };

  // 需求多选下一环节人员
  const handledemandChange = (values, nodeName, key) => {
    const obj = {};
    obj.nodeName = nodeName;
    obj.userIds = values;
    const data = demandvalue.map(item => ({ ...item }));
    const target = data.filter((item) => item.nodeName === nodeName)[0];
    if (target) {
      if (values.length === 0) {
        const newArr = demandvalue.filter((item) => item.nodeName !== nodeName);
        setDemandValue(newArr);
        sessionStorage.setItem('NextflowUserId', JSON.stringify(newArr));
      } else {
        target.userIds = values;
        setDemandValue(data);
        sessionStorage.setItem('NextflowUserId', JSON.stringify(data));
      }
    } else {
      data.push(obj);
      setDemandValue(data);
      sessionStorage.setItem('NextflowUserId', JSON.stringify(data));
    };
  };

  useEffect(() => {
    if (changorder !== undefined && type === 'event') {
      sessionStorage.setItem('Nextflowmane', changorder);
      sessionStorage.setItem('flowtype', '3');
    }
  }, [changorder]);

  const showModal = () => {
    switch (type) {
      case 'event':
      case 'eventregistrat':
        dispatch({
          type: 'itsmuser/eventuserlist',
          payload: {
            taskId,
            type: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      case 'demand':
        dispatch({
          type: 'itsmuser/demanduserlist',
          payload: {
            taskId,
            result: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      case 'problem':
        dispatch({
          type: 'itsmuser/problemuserlist',
          payload: {
            taskId,
            result: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      case 'troub':
        dispatch({
          type: 'itsmuser/troubleuserlist',
          payload: {
            taskId,
            result: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      case 'task':
        dispatch({
          type: 'itsmuser/taskuserlist',
        });
        break;
      case 'release':
        dispatch({
          type: 'itsmuser/releaseuserlist',
          payload: {
            taskId,
            type: '1',
          },
        });
        break;
      case 'achievements':
        dispatch({
          type: 'itsmuser/achievementsNextTaskUser',
          payload: {
            taskId,
            type: sessionStorage.getItem('flowtype'),
          },
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (visible) {
      showModal();
      if (indexUser && indexUser.length && indexUser > 0) {
        sessionStorage.setItem('NextflowUserId', indexUser.join(','));
      }
    }
    return () => {
    }
  }, [visible]);

  const handleOk = () => {
    if (type !== 'demand' && type !== 'task') {
      if (value.length === 0) {
        if (indexUser && indexUser.length && indexUser.length === 0) {
          message.error('最少选择一个处理人！');
        } else {
          ChangeChoice(true);
          ChangeUserVisible(false);
        }
      } else {
        ChangeChoice(true);
        ChangeUserVisible(false);
      }
    }

    if (type === 'task') {
      if (value.length !== 1) {
        message.info('请选择一个送审人')
      } else {
        ChangeChoice(true);
        ChangeUserVisible(false);
      }
    }

    if (type === 'demand') {
      if (demandvalue.length < userlist.length) {
        message.error('每个环节最少选择一个处理人！');
      } else {
        ChangeChoice(true);
        ChangeUserVisible(false);
      };
    }
  };

  const handleCancel = () => {
    ChangeChoice(false);
    ChangeUserVisible(false);
    ChangeType('');
    sessionStorage.removeItem('NextflowUserId');
  };

  const nextflowuser = changorder || sessionStorage.getItem('Nextflowmane');
  return (
    <>
      <Modal title="选择下一环节处理人" visible={visible} onOk={handleOk} onCancel={handleCancel} width={700}>
        <Spin tip="正在加载数据..." spinning={Boolean(loading)}>
          <div id='user'>
            {(type === 'demand' || type === 'event') ? (
              <>
                {userlist && userlist.length && userlist.map((obj, index) => {
                  return (
                    <div key={index.toString()}>
                      <div style={{ marginTop: 12, fontSize: 16 }}>{obj.nodeName}人员</div>
                      <div style={{ marginTop: 6 }}>
                        <Checkbox.Group
                          defaultValue={indexUser || defaultvalue}
                          options={dataArr(obj.users)}
                          onChange={values => handledemandChange(values, obj.nodeName, index)}
                          key={index.toString()}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {describe ? <div style={{ fontSize: 16 }}>{describe}</div> : <div style={{ fontSize: 16 }}>{nextflowuser}人员</div>}
                {userlist && userlist.length && (<div style={{ marginTop: 12 }} className={styles.useritem}>
                  <Checkbox.Group
                    defaultValue={indexUser || defaultvalue}
                    options={dataArr(defaultUsers || userlist)}
                    onChange={handleChange}
                  />
                </div>)}
              </>
            )}
          </div>
        </Spin>
      </Modal>
    </>
  );
};

User.defaultProps = {
  pangekey: '0',
  // defaultvalue: [],
  // demandvalue: []
};

export default connect(({ itsmuser, loading }) => ({
  userlist: itsmuser.userlist,
  describe: itsmuser.describe,
  loading: loading.models.itsmuser,
}))(User);
