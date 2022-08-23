import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";

/* to delay the response */
const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = "http://localhost:5162/api/";

// to allow to use the cookie in client side
axios.defaults.withCredentials = true;

// getting axios response data & storing it here
const responseBody = (response: AxiosResponse) => response.data;

/* Intercepting axios response to do something with it */
axios.interceptors.response.use(
  async response => {
    await sleep();
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
        toast.error(data.title);
        break;

      case 500:
        history.push({
          pathname: "/server-error",
          state: { error: data },
        });
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
  TestErrors,
};

export default agent;
