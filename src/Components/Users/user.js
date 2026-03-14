import React from 'react'
import { useAuth } from '../Context/context';

function User() {

  const {users}=useAuth()
  return (
    <div>
          <div className="data-section">
            <div className="section-header">
              <h2>Users List</h2>
              <button className="add-btn">+ Add New User</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td className="user-name">
                        <div className="avatar-small">👤</div>
                        {user.name}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.isLoggedIn?"Logged in":"Log out"}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn edit">✏️</button>
                        <button className="action-btn delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </div>
  )
}

export default User