import React from 'react';
import loader from './assets/images/loading.gif';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loading = () => {
    return (
        <div className='w-full flex text-center justify-center'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} className="loader" />        </div>
    )
}

export default Loading;