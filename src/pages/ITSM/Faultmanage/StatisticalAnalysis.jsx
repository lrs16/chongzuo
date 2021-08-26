import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Icon
} from 'antd';

import { ChartCard } from '@/components/Charts';
import Barchart from '@/components/CustomizeCharts/Barchart';
import Donut from '@/components/CustomizeCharts/Donut';
import OrdinaryLine from '@/components/CustomizeCharts/OrdinaryLine';
import StatisticsModal from './components/StatisticsModal';
import iconfontUrl from '@/utils/iconfont';


const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconfontUrl,
});
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
    switch (type) {
      case 'line': {
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
        setVisible(true);
        setTitle(reuslt[0]["_origin"].city)
        break;
      }

      case 'barchart': {
        const { data } = params;
        setVisible(true);
        setTitle(data.country);
        break;
      }

      default:
        break;
    }
  }
  return (
    <>
      {/* <Card
        title='故障责任单位情况'
        bordered={false}
        style={{ backgroundColor: 'white' }}
      > */}

      <Row style={{ marginBottom: 10 }}>
        <Col span={8}>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', marginRight: 10 }}>
            <div>
              <span style={{display:'inline-block',height:40,width:40,backgroundColor: '#0366C3',textAlign:'center',borderRadius:'50%',padding:5}}>
                <IconFont
                  type="iconziyuanldpi"
                  style={{ fontSize: '1.5em' }}
                />
              </span>

              <span style={{fontSize:18,color:'#0366C3',marginLeft:10,fontWeight:'bolder'}}>故障工单情况</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div>
                <p>故障总数:</p>
                <p>555单</p>
                <p>环比上月</p>
                {/* <p style={{height:'100%',width:2,}}>11</p> */}
              </div>
              <div>
                <p>已处理:</p>
                <p>555单</p>
                <p>环比上月</p>
              </div>
              <div>
                <p>解决率:</p>
                <p>555单</p>
                <p>环比上月</p>
              </div>
            </div>
          </div>

        </Col>
        <Col span={8}>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', marginRight: 10 }}>
            <div>故障工单情况</div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div>
                <p>故障总数:</p>
                <p>555单</p>
                <p>环比上月</p>
              </div>
            </div>
          </div>

        </Col>
        <Col span={8} style={{ backgroundColor: 'white' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>故障工单情况</div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div>
                <p>故障总数:</p>
                <p>555单</p>
                <p>环比上月</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>



      <div style={{ backgroundColor: 'white' }}>
        <Row gutter={16}>
          <Col span={24}><p>故障责任单位情况</p></Col>
          <Col span={12}>
            {/* <ChartCard title="工单量"> */}
            <Donut
              data={Donutdata}
              height={315}
              total="1161"
              padding={[0, 0, 0, 0]}
              detailParams={newdata => { showDetaillist(newdata) }}
            />
            {/* </ChartCard> */}
          </Col>
          <Col span={12}>
            {/* <ChartCard title="事件工单情况"> */}
            <OrdinaryLine
              height={315}
              detailParams={newdata => { showDetaillist(newdata, 'line') }}
            />
            {/* </ChartCard> */}
          </Col>
        </Row>

      </div>

      {/* </Card> */}


      {/* 
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
                detailParams={newdata => { showDetaillist(newdata, 'barchart') }}
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
      </Row> */}

      <StatisticsModal
        visible={visible}
        title={title}
        handleCancel={() => setVisible(false)}
      />
    </>
  )

}
export default StatisticalAnalysis;