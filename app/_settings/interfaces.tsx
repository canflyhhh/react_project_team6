
export type Post = {
    id: string;
    account: string, 
    location: string,
    context: string, 
    datetime: Date, 
    tag: string[], 
    title: string,
    visible?: boolean
  };
  
  