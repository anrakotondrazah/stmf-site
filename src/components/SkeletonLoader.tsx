"use client";

import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "title" | "card" | "avatar" | "button" | "image";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseStyles = "skeleton";

  const variantStyles: Record<string, string> = {
    text: "h-4 rounded",
    title: "h-8 w-3/5 rounded",
    card: "h-48 rounded-2xl",
    avatar: "w-12 h-12 rounded-full",
    button: "h-12 w-32 rounded-xl",
    image: "aspect-video rounded-xl",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  if (lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseStyles, variantStyles[variant])}
            style={{
              ...style,
              width: i === lines - 1 ? "75%" : style.width,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
  hasImage?: boolean;
  hasAvatar?: boolean;
  lines?: number;
}

export function SkeletonCard({
  className,
  hasImage = true,
  hasAvatar = false,
  lines = 3,
}: SkeletonCardProps) {
  return (
    <div className={cn("glass-card rounded-2xl p-6 space-y-4", className)}>
      {hasImage && <Skeleton variant="image" />}
      {hasAvatar && (
        <div className="flex items-center gap-3">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" />
            <Skeleton width="25%" />
          </div>
        </div>
      )}
      <Skeleton variant="title" />
      <Skeleton lines={lines} />
      <Skeleton variant="button" />
    </div>
  );
}

interface SkeletonHeroProps {
  className?: string;
}

export function SkeletonHero({ className }: SkeletonHeroProps) {
  return (
    <div className={cn("min-h-screen flex items-center", className)}>
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <Skeleton width="30%" height={16} />
          <Skeleton variant="title" height={64} width="90%" />
          <Skeleton variant="title" height={64} width="70%" />
          <Skeleton lines={2} className="mt-4" />
          <div className="flex gap-4 mt-8">
            <Skeleton variant="button" width={180} />
            <Skeleton variant="button" width={150} />
          </div>
        </div>
        <div className="relative">
          <div className="skeleton aspect-square rounded-full opacity-50" />
        </div>
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  className?: string;
  count?: number;
  columns?: 2 | 3 | 4;
}

export function SkeletonGrid({
  className,
  count = 6,
  columns = 3,
}: SkeletonGridProps) {
  const colsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", colsClass[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
