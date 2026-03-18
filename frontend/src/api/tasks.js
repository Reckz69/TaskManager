import axios from "./axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
  });


// CREATE
export const createTask = (data) =>
    API.post("/tasks", data);
  
  // GET ALL (with filters)
  export const getTasks = (params) =>
    API.get("/tasks", { params });
  
  // GET SINGLE
  export const getTaskById = (id) =>
    API.get(`/tasks/${id}`);
  
  // UPDATE
  export const updateTask = (id, data) =>
    API.put(`/tasks/${id}`, data);
  
  // DELETE
  export const deleteTask = (id) =>
    API.delete(`/tasks/${id}`);
  
  // TOGGLE
  export const toggleTask = (id) =>
    API.patch(`/tasks/toggle/${id}`);