import * as z from "zod";
import {WithId} from 'mongodb'
import {db} from "../../db"
import { string } from "joi";

export const Todo = z.object({
    title:z.string().min(1),
    description:z.string().min(1),
    dueDate:z.string().min(1),
    status:z.boolean()
})

export type Todo = z.infer<typeof Todo>
export type TodoWithId = WithId<Todo>  
export const Todos = db.collection<Todo>('todos');
