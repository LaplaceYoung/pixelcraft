import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { clsx } from 'clsx';

interface UploadAreaProps {
    onUpload: (img: HTMLImageElement) => void;
    t: any; // Translation object
    className?: string; // Additional classes for the container
    children?: React.ReactNode; // Optional content override
    disableClick?: boolean; // If true, disables the file input (click to upload) but keeps drag & drop
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onUpload, t, className, children, disableClick }) => {
    const [isDragging, setIsDragging] = useState(false);

    const processFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => onUpload(img);
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, [onUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    }, [isDragging]);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Only set to false if we're leaving the container entirely
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, [processFile]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    }, [processFile]);

    return (
        <div
            className={clsx(
                "relative group transition-all duration-200",
                !disableClick && "cursor-pointer",
                className
            )}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {!disableClick && (
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
            )}

            {/* Visual Feedback Overlay for Dragging */}
            {isDragging && (
                <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 z-50 pointer-events-none flex items-center justify-center backdrop-blur-sm rounded-lg">
                    <Upload size={48} className="text-blue-600 animate-bounce" />
                    <p className="absolute mt-16 font-bold text-blue-600 bg-white/80 px-2 py-1 rounded">{t.dropHere}</p>
                </div>
            )}

            {children || (
                <div className={clsx(
                    "border-2 border-dashed p-8 flex flex-col items-center justify-center gap-2 transition-all duration-200",
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400 bg-gray-50 group-hover:bg-blue-50 group-hover:border-blue-500 group-hover:shadow-inner"
                )}>
                    <Upload size={32} className={clsx(
                        "transition-transform",
                        isDragging ? "text-blue-600 scale-110" : "text-gray-400 group-hover:text-blue-500 group-hover:scale-110"
                    )} />
                    <span className="text-xs text-center text-gray-500 font-mono">
                        {isDragging ? t.dropHere : t.dragDrop}
                    </span>
                </div>
            )}
        </div>
    );
};
