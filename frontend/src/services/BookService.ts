import create from "./AppService";

export interface Book {
  id: number;
  title: string;
  authorName: string;
  categoryName: string; // Use this for display (read-only)
  imageUrl: string;
  price: number;
  description: string;
}

export interface BookData {
  title: string;
  categoryId: number;
  price: number;
  description: string;
}

export default  create('/books')