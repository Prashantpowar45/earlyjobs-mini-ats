import { z } from 'zod';
export const stages = ['Applied','Screening','Interview','Offer','Hired','Rejected'];
export const candidateSchema = z.object({
 name:z.string().trim().min(2).max(100),
 email:z.string().trim().email().max(254).transform(x=>x.toLowerCase()),
 phone:z.string().trim().max(30).optional().default(''),
 role:z.string().trim().min(2).max(100),
 experience:z.coerce.number().min(0).max(50).default(0),
 skills:z.array(z.string().trim().min(1).max(50)).max(25).default([]),
 source:z.enum(['LinkedIn','Referral','Careers Page','Job Board','Other']).default('Other'),
 stage:z.enum(stages).default('Applied'),
 notes:z.string().max(2000).default('')
});
export const stageSchema=z.object({stage:z.enum(stages)});