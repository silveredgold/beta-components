import { DirectoryFilePayload } from "./fs-client";
import { DirectoryFile, DirectoryFileList } from "./types";


export const toFileList = async (result: DirectoryFilePayload) => {
    const results: DirectoryFileList[] = [];
    for (const key of Object.keys(result.files)) {
        const pathResults: DirectoryFile[] = [];
        for (const res of result.files[key]) {
            var path = (await result.dir.resolve(res.handle))!.join('/');
            pathResults.push({
                ...res,
                relPath: path
            });
        }
        results.push({
            name: key,
            files: pathResults
        });
    }
    return results;
}

export const verifyPermission = async (dirHandle: FileSystemHandleUnion, readOnly: boolean = false) => {
    const options: FileSystemHandlePermissionDescriptor = { mode: 'readwrite' };
    if (readOnly) {
        options.mode = 'read';
    }
    // Check if permission was already granted. If so, return true.
    if ((await dirHandle.queryPermission(options)) === 'granted') {
        return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await dirHandle.requestPermission(options)) === 'granted') {
        return true;
    }
    // The user didn't grant permission, so return false.
    return false;
}

export const dataUrlToBlob = (base64: string) =>
    fetch(`${base64}`).then(res => res.blob())