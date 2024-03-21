import { z } from 'zod'



export const signUpSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string(),
    cPass: z.string()

}).required()


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})
