
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MilestonesTracker from '@/components/MilestonesTracker';
import EquityChart from '@/components/EquityChart';
import AddFounderForm from '@/components/AddFounderForm';
import FounderScoring from '@/components/FounderScoring';
import HistoryTable from '@/components/HistoryTable';
import ContributionForm from '@/components/ContributionForm';
import ContributionsList from '@/components/ContributionsList';
import ContributionWeightConfigurator from '@/components/ContributionWeightConfigurator';
import StepSummary from '@/components/StepSummary';
import { useFounders, useMilestones } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { founders } = useFounders();
  const { currentMilestone } = useMilestones();
  const [selectedFounderId, setSelectedFounderId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <motion.main
        className="flex-grow container mx-auto px-4 py-8 max-w-7xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div variants={itemVariants} className="md:col-span-3">
            <MilestonesTracker />
          </motion.div>

          {currentMilestone && showSummary && (
            <motion.div variants={itemVariants} className="md:col-span-3">
              <StepSummary milestone={currentMilestone} founders={founders} />
            </motion.div>
          )}
          
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <AddFounderForm />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="shadow-sm">
                  <CardContent className="p-0">
                    <motion.div 
                      className="h-[300px] flex items-center justify-center p-4"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      <EquityChart founders={founders} />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <ContributionWeightConfigurator />
              </motion.div>
              
              {selectedFounderId && (
                <motion.div 
                  variants={itemVariants}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <ContributionForm founderId={selectedFounderId} />
                </motion.div>
              )}
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                {currentMilestone?.name} - Founder Analysis
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSummary(!showSummary)}
                className="flex items-center gap-1"
              >
                {showSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span>{showSummary ? 'Hide Summary' : 'Show Summary'}</span>
              </Button>
            </div>

            <motion.div 
              className="bg-white rounded-lg shadow-sm p-6 border"
              variants={itemVariants}
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-gray-500 mb-6">
                Score each founder's contribution across the seven criteria and add specific contributions by type.
                The equity distribution will update automatically based on the total scores and contributions.
              </p>
              
              {founders.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center py-12 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                    animate={{ 
                      backgroundColor: ["#9b87f520", "#7E69AB20", "#9b87f520"],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-lg font-medium">No Co-founders Added</h3>
                  <p className="text-gray-500 mt-2">
                    Start by adding co-founders to assess equity distribution.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-6"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {founders.map(founder => (
                    <motion.div
                      key={founder.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: { type: 'spring', stiffness: 100, damping: 8 }
                        }
                      }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <Tabs defaultValue="scoring">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: founder.color }}
                                ></div>
                                <h3 className="font-semibold">
                                  {founder.name} - {founder.role} 
                                  <span className="ml-2 font-bold text-primary">
                                    ({founder.equityPercentage.toFixed(2)}%)
                                  </span>
                                </h3>
                              </div>
                              <TabsList>
                                <TabsTrigger value="scoring">Scoring</TabsTrigger>
                                <TabsTrigger value="contributions">
                                  Contributions ({founder.contributions?.length || 0})
                                </TabsTrigger>
                              </TabsList>
                            </div>

                            <TabsContent value="scoring">
                              <FounderScoring founder={founder} />
                            </TabsContent>

                            <TabsContent value="contributions">
                              <div className="space-y-4">
                                {selectedFounderId === founder.id ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setSelectedFounderId(null)}
                                  >
                                    Cancel Adding Contribution
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    onClick={() => setSelectedFounderId(founder.id)}
                                  >
                                    Add New Contribution
                                  </Button>
                                )}
                                
                                <ContributionsList 
                                  founderId={founder.id} 
                                  contributions={founder.contributions || []} 
                                />
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <HistoryTable />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Index;
