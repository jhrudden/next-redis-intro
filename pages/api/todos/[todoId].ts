import { NextApiRequest, NextApiResponse } from "next";
import { Todo } from "../../../types/todo";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // update todo
    const {
        method,
        query: { id },
        body,
    } = req;

    switch (method) {
        case "PUT":
            const updatedTodo: Partial<Todo> = body;
            console.log(`+ UPDATING TODO WITH ID ${id}`);
            console.log(`+ NEW TODO HAS FIELDS ${JSON.stringify(updatedTodo)}`);
            return res.status(200).send(true);
        case "DELETE":
            // Update or create data in your database
            console.log(`+ DELETING TODO WITH ID ${id}`);
            return res.status(200).send(true);
        default:
            res.setHeader("Allow", ["PUT", "DELETE"]);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}
