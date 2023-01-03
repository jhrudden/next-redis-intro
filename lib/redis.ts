import { Client, Entity, Schema } from "redis-om";
import { Todo, TodoForCreation } from "../types/todo";

const client = new Client();

// create a connection to redis db
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

async function todoInit() {
    await connect();
    return client.fetchRepository(schema);
}

// creates a todo entity in redis db with input data
export async function createTodo(data: TodoForCreation) {
    const todoRepository = await todoInit();
    const todo = todoRepository.createEntity(data);
    const id = await todoRepository.save(todo);
    return id;
}

export async function createIndex() {
    const todoRepository = await todoInit();
    await todoRepository.dropIndex();
    await todoRepository.createIndex();
}

export async function getAllTodos(): Promise<Todo[]> {
    const todoRepository = await todoInit();
    const todoItems = await todoRepository.search().return.all();
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

// updates a todo entity with given id in redis db with input data
export async function updateTodo(id: string, data: Partial<Todo>) {
    await todoInit();
    const formattedId = `TodoItem:${id}`;
    if (data.description)
        await client.execute([
            "JSON.SET",
            formattedId,
            ".description",
            data.description,
        ]);
    if (data.isComplete !== undefined)
        await client.execute([
            "JSON.SET",
            formattedId,
            ".isComplete",
            data.isComplete.toString(),
        ]);
}

// delete an existing todo with given id
export async function deleteTodo(id: string) {
    const repo = await todoInit();
    await repo.remove(id);
}
