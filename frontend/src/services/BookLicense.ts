import create from "./AppService";

export interface BookLicense {
  id: number;
  title: string;
  authorName: string;
  categoryName: string;
  imageUrl: string;
  fileUrl: string;
}

export default create('/book-licenses/');