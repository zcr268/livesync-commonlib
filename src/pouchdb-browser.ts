import PouchDB from 'pouchdb-core';

import IDBPouch from 'pouchdb-adapter-idb';
import HttpPouch from 'pouchdb-adapter-http';
import mapreduce from 'pouchdb-mapreduce';
import replication from 'pouchdb-replication';

import find from "pouchdb-find";
import transform from "transform-pouch";

PouchDB.plugin(IDBPouch)
    .plugin(HttpPouch)
    .plugin(mapreduce)
    .plugin(replication)
    .plugin(find)
    .plugin(transform)

export { PouchDB };