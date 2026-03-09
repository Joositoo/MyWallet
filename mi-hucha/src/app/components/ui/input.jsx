import * as React from "react";
import { cn } from "./utils";

function Input({ className, type = "text", placeholder, ...props }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={cn(
                "w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        />
    );
}

export { Input };