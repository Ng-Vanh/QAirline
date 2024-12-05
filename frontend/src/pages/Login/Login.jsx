import React, { useState } from "react";
// import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import "./login.css"; // Import the CSS file

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login attempt:", { email, password });
        // router.push("/admin/dashboard");
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Sign in to your account</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email-address" className="form-label">
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            className="form-input"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group password-group">
                        <label htmlFor="password" className="form-label">
                        </label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="form-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {/* {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />} */}
                        </button>
                    </div>
                    <div className="form-footer">
                        <div className="remember-me">
                            <input id="remember-me" name="remember-me" type="checkbox" />
                            <label htmlFor="remember-me">Remember me</label>
                        </div>
                        <a href="#" className="forgot-password">
                            Forgot your password?
                        </a>
                    </div>
                    <button type="submit" className="submit-button">
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}
