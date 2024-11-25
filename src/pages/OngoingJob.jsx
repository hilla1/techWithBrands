import React, { useState } from 'react';
import { Modal, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import HomeLayout from '../components/HomePage/HomeLayout';

// Dummy data
const mockTask = {
  id: '1',
  title: 'Fix User Authentication Bug',
  isAccepted: false,
  details: 'The authentication process fails intermittently. Investigate and resolve the issue.',
  milestones: [
    { text: 'Investigate the bug', completed: false },
    { text: 'Implement a fix', completed: false },
    { text: 'Test the solution', completed: false },
    { text: 'Deploy the fix', completed: false }
  ],
  budget: 500 // Example budget in dollars
};

const OngoingJob = () => {
  const [task, setTask] = useState(mockTask);
  const [isAccepted, setIsAccepted] = useState(task.isAccepted);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState(task.details);
  const [milestone, setMilestone] = useState('');
  const [reassignTo, setReassignTo] = useState('');
  const [adminApproval, setAdminApproval] = useState(false);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const totalMilestones = task.milestones.length;
    const completedMilestones = task.milestones.filter(m => m.completed).length;
    return (completedMilestones / totalMilestones) * 100;
  };

  const handleAcceptTask = () => {
    setIsAccepted(true);
    setTask(prev => ({ ...prev, isAccepted: true }));
  };

  const handleUpdateTask = () => {
    setTask(prev => ({ ...prev, details: newTaskDetails }));
    setIsUpdating(false);
  };

  const handleAddMilestone = () => {
    setTask(prev => ({
      ...prev,
      milestones: [...prev.milestones, { text: milestone, completed: false }]
    }));
    setMilestone('');
    setIsAddingMilestone(false);
  };

  const handleReassignTask = () => {
    if (adminApproval) {
      setTask(prev => ({ ...prev, reassignTo }));
      setReassignTo('');
      setIsReassigning(false);
    } else {
      setAdminApproval(true);
    }
  };

  const handleMilestoneChange = (index) => {
    setTask(prev => {
      const updatedMilestones = [...prev.milestones];
      updatedMilestones[index].completed = !updatedMilestones[index].completed;
      return { ...prev, milestones: updatedMilestones };
    });
  };

  return (
    <HomeLayout>
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        {/* Task Information */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-2">{task.title}</h2>
          <p className="text-gray-700 mb-2">Budget: ${task.budget}</p>
          <p className="text-gray-700 mb-4">Progress: {Math.round(getProgressPercentage())}%</p>
          <p className="text-gray-800 mb-6">{task.details}</p> {/* Task Description */}

          {isAccepted ? (
            <p className="text-green-600 font-semibold mb-4">Task Accepted</p>
          ) : (
            <Button
              variant="contained"
              color="warning"
              onClick={handleAcceptTask}
              className="mb-4"
              style={{ backgroundColor: '#F89F2D', color: '#fff' }} // Orange color
            >
              Accept Task
            </Button>
          )}
        </div>

        {/* Task Actions */}
        <div className="mb-6">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsUpdating(true)}
            className={`mr-4 ${!isAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ borderColor: '#2E3191' }}
            disabled={!isAccepted}
          >
            Update Task
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setIsAddingMilestone(true)}
            className={`${!isAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ borderColor: '#F89F2D' }}
          >
            Add Milestone
          </Button>
        </div>

        {/* Milestones */}
        {task.milestones.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Milestones</h3>
            <ul className="list-disc list-inside ml-4">
              {task.milestones.map((milestone, index) => (
                <li key={index} className="mb-2 text-gray-700">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={milestone.completed}
                        onChange={() => handleMilestoneChange(index)}
                        disabled={!isAccepted}
                      />
                    }
                    label={milestone.text}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reassign Task Button */}
        <Button
          variant="outlined"
          color="default"
          onClick={() => setIsReassigning(true)}
          className={`${isAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ borderColor: '#2E3191' }}
          disabled={isAccepted}
        >
          Reassign Task
        </Button>

        {/* Update Task Modal */}
        <Modal
          open={isUpdating}
          onClose={() => setIsUpdating(false)}
          className="flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Update Task</h2>
            <TextField
              multiline
              rows={4}
              value={newTaskDetails}
              onChange={(e) => setNewTaskDetails(e.target.value)}
              placeholder="Update task details..."
              fullWidth
              className="mb-4"
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handleUpdateTask}
              style={{ backgroundColor: '#F89F2D', color: '#fff' }}
            >
              Save Changes
            </Button>
          </div>
        </Modal>

        {/* Add Milestone Modal */}
        <Modal
          open={isAddingMilestone}
          onClose={() => setIsAddingMilestone(false)}
          className="flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Add Milestone</h2>
            <TextField
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              placeholder="Enter milestone details..."
              fullWidth
              className="mb-4"
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handleAddMilestone}
              style={{ backgroundColor: '#F89F2D', color: '#fff' }}
            >
              Add Milestone
            </Button>
          </div>
        </Modal>

        {/* Reassign Task Modal */}
        <Modal
          open={isReassigning}
          onClose={() => setIsReassigning(false)}
          className="flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Reassign Task</h2>
            {adminApproval ? (
              <div>
                <TextField
                  value={reassignTo}
                  onChange={(e) => setReassignTo(e.target.value)}
                  placeholder="Enter new assignee..."
                  fullWidth
                  className="mb-4"
                />
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleReassignTask}
                  style={{ backgroundColor: '#F89F2D', color: '#fff' }}
                >
                  Reassign Task
                </Button>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-gray-700">Reassignment requires admin approval. Do you want to proceed?</p>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => setAdminApproval(true)}
                  style={{ backgroundColor: '#F89F2D', color: '#fff' }}
                >
                  Request Admin Approval
                </Button>
              </div>
            )}
          </div>
        </Modal>
      </div>
     </div>
   </HomeLayout>
  );
};

export default OngoingJob;
