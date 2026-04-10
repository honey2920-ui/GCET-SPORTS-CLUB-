import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFaceEmoji = (str: string) => {
  if (!str) return '😎';
  const faces = ['😎', '🤠', '🤓', '🧐', '🦸', '🦹', '🧙', '🧑‍🚀', '👨‍🎤', '🕵️', '👩‍💻', '👨‍💻', '🧑‍🎓', '👨‍🏫', '🦁', '🦊', '🐯'];
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return faces[hash % faces.length];
};
