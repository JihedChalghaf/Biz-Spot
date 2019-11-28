import { Category } from "./category";
import { User } from "./user";
import { Review } from "./review";

export interface Business {
  id?: string;
  title?: string;
  type?: string;
  thumbnail?: string;
  location?: string;
  phone?: number;
  email?: string;
  members?: number;
  images?: string[];
  rating?: number;
  owner?: string;
  tags?: string[];
  description?: string;
  reviews?: string[];
  status?: string;
  level?: string;
  category?: Category;
}
