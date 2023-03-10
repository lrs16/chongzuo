import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Message, Button, Collapse } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import Content from './components/Content';
import ToApplays from './components/ToApplays'; // 人员申请详情
import styles from '../index.less';

const { Panel } = Collapse;

function Newcheck(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    location,
    location: { query },
  } = props;
  const { mainId } = location.query;

  const ContentRef = useRef(null);

  const [result, setResult] = useState('0'); // 审核结果
  const [activeKey, setActiveKey] = useState(['1', '2']);

  const handleSave = () => { // 保存按钮
    const values = ContentRef.current.getVal();
    ContentRef.current.Forms((err) => {
      if (!err) {
        dispatch({
          type: 'apply/saveCheck',
          payload: {
            ...values,
            registNo: query.selectedRows[0].registNo,
            checkTime: values.checkTime ? moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss') : '',
          },
        }).then(res => {
          if (res.code === 200) {
            Message.success(res.msg);
            router.push({
              pathname: '/ITSM/operationplan/personaccessmanage/tocheck',
              query: {
                addtab: false,
              }
            })
          } else {
            Message.error(res.msg);
          }
        });
      }
    })
  }

  const checkApproved = () => { // 审核通过按钮
    const values = ContentRef.current.getVal();
    ContentRef.current.Forms((err) => {
      if (!err) {
        dispatch({
          type: 'apply/checkRegist',
          payload: {
            ...values,
            registNo: query.selectedRows[0].registNo,
            checkTime: values.checkTime ? moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss') : '',
          },
        }).then(res => {
          if (res.code === 200) {
            Message.success(res.msg);
            router.push({
              pathname: '/ITSM/operationplan/personaccessmanage/tocheck',
              query: {
                addtab: false,
              }
            })
          } else {
            Message.error(res.msg);
          }
        });
      }
    })
  }

  const handleclose = () => { // 关闭返回
    router.push({
      // pathname: `/ITSM/operationplan/personaccessmanage/tocheck`,
      pathname: location.pathname,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, },
    });
  }

  const callback = key => {
    // 激活tab
    setActiveKey(key);
  };

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      dispatch({
        type: '/ITSM/operationplan/personaccessmanage/tocheck/newcheck',
        payload: {
          mainId,
        },
      });
      setActiveKey(['1', '2']);
    }
  }, [location.state])

  const operations = (
    <>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleSave()}
      >
        保存
      </Button>
      {
        result === '0' ?
          (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => checkApproved()}>
              通过
            </Button>) : (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => checkApproved()}>
              不通过
            </Button>
          )
      }
      <Button onClick={handleclose}>关闭</Button>
    </>
  );

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <div className={styles.collapse}>
        <Collapse
          expandIconPosition="right"
          activeKey={activeKey}
          bordered={false}
          onChange={callback}
        >
          <Panel header='人员进出审核' key="1">
            <EditContext.Provider value={{ editable: true }}>
              <Content
                wrappedComponentRef={ContentRef}
                ChangeResult={newvalue => {
                  setResult(newvalue);
                }}
                userinfo={(query && query.userinfo) ? query.userinfo : ''}
                selectedRows={query && query.selectedRows ? query.selectedRows[0] : {}}
              />
            </EditContext.Provider>
          </Panel>
          <Panel header='人员进出申请' key="2">
            <ToApplays selectedRows={query && query.selectedRows ? query.selectedRows[0] : {}} />
          </Panel>
        </Collapse>
      </div >
    </PageHeaderWrapper>
  );
}

export default connect()(Newcheck);