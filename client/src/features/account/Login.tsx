import Avatar from "@mui/material/Avatar";

import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";

import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    reset,
  } = useForm({
    // mode to validate the input
    mode: "onTouched",
  });

  // FieldValues is what we get back from react-hook-form - form data
  const submitForm = async (data: any) => {
    try {
      await agent.Account.login(data);
    } catch (err) {
      console.log(err);
    }

    // clear input fields on submit
    reset();
  };

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
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
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
          label="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
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
          Sign In
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/register">{"Don't have an account? Sign Up"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
