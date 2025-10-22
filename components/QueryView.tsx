import React, { useState, useMemo } from 'react';
import { invigilatorData } from '../data/scheduleData.ts';

const QueryView: React.FC = () => {
    const [selectedInvigilatorName, setSelectedInvigilatorName] = useState<string>('');

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedInvigilatorName(e.target.value);
    };

    const selectedInvigilator = useMemo(() => {
        return invigilatorData.find(inv => inv.name === selectedInvigilatorName);
    }, [selectedInvigilatorName]);

    const groupedSchedule = useMemo(() => {
        if (!selectedInvigilator) return null;

        const groups: { [key: string]: { time: string; period: string; location: string }[] } = {};
        
        Object.entries(selectedInvigilator.schedule).forEach(([header, location]) => {
            const match = header.match(/(\d{4}-\d{2}-\d{2})\s?\((\d{1,2}:\d{2}-\d{1,2}:\d{2})-(صباحا|مساء)\)?/);
            if (match) {
                const [, date, time, period] = match;
                if (date && time && period) {
                    if (!groups[date]) {
                        groups[date] = [];
                    }
                    groups[date].push({ time, period, location });
                }
            }
        });

        // Sort schedule within each day by time
        for (const date in groups) {
            groups[date].sort((a, b) => {
                const timeA = a.time.split('-')[0].replace(':', '.');
                const timeB = b.time.split('-')[0].replace(':', '.');
                return parseFloat(timeA) - parseFloat(timeB);
            });
        }
        
        // Sort the dates themselves
        const sortedDates = Object.keys(groups).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        
        const sortedGroups: { [key: string]: { time: string; period: string; location: string }[] } = {};
        sortedDates.forEach(date => {
            sortedGroups[date] = groups[date];
        });

        return sortedGroups;

    }, [selectedInvigilator]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">استعلام عن جدول مراقب</h2>
            
            <div className="mb-8 max-w-lg mx-auto">
                <label htmlFor="invigilator-select" className="block text-lg font-medium text-gray-700 mb-2 text-center">
                    اختر المراقب لعرض جدوله
                </label>
                <select
                    id="invigilator-select"
                    value={selectedInvigilatorName}
                    onChange={handleSelectChange}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none text-center"
                >
                    <option value="" disabled>-- اختر مراقباً --</option>
                    {invigilatorData.map(inv => (
                        <option key={inv.name} value={inv.name}>{inv.name}</option>
                    ))}
                </select>
            </div>

            <div className="mt-8 min-h-[300px]">
                {selectedInvigilator && groupedSchedule ? (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-center text-blue-600 animate-fade-in">{selectedInvigilator.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(groupedSchedule).map(([date, assignments], index) => (
                                <div key={date} className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                    <p className="font-bold text-lg text-gray-800 mb-3 pb-2 border-b border-slate-300">
                                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </p>
                                    <ul className="space-y-2">
                                        {assignments.map((a, i) => (
                                            <li key={i} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-semibold ${a.period === 'صباحا' ? 'text-amber-600' : 'text-indigo-600'}`}>{a.period === 'صباحا' ? 'AM' : 'PM'}</span>
                                                    <span className="text-gray-600">{a.time}</span>
                                                </div>
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{a.location}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg">سيظهر جدول المراقب المختار هنا.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueryView;