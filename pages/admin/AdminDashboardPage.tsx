
import { useAuth } from "../../src/context/AuthContext";

export default function AdminDashboardPage() {
  const { administrator, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <p className="admin-dashboard-eyebrow">
            LOURIERPARK COMMUNITY
          </p>

          <h1>Administration dashboard</h1>

          <p>
            Welcome back, {administrator?.name}.
            Manage your neighbourhood platform from here.
          </p>
        </div>

        <button onClick={handleLogout}>
          Sign out
        </button>
      </header>

      <section className="admin-dashboard-content">
        <h2>Content management</h2>

        <p>
          Your administration workspace is ready.
          Content management modules will be added here.
        </p>
      </section>
    </main>
  );
}
