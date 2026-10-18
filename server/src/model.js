import mongoose from 'mongoose';
const schema = new mongoose.Schema({
 name: {type:String,required:true,trim:true,maxlength:100},
 email: {type:String,required:true,lowercase:true,trim:true,unique:true},
 phone: {type:String,default:'',trim:true},
 role: {type:String,required:true,trim:true,maxlength:100},
 experience: {type:Number,default:0,min:0,max:50},
 skills: {type:[String],default:[]},
 source: {type:String,enum:['LinkedIn','Referral','Careers Page','Job Board','Other'],default:'Other'},
 stage: {type:String,enum:['Applied','Screening','Interview','Offer','Hired','Rejected'],default:'Applied'},
 notes: {type:String,default:'',maxlength:2000},
 appliedAt: {type:Date,default:Date.now}
},{timestamps:true});
schema.index({name:'text',email:'text',role:'text',skills:'text'});
export const Candidate = mongoose.model('Candidate',schema);