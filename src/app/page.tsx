"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  Clock3,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./home.css";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);

  // User login না থাকলে login page-এ পাঠাবে
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Session load হওয়ার সময় loading screen
  if (status === "loading") {
    return (
      <main className="dashboard-loading">
        <div className="dashboard-loading-spinner" />
        <p>Loading your account...</p>
      </main>
    );
  }

  // Session না থাকলে dashboard render করবে না
  if (!session?.user) {
    return null;
  }

  const userName = session.user.name || "User";
  const userEmail = session.user.email || "";
  const userImage = session.user.image || "";

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <main className="dashboard-page">
      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${menuOpen ? "sidebar-open" : ""
          }`}
      >
        <div className="sidebar-header">
          <Link href="/" className="dashboard-logo">
            Next<span>Auth</span>
          </Link>

          <button
            type="button"
            className="sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link href="/" className="sidebar-link active">
            <Sparkles size={19} />
            <span>Overview</span>
          </Link>

          <Link href="#" className="sidebar-link">
            <User size={19} />
            <span>Profile</span>
          </Link>

          <Link href="#" className="sidebar-link">
            <Clock3 size={19} />
            <span>Activity</span>
          </Link>

          <Link href="#" className="sidebar-link">
            <Settings size={19} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-help-card">
          <div className="help-icon">
            <BookOpen size={21} />
          </div>

          <h3>Need some help?</h3>

          <p>
            Read the guide and learn how everything works.
          </p>

          <button type="button">
            View guide
            <ArrowRight size={16} />
          </button>
        </div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleSignOut}
        >
          <LogOut size={19} />
          <span>Sign out</span>
        </button>

      </aside>

      {/* Mobile overlay */}
      {menuOpen && (
        <button
          type="button"
          className="dashboard-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content */}
      <section className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <button
              type="button"
              className="menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <p>Dashboard</p>
              <h1>Welcome back, {userName}</h1>
            </div>
          </div>

          <div className="dashboard-header-actions">
            <div className="dashboard-search">
              <Search size={18} />

              <input
                type="search"
                placeholder="Search dashboard..."
              />
            </div>

            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span />
            </button>

            <div className="dashboard-user">
              <div className="dashboard-avatar">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={`${userName} profile`}
                    width={44}
                    height={44}
                    className="dashboard-avatar-image"
                  />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>

              <div>
                <strong>{userName}</strong>
                <span>{userEmail}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Welcome banner */}
          <section className="welcome-banner">
            <div className="welcome-content">
              <p className="welcome-label">
                <Sparkles size={16} />
                ACCOUNT READY
              </p>

              <h2>
                Your digital workspace is
                <span> ready to explore.</span>
              </h2>

              <p className="welcome-description">
                Welcome {userName}. Your account is ready.
                Complete your profile and start exploring your
                dashboard.
              </p>

              <div className="welcome-actions">
                <Link href="#" className="primary-action">
                  Complete profile
                  <ArrowRight size={17} />
                </Link>

                <button
                  type="button"
                  className="secondary-action"
                >
                  Explore dashboard
                </button>
              </div>
            </div>

            <div className="welcome-visual">
              <div className="visual-circle visual-circle-large" />
              <div className="visual-circle visual-circle-small" />

              <div className="success-card">
                <div className="success-icon">
                  <CheckCircle2 size={34} />
                </div>

                <strong>Account verified</strong>
                <span>You are ready to continue</span>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="dashboard-stats">
            <article className="stat-card">
              <div className="stat-top">
                <div className="stat-icon purple-icon">
                  <User size={20} />
                </div>

                <span className="stat-badge">Active</span>
              </div>

              <p>Profile completion</p>
              <h3>75%</h3>

              <div className="progress-bar">
                <span className="progress-value progress-75" />
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <div className="stat-icon blue-icon">
                  <Clock3 size={20} />
                </div>

                <span className="stat-badge">Today</span>
              </div>

              <p>Recent activity</p>
              <h3>12</h3>

              <span className="stat-description">
                Actions completed today
              </span>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <div className="stat-icon green-icon">
                  <CheckCircle2 size={20} />
                </div>

                <span className="stat-badge">Secure</span>
              </div>

              <p>Account status</p>
              <h3>Verified</h3>

              <span className="stat-description">
                Your account is protected
              </span>
            </article>
          </section>

          {/* Bottom section */}
          <section className="dashboard-bottom-grid">
            <article className="activity-card">
              <div className="section-heading">
                <div>
                  <p>RECENT ACTIVITY</p>
                  <h2>Your latest updates</h2>
                </div>

                <button type="button">View all</button>
              </div>

              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    <CheckCircle2 size={19} />
                  </div>

                  <div className="activity-info">
                    <strong>
                      Account created successfully
                    </strong>

                    <span>
                      Your new account is now active
                    </span>
                  </div>

                  <time>Just now</time>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    <User size={19} />
                  </div>

                  <div className="activity-info">
                    <strong>Profile setup started</strong>

                    <span>
                      Complete your remaining profile details
                    </span>
                  </div>

                  <time>2 min ago</time>
                </div>

                <div className="activity-item">
                  <div className="activity-icon">
                    <Settings size={19} />
                  </div>

                  <div className="activity-info">
                    <strong>
                      Security settings updated
                    </strong>

                    <span>
                      Your password is securely protected
                    </span>
                  </div>

                  <time>5 min ago</time>
                </div>
              </div>
            </article>

            <article className="quick-actions-card">
              <div className="section-heading">
                <div>
                  <p>QUICK ACTIONS</p>
                  <h2>Get started</h2>
                </div>
              </div>

              <div className="quick-action-list">
                <Link href="/edit-profile">
                  <div className="quick-action-icon">
                    <User size={19} />
                  </div>

                  <div>
                    <strong>Edit your profile</strong>
                    <span>
                      Add your personal information
                    </span>
                  </div>

                  <ArrowRight size={18} />
                </Link>

                <Link href="#">
                  <div className="quick-action-icon">
                    <Settings size={19} />
                  </div>

                  <div>
                    <strong>Account settings</strong>
                    <span>
                      Manage your preferences
                    </span>
                  </div>

                  <ArrowRight size={18} />
                </Link>

                <button type="button" onClick={handleSignOut}>
                  <div className="quick-action-icon logout-icon">
                    <LogOut size={19} />
                  </div>

                  <div>
                    <strong>Sign out</strong>
                    <span>Sign out from this device</span>
                  </div>

                  <ArrowRight size={18} />
                </button>
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}