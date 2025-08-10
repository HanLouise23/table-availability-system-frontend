export type Restaurant = {
  id: number;
  name: string;
  address: {
    line_1: string;
    city: string;
    postcode: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  tables: {
    table_id: number;
    seats: number;
    booked_by: string | null;
    phone_number: string | null;
  }[];
  mainImageUrl: string;
  imageUrls: string[];
  rating: number;
};
