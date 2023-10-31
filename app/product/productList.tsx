'use client';
import React, {useState} from 'react';
import { Box, Input, List, ListItem, ListItemText, ListItemButton, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Fab, IconButton } from "@mui/material";

import { Close as CloseIcon, Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';

import useProducts from "./useProducts";

export default function ProductList() {
  
  
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  // const [products, setProducts] = useState([
  //   { desc: "iPad", price: 20000 },
  //   { desc: "iPhone 8", price: 20000 },
  //   { desc: "iPhone X", price: 30000 }
  // ]);
  const [products, setProducts, addProduct] = useProducts();

  const [newProduct, setNewProduct] = useState({visible: false, desc:"", price:0, edit: 0})
  const [editProductDialogVisible, setEditProductDialogVisible] = useState(false);


  const handleClick = function (e: React.ChangeEvent<HTMLInputElement>) {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value })
  }
  const show = () => {
    setNewProduct({ ...newProduct, visible: true })
  }

  const hide = () => {
    setNewProduct({ ...newProduct, visible: false })
  }

  function add() {
    addProduct(newProduct);
  
    setProducts(() => [...products, newProduct]);
    setNewProduct({...newProduct, visible: false});
    console.log(products);
  }
  function deleteProduct(index: number) {
    products.splice(index, 1);
    setProducts(products);
  }
  function editProduct(index: number) {
    const edit = products[index];
    console.log("test" + edit);
    
    setNewProduct({
      visible: true,
      desc: edit.desc,
      price: edit.price,
      edit: 1
    });
    products.splice(index, 1);
  }
  

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{ 
      width: '80vw',
      height: '100vh',
      backgroundColor: 'background.paper',
      color: 'black',
      textAlign: 'left'
    }}>
      
      {newProduct.visible ?
        <Dialog open={newProduct.visible} onClose={hide} aria-labelledby="產品">
          <DialogTitle>{newProduct.edit === 1 ? "編輯產品" : "新增產品"}</DialogTitle>
          <DialogContent>
            <TextField label="產品描述" variant="outlined" name="desc" value={newProduct.desc} onChange={handleClick} /><p />
            <TextField label="產品價格" variant="outlined" name="price" value={newProduct.price} onChange={handleClick} /><p />
          </DialogContent>
          <DialogActions>
            <IconButton
              aria-label="close"
              onClick={hide}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Button 
              variant="contained"
              color="primary"
              // onClick={ newProduct.edit === 1 ? ()=> editProduct(selectedIndex) : add} 
              onClick={add} 
            >
              { newProduct.edit === 1 ? "修改" : "新增"} 
            </Button>
          </DialogActions>
        </Dialog>
        :
        <div>
          <Fab
            size="small"
            color="primary"
            aria-label="add"
            onClick={show}
          >
            <AddIcon />
          </Fab>
          
          <List subheader="Product list" aria-label="product list">
            {products.map((product, index) => (
                <ListItemButton 
                    divider 
                    key={product.desc} 
                    selected={selectedIndex === index} 
                    onClick={(event) => handleListItemClick(event, index)}>
                    <ListItemText primary={product.desc} secondary={product.price}/>
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => deleteProduct(index)} 
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      aria-label="edit"
                      onClick={() => editProduct(index)} 
                    >
                      <EditIcon />
                    </IconButton> 
                </ListItemButton>
            ))}
          </List>
      </div>
      }
    </Box>
  );
}
