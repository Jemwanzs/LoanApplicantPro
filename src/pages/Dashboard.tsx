import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import DateFilter from '@/components/DateFilter';
import Settings from './Settings';
import Applications from './Applications';
import { BarChart3, Users, DollarSign, TrendingUp, Settings as SettingsIcon, FileText, PieChart, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, company, applications, formatAmount, logout } = useAppContext();
  const [filteredApplications, setFilteredApplications] = useState(applications);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  useEffect(() => {
    // Default to this month
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const fromDate = thisMonthStart.toISOString().split('T')[0];
    const toDate = thisMonthEnd.toISOString().split('T')[0];
    setDateRange({ from: fromDate, to: toDate });
    filterApplicationsByDate(fromDate, toDate);
  }, [applications]);

  const filterApplicationsByDate = (fromDate: string, toDate: string) => {
    const filtered = applications.filter(app => {
      const appDate = new Date(app.createdAt).toISOString().split('T')[0];
      return appDate >= fromDate && appDate <= toDate;
    });
    setFilteredApplications(filtered);
  };

  const handleDateFilter = (fromDate: string, toDate: string) => {
    setDateRange({ from: fromDate, to: toDate });
    filterApplicationsByDate(fromDate, toDate);
  };

  // Calculate stats
  const stats = {
    total: filteredApplications.length,
    pending: filteredApplications.filter(app => app.status === 'pending').length,
    approved: filteredApplications.filter(app => app.status === 'approved').length,
    declined: filteredApplications.filter(app => app.status === 'declined').length,
    totalAmount: filteredApplications.reduce((sum, app) => sum + app.amount, 0),
    pendingAmount: filteredApplications.filter(app => app.status === 'pending').reduce((sum, app) => sum + app.amount, 0),
    approvedAmount: filteredApplications.filter(app => app.status === 'approved').reduce((sum, app) => sum + app.amount, 0)
  };

  // Simple chart data
  const chartData = {
    byStatus: [
      { name: 'Pending', value: stats.pending, color: '#f59e0b' },
      { name: 'Approved', value: stats.approved, color: '#10b981' },
      { name: 'Declined', value: stats.declined, color: '#ef4444' }
    ],
    byType: Object.entries(
      filteredApplications.reduce((acc, app) => {
        acc[app.loanType] = (acc[app.loanType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }))
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">{company?.name || 'Dashboard'}</h1>
            <p className="text-xs text-muted-foreground">Welcome, {user?.email}</p>
          </div>
          <Button onClick={logout} variant="outline" size="sm" className="h-7 text-xs">
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="dashboard" className="text-xs flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-xs flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs flex items-center gap-1">
              <SettingsIcon className="h-3 w-3" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            {/* Date Filter */}
            <DateFilter onFilterChange={handleDateFilter} />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="compact-card brand-bg text-white">
                <CardContent className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <div>
                    <p className="text-xs opacity-90">Total</p>
                    <p className="text-sm font-semibold">{stats.total}</p>
                    <p className="text-xs opacity-75">KES {formatAmount(stats.totalAmount)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="compact-card bg-yellow-500 text-white">
                <CardContent className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <div>
                    <p className="text-xs opacity-90">Pending</p>
                    <p className="text-sm font-semibold">{stats.pending}</p>
                    <p className="text-xs opacity-75">KES {formatAmount(stats.pendingAmount)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="compact-card bg-green-500 text-white">
                <CardContent className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <div>
                    <p className="text-xs opacity-90">Approved</p>
                    <p className="text-sm font-semibold">{stats.approved}</p>
                    <p className="text-xs opacity-75">KES {formatAmount(stats.approvedAmount)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="compact-card bg-red-500 text-white">
                <CardContent className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <div>
                    <p className="text-xs opacity-90">Declined</p>
                    <p className="text-sm font-semibold">{stats.declined}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Simple Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="compact-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    By Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {chartData.byStatus.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                          <span className="text-xs">{item.name}</span>
                        </div>
                        <span className="text-xs font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="compact-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    By Loan Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {chartData.byType.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-xs">{item.name}</span>
                        <span className="text-xs font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card className="compact-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No applications yet. Complete settings to generate your public form link.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex justify-between items-center p-2 bg-muted rounded">
                        <div>
                          <div className="text-xs font-medium">{app.applicantName}</div>
                          <div className="text-xs text-muted-foreground">KES {formatAmount(app.amount)}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Applications />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;