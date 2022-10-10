import { MetaData } from "./../../app/models/pagination";
import { ProductParams } from "./../../app/models/product";
import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

/**
 Redux Toolkit's createEntityAdapter API provides a standardized way to store your data 
 in a slice by taking a collection and putting it into the shape of { ids: [], entities: {} }. 
 Along with this predefined state shape, it generates a set of Reducer functions and 
 Selectors that know how to work with the data. 
 */

// note - storing Product data in a slice to optimize rendering & standard way of storing data
const productsAdapter = createEntityAdapter<Product>();

interface CatalogState {
  productsLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  productParams: ProductParams;
  metaData: MetaData | null;
}

// To add query params in our async api calls
function getAxiosParams(productParams: ProductParams) {
  const params = new URLSearchParams();

  // key/value pair - adding params
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  params.append("orderBy", productParams.orderBy.toString());

  // optional queries
  if (productParams.searchTerm) params.append("searchTerm", productParams.searchTerm);

  // don't append this unless there is a query for brands & types
  if (productParams.brands?.length > 0) params.append("brands", productParams.brands.toString());
  if (productParams.types?.length > 0) params.append("types", productParams.types.toString());

  return params;
}

// async thunk to get list of products
export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
  "catalog/fetchProductsAsync",
  // note - thunkAPI is available from createAsyncThunk to handle errors
  async (_, thunkAPI) => {
    // getState() is to get access state for params values
    // NOTE - Params CANNOT be send as on Object in agent.list(), we need to make it type of URLSearchParams
    // Passing our Saved Params in the store state on the api call
    const params = getAxiosParams(thunkAPI.getState().catalog.productParams);

    try {
      const response = await agent.Catalog.list(params);
      // setting paginated data in our store
      thunkAPI.dispatch(setMetaData(response.metaData));

      // setting paginated data in our store & returning data items at the same time
      return response.items;
    } catch (error: any) {
      // this function will be rejected on error
      return thunkAPI.rejectWithValue({
        error: error.data,
      });
    }
  }
);

// single product
export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (productId, thunkAPI) => {
    try {
      return await agent.Catalog.details(productId);
    } catch (error: any) {
      // note - on error, reducer function will be Rejected rather than Fulfilled
      return thunkAPI.rejectWithValue({
        error: error.data,
      });
    }
  }
);

// filter api
export const fetchFilters = createAsyncThunk("catalog/fetchFilters", async (_, thunkAPI) => {
  try {
    return agent.Catalog.fetchFilters();
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

// helper function
// initial params values
function initParams() {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: "name",

    brands: [],
    types: [],
  };
}

// Catalog slice to store Product data
export const catalogSlice = createSlice({
  name: "catalog",
  // note - inside of productsAdapter, we get a method to create our initial state
  initialState: productsAdapter.getInitialState<CatalogState>({
    // getInitialState returns initial state for our Product
    productsLoaded: false,
    filtersLoaded: false,
    status: "idle",

    brands: [],
    types: [],
    productParams: initParams(),

    // to store pagination data
    metaData: null,
  }),
  reducers: {
    setProductParams: (state, action) => {
      // console.log(action);
      state.productsLoaded = false;

      // action.payload is an additional query param object
      // note - set pageNumber to 1 whenever on setting params to avoid bugs
      state.productParams = { ...state.productParams, ...action.payload, pageNumber: 1 };
    },

    // to change page number
    setPageNumber: (state, action) => {
      state.productsLoaded = false;
      state.productParams = { ...state.productParams, ...action.payload };
    },

    resetProductParams: state => {
      state.productParams = initParams();
    },

    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
  },

  // since we have async thunk api call above - fetchProductsAsync
  extraReducers: builder => {
    // products
    builder.addCase(fetchProductsAsync.pending, state => {
      state.status = "pendingFetchProducts";
    });

    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      // using productsAdapter methods to work with our Product Array
      // setAll is to set all of the Products when we received from our api
      // note - first arg - state, second arg entities - list of products
      productsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });

    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });

    // product
    builder.addCase(fetchProductAsync.pending, state => {
      state.status = "pendingFetchProduct";
    });

    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      // upsertOne is to upsert(update or add) a new product into our products list
      productsAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });

    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      console.log(action);
      state.status = "idle";
    });

    builder.addCase(fetchFilters.pending, state => {
      state.status = "pendingFetchFilters";
    });

    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.brands = action.payload.brands;
      state.types = action.payload.types;
      state.status = "idle";
      state.filtersLoaded = true;
    });

    builder.addCase(fetchFilters.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
  },
});

// Note - entity adapter provides a selector factory that generates
// the most common Selectors for our store data in Catalog Slice
export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);
// now we can use productSelectors to get data from our store

export const { setProductParams, resetProductParams, setMetaData, setPageNumber } = catalogSlice.actions;
