import * as axios from "axios";
import { API_ELEMENT_BASE, AUTH_CREDENTIAL } from "../../config";

const headers = {
  "Content-type": "application/json; charset=UTF-8"
};

export const getElementList = async data => {
  const result = axios({
    method: "POST",
    url: `${API_ELEMENT_BASE}/designer/list`,
    crossdomain: true,
    data: {
      ...data,
      auth: AUTH_CREDENTIAL
    },
    headers: headers
  });

  return result;
};
