"use client";
import { useTheme } from "next-themes";
import React from "react";
import { IoMoonSharp, IoSunnySharp } from "react-icons/io5";

export default function DarkLightToggle() {
    const { setTheme } = useTheme();
    return (
        <div className="flex gap-4 text-2xl items-center">
            <button onClick={() => setTheme("dark")} className="text-gray-800 dark:text-white">
                <IoMoonSharp />
            </button>
            <button onClick={() => setTheme("light")} className="text-gray-800 dark:text-yellow-400">
                <IoSunnySharp />
            </button>
        </div>
    );
}