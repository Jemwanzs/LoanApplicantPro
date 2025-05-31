import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Filter } from 'lucide-react';

interface DateFilterProps {
  onFilterChange: (fromDate: string, toDate: string, period: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');

  const predefinedPeriods = [
    { key: 'today', label: 'Today' },
    { key: 'this_week', label: 'This Week' },
    { key: 'this_month', label: 'This Month' },
    { key: 'last_month', label: 'Last Month' },
    { key: 'last_3_months', label: 'Last 3 Months' },
    { key: 'last_6_months', label: 'Last 6 Months' },
    { key: 'this_year', label: 'This Year' },
    { key: 'custom', label: 'Custom Range' }
  ];

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    
    const now = new Date();
    let from = '';
    let to = '';
    
    switch (period) {
      case 'today':
        from = to = now.toISOString().split('T')[0];
        break;
      case 'this_week':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        from = startOfWeek.toISOString().split('T')[0];
        to = endOfWeek.toISOString().split('T')[0];
        break;
      case 'this_month':
        from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case 'last_month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        from = lastMonth.toISOString().split('T')[0];
        to = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
        break;
      case 'last_3_months':
        from = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString().split('T')[0];
        to = new Date().toISOString().split('T')[0];
        break;
      case 'last_6_months':
        from = new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString().split('T')[0];
        to = new Date().toISOString().split('T')[0];
        break;
      case 'this_year':
        from = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        to = new Date().toISOString().split('T')[0];
        break;
      case 'custom':
        // Don't auto-set dates for custom range
        return;
    }
    
    if (period !== 'custom') {
      setFromDate(from);
      setToDate(to);
      onFilterChange(from, to, period);
    }
  };

  const handleCustomFilter = () => {
    if (fromDate && toDate) {
      onFilterChange(fromDate, toDate, 'custom');
    }
  };

  // Set default to this month on component mount
  React.useEffect(() => {
    handlePeriodSelect('this_month');
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Date Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Predefined Period Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {predefinedPeriods.map((period) => (
              <Button
                key={period.key}
                variant={selectedPeriod === period.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePeriodSelect(period.key)}
                className="text-xs"
              >
                {period.label}
              </Button>
            ))}
          </div>
          
          {/* Custom Date Range */}
          {selectedPeriod === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="fromDate">From Date</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="toDate">To Date</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <Button onClick={handleCustomFilter}>
                Apply Filter
              </Button>
            </div>
          )}
          
          {/* Show selected range */}
          {fromDate && toDate && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <Calendar className="h-4 w-4 inline mr-2" />
              Showing data from {new Date(fromDate).toLocaleDateString()} to {new Date(toDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DateFilter;