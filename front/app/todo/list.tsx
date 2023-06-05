'use client'

import useSWR from 'swr'

type Todo = {
    ID: string
    title: string
}

export default function TodoList() {
    const { data, error, isLoading } = useSWR("/todo", async (path) => {
        const res = await fetch("http://localhost:8080" + path)
        const {todos}: {todos: Todo[]} = await res.json()
        
        return todos
    })

    if (error) return (
        <div>failed to load</div>
    )

    if (isLoading) return (
        <div>loading</div>
    )

    if ( data == undefined) return (
        <div>data is undefined</div>
    )

    return (
        <div>
            {data.map(t => {
                return (
                    <TodoCard todo={t} key={t.ID}/>
                )
            })}
        </div>
    )
}

function TodoCard({ todo }: {todo: Todo}) {
    return (
        <div>
            <h2>{todo.title}</h2>
        </div>
    )
}