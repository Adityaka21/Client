import {DataGrid} from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import { useState } from 'react';
import { serverEndpoint } from '../../config';
import axios from 'axios';

    function LinkDashboard() {
        const [error, setErrors] = useState({});
        const [linksData, setLinksData] = useState([]);

        const fetchLinks = async () => {
            try {
                const response = await axios.get(`${serverEndpoint}/links`, {
                    withCredentials: true,
                });
                setLinksData(response.data.data);
            } catch(error) {
                  console.log(error);
                  setErrors({message: "Unable to fetch links at the moment, please try again later."});

                }
            
        };

        useEffect(() => {
            fetchLinks();
        }, []);


                
        const columns = [
            { field: 'compaignTitle', headerName: 'Compaign' , flex: 2 },
            { field: 'orginalUrl. title', headerName: 'URL', flex: 3 },
            { field: 'category', headerName: 'Category', flex: 2 },
            { field: 'clickcount', headerName: 'Clicks', flex: 1 },
            { field: 'actions', headerName: 'Action', flex: 1, renderCell: (params) => (
                <>
                    <IconButton>
                        <EditIcon/>
                    </IconButton>
                    <IconButton>
                        <DeleteIcon/>
                    </IconButton>
                </>
            )},
        ];
    return(
        <div className="container py-4">
         <h2>Manage Affiliate Links</h2>   

         <div style={{ height: 500, width: '100%' }}>
            <DataGrid 
                getRowId={(row) => row._id}
                rows={linksData}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 20 },
                    },
                }}   
                pageSizeOptions={[20, 50, 100]}
                disableRowSelectionOnClick
            />
         </div>
        </div>
    )
}

export default LinkDashboard;