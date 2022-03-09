import type { LoadedFileHandle } from "./fs-client";

export type DirectoryFile = LoadedFileHandle & {relPath: string};
export type DirectoryFileList = { name: string, files: DirectoryFile[] }