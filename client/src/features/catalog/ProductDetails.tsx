import React, { useEffect, useState } from "react";
import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

import NotFound from "../../app/errors/NotFound";
import Loader from "../../app/layout/Loader";

import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

const ProductDetails = () => {
  const { basket, status } = useAppSelector(state => state.basket);
  const { status: productStatus } = useAppSelector(state => state.catalog);

  const dispatch = useAppDispatch();

  const { id } = useParams<{ id: string }>();

  // Product will be fetched once and store in our app
  const product = useAppSelector(state => productSelectors.selectById(state, id!));

  const [quantity, setQuantity] = useState(0);

  const item = basket?.items.find(i => i.productId === product?.id);

  useEffect(() => {
    // axios
    //   .get(`http://localhost:5162/api/Products/${id}`)
    //   .then(res => setProduct(res.data))
    //   .catch(err => console.log(err))
    //   .finally(() => setLoading(false));

    if (item) setQuantity(item.quantity);

    if (!product) dispatch(fetchProductAsync(parseInt(id!)));
  }, [dispatch, id, item, product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) >= 0) {
      setQuantity(parseInt(e.target.value));
    }
  };

  const handleUpdateCart = () => {
    // if no item or local state Qty is greater than in the app state, we are adding item or more quantity
    if (!item || quantity > item.quantity) {
      // quantity - local state qty
      const addQty = item ? quantity - item.quantity : quantity; // or add new item qty
      dispatch(addBasketItemAsync({ productId: product?.id!, quantity: addQty }));
    } else {
      // if we do have an item & local qty is less than app state qty
      const minusQty = item ? item.quantity - quantity : quantity;
      dispatch(removeBasketItemAsync({ productId: product?.id!, quantity: minusQty }));
    }
  };

  if (productStatus.includes("pending")) return <Loader message="loading product..." />;

  if (!product) return <NotFound />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img src={product.pictureUrl} alt={product.name} style={{ width: "100%" }} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="h4" color="secondary">
          {`${(product.price / 100).toFixed(2)}`}
        </Typography>

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <LoadingButton
              disabled={item?.quantity === quantity || (!item && quantity === 0)}
              loading={status.includes("pending")}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
