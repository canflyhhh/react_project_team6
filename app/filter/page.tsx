'use client'
import React from "react";
import useProducts from "./test_page";

function ProductList() {
  const [products, setProducts] = useProducts();

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <h2>{product.title}</h2>
            <p>Account: {product.account}</p>
            <p>Context: {product.context}</p>
            <p>Time: {product.time.toDate().toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
