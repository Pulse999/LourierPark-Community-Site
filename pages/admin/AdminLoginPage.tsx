import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { useAuth } from "../../src/context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    navigate("/admin/dashboard", { replace: true });
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-brand">
        <Link to="/" aria-label="Return to LourierPark website">
          <img
            src="/images/LourierPark-Neighbourhood-Logo.png"
            alt="LourierPark"
          />
        </Link>
        <span>COMMUNITY ADMINISTRATION</span>
      </div>

      <section className="admin-login-card">
        <div className="admin-login-icon">
          <ShieldCheck size={28} />
        </div>

        <p className="admin-login-eyebrow">SECURE ADMINISTRATION</p>

        <h1>Welcome back.</h1>

        <p className="admin-login-description">
          Sign in to manage the LourierPark community platform.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email address</label>

          <div className="admin-login-input">
            <Mail size={18} />
            <input
              id="admin-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <label htmlFor="admin-password">Password</label>

          <div className="admin-login-input">
            <LockKeyhole size={18} />
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in securely"}
          </button>
        </form>

        <p className="admin-login-security">
          <LockKeyhole size={14} />
          Protected administrator access
        </p>
      </section>

      <footer className="admin-login-footer">
        © {new Date().getFullYear()} LourierPark Community
        <span>Our Neighbourhood, Our Home</span>
      </footer>
    </main>
  );
}