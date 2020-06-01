import React, { Component } from 'react';
import { Modal, Spin } from 'antd';
import { connect } from 'dva';
// import { element } from 'prop-types';

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
@connect(({ download, loading }) => ({
  download,
  loading: loading.models.download,
}))
class ReportModal extends Component {
  state = {
    visible: false,
  };

  showModle = () => {
    const id = this.props.sceneid;
    this.props.fetchReport(id);
    this.setState({
      visible: true,
      // list:this.props.list,
    });
  };

  hanldleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    this.hanldleCancel();
    // 传数据
    // this.props.onDoSumit(values);
  };

  render() {
    const download = (jobid, scriptName) => {
      const { dispatch } = this.props;
      const fileName = `${scriptName}.docx`;
      dispatch({
        type: 'download/newdownload',
        payload: { jobid },
      }).then(res => {
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        // console.log(url);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    };
    const { visible } = this.state;
    const { children } = this.props;
    // const {id,name} =this.props;
    const reportlist = this.props.datas;
    const title = `${this.props.scenemane}报告`;
    return (
      <>
        {withClick(children, this.showModle)}
        <Modal
          title={title}
          visible={visible}
          centered
          maskClosable={false}
          onCancel={this.hanldleCancel}
          onOk={this.handleOk}
        >
          <Spin spinning={this.props.openloading}>
            {reportlist.map(item => {
              // const myUrl = `http://172.16.4.100:8807/oma/download/${item.detail.xxlJobId}/new`;
              return (
                <p key={item.uid}>
                  {/* <a
              // href={myUrl}
              target="_blank"
              rel="noopener noreferrer"
              >
                {item.detail.scriptName}
              </a> */}
                  <a onClick={() => download(item.detail.xxlJobId, item.detail.scriptName)}>
                    {item.detail.scriptName}
                  </a>
                </p>
              );
            })}
          </Spin>
        </Modal>
      </>
    );
  }
}

export default ReportModal;
