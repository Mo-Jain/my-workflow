export type File = {
    id: number;
    name: string;
    type: string;
    size: string;
    modified: string;
    isFavorite: boolean;
  };
  
  export type SortConfig = {
    key: string;
    direction: 'asc' | 'desc';
  };
  