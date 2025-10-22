import React, { useMemo } from 'react';
import { invigilatorData } from '../data/scheduleData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

        return {
            invigilatorWorkload,
            busiestInvigilator: invigilatorWorkload[0],
            leastBusyInvigilator: invigilatorWorkload[invigilatorWorkload.length - 1],
            locationData
        };
    }, []);

    // FIX: Replaced JSX.Element with React.ReactNode to resolve TypeScript error.
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
                <h3 className="text-xl font-bold text-gray-800 mb-6">توزيع التكليفات على المراقبين</h3>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={stats.invigilatorWorkload.slice(0, 15)} // Top 15 for readability
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                            <Tooltip wrapperClassName="rounded-lg shadow-lg" contentStyle={{ border: 'none', borderRadius: '0.75rem' }}/>
                            <Legend />
                            <Bar dataKey="assignments" name="عدد التكليفات" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <p className="text-center text-sm text-gray-500 mt-4">
                    * يتم عرض أكثر 15 مراقباً تكليفاً
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6">توزيع التكليفات على القاعات</h3>
                <div style={{ width: '100%', height: 400 }}>
                     <ResponsiveContainer>
                        <BarChart
                            data={stats.locationData.slice(0, 15)}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="عدد التكليفات" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <p className="text-center text-sm text-gray-500 mt-4">
                    * يتم عرض أكثر 15 قاعة استخداماً
                </p>
            </div>
        </div>
    );
};

export default StatsView;