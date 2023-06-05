"use client";

import { useState } from "react";
import useSWR from "swr";
import MyButton from "@/components/button";

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
    // Check if the title was updated
    const oldTodo = todos.find((t) => t.ID == id);
    if (oldTodo == undefined) {
      alert("The todo is elegal!");
      return;
    } else if (oldTodo.title == title) {
      alert("The title has not been updated.");
      return;
    }

    fetch("http://localhost:8080" + "/todo", {
      method: "PATCH",
      body: JSON.stringify({
        id,
        title,
      }),
    }).then(() => {
      mutate(); // revoke cache of todos SWR
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
  const [inputtedTitle, setInputtedTitle] = useState(todo.title);
  const [isEditting, setIsEditting] = useState(false);
  return (
    <div className="border-solid border-2 m-3 rounded p-2">
      {!isEditting && (
        <>
          <h2 className="m-1">{todo.title}</h2>
          <MyButton onClick={() => setIsEditting(true)}>Edit</MyButton>
        </>
      )}
      {isEditting && (
        <>
          <input
            className="border-solid border-2 m-1 py-2 px-4"
            value={inputtedTitle}
            onChange={(e) => setInputtedTitle(e.target.value)}
          ></input>
          <MyButton
            onClick={() => {
              setIsEditting(false);
              onUpdateTodo(todo.ID, inputtedTitle);
            }}
          >
            Update
          </MyButton>
          <MyButton
            onClick={() => {
              setIsEditting(false);
            }}
          >
            Cancel
          </MyButton>
        </>
      )}
    </div>
  );
}
