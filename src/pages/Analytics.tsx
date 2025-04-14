import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { 
  Download, 
  Users, 
  DollarSign, 
  BarChart, 
  PieChart as PieChartIcon, 
  Calendar, 
  ClipboardList, 
  UserCheck, 
  FileText, 
  Share2 
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import BasketballLogo from '@/components/BasketballLogo';

const Analytics: React.FC = () => {
  const {
    entries,
    totalRevenue,
    childEntries,
    studentEntries,
    adultEntries,
    maleCount,
    femaleCount,
    otherGenderCount,
  } = useAppContext();
  
  const [selectedReport, setSelectedReport] = useState<string>('sponsorship');

  // Prepare data for revenue by ticket type chart
  const revenueData = [
    { name: 'Child', revenue: childEntries.length * 10, count: childEntries.length },
    { name: 'Student', revenue: studentEntries.length * 15, count: studentEntries.length },
    { name: 'Adult', revenue: adultEntries.length * 20, count: adultEntries.length },
  ];
  
  // Prepare data for gender breakdown
  const genderData = [
    { name: 'Male', value: maleCount },
    { name: 'Female', value: femaleCount },
    { name: 'Other', value: otherGenderCount },
  ];

  // Handle export report
  const handleExportReport = () => {
    toast.success('Report exported successfully');
  };
  
  // Handle share report
  const handleShareReport = () => {
    toast.success('Report link copied to clipboard');
  };

  // Create a custom pie chart label renderer function that avoids overlapping
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    // Only show label if the segment is significant enough (more than 5%)
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    // Position label slightly farther from the pie
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed reports and analytics for sponsors and organizers</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-basketball-orange hover:bg-basketball-orange/90" onClick={handleShareReport}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sponsorship" className="space-y-4">
        <TabsList className="grid grid-cols-3 max-w-lg">
          <TabsTrigger value="sponsorship">Sponsorship</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        {/* Sponsorship Report Tab */}
        <TabsContent value="sponsorship" className="space-y-4">
          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <BasketballLogo size={60} className="mb-4" />
                <h2 className="text-2xl font-bold">Sponsorship Report</h2>
                <p className="text-muted-foreground max-w-md">
                  Comprehensive event metrics and audience demographics for sponsors
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-basketball-orange/10 rounded-full mb-2">
                        <Users className="h-6 w-6 text-basketball-orange" />
                      </div>
                      <h3 className="text-xl font-bold">{entries.length}</h3>
                      <p className="text-sm text-muted-foreground">Total Audience</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-basketball-blue/10 rounded-full mb-2">
                        <UserCheck className="h-6 w-6 text-basketball-blue" />
                      </div>
                      <h3 className="text-xl font-bold">{studentEntries.length}</h3>
                      <p className="text-sm text-muted-foreground">Student Attendees</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-green-100 rounded-full mb-2">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold">R{totalRevenue}</h3>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4">Audience Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Gender Distribution</h4>
                    <div className="h-60">
                      {entries.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={genderData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={renderCustomizedLabel}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {genderData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#0077C2' : index === 1 ? '#FF6B00' : '#33A1FF'} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} attendees`, 'Count']} />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p>No data available</p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-center text-sm">
                      <div>
                        <div className="font-medium">{Math.round((maleCount / Math.max(entries.length, 1)) * 100)}%</div>
                        <div className="text-muted-foreground">Male</div>
                      </div>
                      <div>
                        <div className="font-medium">{Math.round((femaleCount / Math.max(entries.length, 1)) * 100)}%</div>
                        <div className="text-muted-foreground">Female</div>
                      </div>
                      <div>
                        <div className="font-medium">{Math.round((otherGenderCount / Math.max(entries.length, 1)) * 100)}%</div>
                        <div className="text-muted-foreground">Other</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Attendee Breakdown</h4>
                    <div className="h-60">
                      {entries.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={revenueData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={renderCustomizedLabel}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {revenueData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#0077C2' : index === 1 ? '#33A1FF' : '#FF6B00'} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} attendees`, 'Count']} />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p>No data available</p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-center text-sm">
                      <div>
                        <div className="font-medium">{childEntries.length}</div>
                        <div className="text-muted-foreground">Children</div>
                      </div>
                      <div>
                        <div className="font-medium">{studentEntries.length}</div>
                        <div className="text-muted-foreground">Students</div>
                      </div>
                      <div>
                        <div className="font-medium">{adultEntries.length}</div>
                        <div className="text-muted-foreground">Adults</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-basketball-blue/5 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-basketball-blue/10 rounded-full">
                    <ClipboardList className="h-6 w-6 text-basketball-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Sponsorship Highlights</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Key metrics that demonstrate the value and reach of your event
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-basketball-orange flex items-center justify-center text-white text-xs">✓</div>
                        <div>
                          <p className="font-medium">Total Audience Reach: {entries.length} attendees</p>
                          <p className="text-sm text-muted-foreground">Direct engagement opportunity</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-basketball-orange flex items-center justify-center text-white text-xs">✓</div>
                        <div>
                          <p className="font-medium">Student Engagement: {studentEntries.length} students ({Math.round((studentEntries.length / Math.max(entries.length, 1)) * 100)}%)</p>
                          <p className="text-sm text-muted-foreground">Valuable youth demographic market</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-basketball-orange flex items-center justify-center text-white text-xs">✓</div>
                        <div>
                          <p className="font-medium">Gender Diversity: {Math.round((femaleCount / Math.max(entries.length, 1)) * 100)}% female attendance</p>
                          <p className="text-sm text-muted-foreground">Demonstrates broad appeal</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-basketball-orange flex items-center justify-center text-white text-xs">✓</div>
                        <div>
                          <p className="font-medium">Community Impact: R{totalRevenue} total event value</p>
                          <p className="text-sm text-muted-foreground">Shows financial sustainability</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  This report was generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={handleExportReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button className="bg-basketball-orange hover:bg-basketball-orange/90" onClick={handleShareReport}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Analysis</CardTitle>
              <CardDescription>Detailed breakdown of event attendance patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Attendance by Category</h3>
                  <div className="h-80">
                    {entries.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={revenueData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {revenueData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#0077C2' : index === 1 ? '#33A1FF' : '#FF6B00'} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} attendees`, 'Count']} />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No data available</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Gender Distribution</h3>
                  <div className="h-80">
                    {entries.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {genderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#0077C2' : index === 1 ? '#FF6B00' : '#33A1FF'} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} attendees`, 'Count']} />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Key Attendance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-basketball-blue" />
                        <h3 className="text-2xl font-bold">{entries.length}</h3>
                        <p className="text-sm text-muted-foreground">Total Attendance</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <UserCheck className="h-8 w-8 mx-auto mb-2 text-basketball-orange" />
                        <h3 className="text-2xl font-bold">{studentEntries.length}</h3>
                        <p className="text-sm text-muted-foreground">Student Attendees</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <h3 className="text-2xl font-bold">{childEntries.length + adultEntries.length}</h3>
                        <p className="text-sm text-muted-foreground">Child & Adult Attendees</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Revenue Tab - keep existing bar charts for this one as they work well for revenue display */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Financial breakdown and revenue metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Revenue by Category</h3>
                  <div className="h-80">
                    {entries.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={revenueData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="revenue" name="Revenue (R)" fill="#33A1FF" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No data available</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Revenue Distribution</h3>
                  <div className="h-80">
                    {entries.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { name: 'Child', value: childEntries.length * 10 },
                            { name: 'Student', value: studentEntries.length * 15 },
                            { name: 'Adult', value: adultEntries.length * 20 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="value" name="Revenue (R)" stroke="#FF6B00" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h3 className="text-2xl font-bold">R{totalRevenue}</h3>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 text-basketball-blue" />
                        <h3 className="text-2xl font-bold">R{childEntries.length * 10}</h3>
                        <p className="text-sm text-muted-foreground">Child Revenue</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 text-basketball-lightBlue" />
                        <h3 className="text-2xl font-bold">R{studentEntries.length * 15}</h3>
                        <p className="text-sm text-muted-foreground">Student Revenue</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 text-basketball-orange" />
                        <h3 className="text-2xl font-bold">R{adultEntries.length * 20}</h3>
                        <p className="text-sm text-muted-foreground">Adult Revenue</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-basketball-blue/10 rounded-full">
                    <FileText className="h-6 w-6 text-basketball-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Revenue Insights</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Key financial metrics and observations
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-basketball-orange flex items-center justify-center text-white text-xs">✓</div>
                        <div>
                          <p className="font-medium">Total Revenue: R{totalRevenue}</p>
                          <p className="text-sm text-muted-foreground">Overall event value</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-basketball-orange flex items-center justify-center text-white text-xs">✓</div>
                        <div>
                          <p className="font-medium">Average Ticket Value: R{totalRevenue / Math.max(entries.length, 1)}</p>
                          <p className="text-sm text-muted-foreground">Per attendee value</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-basketball-orange flex items-center justify-center text-white text-xs">✓</div>
                        <div>
                          <p className="font-medium">Most Valuable Segment: {
                            (adultEntries.length * 20 >= studentEntries.length * 15 && adultEntries.length * 20 >= childEntries.length * 10)
                              ? 'Adults'
                              : (studentEntries.length * 15 >= childEntries.length * 10)
                                ? 'Students'
                                : 'Children'
                          }</p>
                          <p className="text-sm text-muted-foreground">Highest revenue contribution</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
