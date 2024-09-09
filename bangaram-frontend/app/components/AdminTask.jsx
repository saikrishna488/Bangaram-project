"use client";
import axios from 'axios';
import React, { useState,useContext } from 'react';
import { toast } from 'react-toastify';
import { globalContext } from '@/contextapi/GlobalContext';

const AdminTask = () => {
    const [text, setText] = useState("");
    const [url, setUrl] = useState("");
    const [reward, setReward] = useState("");
    const [type, setType] = useState("");
    const [task, setTask] = useState({});
    const {key} = useContext(globalContext)


    const fetchTask = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/tasks/task', { text }, {
                headers: { "Authorization": process.env.NEXT_PUBLIC_TOKEN }
            });

            if (res.data.msg) {
                toast.success("Fetched successfully");
                setTask(res.data.task);
            } else {
                toast.error("Fetch failed");
            }
        } catch (error) {
            toast.error("Error fetching task");
        }
    };

    const addTask = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/tasks', { text, url, type, reward }, {
                headers: { "Authorization": process.env.NEXT_PUBLIC_TOKEN }
            });

            if (res.data.msg) {
                toast.success("Task added successfully");
                setTask(res.data.task);
            } else {
                toast.error("Task add request failed");
            }
        } catch (error) {
            toast.error("Error adding task");
        }
    };

    const deleteTask = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/tasks/delete', { text }, {
                headers: { "Authorization": process.env.NEXT_PUBLIC_TOKEN }
            });

            if (res.data.msg) {
                toast.success("Deleted task successfully");
            } else {
                toast.error("Task deletion failed");
            }
        } catch (error) {
            toast.error("Error deleting task");
        }
    };

    if(!key){
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-5">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Task Management</h2>

                {/* Fetch Task Section */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Fetch Task</h4>
                    <form onSubmit={fetchTask} className="flex flex-col space-y-4">
                        <input
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder='Enter task text'
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Fetch Task
                        </button>
                    </form>
                    {task && task.text && (
                        <div className="mt-6">
                            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Task Details</h5>
                            <p className="text-gray-700 dark:text-gray-300"><strong>Text:</strong> {task.text}</p>
                            <p className="text-gray-700 dark:text-gray-300"><strong>URL:</strong> {task.url}</p>
                            <p className="text-gray-700 dark:text-gray-300"><strong>Type:</strong> {task.type}</p>
                            <p className="text-gray-700 dark:text-gray-300"><strong>Reward:</strong> {task.reward}</p>
                        </div>
                    )}
                </div>

                {/* Add Task Section */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Add Task</h4>
                    <form onSubmit={addTask} className="flex flex-col space-y-4">
                        <input
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder='Enter task text'
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
                        />
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder='Enter URL'
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
                        />
                        <input
                            type="text"
                            value={reward}
                            onChange={e => setReward(e.target.value)}
                            placeholder='Enter Reward'
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
                        />
                        <input
                            type="text"
                            value={type}
                            onChange={e => setType(e.target.value)}
                            placeholder='Enter Type'
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Add Task
                        </button>
                    </form>
                </div>

                {/* Delete Task Section */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Delete Task</h4>
                    <form onSubmit={deleteTask} className="flex flex-col space-y-4">
                        <input
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder='Enter task text'
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-black dark:text-white"
                        />
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminTask;
