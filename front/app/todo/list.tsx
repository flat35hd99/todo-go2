"use client";

import { useState } from "react";
import useSWR from "swr";

type Todo = {
  ID: string;
  title: string;
};

export default function TodoList() {
  const { data, error, isLoading, mutate } = useSWR("/todo", async (path) => {
    const res = await fetch("http://localhost:8080" + path);
    const { todos }: { todos: Todo[] } = await res.json();

    return todos;
  });
  const todos = data;

  if (isLoading) return <div>loading</div>;
  if (error || todos == undefined) return <div>failed to load</div>;

  const handleUpdateTodo = (id: string, title: string) => {
    fetch("http://localhost:8080" + "/todo", {
      method: "PATCH",
      body: JSON.stringify({
        id,
        title,
      }),
    }).then(() => {
      mutate(); // revoke SWR
    });
  };

  return (
    <div>
      {todos.map((t) => {
        return <TodoCard key={t.ID} todo={t} onUpdateTodo={handleUpdateTodo} />;
      })}
    </div>
  );
}

function TodoCard({
  todo,
  onUpdateTodo,
}: {
  todo: Todo;
  onUpdateTodo: (id: string, title: string) => void;
}) {
  const [inputtedTitle, setInputtedTitle] = useState("");
  const [isEditting, setIsEditting] = useState(false);
  return (
    <div className="border-solid border-2 my-2">
      {!isEditting && (
        <>
          <h2>{todo.title}</h2>
          <button onClick={() => setIsEditting(true)}>Edit</button>
        </>
      )}
      {isEditting && (
        <>
          <input
            value={inputtedTitle}
            onChange={(e) => setInputtedTitle(e.target.value)}
          ></input>
          <button
            onClick={() => {
              setIsEditting(false);
              // setHoge は変更をキューに詰むだけなので
              // 後続のonUpdateTodo()を同期的に実行している間はinputtedTitleはそのまま
              setInputtedTitle("");
              onUpdateTodo(todo.ID, inputtedTitle);
            }}
          >
            Update
          </button>
        </>
      )}
    </div>
  );
}
