import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <header>
        <h1>HEXAPATH AI Admin Panel</h1>
      </header>
      <div className="admin-container">
        <aside className="sidebar">
          <ul>
            <li>Dashboard</li>
            <li>Users</li>
            <li>Settings</li>
          </ul>
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
