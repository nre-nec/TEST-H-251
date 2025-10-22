import React, { useMemo } from 'react';
import { headers, invigilatorData } from '../data/scheduleData';

const AdminView: React.FC = () => {

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

    // FIX: Replaced JSX.Element with React.ReactNode to resolve TypeScript error.
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