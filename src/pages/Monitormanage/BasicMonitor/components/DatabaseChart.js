/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  // Pagination ,
  // Empty ,
  Icon,
  Spin,
} from 'antd';
import numeral from 'numeral';
// import GaugeChart from 'bizcharts/lib/plots/GaugeChart';
import Gauge from '@/components/CustomizeCharts/Gauge';
import iconfontUrl from '@/utils/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconfontUrl,
});

class DatabaseChart extends Component {
  constructor(props) {
    super(props);
    const { userdata, instancedata } = this.props;
    this.state = {
      current: instancedata.current,
      pageSize: instancedata.pageSize,
      usercurrent: userdata.current,
      userpageSize: userdata.pageSize,
    };
  }

  oninschangePage = (page, pageSize) => {
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
    this.props.oninsPageChange(page, pageSize);
  };

  oninsSizeChange = (current, size) => {
    setTimeout(() => {
      this.setState({ pageSize: size });
    }, 0);
    this.props.oninsSizeChange(current, size);
  };

  changePage = (page, pageSize) => {
    setTimeout(() => {
      this.setState({ usercurrent: page });
    }, 0);
    this.props.onuserPageChange(page, pageSize);
  };

  onShowSizeChange = (current, size) => {
    setTimeout(() => {
      this.setState({ userpageSize: size });
    }, 0);
    this.props.onuserSizeChange(current, size);
  };

  render() {
    const columns = [
      {
        title: '实例名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '实例状态',
        dataIndex: 'status',
        key: 'status',
      },
    ];

    const columntables = [
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '用户状态',
        dataIndex: 'status',
        key: 'status',
      },
    ];
    const { current, pageSize, usercurrent, userpageSize } = this.state;
    const { cachedata, instancedata, userdata } = this.props;
    //    const deviceheight = changedate(userindex).length * 60;

    const GaugeChartvalue = [{ value: `${cachedata}` / 10 }];

    const instancepagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, size) => this.oninsSizeChange(current, size),
      current: current,
      pageSize: pageSize,
      total: instancedata.total,
      onChange: (page, pageSize) => this.oninschangePage(page, pageSize),
    };

    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, size) => this.onShowSizeChange(current, size),
      current: usercurrent,
      pageSize: userpageSize,
      total: userdata.total,
      onChange: (page, pageSize) => this.changePage(page, pageSize),
    };

    return (
      <Row gutter={24} type="flex">
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card>
            <div style={{ position: 'absolute', top: '15px' }}>Cache命中率</div>
            <Gauge
              title="Cache命中率"
              height={230}
              data={GaugeChartvalue}
              value={numeral(cachedata).format('0.0')}
            />
          </Card>
        </Col>
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card style={{ height: 280 }}>
            <div style={{ position: 'absolute', top: '15px' }}>实例状态</div>
            <Table
              style={{ paddingTop: 30 }}
              columns={columns}
              dataSource={instancedata.data}
              rowKey={i => i + 1}
              pagination={instancepagination}
            />
          </Card>
        </Col>
        <Col xl={24} xs={24}>
          <Card>
            <div style={{ position: 'absolute', top: '15px' }}>用户等待状态</div>
            <Table
              style={{ paddingTop: 30 }}
              columns={columntables}
              dataSource={userdata.data}
              rowKey={record => record.name}
              pagination={pagination}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default DatabaseChart;
