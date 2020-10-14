import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Radio, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HostDetail from './components/HostDetail';
import DatabaseDetail from './components/DatabaseDetail';

@connect(({ basicmonitorlist, loading }) => ({
  basicmonitorlist,
  loading: loading.models.basicmonitorlist,
}))
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radiaovalue: this.props.location.state.radiaokey,
    };
  }

  componentDidMount() {
    const { id } = this.props.location.state;
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

  render() {
    const { radiaovalue } = this.state;
    const { id, data, radiaokey } = this.props.location.state;
    const {
      basicmonitorlist: { radiogroups },
    } = this.props;
    const alarmtype = radiogroups.filter(obj => {
      return obj.name === radiaokey;
    });
    const applicationId = alarmtype[0]?.key;

    return (
      <PageHeaderWrapper title="监测详情">
        <Card>
          <Radio.Group value={radiaovalue} buttonStyle="solid" onChange={this.onChange}>
            {radiogroups.map(({ key, alertNumber, name }) => [
              <Radio.Button value={name} key={key}>
                <Badge count={alertNumber} style={{ zIndex: '10' }}>
                  <span style={{ lineHeight: '30px' }}>{name}</span>
                </Badge>
              </Radio.Button>,
            ])}
          </Radio.Group>
        </Card>
        {applicationId !== undefined && (
          <>
            {radiaovalue === '操作系统' && (
              <HostDetail data={data} alarmtype={alarmtype} applicationId={applicationId} />
            )}
            {radiaovalue === 'Oracle' && (
              <DatabaseDetail
                data={data}
                databaseId={id}
                alarmtype={alarmtype}
                applicationId={applicationId}
              />
            )}
          </>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default Detail;
