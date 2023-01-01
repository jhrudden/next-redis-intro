import { NextApiRequest, NextApiResponse } from "next";
import { createTodo, getAllTodos } from "../../lib/redis";
import { Todo, TodoForCreation } from "../../types/todo";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Todo[] | Todo>
) {
    const { method } = req;
    switch (method) {
        case "GET":
            const todos = await getAllTodos();
            return res.status(200).json(todos);
        case "POST":
            // Update or create data in your database
            const newTodo: TodoForCreation = req.body;
            const newTodoId = await createTodo(newTodo);
            console.log(
                `+ CREATING TODO WITH ID ${newTodoId} FIELDS ${JSON.stringify(
                    newTodo
                )}`
            );
            return res.status(200).json({ id: newTodoId, ...newTodo });
        default:
            res.setHeader("Allow", ["PUT", "DELETE"]);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}
