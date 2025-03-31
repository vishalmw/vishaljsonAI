"use client"

import React, { useState, useEffect } from 'react';
import { FaArrowCircleDown, FaArrowAltCircleRight } from "react-icons/fa";
import { parseJSONObject } from "parse-json-object";

const JsonViewer = ({ data }) => {
    const [expanded, setExpanded] = useState({});
    const [counts, setCounts] = useState({ keys: 0, arrays: 0, objects: 0 });

    const toggleExpand = (key) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const countElements = (data) => {
        let keys = 0, arrays = 0, objects = 0;

        const traverse = (value) => {
            if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                    arrays++;
                    value.forEach(item => traverse(item));
                } else {
                    objects++;
                    keys += Object.keys(value).length;
                    Object.values(value).forEach(val => traverse(val));
                }
            }
        };

        traverse(data);
        return { keys, arrays, objects };
    };

    useEffect(() => {
        const result = countElements(data);
        setCounts(result);
    }, [data]);

    const renderJson = (data, parentKey = '') => {
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
    const [jsonInput, setJsonInput] = useState('{"name":"John","age":30,"city":"New York","hobbies":["reading","traveling","gaming"],"isActive":true,"address":{"street":"123 Main St","zip":"10001","locations":[{"lat":40.7128,"long":-74.0060},{"lat":34.0522,"long":-118.2437}]}}');
    let parsedObject;

    try {
        parsedObject = parseJSONObject(jsonInput);
    } catch (error) {
        parsedObject = { error: 'Invalid JSON format' };
    }

    return (
        <div className='flex justify-between items-start h-screen bg-[#2c3e50] text-white'>
            <div className='border-gray-400 border-2 bg-[#34495e] overflow-scroll'>
                <textarea 
                    className='h-screen w-[450px] bg-[#2c3e50] text-white p-4 border-none outline-none' 
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                ></textarea>
            </div>
       
            <div className='border-gray-400 border-2 p-4 h-screen w-[800px] overflow-y-auto bg-[#1a5276] text-white'>
                <JsonViewer data={parsedObject} />
            </div>
        </div>
    )
}
