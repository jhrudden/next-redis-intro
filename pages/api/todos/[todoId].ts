import { NextApiRequest, NextApiResponse } from "next";
import { updateTodo } from "../../../lib/redis";
import { Todo } from "../../../types/todo";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // update todo
    const {
        method,
        query: { todoId },
        body,
    } = req;

    switch (method) {
        case "PUT":
            const updatedTodo: Partial<Todo> = body;
            console.log(
                `+ UPDATING TODO WITH ID ${todoId} WITH FIELDS ${JSON.stringify(
                    updatedTodo
                )}`
            );
            await updateTodo(todoId as string, updatedTodo);
            return res.status(200).send(true);
        case "DELETE":
            // Update or create data in your database
            console.log(`+ DELETING TODO WITH ID ${todoId}`);
            return res.status(200).send(true);
        default:
            res.setHeader("Allow", ["PUT", "DELETE"]);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}
