import apiClient from "./api-client";


class AppService {
  endPoint: string;
  constructor(endPoint: string) {
    this.endPoint = endPoint;
  }

  get<T>(id: string, customEndPoint: string = "") {
    const url = this.endPoint + customEndPoint + "/" + id;
    return apiClient.get<T>(url);
  }
  getAll<T>(customEndPoint: string = "") {
    const url = this.endPoint + customEndPoint;
    return apiClient.get<T[]>(url);
  }

  delete(id: string, customEndPoint: string = "") {
    const url = this.endPoint + customEndPoint + "/" + id;
    return apiClient.delete(url);
  }

  create<T>(data: T, customEndPoint: string = "") {
    const url = this.endPoint + customEndPoint;
    return apiClient.post(url, data);
  }

  update<T>(data: T, id:string, customEndPoint: string = "") {
    const url = this.endPoint + customEndPoint + "/"+id;
    return apiClient.put(url, data);
  }
}

const create = (endPoint: string) => new AppService(endPoint);
export default create;
