import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
const Datatable = ({userColumns, userRows, actionColumn, order}) => {
    const role = useSelector(state => state.userReducer.role)
  return <div className="datatable">
    <DataGrid
        rows={userRows}
        columns={(role === "admin" || role === "superadmin" || order) ? userColumns.concat(actionColumn) : userColumns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 9 },
          },
        }}
        rowHeight={100}
        pageSizeOptions={[9, 10]}
        checkboxSelection
      />
  </div>;
};

export default Datatable;
