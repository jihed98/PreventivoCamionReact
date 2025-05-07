import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  progressPercentage: number;
  prefix?: string;
  suffix?: string;
}

export function StatCard({ title, value, icon, progressPercentage, prefix, suffix }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {prefix && <span>{prefix}</span>}
            {value}
            {suffix && <span>{suffix}</span>}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <div className="bg-gray-100 dark:bg-gray-700 h-1 rounded-full">
          <div 
            className="bg-blue-500 h-1 rounded-full" 
            style={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
