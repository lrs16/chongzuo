import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Radio, Badge, Spin, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HostDetail from './components/HostDetail';
import DatabaseDetail from './components/DatabaseDetail';

const radiotextmaps = new Map([
  ['host', '操作系统'],
  ['database', 'Oracle'],
]);

@connect(({ basicmonitorlist, loading }) => ({
  basicmonitorlist,
  loading: loading.models.basicmonitorlist,
}))
class Detail extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.computedMatch;
    this.state = {
      radiaovalue: radiotextmaps.get(params.type),
      id: params.id,
    };
  }

  componentDidMount() {
    const { id } = this.state;
    this.props.dispatch({
      type: 'basicmonitorlist/fetchradiogroups',
      payload: {
        id,
      },
    });
  }

  onChange = e => {
    this.setState({
      radiaovalue: e.target.value,
    });
  };

  GoHistory = () => {
    window.history.back(-1);
  };

  render() {
    const { radiaovalue, id } = this.state;
    const {
      loading,
      basicmonitorlist: { radiogroups },
    } = this.props;
    const alarmtype = radiogroups.filter(obj => {
      return obj.name === radiaovalue;
    });
    const applicationId = alarmtype[0]?.key;
    return (
      <PageHeaderWrapper title="监测详情">
        <Card>
          <Row gutter={24}>
            <Col span={20}>
              <Spin spinning={loading}>
                <Radio.Group value={radiaovalue} buttonStyle="solid" onChange={this.onChange}>
                  {radiogroups.map(({ key, alertNumber, name }) => [
                    <Radio.Button value={name} key={key}>
                      <Badge count={alertNumber} style={{ zIndex: '10' }}>
                        <span style={{ lineHeight: '30px' }}>{name}</span>
                      </Badge>
                    </Radio.Button>,
                  ])}
                </Radio.Group>
              </Spin>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Button shape="circle" icon="close" onClick={this.GoHistory} />
            </Col>
          </Row>
        </Card>
        {loading === false && (
          <>
            {radiaovalue === '操作系统' && (
              <HostDetail hostId={id} alarmtype={alarmtype} applicationId={applicationId} />
            )}
            {radiaovalue === 'Oracle' && (
              <DatabaseDetail databaseId={id} alarmtype={alarmtype} applicationId={applicationId} />
            )}
          </>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Detail;
