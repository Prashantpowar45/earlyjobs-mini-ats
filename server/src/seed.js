import 'dotenv/config';import mongoose from 'mongoose';import {Candidate} from './model.js';
if(!process.env.MONGODB_URI){console.error('Missing MONGODB_URI');process.exit(1)}
await mongoose.connect(process.env.MONGODB_URI);
const names=['Aarav Sharma','Ananya Patel','Rohan Mehta','Priya Nair','Aditya Rao','Sneha Kulkarni','Kunal Verma','Isha Gupta','Rahul Singh','Meera Joshi','Neha Kapoor','Vikram Das'];
const roles=['Frontend Developer','Backend Developer','Full Stack Developer','UI/UX Designer','Data Analyst'];
const stages=['Applied','Screening','Interview','Offer','Hired','Rejected'];
let added=0;
for(let i=0;i<names.length;i++){
 const name=names[i];const email=name.toLowerCase().replace(' ','.')+'@example.com';
 const result=await Candidate.updateOne({email},{$setOnInsert:{name,email,phone:'',role:roles[i%roles.length],experience:i%6,skills:[['React','JavaScript'],['Node.js','MongoDB'],['Python','SQL']][i%3],source:['LinkedIn','Referral','Job Board'][i%3],stage:stages[i%stages.length],notes:'Demo candidate; fictional data.'}},{upsert:true});
 if(result.upsertedCount)added++;
}
console.log(`Seeded ${added} new candidates`);await mongoose.disconnect();