export interface Todo {
    id: string;
    description: string;
    isComplete: boolean;
}

export type TodoForCreation = Omit<Todo, "id">;
