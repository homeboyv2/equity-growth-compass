
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MilestonesTracker from '@/components/MilestonesTracker';
import EquityChart from '@/components/EquityChart';
import AddFounderForm from '@/components/AddFounderForm';
import FounderScoring from '@/components/FounderScoring';
import HistoryTable from '@/components/HistoryTable';
import { useFounders, useMilestones } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { founders } = useFounders();
  const { currentMilestone } = useMilestones();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-3">
            <MilestonesTracker />
          </div>
          
          <div className="md:col-span-1">
            <div className="space-y-6">
              <AddFounderForm />
              
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <div className="h-[300px] flex items-center justify-center p-4">
                    <EquityChart founders={founders} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-lg font-semibold mb-4">
                {currentMilestone?.name} - Founder Contribution Scoring
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Score each founder's contribution across the seven criteria. 
                The equity distribution will update automatically based on the total scores.
              </p>
              
              {founders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">No Co-founders Added</h3>
                  <p className="text-gray-500 mt-2">
                    Start by adding co-founders to assess equity distribution.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {founders.map(founder => (
                    <FounderScoring
                      key={founder.id}
                      founder={founder}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <HistoryTable />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
