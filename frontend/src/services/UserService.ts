import create from "./AppService";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phoneNo: string;
}

//export type UserRole = "ROLE_AUTHOR" | "ROLE_READER";

export default create('/users/');