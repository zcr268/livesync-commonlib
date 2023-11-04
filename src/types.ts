const symbolFilePath = Symbol();
const symbolFilePathWithPrefix = Symbol();
const symbolId = Symbol();
export type FilePath = string & { [symbolFilePath]: never };
export type FilePathWithPrefix = string & { [symbolFilePathWithPrefix]: never } | FilePath;
export type DocumentID = string & { [symbolId]: never };


// docs should be encoded as base64, so 1 char -> 1 bytes
// and cloudant limitation is 1MB , we use 900kb;

export const MAX_DOC_SIZE = 1000; // for .md file, but if delimiters exists. use that before.
export const MAX_DOC_SIZE_BIN = 102400; // 100kb
export const VER = 10;

export const RECENT_MOFIDIED_DOCS_QTY = 30;
export const LEAF_WAIT_TIMEOUT = 90000; // in synchronization, waiting missing leaf time out.
export const REPLICATION_BUSY_TIMEOUT = 3000000;
export const LOG_LEVEL = {
    DEBUG: -1,
    VERBOSE: 1,
    INFO: 10,
    NOTICE: 100,
    URGENT: 1000,
} as const;
export type LOG_LEVEL = typeof LOG_LEVEL[keyof typeof LOG_LEVEL];
export const VERSIONINFO_DOCID = "obsydian_livesync_version" as DocumentID;
export const MILSTONE_DOCID = "_local/obsydian_livesync_milestone" as DocumentID;
export const NODEINFO_DOCID = "_local/obsydian_livesync_nodeinfo" as DocumentID;

export type HashAlgorithm = "" | "xxhash32" | "xxhash64";

export type ConfigPassphraseStore = "" /* default */ | "LOCALSTORAGE" | "ASK_AT_LAUNCH";
export type CouchDBConnection = {
    couchDB_URI: string,
    couchDB_USER: string,
    couchDB_PASSWORD: string,
    couchDB_DBNAME: string,
}


export type RemoteDBSettings = CouchDBConnection & {
    versionUpFlash: string;
    minimumChunkSize: number;
    longLineThreshold: number;
    encrypt: boolean;
    passphrase: string;
    usePathObfuscation: boolean;
    checkIntegrityOnSave: boolean;
    batch_size: number;
    batches_limit: number;
    useHistory: boolean;
    disableRequestURI: boolean;
    checkConflictOnlyOnOpen: boolean;
    additionalSuffixOfDatabaseName: string | null;
    ignoreVersionCheck: boolean;
    deleteMetadataOfDeletedFiles: boolean;
    syncOnlyRegEx: string;
    syncIgnoreRegEx: string;
    customChunkSize: number;
    readChunksOnline: boolean;
    automaticallyDeleteMetadataOfDeletedFiles: number;
    useDynamicIterationCount: boolean;
    useTimeouts: boolean;

    hashCacheMaxCount: number,
    hashCacheMaxAmount: number,
    concurrencyOfReadChunksOnline: number,
    minimumIntervalOfReadChunksOnline: number,

    doNotPaceReplication: boolean,

    hashAlg: HashAlgorithm;
    // This could not be configured from Obsidian.
    permitEmptyPassphrase: boolean;
}



export interface DatabaseEntry {
    _id: DocumentID;
    _rev?: string;
    _deleted?: boolean;
    _conflicts?: string[];
}

export type Entry = DatabaseEntry & {
    ctime: number;
    mtime: number;
    size: number;
    deleted?: boolean;
}
export type NoteEntry = Entry & {
    path: FilePathWithPrefix;
    data: string | string[];
    type: "notes";
}

export type NewEntry = Entry & {
    path: FilePathWithPrefix;
    children: string[];
    type: "newnote";
}
export type PlainEntry = Entry & {
    path: FilePathWithPrefix;
    children: string[];
    type: "plain";
}

export type InternalFileEntry = NewEntry & {
    deleted?: boolean;
    // type: "newnote";
}

export type AnyEntry = NoteEntry | NewEntry | PlainEntry | InternalFileEntry;

export type LoadedEntry = AnyEntry & {
    data: string | string[];
    datatype: "plain" | "newnote";
};

export type EntryLeaf = DatabaseEntry & {
    type: "leaf";
    data: string;
    isCorrupted?: boolean;
}

export interface EntryVersionInfo extends DatabaseEntry {
    type: "versioninfo";
    version: number;
}
export interface EntryHasPath {
    path: FilePathWithPrefix | FilePath;
}
export interface ChunkVersionRange {
    min: number, //lower compatible chunk format version
    max: number, //maximum compatible chunk format version.
    current: number,//current chunk version.
}

export interface EntryMilestoneInfo extends DatabaseEntry {
    _id: typeof MILSTONE_DOCID;
    type: "milestoneinfo";
    created: number;
    accepted_nodes: string[];
    locked: boolean;
    cleaned?: boolean;
    node_chunk_info: { [key: string]: ChunkVersionRange }
}

export interface EntryNodeInfo extends DatabaseEntry {
    _id: typeof NODEINFO_DOCID;
    type: "nodeinfo";
    nodeid: string;
    v20220607?: boolean;
}

export type EntryBody = NoteEntry | NewEntry | PlainEntry | InternalFileEntry;

export type EntryDoc = EntryBody | LoadedEntry | EntryLeaf | EntryVersionInfo | EntryMilestoneInfo | EntryNodeInfo;

export type diff_result_leaf = {
    rev: string;
    data: string;
    ctime: number;
    mtime: number;
    deleted?: boolean;
};
export type dmp_result = Array<[number, string]>;

export type diff_result = {
    left: diff_result_leaf;
    right: diff_result_leaf;
    diff: dmp_result;
};
export type diff_check_result = boolean | diff_result;

export type Credential = {
    username: string;
    password: string;
};

export type EntryDocResponse = EntryDoc & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta;

export type DatabaseConnectingStatus = "STARTED" | "NOT_CONNECTED" | "PAUSED" | "CONNECTED" | "COMPLETED" | "CLOSED" | "ERRORED";

export const PREFIXMD_LOGFILE = "LIVESYNC_LOG_";
export const FLAGMD_REDFLAG = "redflag.md" as FilePath;
export const FLAGMD_REDFLAG2 = "redflag2.md" as FilePath;
export const FLAGMD_REDFLAG3 = "redflag3.md" as FilePath;
export const SYNCINFO_ID = "syncinfo" as DocumentID;

export interface SyncInfo extends DatabaseEntry {
    _id: typeof SYNCINFO_ID;
    type: "syncinfo";
    data: string;
}

export const SALT_OF_PASSPHRASE = "rHGMPtr6oWw7VSa3W3wpa8fT8U";

export const PREFIX_OBFUSCATED = "f:";
export const PREFIX_CHUNK = "h:";
export const PREFIX_ENCRYPTED_CHUNK = "h:+";
