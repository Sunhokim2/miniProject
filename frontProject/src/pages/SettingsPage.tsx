import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/mocks/users';
import { users } from '@/mocks/users';
import { useAuth } from '@/hooks/useAuth';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const SettingsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // 사용자 데이터 조회
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => Promise.resolve({ data: users }),
  });

  // 설정 업데이트 뮤테이션
  const updateSettingsMutation = useMutation({
    mutationFn: (updatedUser: User) => {
      // 실제 API 호출로 대체될 부분
      return Promise.resolve(updatedUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSnackbar({ open: true, message: '설정이 저장되었습니다.' });
    },
    onError: () => {
      setSnackbar({ open: true, message: '설정 저장에 실패했습니다.' });
    }
  });

  // 현재 사용자 정보 찾기
  const currentUser = userData?.data.find(u => u.id === user?.id);

  if (isLoading) return <Box className="p-4">로딩 중...</Box>;
  if (error) return <Box className="p-4">에러가 발생했습니다.</Box>;
  if (!currentUser) return <Box className="p-4">사용자 정보를 찾을 수 없습니다.</Box>;

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
              <Typography className="text-gray-900 dark:text-white">{currentUser.user_name}</Typography>
            </div>
            <div>
              <Typography variant="subtitle2" color="text.secondary" className="dark:text-gray-400">
                이메일
              </Typography>
              <Typography className="text-gray-900 dark:text-white">{currentUser.email}</Typography>
            </div>
            <div>
              <Typography variant="subtitle2" color="text.secondary" className="dark:text-gray-400">
                가입일
              </Typography>
              <Typography className="text-gray-900 dark:text-white">
                {new Date(currentUser.created_at).toLocaleDateString()}
              </Typography>
            </div>
          </Box>
        </Paper>

        {/* 저장 버튼 */}
        <Box className="mt-6 flex justify-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={() => updateSettingsMutation.mutate(currentUser)}
            disabled={updateSettingsMutation.isPending}
          >
            설정 저장
          </Button>
        </Box>

        {/* 스낵바 */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={updateSettingsMutation.isError ? 'error' : 'success'}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default SettingsPage; 