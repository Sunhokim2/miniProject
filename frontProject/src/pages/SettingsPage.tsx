import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 설정 업데이트 뮤테이션
  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedUser: any) => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        throw new Error('설정 업데이트에 실패했습니다.');
      }

      return response.json();
    },
    onSuccess: () => {
      setSnackbar({ open: true, message: '설정이 저장되었습니다.' });
    },
    onError: () => {
      setSnackbar({ open: true, message: '설정 저장에 실패했습니다.' });
    }
  });

  // 회원탈퇴 뮤테이션
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('회원탈퇴에 실패했습니다.');
      }

      return response.json();
    },
    onSuccess: () => {
      logout();
      navigate('/');
      setSnackbar({ open: true, message: '회원탈퇴가 완료되었습니다.' });
    },
    onError: () => {
      setSnackbar({ open: true, message: '회원탈퇴에 실패했습니다.' });
    }
  });

  if (!user) return <Box className="p-4">사용자 정보를 찾을 수 없습니다.</Box>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Typography variant="h4" component="h1" className="mb-8 text-gray-900 dark:text-white">
          설정
        </Typography>

        {/* 계정 정보 */}
        <Paper className="p-6 bg-white dark:bg-gray-800">
          <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white">
            계정 정보
          </Typography>
          <Box className="space-y-4">
            <div>
              <Typography variant="subtitle2" color="text.secondary" className="dark:text-gray-400">
                사용자 이름
              </Typography>
              <Typography className="text-gray-900 dark:text-white">{user.user_name}</Typography>
            </div>
            <div>
              <Typography variant="subtitle2" color="text.secondary" className="dark:text-gray-400">
                이메일
              </Typography>
              <Typography className="text-gray-900 dark:text-white">{user.email}</Typography>
            </div>
            <div>
              <Typography variant="subtitle2" color="text.secondary" className="dark:text-gray-400">
                가입일
              </Typography>
              <Typography className="text-gray-900 dark:text-white">
                {new Date(user.created_at).toLocaleDateString()}
              </Typography>
            </div>
          </Box>
        </Paper>

        {/* 버튼 그룹 */}
        <Box className="mt-6 flex justify-end space-x-4">
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            disabled={deleteAccountMutation.isPending}
          >
            회원탈퇴
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={() => updateSettingsMutation.mutate(user)}
            disabled={updateSettingsMutation.isPending}
          >
            설정 저장
          </Button>
        </Box>

        {/* 회원탈퇴 확인 다이얼로그 */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>회원탈퇴 확인</DialogTitle>
          <DialogContent>
            <Typography>
              정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
            <Button 
              onClick={() => {
                setDeleteDialogOpen(false);
                deleteAccountMutation.mutate();
              }}
              color="error"
              variant="contained"
            >
              탈퇴하기
            </Button>
          </DialogActions>
        </Dialog>

        {/* 스낵바 */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={updateSettingsMutation.isError || deleteAccountMutation.isError ? 'error' : 'success'}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default SettingsPage; 