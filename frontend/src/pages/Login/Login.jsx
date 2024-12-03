'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage('')

        const url = isLogin
            ? 'https://qairline-t28f.onrender.com/api/users/login'
            : 'https://qairline-t28f.onrender.com/api/users'

        const body = isLogin
            ? { username, password }
            : { name, username, password }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await response.json()

            if (response.ok) {
                setMessage(data.message)
                setTimeout(() => router.push('/'), 2000) 
            } else {
                setMessage(data.message || 'An error occurred')
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>{isLogin ? 'Login' : 'Create Account'}</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {!isLogin && (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            required
                            className={styles.input}
                        />
                    )}
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>
                {message && <p className={styles.message}>{message}</p>}
                <p className={styles.switchText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className={styles.switchButton}>
                        {isLogin ? 'Create one' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    )
}