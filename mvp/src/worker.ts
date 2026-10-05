import {generate} from './engine';
import type {Input} from './model';
self.onmessage=(event:MessageEvent<Input>)=>{try{const start=performance.now();const assignments=generate(event.data);self.postMessage({assignments,elapsedMs:performance.now()-start})}catch(e){self.postMessage({error:e instanceof Error?e.message:String(e)})}};
