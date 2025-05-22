import IconButton from '@mui/material/IconButton';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LayersIcon from '@mui/icons-material/Layers';
import { Paper } from '@mui/material';

interface MapControlsProps {
  onMyLocation: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onLayerChange?: () => void;
}

const MapControls = ({
  onMyLocation,
  onZoomIn,
  onZoomOut,
  onLayerChange,
}: MapControlsProps) => {
  return (
    <Paper elevation={2} className="flex flex-col p-1">
      {/* 내 위치 버튼 */}
      <IconButton 
        onClick={onMyLocation}
        className="text-gray-700 hover:text-primary"
        title="내 위치"
      >
        <MyLocationIcon />
      </IconButton>

      {/* 확대 버튼 */}
      {onZoomIn && (
        <IconButton 
          onClick={onZoomIn}
          className="text-gray-700 hover:text-primary"
          title="확대"
        >
          <AddIcon />
        </IconButton>
      )}

      {/* 축소 버튼 */}
      {onZoomOut && (
        <IconButton 
          onClick={onZoomOut}
          className="text-gray-700 hover:text-primary"
          title="축소"
        >
          <RemoveIcon />
        </IconButton>
      )}

      {/* 레이어 변경 버튼 */}
      {onLayerChange && (
        <IconButton 
          onClick={onLayerChange}
          className="text-gray-700 hover:text-primary"
          title="레이어 변경"
        >
          <LayersIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default MapControls; 