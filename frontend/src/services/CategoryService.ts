import create from "./AppService";
export interface Category {
  id: number;
  createdOn: string;        // e.g. "2025-07-19"
  lastUpdatedOn: string;    // e.g. "2025-07-19T23:33:02.47329"
  name: string;             // e.g. "Fiction"
}


export default create('/categories/')