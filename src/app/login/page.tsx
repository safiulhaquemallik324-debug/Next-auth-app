"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email: email.trim().toLowerCase(),
                password,
                redirect: false,
            });

            console.log("Login result:", result);

            if (!result || result.error) {
                setError("Email or password is incorrect");
                return;
            }

            router.replace("/");
            router.refresh();
        } catch (error) {
            console.error("Login error:", error);
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <div className="login-shape login-shape-one" />
            <div className="login-shape login-shape-two" />

            <section className="login-container">
                <div className="login-info-panel">
                    <Link href="/" className="login-logo">
                        Next<span>Auth</span>
                    </Link>

                    <div className="login-info-content">
                        <p className="login-badge">WELCOME BACK</p>

                        <h1>
                            Continue your
                            <span> digital journey.</span>
                        </h1>

                        <p className="login-description">
                            Securely sign in to your account and continue from where you left
                            off.
                        </p>

                        <div className="login-features">
                            <div>
                                <span>✓</span>
                                Secure authentication
                            </div>

                            <div>
                                <span>✓</span>
                                Fast and simple access
                            </div>

                            <div>
                                <span>✓</span>
                                Protected user data
                            </div>
                        </div>
                    </div>

                    <p className="login-copyright">
                        © {new Date().getFullYear()} NextAuth App
                    </p>
                </div>

                <div className="login-form-panel">
                    <div className="login-form-wrapper">
                        <Link href="/" className="login-mobile-logo">
                            Next<span>Auth</span>
                        </Link>

                        <div className="login-heading">
                            <p>WELCOME BACK</p>
                            <h2>Login to your account</h2>
                            <span>Enter your details to continue</span>
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <form onSubmit={handleLogin} className="login-form">
                            <div className="login-form-group">
                                <label htmlFor="email">Email address</label>

                                <div className="login-input-wrapper">
                                    <span className="login-input-icon">✉</span>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="login-form-group">
                                <div className="login-label-row">
                                    <label htmlFor="password">Password</label>

                                    <Link href="/forgot-password">Forgot password?</Link>
                                </div>

                                <div className="login-input-wrapper">
                                    <span className="login-input-icon">⌘</span>

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="login-password-toggle"
                                        onClick={() => setShowPassword((value) => !value)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <label className="login-remember">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>

                            <button
                                type="submit"
                                className="login-submit-button"
                                disabled={loading}
                            >
                                {loading ? <span className="login-loader" /> : "Login"}
                            </button>
                        </form>

                        <div className="login-divider">
                            <span />
                            <p>or continue with</p>
                            <span />
                        </div>
                        <button
                            type="button"
                            className="login-google-button"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                        >
                            <FcGoogle className="login-google-icon" />
                            Continue with Google
                        </button>

                        <p className="login-switch-page">
                            Don&apos;t have an account?
                            <Link href="/register">Create account</Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}