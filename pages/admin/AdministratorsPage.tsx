
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { apiRequest, ApiError } from "../../src/api/client";
import { useAuth } from "../../src/context/AuthContext";

type AdminStatus = "ACTIVE" | "INVITED" | "SUSPENDED" | "DEACTIVATED";

type AdminRole = {
  id: string;
  name: string;
  slug: string;
};

type Administrator = {
  id: string;
  name: string;
  email: string;
  status: AdminStatus;
  isSuperAdmin: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  roles: {
    role: AdminRole;
  }[];
};

type Permission = {
  id: string;
  key: string;
  module: string;
  action: string;
  description: string | null;
};

type AvailableRole = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  _count: {
    administrators: number;
  };
  permissions: {
    permission: Permission;
  }[];
};

type Invitation = {
  id: string;
  expiresAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  adminUser: {
    id: string;
    name: string;
    email: string;
    status: AdminStatus;
    roles: {
      role: AdminRole;
    }[];
  } | null;
  invitedBy: {
    id: string;
    name: string;
    email: string;
  };
};

type ApiResponse<T> = {
  status: string;
  message?: string;
  data: T;
};

type InvitationCreationResponse = {
  invitation: {
    id: string;
    email: string;
    role: string;
    expiresAt: string;
  };
  invitationUrl?: string;
};

const statusLabels: Record<AdminStatus, string> = {
  ACTIVE: "Active",
  INVITED: "Invitation pending",
  SUSPENDED: "Suspended",
  DEACTIVATED: "Deactivated",
};

function formatDate(value: string | null) {
  if (!value) return "Never";

  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusClass(status: AdminStatus) {
  return `admin-management-status admin-management-status-${status.toLowerCase()}`;
}

export default function AdministratorsPage() {
  const { administrator, hasPermission } = useAuth();

  const canManage = hasPermission("admins.manage");
  const canInvite = hasPermission("admin.invitations.create");

  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [roles, setRoles] = useState<AvailableRole[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showInviteForm, setShowInviteForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");

  const [invitationUrl, setInvitationUrl] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [adminResponse, roleResponse, invitationResponse] =
        await Promise.all([
          apiRequest<ApiResponse<{ administrators: Administrator[] }>>(
            "/admin/administrators"
          ),
          apiRequest<ApiResponse<{ roles: AvailableRole[] }>>(
            "/admin/administrators/roles"
          ),
          apiRequest<ApiResponse<{ invitations: Invitation[] }>>(
            "/admin/administrators/invitations"
          ),
        ]);

      setAdministrators(adminResponse.data.administrators);
      setRoles(roleResponse.data.roles);
      setInvitations(invitationResponse.data.invitations);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load administrator information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (canManage) {
      void loadData();
    } else {
      setLoading(false);
    }
  }, [canManage, loadData]);

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !roleId) {
      setError("Please complete all invitation fields.");
      return;
    }

    setSubmitting(true);
    setError("");
    setNotice("");
    setInvitationUrl("");

    try {
      const response = await apiRequest<
        ApiResponse<InvitationCreationResponse>
      >("/auth/invitations", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          roleId,
        }),
      });

      setNotice(response.message || "Invitation created successfully.");

      if (response.data.invitationUrl) {
        setInvitationUrl(response.data.invitationUrl);
      }

      setName("");
      setEmail("");
      setRoleId("");

      await loadData(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create administrator invitation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (
    admin: Administrator,
    newStatus: AdminStatus
  ) => {
    if (admin.isSuperAdmin || admin.id === administrator?.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to change ${admin.name}'s status to ${statusLabels[newStatus]}?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await apiRequest<ApiResponse<{
        administrator: Administrator;
      }>>(`/admin/administrators/${admin.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      setNotice(response.message || "Administrator status updated.");

      await loadData(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update administrator status."
      );
    }
  };

  const handleRevokeInvitation = async (invitation: Invitation) => {
    const confirmed = window.confirm(
      `Are you sure you want to revoke the invitation for ${
        invitation.adminUser?.email ?? "this administrator"
      }?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await apiRequest<ApiResponse<unknown>>(
        `/admin/administrators/invitations/${invitation.id}/revoke`,
        {
          method: "PATCH",
        }
      );

      setNotice(response.message || "Invitation revoked successfully.");

      await loadData(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to revoke invitation."
      );
    }
  };

  const handleCopyInvitation = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setNotice("Invitation link copied to clipboard.");
    } catch {
      setError("Unable to copy the invitation link.");
    }
  };

  const filteredAdministrators = administrators.filter((admin) => {
    const searchValue = search.toLowerCase();

    return (
      admin.name.toLowerCase().includes(searchValue) ||
      admin.email.toLowerCase().includes(searchValue) ||
      admin.roles.some(({ role }) =>
        role.name.toLowerCase().includes(searchValue)
      )
    );
  });

  const pendingInvitations = invitations.filter(
    (invitation) =>
      !invitation.acceptedAt &&
      !invitation.revokedAt &&
      new Date(invitation.expiresAt) > new Date()
  );

  if (!canManage) {
    return (
      <section className="admin-management-page">
        <div className="admin-management-empty">
          <ShieldCheck size={36} />
          <h2>Access restricted</h2>
          <p>
            You do not have permission to manage administrators.
            Contact your super administrator if you need access.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-management-page">
      <div className="admin-management-header">
        <div>
          <span className="admin-management-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Administrators</h1>

          <p>
            Manage administrator accounts, roles and access to the
            LourierPark community platform.
          </p>
        </div>

        <div className="admin-management-header-actions">
          <button
            type="button"
            className="admin-management-secondary-button"
            onClick={() => void loadData(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "admin-management-spinning" : ""}
            />
            Refresh
          </button>

          {canInvite && (
            <button
              type="button"
              className="admin-management-primary-button"
              onClick={() => {
                setShowInviteForm((value) => !value);
                setError("");
                setNotice("");
              }}
            >
              <UserPlus size={17} />
              Invite administrator
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="admin-management-alert admin-management-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {notice && (
        <div className="admin-management-alert admin-management-alert-success">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {invitationUrl && (
        <div className="admin-management-invitation-link">
          <div>
            <strong>Invitation link ready</strong>
            <p>
              Share this link with the invited administrator.
              It expires after 48 hours.
            </p>
            <code>{invitationUrl}</code>
          </div>

          <button
            type="button"
            className="admin-management-secondary-button"
            onClick={() => void handleCopyInvitation()}
          >
            <Copy size={16} />
            Copy link
          </button>
        </div>
      )}

      {showInviteForm && canInvite && (
        <div className="admin-management-panel">
          <div className="admin-management-panel-header">
            <div>
              <h2>Invite an administrator</h2>
              <p>
                Create an invitation for someone who will help manage
                the community website.
              </p>
            </div>

            <button
              type="button"
              className="admin-management-icon-button"
              onClick={() => setShowInviteForm(false)}
              aria-label="Close invitation form"
            >
              <X size={19} />
            </button>
          </div>

          <form onSubmit={handleInvite}>
            <div className="admin-management-form-grid">
              <label>
                Full name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter full name"
                  maxLength={120}
                  required
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  maxLength={254}
                  required
                />
              </label>

              <label>
                Administrator role
                <select
                  value={roleId}
                  onChange={(event) => setRoleId(event.target.value)}
                  required
                >
                  <option value="">Select a role</option>
                  {roles
                    .filter(
                      (role) =>
                        role.slug !== "super-administrator" ||
                        administrator?.isSuperAdmin
                    )
                    .map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div className="admin-management-form-footer">
              <p>
                <Clock size={15} />
                Invitations expire after 48 hours.
              </p>

              <button
                type="submit"
                className="admin-management-primary-button"
                disabled={submitting}
              >
                <Mail size={16} />
                {submitting ? "Creating invitation..." : "Create invitation"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-management-loading">
          <RefreshCw size={23} className="admin-management-spinning" />
          <p>Loading administrator information...</p>
        </div>
      ) : (
        <>
          <div className="admin-management-stats">
            <div className="admin-management-stat-card">
              <div className="admin-management-stat-icon">
                <Users size={21} />
              </div>
              <div>
                <span>Total administrators</span>
                <strong>{administrators.length}</strong>
              </div>
            </div>

            <div className="admin-management-stat-card">
              <div className="admin-management-stat-icon">
                <CheckCircle2 size={21} />
              </div>
              <div>
                <span>Active administrators</span>
                <strong>
                  {
                    administrators.filter(
                      (admin) => admin.status === "ACTIVE"
                    ).length
                  }
                </strong>
              </div>
            </div>

            <div className="admin-management-stat-card">
              <div className="admin-management-stat-icon">
                <Clock size={21} />
              </div>
              <div>
                <span>Pending invitations</span>
                <strong>{pendingInvitations.length}</strong>
              </div>
            </div>

            <div className="admin-management-stat-card">
              <div className="admin-management-stat-icon">
                <ShieldCheck size={21} />
              </div>
              <div>
                <span>Available roles</span>
                <strong>{roles.length}</strong>
              </div>
            </div>
          </div>

          <div className="admin-management-panel">
            <div className="admin-management-panel-header">
              <div>
                <h2>Administrator accounts</h2>
                <p>
                  View and manage access to the administration workspace.
                </p>
              </div>

              <span className="admin-management-count">
                {filteredAdministrators.length} accounts
              </span>
            </div>

            <div className="admin-management-search">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email or role..."
                aria-label="Search administrators"
              />
            </div>

            <div className="admin-management-table-wrapper">
              <table className="admin-management-table">
                <thead>
                  <tr>
                    <th>Administrator</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last login</th>
                    <th>Account created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAdministrators.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <div className="admin-management-person">
                          <div className="admin-management-avatar">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{admin.name}</strong>
                            <span>{admin.email}</span>
                            {admin.isSuperAdmin && (
                              <small>Super administrator</small>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="admin-management-role-list">
                          {admin.roles.length > 0
                            ? admin.roles.map(({ role }) => (
                                <span key={role.id}>{role.name}</span>
                              ))
                            : "No assigned role"}
                        </div>
                      </td>

                      <td>
                        <span className={getStatusClass(admin.status)}>
                          {statusLabels[admin.status]}
                        </span>
                      </td>

                      <td>{formatDate(admin.lastLoginAt)}</td>
                      <td>{formatDate(admin.createdAt)}</td>

                      <td>
                        {admin.isSuperAdmin ||
                        admin.id === administrator?.id ? (
                          <span className="admin-management-protected">
                            Protected
                          </span>
                        ) : (
                          <select
                            aria-label={`Change status for ${admin.name}`}
                            className="admin-management-status-select"
                            value={admin.status}
                            disabled={admin.status === "INVITED"}
                            onChange={(event) =>
                              void handleStatusChange(
                                admin,
                                event.target.value as AdminStatus
                              )
                            }
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="SUSPENDED">Suspended</option>
                            <option value="DEACTIVATED">Deactivated</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredAdministrators.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <div className="admin-management-empty">
                          <Users size={28} />
                          <p>No administrators found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-management-panel">
            <div className="admin-management-panel-header">
              <div>
                <h2>Administrator roles</h2>
                <p>
                  Available roles and their assigned permissions.
                </p>
              </div>
            </div>

            <div className="admin-management-role-grid">
              {roles.map((role) => (
                <div className="admin-management-role-card" key={role.id}>
                  <div className="admin-management-role-heading">
                    <div className="admin-management-stat-icon">
                      <UserCog size={20} />
                    </div>

                    <div>
                      <strong>{role.name}</strong>
                      <span>{role.slug}</span>
                    </div>
                  </div>

                  {role.description && <p>{role.description}</p>}

                  <div className="admin-management-role-meta">
                    <span>
                      {role._count.administrators} assigned administrator(s)
                    </span>
                    <span>
                      {role.permissions.length} permissions
                    </span>
                  </div>

                  <div className="admin-management-permissions">
                    {role.permissions.map(({ permission }) => (
                      <span key={permission.id} title={permission.description ?? permission.key}>
                        {permission.key}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {roles.length === 0 && (
                <p>No administrator roles are currently available.</p>
              )}
            </div>
          </div>

          <div className="admin-management-panel">
            <div className="admin-management-panel-header">
              <div>
                <h2>Administrator invitations</h2>
                <p>
                  Track pending, accepted, expired and revoked invitations.
                </p>
              </div>

              <span className="admin-management-count">
                {invitations.length} invitations
              </span>
            </div>

            <div className="admin-management-table-wrapper">
              <table className="admin-management-table">
                <thead>
                  <tr>
                    <th>Invitee</th>
                    <th>Invited by</th>
                    <th>Created</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {invitations.map((invitation) => {
                    const isPending =
                      !invitation.acceptedAt &&
                      !invitation.revokedAt &&
                      new Date(invitation.expiresAt) > new Date();

                    const invitationStatus = invitation.acceptedAt
                      ? "Accepted"
                      : invitation.revokedAt
                        ? "Revoked"
                        : new Date(invitation.expiresAt) <= new Date()
                          ? "Expired"
                          : "Pending";

                    return (
                      <tr key={invitation.id}>
                        <td>
                          <div className="admin-management-person">
                            <div className="admin-management-avatar">
                              {invitation.adminUser?.name
                                ?.charAt(0)
                                .toUpperCase() ?? "?"}
                            </div>

                            <div>
                              <strong>
                                {invitation.adminUser?.name ?? "Unknown"}
                              </strong>
                              <span>
                                {invitation.adminUser?.email ??
                                  "Administrator unavailable"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="admin-management-inviter">
                            <strong>{invitation.invitedBy.name}</strong>
                            <span>{invitation.invitedBy.email}</span>
                          </div>
                        </td>

                        <td>{formatDate(invitation.createdAt)}</td>
                        <td>{formatDate(invitation.expiresAt)}</td>

                        <td>
                          <span
                            className={`admin-management-status admin-management-status-${invitationStatus.toLowerCase()}`}
                          >
                            {invitationStatus}
                          </span>
                        </td>

                        <td>
                          {isPending ? (
                            <button
                              type="button"
                              className="admin-management-danger-button"
                              onClick={() =>
                                void handleRevokeInvitation(invitation)
                              }
                            >
                              <X size={15} />
                              Revoke
                            </button>
                          ) : (
                            <span className="admin-management-protected">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {invitations.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <div className="admin-management-empty">
                          <Mail size={28} />
                          <p>No administrator invitations yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
