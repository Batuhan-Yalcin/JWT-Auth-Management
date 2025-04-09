import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Tab,
  Tabs,
  useTheme,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  useMediaQuery,
  CircularProgress,
  alpha
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login,
  PersonAdd,
  ArrowForward
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, register } from '../../services/auth.service';

// Parçacık animasyonu için özel bileşen
const Particles: React.FC = () => {
  const particleCount = 50;
  const particles = Array.from({ length: particleCount });

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    >
      {particles.map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight
            ],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box>{children}</Box>}
  </div>
);

const AuthPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }
    setLoading(true);
    try {
      await login(loginData.username, loginData.password);
      toast.success('Başarıyla giriş yapıldı');
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }
    if (!registerData.username || !registerData.email || !registerData.password) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }
    setLoading(true);
    try {
      await register(registerData.username, registerData.email, registerData.password);
      toast.success('Kayıt başarılı! Lütfen giriş yapın');
      setTab(0);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Kayıt olurken bir hata oluştu');
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
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.3
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Particles />
      
      {/* Dekoratif ışık efektleri */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)} 0%, transparent 70%)`,
          animation: 'pulse 4s infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 0.5 },
            '50%': { transform: 'scale(1.2)', opacity: 0.3 },
            '100%': { transform: 'scale(1)', opacity: 0.5 }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.2)} 0%, transparent 70%)`,
          animation: 'pulse 3s infinite',
          animationDelay: '1s'
        }}
      />

      <Container component="main" maxWidth="sm">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          style={{ width: '100%', position: 'relative', zIndex: 1 }}
        >
          <Card
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative'
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      margin: '0 auto',
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      border: '4px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                  >
                    {tab === 0 ? <Login sx={{ fontSize: 50 }} /> : <PersonAdd sx={{ fontSize: 50 }} />}
                  </Avatar>
                </motion.div>
                <Typography
                  variant="h3"
                  sx={{
                    mt: 3,
                    color: 'white',
                    fontWeight: 700,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    letterSpacing: '-0.5px'
                  }}
                >
                  {tab === 0 ? 'Hoş Geldiniz' : 'Hesap Oluştur'}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 1,
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 500
                  }}
                >
                  {tab === 0 ? 'Hesabınıza giriş yapın' : 'Yeni bir hesap oluşturun'}
                </Typography>
              </Box>

              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  mb: 4,
                  '& .MuiTab-root': {
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: 64,
                    '&.Mui-selected': {
                      color: 'white'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'white',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                <Tab
                  label="Giriş Yap"
                  icon={<Login />}
                  iconPosition="start"
                  sx={{ borderRadius: '8px 8px 0 0' }}
                />
                <Tab
                  label="Kayıt Ol"
                  icon={<PersonAdd />}
                  iconPosition="start"
                  sx={{ borderRadius: '8px 8px 0 0' }}
                />
              </Tabs>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={formVariants}
                >
                  <TabPanel value={tab} index={0}>
                    <form onSubmit={handleLogin}>
                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Kullanıcı Adı"
                          value={loginData.username}
                          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                          sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              borderRadius: 2,
                              '&:hover': {
                                '& fieldset': {
                                  borderColor: theme.palette.primary.main,
                                }
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.primary.main,
                              fontWeight: 500
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="primary" />
                              </InputAdornment>
                            )
                          }}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          type={showPassword ? 'text' : 'password'}
                          label="Şifre"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          sx={{
                            mb: 4,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              borderRadius: 2,
                              '&:hover': {
                                '& fieldset': {
                                  borderColor: theme.palette.primary.main,
                                }
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.primary.main,
                              fontWeight: 500
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock color="primary" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          disabled={loading}
                          sx={{
                            py: 2,
                            bgcolor: 'white',
                            color: theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.9)'
                            },
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                              transform: 'translateX(-100%)',
                              transition: 'transform 0.3s',
                            },
                            '&:hover::after': {
                              transform: 'translateX(100%)',
                            }
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={28} />
                          ) : (
                            <>
                              Giriş Yap
                              <ArrowForward sx={{ ml: 1 }} />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </TabPanel>

                  <TabPanel value={tab} index={1}>
                    <form onSubmit={handleRegister}>
                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          label="Kullanıcı Adı"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                          sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              borderRadius: 2,
                              '&:hover': {
                                '& fieldset': {
                                  borderColor: theme.palette.primary.main,
                                }
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.primary.main,
                              fontWeight: 500
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="primary" />
                              </InputAdornment>
                            )
                          }}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          type="email"
                          label="E-posta"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              borderRadius: 2,
                              '&:hover': {
                                '& fieldset': {
                                  borderColor: theme.palette.primary.main,
                                }
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.primary.main,
                              fontWeight: 500
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color="primary" />
                              </InputAdornment>
                            )
                          }}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          type={showPassword ? 'text' : 'password'}
                          label="Şifre"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              borderRadius: 2,
                              '&:hover': {
                                '& fieldset': {
                                  borderColor: theme.palette.primary.main,
                                }
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.primary.main,
                              fontWeight: 500
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock color="primary" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <TextField
                          fullWidth
                          type={showPassword ? 'text' : 'password'}
                          label="Şifre Tekrar"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          sx={{
                            mb: 4,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              borderRadius: 2,
                              '&:hover': {
                                '& fieldset': {
                                  borderColor: theme.palette.primary.main,
                                }
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.primary.main,
                              fontWeight: 500
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock color="primary" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          disabled={loading}
                          sx={{
                            py: 2,
                            bgcolor: 'white',
                            color: theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.9)'
                            },
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                              transform: 'translateX(-100%)',
                              transition: 'transform 0.3s',
                            },
                            '&:hover::after': {
                              transform: 'translateX(100%)',
                            }
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={28} />
                          ) : (
                            <>
                              Kayıt Ol
                              <ArrowForward sx={{ ml: 1 }} />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </TabPanel>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AuthPage;