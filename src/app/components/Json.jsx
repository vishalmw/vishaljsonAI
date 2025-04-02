"use client"

import React, { useState, useEffect } from 'react';
import { FaArrowCircleDown, FaArrowAltCircleRight } from "react-icons/fa";


const JsonViewer = ({ data }) => {
    const [expanded, setExpanded] = useState({});
    const [counts, setCounts] = useState({ keys: 0, arrays: 0, objects: 0 });

    const toggleExpand = (key) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const countElements = (value) => {
        let keys = 0, arrays = 0, objects = 0;

        const traverse = (val) => {
            if (Array.isArray(val)) {
                arrays++;
                val.forEach(item => traverse(item));
            } else if (typeof val === 'object' && val !== null) {
                objects++;
                keys += Object.keys(val).length;
                Object.values(val).forEach(item => traverse(item));
            }
        };

        traverse(value);
        return { keys, arrays, objects };
    };

    useEffect(() => {
        if (data && typeof data === 'object') {
            setCounts(countElements(data));
        }
    }, [data]);

    const renderJson = (data, parentKey = '') => {
        if (Array.isArray(data)) {
            const isExpanded = expanded[parentKey] ?? true; // Always start with array expanded

            return (
                <div className="pl-5 mt-1 text-white">
                    <span
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleExpand(parentKey)}
                    >
                        {isExpanded ? <FaArrowCircleDown className="mr-1 text-green-300"/> : <FaArrowAltCircleRight className="mr-1 text-amber-300"/>}
                        <strong className="text-lime-400">[</strong>
                    </span>
                    {isExpanded && data.map((item, index) => {
                        const newKey = `${parentKey}[${index}]`;
                        const isObject = typeof item === 'object' && item !== null;

                        return (
                            <div key={newKey} className="pl-5 mt-1 text-white">
                                <span
                                    className="flex items-center cursor-pointer"
                                    onClick={() => isObject && toggleExpand(newKey)}
                                >
                                    {isObject && (expanded[newKey] ? <FaArrowCircleDown className="mr-1 text-amber-300"/> : <FaArrowAltCircleRight className="mr-1 text-amber-300"/>)}
                                    <strong className='text-amber-300'>{`[${index}]`}</strong>: {isObject && !expanded[newKey] ? '{...}' : JSON.stringify(item)}
                                </span>
                                {isObject && expanded[newKey] && <div>{renderJson(item, newKey)}</div>}
                            </div>
                        );
                    })}
                    {isExpanded && <strong className="text-lime-400 pl-5">]</strong>}
                </div>
            );
        }

        if (typeof data === 'object' && data !== null) {
            return Object.entries(data).map(([key, value]) => {
                const newKey = parentKey ? `${parentKey}.${key}` : key;
                const isExpanded = expanded[newKey];
                const isObject = typeof value === 'object' && value !== null;

                return (
                    <div key={newKey} className="pl-5 mt-1 text-white">
                        <span
                            className="flex items-center cursor-pointer"
                            onClick={() => isObject && toggleExpand(newKey)}
                        >
                            {isObject && (isExpanded ? <FaArrowCircleDown className="mr-1 text-amber-300"/> : <FaArrowAltCircleRight className="mr-1 text-amber-300"/>)}
                            <strong className='text-amber-300'>{key}</strong>: {isObject && !isExpanded ? '{...}' : JSON.stringify(value)}
                        </span>
                        {isObject && isExpanded && <div>{renderJson(value, newKey)}</div>}
                    </div>
                );
            });
        }

        return null;
    };

    return (
        <div>
            <div className="text-white mb-4 text-lg font-bold">
                📊 Keys: {counts.keys} | 📁 Arrays: {counts.arrays} | 📦 Objects: {counts.objects} 
            </div>
            {renderJson(data)}
        </div>
    );
};

export default function Json() {
    const [jsonInput, setJsonInput] = useState('[{"name":"Alice","age":25},{"name":"Bob","age":30},{"name":"Charlie","age":35}]');
    let parsedObject;

    try {
        parsedObject = JSON.parse(jsonInput);
    } catch (error) {
        parsedObject = { error: 'Invalid JSON format' };
    }

    return (
        <div className='flex justify-center items-start h-screen bg-[#2c3e50] text-white w-full'>
            <div className='border-gray-400 border-2 bg-[#34495e] overflow-scroll w-2/3 '>
                <textarea 
                    className='h-screen w-full bg-[#2c3e50] text-white p-4 border-none outline-none' 
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                ></textarea>
            </div>
       
            <div className='border-gray-400 border-2 p-4 h-screen overflow-y-auto w-full bg-[#1a5276] text-white'>
                <JsonViewer data={parsedObject} />
            </div>
        </div>
    )
}
