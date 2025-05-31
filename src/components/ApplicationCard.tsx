import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { Download, Share, Eye, CheckCircle, XCircle, Clock, User, Phone, Mail, DollarSign, Calendar } from 'lucide-react';

interface ApplicationCardProps {
  application: {
    id: string;
    applicantName: string;
    email: string;
    phone: string;
    loanType: string;
    amount: number;
    period: number;
    status: 'pending' | 'approved' | 'declined';
    notes?: string;
    createdAt: string;
  };
  onStatusUpdate: (id: string, status: 'approved' | 'declined', notes?: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onStatusUpdate }) => {
  const { formatAmount } = useAppContext();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'declined': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const shareWhatsApp = () => {
    const message = `*Loan Application*\n\n` +
      `*Name:* ${application.applicantName}\n` +
      `*Phone:* ${application.phone}\n` +
      `*Email:* ${application.email}\n` +
      `*Amount:* KES ${formatAmount(application.amount)}\n` +
      `*Period:* ${application.period} months\n` +
      `*Type:* ${application.loanType}\n` +
      `*Status:* ${application.status.toUpperCase()}\n` +
      `*Date:* ${new Date(application.createdAt).toLocaleDateString()}`;
    
    const whatsappUrl = `https://wa.me/254798993404?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const downloadAsPDF = () => {
    // Simple implementation - in real app, use jsPDF or similar
    const content = `
Loan Application Details

Applicant: ${application.applicantName}
Phone: ${application.phone}
Email: ${application.email}
Loan Type: ${application.loanType}
Amount: KES ${formatAmount(application.amount)}
Period: ${application.period} months
Status: ${application.status}
Submitted: ${new Date(application.createdAt).toLocaleDateString()}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `application-${application.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="compact-card hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Applicant Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium">{application.applicantName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{application.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate">{application.email}</span>
            </div>
          </div>

          {/* Loan Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium brand-text">KES {formatAmount(application.amount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{application.period} months</span>
            </div>
            <div className="text-xs text-muted-foreground">{application.loanType}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(application.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Status & Actions */}
          <div className="space-y-2">
            <Badge className={`${getStatusColor(application.status)} text-xs flex items-center gap-1 w-fit`}>
              {getStatusIcon(application.status)}
              {application.status}
            </Badge>
            
            <div className="flex flex-wrap gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={shareWhatsApp}
                className="h-6 px-2 text-xs"
              >
                <Share className="h-3 w-3" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadAsPDF}
                className="h-6 px-2 text-xs"
              >
                <Download className="h-3 w-3" />
              </Button>
              
              {application.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    onClick={() => onStatusUpdate(application.id, 'approved')}
                    className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => onStatusUpdate(application.id, 'declined')}
                    className="h-6 px-2 text-xs"
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {application.notes && (
          <div className="mt-2 p-2 bg-muted rounded text-xs">
            <span className="font-medium">Notes:</span> {application.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;