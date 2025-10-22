
import React, { useState, useMemo } from 'react';
import { headers, invigilatorData } from '../data/scheduleData.ts';

// Helper to parse header string
const parseHeader = (header: string) => {
    const match = header.match(/(\d{4}-\d{2}-\d{2})\s?\((\d{1,2}:\d{2}-\d{1,2}:\d{2})-(صباحا|مساء)\)?/);
    if (!match) return { date: header, time: '', period: '' };
    return {
        date: match[1],
        time: match[2],
        period: match[3],
    };
};

const ScheduleView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm) return invigilatorData;
        return invigilatorData.filter(invigilator =>
            invigilator.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const groupedHeaders = useMemo(() => {
        const groups: { [key: string]: string[] } = {};
        headers.forEach(h => {
            const { date } = parseHeader(h);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(h);
        });
        return groups;
    }, []);

    const dates = Object.keys(groupedHeaders);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-3xl font-bold text-gray-800">جدول المراقبة العام</h2>
                 <div className="relative">
                    <input
                        type="text"
                        placeholder="ابحث عن مراقب..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-72 px-4 py-2 pr-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                 </div>
            </div>
           
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="sticky right-0 bg-gray-200 px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider z-20">
                                اسم المراقب
                            </th>
                            {dates.map(date => (
                                <th key={date} colSpan={groupedHeaders[date].length} className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-300">
                                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th className="sticky right-0 bg-gray-100 z-20"></th>
                            {headers.map((header) => {
                                const { time, period } = parseHeader(header);
                                return (
                                    <th key={header} className="px-3 py-3 text-center text-xs font-medium text-gray-500 border-r border-gray-300">
                                        <div>{time}</div>
                                        <div className={`text-xs ${period === 'صباحا' ? 'text-yellow-600' : 'text-indigo-600'}`}>{period === 'صباحا' ? 'AM' : 'PM'}</div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((invigilator) => (
                            <tr key={invigilator.name} className="hover:bg-blue-50 transition-colors duration-200">
                                <td className="sticky right-0 bg-white hover:bg-blue-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 z-10">
                                    {invigilator.name}
                                </td>
                                {headers.map((header) => (
                                    <td key={`${invigilator.name}-${header}`} className="px-3 py-4 whitespace-nowrap text-center text-sm text-gray-700 border-r border-gray-200">
                                        {invigilator.schedule[header] ? (
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 animate-fade-in">
                                                {invigilator.schedule[header]}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredData.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    <p>لم يتم العثور على مراقبين يطابقون بحثك.</p>
                </div>
            )}
        </div>
    );
};

export default ScheduleView;