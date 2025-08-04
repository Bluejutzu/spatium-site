import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isPromise<T>(value: any): value is Promise<T> {
	return value && typeof value.then === 'function';
}
