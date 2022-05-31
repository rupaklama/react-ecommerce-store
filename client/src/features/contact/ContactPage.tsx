import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

const ContactPage = () => {
  const dispatch = useAppDispatch();

  const { data, title } = useAppSelector(state => state.counter);

  return (
    <>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">The data is: {data}</Typography>
      <ButtonGroup>
        <Button variant="contained" color="error" onClick={() => dispatch(decrement(1))}>
          Decrement
        </Button>
        <Button variant="contained" color="primary" onClick={() => dispatch(increment(1))}>
          Increment
        </Button>
      </ButtonGroup>
    </>
  );
};

export default ContactPage;
