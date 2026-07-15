"use client";
import { useState, type FormEventHandler } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  };

  const handleRegister: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }
      
      setSuccess("Account created successfully");
      
      const loginResult = await signIn("credentials", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      });
      
      if (loginResult?.error) {
        router.push("/login");
        return;
      }
      
      router.push("/edit-profile");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-orb register-orb-one" />
      <div className="register-orb register-orb-two" />

      <section className="register-container">
        <div className="register-form-panel">
          <div className="register-form-wrapper">
            <Link href="/" className="register-logo">
              Next<span>Auth</span>
            </Link>

            <div className="register-heading">
              <p>GET STARTED</p>
              <h1>Create your account</h1>
              <span>Join us and start your journey today</span>
            </div>

            {error && (
              <div className="register-message register-error">
                {error}
              </div>
            )}

            {success && (
              <div className="register-message register-success">
                {success}
              </div>
            )}

            <form
              onSubmit={handleRegister}
              className="register-form"
            >
              <div className="register-form-group">
                <label htmlFor="name">Full name</label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">♙</span>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(event) =>
                      handleChange("name", event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="register-form-group">
                <label htmlFor="email">Email address</label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">✉</span>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="register-password-grid">
                <div className="register-form-group">
                  <label htmlFor="password">Password</label>

                  <div className="register-input-wrapper">
                    <span className="register-input-icon">⌘</span>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={(event) =>
                        handleChange(
                          "password",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label htmlFor="confirmPassword">
                    Confirm password
                  </label>

                  <div className="register-input-wrapper">
                    <span className="register-input-icon">⌘</span>

                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(event) =>
                        handleChange(
                          "confirmPassword",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <label className="register-show-password">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() =>
                    setShowPassword((previous) => !previous)
                  }
                />

                <span>Show password</span>
              </label>

              <label className="register-terms">
                <input type="checkbox" required />

                <span>
                  I agree to the{" "}
                  <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </span>
              </label>

              <button
                type="submit"
                className="register-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="register-loader" />
                ) : (
                  "Create account"
                )}
              </button>

              <button
                type="button"
                className="register-google-button"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/edit-profile",
                  })
                }
              >
                <FcGoogle className="register-google-icon" />
                Sign up with Google
              </button>

            </form>

            <p className="register-switch-page">
              Already have an account?
              <Link href="/login">Login here</Link>
            </p>
          </div>
        </div>

        <div className="register-visual-panel">
          <div className="register-visual-content">
            <div className="register-floating-card register-card-one">
              <span>✓</span>

              <div>
                <strong>Secure account</strong>
                <p>Your data stays protected</p>
              </div>
            </div>

            <div className="register-main-visual">
              <div className="register-visual-icon">✦</div>

              <p>START YOUR JOURNEY</p>

              <h2>
                Everything you need,
                <span> in one secure place.</span>
              </h2>

              <p className="register-description">
                Create an account and unlock a simple, fast and
                secure experience.
              </p>
            </div>

            <div className="register-floating-card register-card-two">
              <span>⚡</span>

              <div>
                <strong>Quick setup</strong>
                <p>Ready in a few seconds</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}