"use client";

import Link from "next/link";
import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import DarkLightToggle from "@/components/darkmode";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow-md relative">
            {/* Logo */}
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                <Link href="/">MyApp</Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
                <Link
                    href="/about"
                    className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    About
                </Link>
                <Link
                    href="/services"
                    className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    Services
                </Link>
                <Link
                    href="/header/signin"
                    className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    Signin
                </Link>
                <DarkLightToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
                <DarkLightToggle />
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-3xl text-gray-700 dark:text-white"
                >
                    {isMenuOpen ? <IoClose /> : <IoMenu />}
                </button>
            </div>

            {/* Sliding Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 flex flex-col items-start px-6 py-4 shadow-md md:hidden z-50">
                    <Link
                        href="/about"
                        className="w-full py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About
                    </Link>
                    <Link
                        href="/services"
                        className="w-full py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Services
                    </Link>
                    <Link
                        href="/header/signin"
                        className="w-full py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Signin
                    </Link>
                </div>
            )}
        </nav>
    );
}