'use client';
import { AppBar, Box, Button, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import ProductList from './ProductList';




// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: number;
//     value: number;
// }

// function CustomTabPanel(props: TabPanelProps) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && (
//                 <Box sx={{ p: 3 }}>
//                     <Typography>{children}</Typography>
//                 </Box>
//             )}
//         </div>
//     );
// }

// function a11yProps(index: number) {
//     return {
//         id: `simple-tab-${index}`,
//         'aria-controls': `simple-tabpanel-${index}`,
//     };
// }

// export default function Menu() {
//     const [value, setValue] = React.useState(0);

//     const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//         setValue(newValue);
//     };

//     return (
//         <Box sx={{ width: '100%' }}>
//             <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                 <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
//                     <Tab label="主頁面" {...a11yProps(0)} />
//                     <Tab label="產品管理" {...a11yProps(1)} />
//                     <Tab label="Item Three" {...a11yProps(2)} />
//                 </Tabs>
//             </Box>
//             <CustomTabPanel value={value} index={0}>
//                 主頁面
//             </CustomTabPanel>
//             <CustomTabPanel value={value} index={1}>
//                 <ProductList />
//             </CustomTabPanel>
//             <CustomTabPanel value={value} index={2}>
//                 Item Three
//             </CustomTabPanel>
//         </Box>
//     );
// }





export default function Menu() {
    const router = useRouter()
    const pathname = usePathname()

    return (

        <AppBar position="static">
            <Toolbar>
                <Button color="inherit" variant={pathname === "/page" ? "outlined" : "text"} onClick={() => router.push("/page")}>主頁面</Button>
                <Button color="inherit" variant={pathname === "/product" ? "outlined" : "text"} onClick={() => router.push("/product")}>產品管理</Button>
            </Toolbar>
        </AppBar>
    );
}