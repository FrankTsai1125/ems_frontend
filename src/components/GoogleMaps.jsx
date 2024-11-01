import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// 地圖的配置
const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: 25.062676730927716, // 台北101的經度
    lng: 121.54377889025533, // 台北101的緯度
};

const GoogleMapsComponent = () => {
    return (
        <LoadScript googleMapsApiKey="AIzaSyAoUZkbdjD-yRheoUVkq_Vas5tt378-1eY"> {/* 替換成你的 API 金鑰 */}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15} // 調整縮放級別
            >
                {/* 可以加入標記點 */}
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapsComponent;