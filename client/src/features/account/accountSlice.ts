import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";

interface AccountState {
  user: User | null;
}

const initialState: AccountState = {
  user: null,
};

export const signInUser = createAsyncThunk<User, { data: any }>("account/signInUser", async (data, thunkAPI) => {
  try {
    const user = await agent.Account.login(data);
    // storing user object in local storage
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue({ error: err.data });
  }
});

export const fetchCurrentUser = createAsyncThunk<User>("account/fetchCurrentUser", async (_, thunkAPI) => {
  // dispatching action to get user object from local storage & set it in our redux state
  thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));

  try {
    const user = await agent.Account.currentUser();

    // set user object in local storage
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue({ error: err.data });
  }
});

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: state => {
      state.user = null;
      localStorage.removeItem("user");
      history.push("/");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },

  extraReducers: builder => {
    // on reject from fetchCurrentUser action when Api fails to fetch auth user
    builder.addCase(fetchCurrentUser.rejected, state => {
      // logout user
      state.user = null;
      // remove user
      localStorage.removeItem("user");

      toast.error("Session expired - please login again");
      history.push("/");
    });

    // note - pending state is handled by react-hook-form
    // addMatcher is to reduce boiler plate code or use less code for the specific operation
    builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
      state.user = action.payload;
    });
    builder.addMatcher(isAnyOf(signInUser.rejected, fetchCurrentUser.rejected), (state, action) => {
      console.log(action.payload);
    });
  },
});

export const { signOut, setUser } = accountSlice.actions;
