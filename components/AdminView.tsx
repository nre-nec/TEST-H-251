import React, { useMemo, useState } from 'react';
import { headers, invigilatorData } from '../data/scheduleData.ts';

const AdminView: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('');

    const summary = useMemo(() => {
        const totalInvigilators = invigilatorData.length;
        const totalSlots = headers.length;
        let totalAssignments = 0;
        const assignmentsPerSlot: { [key: string]: number } = {};
        headers.forEach(h => assignmentsPerSlot[h] = 0);

        invigilatorData.forEach(inv => {
            const assignments = Object.keys(inv.schedule).length;
            totalAssignments += assignments;
            Object.keys(inv.schedule).forEach(slot => {
                if (assignmentsPerSlot[slot] !== undefined) {
                    assignmentsPerSlot[slot]++;
                }
            });
        });
        
        const busiestSlot = Object.entries(assignmentsPerSlot).reduce((max, entry) => entry[1] > max[1] ? entry : max, ["", 0]);
        const leastBusySlot = Object.entries(assignmentsPerSlot).reduce((min, entry) => entry[1] < min[1] ? entry : min, ["", Infinity]);

        return { totalInvigilators, totalSlots, totalAssignments, busiestSlot, leastBusySlot, assignmentsPerSlot };
    }, []);
    
    const availableDates = useMemo(() => {
        const dates = new Set(headers.map(h => {
            const match = h.match(/(\d{4}-\d{2}-\d{2})/);
            return match ? match[1] : null;
        }).filter((d): d is string => d !== null));
        return Array.from(dates).sort();
    }, []);

    const availablePeriods = useMemo(() => {
        if (!selectedDate) return [];
        const periods = headers
            .filter(h => h.includes(selectedDate))
            .map(h => {
                const simplePeriodMatch = h.match(/(\d{1,2}:\d{2}-\d{1,2}:\d{2})-(صباحا|مساء)/)
                const simplePeriod = simplePeriodMatch ? `${simplePeriodMatch[1]}-${simplePeriodMatch[2]}` : null;
                return simplePeriod;
            })
            .filter((p): p is string => p !== null);
        return Array.from(new Set(periods));
    }, [selectedDate]);

    const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDate(e.target.value);
        setSelectedPeriod('');
    };

    const queryResults = useMemo(() => {
        if (!selectedDate || !selectedPeriod) return null;

        const fullHeader = headers.find(h => h.includes(selectedDate) && h.includes(selectedPeriod));
        if (!fullHeader) return null;

        const assignments = invigilatorData
            .filter(inv => inv.schedule[fullHeader])
            .map(inv => ({
                name: inv.name,
                location: inv.schedule[fullHeader],
            }));

        if (assignments.length === 0) return {};

        const groupedByLocation = assignments.reduce((acc, curr) => {
            const location = curr.location;
            if (!acc[location]) {
                acc[location] = [];
            }
            acc[location].push(curr.name);
            return acc;
        }, {} as { [key: string]: string[] });

        return groupedByLocation;
    }, [selectedDate, selectedPeriod]);

    const handlePrint = () => {
        if (!queryResults || Object.keys(queryResults).length === 0) return;

        const formattedDate = new Date(selectedDate).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const printWindow = window.open('', '_blank');
        
        const tableRows = Object.entries(queryResults).map(([location, invigilators]) => {
            const invigilatorList = (invigilators as string[]).map(name => `<li>${name}</li>`).join('');
            return `
                <tr>
                    <td>${location}</td>
                    <td><ul style="margin:0; padding:0; list-style-type: none;">${invigilatorList}</ul></td>
                </tr>
            `;
        }).join('');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>طباعة تقرير المراقبة - ${formattedDate}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
                <style>
                    body { 
                        font-family: 'Cairo', sans-serif; 
                        margin: 20px; 
                    }
                    h1, h2, h3 { text-align: center; color: #333; }
                    h3 { font-weight: normal; }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 20px; 
                    }
                    th, td { 
                        border: 1px solid #ccc; 
                        padding: 10px; 
                        text-align: right; 
                        vertical-align: top;
                    }
                    thead { background-color: #f2f2f2; }
                    th { font-weight: bold; }
                    @media print {
                        @page { size: A4; margin: 1.5cm; }
                        body { -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <h1>تقرير المراقبة</h1>
                <h2>${formattedDate}</h2>
                <h3>الفترة: ${selectedPeriod}</h3>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 25%;">القاعة</th>
                            <th>المراقبون</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };


    const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-6 transition-transform duration-300 hover:-translate-y-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">لوحة لجنة الاختبارات</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="إجمالي المراقبين" value={summary.totalInvigilators} color="bg-blue-100 text-blue-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="إجمالي الفترات" value={summary.totalSlots} color="bg-green-100 text-green-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="إجمالي التكليفات" value={summary.totalAssignments} color="bg-yellow-100 text-yellow-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">استعلام عن فترة مراقبة</h3>
                    {queryResults && Object.keys(queryResults).length > 0 && (
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                            </svg>
                            <span>طباعة</span>
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-1">اختر التاريخ</label>
                        <select id="date-select" value={selectedDate} onChange={handleDateChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="" disabled>-- اختر يوماً --</option>
                            {availableDates.map(date => <option key={date} value={date}>{new Date(date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="period-select" className="block text-sm font-medium text-gray-700 mb-1">اختر الفترة</label>
                        <select id="period-select" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} disabled={!selectedDate} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50">
                            <option value="" disabled>-- اختر فترة --</option>
                            {availablePeriods.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-4 min-h-[200px]">
                    {queryResults ? (
                        Object.keys(queryResults).length > 0 ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(queryResults).map(([location, invigilators], index) => (
                                    <div key={location} className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                        <h4 className="font-bold text-lg text-blue-600 mb-2">قاعة: {location}</h4>
                                        <ul className="space-y-1 list-disc list-inside">
                                            {(invigilators as string[]).map(name => <li key={name} className="text-gray-700">{name}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <p>لا يوجد مراقبون مكلفون في هذه الفترة.</p>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p>يرجى اختيار تاريخ وفترة لعرض المراقبين.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">قائمة المراقبين</h3>
                <div className="max-h-96 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        {invigilatorData.map((inv, index) => (
                             <li key={inv.name} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <span className="font-medium text-gray-900">{inv.name}</span>
                                </div>
                                <span className="text-sm text-gray-500">{Object.keys(inv.schedule).length} تكليفات</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default AdminView;