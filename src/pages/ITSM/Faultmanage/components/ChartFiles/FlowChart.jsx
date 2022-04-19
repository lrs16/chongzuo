import G6 from '@antv/g6';
import React, { useEffect, useRef } from 'react';
import flowpic from '@/assets/flowpic.png';

function FlowChart(props) {
  const { data, nodeSize, divHeight } = props;
  const { Util } = G6;
  const ChartRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById('container');
    const width = container.scrollWidth + 10000;
    const height = container.scrollHeight || 500;
    const graph = new G6.Graph({
      container: 'container',
      width,
      height,
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        nodeSize,
        preventOverlap: true, // 设置防止重叠
        preventOverlapPadding: 300,
        controlPoints: true, 
        nodesepFunc: () => -100,
        ranksepFunc: () => -60,
      },
      defaultNode: { // 默认节点
        size: [28, 28],
        type: 'circle',
        style: {
          lineWidth: 2,
          stroke: '#10C510',
          fill: '#10C510',
        },
      },
      defaultEdge: { // 默认连接线
        type: 'polyline',
        size: 2, // 线的宽度
        color: '#e2e2e2',
        style: {
          radius: 0,
        },
      },
    });

    // 节点样式
    graph.node(node => {
      if (node.currentNode === 'yes' && node.type !== 'inner-animate') { // 走过的节点
        return {
          style: {
            fill: '#10C510',
            stroke: '#10C510',
          },
        };
      }

      if (node.type === 'inner-animate') { // 正在走的节点
        const obj = node;
        obj.img = flowpic;
        obj.size = [28, 28];
        return {
          style: {
            fill: '#C1EB08',
            stroke: '#C1EB08',
          },
        };
      }

      return { // 未到的节点
        style: {
          fill: '#FFF',
          stroke: '#97A8BE',
        },
      };
    });

    // 连接线的样式（已走的流程绿绿绿，未走的流程灰灰灰）
    graph.edge(edge => {
      return {
        style: {
          stroke: edge.currentStatus === 'yes' ? '#52C41A' : '#97A8BE',
        },
      };
    });

    graph.data(data);
    graph.render();
  }, []);

  // 当前流程
  G6.registerNode(
    'inner-animate',
    {
      afterDraw(cfg, group) {
        const { labels } = cfg;
        const newArr = labels.split(','); // 节点名
        const size = cfg.size;
        const width = size[0];
        const height = size[1];
        const image = group.addShape('image', { // 圆圈图
          attrs: {
            x: -width / 2,
            y: -height / 2,
            width,
            height,
            img: cfg.img,
          },
          name: 'image-shape',
        });
        image.animate( // 转动效果
          ratio => {
            const toMatrix = Util.transform(
              [1, 0, 0, 0, 1, 0, 0, 0, 1],
              [['r', ratio * Math.PI * 2]],
            );
            return {
              matrix: toMatrix,
            };
          },
          {
            repeat: true,
            duration: 2000,
            easing: 'easeCubic',
          },
        );
        if (cfg.img && newArr) {
          group.addShape('text', { // 圆圈
            attrs: {
              text: newArr[0] || '',
              x: -width,
              y: width + 10,
              fontSize: 15,
              fill: '#C1EB08',
              position: 'center',
            },
          });
          group.addShape('text', { // 圆圈数字
            attrs: {
              text: newArr[1] || '',
              x:
                Number(newArr[1]) > 9
                  ? -width / 4
                  : Number(newArr[1]) <= 9
                  ? -width / 8
                  : -width / 4,
              y: width / 4,
              fontSize: 14,
              fill: '#FFF',
              position: 'center',
            },
          });
        }
      },
    },
    'circle',
  );

  // 自定义节点
  G6.registerNode(
    'label',
    {
      // 绘制节点
      afterDraw(cfg, group) { // 节点圆圈
        const { labels } = cfg;
        const newArr = labels.split(',');
        const size = cfg.size;
        const width = size[0];
        if (cfg.labels && newArr.length) {
          group.addShape('text', {
            attrs: {
              text: newArr[0] || '',
              x: -width / 2,
              y: width + 10,
              fontSize: 15,
              fill: cfg.currentNode ? '#10C510' : '#97A8BE',
              position: 'center',
            },
          });
        }

        if (newArr.length > 1) { // 节点蚊子
          group.addShape('text', {
            attrs: {
              text: newArr[1] || '',
              x:
                Number(newArr[1]) > 9
                  ? -width / 4
                  : Number(newArr[1]) <= 9
                  ? -width / 8
                  : -width / 4,
              y: 0,
              fill: cfg.currentNode ? '#FFF' : '#97A8BE',
              fontSize: 14,
              textBaseline: 'middle',
              fontWeight: 'bold',
              position: 'center',
            },
          });
        }
      },
    },
    'circle',
  );

  return (
    <div
      id="container"
      ref={ChartRef}
      style={{
        height: divHeight, // 12个字时设置
        padding: 20,
        // overflowX: 'scroll',
        backgroundColor: 'white',
      }}
    />
  );
}

export default FlowChart;
