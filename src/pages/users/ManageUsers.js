import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { serverEndpoint } from '../../config/config';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import Spinner from '../../components/Spinner'; // Update path as per your folder structure

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModalShow = (editMode, user = {}) => {
    if (editMode) {
      setFormData({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: ''
      });
    }
    setIsEdit(editMode);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setError({});
  };

  const handleDeleteModalShow = (id) => {
    setFormData((prev) => ({
      ...prev,
      id
    }));
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const validate = () => {
    const newError = {};
    let isValid = true;
    if (!formData.name.trim()) {
      newError.name = 'Name is required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newError.email = 'Email is required';
      isValid = false;
    }
    if (!formData.role.trim()) {
      newError.role = 'Role is required';
      isValid = false;
    }
    setError(newError);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setFormLoading(true);
      const body = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };
      try {
        if (isEdit) {
          await axios.put(`${serverEndpoint}/users/${formData.id}`, body, {
            withCredentials: true
          });
        } else {
          await axios.post(`${serverEndpoint}/users`, body, {
            withCredentials: true
          });
        }
        fetchUsers();
      } catch (err) {
        setError({ message: 'Something went wrong, please try again' });
      } finally {
        setFormLoading(false);
        handleModalClose();
      }
    }
  };

  const handleDeleteSubmit = async () => {
    setFormLoading(true);
    try {
      await axios.delete(`${serverEndpoint}/users/${formData.id}`, {
        withCredentials: true
      });
      fetchUsers();
    } catch (err) {
      setError({ message: 'Failed to delete user' });
    } finally {
      setFormLoading(false);
      handleDeleteModalClose();
    }
  };

  const fetchUsers = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(`${serverEndpoint}/users`, {
        withCredentials: true
      });
      setUsers(res.data);
    } catch (err) {
      setError({ message: 'Failed to fetch users' });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { field: 'name', headerName: 'Name', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 3 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleModalShow(true, params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteModalShow(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>User Management</h2>
        <button className="btn btn-primary btn-sm" onClick={() => handleModalShow(false)}>
          Add User
        </button>
      </div>

      {error.message && <div className="alert alert-danger">{error.message}</div>}

      <div style={{ minHeight: 500, width: '100%' }}>
        {tableLoading ? (
          <Spinner height="300px" />
        ) : (
          <DataGrid
            getRowId={(row) => row._id}
            rows={users}
            columns={columns}
            pageSizeOptions={[10, 20, 50]}
            disableRowSelectionOnClick
            sx={{ fontFamily: 'inherit' }}
          />
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {['name', 'email', 'role'].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label text-capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`form-control ${error[field] ? 'is-invalid' : ''}`}
                />
                {error[field] && <div className="invalid-feedback">{error[field]}</div>}
              </div>
            ))}
            <button className="btn btn-primary w-100" type="submit" disabled={formLoading}>
              {formLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleDeleteModalClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDeleteSubmit} disabled={formLoading}>
            {formLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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

export default ManageUsers;
