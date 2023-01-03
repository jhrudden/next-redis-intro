import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Todo } from "../types/todo";

interface UpdateTodoInputs {
    todoId: string;
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

async function deleteTodo(id: string) {
    return await fetch(`/api/todos/${id}`, {
        method: "DELETE",
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

    const { mutateAsync: updateTodoMutation } = useMutation<
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

    const { mutateAsync: deleteTodoMutation } = useMutation<
        unknown,
        Error,
        string,
        unknown
    >({
        mutationFn: (args) => deleteTodo(args),
        onSuccess: () => {
            queryClient.invalidateQueries(["todos"]);
        },
    });

    const onTodoCheck = useCallback(
        async (e: ChangeEvent<HTMLInputElement>, todoId: string) => {
            await updateTodoMutation({
                todoId,
                newTodo: { isComplete: e.target.checked },
            });
        },
        [updateTodoMutation]
    );

    const onTodoDelete = useCallback(
        async (todoId: string) => {
            await deleteTodoMutation(todoId);
        },
        [deleteTodoMutation]
    );

    if (error) return <div>There was an issue</div>;
    return isLoading ? (
        <div>loading ...</div>
    ) : (
        <ul className="list-group w-100 position-relative">
            {todos
                ?.sort((a, b) => a.description.localeCompare(b.description))
                .sort((a, b) => Number(a.isComplete) - Number(b.isComplete))
                .map((todo) => (
                    <li className="list-group-item" key={todo.id}>
                        <div className="row w-100 d-flex align-items-center">
                            <div className="col-sm-1">
                                <input
                                    disabled={isFetching}
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={todo.isComplete}
                                    onChange={(e) => onTodoCheck(e, todo.id)}
                                />
                            </div>
                            <div className="col-sm-10">
                                <label
                                    className={`form-check-label ${
                                        todo.isComplete &&
                                        "text-decoration-line-through"
                                    }`}
                                >
                                    {todo.description}
                                </label>
                            </div>
                            <div className="col-sm-1">
                                <button
                                    className="btn"
                                    onClick={() => onTodoDelete(todo.id)}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
        </ul>
    );
}
