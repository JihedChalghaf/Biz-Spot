import { User } from "./user";

export interface Review {
  id?: string;
  comment: string;
  rating: number;
  owner: string;
}
