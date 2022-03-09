import { generateUUID } from "@silveredgold/beta-shared";
import { IPreferences } from "@silveredgold/beta-shared/preferences";
import { ICensorBackend } from "@silveredgold/beta-shared/transport";
import { DirectoryFile, DirectoryFileList } from "./types";
import { SimpleEventDispatcher } from "strongly-typed-events";
import { dataUrlToBlob, verifyPermission } from ".";
import { log } from "missionlog";

export class BatchCensorService {
    private _backend: ICensorBackend;

    /**
     *
     */
    constructor(backend: ICensorBackend) {
        this._backend = backend;

    }

    startCensoring = async (urls: URL[], preferences: IPreferences): Promise<Map<string, string>> => {
        const queue = new Map<string, string>();
        for (const url of urls) {
            const id = generateUUID();
            var req = {
                url: url.toString(),
                srcId: -1,
                id,
                force: false,
                preferences,
                requestData: {
                    type: 'normal'
                },
                context: {
                    domain: 'local'
                }
            };
            const name = url.pathname.split(/[\\/]/).pop()!;
            //TODO: this needs sanitization
            queue.set(id, name);
            await this._backend.censorImage(req);
        }
        return queue;
    }

    startCensoringFiles = async (files: DirectoryFileList[], preferences: IPreferences): Promise<Map<string, DirectoryFile>> => {
        const queue = new Map<string, DirectoryFile>();
        for (const file of files.flatMap(f => f.files)) {
            const id = generateUUID();
            const blob = file.file;
            const encoded = await new Promise<string>(callback => {
                const reader = new FileReader();
                reader.onload = function () { callback(this.result as string) };
                reader.readAsDataURL(blob);
            });
            var req = {
                url: encoded,
                srcId: -1,
                id,
                force: false,
                preferences,
                requestData: {
                    type: 'normal'
                },
                context: {
                    domain: 'local'
                }
            };
            queue.set(id, file);
            await this._backend.censorImage(req);
        }
        return queue;
    }

    private _onImageSaved = new SimpleEventDispatcher<{ id: string, path: string }>();

    public get onImageSaved() {
        return this._onImageSaved.asEvent();
    }

    saveCensored = async (
        results: { id: string, file: { handle: FileSystemFileHandle, url: string } }[],
        inputDir: FileSystemDirectoryHandle,
        subDir?: string,
        filePrefix: string = ''
    ) => {
        const outputDir = subDir ? await inputDir?.getDirectoryHandle(subDir, { create: true }) : inputDir;
        for (const current of results) {
            const id = current.id;
            const handle = current.file.handle;
            if (outputDir) {
                const perms = await verifyPermission(outputDir);
                if (perms) {
                    const filePath = ["."];
                    let fileOutDir = outputDir;
                    const resolved = await inputDir.resolve(handle);
                    if (resolved !== null && resolved.length > 1) {
                        var segments = resolved?.slice(0, -1)
                        for (let i = 0; i < segments.length; i++) {
                            const element = segments[i];
                            filePath.push(element);
                            fileOutDir = await fileOutDir.getDirectoryHandle(element, { create: true });
                        }
                    }
                    const fileName = filePrefix + handle.name;
                    const file = await fileOutDir.getFileHandle(fileName, { create: true });
                    if (file) {
                        console.log('got file handle for output', file);
                        const stream = await file.createWritable({ keepExistingData: false })
                        const blob = await dataUrlToBlob(current.file.url);
                        stream?.write(blob);
                        stream?.close();
                        this._onImageSaved.dispatch({ id, path: filePath.concat([fileName]).join('/') })
                    }
                }
            }
        }
    }
}