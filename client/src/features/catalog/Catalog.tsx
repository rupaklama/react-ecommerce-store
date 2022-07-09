import { useEffect } from "react";
import Loader from "../../app/layout/Loader";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";

const Catalog = () => {
  // using productSelectors from Catalog slice
  // selectAll gives us list of products
  const products = useAppSelector(productSelectors.selectAll);

  const { productsLoaded, status } = useAppSelector(state => state.catalog);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [dispatch, productsLoaded]);

  if (status.includes("pending")) return <Loader message="loading products..." />;

  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default Catalog;
