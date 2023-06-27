import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
// import localStorageUtility from "../utilities/localStorageUtility";
import AppSettings from "./app.config";
// import { isValid, parse, parseJSON } from "date-fns";

// function dateParseChallenge(key: string, val: any) {
//   if (val === undefined) {
//     return val;
//   }
//   if (typeof val === "string" && val) {
//     try {
//       const date = parse(val, "yyyy-MM-dd'T'HH:mm:ssxxx", new Date());
//       if (isValid(date)) {
//         return date;
//       }
//       const dateDetail = parseJSON(val);
//       if (isValid(dateDetail)) {
//         return dateDetail;
//       }
//     } catch (error) {
//       /* Ignore */
//     }
//   }
//   return val;
// }

const options: AxiosRequestConfig = {
  baseURL: AppSettings.WebApiEndpoint,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  // transformRequest: (data: any, headers?: any) => {
  //   return JSON.stringify(data, (key: string, value: any) => {
  //     if (data && data[key] && data[key] instanceof Date) {
  //       return format(data[key], "yyyy-MM-dd HH:mm:ss xxx");
  //     }
  //     return value;
  //   });
  // },
  transformResponse: (data: any, headers?: any) => {
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.log(error);
      }
    }
    return data;
  }
};
const securedOptions: AxiosRequestConfig = Object.assign(options, {
  xsrfHeaderName: AppSettings.XSRF_HEADER_NAME,
  xsrfCookieName: AppSettings.XSRF_COOKIE_NAME,
  withCredentials: true,
} as AxiosRequestConfig);

const axiosResponse = <DataType>(response: AxiosResponse<DataType>): AxiosResponse<DataType> => {
  // if (response.data) {
  //   const data = response.data;
  //   response.data = (data);
  // }
  return response;
};

const plainInstance = axios.create(options);

const securedInstance = axios.create(securedOptions);

plainInstance.interceptors.response.use(response => {
  return axiosResponse(response);
});

securedInstance.interceptors.request.use(config => {
  // config.headers = Object.assign(config.headers, {
  //   "Authorization": "Bearer " + localStorageUtility.getAccessToken(),
  // });
  return config;
});

securedInstance.interceptors.response.use(
  response => {
    return axiosResponse(response);
  },
  error => {
    return Promise.reject(error)
    // if (error.response && error.response.config && error.response.status === 401) {
    //   return plainInstance.post("/Auth/RefreshToken", {}, {
    //       headers: {
    //         "Authorization": "Bearer " + localStorageUtility.getAccessToken(),
    //       }
    //     })
    //     .then(response => {
    //       const data = response.data as ResponseModel<RefreshTokenResponsePayload>;
    //       if(data.payload) {
    //         localStorageUtility.setAccessToken(data.payload.token);
    //       }
    //       const retryConfig = error.response.config;
    //       retryConfig.headers[AppSettings.AUTHORIZATION_HEADER_NAME] = "Bearer " + localStorageUtility.getAccessToken();
    //       return plainInstance.request(retryConfig);
    //     }).catch(error => {
    //       // console.log("failed refresh access_token");
    //       localStorageUtility.setAccessToken("");
    //       // alert("エラーが発生したため、トップページに戻ります。");
    //       return Promise.reject(error)
    //     })
    // } else {
    //   return Promise.reject(error)
    // }
  }
)

const AxiosConfig = {
  plainInstance: plainInstance,
  securedInstance: securedInstance,
};

export default AxiosConfig;
