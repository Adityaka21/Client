import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { serverEndpoint } from '../../config/config';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { usePermission } from '../../rbac/permission';

function LinkDashboard() {
  const [error, setError] = useState({});
  const permission = usePermission();
  const [linksData, setLinksData] = useState([]);
  const [formdata, setformdata] = useState({
    compaignTitle: '',
    orginalUrl: '',
    category: ''
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setformdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalShow = (editMode, data = {}) => {
    if (editMode) {
      setformdata({
        id: data._id,
        compaignTitle: data.compaignTitle,
        orginalUrl: data.orginalUrl,
        category: data.category
      });
    } else {
      setformdata({ compaignTitle: '', orginalUrl: '', category: '' });
    }
    setIsEdit(editMode);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setError({});
    setFormLoading(false);
  };

  const handleDeleteModalshow = (linkId) => {
    setformdata((prev) => ({ ...prev, id: linkId }));
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setDeleteLoading(false);
  };

  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${serverEndpoint}/links/${formdata.id}`, {
        withCredentials: true
      });
      setformdata({ compaignTitle: '', orginalUrl: '', category: '' });
      fetchLinks();
    } catch (error) {
      setError({ message: 'Something went wrong, please try again' });
    } finally {
      handleDeleteModalClose();
    }
  };

  const validate = () => {
    const newError = {};
    let isValid = true;
    if (!formdata.compaignTitle?.trim()) {
      newError.compaignTitle = 'Compaign is required';
      isValid = false;
    }
    if (!formdata.orginalUrl?.trim()) {
      newError.orginalUrl = 'Original URL is required';
      isValid = false;
    }
    if (!formdata.category?.trim()) {
      newError.category = 'Category is required';
      isValid = false;
    }
    setError(newError);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      setFormLoading(true);
      const body = {
        compaignTitle: formdata.compaignTitle,
        orginalUrl: formdata.orginalUrl,
        category: formdata.category
      };

      try {
        if (isEdit) {
          await axios.put(`${serverEndpoint}/links/${formdata.id}`, body, {
            withCredentials: true
          });
        } else {
          await axios.post(`${serverEndpoint}/links`, body, {
            withCredentials: true
          });
        }
        setformdata({ compaignTitle: '', orginalUrl: '', category: '' });
        await fetchLinks();
      } catch (error) {
        if(error.response?.data?.code === 'ISUFFICIENT_FUNDS'){
          setError({message: `You do not have enough credits yo perform this action. 
            Add funds to your account  using Manage Payment option`});
        }
        setError({ message: 'Something went wrong, please try again later.' });
      } finally {
        setFormLoading(false);
        handleModalClose();
      }
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links`, {
        withCredentials: true
      });
      setLinksData(response.data.data);
    } catch (error) {
      console.log(error);
      setError({
        message: 'Unable to fetch links at the moment, please try again later.'
      });
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const columns = [
    { field: 'compaignTitle', headerName: 'Compaign', flex: 2 },
    {
      field: 'orginalUrl',
      headerName: 'URL',
      flex: 3,
      renderCell: (params) => (
        <a
          href={`${serverEndpoint}/links/r/${params.row._id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.row.orginalUrl}
        </a>
      )
    },
    { field: 'category', headerName: 'Category', flex: 2 },
    { field: 'clickcount', headerName: 'Clicks', flex: 1 },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <>
          {permission.canEditLink && (
            <IconButton>
            <EditIcon onClick={() => handleModalShow(true, params.row)}/>
          </IconButton>
          )}
           {permission.canDeleteLink && (
          <IconButton >
            <DeleteIcon onClick={() => handleDeleteModalshow(params.row._id)}/>
          </IconButton>
           )}
        </>
      )
    }
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Manage Affiliate Links</h2>
         {permission.canCreateLink && (
        <button className="btn btn-primary btn-sm" onClick={() => handleModalShow(false)}>
          Add
        </button>
         )}
      </div>

      {error.message && <div className="alert alert-danger">{error.message}</div>}

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={linksData}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 20 } }
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Link' : 'Add Link'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {['compaignTitle', 'orginalUrl', 'category'].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label text-capitalize">{field.replace('orginalUrl', 'URL')}</label>
                <input
                  type="text"
                  name={field}
                  value={formdata[field]}
                  onChange={handleChange}
                  className={`form-control ${error[field] ? 'is-invalid' : ''}`}
                  disabled={formLoading}
                />
                {error[field] && <div className="invalid-feedback">{error[field]}</div>}
              </div>
            ))}

            <button className="btn btn-primary w-100" type="submit" disabled={formLoading}>
              {formLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  {isEdit ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this link?</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleDeleteModalClose} disabled={deleteLoading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDeleteSubmit} disabled={deleteLoading}>
            {deleteLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LinkDashboard;
