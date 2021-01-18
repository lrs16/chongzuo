import React, { useRef, useImperativeHandle } from 'react';
import {
} from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

const ConfirmQuery = React.forwardRef((props, ref) => {
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
        <div style={{ paddingLeft: 45, paddingTop: 10 }}>
            {
                detailsdata !== undefined && (
                    <>
                        <DescriptionList size="large">
                            <Description term="确认结果">{detailsdata.confirmResult || ''}</Description>
                            <Description term="确认时间">{detailsdata.confirmTime || ''}</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="确认说明">{detailsdata.confirmContent || ''}</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="上传附件">XXXX附件.doc</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="确认人">{detailsdata.confirmUser || ''}</Description>
                            <Description term="确认单位">{detailsdata.confirmUnit || ''}</Description>
                            <Description term="确认部门">{detailsdata.confirmDept || ''}</Description>
                        </DescriptionList>
                    </>
                )
            }

        </div>
    );
});

export default ConfirmQuery;
