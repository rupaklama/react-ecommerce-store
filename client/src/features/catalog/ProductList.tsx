import { Grid } from "@mui/material";

import { Product } from "../../app/models/product";
import { useAppSelector } from "../../app/store/configureStore";

import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
  products: Product[];
}

const ProductList: React.FC<Props> = ({ products }) => {
  const { productsLoaded } = useAppSelector(state => state.catalog);

  return (
    <Grid container spacing={4}>
      {products.map(product => (
        <Grid item xs={12} md={3} key={product.id}>
          {!productsLoaded ? <ProductCardSkeleton /> : <ProductCard product={product} />}
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
