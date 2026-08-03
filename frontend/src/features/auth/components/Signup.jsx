import { Box, Divider, FormHelperText, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab';
import { selectLoggedInUser, signupAsync, selectSignupStatus, selectSignupError, clearSignupError, resetSignupStatus } from '../AuthSlice'
import { toast } from 'react-toastify'
import { MotionConfig, motion } from 'framer-motion'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

export const Signup = () => {
  const dispatch = useDispatch()
  const status = useSelector(selectSignupStatus)
  const error = useSelector(selectSignupError)
  const loggedInUser = useSelector(selectLoggedInUser)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const theme = useTheme()
  const is900 = useMediaQuery(theme.breakpoints.down(900))
  const is480 = useMediaQuery(theme.breakpoints.down(480))

  useEffect(() => {
    if (loggedInUser && !loggedInUser?.isVerified) navigate("/verify-otp")
    else if (loggedInUser) navigate("/")
  }, [loggedInUser])

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (status === 'fullfilled') {
      toast.success("Welcome to Cubwear! Please verify your email to start shopping.")
      reset()
    }
    return () => {
      dispatch(clearSignupError())
      dispatch(resetSignupStatus())
    }
  }, [status])

  const handleSignup = (data) => {
    const cred = { ...data }
    delete cred.confirmPassword
    dispatch(signupAsync(cred))
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#EAEDED', display: 'flex', flexDirection: 'column' }}>

      {/* Top Navbar */}
      <Box sx={{ bgcolor: '#131921', py: 1.5, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#FF9900', letterSpacing: 2 }}>
          CUBWEAR
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, px: 2 }}>
        <Stack
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            border: '1px solid #D5D9D9',
            p: is480 ? 3 : 4,
            width: is480 ? '95vw' : '100%',
            maxWidth: 420,
            boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
          }}
          spacing={2}
        >
          {/* Form Header */}
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Box sx={{ bgcolor: '#FF9900', borderRadius: '50%', p: 0.8, display: 'flex' }}>
              <PersonAddOutlinedIcon sx={{ fontSize: 18, color: '#000' }} />
            </Box>
            <Stack>
              <Typography variant="h6" fontWeight={600} color="#0F1111">
                Create account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join millions of shoppers on Cubwear
              </Typography>
            </Stack>
          </Stack>

          <Stack
            spacing={2}
            component={'form'}
            noValidate
            onSubmit={handleSubmit(handleSignup)}
          >
            <MotionConfig whileHover={{ y: -2 }}>

              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={500} color="#0F1111">Your name</Typography>
                <motion.div>
                  <TextField fullWidth size="small" {...register("name", { required: "Username is required" })} placeholder="First and last name" />
                  {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
                </motion.div>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={500} color="#0F1111">Email address</Typography>
                <motion.div>
                  <TextField
                    fullWidth size="small"
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, message: "Enter a valid email" }
                    })}
                    placeholder="Enter your email"
                  />
                  {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
                </motion.div>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={500} color="#0F1111">Password</Typography>
                <motion.div>
                  <TextField
                    type="password" fullWidth size="small"
                    {...register("password", {
                      required: "Password is required",
                      pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, message: "Min 8 chars, 1 uppercase, 1 lowercase, 1 number" }
                    })}
                    placeholder="At least 8 characters"
                  />
                  {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
                </motion.div>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={500} color="#0F1111">Re-enter password</Typography>
                <motion.div>
                  <TextField
                    type="password" fullWidth size="small"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value, fromValues) => value === fromValues.password || "Passwords don't match"
                    })}
                    placeholder="Re-enter your password"
                  />
                  {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
                </motion.div>
              </Stack>

            </MotionConfig>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <LoadingButton
                fullWidth
                sx={{
                  height: '2.5rem',
                  bgcolor: '#FF9900',
                  color: '#000',
                  fontWeight: 600,
                  borderRadius: '4px',
                  boxShadow: '0 1px 0 rgba(255,255,255,.4) inset,0 1px 2px rgba(0,0,0,.2)',
                  '&:hover': { bgcolor: '#E47911' },
                  mt: 1
                }}
                loading={status === 'pending'}
                type="submit"
                variant="contained"
              >
                Create your Cubwear account
              </LoadingButton>
            </motion.div>

            <Typography variant="body2" color="text.secondary" textAlign="center" fontSize={11}>
              By creating an account, you agree to Cubwear's{' '}
              <span style={{ color: '#0066C0', cursor: 'pointer' }}>Conditions of Use</span> and{' '}
              <span style={{ color: '#0066C0', cursor: 'pointer' }}>Privacy Notice</span>.
            </Typography>

            <Divider />

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Already have an account?{' '}
              <Typography
                component={Link}
                to="/login"
                variant="body2"
                sx={{ color: '#0066C0', textDecoration: 'none', fontWeight: 500, '&:hover': { textDecoration: 'underline', color: '#C45500' } }}
              >
                Sign in
              </Typography>
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#232F3E', py: 2, textAlign: 'center' }}>
        <Stack direction="row" justifyContent="center" spacing={3}>
          {['Conditions of Use', 'Privacy Notice', 'Help'].map((item) => (
            <Typography key={item} variant="body2" sx={{ color: '#DDD', cursor: 'pointer', '&:hover': { color: '#FF9900' } }}>
              {item}
            </Typography>
          ))}
        </Stack>
        <Typography variant="body2" color="#999" mt={1}>
          © 2024 Cubwear. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}
