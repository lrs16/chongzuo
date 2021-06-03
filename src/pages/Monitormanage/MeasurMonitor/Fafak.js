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
    name: '09:00-09:30',
    age: '正常',
    address: '正常',
  },
  {
    key: '2',
    name: '08:30-09:00',
    age: '正常',
    address: '正常',
  },
  {
    key: '3',
    name: '08:00-09:30',
    age: '队列积压',
    address: '正常',
  },
];

const columns = [
  {
    title: '时间',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'AutoDataAsk',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'WebParamRequest',
    dataIndex: 'address',
    key: 'address',
  },
];


const changeTopicDate = data => {
  // console.log("表格数据",data.dataSource)
  // console.log("示例数据",dataSource)
  // console.log("表格表头",data.columns);
  // console.log("示例表头",columns);

  data.columns.map(
    col =>{
      console.log('col',col)
      if(col.title !== '时间'){
        //  render: text => <a>{text}</a>,
        col.render = text =>{
          console.log('单元格内容',text)
          return <a>{text}</a>;
        }
      }
    }
  )
 
}

const changedata = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.name = datas[i].topic;
    vote.value = datas[i].lag;
    vote.clock = moment(datas[i].date).format('HH');
    newArr.push(vote);
  }
  return newArr;
};
// const zone3 = '*AutoDataAsk';
const downdycols = {
  clock: {
    range: [0.05, 0.95],
    alias: '时刻',
    tickInterval: 2,
  },
  value: {
    min: 0,
    // max: 30000,
    range: [0.05, 0.95],
    alias: '整点KAFKA主题LAG数',
    // tickInterval: 10000,
  },
};
const othercols = {
  clock: {
    range: [0, 0.95],
    alias: '时刻',
    tickInterval: 2,
  },
  value: {
    nice: true,
    range: [0, 0.9],
    alias: '整点KAFKA主题LAG数',
  },
};

@connect(({ fafak, loading }) => ({
  fafak,
  loading: loading.models.fafak,
}))
class Fafak extends Component {
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
    // dispatch({
    //   type: 'fafak/fetchdoendy',
    // });
    // dispatch({
    //   type: 'fafak/fetchdownother',
    // });
    // dispatch({
    //   type: 'fafak/fetch102safezone',
    // });
    // dispatch({
    //   type: 'fafak/fetch102down',
    // });
    // dispatch({
    //   type: 'fafak/fetchupdy',
    // });
    // dispatch({
    //   type: 'fafak/fetchupother',
    // });
    // dispatch({
    //   type: 'fafak/fetch102up2zone',
    // });
    // dispatch({
    //   type: 'fafak/fetch102safe2zone',
    // });
    // dispatch({
    //   type: 'fafak/fetch102upsafezone',
    // });
  }

  render() {
    const {
      loading,
      fafak: {
        zone3data,
        safezonedata,
        // zone2data,
        // downdydata,
        // otherdata,
        // // zone102_2data,
        // down102,
        // updydata,
        // upotherdata,
        // up102_2zonedata,
        // safe102_2zonedata,
        // up102safezone,
      },
    } = this.props;

    console.log(zone3data)
    const newzone3data = {
      name: '计量中心',
      children: [...zone3data]
    }
    const topicDate = changeTopicDate(safezonedata);

    // const downdydatas = changedata(downdydata);
    // const otherdatas = changedata(otherdata);
    // // const zone102_2datas = changedata(zone102_2data);
    // const down102s = changedata(down102);
    // const updydatas = changedata(updydata);
    // const upotherdatas = changedata(upotherdata);
    // const up102_2zonedatas = changedata(up102_2zonedata);
    // const safe102_2zonedatas = changedata(safe102_2zonedata);
    // const up102safezones = changedata(up102safezone);
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
        <Table dataSource={safezonedata.dataSource} columns={safezonedata.columns} bordered
               size="middle"
               scroll={{ x: 1500 }}/>;
      </PageHeaderWrapper>
    );
  }
}

export default Fafak;
