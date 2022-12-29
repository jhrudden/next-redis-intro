import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Todo, TodoForCreation } from "../types/todo";

async function createTodo(forCreation: TodoForCreation): Promise<Todo> {
    return fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify(forCreation),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());
}

export default function AddTodo() {
    const [description, setDescription] = useState("");
    const queryClient = useQueryClient();
    const { mutateAsync, isLoading } = useMutation<
        Todo,
        Error,
        TodoForCreation,
        unknown
    >({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries(["todos"]);
        },
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const newTodo: TodoForCreation = {
            description: (form.get("description") as string) || "",
            isComplete: false,
        };
        await mutateAsync(newTodo);
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-row mb-2">
            <textarea
                name="description"
                required
                className="form-control me-2"
                placeholder="Enter a todo ..."
            />
            <button
                className="btn btn-outline-primary"
                type="submit"
                disabled={isLoading}
            >
                Add
            </button>
        </form>
    );
}
