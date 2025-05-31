import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import ApplicationCard from '@/components/ApplicationCard';
import { Search, Download, Filter, FileText, Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const Applications: React.FC = () => {
  const { applications, updateApplicationStatus, formatAmount } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredApplications, setFilteredApplications] = useState(applications);

  useEffect(() => {
    let filtered = applications;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.loanType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Phone', 'Email', 'Loan Type', 'Amount', 'Period', 'Status', 'Date'],
      ...filteredApplications.map(app => [
        app.applicantName,
        app.phone,
        app.email,
        app.loanType,
        app.amount,
        `${app.period} months`,
        app.status,
        new Date(app.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan-applications.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const declined = applications.filter(app => app.status === 'declined').length;
    const totalAmount = applications.reduce((sum, app) => sum + app.amount, 0);
    
    return { total, pending, approved, declined, totalAmount };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 brand-text" />
          <h1 className="text-xl font-semibold">Applications</h1>
        </div>
        <Button onClick={exportToCSV} size="sm" className="h-7 text-xs brand-bg hover:brand-hover">
          <Download className="h-3 w-3 mr-1" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="compact-card">
          <CardContent className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-semibold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="compact-card">
          <CardContent className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-sm font-semibold">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="compact-card">
          <CardContent className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-sm font-semibold">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="compact-card">
          <CardContent className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Declined</p>
              <p className="text-sm font-semibold">{stats.declined}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="compact-card">
          <CardContent>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-sm font-semibold brand-text">KES {formatAmount(stats.totalAmount)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="compact-card">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-7 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-3 w-3 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApplications.length === 0 ? (
          <Card className="compact-card">
            <CardContent className="text-center py-8">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No applications match your filters.' 
                  : 'No applications yet. Share your public form link to start receiving applications.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onStatusUpdate={updateApplicationStatus}
            />
          ))
        )}
      </div>
      
      {filteredApplications.length > 0 && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        </div>
      )}
    </div>
  );
};

export default Applications;