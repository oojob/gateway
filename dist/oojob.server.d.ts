/// <reference types="node" />
import { Server } from 'http';
import { Application } from 'express';
export declare const startSyncServer: (port: string) => Promise<void>, stopServer: () => Promise<void>, server: Server, app: Application;
