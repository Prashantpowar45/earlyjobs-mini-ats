import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Candidate } from './model.js';
import { candidateSchema,stageSchema,stages } from './validation.js';

const app=express();
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_ORIGIN?.split(',')||'http://localhost:5173'}));
app.use(express.json({limit:'100kb'}));
let connectionPromise;
app.get('/api/health',(_req,res)=>res.json({status:'ok'}));
app.use('/api',async(req,res,next)=>{
 if(!process.env.MONGODB_URI)return res.status(503).json({error:'MONGODB_URI not configured'});
 if(mongoose.connection.readyState===1)return next();
 try{connectionPromise??=mongoose.connect(process.env.MONGODB_URI).catch(e=>{connectionPromise=undefined;throw e});await connectionPromise;next()}
 catch(e){console.error('MongoDB connection failed',e.message);res.status(503).json({error:'Database unavailable'})}
});
app.use('/api',rateLimit({windowMs:15*60*1000,limit:300,standardHeaders:'draft-7',legacyHeaders:false}));
const safe=(handler)=>(req,res,next)=>Promise.resolve(handler(req,res,next)).catch(next);
const idOk=id=>mongoose.isValidObjectId(id);
app.get('/api/candidates',safe(async(req,res)=>{
 const {search='',stage='',page='1',limit='10',sort='newest'}=req.query;
 const filter={};
 if(stage&&stages.includes(stage))filter.stage=stage;
 else if(stage)return res.status(400).json({error:'Invalid stage'});
 if(typeof search!=='string')return res.status(400).json({error:'Invalid search'});
 if(search.trim()){const escaped=search.trim().slice(0,100).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');filter.$or=[{name:{$regex:escaped,$options:'i'}},{email:{$regex:escaped,$options:'i'}},{role:{$regex:escaped,$options:'i'}},{skills:{$regex:escaped,$options:'i'}}];}
 const validInteger=v=>/^\d+$/.test(String(v));
 if(!validInteger(page)||!validInteger(limit))return res.status(400).json({error:'Invalid pagination parameters'});
 const p=Math.max(1,Math.min(10000,Number(page)));const l=Math.max(1,Math.min(100,Number(limit)));
 if(!['newest','oldest','name'].includes(sort))return res.status(400).json({error:'Invalid sort order'});
 const order=sort==='oldest'?{createdAt:1}:sort==='name'?{name:1}:{createdAt:-1};
 const [items,total]=await Promise.all([Candidate.find(filter).sort(order).skip((p-1)*l).limit(l).lean(),Candidate.countDocuments(filter)]);
 res.json({items,total,page:p,pages:Math.max(1,Math.ceil(total/l))});
}));
app.get('/api/metrics',safe(async(_req,res)=>{
 const [grouped,total,recent]=await Promise.all([Candidate.aggregate([{$group:{_id:'$stage',count:{$sum:1}}}]),Candidate.countDocuments(),Candidate.find().sort({createdAt:-1}).limit(5).select('name role stage createdAt').lean()]);
 const counts=Object.fromEntries(stages.map(s=>[s,0]));grouped.forEach(v=>{if(Object.hasOwn(counts,v._id))counts[v._id]=v.count});
 res.json({total,counts,active:total-counts.Hired-counts.Rejected,hiringRate:total?Math.round(counts.Hired/total*100):0,recent});
}));
app.post('/api/candidates',safe(async(req,res)=>{
 const parsed=candidateSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Invalid candidate data',details:parsed.error.flatten()});
 const candidate=await Candidate.create(parsed.data);res.status(201).json(candidate);
}));
app.put('/api/candidates/:id',safe(async(req,res)=>{
 if(!idOk(req.params.id))return res.status(400).json({error:'Invalid id'});
 const parsed=candidateSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Invalid candidate data',details:parsed.error.flatten()});
 const result=await Candidate.findByIdAndUpdate(req.params.id,parsed.data,{new:true,runValidators:true});if(!result)return res.status(404).json({error:'Candidate not found'});res.json(result);
}));
app.patch('/api/candidates/:id/stage',safe(async(req,res)=>{
 if(!idOk(req.params.id))return res.status(400).json({error:'Invalid id'});
 const parsed=stageSchema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Invalid stage'});
 const result=await Candidate.findByIdAndUpdate(req.params.id,{$set:parsed.data},{new:true,runValidators:true});if(!result)return res.status(404).json({error:'Candidate not found'});res.json(result);
}));
app.delete('/api/candidates/:id',safe(async(req,res)=>{
 if(!idOk(req.params.id))return res.status(400).json({error:'Invalid id'});
 const result=await Candidate.findByIdAndDelete(req.params.id);if(!result)return res.status(404).json({error:'Candidate not found'});res.status(204).send();
}));
app.use((err,_req,res,_next)=>{
 if(err.code===11000)return res.status(409).json({error:'A candidate with this email already exists'});
 console.error(err);res.status(500).json({error:'Internal server error'});
});
export default app;
const port=Number(process.env.PORT)||5000;
if(!process.env.VERCEL){
 if(!process.env.MONGODB_URI){console.error('Set MONGODB_URI in server/.env');process.exit(1)}
 mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(port,()=>console.log('ATS API listening on '+port))).catch(err=>{console.error('MongoDB connection failed:',err.message);process.exit(1)});
}