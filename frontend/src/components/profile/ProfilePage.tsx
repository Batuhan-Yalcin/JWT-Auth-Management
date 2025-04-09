import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Fade,
  useTheme,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import {
  Person,
  Save,
  Edit,
  Email,
  Badge,
  Security,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../../services/auth.service';
import { updateUser } from '../../services/user.service';

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setRoles(user.roles || []);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('Oturum süresi dolmuş');
      }

      await updateUser({
        username,
        email
      });

      const updatedUser = { ...user, username, email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profil başarıyla güncellendi');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Güncelleme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.new !== password.confirm) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }
    setLoading(true);
    try {
      // Şifre değiştirme API'si eklenecek
      toast.success('Şifre başarıyla güncellendi');
      setPassword({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Şifre güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120
      }
    }
  };

  return (
    <Fade in={true} timeout={1000}>
      <Container component="main" maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div variants={cardVariants}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
                      pointerEvents: 'none'
                    }}
                  />
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Avatar
                          sx={{
                            width: 120,
                            height: 120,
                            margin: '0 auto',
                            bgcolor: 'white',
                            color: theme.palette.primary.main,
                            border: '4px solid rgba(255,255,255,0.2)'
                          }}
                        >
                          <Person sx={{ fontSize: 60 }} />
                        </Avatar>
                      </motion.div>
                      <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
                        {username}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                        {email}
                      </Typography>
                      <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {roles.map((role) => (
                          <Chip
                            key={role}
                            label={role.replace('ROLE_', '')}
                            color={role.includes('ADMIN') ? 'error' : role.includes('MODERATOR') ? 'warning' : 'primary'}
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 500,
                              '& .MuiChip-label': { px: 2 }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={8}>
              <motion.div variants={cardVariants}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    borderRadius: 3,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Badge sx={{ fontSize: 30, color: theme.palette.primary.main }} />
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                        Profil Bilgileri
                      </Typography>
                      <IconButton
                        color="primary"
                        onClick={() => setIsEditing(!isEditing)}
                        sx={{ ml: 'auto' }}
                      >
                        <Edit />
                      </IconButton>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={!isEditing}
                            InputProps={{
                              startAdornment: <Person sx={{ mr: 1, color: theme.palette.primary.main }} />
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="E-posta"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            InputProps={{
                              startAdornment: <Email sx={{ mr: 1, color: theme.palette.primary.main }} />
                            }}
                          />
                        </Grid>
                        {isEditing && (
                          <Grid item xs={12}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                  py: 1.5,
                                  mt: 2,
                                  borderRadius: 2,
                                  position: 'relative'
                                }}
                              >
                                {loading ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  <>
                                    <Save sx={{ mr: 1 }} />
                                    Değişiklikleri Kaydet
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </Grid>
                        )}
                      </Grid>
                    </form>

                    <Box sx={{ mt: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Security sx={{ fontSize: 30, color: theme.palette.primary.main }} />
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                          Şifre Değiştir
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 4 }} />

                      <form onSubmit={handlePasswordChange}>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Mevcut Şifre"
                              type={showPassword ? 'text' : 'password'}
                              value={password.current}
                              onChange={(e) => setPassword({ ...password, current: e.target.value })}
                              InputProps={{
                                endAdornment: (
                                  <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                )
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Yeni Şifre"
                              type={showPassword ? 'text' : 'password'}
                              value={password.new}
                              onChange={(e) => setPassword({ ...password, new: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Yeni Şifre Tekrar"
                              type={showPassword ? 'text' : 'password'}
                              value={password.confirm}
                              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                  py: 1.5,
                                  borderRadius: 2,
                                  bgcolor: theme.palette.success.main,
                                  '&:hover': {
                                    bgcolor: theme.palette.success.dark
                                  }
                                }}
                              >
                                {loading ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  <>
                                    <Security sx={{ mr: 1 }} />
                                    Şifreyi Güncelle
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </Grid>
                        </Grid>
                      </form>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Fade>
  );
};

export default ProfilePage; 