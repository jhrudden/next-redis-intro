import { NextApiRequest, NextApiResponse } from "next";
import { Todo, TodoForCreation } from "../../types/todo";

const DUMMY_TODOS: Todo[] = [
    { id: 1, description: "this is a todo", isComplete: false },
    { id: 2, description: "this is another todo", isComplete: true },
];

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Todo[] | Todo>
) {
    const { method, body } = req;
    switch (method) {
        case "GET":
            return res.status(200).json(DUMMY_TODOS);
        case "POST":
            // Update or create data in your database
            const newTodo: TodoForCreation = body;
            console.log(
                `+ CREATING TODO WITH FIELDS ${JSON.stringify(newTodo)}`
            );
            return res.status(200).json({ id: 3, ...newTodo });
        default:
            res.setHeader("Allow", ["PUT", "DELETE"]);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}
