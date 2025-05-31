import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { Building2, User, Phone, Mail, DollarSign, Calendar, FileText } from 'lucide-react';

const PublicApplication: React.FC = () => {
  const { companyId } = useParams();
  const { addApplication, formatAmount } = useAppContext();
  const [company, setCompany] = useState<any>(null);
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    loanType: '',
    amount: '',
    period: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In real app, fetch company data by ID
    // For demo, use localStorage
    const savedCompany = localStorage.getItem('company');
    if (savedCompany) {
      const comp = JSON.parse(savedCompany);
      if (comp.id === companyId && comp.settingsCompleted) {
        setCompany(comp);
        // Apply brand colors
        document.documentElement.style.setProperty('--brand-color', comp.brandColor);
        document.documentElement.style.setProperty('--brand-color-light', comp.brandColorLight);
      }
    }
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company || !company.settingsCompleted) {
      alert('This application form is not available.');
      return;
    }

    setLoading(true);
    
    try {
      // Format amount with commas
      const amount = parseInt(formData.amount.replace(/,/g, ''));
      const period = parseInt(formData.period);
      
      addApplication({
        applicantName: formData.applicantName,
        email: formData.email,
        phone: formData.phone,
        loanType: formData.loanType,
        amount,
        period,
        status: 'pending'
      });
      
      setSubmitted(true);
      
      // Send WhatsApp notification to company
      const message = `🔔 *New Loan Application*\n\n` +
        `*Company:* ${company.name}\n` +
        `*Applicant:* ${formData.applicantName}\n` +
        `*Amount:* KES ${formatAmount(amount)}\n` +
        `*Type:* ${formData.loanType}\n` +
        `*Period:* ${period} months\n\n` +
        `Please check your dashboard to review this application.`;
      
      const whatsappUrl = `https://wa.me/254798993404?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Add commas
    const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setFormData(prev => ({ ...prev, amount: formatted }));
  };

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md compact-card">
          <CardContent className="text-center py-8">
            <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Application Not Available</h2>
            <p className="text-sm text-muted-foreground">
              This loan application form is not available or has been disabled.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: company.brandColorLight || '#fed7aa' }}>
        <Card className="w-full max-w-md compact-card">
          <CardContent className="text-center py-8">
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: company.brandColor }}>
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Application Submitted!</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Thank you for your application. We will review it and get back to you soon.
            </p>
            <p className="text-xs text-muted-foreground">
              Application ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: company.brandColorLight || '#fed7aa' }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: company.brandColor }}>
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-semibold" style={{ color: company.brandColor }}>
            {company.name}
          </h1>
          <p className="text-sm text-muted-foreground">Loan Application Form</p>
        </div>

        <Card className="compact-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-center">Apply for a Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-xs">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.applicantName}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicantName: e.target.value }))}
                    className="pl-7 h-8 text-xs"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-xs">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-7 h-8 text-xs"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-7 h-8 text-xs"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="loanType" className="text-xs">Loan Type</Label>
                <Select value={formData.loanType} onValueChange={(value) => setFormData(prev => ({ ...prev, loanType: value }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {company.loanTypes.map((type: string) => (
                      <SelectItem key={type} value={type} className="text-xs">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount" className="text-xs">Loan Amount (KES)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="pl-7 h-8 text-xs"
                    placeholder="Enter amount (e.g., 50,000)"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="period" className="text-xs">Repayment Period</Label>
                <Select value={formData.period} onValueChange={(value) => setFormData(prev => ({ ...prev, period: value }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {company.loanPeriods.map((period: number) => (
                      <SelectItem key={period} value={period.toString()} className="text-xs">
                        {period} months
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-8 text-xs font-medium"
                style={{ backgroundColor: company.brandColor }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            Powered by {company.name} Loan Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicApplication;