import '../css/tabel.css';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserData from '../components/UserData';


const Api = "http://localhost:8080/person";

function Tabel() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchUsers = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("You must be logged in to view user data.");
            navigate('/');
            return;
        }

        try {
            const res = await fetch(Api, {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
            });

            if (res.status === 401 || res.status === 403) {
                setError("Unauthorized or token expired. Please login again.");
                localStorage.removeItem('token');
                navigate('/');
                return;
            }

            if (!res.ok) throw new Error("Failed to fetch user data");

            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setUsers(data);
                setError("");
            } else {
                setError("No user data available.");
            }
        } catch (e) {
            setError("An error occurred while fetching users.");
            console.error(e);
        }
    }, [navigate]);

    const deleteUser = async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Unauthorized request.");
            navigate('/');
            return;
        }

        try {
            const res = await fetch(`${Api}/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
            });

            if (res.status === 401 || res.status === 403) {
                setError("Session expired. Please login again.");
                localStorage.removeItem('token');
                navigate('/');
                return;
            }

            const data = await res.json();
            if (res.ok) {
                Swal.fire('Deleted!', data.message || 'User deleted.', 'success');
                fetchUsers();
            } else {
                Swal.fire('Error!', data.message || 'Failed to delete user.', 'error');
            }
        } catch (e) {
            console.error(e);
            Swal.fire('Error!', 'Failed to delete user.', 'error');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userInfo = JSON.parse(localStorage.getItem('user') || "{}");

        if (!token || !userInfo.name) {
            setError("You must be logged in to view this page.");
            navigate('/');
        } else {
            fetchUsers();
        }
    }, [fetchUsers, navigate]);


    const confirmDelete = (user) => {
        Swal.fire({
            title: `Delete ${user.name}?`,
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(user._id);
            }
        });
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out and redirected to the login page.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, logout',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                Swal.fire('Logged out!', 'You have been successfully logged out.', 'success');
                setTimeout(() => navigate('/'), 1500);
            }
        });
    };

    return (
        <>
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                {localStorage.getItem('user') && (
                    <div>
                        <img
                            src={JSON.parse(localStorage.getItem('user')).picture}
                            alt="profile"
                            width={40}
                            style={{ borderRadius: '50%', verticalAlign: 'middle', marginRight: '10px' }}
                        />
                        <span>{JSON.parse(localStorage.getItem('user')).name}</span>
                    </div>
                )};
            </div>

            <div className="App">
                <h1>Show User Data</h1>
                {error && <p className="error">{error}</p>}

                {!error && users.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Work</th>
                                <th>Address</th>
                                <th>Salary</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <UserData users={users} onDelete={(user) => confirmDelete(user)} />
                        </tbody>
                    </table>
                )}

                <div className="button-group">
                    <button className="btn" onClick={() => navigate('/add')}>Add Data</button>
                    <button className="btn" onClick={handleLogout}>Logout</button>
                    <button className="btn" onClick={() => navigate('/profile')}>Profile</button>
                </div>

                <div className="footer">
                    <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
                </div>
            </div>
        </>
    );
}

export default Tabel;
