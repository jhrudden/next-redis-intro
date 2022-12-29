import { ChangeEvent, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Todo } from "../types/todo";

interface UpdateTodoInputs {
    todoId: number;
    newTodo: Partial<Todo>;
}

async function getTodos() {
    return fetch("/api/todos").then((res) => res.json());
}

async function updateTodo(args: UpdateTodoInputs) {
    return await fetch(`/api/todos/${args.todoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(args.newTodo),
    });
}

export default function TodoList() {
    const queryClient = useQueryClient();
    const {
        data: todos,
        error,
        isLoading,
        isFetching,
    } = useQuery<Todo[], Error>({
        queryKey: ["todos"],
        queryFn: getTodos,
    });

    const { mutateAsync } = useMutation<
        unknown,
        Error,
        UpdateTodoInputs,
        unknown
    >({
        mutationFn: (args) => updateTodo(args),
        onSuccess: (_, args, __) => {
            queryClient.setQueryData<Todo[]>(
                ["todos"],
                (oldData) =>
                    oldData?.map((item) =>
                        item.id == args.todoId
                            ? { ...item, ...args.newTodo }
                            : item
                    ) || []
            );
        },
    });

    const onTodoCheck = useCallback(
        async (e: ChangeEvent<HTMLInputElement>, todoId: number) => {
            await mutateAsync({
                todoId,
                newTodo: { isComplete: e.target.checked },
            });
        },
        [mutateAsync]
    );

    if (error) return <div>There was an issue</div>;
    return isLoading ? (
        <div>loading ...</div>
    ) : (
        <ul className="list-group w-100">
            {todos
                ?.sort((a, b) => a.description.localeCompare(b.description))
                .sort((a, b) => Number(a.isComplete) - Number(b.isComplete))
                .map((todo) => (
                    <li className="list-group-item flex" key={todo.id}>
                        <input
                            disabled={isFetching}
                            className="form-check-input me-2"
                            type="checkbox"
                            checked={todo.isComplete}
                            onChange={(e) => onTodoCheck(e, todo.id)}
                        />
                        <label
                            className={`form-check-label ${
                                todo.isComplete &&
                                "text-decoration-line-through"
                            }`}
                        >
                            {todo.description}
                        </label>
                    </li>
                ))}
        </ul>
    );
}
