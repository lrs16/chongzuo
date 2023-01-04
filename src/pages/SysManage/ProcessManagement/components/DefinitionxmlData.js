import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import styles from './../style.less';

const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};
@connect(({ processmanagement, loading }) => ({
    processmanagement,
    loading: loading.models.processmanagement,
}))
class DefinitionxmlData extends Component {
    state = {
        visible: false,
        xmlData: '',
    };

    handleopenClick = () => {
        const {
            id, resourceName
        } = this.props;

        this.props.dispatch({
            type: 'processmanagement/xmldataResources',
            payload: {
                id,
                resourceName,
            },
        }).then(res => {
            this.setState({ xmlData: res });
        })
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.handleCancel();
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { visible, xmlData } = this.state;
        const { children, title } = this.props;
        return (
            <>
                {withClick(children, this.handleopenClick)}
                <Modal
                    title={title}
                    visible={visible}
                    centered
                    closable
                    footer={null}
                    maskClosable={false}
                    width='60%'
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    footer={null}
                >
                    <div className={styles.blobimg}>
                        {xmlData}
                    </div>
                </Modal>
            </>
        );
    }
}

export default DefinitionxmlData;
