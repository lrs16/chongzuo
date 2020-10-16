import React, { Component } from 'react';
import moment from 'moment';
import { Input, Modal, Button, DatePicker } from 'antd';

const ButtonGroup = Button.Group;
const Inputs = Input.Group;
const { RangePicker } = DatePicker;

const buttons = [
  { key: '1', value: '30分钟' },
  { key: '2', value: '1小时' },
  { key: '3', value: '3小时' },
  { key: '4', value: '12小时' },
  { key: '5', value: '1天' },
  { key: '6', value: '3天' },
  { key: '7', value: '7天' },
  { key: '8', value: '1月' },
];

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
class TimeModal extends Component {
  state = {
    visible: false,
  };

  handleopenClick = () => {
    this.setState({
      visible: true,
    });
  };

  hanldleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    this.hanldleCancel();
  };

  onOk = value => {
    const startdata = moment(value[0]).format('YYYY-MM-DD HH:mm ');
    const enddata = moment(value[1]).format('YYYY-MM-DD HH:mm ');
    const datas = `${startdata} ~~ ${enddata}`;
    this.props.onButClick(datas, startdata, enddata);
    this.hanldleCancel();
  };

  onButGroup = value => {
    this.props.onButClick(value);
    this.hanldleCancel();
  };

  render() {
    const { visible } = this.state;
    const { children } = this.props;
    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          mask={false}
          closable={false}
          maskClosable
          width={640}
          footer={null}
          visible={visible}
          onCancel={this.hanldleCancel}
          // style={{ top: 20 ,right:20 }}
        >
          <div style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              style={{ marginRight: '12px' }}
              onClick={() => {
                this.onButGroup('最近一次');
              }}
            >
              最近一次
            </Button>
            <ButtonGroup>
              {buttons.map(({ value }) => [
                <Button
                  onClick={() => {
                    this.onButGroup(value);
                  }}
                >
                  {value}
                </Button>,
              ])}
            </ButtonGroup>
          </div>
          <div>
            <Inputs compact>
              <Button type="primary" style={{ width: 90 }}>
                自 定 义
              </Button>
              {/* <Input style={{ width:502 }} defaultValue="0571" /> */}
              <RangePicker
                style={{ width: 502 }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['开始时间', '结束时间']}
                // onChange={this.onChange}
                onOk={this.onOk}
              />
            </Inputs>
          </div>
        </Modal>
      </>
    );
  }
}

export default TimeModal;
