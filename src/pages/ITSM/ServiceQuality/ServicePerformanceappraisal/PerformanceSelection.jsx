import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, message, Spin, Checkbox } from 'antd';
import styles from './index.less';

const PerformanceSelection = props => {
  const {
    dispatch,
    userlist,
    loading,
    changorder,
    taskId,
    visible,
    ChangeUserVisible,
    ChangeChoice,
    ChangeType,
    indexUser,      // 默认选中人
    defaultUsers,   //
  } = props;
  // const [isnew, setIsNew] = useState(false);
  const [demandvalue, setDemandValue] = useState([])
  const [defaultvalue, setDefaultValue] = useState([]);
  const type = sessionStorage.getItem('Processtype');


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

  // 需求多选下一环节人员
  const handledemandChange = (values, taskName, key) => {
    const obj = {};
    obj.taskName = taskName;
    obj.userIds = values.toString();
    const data = demandvalue.map(item => ({ ...item }));
    const target = data.filter((item) => item.taskName === taskName)[0];
    if (target) {
      if (values.length === 0) {
        const newArr = demandvalue.filter((item) => item.taskName !== taskName);
        setDemandValue(newArr);
      } else {
        target.userIds = values.toString();
        setDemandValue(data);
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

  const nextflowuser = changorder || sessionStorage.getItem('Nextflowmane');

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
    if (type === 'achievements' && nextflowuser === '自动化科审核人') {
      if (demandvalue.length < 2) {
        message.error('每个环节最少选择一个处理人！');
      } else {
        const obj = {
          '业务负责人审核': '',
          '自动化科审核': '',
        }
        for (let i = 0; i < demandvalue.length; i++) {
          if (demandvalue[i].taskName === '业务负责人审核') {
            obj['业务负责人审核'] = demandvalue[i].userIds
          }

          if (demandvalue[i].taskName === '自动化科审核') {
            obj['自动化科审核'] = demandvalue[i].userIds
          }
        }
        sessionStorage.setItem('NextflowUserId', JSON.stringify(obj));
        ChangeChoice(true);
        ChangeUserVisible(false);
      }
    };

    if (type === 'achievements' && nextflowuser !== '自动化科审核人') {
      if (value.length) {
        ChangeChoice(true);
        ChangeUserVisible(false);
      } else {
        message.error('每个环节最少选择一个处理人！');
      }
    }
  };


  const handleCancel = () => {
    ChangeChoice(false);
    ChangeUserVisible(false);
    ChangeType('');
    sessionStorage.removeItem('NextflowUserId');
  };

  const handleChange = checkedValues => {
    setValue(checkedValues);
    sessionStorage.setItem('NextflowUserId', checkedValues.join(',').toString());
  };


  return (
    <>
      <Modal title="选择下一环节处理人" visible={visible} onOk={handleOk} onCancel={handleCancel} width={700}>
        <Spin tip="正在加载数据..." spinning={Boolean(loading)}>
          <div id='user'>
            {type === 'achievements' && nextflowuser === '自动化科审核人' && userlist && userlist.length && userlist.map((obj, index) => {
              return (
                <div key={index.toString()}>
                  <div style={{ marginTop: 6, fontSize: 16 }}>{obj.taskName}人员</div>
                  <div>
                    <Checkbox.Group
                      defaultValue={indexUser || defaultvalue}
                      options={dataArr(obj.users)}
                      onChange={values => handledemandChange(values, obj.taskName, index)}
                      key={index.toString()}
                    />
                  </div>
                </div>
              );
            })}

            {type === 'achievements' && nextflowuser !== '自动化科审核人' && userlist && userlist.length && (<div style={{ marginTop: 12 }} className={styles.useritem}>
              <div style={{ fontSize: 16 }}>{nextflowuser}人员</div>
              <Checkbox.Group
                defaultValue={indexUser || defaultvalue}
                options={dataArr(defaultUsers || userlist)}
                onChange={handleChange}
              />
            </div>)}
          </div>
        </Spin>
      </Modal>
    </>
  );
};

PerformanceSelection.defaultProps = {
  pangekey: '0',
  // defaultvalue: [],
  // demandvalue: []
};

export default connect(({ itsmuser, loading }) => ({
  userlist: itsmuser.userlist,
  describe: itsmuser.describe,
  loading: loading.models.itsmuser,
}))(PerformanceSelection);
