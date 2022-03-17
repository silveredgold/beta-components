import { generateUUID } from "@silveredgold/beta-shared";
import { IPreferences } from "@silveredgold/beta-shared/preferences";
import { ICensorBackend, ImageCensorRequest, ImageCensorResponse } from "@silveredgold/beta-shared/transport";
import { DirectoryFile, DirectoryFileList } from "./types";
import { SimpleEventDispatcher } from "@silveredgold/ste-simple-events";
import { dataUrlToBlob, verifyPermission } from "./util";
import { log } from "missionlog";

export class BatchCensorService {
    private _backend: ICensorBackend;
    private _queue: Map<string, DirectoryFile> | undefined;

    /**
     *
     */
    constructor(backend: ICensorBackend, requestQueue?: Map<string, DirectoryFile>) {
        this._backend = backend;
        this._queue = requestQueue;
    }

    startCensoring = async (urls: URL[], preferences: IPreferences, requestQueue?: Map<string, string>): Promise<Map<string, string>> => {
        const queue = new Map<string, string>();
        const requests: {request: ImageCensorRequest, file: string}[] = [];
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
                    domain: 'remote'
                }
            };
            //TODO: this needs sanitization
            const name = url.pathname.split(/[\\/]/).pop()!;
            requests.push({request: req, file: name})
        }
        for (const censor of requests) {
            queue.set(censor.request.id, censor.file);
            await this._backend.censorImage(censor.request);
            if (requestQueue !== undefined) {
                requestQueue.set(censor.request.id, censor.file);
            }
        }
        return queue;
    }

    /**
     * 
     * @param files The files to be censored
     * @param preferences The preferences to use when censoring
     * @param slowMode (deprecated!) Forces service to issue backend requests one-by-one.
     * @returns The request queue 
     */
    startCensoringFiles = async (files: DirectoryFileList[], preferences: IPreferences, slowMode: boolean = false): Promise<Map<string, DirectoryFile>> => {
        const queue = new Map<string, DirectoryFile>();
        const requests: {request: ImageCensorRequest, file: DirectoryFile}[] = [];
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
            requests.push({request: req, file: file})
        }
        if (slowMode) {
            for (const censor of requests) {
                queue.set(censor.request.id, censor.file);
                if (this._queue !== undefined) {
                    this._queue.set(censor.request.id, censor.file);
                }
                await new Promise<ImageCensorResponse|undefined>(async resolve => {
                    const unsub = this._backend.onImageCensored.sub((sender, event) => {
                        if (event.id == censor.request.id) {
                            unsub();
                            resolve(event);
                        }
                    });
                    this._backend.censorImage(censor.request);
                });
            }
        } else {
            for (const censor of requests) {
                queue.set(censor.request.id, censor.file);
                await this._backend.censorImage(censor.request);
                if (this._queue !== undefined) {
                    this._queue.set(censor.request.id, censor.file);
                }
            }
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