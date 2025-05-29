
"use client";
import { useTheme } from "next-themes";
import React from "react";
import { IoMoonSharp, IoSunnySharp } from "react-icons/io5";

export default function DarkLightToggle() {
    const { setTheme } = useTheme();
    return (
        <div className="flex gap-10 text-4xl mt-10">
            <button onClick={() => setTheme("dark")}><IoMoonSharp /></button>
            <button onClick={() => setTheme("light")}><IoSunnySharp /></button>
        </div>
    );
}