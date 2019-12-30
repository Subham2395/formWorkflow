import * as axios from "axios";
import { API_WORKFLOW_BASE, AUTH_CREDENTIAL } from "../../config";

const headers = {
  "Content-type": "application/json; charset=UTF-8"
};

export const getWorkflows = async () => {
  const result = axios({
    method: "POST",
    url: `${API_WORKFLOW_BASE}/designer/read`,
    crossdomain: true,
    data: {
      auth: AUTH_CREDENTIAL
    },
    headers: headers
  });

  return result;
};

export const getWorkflowDetails = async (data = {}) => {
  const result = axios({
    method: "POST",
    url: `${API_WORKFLOW_BASE}/designer/open`,
    crossdomain: true,
    data: {
      ...data,
      auth: AUTH_CREDENTIAL
    },
    headers: headers
  });

  return result;
};

export const updateWorkflow = async (data = {}) => {
  const result = axios({
    method: "POST",
    url: `${API_WORKFLOW_BASE}/designer/update`,
    crossdomain: true,
    data: {
      ...data,
      auth: AUTH_CREDENTIAL
    },
    headers: headers
  });

  return result;
};
