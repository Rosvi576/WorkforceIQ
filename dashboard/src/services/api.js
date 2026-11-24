
import axios from "axios";

const api = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000",

  timeout: 90000,

  headers: {
    "Content-Type": "application/json"
  }

});

export const checkHealth = async () => {

  const response = await api.get("/health");

  return response.data;

};

export const getWorkforceOverview = async () => {

  const response = await api.get(
    "/analytics/overview"
  );

  return response.data.data;

};

export const getDepartmentAnalytics = async () => {

  const response = await api.get(
    "/analytics/departments"
  );

  return response.data.data;

};

export const getRiskFactorAnalytics = async () => {

  const response = await api.get(
    "/analytics/risk-factors"
  );

  return response.data.data;

};

export const predictAttrition = async (
  employeeData
) => {

  const response = await api.post(
    "/predict",
    employeeData
  );

  return response.data;

};

export const getModelInsights = async () => {

  const response = await api.get(
    "/model/insights"
  );

  return response.data.data;

};

export default api;
