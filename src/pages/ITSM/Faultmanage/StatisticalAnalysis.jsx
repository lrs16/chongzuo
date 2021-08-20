import React, { useState } from 'react';
import {
  Row,
  Col,
  Card
} from 'antd';

import { ChartCard } from '@/components/Charts';
import Barchart from '@/components/CustomizeCharts/Barchart';
import Donut from '@/components/CustomizeCharts/Donut';
import OrdinaryLine from '@/components/CustomizeCharts/OrdinaryLine';
import StatisticsModal from './components/StatisticsModal';

function StatisticalAnalysis(props) {
  const [barChartparams, setBarChartparams] = useState('');
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');

  // 饼图数据
  const Donutdata = [
    {
      type: '事件单',
      count: 600,
    },
    {
      type: '故障单',
      count: 200,
    },
    {
      type: '问题单',
      count: 100,
    },
    {
      type: '需求单',
      count: 111,
    },
    {
      type: '发布单',
      count: 150,
    },
  ];

  const showDetaillist = (params, type) => {
    console.log('params: ', params);
    if (type === 'line') {
      const { mappingData } = params;
      const selextX = params.x;
      const selextY = params.y;
      const reuslt = mappingData.filter(value => {
        const { x, y, _origin } = value;
        console.log('_origin: ', _origin);
        if (selextX === x && selextY === y) {
          return _origin
        }
      }
      )
      console.log(reuslt[0]["_origin"].city, 'reuslt')
      setVisible(true);
      setTitle(reuslt[0]["_origin"].city)
    }
  }
  return (
    <>
      <Card
        title='故障责任单位情况'
        bordered={false}
        style={{ backgroundColor: 'white' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ChartCard title="工单量">
              <Donut
                data={Donutdata}
                height={315}
                total="1161"
                padding={[0, 0, 0, 0]}
                detailParams={newdata => { showDetaillist(newdata) }}
              />
            </ChartCard>
          </Col>
          <Col span={12}>
            <ChartCard title="事件工单情况">
              <OrdinaryLine
                height={315}
                detailParams={newdata => { showDetaillist(newdata, 'line') }}
              />
            </ChartCard>
          </Col>
        </Row>
      </Card>

      <Card
        title='故障类型统计分析'
        bordered={false}
        style={{ backgroundColor: 'white', marginTop: 20 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ChartCard title="故障类型总情况">
              <Donut
                data={Donutdata}
                height={315}
                total="1161"
                padding={[0, 0, 0, 0]}
                detailParams={newdata => { showDetaillist(newdata) }}
              />
            </ChartCard>
          </Col>
          <Col span={12}>
            <ChartCard title="故障类型趋势分析">
              <OrdinaryLine
                height={315}
                detailParams={newdata => { showDetaillist(newdata, 'line') }}
              />
            </ChartCard>
          </Col>
          <Col span={12}>
            <ChartCard title=" 硬件故障情况">
              <Donut
                data={Donutdata}
                height={315}
                total="1161"
                padding={[0, 0, 0, 0]}
                detailParams={newdata => { showDetaillist(newdata) }}
              />
            </ChartCard>
          </Col>
          <Col span={12}>
            <ChartCard title=" 硬件故障趋势分析">
              <OrdinaryLine
                height={315}
                detailParams={newdata => { showDetaillist(newdata, 'line') }}
              />
            </ChartCard>
          </Col>
          <Col span={12}>
            <ChartCard title="软件故障情况">
              <Donut
                data={Donutdata}
                height={315}
                total="1161"
                padding={[0, 0, 0, 0]}
                detailParams={newdata => { showDetaillist(newdata) }}
              />
            </ChartCard>
          </Col>
          <Col span={12}>
            <ChartCard title="软件故障趋势分析">
              <Barchart
                // height={315}
                detailParams={newdata => { showDetaillist(newdata, 'Barchart') }}
              />
            </ChartCard>
          </Col>
        </Row>
      </Card>

      <Card
        title='故障系统模块情况'
        bordered={false}
        style={{ backgroundColor: 'white', marginTop: 20 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ChartCard title="">
              <Donut
                data={Donutdata}
                height={315}
                total="1161"
                padding={[0, 0, 0, 0]}
                detailParams={newdata => { showDetaillist(newdata) }}
              />
            </ChartCard>
          </Col>
          <Col span={12}>
            <ChartCard title="">
              <OrdinaryLine
                height={315}
                detailParams={newdata => { showDetaillist(newdata, 'line') }}
              />
            </ChartCard>
          </Col>
        </Row>
      </Card>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <ChartCard title="故障工单超时情况">
            <Donut
              data={Donutdata}
              height={315}
              total="1161"
              padding={[0, 0, 0, 0]}
              detailParams={newdata => { showDetaillist(newdata) }}
            />
          </ChartCard>
        </Col>
        <Col span={12}>
          <ChartCard title="故障登记人Top5">
            <OrdinaryLine
              height={315}
              detailParams={newdata => { showDetaillist(newdata, 'line') }}
            />
          </ChartCard>
        </Col>
      </Row>

      <StatisticsModal
        visible={visible}
        title={title}
        handleCancel={() => setVisible(false)}
      />
    </>
  )

}
export default StatisticalAnalysis;