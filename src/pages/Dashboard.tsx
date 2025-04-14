
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { ArrowDown, Download, Users, DollarSign, Ticket, BarChart } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const Dashboard: React.FC = () => {
  const {
    entries,
    totalRevenue,
    childEntries,
    studentEntries,
    adultEntries,
    maleCount,
    femaleCount,
    otherGenderCount,
    entriesByHour,
    resetEntries,
  } = useAppContext();

  // Prepare data for pie charts
  const ticketTypeData = [
    { name: 'Child', value: childEntries.length, color: '#0077C2' },
    { name: 'Student', value: studentEntries.length, color: '#33A1FF' },
    { name: 'Adult', value: adultEntries.length, color: '#FF6B00' },
  ];

  const genderData = [
    { name: 'Male', value: maleCount, color: '#0077C2' },
    { name: 'Female', value: femaleCount, color: '#FF6B00' },
    { name: 'Other', value: otherGenderCount, color: '#33A1FF' },
  ];

  // Prepare data for hourly entries chart
  const hourlyData = Object.entries(entriesByHour).map(([hour, count]) => ({
    hour,
    count,
  }));

  // Function to handle exporting data to CSV
  const handleExportCSV = () => {
    // Convert entries to CSV format
    const headers = ['ID', 'Time', 'Name', 'Age', 'Gender', 'Is Student', 'Card Verified', 'Ticket Type', 'Price', 'Payment'];
    
    const csvRows = entries.map(entry => [
      entry.id,
      new Date(entry.timestamp).toLocaleString(),
      entry.name || 'N/A',
      entry.age,
      entry.gender,
      entry.isStudent ? 'Yes' : 'No',
      entry.studentCardVerified ? 'Yes' : 'No',
      entry.ticketType,
      entry.ticketPrice,
      entry.paymentMethod
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hoopentry-export-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Exported data to CSV');
  };
  
  // Handle reset all entries (for demonstration purposes)
  const handleResetEntries = () => {
    if (confirm('Are you sure you want to reset all entries? This cannot be undone.')) {
      resetEntries();
      toast.success('All entries have been reset');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Real-time event statistics and metrics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          {/* For development purposes only */}
          <Button variant="outline" onClick={handleResetEntries} className="text-destructive">
            <ArrowDown className="mr-2 h-4 w-4" />
            Reset Data
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                <h2 className="text-3xl font-bold">{entries.length}</h2>
              </div>
              <div className="p-2 bg-basketball-blue/10 rounded-full">
                <Users className="h-6 w-6 text-basketball-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h2 className="text-3xl font-bold">R{totalRevenue}</h2>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Child Entries</p>
                <h2 className="text-3xl font-bold">{childEntries.length}</h2>
              </div>
              <div className="p-2 bg-basketball-blue/10 rounded-full">
                <Ticket className="h-6 w-6 text-basketball-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Student Entries</p>
                <h2 className="text-3xl font-bold">{studentEntries.length}</h2>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {entries.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ticketTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ticketTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Child (R10)</p>
                <p className="text-2xl font-bold text-basketball-blue">{childEntries.length}</p>
                <p className="text-sm text-muted-foreground">R{childEntries.length * 10}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Student (R15)</p>
                <p className="text-2xl font-bold text-basketball-lightBlue">{studentEntries.length}</p>
                <p className="text-sm text-muted-foreground">R{studentEntries.length * 15}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Adult (R20)</p>
                <p className="text-2xl font-bold text-basketball-orange">{adultEntries.length}</p>
                <p className="text-sm text-muted-foreground">R{adultEntries.length * 20}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {entries.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Male</p>
                <p className="text-2xl font-bold text-basketball-blue">{maleCount}</p>
                <p className="text-sm text-muted-foreground">
                  {entries.length > 0 ? `${Math.round((maleCount / entries.length) * 100)}%` : '0%'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Female</p>
                <p className="text-2xl font-bold text-basketball-orange">{femaleCount}</p>
                <p className="text-sm text-muted-foreground">
                  {entries.length > 0 ? `${Math.round((femaleCount / entries.length) * 100)}%` : '0%'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Other</p>
                <p className="text-2xl font-bold text-basketball-lightBlue">{otherGenderCount}</p>
                <p className="text-sm text-muted-foreground">
                  {entries.length > 0 ? `${Math.round((otherGenderCount / entries.length) * 100)}%` : '0%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entry by hour chart */}
      <Card>
        <CardHeader>
          <CardTitle>Entry by Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {hourlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={hourlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Entries" fill="#FF6B00" />
                </RechartsBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent entries table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Time</th>
                    <th className="pb-2 text-left font-medium">Name</th>
                    <th className="pb-2 text-left font-medium">Age</th>
                    <th className="pb-2 text-left font-medium">Gender</th>
                    <th className="pb-2 text-left font-medium">Ticket</th>
                    <th className="pb-2 text-left font-medium">Payment</th>
                    <th className="pb-2 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[...entries].reverse().map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="py-2">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2">{entry.name || '-'}</td>
                      <td className="py-2">{entry.age}</td>
                      <td className="py-2">{entry.gender}</td>
                      <td className="py-2">{entry.ticketType}</td>
                      <td className="py-2">{entry.paymentMethod}</td>
                      <td className="py-2 text-right">R{entry.ticketPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">No entries recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
