'use client';
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, addDoc } from "firebase/firestore";
import app from "@/app/_firebase/config"
// import Table from 'react-bootstrap/Table';

import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'account',
    headerName: 'account',
    width: 150,
    editable: true,
  },
  {
    field: 'title',
    headerName: 'title',
    width: 150,
    editable: true,
  },
  {
    field: 'tag',
    headerName: 'tag',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'context',
    headerName: 'context',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.account || ''} ${params.row.title || ''}`,
  },
];

interface PostData {
  id: string;
  account: string;
  title: string;
  tag: string;
  context: string;
  datetime: Date;
}

export default function Sort() {
  const db = getFirestore(app);
  const [rows, setRows] = useState<PostData[]>([]);

  useEffect(() => {
    async function fetchData() {z
      const querySnapshot = await getDocs(collection(db, "post"));
      const postData: PostData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        postData.push({
          id: doc.id,
          account: data.account,
          title: data.title,
          tag: data.tag,
          context: data.context,
          datetime: data.datetime.toDate(), 
        });
      });

      setRows(postData);
    }

    fetchData();
  }, [db]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'account', headerName: 'Account', width: 150, editable: true },
    { field: 'title', headerName: 'Title', width: 150, editable: true },
    { field: 'tag', headerName: 'Tag', type: 'number', width: 110, editable: true },
    { field: 'context', headerName: 'Context', description: 'context', sortable: false, width: 160 },
    { field: 'datetime', headerName: 'Datetime', width: 400, editable: true },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}