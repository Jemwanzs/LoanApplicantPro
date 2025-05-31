import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Application {
  id: string;
  loanAmount: number;
  loanType: string;
  status: 'pending' | 'approved' | 'declined';
  submittedAt: string;
}

interface DashboardChartsProps {
  applications: Application[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ applications }) => {
  const statusCounts = {
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    declined: applications.filter(app => app.status === 'declined').length
  };

  const loanTypes = applications.reduce((acc: any, app) => {
    acc[app.loanType] = (acc[app.loanType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Applications by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-bold text-yellow-600">{statusCounts.pending}</span>
            </div>
            <div className="flex justify-between">
              <span>Approved:</span>
              <span className="font-bold text-green-600">{statusCounts.approved}</span>
            </div>
            <div className="flex justify-between">
              <span>Declined:</span>
              <span className="font-bold text-red-600">{statusCounts.declined}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applications by Loan Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(loanTypes).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span>{type}:</span>
                <span className="font-bold">{count as number}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;