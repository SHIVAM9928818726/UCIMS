import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home as HomeIcon, LayoutDashboard, Users, LogOut, Plus, ShieldCheck,
  UserCheck, UserX, Star, Search, Trash2, Eye, CheckCircle, AlertTriangle, X,
  Download, Clock, Activity
} from "lucide-react";
import "./UserAdmin.css";

/* ─── UCIMS SVG Logo (inline) ─── */
const UCImsLogo = () => (
  <svg width="42" height="42" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="30" stroke="#2563eb" strokeWidth="4" fill="#0f172a" />
    <path d="M16 24L32 16L48 24L32 32L16 24Z" fill="#38bdf8" />
    <path d="M22 28V36C22 36 28 40 32 40C36 40 42 36 42 36V28L32 34L22 28Z" fill="#2563eb" />
    <rect x="20" y="44" width="6" height="10" fill="#38bdf8" rx="2" />
    <rect x="29" y="40" width="6" height="14" fill="#2563eb" rx="2" />
    <rect x="38" y="46" width="6" height="8" fill="#38bdf8" rx="2" />
  </svg>
);

/* ── Users are now fetched from backend ── */


const STAT_COLORS = {
  total: "#2563eb",
  active: "#10b981",
  blocked: "#ef4444",
  feedback: "#f59e0b",
};

/* ─── Utility ─── */
const avatarColor = (name) => {
  const colors = ["#2563eb", "#7c3aed", "#db2777", "#0891b2", "#059669", "#d97706", "#dc2626"];
  let hash = 0;
  for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) % colors.length;
  return colors[Math.abs(hash)];
};

/* ─── Main Component ─── */
const UserAdmin = () => {
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    if (localStorage.getItem("adminLoggedIn") !== "true") {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [activeStat, setActiveStat] = useState("stat-total");
  const [activities, setActivities] = useState([
    { id: 1, action: "Admin Login", detail: "System accessed", time: "Just now" }
  ]);
  const [viewUser, setViewUser] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student", status: "Active" });

  const handleStatClick = (id) => {
    setActiveStat(id);
    if (id === "stat-total") setStatusFilter("All");
    if (id === "stat-active") setStatusFilter("Active");
    if (id === "stat-blocked") setStatusFilter("Blocked");
  };

  const addActivity = (action, detail) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivities(prev => [{ id: Date.now(), action, detail, time }, ...prev].slice(0, 5));
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
      showToast("Failed to fetch users.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Derived stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "Active").length;
  const blockedUsers = users.filter(u => u.status === "Blocked").length;

  const stats = [
    { label: "Total Users", value: totalUsers, icon: <Users size={20} />, color: STAT_COLORS.total, id: "stat-total" },
    { label: "Active Users", value: activeUsers, icon: <UserCheck size={20} />, color: STAT_COLORS.active, id: "stat-active" },
    { label: "Blocked Users", value: blockedUsers, icon: <UserX size={20} />, color: STAT_COLORS.blocked, id: "stat-blocked" },
    { label: "Feedback Rating", value: "4.8 / 5", icon: <Star size={20} />, color: STAT_COLORS.feedback, id: "stat-feedback" },
  ];

  // Filtered list
  const filteredUsers = users.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  // Actions
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleBlock = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}/toggle-status`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => {
          if (u.id !== id) return u;
          showToast(`${u.name} has been ${data.new_status === "Blocked" ? "blocked" : "unblocked"}.`, data.new_status === "Blocked" ? "warn" : "success");
          addActivity(data.new_status === "Blocked" ? "User Blocked" : "User Unblocked", `ID: ${id}`);
          return { ...u, status: data.new_status };
        }));
      }
    } catch (err) {
      showToast("Action failed.", "error");
    }
  };

  const confirmDelete = (user) => setDeleteConfirm(user);

  const doDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`/api/users/${deleteConfirm.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.id !== deleteConfirm.id));
        showToast(`${deleteConfirm.name} removed successfully.`, "error");
        addActivity(deleteConfirm.role === "Admin" ? "Admin Deleted" : "User Deleted", deleteConfirm.email);
        setDeleteConfirm(null);
      }
    } catch (err) {
      showToast("Delete failed.", "error");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    const userToSave = {
      ...newUser,
      joined: new Date().toISOString().split("T")[0],
      lastLogin: "Never"
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToSave)
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => [{ ...userToSave, id: data.id }, ...prev]);
        showToast(`${newUser.name} added successfully!`);
        addActivity("User Added", newUser.email);
        setNewUser({ name: "", email: "", role: "Student", status: "Active" });
        setAddModal(false);
      } else {
        showToast(data.error || "Failed to add user.", "error");
      }
    } catch (err) {
      showToast("Add user failed.", "error");
    }
  };

  const handleExportCSV = () => {
    const headers = "Name,Email,Role,Status,Joined,LastLogin\n";
    const csv = filteredUsers.map(u => `${u.name},${u.email},${u.role},${u.status},${u.joined},${u.lastLogin}`).join("\n");
    const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    addActivity("Users Exported", `Exported ${filteredUsers.length} users CSV`);
    showToast("Users exported successfully!");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin-login");
  };

  return (
    <div className="ua-container">

      {/* Toast Notification */}
      {toast && (
        <div className={`ua-toast ua-toast-${toast.type}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>
            {toast.type === "success" ? <CheckCircle size={18} /> :
              toast.type === "warn" ? <AlertTriangle size={18} /> : <Trash2 size={18} />}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Floating Back Home Button */}
      <button className="ua-float-home-btn" onClick={() => navigate("/home")} title="Back to Home" id="ua-float-home" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <HomeIcon size={18} /> <span>Back to Home</span>
      </button>

      {/* Background glow blobs */}
      <div className="ua-blob ua-blob-1" />
      <div className="ua-blob ua-blob-2" />

      <div className="ua-inner">

        {/* ── HEADER ── */}
        <header className="ua-header">
          <div className="ua-header-left">
            <div className="ua-logo-wrap"><UCImsLogo /></div>
            <div>
              <h1 className="ua-heading">User Admin Dashboard</h1>
              <p className="ua-heading-sub">Manage users, roles &amp; access control</p>
            </div>
          </div>
          <div className="ua-header-actions">
            <button className="ua-export-btn" onClick={handleExportCSV} id="ua-export-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} /> Export CSV
            </button>
            <button className="ua-add-btn" onClick={() => setAddModal(true)} id="ua-add-user-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} /> Add User
            </button>
            <button className="ua-logout-btn" onClick={handleAdminLogout} id="ua-admin-logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* ── STATS ── */}
        <section className="ua-stats-grid">
          {stats.map((s) => (
            <div
              className={`ua-stat-card ${activeStat === s.id && s.id !== "stat-feedback" ? "active" : ""} ${s.id !== "stat-feedback" ? "clickable" : ""}`}
              key={s.id}
              id={s.id}
              style={{ "--accent": s.color }}
              onClick={() => s.id !== "stat-feedback" && handleStatClick(s.id)}
            >
              <div className="ua-stat-icon-box">{s.icon}</div>
              <div className="ua-stat-info">
                <span className="ua-stat-label">{s.label}</span>
                <span className="ua-stat-value">{s.value}</span>
              </div>
              <div className="ua-stat-accent-bar" />
            </div>
          ))}
        </section>

        {/* ── CONTROLS ── */}
        <section className="ua-controls">
          <div className="ua-search-wrap" style={{ display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
            <Search size={18} color="#64748b" style={{ marginRight: "7px" }} />
            <input
              id="ua-search-input"
              type="text"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="ua-search-clear" onClick={() => setSearchTerm("")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            )}
          </div>
          <div className="ua-filters">
            <select id="ua-status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
            <select id="ua-role-filter" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </section>

        {/* ── TABLE ── */}
        <section className="ua-table-wrap">
          <div className="ua-table-header-bar">
            <span className="ua-table-count">
              Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
            </span>
          </div>
          <div className="ua-table-scroll">
            <table className="ua-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="ua-empty-row">
                      <div className="ua-empty-state">
                        <p>Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="ua-empty-row">
                      <div className="ua-empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <Search size={48} color="#cbd5e1" />
                        <p>No users match your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="ua-user-row">
                      <td>
                        <div className="ua-user-cell">
                          <div className="ua-avatar" style={{ background: `linear-gradient(135deg, ${avatarColor(user.name)}, ${avatarColor(user.name)}88)` }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="ua-user-name">{user.name}</span>
                        </div>
                      </td>
                      <td className="ua-email">{user.email}</td>
                      <td>
                        <span className={`ua-badge ua-role-${user.role.toLowerCase()}`}>{user.role}</span>
                      </td>
                      <td>
                        <span className={`ua-badge ua-status-${user.status.toLowerCase()}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {user.status === "Active" ? <UserCheck size={12} /> : <UserX size={12} />}
                          {user.status}
                        </span>
                      </td>
                      <td className="ua-date">{user.joined}</td>
                      <td className="ua-date">{user.lastLogin}</td>
                      <td>
                        <div className="ua-action-group">
                          <button
                            className="ua-action-btn ua-btn-view"
                            title="View Details"
                            onClick={() => setViewUser(user)}
                          ><Eye size={16} /> View</button>
                          <button
                            className={`ua-action-btn ${user.status === "Active" ? "ua-btn-block" : "ua-btn-unblock"}`}
                            title={user.status === "Active" ? "Block User" : "Unblock User"}
                            onClick={() => toggleBlock(user.id)}
                          >
                            {user.status === "Active" ? <><UserX size={16} /> Block</> : <><UserCheck size={16} /> Unblock</>}
                          </button>
                          <button
                            className="ua-action-btn ua-btn-delete"
                            title="Delete User"
                            onClick={() => confirmDelete(user)}
                          ><Trash2 size={16} /> Delete</button>
                          {user.role === "Admin" && (
                            <button
                              className="ua-action-btn ua-btn-delete-admin"
                              title="Delete Admin User"
                              onClick={() => confirmDelete(user)}
                            ><ShieldCheck size={16} /> Delete Admin</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── RECENT ACTIVITY ── */}
        <section className="ua-dashboard-bottom">
          <div className="ua-recent-activity">
            <div className="ua-activity-header">
              <Activity size={18} color="#3b82f6" />
              <h3>Recent Activity Logs</h3>
            </div>
            <div className="ua-activity-list">
              {activities.length === 0 ? (
                <p className="ua-no-activity">No recent activity.</p>
              ) : (
                activities.map(act => (
                  <div key={act.id} className="ua-activity-item">
                    <div className="ua-activity-icon"><Clock size={14} /></div>
                    <div className="ua-activity-content">
                      <span className="ua-act-time">{act.time}</span>
                      <strong className="ua-act-title">{act.action}</strong>
                      <span className="ua-act-detail">{act.detail}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── VIEW USER MODAL ── */}
      {viewUser && (
        <div className="ua-modal-overlay" onClick={() => setViewUser(null)}>
          <div className="ua-modal" onClick={e => e.stopPropagation()}>
            <button className="ua-modal-close" onClick={() => setViewUser(null)} title="Close">
             ❌ <X size={24} />
            </button>
            <div className="ua-modal-avatar" style={{ background: `linear-gradient(135deg, ${avatarColor(viewUser.name)}, ${avatarColor(viewUser.name)}88)` }}>
              {viewUser.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="ua-modal-name">{viewUser.name}</h3>
            <p className="ua-modal-email">{viewUser.email}</p>
            <div className="ua-modal-badges">
              <span className={`ua-badge ua-role-${viewUser.role.toLowerCase()}`}>{viewUser.role}</span>
              <span className={`ua-badge ua-status-${viewUser.status.toLowerCase()}`}>{viewUser.status}</span>
            </div>
            <div className="ua-modal-details">
              <div className="ua-modal-detail-row"><span>📅 Joined</span><strong>{viewUser.joined}</strong></div>
              <div className="ua-modal-detail-row"><span>🕐 Last Login</span><strong>{viewUser.lastLogin}</strong></div>
              <div className="ua-modal-detail-row"><span>🆔 User ID</span><strong>#{viewUser.id}</strong></div>
            </div>
            <div className="ua-modal-actions">
              <button
                className={`ua-modal-action-btn ${viewUser.status === "Active" ? "ua-modal-btn-block" : "ua-modal-btn-unblock"}`}
                onClick={() => { toggleBlock(viewUser.id); setViewUser(null); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
              >
                {viewUser.status === "Active" ? <><UserX size={18} /> Block User</> : <><UserCheck size={18} /> Unblock User</>}
              </button>
              <button className="ua-modal-action-btn ua-modal-btn-delete" onClick={() => { setViewUser(null); confirmDelete(viewUser); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <Trash2 size={18} /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="ua-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="ua-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="ua-confirm-icon"><AlertTriangle size={32} /></div>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
            <div className="ua-confirm-actions">
              <button className="ua-confirm-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="ua-confirm-delete" onClick={doDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD USER MODAL ── */}
      {addModal && (
        <div className="ua-modal-overlay" onClick={() => setAddModal(false)}>
          <div className="ua-modal ua-add-modal" onClick={e => e.stopPropagation()}>
            <button className="ua-modal-close" onClick={() => setAddModal(false)} title="Close" style={{ color: "white" }}>
              <b>✕</b>< X size={24} />
            </button>
            <h3 className="ua-modal-name" style={{ marginBottom: "1.5rem" }}>➕ Add New User</h3>
            <form onSubmit={handleAddUser} className="ua-add-form">
              <div className="ua-form-group">
                <label>Full Name</label>
                <input type="text" placeholder="User Name" value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
              </div>
              <div className="ua-form-group">
                <label>Email Address</label>
                <input type="email" placeholder="user@gmail.com" value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
              </div>
              <div className="ua-form-row">
                <div className="ua-form-group">
                  <label>Role</label>
                  <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option>Student</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="ua-form-group">
                  <label>Status</label>
                  <select value={newUser.status} onChange={e => setNewUser({ ...newUser, status: e.target.value })}>
                    <option>Active</option>
                    <option>Blocked</option>
                  </select>
                </div>
              </div>
              <div className="ua-form-actions">
                <button type="button" className="ua-confirm-cancel" onClick={() => setAddModal(false)}>Cancel</button>
                <button type="submit" className="ua-confirm-save">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdmin;
