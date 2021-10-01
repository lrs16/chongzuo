import React, { useState } from 'react';
// import { connect } from 'dva';
import {
    Modal,
    Button,
    Icon,
    message
} from 'antd';

import { backupSoftConfigFile, pullSoftConfigFile } from '../services/api';

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};

function GetFileModal(props) {
    const {
        children,
    } = props;

    const [visible, setVisible] = useState(false);

    const handleCancel = () => {
        setVisible(false);
    };

    // const handleOk = () => {
    //     // 关闭弹窗
    //     handleCancel();
    //     resetFields();
    // };

    const handleopenClick = () => {
        setVisible(true);
    };

    const handleBackupFiles = () => { // 备份后获取
        const softIds = [];
        backupSoftConfigFile(softIds).then(res => {
            if (res.code === 200) {
                pullSoftConfigFile(softIds).then(resp => {
                    if (res.code === 200) {
                        message.success(resp.msg);
                        handleCancel();
                    } else {
                        message.error(res.msg);
                    }
                })
            } else {
                message.error(res.msg);
            }
        });
    };

    const handlePullFiles = () => { // 直接获取
        const softIds = [];
        pullSoftConfigFile(softIds).then(resp => {
            if (resp.code === 200) {
                message.success(resp.msg);
                handleCancel();
            } else {
                message.error(resp.msg);
            }
        })
    };

    return (
        <>
            {withClick(children, handleopenClick)}
            <Modal
                title={<><Icon type="exclamation-circle" style={{ fontSize: '25px', color: '#08c', marginTop: 5 }} />&nbsp;&nbsp;&nbsp;&nbsp;获取文件提示</>}
                onCancel={() => handleCancel()}
                visible={visible}
                width={350}
                footer={[
                    <span style={{ borderTop: 0 }}>
                        <Button type="primary" onClick={() => handleBackupFiles()}>
                            备份后获取
                        </Button>
                        <Button type="primary" onClick={() => handlePullFiles()}>
                            直接获取
                        </Button>
                        <Button type="back" onClick={() => handleCancel()}>
                            取消
                        </Button></span>
                ]}
            >
                <p>获取最新文件，建议备份文件后再获取，若直接获取文件会覆盖当前列表数据！</p>
            </Modal>
        </>
    );
}

export default GetFileModal;