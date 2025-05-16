import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsIcon from '@mui/icons-material/Notifications';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // 로그아웃 다이얼로그 열기
  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  // 로그아웃 다이얼로그 닫기
  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  // 로그아웃 실행
  const handleLogout = async () => {
    await logout();
    handleCloseLogoutDialog();
  };

  // 알림 설정 토글
  const handleToggleNotifications = () => {
    setNotifications((prev) => !prev);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Typography variant="h4" component="h1" className="font-bold text-gray-900 dark:text-white mb-6">
        설정
      </Typography>

      {/* 프로필 카드 */}
      <Card className="mb-6 dark:bg-gray-800">
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar 
              sx={{ width: 80, height: 80 }}
              className="bg-primary"
            >
              {user?.user_name.charAt(0).toUpperCase()}
            </Avatar>
            <div className="text-center sm:text-left">
              <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
                {user?.user_name}
              </Typography>
              <Typography variant="body1" className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<PersonIcon />}
                className="mt-2"
              >
                프로필 수정
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 설정 목록 */}
      <Card className="dark:bg-gray-800">
        <List disablePadding>
          {/* 테마 설정 */}
          <ListItem>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText 
              primary="다크 모드" 
              secondary="화면 테마를 어둡게 또는 밝게 설정합니다"
            />
            <ListItemSecondaryAction>
              <Switch 
                edge="end"
                checked={isDarkMode}
                onChange={toggleTheme}
                inputProps={{ 'aria-labelledby': 'switch-theme' }}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          {/* 알림 설정 */}
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="알림" 
              secondary="앱 알림을 켜거나 끕니다"
            />
            <ListItemSecondaryAction>
              <Switch 
                edge="end"
                checked={notifications}
                onChange={handleToggleNotifications}
                inputProps={{ 'aria-labelledby': 'switch-notifications' }}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider variant="inset" component="li" />

          {/* 카테고리 관리 */}
          <ListItem button>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText 
              primary="카테고리 관리" 
              secondary="맛집 카테고리를 관리합니다"
            />
          </ListItem>

          <Divider variant="inset" component="li" />

          {/* 개인정보 보호 */}
          <ListItem button>
            <ListItemIcon>
              <PrivacyTipIcon />
            </ListItemIcon>
            <ListItemText 
              primary="개인정보 보호" 
              secondary="개인정보 설정을 관리합니다"
            />
          </ListItem>

          <Divider variant="inset" component="li" />

          {/* 앱 정보 */}
          <ListItem button>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText 
              primary="앱 정보" 
              secondary="버전, 라이센스 정보 등"
            />
          </ListItem>

          <Divider variant="inset" component="li" />

          {/* 로그아웃 */}
          <ListItem button onClick={handleOpenLogoutDialog}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="로그아웃" 
              className="text-red-500"
            />
          </ListItem>
        </List>
      </Card>

      {/* 로그아웃 확인 다이얼로그 */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
      >
        <DialogTitle>로그아웃</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말 로그아웃 하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="primary">
            취소
          </Button>
          <Button onClick={handleLogout} color="error">
            로그아웃
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsPage; 