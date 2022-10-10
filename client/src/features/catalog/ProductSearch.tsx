import { debounce, TextField } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";

const ProductSearch = () => {
  const { productParams } = useAppSelector(state => state.catalog);

  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

  const dispatch = useAppDispatch();

  // delay the search functionality so to wait for user to finish typing
  const debouncedSearch = debounce(e => {
    dispatch(setProductParams({ searchTerm: e.target.value }));
  }, 1500);

  return (
    <TextField
      label="Search products"
      variant="outlined"
      fullWidth
      value={searchTerm || ""}
      // only updating search term
      onChange={(e: any) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e);
      }}
    />
  );
};

export default ProductSearch;
