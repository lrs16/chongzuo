/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
// import numeral from 'numeral';
import { Row, Col, Icon, Tooltip, Alert, Empty, Spin, Table } from 'antd';
import Treecompactbox from '@/components/CustomizeCharts/Treecompactbox';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import { ChartCard } from '@/components/Charts';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];
const soncolumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];
@connect(({ fafak, loading }) => ({
  fafak,
  loading: loading.models.fafak,
}))
class Fafak extends Component {
  state = {
    visible: false,
  };

  componentDidMount() {
    this.getdatas();
    this.interval = setInterval(() => this.getdatas(), 600000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fafak/fetch3zone',
    });
    dispatch({
      type: 'fafak/fetchsafezone',
    });
    dispatch({
      type: 'fafak/fetch2zone',
    });

  }

  render() {
    const {
      loading,
      fafak: {
        zone3data,
        safezonedata,
      },

    } = this.props;

    const newzone3data = {
      name: '计量中心',
      children: [...zone3data]
    }

    const addcolumns = (title) => {
      return ({
        title,
        dataIndex: title,
        key: title,
        render: (text) => {
          const newtext = text.split("|")[0];
          const value = text.split("|")[1];
          const extatable = (
            <Table
              dataSource={dataSource}
              columns={soncolumns}
              pagination={false}
              style={{ background: '#fff' }}
            />)
          const fetchlist = () => {
            console.log('请求接口', value)
            // this.dispatch({
            //   type: 'fafak/fetch3zone1',
            //   payload: value
            // });
          }
          return (
            <span
              style={{ color: newtext === '正常' ? '' : '#f00' }}
              onClick={() => fetchlist()}
            >
              <Tooltip title={extatable} trigger='click' placement="bottom" style={{ background: '#fff' }}  >
                {newtext}
              </Tooltip>
            </span>
          )
        }
      })
    }

    const Setcolumns = (datas) => {
      const data = datas.slice(0);
      data.shift();
      const newArr = [{ title: '时间', dataIndex: 'time', key: 'time', }];
      if (!Array.isArray(data)) {
        return newArr;
      }
      for (let i = 0; i < data.length; i += 1) {
        newArr.push(addcolumns(data[i].title))
      }
      return newArr
    }
    const newcolumns = Setcolumns(safezonedata.columns || [])

    return (
      <PageHeaderWrapper title="KAFKA消费">
        <Alert
          message="注意观察LAG数量趋势，只增不减的主题存在差异"
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
        />
        <h3>KAFKA节点监控（整点刷新）</h3>
        <Row gutter={24} type="flex">
          <Col xl={24} xs={24} style={{ marginBottom: 24 }}>
            {zone3data.length > 0 && (
              <ChartCard title="3区KAFKA节点" contentHeight={200}>
                <Treecompactbox datas={newzone3data} height={200} padding={[15, 80, 10, 40]} />
              </ChartCard>
            )}
          </Col>

        </Row>
        <h3>KAFKA主题消费监控（整点刷新）</h3>
        <Table dataSource={safezonedata.dataSource}
          columns={newcolumns}
          bordered
          pagination={false}
          size="middle"
          scroll={{ x: 1500 }} />
      </PageHeaderWrapper>
    );
  }
}

export default Fafak;
