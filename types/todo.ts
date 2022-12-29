export interface Todo {
    id: number;
    description: string;
    isComplete: boolean;
}

export type TodoForCreation = Omit<Todo, "id">;
