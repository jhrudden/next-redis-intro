import { Client, Entity, Schema } from "redis-om";
import { Todo, TodoForCreation } from "../types/todo";

const client = new Client();

async function connect() {
    if (!client.isOpen()) {
        await client.open(process.env.REDIS_URL);
    }
}

class TodoItem extends Entity {}

let schema = new Schema(
    TodoItem,
    {
        description: { type: "string" },
        isComplete: { type: "boolean" },
    },
    { dataStructure: "JSON" }
);

// creates a todo entity in redis db with input data
export async function createTodo(data: TodoForCreation) {
    await connect();
    const repository = client.fetchRepository(schema);
    const todo = repository.createEntity(data);
    const id = await repository.save(todo);
    return id;
}

export async function createIndex() {
    await connect();

    const repository = client.fetchRepository(schema);
    await repository.createIndex();
}

export async function getAllTodos(): Promise<Todo[]> {
    await connect();

    const repository = client.fetchRepository(schema);

    const todoItems = await repository.search().return.all();
    return todoItems.map((item) => {
        let recs = item.toJSON();
        item.entityId;
        return {
            id: recs["entityId"],
            isComplete: recs["isComplete"],
            description: recs["description"],
        };
    });
}
