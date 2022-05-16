/// <reference types="wicg-file-system-access"/>

export type DirectoryFilePayload = {dir: FileSystemDirectoryHandle, files: {[key: string]: LoadedFileHandle[]}};

export class FileSystemClient {

    openDir = async () => {
        const dirHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker();
        return dirHandle;
    }

    getFile = async (types: FilePickerAcceptType[]): Promise<LoadedFileHandle> => {
        const [fileHandle] = await window.showOpenFilePicker({types});
        const file = await fileHandle.getFile();
        return {
            file,
            handle: fileHandle
        };
    }

    getFiles = async (filter?: (file: File) => boolean): Promise<{dir: string, files: LoadedFileHandle[]}> => {
        const dirHandle = await window.showDirectoryPicker();
        const promises: Promise<{handle: FileSystemFileHandle, file: File}>[] = [];
        for await (const entry of dirHandle.values()) {
            if (entry.kind !== 'file') {
                break;
            }
            promises.push(entry.getFile().then((file) => {return {handle: entry, file}}));
        }
        const result = await Promise.all(promises);
        const results = result.filter(r => filter ? filter(r.file) : true);
        return {dir: dirHandle.name, files: results};
    }

    getDirectoriesandFiles = async (filter?: (file: File) => boolean, rootDirKeyName?: string): Promise<DirectoryFilePayload> => {
        const dirHandle = await window.showDirectoryPicker();
        const getAllHandles = await this.listAllFilesAndDirs(dirHandle);
        const obj: {[key: string]: LoadedFileHandle[]} = {}
        const rootKey = rootDirKeyName ?? dirHandle.name;
        console.log('allHandles', getAllHandles.filter(f => f.kind == "file").map(f => { return {name: f.name, parent: f.parent?.name}}));
        for (const handle of getAllHandles) {
            if (handle.kind == "file" && handle.parent.name == dirHandle.name) {
                if ((await handle.parent.isSameEntry(dirHandle))) {
                    const fileHandle = handle.handle as FileSystemFileHandle;
                    const file = await fileHandle.getFile();
                    if (obj[rootKey] === undefined) {
                        obj[rootKey] = [];
                    }
                    if (!filter || filter(file)) {
                        obj[rootKey].push({handle: fileHandle, file });
                    }
                }
            }
            if (handle.kind == "directory") {
                const childRefs = getAllHandles.filter(f => f.kind == "file" && f.parent.name === handle.name);
                const childHandles = childRefs.map(r => r.handle as FileSystemFileHandle);
                if (childHandles.length == 0) {
                    continue;
                }
                const promises: Promise<LoadedFileHandle>[] = [];
                for await (const entry of childHandles) {
                    if (entry.kind !== 'file') {
                        continue;
                    }
                    promises.push(entry.getFile().then((file) => {return {handle: entry, file}}));
                }
                const result = await Promise.all(promises);
                const keyName = await this.getParentPath(dirHandle, handle.handle as FileSystemDirectoryHandle);
                obj[rootKey + "/" + keyName] = result.filter(r => filter ? filter(r.file) : true);
            }
        }
        return {dir: dirHandle, files: obj};
    }

    getParentPath = async (rootHandle: FileSystemDirectoryHandle, current: FileSystemDirectoryHandle) => {
        const segments = await rootHandle.resolve(current);
        if (segments && segments.length > 0) {
            return segments.join('/');
        }
        return current.name;
    }

    listAllFilesAndDirs = async (dirHandle: FileSystemDirectoryHandle) => {
        const files: {name: string, handle: FileSystemHandle, kind: "directory"|"file", parent: FileSystemDirectoryHandle}[] = [];
        for await (const [name, handle] of dirHandle) {
            const {kind} = handle;
            if (handle.kind === 'directory') {
                files.push({name, handle, kind, parent: dirHandle});
                files.push(...await this.listAllFilesAndDirs(handle));
            } else {
                files.push({name, handle, kind, parent: dirHandle});
            }
        }
        return files;
    }

    
    
    public get imageTypes(): FilePickerAcceptType[] {
        return [{
            description: 'Images',
            accept: {
                'image/*': ['.png', '.jpeg', '.jpg', '.jfif']
            }
        }];
    }

    public get textFiles(): FilePickerAcceptType[] {
        return [{
            description: 'Text Files',
            accept: {
                'text/plain': ['.txt']
            }
        }];
    }

    public get jsonFiles(): FilePickerAcceptType[] {
        return [{
            description: 'JSON Files',
            accept: {
                'text/json': ['.json']
            }
        }];
    }

    public saveTextFile = async (content: string, types?: FilePickerAcceptType[]) => {
        types = types ?? this.textFiles;
        const handle = await window.showSaveFilePicker({ types });
        const writable = await handle.createWritable();
        // Write the contents of the file to the stream.
        await writable.write(content);
        // Close the file and write the contents to disk.
        await writable.close();
    }
    
}

export type LoadedFileHandle = {
    handle: FileSystemFileHandle;
    file: File;
}