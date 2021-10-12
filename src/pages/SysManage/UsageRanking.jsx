import React, { useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Avatar,
  Select,
  Empty,
  Input,
  Spin,
} from 'antd';
import moment from 'moment';
import SelectTime from '@/components/SelectTime/SelectTime';

function UsageRanking(props) {
  const [values, setValues] = useState({});

  useEffect(() => {
    if (values && values.type) {
      const val = {
        begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
        end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
        type: values.type === 'M' ? 'MONTH' : 'DAY',
        n: values.n || 5
      }
    }
  }, [values]);
  return (
    <>
      <SelectTime ChangeDate={(v) => setValues(v)} />

      <Row gutter={24}>
        <Col span={12}>
          <p>ff</p>
        </Col>
        <Col span={12}>
          <p>ff</p>
        </Col>
      </Row>
    </>
  )
}

export default UsageRanking;