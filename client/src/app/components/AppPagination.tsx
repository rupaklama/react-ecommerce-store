import { Box, Typography, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination";

interface Props {
  metaData: MetaData;
  onPageChange: (page: number) => void;
}

const AppPagination: React.FC<Props> = ({ metaData, onPageChange }) => {
  const { currentPage, totalCount, totalPages, pageSize } = metaData;

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography>
        {/* Displaying 1-6 of 18 items */}
        Displaying {(currentPage - 1) * pageSize + 1}-
        {currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize} of {totalCount} items
      </Typography>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => {
          // console.log("page number", page);
          onPageChange(page);
        }}
        color="secondary"
        size="large"
      />
    </Box>
  );
};

export default AppPagination;
