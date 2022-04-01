import { List } from "@mui/material";

import { Product } from "../../app/models/product";

import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

const ProductList: React.FC<Props> = ({ products }) => {
  return (
    <List>
      {products.map(product => (
        <ProductCard product={product} key={product.id} />
      ))}
    </List>
  );
};

export default ProductList;
