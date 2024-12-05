import React, { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./loginStyle.module.css";

const AdminLoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: "", description: "", status: "" });
    const [isToastOpen, setIsToastOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === "admin" && password === "admin") {
            setIsLoading(true);
            setToastMessage({
                title: "Success",
                description: "Login successful!",
                status: "success",
            });
            setIsToastOpen(true);
            onLoginSuccess();
            setTimeout(() => {
                setIsLoading(false);
                navigate("/admin");
            }, 2000); // Simulate loading time
        } else {
            setToastMessage({
                title: "Error",
                description: "Invalid username or password.",
                status: "error",
            });
            setIsToastOpen(true);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <Toast.Provider>
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    {isLoading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner} />
                            <p>Logging in...</p>
                        </div>
                    ) : (
                        <>
                            <h2 className={styles.title}>Admin Login</h2>
                            <div className={styles.inputGroup}>
                                <User size={20} color="#007bff" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={styles.inputField}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <Lock size={20} color="#007bff" />
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={styles.inputField}
                                />
                                <button
                                    type="button"
                                    className={styles.togglePasswordButton}
                                    onClick={togglePasswordVisibility}
                                >
                                    {isPasswordVisible ? (
                                        <EyeOff size={20} color="#007bff" />
                                    ) : (
                                        <Eye size={20} color="#007bff" />
                                    )}
                                </button>
                            </div>
                            <button className={styles.loginButton} onClick={handleLogin}>
                                Login
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            <Toast.Root
                className={`${styles.toast} ${styles[toastMessage.status]}`}
                open={isToastOpen}
                onOpenChange={setIsToastOpen}
            >
                <Toast.Title className={styles.toastTitle}>{toastMessage.title}</Toast.Title>
                <Toast.Description className={styles.toastDescription}>
                    {toastMessage.description}
                </Toast.Description>
            </Toast.Root>
            <Toast.Viewport className={styles.toastViewport} />
        </Toast.Provider>
    );
};

export default AdminLoginPage;
