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

import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import Loader from "../../app/layout/Loader";

import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { removeItem, setBasket } from "../basket/basketSlice";

const ProductDetails = () => {
  const { basket } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();

  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  console.log(basket);
  const item = basket?.items.find(i => i.productId === product?.id);

  useEffect(() => {
    // axios
    //   .get(`http://localhost:5162/api/Products/${id}`)
    //   .then(res => setProduct(res.data))
    //   .catch(err => console.log(err))
    //   .finally(() => setLoading(false));

    if (item) setQuantity(item.quantity);

    agent.Catalog.details(parseInt(id))
      .then(res => setProduct(res))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [id, item]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) >= 0) {
      setQuantity(parseInt(e.target.value));
    }
  };

  const handleUpdateCart = () => {
    setSubmitting(true);

    // if no item or local state Qty is greater than in the app state
    if (!item || quantity > item.quantity) {
      // quantity - local state qty
      const addQty = item ? quantity - item.quantity : quantity;
      agent.Basket.addItem(product?.id!, addQty)
        .then(basket => dispatch(setBasket(basket)))
        .catch(err => console.error(err))
        .finally(() => setSubmitting(false));
    } else {
      // if we do have an item & local qty is less than app state qty
      const minusQty = item ? item.quantity - quantity : quantity;
      agent.Basket.removeItem(product?.id!, minusQty)
        .then(() => dispatch(removeItem({ productId: product?.id!, quantity: minusQty })))
        .catch(err => console.error(err))
        .finally(() => setSubmitting(false));
    }
  };

  if (loading) return <Loader message="loading product..." />;

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
              loading={submitting}
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
