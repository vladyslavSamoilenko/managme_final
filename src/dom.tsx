import React, { useState, useEffect, createContext, useContext } from 'react';
import { Plus, Moon, Sun, Edit2, Trash2, Eye, User, Calendar, Clock, ArrowRight } from 'lucide-react';


// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'devops' | 'developer';
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Story {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  createdDate: string;
  status: 'todo' | 'doing' | 'done';
  ownerId: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  storyId: string;
  estimatedHours: number;
  status: 'todo' | 'doing' | 'done';
  createdDate: string;
  startDate?: string;
  endDate?: string;
  assignedUserId?: string;
}

const mockUsers: User[] = [
  { id: '1', firstName: 'Admin', lastName: 'User', role: 'admin' },
  { id: '2', firstName: 'John', lastName: 'Developer', role: 'developer' },
  { id: '3', firstName: 'Jane', lastName: 'DevOps', role: 'devops' },
  { id: '4', firstName: 'Mike', lastName: 'Developer', role: 'developer' }
];

const mockProjects: Project[] = [
  { id: '1', name: 'E-commerce Platform', description: 'Online shopping platform development' },
  { id: '2', name: 'Mobile App', description: 'Cross-platform mobile application' },
  { id: '3', name: 'Data Analytics', description: 'Business intelligence dashboard' }
];

const mockStories: Story[] = [
  {
    id: '1',
    name: 'User Authentication System',
    description: 'Implement login, registration, and password reset functionality',
    priority: 'high',
    projectId: '1',
    createdDate: '2024-01-15T10:00:00Z',
    status: 'doing',
    ownerId: '1'
  },
  {
    id: '2',
    name: 'Product Catalog',
    description: 'Create product listing, search, and filtering features',
    priority: 'high',
    projectId: '1',
    createdDate: '2024-01-16T09:30:00Z',
    status: 'todo',
    ownerId: '1'
  },
  {
    id: '3',
    name: 'Shopping Cart',
    description: 'Implement shopping cart functionality with persistent storage',
    priority: 'medium',
    projectId: '1',
    createdDate: '2024-01-17T14:20:00Z',
    status: 'todo',
    ownerId: '1'
  },
  {
    id: '4',
    name: 'Payment Integration',
    description: 'Integrate with payment gateways (Stripe, PayPal)',
    priority: 'high',
    projectId: '1',
    createdDate: '2024-01-18T11:45:00Z',
    status: 'todo',
    ownerId: '1'
  },
  {
    id: '5',
    name: 'Admin Dashboard',
    description: 'Create admin panel for managing products and orders',
    priority: 'medium',
    projectId: '1',
    createdDate: '2024-01-19T16:00:00Z',
    status: 'done',
    ownerId: '1'
  },
  {
    id: '6',
    name: 'Cross-platform Setup',
    description: 'Setup React Native project with navigation',
    priority: 'high',
    projectId: '2',
    createdDate: '2024-01-20T08:15:00Z',
    status: 'done',
    ownerId: '1'
  },
  {
    id: '7',
    name: 'User Profile Screen',
    description: 'Create user profile with edit capabilities',
    priority: 'medium',
    projectId: '2',
    createdDate: '2024-01-21T13:30:00Z',
    status: 'doing',
    ownerId: '1'
  },
  {
    id: '8',
    name: 'Push Notifications',
    description: 'Implement push notification system',
    priority: 'low',
    projectId: '2',
    createdDate: '2024-01-22T10:45:00Z',
    status: 'todo',
    ownerId: '1'
  },
  {
    id: '9',
    name: 'Data Pipeline',
    description: 'Setup ETL pipeline for data processing',
    priority: 'high',
    projectId: '3',
    createdDate: '2024-01-23T09:00:00Z',
    status: 'doing',
    ownerId: '1'
  },
  {
    id: '10',
    name: 'Dashboard UI',
    description: 'Create interactive dashboard with charts',
    priority: 'medium',
    projectId: '3',
    createdDate: '2024-01-24T15:20:00Z',
    status: 'todo',
    ownerId: '1'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Design Login Form',
    description: 'Create responsive login form with validation',
    priority: 'high',
    storyId: '1',
    estimatedHours: 4,
    status: 'done',
    createdDate: '2024-01-15T10:30:00Z',
    startDate: '2024-01-15T11:00:00Z',
    endDate: '2024-01-15T15:30:00Z',
    assignedUserId: '2'
  }
];

interface AppContextType {
  currentUser: User;
  users: User[];
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  stories: Story[];
  tasks: Task[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  addStory: (story: Omit<Story, 'id' | 'createdDate'>) => void;
  updateStory: (id: string, story: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdDate'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  assignTask: (taskId: string, userId: string) => void;
  completeTask: (taskId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

class ApiService {
  static async getProjects(): Promise<Project[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockProjects), 100));
  }

  static async getStories(projectId: string): Promise<Story[]> {
    const existingStories = localStorage.getItem('stories');
    if (!existingStories) {
      localStorage.setItem('stories', JSON.stringify(mockStories));
    }
    
    const stories = JSON.parse(localStorage.getItem('stories') || '[]');
    return stories.filter((s: Story) => s.projectId === projectId);
  }

  static async getTasks(projectId: string): Promise<Task[]> {
    const existingTasks = localStorage.getItem('tasks');
    if (!existingTasks) {
      localStorage.setItem('tasks', JSON.stringify(mockTasks));
    }
    
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const stories = await this.getStories(projectId);
    const storyIds = stories.map(s => s.id);
    return tasks.filter((t: Task) => storyIds.includes(t.storyId));
  }

  static async saveStory(story: Story): Promise<Story> {
    const stories = JSON.parse(localStorage.getItem('stories') || '[]');
    const existingIndex = stories.findIndex((s: Story) => s.id === story.id);
    if (existingIndex >= 0) {
      stories[existingIndex] = story;
    } else {
      stories.push(story);
    }
    localStorage.setItem('stories', JSON.stringify(stories));
    return story;
  }

  static async saveTask(task: Task): Promise<Task> {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const existingIndex = tasks.findIndex((t: Task) => t.id === task.id);
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return task;
  }

  static async deleteStory(id: string): Promise<void> {
    const stories = JSON.parse(localStorage.getItem('stories') || '[]');
    const filtered = stories.filter((s: Story) => s.id !== id);
    localStorage.setItem('stories', JSON.stringify(filtered));
  }

  static async deleteTask(id: string): Promise<void> {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const filtered = tasks.filter((t: Task) => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filtered));
  }
}

const Header: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { currentUser, darkMode, toggleDarkMode } = context;

  return (
    <header className={`border-b p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Project Manager
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Welcome, {currentUser.firstName} {currentUser.lastName} ({currentUser.role})
          </p>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

const ProjectSelector: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { projects, activeProject, setActiveProject, darkMode } = context;

  return (
    <div className={`border-b p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Active Project
      </label>
      <select
        value={activeProject?.id || ''}
        onChange={(e) => {
          const project = projects.find(p => p.id === e.target.value);
          setActiveProject(project || null);
        }}
        className={`w-full p-2 border rounded-lg ${
          darkMode 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      >
        <option value="">Select a project...</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const StoryModal: React.FC<{
  story?: Story;
  onClose: () => void;
  onSave: (story: Omit<Story, 'id' | 'createdDate'>) => void;
}> = ({ story, onClose, onSave }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { activeProject, darkMode } = context;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    name: story?.name || '',
    description: story?.description || '',
    priority: story?.priority || 'medium' as const,
    status: story?.status || 'todo' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    
    onSave({
      ...formData,
      projectId: activeProject.id,
      ownerId: context.currentUser.id
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {story ? 'Edit Story' : 'Add Story'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high'})}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as 'todo' | 'doing' | 'done'})}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 px-4 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskModal: React.FC<{
  task?: Task;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdDate'>) => void;
}> = ({ task, onClose, onSave }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { stories, darkMode } = context;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    priority: task?.priority || 'medium' as const,
    storyId: task?.storyId || '',
    estimatedHours: task?.estimatedHours || 1,
    status: task?.status || 'todo' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {task ? 'Edit Task' : 'Add Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Story
            </label>
            <select
              value={formData.storyId}
              onChange={(e) => setFormData({...formData, storyId: e.target.value})}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            >
              <option value="">Select a story...</option>
              {stories.map(story => (
                <option key={story.id} value={story.id}>
                  {story.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high'})}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Estimated Hours
            </label>
            <input
              type="number"
              min="1"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({...formData, estimatedHours: parseInt(e.target.value)})}
              className={`w-full p-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 px-4 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskDetailsModal: React.FC<{
  task: Task;
  onClose: () => void;
  onAssign: (taskId: string, userId: string) => void;
  onComplete: (taskId: string) => void;
}> = ({ task, onClose, onAssign, onComplete }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { users, stories, darkMode } = context;
  const story = stories.find(s => s.id === task.storyId);
  const assignedUser = users.find(u => u.id === task.assignedUserId);
  const availableUsers = users.filter(u => u.role === 'developer' || u.role === 'devops');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg w-full max-w-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Task Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {task.name}
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {task.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Priority:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : task.priority === 'medium' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  task.status === 'done' 
                    ? 'bg-green-100 text-green-800' 
                    : task.status === 'doing' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {task.estimatedHours}h estimated
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Story: {story?.name}
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Created: {new Date(task.createdDate).toLocaleDateString()}
                </span>
              </div>
              
              {task.startDate && (
                <div className="flex items-center gap-2">
                  <ArrowRight size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Started: {new Date(task.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {task.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Completed: {new Date(task.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {assignedUser && (
                <div className="flex items-center gap-2">
                  <User size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Assigned: {assignedUser.firstName} {assignedUser.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {task.status === 'todo' && (
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Assign to User
            </label>
            <div className="flex gap-2">
              <select
                className={`flex-1 p-2 border rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                onChange={(e) => {
                  if (e.target.value) {
                    onAssign(task.id, e.target.value);
                  }
                }}
                defaultValue=""
              >
                <option value="">Select user...</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {task.status === 'doing' && (
          <div className="mb-4">
            <button
              onClick={() => onComplete(task.id)}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Mark as Complete
            </button>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`py-2 px-4 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StoriesView: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { stories, addStory, updateStory, deleteStory, darkMode } = context;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editingStory, setEditingStory] = useState<Story | undefined>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [filter, setFilter] = useState<'all' | 'todo' | 'doing' | 'done'>('all');

  const filteredStories = stories.filter(story => 
    filter === 'all' || story.status === filter
  );

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setShowModal(true);
  };

  const handleSave = (storyData: Omit<Story, 'id' | 'createdDate'>) => {
    if (editingStory) {
      updateStory(editingStory.id, storyData);
    } else {
      addStory(storyData);
    }
    setEditingStory(undefined);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Stories
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Story
        </button>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          {(['all', 'todo', 'doing', 'done'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredStories.map(story => (
          <div
            key={story.id}
            className={`p-4 border rounded-lg ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {story.name}
                </h3>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {story.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    story.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : story.priority === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {story.priority}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    story.status === 'done' 
                      ? 'bg-green-100 text-green-800' 
                      : story.status === 'doing' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {story.status}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(story.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(story)}
                  className={`p-2 rounded ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteStory(story.id)}
                  className={`p-2 rounded ${
                    darkMode 
                      ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                      : 'text-red-500 hover:text-red-700 hover:bg-gray-100'
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <StoryModal
          story={editingStory}
          onClose={() => {
            setShowModal(false);
            setEditingStory(undefined);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const TasksView: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { tasks, addTask, updateTask, deleteTask, assignTask, completeTask, darkMode } = context;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleSave = (taskData: Omit<Task, 'id' | 'createdDate'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setEditingTask(undefined);
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Tasks
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      <div className="grid gap-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`p-4 border rounded-lg ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {task.name}
                </h3>
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {task.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : task.priority === 'medium' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.status === 'done' 
                      ? 'bg-green-100 text-green-800' 
                      : task.status === 'doing' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {task.estimatedHours}h
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(task)}
                  className={`p-2 rounded ${
                    darkMode 
                      ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700' 
                      : 'text-blue-500 hover:text-blue-700 hover:bg-gray-100'
                  }`}
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className={`p-2 rounded ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className={`p-2 rounded ${
                    darkMode 
                      ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' 
                      : 'text-red-500 hover:text-red-700 hover:bg-gray-100'
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(undefined);
          }}
          onSave={handleSave}
        />
      )}

      {showDetailsModal && selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTask(undefined);
          }}
          onAssign={assignTask}
          onComplete={completeTask}
        />
      )}
    </div>
  );
};

const KanbanView: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { tasks, users, darkMode } = context;

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const doingTasks = tasks.filter(task => task.status === 'doing');
  const doneTasks = tasks.filter(task => task.status === 'done');

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const assignedUser = users.find(u => u.id === task.assignedUserId);
    
    return (
      <div className={`p-3 rounded-lg border mb-3 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h4 className={`font-semibold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {task.name}
        </h4>
        <p className={`text-xs mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {task.description}
        </p>
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded text-xs ${
            task.priority === 'high' 
              ? 'bg-red-100 text-red-800' 
              : task.priority === 'medium' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {task.priority}
          </span>
          {assignedUser && (
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {assignedUser.firstName} {assignedUser.lastName}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Kanban Board
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h3 className={`font-semibold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            To Do ({todoTasks.length})
          </h3>
          <div>
            {todoTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h3 className={`font-semibold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Doing ({doingTasks.length})
          </h3>
          <div>
            {doingTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h3 className={`font-semibold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Done ({doneTasks.length})
          </h3>
          <div>
            {doneTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<User>(mockUsers[0]); // Admin user
  const [users] = useState<User[]>(mockUsers);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [darkMode, setDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    // Load projects
    ApiService.getProjects().then(setProjects);
  }, []);

  useEffect(() => {
    if (activeProject) {
      // Load stories and tasks for active project
      ApiService.getStories(activeProject.id).then(setStories);
      ApiService.getTasks(activeProject.id).then(setTasks);
    } else {
      setStories([]);
      setTasks([]);
    }
  }, [activeProject]);

  const addStory = (storyData: Omit<Story, 'id' | 'createdDate'>) => {
    const newStory: Story = {
      ...storyData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString()
    };
    ApiService.saveStory(newStory);
    setStories(prev => [...prev, newStory]);
  };

  const updateStory = (id: string, storyData: Partial<Story>) => {
    const story = stories.find(s => s.id === id);
    if (story) {
      const updatedStory = { ...story, ...storyData };
      ApiService.saveStory(updatedStory);
      setStories(prev => prev.map(s => s.id === id ? updatedStory : s));
    }
  };

  const deleteStory = (id: string) => {
    ApiService.deleteStory(id);
    setStories(prev => prev.filter(s => s.id !== id));
    // Also delete related tasks
    const relatedTasks = tasks.filter(t => t.storyId === id);
    relatedTasks.forEach(task => ApiService.deleteTask(task.id));
    setTasks(prev => prev.filter(t => t.storyId !== id));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdDate'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString()
    };
    ApiService.saveTask(newTask);
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const updatedTask = { ...task, ...taskData };
      ApiService.saveTask(updatedTask);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    }
  };

  const deleteTask = (id: string) => {
    ApiService.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const assignTask = (taskId: string, userId: string) => {
    updateTask(taskId, {
      assignedUserId: userId,
      status: 'doing',
      startDate: new Date().toISOString()
    });
  };

  const completeTask = (taskId: string) => {
    updateTask(taskId, {
      status: 'done',
      endDate: new Date().toISOString()
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const value: AppContextType = {
    currentUser,
    users,
    projects,
    activeProject,
    setActiveProject,
    stories,
    tasks,
    darkMode,
    toggleDarkMode,
    addStory,
    updateStory,
    deleteStory,
    addTask,
    updateTask,
    deleteTask,
    assignTask,
    completeTask
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'tasks' | 'kanban'>('stories');
  const context = useContext(AppContext);
  
  if (!context) return null;
  
  const { activeProject, darkMode } = context;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
      <Header />
      <ProjectSelector />
      
      {activeProject ? (
        <>
          <nav className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex">
              {(['stories', 'tasks', 'kanban'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === tab
                      ? darkMode
                        ? 'border-b-2 border-blue-500 text-blue-400'
                        : 'border-b-2 border-blue-500 text-blue-600'
                      : darkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </nav>
          
          {activeTab === 'stories' && <StoriesView />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'kanban' && <KanbanView />}
        </>
      ) : (
        <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Please select a project to continue
        </div>
      )}
      
      </div>
    </div>

  );
};

export default function ProjectManager() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}