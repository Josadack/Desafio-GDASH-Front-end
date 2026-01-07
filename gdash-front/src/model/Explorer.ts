export interface ExplorerItem {
  id: number;
  name: string;
  image?: string;
  description?: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}
