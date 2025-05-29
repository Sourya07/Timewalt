"use client";

import axios from "axios";
import { useState } from "react";

export default function SignupSigninCard() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [isSignup, setIsSignup] = useState(true); // toggle for signup/signin

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = isSignup ? "/api/users/signup" : "/api/users/signin";
        const payload = isSignup
            ? formData
            : { email: formData.email, password: formData.password };

        try {
            const res = await axios.post(`http://localhost:3000${endpoint}`, payload);
            console.log(`${isSignup ? "Signup" : "Signin"} success:`, res.data);
        } catch (err: any) {
            console.error(`${isSignup ? "Signup" : "Signin"} failed:`, err.response?.data || err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat backdrop-blur-sm bg-[url('/your-bg.jpg')]">
            <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6 text-white">
                    {isSignup ? "Sign Up" : "Sign In"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="w-full p-3 rounded bg-white/60 placeholder-gray-700"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-3 rounded bg-white/60 placeholder-gray-700"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-3 rounded bg-white/60 placeholder-gray-700"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
                    >
                        {isSignup ? "Create Account" : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-center text-black">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => setIsSignup((prev) => !prev)}
                        className="underline hover:text-blue-200"
                    >
                        {isSignup ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
}