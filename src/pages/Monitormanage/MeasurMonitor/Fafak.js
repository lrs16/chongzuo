/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
// import numeral from 'numeral';
import { Row, Col, Icon, Popover, Alert, Empty, Spin, Table, DatePicker, Form, Input, Select, Button } from 'antd';
import Treecompactbox from '@/components/CustomizeCharts/Treecompactbox';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import { ChartCard } from '@/components/Charts';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;
const { Option } = Select;

const soncolumns = [
  {
    title: '区域',
    dataIndex: 'topicZone',
    key: 'topicZone',
  },
  {
    title: 'Topic',
    dataIndex: 'topicName',
    key: 'topicName',
  },
  {
    title: 'Group',
    dataIndex: 'topicGroup',
    key: 'topicGroup',
  },
  {
    title: 'Lag',
    dataIndex: 'topicLag',
    key: 'topicLag',
  },
  {
    title: '检测序号',
    dataIndex: 'topicNumber',
    key: 'topicNumber',
  },
  {
    title: '检测时间',
    dataIndex: 'topicTime',
    key: 'topicTime',
  },
  {
    title: '检测结果',
    dataIndex: 'topicStatus',
    key: 'topicStatus',
    render: text => {
      const s = (text == 1 ? '正常' : '积压');
      // style={{ color: s == '正常' ? '' : '#f00' }}
      return <a style={{ color: text == 1 ? '' : '#f00' }}>{s}</a>
    }
  },
];
@connect(({ fafak, loading }) => ({
  fafak,
  loading: loading.models.fafak,
}))
class Fafak extends Component {
  state = {
    visible: false,
    step: 'M60',
    zone: '2',
    beginTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  };

  componentDidMount() {
    this.getdatas();
    this.interval = setInterval(() => this.getdatas(), 600000);
  }

  componentDidUpdate() {
    const propsstate = this.props.location.state;
    if (propsstate && propsstate.reset) {
      this.getdatas();
      router.push({
        pathname: `/monitormanage/measurmonitor/fafka`,
        state: { cach: false, reset: false }
      });
    }
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
      payload: this.state,
    });
    // dispatch({
    //   type: 'fafak/fetch2zone',
    // });

  }

  render() {
    const {
      loading,
      fafak: {
        zone3data,
        safezonedata,
        zone2data
      },

    } = this.props;

    const addcolumns = ({ dataIndex, title }) => {
      return ({
        title,
        dataIndex,
        key: dataIndex,
        render: (text) => {
          let newtext = '';
          let batchNo = '';
          if (text) {
            newtext = text.split("|")[0];
            batchNo = text.split("|")[1];
          }

          const extatable = (
            <Table
              dataSource={zone2data}
              columns={soncolumns}
              pagination={{ defaultPageSize: 5 }}
              style={{ background: '#fff' }}
            />)
          const fetchlist = () => {
            // console.log('请求接口', batchNo)
            this.props.dispatch({
              type: 'fafak/fetch2zone',
              payload: batchNo,
            });
          }
          return (
            <a
              style={{ color: newtext === '正常' ? '' : '#f00' }}
              onClick={() => fetchlist()}
            >
              <Popover content={extatable} trigger='click' placement="bottom" arrowPointAtCenter>
                {newtext}
              </Popover>
            </a>
          )
        }
      })
    }

    const Setcolumns = (datas) => {
      const data = datas.slice(0);
      data.shift();
      const newArr = [{ title: '时间', dataIndex: 'time', key: 'time', fixed: 'left', width: 180 }];
      if (!Array.isArray(data)) {
        return newArr;
      }
      for (let i = 0; i < data.length; i += 1) {
        const key = data[i].title.lastIndexOf("(");
        const dataIndex = data[i].title.substring(key + 1, data[i].title.length - 1);
        // const title = key !== -1 ? { dataIndex, title: data[i].title } : { dataIndex: data[i].title, title: data[i].title };
        newArr.push(addcolumns({ dataIndex, title: data[i].title }))
      }
      return newArr
    }
    const newcolumns = Setcolumns(safezonedata.columns || [])

    const handleSearch = () => {
      this.props.dispatch({
        type: 'fafak/fetchsafezone',
        payload: this.state,
      });
    };
    return (
      <PageHeaderWrapper title="KAFKA消费">
        <h3>KAFKA节点监控</h3>
        <Row gutter={24} type="flex" style={{ marginBottom: 24 }}>
          {zone3data && zone3data.length > 0 && zone3data.map((obj) => {
            const newzone3data = {
              name: '计量中心',
              children: obj.node
            };
            return (
              <Col xl={8} xs={24}>
                <ChartCard title={obj.zone} contentHeight={200}>
                  <Treecompactbox
                    datas={newzone3data}
                    height={200}
                    padding={[15, 80, 10, 40]}
                  />
                </ChartCard>
              </Col>
            )
          }
          )}
        </Row>
        <h3>KAFKA主题消费监控</h3>
        <Form layout="inline">
          <Form.Item>
            <RangePicker
              showTime
              format='YYYY-MM-DD HH:mm:ss'
              allowClear={false}
              onChange={(v1, v2) => {
                this.setState(
                  {
                    beginTime: v2[0],
                    endTime: v2[1]
                  }
                )
              }
              }
              defaultValue={
                // this.state.rangePicker
                [
                  moment(this.state.beginTime, 'YYYY-MM-DD HH:mm:ss'),
                  moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss')
                ]
              }
            />
          </Form.Item>
          <Form.Item label="统计步长">
            <Select defaultValue="M60" style={{ width: 120 }} onChange={value => { this.setState({ step: value }) }}>
              <Option value="M30">30分</Option>
              <Option value="M60">1小时</Option>
            </Select>
          </Form.Item>
          <Form.Item label="区域">
            <Select defaultValue="2" style={{ width: 120 }} onChange={value => { this.setState({ zone: value }) }}>
              <Option value="2">安全Ⅱ区</Option>
              <Option value="3">安全Ⅲ区</Option>
              <Option value="4">安全接入区</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={() => handleSearch()}>
              查询
            </Button>
          </Form.Item>
        </Form>

        <Table
          loading={loading}
          dataSource={safezonedata.dataSource}
          columns={newcolumns}
          bordered
          pagination
          size="middle"
          scroll={{ x: 1500 }}
          style={{ background: '#fff' }}
        />

      </PageHeaderWrapper>
    );
  }
}

export default Fafak;
