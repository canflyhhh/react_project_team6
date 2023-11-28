
// export type Post = {
//   id: string;
//   account: string,
//   context: string,
//   datetime: Date,
//   tag: string,
//   title: string,
//   visible?: boolean
// };

export type Post = {
  id: string;
  account: string,
  context: string,
  datetime: Date,
  tag: string[],
  title: string,
  visible?: boolean
};

