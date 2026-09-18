declare module 'tinode-sdk' {
  export class Tinode {
    constructor(config: { host:string; secure:boolean; apiKey:string; appName:string; platform?:string; transport?:'ws'|'lp'; persist?:boolean })
    connect(host?:string): Promise<unknown>
    disconnect(): void
    login(scheme:string, secret:string): Promise<unknown>
    publish(topicName:string, content:string, noEcho?:boolean): Promise<{ params?:{ seq?:number }; ts?:Date|string }>
    getCurrentUserID(): string | null
    getServerInfo(): { version?: string } | null
    getTopic(name:string): TinodeTopic
  }
  export interface TinodeMessage { seq?:number; from?:string; ts?:Date|string; content?:string|{txt?:string} }
  export interface TinodeTopic {
    onData?: (message:TinodeMessage)=>void
    subscribe(get?:unknown, set?:unknown): Promise<unknown>
    publish(content:string, noEcho?:boolean): Promise<{ params?:{ seq?:number } }>
    messages(callback:(message:TinodeMessage)=>void): void
  }
  export default {
    Tinode: typeof Tinode
  }
}
