
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Users, Ticket, Clock, PieChart } from 'lucide-react';
import BasketballLogo from '@/components/BasketballLogo';
import { useAppContext } from '@/context/AppContext';

const Index = () => {
  const { entries, totalRevenue } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BasketballLogo className="ball-bounce" />
          <div>
            <h1 className="text-3xl font-bold text-basketball-orange">HoopEntry</h1>
            <p className="text-muted-foreground">Basketball Event Entry & Sales Tracker</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="bg-basketball-orange hover:bg-basketball-orange/90">
            <Link to="/entry">
              <Ticket className="mr-2 h-4 w-4" />
              New Entry
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

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
                <PieChart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Categories</p>
                <h2 className="text-3xl font-bold">3</h2>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Ticket className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Entry</p>
                <h2 className="text-lg font-bold">
                  {entries.length > 0 
                    ? new Date(entries[entries.length - 1].timestamp).toLocaleTimeString() 
                    : "No entries yet"}
                </h2>
              </div>
              <div className="p-2 bg-amber-100 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative overflow-hidden rounded-lg border bg-basketball-blue p-8 text-white">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold">Quick Start Guide</h3>
            <p className="mt-2 max-w-md text-basketball-blue-100">
              Process new entries in under 10 seconds and track event metrics in real-time.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white p-1">
                  <span className="block h-4 w-4 rounded-full bg-basketball-orange" />
                </div>
                <p>Enter basic attendee info</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white p-1">
                  <span className="block h-4 w-4 rounded-full bg-basketball-orange" />
                </div>
                <p>System determines ticket price</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white p-1">
                  <span className="block h-4 w-4 rounded-full bg-basketball-orange" />
                </div>
                <p>Record payment and generate reports</p>
              </div>
            </div>
            <Button asChild className="mt-6 bg-white text-basketball-blue hover:bg-white/90">
              <Link to="/entry">
                <Ticket className="mr-2 h-4 w-4" />
                Start Processing Entries
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Basketball-themed background elements */}
        <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full border-[16px] border-basketball-lightBlue/20 opacity-20"></div>
        <div className="absolute -right-10 -bottom-10 h-[200px] w-[200px] rounded-full border-[12px] border-basketball-lightBlue/20 opacity-20"></div>
      </div>

      {entries.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Recent Entries</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Time</th>
                    <th className="pb-2 text-left font-medium">Type</th>
                    <th className="pb-2 text-left font-medium">Gender</th>
                    <th className="pb-2 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {[...entries].reverse().slice(0, 5).map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="py-2">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2">{entry.ticketType}</td>
                      <td className="py-2">{entry.gender}</td>
                      <td className="py-2 text-right">R{entry.ticketPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {entries.length > 5 && (
              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link to="/dashboard">View All Entries</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
