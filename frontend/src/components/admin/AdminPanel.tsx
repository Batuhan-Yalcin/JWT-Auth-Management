import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Fade,
  CircularProgress,
  Alert,
  Tooltip,
  Zoom,
  Card,
  CardContent,
  Grid,
  useTheme
} from '@mui/material';
import {
  Delete,
  Edit,
  Check,
  Close,
  Refresh,
  SupervisorAccount,
  Person,
  AdminPanelSettings,
  Security,
  Group,
  ManageAccounts
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getAllUsers, deleteUser, updateUser, UserData } from '../../services/user.service';
import { isAdmin } from '../../services/auth.service';
import api from '../../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface EditDialogState {
  open: boolean;
  user: User | null;
}

const AdminPanel: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState<EditDialogState>({
    open: false,
    user: null
  });
  const [editFormData, setEditFormData] = useState({
    email: ''
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  });

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      if (isAdmin()) {
        await fetchUsers();
      } else {
        toast.error('Bu sayfaya erişim yetkiniz yok');
      }
    };
    checkAdminAndFetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<User[]>('/users');
      setUsers(response.data);
      setStats({
        totalUsers: response.data.length,
        adminUsers: response.data.filter(user => user.roles.includes('ROLE_ADMIN')).length,
        regularUsers: response.data.filter(user => !user.roles.includes('ROLE_ADMIN')).length
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/users/${userId}`);
        toast.success('Kullanıcı başarıyla silindi');
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Kullanıcı silinirken bir hata oluştu');
      }
    }
  };

  const handleEditClick = (user: User) => {
    setEditDialog({
      open: true,
      user
    });
    setEditFormData({
      email: user.email
    });
  };

  const handleEditClose = () => {
    setEditDialog({
      open: false,
      user: null
    });
    setEditFormData({
      email: ''
    });
  };

  const handleEditSubmit = async () => {
    if (!editDialog.user) return;

    try {
      const response = await api.put<User>(`/users/${editDialog.user.id}`, editFormData);
      const updatedUser = response.data;
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      toast.success('Kullanıcı başarıyla güncellendi');
      handleEditClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Kullanıcı güncellenirken bir hata oluştu');
    }
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Box 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: 1,
                display: 'flex'
              }}
            >
              {icon}
            </Box>
          </Box>
          <Typography variant="h3" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Fade in={true} timeout={1000}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Toplam Kullanıcı"
                  value={stats.totalUsers}
                  icon={<Group sx={{ fontSize: 40, opacity: 0.8 }} />}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Admin Kullanıcılar"
                  value={stats.adminUsers}
                  icon={<Security sx={{ fontSize: 40, opacity: 0.8 }} />}
                  color={theme.palette.error.main}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatCard
                  title="Normal Kullanıcılar"
                  value={stats.regularUsers}
                  icon={<Person sx={{ fontSize: 40, opacity: 0.8 }} />}
                  color={theme.palette.success.main}
                />
              </Grid>
            </Grid>
          </Box>

          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 10px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    color: theme.palette.primary.main,
                    fontWeight: 600
                  }}
                >
                  <ManageAccounts sx={{ fontSize: 35 }} />
                  Kullanıcı Yönetimi
                </Typography>
                <Tooltip title="Yenile" arrow TransitionComponent={Zoom}>
                  <IconButton 
                    onClick={fetchUsers} 
                    color="primary"
                    sx={{ 
                      bgcolor: theme.palette.primary.main + '10',
                      '&:hover': {
                        bgcolor: theme.palette.primary.main + '20'
                      }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Kullanıcı Adı</TableCell>
                      <TableCell>E-posta</TableCell>
                      <TableCell>Roller</TableCell>
                      <TableCell align="right">İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence>
                      {users.map((user) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          style={{ display: 'table-row' }}
                        >
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {user.roles.map((role, index) => (
                                <Chip
                                  key={index}
                                  label={role.replace('ROLE_', '')}
                                  color={role.includes('ADMIN') ? 'error' : role.includes('MODERATOR') ? 'warning' : 'primary'}
                                  size="small"
                                  sx={{ 
                                    fontWeight: 500,
                                    '& .MuiChip-label': { px: 2 }
                                  }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Tooltip title="Düzenle" arrow TransitionComponent={Zoom}>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleEditClick(user)}
                                  size="small"
                                  sx={{ 
                                    bgcolor: theme.palette.primary.main + '10',
                                    '&:hover': {
                                      bgcolor: theme.palette.primary.main + '20'
                                    }
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Sil" arrow TransitionComponent={Zoom}>
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteUser(user.id)}
                                  size="small"
                                  sx={{ 
                                    bgcolor: theme.palette.error.main + '10',
                                    '&:hover': {
                                      bgcolor: theme.palette.error.main + '20'
                                    }
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>

          <Dialog 
            open={editDialog.open} 
            onClose={handleEditClose}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 500 }}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Edit color="primary" />
                <Typography variant="h6" component="div">
                  Kullanıcı Düzenle
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <TextField
                autoFocus
                margin="dense"
                label="E-posta"
                type="email"
                fullWidth
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                sx={{ mt: 1 }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button 
                onClick={handleEditClose}
                startIcon={<Close />}
                color="inherit"
                sx={{ borderRadius: 2 }}
              >
                İptal
              </Button>
              <Button
                onClick={handleEditSubmit}
                startIcon={<Check />}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2 }}
              >
                Kaydet
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Fade>
  );
};

export default AdminPanel; 