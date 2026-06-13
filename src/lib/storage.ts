import { get, set } from 'idb-keyval';

export interface RecentFile {
  id: string;
  name: string;
  date: number;
  file: File;
}

export async function saveRecentFile(file: File): Promise<string> {
  const recentFiles: RecentFile[] = (await get('recent-files')) || [];
  
  // Create a new ID or use existing one if file name matches to avoid duplicates
  const existingIndex = recentFiles.findIndex(f => f.name === file.name);
  const id = existingIndex !== -1 ? recentFiles[existingIndex].id : crypto.randomUUID();
  
  const newFile: RecentFile = { id, name: file.name, date: Date.now(), file };
  
  const otherFiles = recentFiles.filter(f => f.name !== file.name);
  const updatedFiles = [newFile, ...otherFiles].slice(0, 10); // Keep last 10
  
  await set('recent-files', updatedFiles);
  return id;
}

export async function getRecentFiles(): Promise<RecentFile[]> {
  return (await get('recent-files')) || [];
}

export async function getFileById(id: string): Promise<File | null> {
  const files = await getRecentFiles();
  const fileRecord = files.find(f => f.id === id);
  return fileRecord ? fileRecord.file : null;
}
