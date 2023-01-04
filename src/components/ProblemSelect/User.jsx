import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, message, Spin, Checkbox } from 'antd';
import styles from './index.less';

const User = props => {
  const {
    dispatch,
    // defaultvalue,
    // demandvalue,
    currentPeocess,
    problemlist,
    loading,
    changorder,
    taskId,
    visible,
    ChangeUserVisible,
    ChangeChoice,
    ChangeType,
    changeOrder
  } = props;
  const [isnew, setIsNew] = useState(false);
  const [demandvalue, setDemandValue] = useState([])
  const [defaultvalue, setDefaultValue] = useState([])
  const [specialvalue, setSpecialvalue] = useState([]);
  const [value, setValue] = useState('');
  const type = sessionStorage.getItem('Processtype');

  useEffect(() => {
    if (loading) {
      setIsNew(true);
    }
    return () => {
      setIsNew(false);
      setDemandValue([]);
      setDefaultValue([]);
    };
  }, [problemlist]);

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
    setValue(checkedValues);
    sessionStorage.setItem('NextflowUserId', checkedValues.join(','));
  };

  // 需求多选下一环节人员
  const handledemandChange = (checkedValues) => {
    setSpecialvalue(checkedValues);
    sessionStorage.setItem('AutoflowUserId', checkedValues.join(','));
  };

  const showModal = () => {
    switch (type) {
      case 'event':
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
      default:
        break;
    }
  };

  useEffect(() => {
    if (visible) {
      sessionStorage.setItem('NextflowUserId', []);
      sessionStorage.setItem('AutoflowUserId', []);
      showModal();
    }
    return () => {
      setSpecialvalue([]);
      setValue([]);
    }
   
  }, [visible]);

  const handleOk = () => {
    if (currentPeocess !== '系统运维商审核') {
      if (value.length === 0) {
        message.error('最少选择一个处理人！');
      } else {
        ChangeChoice(true);
        ChangeUserVisible(false);
      }
    }

    if (currentPeocess === '系统运维商审核') {
      if (value.length === 0 && specialvalue.length === 0) {
        message.error('最少选择一个处理人！');
      } else {
        ChangeChoice(true);
        ChangeUserVisible(false);
      }
    }
  };

  const handleCancel = () => {
    ChangeUserVisible(false);
    ChangeType('');
  };

  const nextflowuser =
    changorder !== undefined ? changorder : sessionStorage.getItem('Nextflowmane');
  return (
    <>
      <Modal
        title={changeOrder === '转单' ? '请选择转单环节处理人' : '请选择下一环节处理人'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose='true'
      >
        <Spin tip="正在加载数据..." spinning={Boolean(loading)}>
          {loading === false && type !== 'demand' && isnew && problemlist !== '' && currentPeocess !== '系统运维商审核' && (
            <>
              <div>{changeOrder === '转单' ? '转单' : nextflowuser}人员</div>
              <div style={{ marginTop: 12 }} className={styles.useritem}>
                <Checkbox.Group
                  defaultValue={defaultvalue}
                  options={dataArr(problemlist.data)}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {
            currentPeocess === '系统运维商审核' && (
              <>
                <div>自动化业务人员</div>
                <div>
                  <Checkbox.Group
                    defaultValue={defaultvalue}
                    options={dataArr(problemlist.serviceData)}
                    onChange={handleChange}
                  />
                </div>
              </>
            )
          }

          {

            currentPeocess === '系统运维商审核' && (
              <>
                <div style={{ marginTop: 12 }}>自动化科专责人员</div>
                <div>
                  <Checkbox.Group
                    defaultValue={defaultvalue}
                    options={dataArr(problemlist.dutyData)}
                    onChange={handledemandChange}
                  />
                </div>
              </>
            )

          }
          {/* <div>{nextflowuser}人员</div>
          <div style={{ marginTop: 12 }}>
            <Checkbox.Group
              defaultValue={defaultvalue}
              options={dataArr(problemlist.data)}
              onChange={values => handledemandChange(values, obj.nodeName, index)}
              // key={index.toString()}
            />
          </div> */}
          {/* {type === 'demand' && problemlist !== '' && (
            <>
              {userlist.map((obj, index) => {
                return (
                  <div key={index.toString()}>
                    <div>{obj.nodeName}人员</div>
                    <div style={{ marginTop: 12 }}>
                      <Checkbox.Group
                        defaultValue={defaultvalue}
                        options={dataArr(problemlist.data)}
                        onChange={values => handledemandChange(values, obj.nodeName, index)}
                        key={index.toString()}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )} */}
        </Spin>
      </Modal>
    </>
  );
};

User.defaultProps = { pangekey: '0', defaultvalue: [], demandvalue: [] };

export default connect(({ itsmuser, loading }) => ({
  problemlist: itsmuser.problemlist,
  loading: loading.models.itsmuser,
}))(User);
