import React, { useMemo } from 'react';
import { headers, invigilatorData } from '../data/scheduleData.ts';

const parseHeader = (header: string) => {
    const match = header.match(/(\d{4}-\d{2}-\d{2})\s?\((\d{1,2}:\d{2}-\d{1,2}:\d{2})-(صباحا|مساء)\)?/);
    if (!match) return { date: header, time: '', period: '' };
    return {
        date: match[1],
        time: match[2],
        period: match[3],
    };
};

const StatCard: React.FC<{ title: string; name: string; value: string | number; color: string; icon: React.ReactNode; }> = ({ title, name, value, color, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-2 transition-transform duration-300 hover:-translate-y-2">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <p className="text-gray-500 font-medium">{title}</p>
        </div>
        <p className="text-xl font-bold text-gray-800 pr-2">{name}</p>
        <p className="text-lg text-gray-600 pr-2">{value} تكليفات</p>
    </div>
);

const StatsView: React.FC = () => {
    const stats = useMemo(() => {
        const invigilatorWorkload = invigilatorData.map(inv => ({
            name: inv.name,
            assignments: Object.keys(inv.schedule).length
        })).sort((a, b) => b.assignments - a.assignments);
        
        const locationDistribution: { [key: string]: number } = {};
        invigilatorData.forEach(inv => {
            Object.values(inv.schedule).forEach(location => {
                locationDistribution[location] = (locationDistribution[location] || 0) + 1;
            });
        });
        const locationData = Object.entries(locationDistribution)
            .map(([name, count]) => ({ name, count }))
            .sort((a,b) => b.count - a.count);

        const scheduleDetails = headers.map(header => {
            const { date, time, period } = parseHeader(header);
            const assignments = invigilatorData.filter(inv => inv.schedule[header]);
            const locations = assignments.map(inv => inv.schedule[header]);

            return {
                date,
                time,
                period,
                invigilatorCount: assignments.length,
                locations: [...new Set(locations)].join(', ')
            };
        });

        return {
            invigilatorWorkload,
            busiestInvigilator: invigilatorWorkload[0],
            leastBusyInvigilator: invigilatorWorkload[invigilatorWorkload.length - 1],
            locationData,
            scheduleDetails
        };
    }, []);

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">إحصائيات المراقبة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    title="المراقب الأكثر تكليفاً" 
                    name={stats.busiestInvigilator.name} 
                    value={stats.busiestInvigilator.assignments} 
                    color="bg-green-100 text-green-600"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                />
                <StatCard 
                    title="المراقب الأقل تكليفاً" 
                    name={stats.leastBusyInvigilator.name} 
                    value={stats.leastBusyInvigilator.assignments} 
                    color="bg-red-100 text-red-600"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6">تفاصيل جدول الاختبارات</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اليوم</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفترة</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">عدد المراقبين</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القاعات المستخدمة</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.scheduleDetails.map((slot, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {new Date(slot.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(slot.date).toLocaleDateString('ar-EG', { weekday: 'long' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="font-semibold">{slot.time}</div>
                                        <div className={`text-xs ${slot.period === 'صباحا' ? 'text-amber-600' : 'text-indigo-600'}`}>
                                            {slot.period}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {slot.invigilatorCount}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {slot.locations || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StatsView;