import { useState, useEffect } from "react";

import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // fetch("http://localhost:5162/api/Products")
    //   .then(response => response.json())
    //   .then(data => setProducts(data));

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5162/api/Products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default Catalog;
