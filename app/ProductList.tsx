
'use client'
import React, { useState } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';

export default function ProductList() {
  const [products, setProducts] = useState([
    { desc: "iPad", price: 20000 },
    { desc: "iPhone 8", price: 20000 },
    { desc: "iPhone X", price: 30000 },
  ]);

  const [newProduct, setNewProduct] = useState({ visible: false, desc: "", price: 0 });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ desc: "", price: 0 });
  const [editProductIndex, setEditProductIndex] = useState(-1);

  const handleClick = function (e: { target: { name: any; value: any; }; }) {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const show = () => {
    setNewProduct({ ...newProduct, visible: true });
  };

  const update = () => {
    setProducts([...products, newProduct]);
    setNewProduct({ ...newProduct, visible: false });
    console.log(products);
  };

  const hide = () => {
    setNewProduct({ ...newProduct, visible: false });
  };

  const deleteProduct = (product_index: number) => {
    const updatedProducts = [...products];
    updatedProducts.splice(product_index, 1);
    setProducts(updatedProducts);
  };

  const openEditDialog = (product_index: number) => {
    setEditDialogOpen(true);
    setEditProductIndex(product_index);
    setEditedProduct(products[product_index]);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditProductIndex(-1);
    setEditedProduct({ desc: "", price: 0 });
  };

  const saveEditedProduct = () => {
    if (editProductIndex !== -1) {
      const updatedProducts = [...products];
      updatedProducts[editProductIndex] = editedProduct;
      setProducts(updatedProducts);
      closeEditDialog();
    }
  };

  return (
    <Box
      sx={{
        width: "80vw",
        height: "100vh",
        backgroundColor: "background.paper",
        color: "black",
        textAlign: "left",
      }}
    >
      <Dialog open={newProduct.visible} onClose={hide} aria-labelledby="新增產品">
        <DialogTitle>新增產品</DialogTitle>
        <DialogContent>
          <TextField label="產品描述" variant="outlined" name="desc" value={newProduct.desc} onChange={handleClick} /><p />
          <TextField label="產品價格" variant="outlined" name="price" value={newProduct.price} onChange={handleClick} /><p />
        </DialogContent>
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={hide}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Button variant="contained" color="primary" onClick={update}>
            新增
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={closeEditDialog} aria-labelledby="修改產品">
        <DialogTitle>修改產品</DialogTitle>
        <DialogContent>
          <TextField label="產品描述" variant="outlined" name="desc" value={editedProduct.desc} onChange={(e) => setEditedProduct({ ...editedProduct, desc: e.target.value })} /><p />
          <TextField label="產品價格" variant="outlined" name="price" value={editedProduct.price} onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value)})} /><p />
        </DialogContent>
        <DialogActions>
          <IconButton
            aria-label="close"
            onClick={closeEditDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Button variant="contained" color="primary" onClick={saveEditedProduct}>
            儲存
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <button onClick={show}>新增產品</button>
        <List subheader="Product list" aria-label="product list">
          {products.map((product, index) => (
            <ListItem divider key={product.desc}>
              <ListItemText primary={product.desc} secondary={product.price} />
              <IconButton edge="end" aria-label="edit" onClick={() => openEditDialog(index)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteProduct(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Box>
  );
}
