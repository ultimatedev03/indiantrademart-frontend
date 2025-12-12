'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import axios from 'axios';
import { EmptyState } from '@/shared/components/EmptyState';
import EmployeeRegistrationModal from '@/components/EmployeeRegistrationModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface Employee {
  id: number;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  workEmail?: string;
  email?: string;
  workPhone?: string;
  phone?: string;
  department: string;
  designation: string;
  status: string;
  createdAt?: string;
  joiningDate?: string;
  workLocation?: string;
}

function HRDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeToday: 0,
    onLeave: 0,
    departments: 0
  });
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  useEffect(() => {
    fetchEmployees();
    fetchStats();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/employee/profiles`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('📥 Full response:', response.data);
      
      // Backend returns: {success: true, message: "...", data: {content: [...], totalElements, totalPages, ...}}
      let employeeList: Employee[] = [];
      
      if (response.data?.data?.content) {
        employeeList = response.data.data.content;
      } else if (response.data?.content) {
        employeeList = response.data.content;
      } else if (Array.isArray(response.data)) {
        employeeList = response.data;
      }
      
      console.log('✅ Fetched employees:', employeeList);
      setEmployees(employeeList);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/employee/profiles/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(response.data || stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };


  return (
    <div className="space-y-6 min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">HR Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-700">Total Employees</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.totalEmployees}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-700">Active Today</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.activeToday}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-700">On Leave</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.onLeave}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-700">Departments</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.departments}</p>
            </div>
          </div>
        </div>

        {/* Employee Management Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Employee Management</h3>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Create Employee
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : employees.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No employees yet"
              description="Create your first employee by clicking the 'Create Employee' button above."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.map((emp) => {
                    const displayName = emp.displayName || `${emp.firstName} ${emp.lastName}`.trim() || 'Unknown';
                    const displayEmail = emp.workEmail || emp.email || 'N/A';
                    const displayDate = emp.joiningDate || emp.createdAt;
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{displayName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{displayEmail}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{emp.department || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {emp.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {displayDate ? new Date(displayDate).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Employee Modal */}
      {showCreateForm && (
        <EmployeeRegistrationModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => fetchEmployees()}
        />
      )}
    </div>
  );
}

export default function HrDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/auth/hr/login');
      return;
    }

    const role = user?.role?.toString().toLowerCase() || '';
    if (role === 'hr' || role === 'support') {
      setCanRender(true);
    } else {
      router.replace('/');
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !canRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <HRDashboard />;
}
