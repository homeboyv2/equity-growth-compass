
import { jsPDF } from 'jspdf';
import { AppState, Founder } from '../types';
import 'jspdf-autotable';

// Extend the jsPDF type to correctly include autoTable
declare module 'jspdf' {
  interface jsPDF {
    // Define autoTable as a method returning jsPDF
    autoTable: (options: any) => jsPDF;
  }
}

// Define the global static property to access the previous finalY position
declare global {
  interface Window {
    jspdf: {
      AutoTableOutput: {
        previous: {
          finalY: number;
        };
      };
    };
  }
}

export const generatePDF = (state: AppState): void => {
  const { founders, history, milestones } = state;
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
  const finalY1 = (doc as any).lastAutoTable.finalY;

  // Global Score Summary
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Global Score Summary', 20, finalY1 + 15);
  
  // Calculate total scores
  const totalScores = founders.reduce((total, founder) => {
    return total + Object.values(founder.scores).reduce((sum, score) => sum + score, 0);
  }, 0);
  
  doc.setFontSize(12);
  doc.text(`Total Team Score: ${totalScores}`, 20, finalY1 + 25);
  doc.text(`Average Founder Score: ${founders.length ? (totalScores / founders.length).toFixed(1) : "0"}`, 20, finalY1 + 35);

  // Scoring details
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Detailed Scoring', 20, finalY1 + 50);

  for (const founder of founders) {
    doc.setFontSize(12);
    doc.setTextColor(90, 50, 168);
    doc.text(`${founder.name} - ${founder.role}`, 20, (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 25 : finalY1 + 60);
    
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
      startY: (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 30 : finalY1 + 65,
      head: [['Criterion', 'Score (0-10)', 'Percentage']],
      body: scoreData,
      headStyles: { fillColor: [120, 80, 198] },
      foot: [['Equity Allocation', '', `${founder.equityPercentage.toFixed(2)}%`]],
      footStyles: { fillColor: [90, 50, 168], textColor: [255, 255, 255] },
    });
    
    // Add a new page if we're running out of space
    if ((doc as any).lastAutoTable.finalY > 250) {
      doc.addPage();
    }
  }

  // Equity Evolution History
  if (history.length > 0) {
    if ((doc as any).lastAutoTable && (doc as any).lastAutoTable.finalY > 200) {
      doc.addPage();
    }
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Equity Evolution History', 20, (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : 20);

    let yPosition = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 30 : 30;
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

      yPosition = (doc as any).lastAutoTable.finalY + 15;
      
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
    if ((doc as any).lastAutoTable && (doc as any).lastAutoTable.finalY > 220) {
      doc.addPage();
    }
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Startup Progress', 20, (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : 40);

    const milestoneData = milestones.map(milestone => [
      milestone.name,
      milestone.completed ? 'Completed' : milestone.current ? 'In Progress' : 'Pending',
    ]);

    doc.autoTable({
      startY: (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 20 : 45,
      head: [['Milestone', 'Status']],
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
