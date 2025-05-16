
import { jsPDF } from 'jspdf';
import { AppState, Founder, Milestone } from '../types';
import autoTable from 'jspdf-autotable';

// Extend the jsPDF type to correctly include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export const generatePDF = (state: AppState): void => {
  const { founders, history, milestones, contributionWeights } = state;
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(90, 50, 168); // Purple color
  doc.text('Startup Equity Distribution Report', 20, 20);
  
  // Current date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

  // Current Equity Distribution
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Current Equity Distribution', 20, 40);

  // Table for current equity
  const currentEquityData = founders.map(founder => [
    founder.name,
    founder.role,
    `${founder.equityPercentage.toFixed(2)}%`,
  ]);

  doc.autoTable({
    startY: 45,
    head: [['Co-founder', 'Role', 'Equity']],
    body: currentEquityData,
    headStyles: { fillColor: [90, 50, 168] },
  });

  // Get the final Y position after the table
  const finalY1 = doc.lastAutoTable.finalY;

  // Contribution Weights Summary
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Contribution Weights', 20, finalY1 + 15);
  
  const contributionWeightsData = [
    ['Cash Contributions', `${contributionWeights.cash.toFixed(2)}x`],
    ['Time Investments', `${contributionWeights.time.toFixed(2)}x`],
    ['Skills & Expertise', `${contributionWeights.skills.toFixed(2)}x`],
  ];
  
  doc.autoTable({
    startY: finalY1 + 20,
    head: [['Contribution Type', 'Weight Multiplier']],
    body: contributionWeightsData,
    headStyles: { fillColor: [120, 80, 198] },
  });
  
  const finalY2 = doc.lastAutoTable.finalY;
  
  // Milestone Weights
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Milestone Weights', 20, finalY2 + 15);
  
  const milestoneWeightsData = milestones.map(milestone => [
    milestone.name,
    `${milestone.weight.toFixed(2)}x`,
    milestone.completed ? 'Completed' : milestone.current ? 'In Progress' : 'Pending',
  ]);
  
  doc.autoTable({
    startY: finalY2 + 20,
    head: [['Milestone', 'Weight Multiplier', 'Status']],
    body: milestoneWeightsData,
    headStyles: { fillColor: [120, 80, 198] },
  });
  
  const finalY3 = doc.lastAutoTable.finalY;

  // Global Score Summary
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Global Score Summary', 20, finalY3 + 15);
  
  // Calculate total scores with all weights applied
  const totalScores = founders.reduce((total, founder) => {
    // Base scores from criteria
    const criteriaTotal = Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
    
    // Contribution multiplier
    const contributionMultiplier = founder.contributions ? 
      ((founder.contributions.cash || 0) * contributionWeights.cash +
       (founder.contributions.time || 0) * contributionWeights.time +
       (founder.contributions.skills || 0) * contributionWeights.skills) / 3 : 1;
    
    return total + criteriaTotal * Math.max(0.1, contributionMultiplier);
  }, 0);
  
  doc.setFontSize(12);
  doc.text(`Total Team Score: ${totalScores.toFixed(1)}`, 20, finalY3 + 25);
  doc.text(`Average Founder Score: ${founders.length ? (totalScores / founders.length).toFixed(1) : "0"}`, 20, finalY3 + 35);
  
  // Add new page for detailed founder data
  doc.addPage();

  // Detailed Founder Contributions
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Founder Contributions & Scoring', 20, 20);
  
  let yPosition = 30;
  
  // For each founder, create a section with their contributions
  for (const founder of founders) {
    // Skip to new page if needed
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(90, 50, 168);
    doc.text(`${founder.name} - ${founder.role}`, 20, yPosition);
    yPosition += 10;
    
    // Contribution data
    const contributionData = [
      ['Cash Contributions', founder.contributions?.cash || 0, `${contributionWeights.cash.toFixed(2)}x`],
      ['Time Investments', founder.contributions?.time || 0, `${contributionWeights.time.toFixed(2)}x`],
      ['Skills & Expertise', founder.contributions?.skills || 0, `${contributionWeights.skills.toFixed(2)}x`],
    ];
    
    doc.autoTable({
      startY: yPosition,
      head: [['Contribution Type', 'Value', 'Weight Multiplier']],
      body: contributionData,
      headStyles: { fillColor: [120, 80, 198] },
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Scoring details
    const totalFounderScore = Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
    
    const scoreData = [
      ['Role in Project', founder.scores.role, `${totalFounderScore ? ((founder.scores.role / totalFounderScore) * 100).toFixed(1) : "0"}%`],
      ['Usefulness', founder.scores.usefulness, `${totalFounderScore ? ((founder.scores.usefulness / totalFounderScore) * 100).toFixed(1) : "0"}%`],
      ['Idea Contribution', founder.scores.ideaContribution, `${totalFounderScore ? ((founder.scores.ideaContribution / totalFounderScore) * 100).toFixed(1) : "0"}%`],
      ['Business Plan', founder.scores.businessPlan, `${totalFounderScore ? ((founder.scores.businessPlan / totalFounderScore) * 100).toFixed(1) : "0"}%`],
      ['Domain Expertise', founder.scores.expertise, `${totalFounderScore ? ((founder.scores.expertise / totalFounderScore) * 100).toFixed(1) : "0"}%`],
      ['Commitment & Risk', founder.scores.commitment, `${totalFounderScore ? ((founder.scores.commitment / totalFounderScore) * 100).toFixed(1) : "0"}%`],
      ['Operations', founder.scores.operations, `${totalFounderScore ? ((founder.scores.operations / totalFounderScore) * 100).toFixed(1) : "0"}%`],
      ['Total Score', totalFounderScore, '100%'],
    ];

    doc.autoTable({
      startY: yPosition,
      head: [['Criterion', 'Score (0-10)', 'Percentage']],
      body: scoreData,
      headStyles: { fillColor: [120, 80, 198] },
      foot: [['Equity Allocation', '', `${founder.equityPercentage.toFixed(2)}%`]],
      footStyles: { fillColor: [90, 50, 168], textColor: [255, 255, 255] },
    });
    
    yPosition = doc.lastAutoTable.finalY + 20;
  }

  // Equity Evolution History
  if (history.length > 0) {
    doc.addPage();
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Equity Evolution History', 20, 20);

    let yPosition = 30;
    for (const entry of history) {
      doc.setFontSize(12);
      doc.setTextColor(90, 50, 168);
      doc.text(
        `Milestone: ${entry.milestoneName} - ${new Date(entry.date).toLocaleDateString()}`,
        20,
        yPosition
      );

      const historyData = entry.founders.map(founder => [
        founder.name,
        `${founder.equityPercentage.toFixed(2)}%`,
      ]);

      doc.autoTable({
        startY: yPosition + 5,
        head: [['Co-founder', 'Equity %']],
        body: historyData,
        headStyles: { fillColor: [120, 80, 198] },
      });

      yPosition = doc.lastAutoTable.finalY + 15;
      
      // Add new page if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
    }
  }

  // Progress Overview
  const completedMilestones = milestones.filter(m => m.completed);
  if (completedMilestones.length > 0 || milestones.some(m => m.current)) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    } else {
      yPosition += 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Startup Progress', 20, yPosition);

    const milestoneData = milestones.map(milestone => [
      milestone.name,
      `${milestone.weight.toFixed(2)}x`,
      milestone.completed ? 'Completed' : milestone.current ? 'In Progress' : 'Pending',
    ]);

    doc.autoTable({
      startY: yPosition + 5,
      head: [['Milestone', 'Weight', 'Status']],
      body: milestoneData,
      headStyles: { fillColor: [90, 50, 168] },
      bodyStyles: {
        textColor: (data) => {
          const status = data.cell.raw;
          if (status === 'Completed') return [0, 128, 0]; // green for completed
          if (status === 'In Progress') return [0, 0, 255]; // blue for in progress
          return [100, 100, 100]; // grey for pending
        },
      },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'Generated by Equity Growth Compass | This document is for informational purposes only.',
      20,
      285
    );
    doc.text(`Page ${i} of ${pageCount}`, 190, 285);
  }

  // Save the PDF
  doc.save('equity-growth-compass-report.pdf');
};
