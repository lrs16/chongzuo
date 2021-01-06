import React, { useRef, useImperativeHandle } from 'react';
import {
} from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

const SummaryQuery = React.forwardRef((props, ref) => {
    const { detailsdata } = props;
    
    const attRef = useRef();
    useImperativeHandle(
        ref,
        () => ({
            attRef,
        }),
        [],
    );
    return (
        <div style={{ paddingLeft: 45, paddingTop: 10  }}>
            {
                detailsdata !== undefined && (
                    <>
                        <DescriptionList size="large">
                            <Description term="故障回顾情况">{detailsdata.closeContent || ''}</Description>
                            <Description term="关闭时间">{detailsdata.closeTime || ''}</Description>
                            <Description term="上传附件">XXXX附件.doc</Description>
                            <Description term="关闭人">{detailsdata.closeUser || ''}</Description>
                            <Description term="关闭人单位">{detailsdata.closeUnit || ''}</Description>
                            <Description term="关闭人部门">{detailsdata.closeDept || ''}</Description>
                        </DescriptionList>
                    </>
                )
            }

        </div>
    );
});

export default SummaryQuery;
