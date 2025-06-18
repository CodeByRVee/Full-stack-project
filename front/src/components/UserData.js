import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';


const UserData = ({ users, onDelete }) => {
    const navigate = useNavigate();

    return (
        <>
            {users.map((user) => {
                const { _id, name, age, work, address, salary, email } = user;

                return (
                    <tr key={_id}>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>{age}</td>
                        <td>{work}</td>
                        <td>{address}</td>
                        <td>{salary}</td>
                        <td>
                            <span><button onClick={() => navigate(`../edit/${_id}`)}><FaEdit /></button> </span>
                            <span><button onClick={() => onDelete(user)}><FaTrash /></button></span>
                        </td>
                    </tr>
                );
            })}
        </>
    );
};

export default UserData;
