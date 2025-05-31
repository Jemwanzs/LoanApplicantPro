import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Trash2, Plus, Settings as SettingsIcon, Palette, Clock, Building2, Link, Copy, CheckCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const { company, updateCompanySettings, generatePublicLink, formatAmount } = useAppContext();
  const [loanTypes, setLoanTypes] = useState<string[]>([]);
  const [newLoanType, setNewLoanType] = useState('');
  const [loanPeriods, setLoanPeriods] = useState<number[]>([]);
  const [newPeriod, setNewPeriod] = useState('');
  const [brandColor, setBrandColor] = useState('#f97316');
  const [companyName, setCompanyName] = useState('');
  const [publicLink, setPublicLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (company) {
      setLoanTypes(company.loanTypes || []);
      setLoanPeriods(company.loanPeriods || []);
      setBrandColor(company.brandColor || '#f97316');
      setCompanyName(company.name || '');
      setPublicLink(company.publicFormLink || '');
    }
  }, [company]);

  const addLoanType = () => {
    if (!newLoanType.trim()) {
      toast({ title: "Error", description: "Please enter a loan type", variant: "destructive" });
      return;
    }
    if (loanTypes.includes(newLoanType.trim())) {
      toast({ title: "Error", description: "Loan type already exists", variant: "destructive" });
      return;
    }
    const updated = [...loanTypes, newLoanType.trim()];
    setLoanTypes(updated);
    setNewLoanType('');
    updateCompanySettings({ loanTypes: updated });
    toast({ title: "Success", description: "Loan type added" });
  };

  const removeLoanType = (index: number) => {
    const updated = loanTypes.filter((_, i) => i !== index);
    setLoanTypes(updated);
    updateCompanySettings({ loanTypes: updated });
    toast({ title: "Success", description: "Loan type removed" });
  };

  const addPeriod = () => {
    const period = parseInt(newPeriod);
    if (!period || period < 1) {
      toast({ title: "Error", description: "Please enter a valid period", variant: "destructive" });
      return;
    }
    if (loanPeriods.includes(period)) {
      toast({ title: "Error", description: "Period already exists", variant: "destructive" });
      return;
    }
    const updated = [...loanPeriods, period].sort((a, b) => a - b);
    setLoanPeriods(updated);
    setNewPeriod('');
    updateCompanySettings({ loanPeriods: updated });
    toast({ title: "Success", description: "Loan period added" });
  };

  const removePeriod = (index: number) => {
    const updated = loanPeriods.filter((_, i) => i !== index);
    setLoanPeriods(updated);
    updateCompanySettings({ loanPeriods: updated });
    toast({ title: "Success", description: "Loan period removed" });
  };

  const updateBrandColor = (color: string) => {
    setBrandColor(color);
    const lightColor = color + '33'; // Add transparency for light variant
    updateCompanySettings({ brandColor: color, brandColorLight: lightColor });
  };

  const handleGenerateLink = () => {
    if (!company?.settingsCompleted) {
      toast({ title: "Error", description: "Complete all settings first", variant: "destructive" });
      return;
    }
    const link = generatePublicLink();
    setPublicLink(link);
    toast({ title: "Success", description: "Public form link generated!" });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast({ title: "Copied!", description: "Link copied to clipboard" });
  };

  const isSettingsComplete = loanTypes.length > 0 && loanPeriods.length > 0;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="h-5 w-5 brand-text" />
        <h1 className="text-xl font-semibold">Settings</h1>
        {isSettingsComplete && <CheckCircle className="h-4 w-4 text-green-500" />}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Loan Types */}
        <Card className="compact-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Loan Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Personal Loan"
                value={newLoanType}
                onChange={(e) => setNewLoanType(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLoanType()}
                className="h-7 text-xs"
              />
              <Button onClick={addLoanType} size="sm" className="h-7 px-2 brand-bg hover:brand-hover">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {loanTypes.map((type, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded text-xs">
                  <span>{type}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeLoanType(index)} className="h-6 w-6 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loan Periods */}
        <Card className="compact-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Loan Periods (Months)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 12"
                type="number"
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPeriod()}
                className="h-7 text-xs"
              />
              <Button onClick={addPeriod} size="sm" className="h-7 px-2 brand-bg hover:brand-hover">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {loanPeriods.map((period, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded text-xs">
                  <span>{period} months</span>
                  <Button variant="ghost" size="sm" onClick={() => removePeriod(index)} className="h-6 w-6 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Settings */}
        <Card className="compact-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Brand Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="brandColor" className="text-xs">Brand Color</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="brandColor"
                  type="color"
                  value={brandColor}
                  onChange={(e) => updateBrandColor(e.target.value)}
                  className="h-7 w-16"
                />
                <span className="text-xs text-muted-foreground">{brandColor}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public Form Link */}
        <Card className="compact-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Link className="h-4 w-4" />
              Public Application Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isSettingsComplete && (
              <p className="text-xs text-muted-foreground">Complete loan types and periods first</p>
            )}
            
            <Button 
              onClick={handleGenerateLink} 
              disabled={!isSettingsComplete}
              className="w-full h-7 text-xs brand-bg hover:brand-hover"
            >
              {publicLink ? 'Regenerate Link' : 'Generate Link'}
            </Button>
            
            {publicLink && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    value={publicLink} 
                    readOnly 
                    className="h-7 text-xs"
                  />
                  <Button 
                    onClick={copyLink} 
                    size="sm" 
                    className="h-7 px-2"
                    variant={linkCopied ? "default" : "outline"}
                  >
                    {linkCopied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Share this link for public applications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;