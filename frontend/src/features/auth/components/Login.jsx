import {
  Box,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {
  selectLoggedInUser,
  loginAsync,
  selectLoginStatus,
  selectLoginError,
  clearLoginError,
  resetLoginStatus,
} from "../AuthSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const Login = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectLoginStatus);
  const error = useSelector(selectLoginError);
  const loggedInUser = useSelector(selectLoggedInUser);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (loggedInUser) {
      if (loggedInUser?.isAdmin) {
        navigate("/admin/dashboard");
      } else if (loggedInUser?.isVerified) {
        navigate("/");
      } else {
        navigate("/verify-otp");
      }
    }
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (status === "fullfilled" && loggedInUser?.isVerified === true) {
      toast.success(`Login successful`);
      reset();
    }
    return () => {
      dispatch(clearLoginError());
      dispatch(resetLoginStatus());
    };
  }, [status]);

  const handleLogin = (data) => {
    const cred = { ...data };
    delete cred.confirmPassword;
    dispatch(loginAsync(cred));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Stack
      width={"100vw"}
      height={"100vh"}
      flexDirection={"row"}
      sx={{
        overflow: "hidden",
        bgcolor: "#ffffff",
        position: "relative",
      }}
    >
      {/* Minimal grid lines */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          opacity: 0.03,
          background: `
            linear-gradient(90deg, #000 1px, transparent 1px),
            linear-gradient(180deg, #000 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Left side - minimal illustration */}
      {!is900 && (
        <Stack
          flex={1}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ position: "relative" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Box
              sx={{
                width: "300px",
                height: "300px",
                border: "1px solid #000",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: "200px",
                  height: "200px",
                  border: "1px solid #000",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ fontSize: "4rem" }}>💎</Typography>
              </Box>
            </Box>
          </motion.div>
        </Stack>
      )}

      {/* Right side - form */}
      <Stack
        flex={1}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ px: 3 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: "380px" }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              sx={{
                width: "48px",
                height: "48px",
                border: "1.5px solid #000",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 2rem",
                fontSize: "1.25rem",
              }}
            >
              💎
            </Box>
          </motion.div>

          {/* Brand */}
          <Stack alignItems={"center"} mb={5}>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 300,
                letterSpacing: "0.3em",
                color: "#000",
                mb: 0.5,
              }}
            >
              Al Marjan
            </Typography>
            <Box
              sx={{
                width: "40px",
                height: "1px",
                bgcolor: "#000",
                my: 0.5,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "#666",
                fontWeight: 300,
              }}
            >
              LUXURY SCENTS
            </Typography>
          </Stack>

          {/* Form */}
          <Stack
            component={"form"}
            noValidate
            onSubmit={handleSubmit(handleLogin)}
            spacing={3}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <TextField
                fullWidth
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                    message: "Enter a valid email",
                  },
                })}
                placeholder="Email"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "transparent",
                    "& fieldset": {
                      border: "none",
                      borderBottom: "1px solid #e0e0e0",
                      borderRadius: 0,
                    },
                    "&:hover fieldset": {
                      borderBottom: "1px solid #999",
                    },
                    "&.Mui-focused fieldset": {
                      borderBottom: "2px solid #000",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "0.875rem 0",
                    fontSize: "0.9rem",
                    fontWeight: 300,
                  },
                }}
              />
              {errors.email && (
                <FormHelperText sx={{ mt: 1, ml: 0 }} error>
                  {errors.email.message}
                </FormHelperText>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TextField
                type={showPassword ? "text" : "password"}
                fullWidth
                {...register("password", { required: "Password is required" })}
                placeholder="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        sx={{ color: "#666" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "transparent",
                    "& fieldset": {
                      border: "none",
                      borderBottom: "1px solid #e0e0e0",
                      borderRadius: 0,
                    },
                    "&:hover fieldset": {
                      borderBottom: "1px solid #999",
                    },
                    "&.Mui-focused fieldset": {
                      borderBottom: "2px solid #000",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "0.875rem 0",
                    fontSize: "0.9rem",
                    fontWeight: 300,
                  },
                }}
              />
              {errors.password && (
                <FormHelperText sx={{ mt: 1, ml: 0 }} error>
                  {errors.password.message}
                </FormHelperText>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LoadingButton
                fullWidth
                loading={status === "pending"}
                type="submit"
                sx={{
                  height: "48px",
                  bgcolor: "#000",
                  color: "#fff",
                  borderRadius: 0,
                  fontSize: "0.85rem",
                  letterSpacing: "0.15em",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "#333",
                  },
                  "&.MuiLoadingButton-loading": {
                    bgcolor: "#000",
                  },
                }}
              >
                ENTER
              </LoadingButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Stack spacing={2} alignItems={"center"} mt={2}>
                <Typography
                  component={Link}
                  to={"/forgot-password"}
                  sx={{
                    color: "#666",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    fontWeight: 300,
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#000",
                    },
                  }}
                >
                  Forgot Password?
                </Typography>

                <Typography
                  sx={{
                    color: "#666",
                    fontSize: "0.85rem",
                    fontWeight: 300,
                  }}
                >
                  New to PV Parfum?{" "}
                  <Typography
                    component={Link}
                    to={"/signup"}
                    sx={{
                      color: "#000",
                      textDecoration: "none",
                      fontWeight: 400,
                      borderBottom: "1px solid transparent",
                      transition: "border-color 0.3s ease",
                      "&:hover": {
                        borderBottomColor: "#000",
                      },
                    }}
                  >
                    Create Account
                  </Typography>
                </Typography>
              </Stack>
            </motion.div>
          </Stack>
        </motion.div>
      </Stack>
    </Stack>
  );
};