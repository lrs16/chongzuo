import React, { useEffect } from 'react';
import {
  Collapse,
  Button
} from 'antd';
import { connect } from 'dva';
import Register from './components/Register';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import styles from '../ServicePerformanceappraisal/index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
}

const { Panel } = Collapse;
function CreditCardRegister(props) {
  const pagetitle = props.route.name;
  const {
    loading,
    dispatch,
    maintenanceArr
  } = props;

  useEffect(() => {
    dispatch({
      type: 'eventstatistics/fetchMaintenancelist',
      payload: {
        tabActiveKey: 'week',
        startTime: '2021-06-28',
        endTime: '2021-07-04'
      }
    })
  }, [])

  const handlePrint = () => {
    window.document.body.innerHTML = window.document.getElementById('alldom').innerHTML;
    // window.print();
    document.execCommand('print')
    window.location.reload();
  }

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button type='primary' onClick={handlePrint}>打印</Button>
        </>
      }
    >

      {loading === false && (
        <div className={styles.collapse}>
          <Collapse
            expandIconPosition='right'
            defaultActiveKey={['1']}
            bordered={false}
          >
            <Panel header='计分卡登记' key='1'>
              <Register
                tableSource={maintenanceArr.data}
                formItemLayout={formItemLayout}
              />
            </Panel>
          </Collapse>
        </div>
      )}
    </PageHeaderWrapper>
  )
}

export default (
  connect(({ eventstatistics, loading }) => ({
    maintenanceArr: eventstatistics.maintenanceArr,
    loading: loading.models.eventstatistics
  }))(CreditCardRegister)
)