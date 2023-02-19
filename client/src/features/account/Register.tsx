import Avatar from "@mui/material/Avatar";

import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import agent from "../../app/api/agent";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    setError,
    reset,
  } = useForm({
    // mode to validate the input
    mode: "all",
  });

  function handleApiErrors(errors: any) {
    if (errors.length > 0) {
      errors.forEach((err: any) => {
        if (err.includes("Password")) {
          // password - input's name
          setError("password", { message: err });
        } else if (err.includes("Email")) {
          setError("email", { message: err });
        } else if (err.includes("Username")) {
          setError("username", { message: err });
        }
      });
    }
  }

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(data => {
          agent.Account.register(data)
            .then(() => {
              toast.success("Registration successful - you can now login!");
              navigate("/login");
            })
            .catch(err => handleApiErrors(err));

          reset();
        })}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          // name="username" - it is in the register method

          {...register("username", { required: "Username is required" })}
          // double bang cast username into boolean
          error={!!errors.username}
          helperText={errors?.username?.message}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email address"
          {...register("email", {
            required: "Email is required",
            // validating email on client side with regex pattern
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Not a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors?.email?.message}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value:
                /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
              message:
                "Password should be at least 1 small-case letter, 1 Capital letter, 1 digit, 1 special character and the length should be between 6-10 characters.",
            },
          })}
          error={!!errors.password}
          helperText={errors?.password?.message}
        />

        <LoadingButton
          loading={isSubmitting}
          disabled={!isValid}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/login">{"Already have an account? Signin"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Register;
