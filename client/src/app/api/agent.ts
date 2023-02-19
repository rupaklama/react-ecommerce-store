import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";
import { router } from "../router/Routes";

/* to delay the response */
const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = "http://localhost:5162/api/";

// to allow to use the cookie in client side
axios.defaults.withCredentials = true;

// getting axios response data & storing it here
const responseBody = (response: AxiosResponse) => response.data;

/* Request Interceptor */
axios.interceptors.request.use(config => {
  // note - set user object inside Redux Store before running the code below
  // this is done in fetchCurrentUser with setUser action creator

  // using redux store directly here to access state
  const token = store.getState().account.user?.token;

  // If config.headers is null then set it to an empty object before using it
  config.headers = config.headers ?? {};

  // Sending Bearer token in the Authorization Header
  // header! - turning off typescript to specify that we know that variable will be not null
  if (token) config.headers!.Authorization = `Bearer ${token}`;

  return config;
});

/* Intercepting axios response to do something with it */
axios.interceptors.response.use(
  async response => {
    await sleep();

    // accessing response header for Pagination data
    const pagination = response.headers["pagination"];

    if (pagination) {
      // note - overriding what is inside of response.data with Paginated response
      // to set pagination data in our store & returning data items at the same time
      response.data = new PaginatedResponse(response.data, JSON.parse(pagination));

      // Paginated response
      // console.log(response);
      // this will contain both of array items & header pagination object
      return response;
    }

    // on success
    return response;
  },
  // on failure
  (error: AxiosError) => {
    // console.log("caught by interceptor");
    const { data, status } = error.response as any;
    // console.log(data);

    switch (status) {
      case 400:
        // note - Validation Errors are also 400 Bad Request
        // if data has an error object from the backend
        if (data.errors) {
          const modelStateErrors: string[] = [];

          // error object has key/value
          for (const key in data.errors) {
            if (data.errors[key]) {
              // adding error strings values in a new array
              modelStateErrors.push(data.errors[key]);
            }
          }

          // flat it to one single array & throw is to stop the execution
          // ['This is the first error', 'This is the second error']
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        // default message if nothing coming from the backend
        // toast.error(data.title || "Unauthorized");
        toast.error(data.title);
        break;

      case 500:
        router.navigate("/server-error", { state: { error: data } });

        break;

      default:
        break;
    }

    // note - need to always return Error object from the Interceptor
    // rejecting current promise to return error object
    return Promise.reject(error);
  }
);

// http requests
const requests = {
  get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responseBody),

  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Catalog = {
  list: (params: URLSearchParams) => requests.get("products", params),
  details: (id: number) => requests.get(`products/${id}`),
  fetchFilters: () => requests.get("products/filters"),
};

const Basket = {
  get: () => requests.get("basket"),
  addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) =>
    requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const Account = {
  login: (values: any) => requests.post("account/login", values),
  register: (values: any) => requests.post("account/register", values),
  // to persist auth
  currentUser: () => requests.get("account/currentUser"),
};

/* to test errors */
const TestErrors = {
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unauthorised"),
  get404Error: () => requests.get("buggy/not-found"),
  get500Error: () => requests.get("buggy/server-error"),
  getValidationError: () => requests.get("buggy/validation-error"),
};

const agent = {
  Catalog,
  Basket,
  Account,
  TestErrors,
};

export default agent;
