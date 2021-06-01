export type AccountType = {
  id: string;
  full: string;
  first?: string;
  middle?: string;
  last?: string;
  address?: string;
  phone?: string | string[];
  email: string;
  meta: {
    createdDate: any;
    data: string;
  };
  query: any;
  queryAccountBalance: number;
  queryResponse: any;
};
