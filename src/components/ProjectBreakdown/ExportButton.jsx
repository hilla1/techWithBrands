import React from 'react';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const exportToPDF = (projectTitle, modules) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${projectTitle} - Status Report`, 14, 10);
    doc.setFontSize(12);

    const tableRows = modules.map((module, index) => {
        const parsedStartDate = new Date(module.startTime);
        const parsedEndDate = new Date(module.deadline);

        // Check if the dates are valid
        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            toast.error('Invalid date format for one of the modules. Please check your dates.');
            return [index + 1, module.title, 'Invalid Dates', 'N/A', 'N/A', 'N/A']; // Handle invalid dates gracefully
        }

        const formattedStartDate = format(parsedStartDate, 'MMM dd, yyyy');
        const formattedEndDate = format(parsedEndDate, 'MMM dd, yyyy');

        return [
            index + 1,
            module.title,
            `${formattedStartDate} - ${formattedEndDate}`, // Use module-specific dates
            `${module.progress}%`,
            module.expertInfo?.name || 'N/A',
            module.expertInfo?.title || 'N/A',
        ];
    });

    doc.autoTable({
        head: [['#', 'Module', 'Dates', 'Progress', 'Expert Name', 'Expert Title']],
        body: tableRows,
        startY: 20,
    });

    // Adding milestones for each module
    modules.forEach((module, index) => {
        doc.text(`Module ${index + 1}: ${module.title}`, 14, doc.autoTable.previous.finalY + 10);
        
        const milestoneRows = module.milestones.map((milestone) => [
            format(new Date(milestone.date), 'MMM dd, yyyy'), // Only dates
            milestone.task,
        ]);

        doc.autoTable({
            head: [['Date', 'Task']],
            body: milestoneRows,
            startY: doc.autoTable.previous.finalY + 20,
        });
    });

    doc.save(`${projectTitle}_status_report.pdf`);
    toast.success('Status report downloaded successfully!');
};

const ExportButton = ({ projectTitle, modules }) => (
    <div className="flex justify-center">
        <button
            className="text-blue-900 pb-2 underline text-sm lg:text-base hover:text-orange-500"
            onClick={() => exportToPDF(projectTitle, modules)}
        >
            Download Status Report (PDF)
        </button>
    </div>
);

export default ExportButton;
