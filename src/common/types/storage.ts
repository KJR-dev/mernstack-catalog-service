export interface FileData {
    fileName: string;
    fileData: Buffer;
}

export interface FileStorage {
    upload(data: FileData): Promise<void>;
    delete(fileName: string): void;
    getObjectUrl(fileName: string): string;
}
