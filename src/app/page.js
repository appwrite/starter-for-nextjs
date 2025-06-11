"use client";

import "./app.css";
import "@appwrite.io/pink-icons";
import { useState, useEffect, useRef, useCallback } from "react";
import { client, databases, storage } from "@/lib/appwrite";
import { AppwriteException, ID } from "appwrite";
import NextjsLogo from "../static/nextjs-icon.svg";
import AppwriteLogo from "../static/appwrite-icon.svg";
import Image from "next/image";

export default function Home() {
  const [title, setTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [completeMessage, setCompleteMessage] = useState('');
  const [failedMessage, setFailedMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [tab, setTab] = useState('hi');
  const [todos, setTodos] = useState([]);

  const fileInputRef = useRef(null);



  useEffect(() => {
    fetchTodos();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];

    if (!title.trim()) {
      alert('Please enter a title.');
      return;
    }

    if (!file) {
      alert('Please attach a media file.');
      return;
    }

    try {
      const results = await storage.createFile(
        '6847c4e1001bb5fa1427', // bucketId
        ID.unique(), // fileId
        file, // file
      );
      const result = await databases.createDocument(
        '6847b5980033f7e274d8', // databaseId
        '6847b5a9003c48843844',
        ID.unique(), // documentId
        { //data
          title: title,
          media: [results.$id],
          status: 'pending'
        },
      );

      // Set success message
      setSuccessMessage('Todo added successfully!');

      // Optionally clear form fields
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = null;

      setTimeout(() => setSuccessMessage(''), 5000);
      fetchTodos();

    } catch (err) {
      console.error('Error uploading:', err);
      alert('An error occurred.');
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await databases.listDocuments(
        '6847b5980033f7e274d8', // databaseId
        '6847b5a9003c48843844'  // collectionId
      );
      setTodos(response.documents);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument(
        '6847b5980033f7e274d8',
        '6847b5a9003c48843844',
        // ID.unique(), // documentId
        id
      );
      // Set success message
      setDeleteMessage('Todo Deleted');
      setTimeout(() => setDeleteMessage(''), 5000);
      // Refresh the list
      fetchTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const completeTodos = todos.filter((todo) => todo.status === 'completed');
  const failedTodos = todos.filter((todo) => todo.status === 'failed');
  const pendingTodos = todos.filter((todo) => todo.status === 'pending');


  const handleComplete = async (id) => {
    if (!id) {
      console.error("Missing document ID");
      return;
    }

    try {
      await databases.updateDocument(
        "6847b5980033f7e274d8", // Database ID
        "6847b5a9003c48843844", // Collection ID
        id,                     // Document ID
        { status: "completed" } // Fields to update
      );

      // Set success message
      setCompleteMessage('Todo marked completed!');

      setTimeout(() => setCompleteMessage(''), 5000);
      fetchTodos(); // Refresh the todo list
    } catch (error) {
      console.error("Failed to mark todo as complete:", error);
    }
  };

  const handleFailed = async (id) => {
    if (!id) {
      console.error("Missing document ID");
      return;
    }
    try {
      await databases.updateDocument(
        "6847b5980033f7e274d8", // Database ID
        "6847b5a9003c48843844", // Collection ID
        id,                     // Document ID
        { status: "failed" } // Fields to update
      );
      // Set success message
      setFailedMessage('Todo marked failed!');
      setTimeout(() => setFailedMessage(''), 5000);
      fetchTodos(); // Refresh the todo list
    } catch (error) {
      console.error("Failed to mark todo as fail:", error);
    }
  };

  return (
    <main
      className="sm:flex sm:flex-col items-center p-5 space-y-4"
    >
      <div className="text-center">
        <h1 className="text-6xl py-4 font-semibold text-indigo-500"> Todo Masterpiece</h1>
        <h1 className="text-xl py-2">Organise your tasks with style and efficiency</h1>
      </div>

      <div className="sm:flex items-center gap-4 py-2 space-y-2">
        <div className=" border border-purple-300 rounded-sm  py-2 px-4">
          <div className="text-xl font-bold text-purple-700  text-center">{pendingTodos.length}</div>
          <div className="text-sm  text-black-700">Total </div>
        </div>
        <div className="border border-yellow-300 rounded-sm py-2 px-4">
          <div className="text-xl font-bold text-yellow-700  text-center">{pendingTodos.length}</div>
          <div className="text-sm">Pending </div>
        </div>
        <div className="border  border-green-300 rounded-sm py-2 px-4">
          <div className="text-xl font-bold text-green-700 text-center">{completeTodos.length}</div>
          <div className="text-sm">Completed </div>
        </div>

        <div className=" border  border-red-300 rounded-sm py-2 px-4 mb-2">
          <div className="text-xl font-bold text-red-700 text-center">{failedTodos.length}</div>
          <div className="text-sm ">Failed</div>
        </div>
      </div>

      <div>
        <div className="flex space-x-4 sm:w-full rounded-sm border border-gray-100 py-4 px-2 ">
          <button
            onClick={() => setTab('hi')}
            className={`py-2 sm:px-44 px-10 rounded ${tab === 'hi' ? 'border-b-2 border-blue-500 text-white font-semibold bg-indigo-500 opacity-75' : 'text-gray-500'
              }`}
          >
            Add todo
          </button>
          <button
            onClick={() => setTab('oh')}
            className={`py-2 sm:px-44 px-10 rounded ${tab === 'oh' ? 'border-b-2 border-blue-500 text-white font-semibold bg-indigo-500 opacity-75' : 'text-gray-500'
              }`}
          >
            View todo
          </button>
        </div>
      </div>

      <div className="mt-6 flex w-full max-w-[40em] items-center justify-center">

        <div className="mt-4">{tab === 'hi' ? (
          <div className="w-full border rounded-sm border-gray-100 px-6 py-6 h-full bg-white">
            {successMessage && (
              <p className="text-green-600 mt-2 py-2 text-center">{successMessage}</p>
            )}

            <div className="text-center text-2xl text-indigo-500  font-bold py-4">
              Create New Todo
            </div>

            {/* inputs */}
            <form className="space-y-4" onSubmit={handleSubmit} >

              <div>
                <label className="block text-sm font-medium mb-2">
                  Title
                  <input type='text' value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full  border rounded-sm border-gray-100 p-2" placeholder="What needs to be done?" />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Attach Media</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="mt-1 block w-full border rounded-sm border-gray-300 py-10 px-30 sm:text-center"
                />
              </div>

              <button className="w-full bg-indigo-500  py-3 rounded-md text-white">

                Add Todo
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full capitalize sm:w-[870px] rounded-lg border-white bg-white px-6 py-8">

            {completeMessage && (
              <p className="text-green-600 mt-2 py-2 text-center">{completeMessage}</p>
            )}

            {failedMessage && (
              <p className="text-red-600 mt-2 py-2 text-center">{failedMessage}</p>
            )}

            {deleteMessage && (
              <p className="text-red-600 mt-2 py-2 text-center">{deleteMessage}</p>
            )}

            {pendingTodos.length === 0 && completeTodos.length === 0 && failedTodos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No todos Added</p>
            ) : (
             null
            )}

            <div className="space-y-2">
              <h2 className="text-lg font-bold mb-2 text-black-700">Pending ({pendingTodos.length})</h2>
              {pendingTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="rounded-lg border text-card-foreground bg-white/80  border-gray-200/50 shadow-lg hover:shadow-xl"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <h3 className="text-lg font-semibold text-gray-800">{todo.title}</h3>
                      </div>
                      <div>
                        {todo.status === 'pending' && (
                          <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center space-x-1">
                            <span className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="capitalize text-xs font-medium">pending</span>
                          </div>
                        )}
                        {todo.status === 'completed' && (
                          <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                            </svg>
                            <span className="capitalize text-xs font-medium">complete</span>
                          </div>
                        )}
                        {todo.status === 'failed' && (
                          <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200 flex items-center space-x-1">
                            <span className="w-3 h-3 rounded-full bg-red-400" />
                            <span className="capitalize text-xs font-medium">failed</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image with tooltip */}
                    <div className="relative group mb-4">
                      {todo.image ? (
                        <img
                          src={todo.image}
                          alt={todo.imageName}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-purple-200 border-2 border-dashed border-purple-300 flex items-center justify-center text-xs text-gray-500">

                        </div>
                      )}

                      {todo.imageName && (
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {todo.imageName}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Created: {new Date(todo.$createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}</span>
                      <span>Updated: {new Date(todo.$updatedAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between flex-wrap gap-2 w-full">
                      {/* Left: Status-specific buttons */}
                      <div className="flex items-center gap-2">
                        {todo.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleComplete(todo.$id)}

                              className="border border-green-600 text-green-600 hover:bg-green-50 h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                              </svg>
                              Complete
                            </button>
                            <button
                              onClick={() => handleFailed(todo.$id)}

                              className="border border-red-600 text-red-600 hover:bg-red-50 h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9V5a1 1 0 112 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H6a1 1 0 110-2h4z" />
                              </svg>
                              Mark Failed
                            </button>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => onEdit?.(todo.id)}
                          className="border border-blue-600 text-blue-600 hover:bg-blue-50 h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.414 2.586a2 2 0 010 2.828L8.828 14H6v-2.828l8.586-8.586a2 2 0 012.828 0z" />
                          </svg>

                        </button>
                        <button
                          onClick={() => handleDelete(todo.$id)}
                          className="border  border-red-400 text-red-600 hover:bg-gray-50 h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 2a1 1 0 00-1 1v1H2v2h1v10a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-3V3a1 1 0 00-1-1H6zm2 4h2v8H8V6zm4 0h2v8h-2V6z" />
                          </svg>

                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>


            <div className="space-y-2 py-2">
              <h2 className="text-lg font-bold mb-2 text-green-700">Completed ({completeTodos.length})</h2>
              {completeTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="rounded-lg border text-card-foreground bg-white/80  border-gray-200/50 shadow-lg hover:shadow-xl"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <h3 className="text-lg font-semibold text-gray-800">{todo.title}</h3>
                      </div>
                      <div>
                        {todo.status === 'pending' && (
                          <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center space-x-1">
                            <span className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="capitalize text-xs font-medium">pending</span>
                          </div>
                        )}
                        {todo.status === 'completed' && (
                          <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                            </svg>
                            <span className="capitalize text-xs font-medium">complete</span>
                          </div>
                        )}
                        {todo.status === 'failed' && (
                          <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200 flex items-center space-x-1">
                            <span className="w-3 h-3 rounded-full bg-red-400" />
                            <span className="capitalize text-xs font-medium">failed</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image with tooltip */}
                    <div className="relative group mb-4">
                      {todo.image ? (
                        <img
                          src={todo.image}
                          alt={todo.imageName}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-purple-200 border-2 border-dashed border-purple-300 flex items-center justify-center text-xs text-gray-500">

                        </div>
                      )}

                      {todo.imageName && (
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {todo.imageName}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Created: {new Date(todo.$createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}</span>
                      <span>Updated: {new Date(todo.$updatedAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center  gap-2">
                      {todo.status === 'completed' && (
                        <>
                          <button
                            onClick={() => handleComplete(todo.$id)}
                            disabled
                            className="bg-green-700 text-white h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium opacity-70 cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                            </svg>
                            Complete
                          </button>
                          <button
                            onClick={() => handleFailed(todo.$id)}
                            className="border border-red-600 text-red-600 hover:bg-red-50 h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9V5a1 1 0 112 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H6a1 1 0 110-2h4z" />
                            </svg>
                            Mark Failed
                          </button>
                        </>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => onEdit?.(todo.id)}
                          className="border border-blue-600 text-blue-600 hover:bg-blue-50 h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.414 2.586a2 2 0 010 2.828L8.828 14H6v-2.828l8.586-8.586a2 2 0 012.828 0z" />
                          </svg>

                        </button>
                        <button
                          onClick={() => handleDelete(todo.$id)}
                          className="border  border-red-400 text-red-600 hover:bg-gray-50 h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 2a1 1 0 00-1 1v1H2v2h1v10a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-3V3a1 1 0 00-1-1H6zm2 4h2v8H8V6zm4 0h2v8h-2V6z" />
                          </svg>

                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>


            <div className="space-y-2">
              <h2 className="text-lg font-bold mb-2 text-red-700">Failed ({failedTodos.length})</h2>
              {failedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="rounded-lg border text-card-foreground bg-white/80  border-gray-200/50 shadow-lg hover:shadow-xl"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <h3 className="text-lg font-semibold text-gray-800">{todo.title}</h3>
                      </div>
                      <div>
                        {todo.status === 'pending' && (
                          <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center space-x-1">
                            <span className="w-3 h-3 rounded-full bg-yellow-400" />
                            <span className="capitalize text-xs font-medium">pending</span>
                          </div>
                        )}
                        {todo.status === 'completed' && (
                          <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200 flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                            </svg>
                            <span className="capitalize text-xs font-medium">complete</span>
                          </div>
                        )}
                        {todo.status === 'failed' && (
                          <div className="rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200 flex items-center space-x-1">
                            <span className="w-3 h-3 rounded-full bg-red-400" />
                            <span className="capitalize text-xs font-medium">failed</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image with tooltip */}
                    <div className="relative group mb-4">
                      {todo.image ? (
                        <img
                          src={todo.image}
                          alt={todo.imageName}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-purple-200 border-2 border-dashed border-purple-300 flex items-center justify-center text-xs text-gray-500">

                        </div>
                      )}

                      {todo.imageName && (
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {todo.imageName}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Created: {new Date(todo.$createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}</span>
                      <span>Updated: {new Date(todo.$updatedAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {todo.status === 'failed' && (
                        <>
                          <button
                            onClick={() => handleComplete(todo.$id)}
                            className="border border-green-600 text-green-600 hover:bg-green-50 h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                            </svg>
                            Complete
                          </button>
                          <button
                            onClick={() => handleFailed(todo.$id)}
                            disabled
                            className="bg-red-700 text-white h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium opacity-70 cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9V5a1 1 0 112 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H6a1 1 0 110-2h4z" />
                            </svg>
                            Mark Failed
                          </button>
                        </>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => onEdit?.(todo.id)}
                          className="border border-blue-600 text-blue-600 hover:bg-blue-50 h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.414 2.586a2 2 0 010 2.828L8.828 14H6v-2.828l8.586-8.586a2 2 0 012.828 0z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(todo.$id)}
                          className="border border-red-400 text-red-600 hover:bg-gray-50 h-9 rounded-md px-3 flex items-center gap-2 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 2a1 1 0 00-1 1v1H2v2h1v10a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-3V3a1 1 0 00-1-1H6zm2 4h2v8H8V6zm4 0h2v8h-2V6z" />
                          </svg>

                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>)}
        </div>
      </div>

    </main >
  );
}
