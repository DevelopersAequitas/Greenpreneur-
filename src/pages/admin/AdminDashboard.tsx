import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Users, Trophy, Handshake, Calendar, 
  MessageSquare, LogOut, Loader2, ChevronRight, Menu, X, FileText, PlusCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('nominations');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const fetchData = async (tabId: string) => {
    if (tabId === 'add-winner') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      let endpoint = '';
      
      if (tabId === 'nominations') endpoint = 'nominations';
      else if (tabId === 'events') endpoint = 'event-registrations';
      else if (tabId === 'sponsorships') endpoint = 'sponsorships';
      else {
        // It's one of the 13 forms
        endpoint = `inquiries?type=${tabId}`;
      }

      const response = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const mainNavItems = [
    { id: 'nominations', label: 'Award Nominations', icon: <Trophy size={20} /> },
    { id: 'add-winner', label: 'Add New Winner', icon: <PlusCircle size={20} /> },
    { id: 'events', label: 'Event Passes', icon: <Calendar size={20} /> },
    { id: 'sponsorships', label: 'Sponsorships (Main)', icon: <Handshake size={20} /> },
  ];

  const inquiryNavItems = [
    { id: 'apply-magazine', label: 'Apply for Magazine' },
    { id: 'advertise-magazine', label: 'Advertise in Magazine' },
    { id: 'sponsor', label: 'Become a Sponsor' },
    { id: 'partner', label: 'Apply as Partner' },
    { id: 'advertise-us', label: 'Advertise with Us' },
    { id: 'collaborate', label: 'Collaboration' },
    { id: 'fundraise', label: 'Join to Fundraise' },
    { id: 'invest', label: 'Join to Invest' },
    { id: 'membership', label: 'Membership Inquiry' },
    { id: 'publish-story', label: 'Publish Your Story' },
    { id: 'speaker-application', label: 'Speaker Applications' },
    { id: 'talk-show-speaker', label: 'Talk Show Speakers' },
    { id: 'start-chapter', label: 'Start A Chapter' },
  ];

  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const renderTable = () => {
    if (activeTab === 'add-winner') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Winner</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            try {
              const token = localStorage.getItem('adminToken');
              const res = await fetch('http://localhost:5000/api/admin/winners', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
              });
              const result = await res.json();
              if (result.success) {
                const storyLink = formData.get('website_link') as string;
                if (storyLink && storyLink.trim() !== '') {
                  window.location.href = storyLink.trim();
                } else {
                  window.location.reload();
                }
              } else {
                alert('Error: ' + result.message);
              }
            } catch (err) {
              alert('Submission failed');
            }
          }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Name *</label>
                <input type="text" name="nominee_name" required className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input type="text" name="business_name" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input type="text" name="category" required placeholder="e.g. Green Business Award" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary" />
                <p className="text-xs text-gray-500 mt-1">If the category doesn't exist, it will be created automatically.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Story Published (Link)</label>
                <input type="url" name="website_link" placeholder="https://..." className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" name="city" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Image)</label>
                <input type="file" name="profilePicture" accept="image/*" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description / Impact</label>
              <textarea name="description" rows={4} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div>
              <button type="submit" className="bg-green-800 text-white font-semibold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
                Add Winner Directly
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">No records found for this category.</p>
        </div>
      );
    }

    // Dynamic table based on data keys
    const headers = Object.keys(data[0]).filter(k => !['id', 'updated_at', 'inquiry_type'].includes(k));

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                {headers.map(h => (
                  <th key={h} className="px-6 py-4 uppercase tracking-wider text-xs">{h.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  {headers.map((h, colIndex) => (
                    <td key={h} className="px-6 py-4 text-gray-700">
                      {colIndex === 0 ? (
                        <button
                          onClick={() => setSelectedRecord(row)}
                          className="text-primary font-bold hover:underline text-left"
                        >
                          {row[h] || 'View'}
                        </button>
                      ) : h === 'created_at' 
                        ? new Date(row[h]).toLocaleDateString()
                        : typeof row[h] === 'string' && row[h].startsWith('/uploads')
                          ? <a href={`http://localhost:5000${row[h]}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium border border-primary px-3 py-1 rounded">View File</a>
                          : typeof row[h] === 'string' && row[h].startsWith('http')
                            ? <a href={row[h]} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[200px] inline-block">Link</a>
                            : row[h]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const currentLabel = [...mainNavItems, ...inquiryNavItems].find(item => item.id === activeTab)?.label;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-green-950 text-white w-72 flex-shrink-0 transition-all duration-300 flex flex-col h-screen ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-20'}`}>
        <div className="p-6 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-primary tracking-wider">GREENPRENEUR</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="px-6 py-4 border-b border-white/10 mb-4 flex-shrink-0">
          <p className="text-sm text-white/50 mb-1">Welcome back,</p>
          <p className="font-semibold">{user.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-24">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3 px-4 font-bold">Main Records</p>
            <div className="space-y-1">
              {mainNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                    activeTab === item.id 
                      ? 'bg-primary text-green-950 font-bold' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3 px-4 font-bold">Form Inquiries</p>
            <div className="space-y-1">
              {inquiryNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                    activeTab === item.id 
                      ? 'bg-primary/20 text-primary font-medium' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FileText size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-72 p-4 bg-green-950 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 flex items-center">
            Dashboard <ChevronRight size={18} className="mx-2 text-gray-400" /> {currentLabel}
          </h1>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTable()}
          </motion.div>
        </div>
      </main>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Record Details</h3>
              <button 
                onClick={() => setSelectedRecord(null)} 
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-1 rounded-full shadow-sm"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(selectedRecord).map(([key, val]) => (
                  <div key={key} className={['description', 'remarks', 'impact_text'].includes(key) ? 'md:col-span-2' : ''}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <div className="text-sm text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                      {typeof val === 'string' && val.startsWith('http') 
                        ? <a href={val} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium break-all">{val}</a>
                        : typeof val === 'string' && val.startsWith('/uploads')
                          ? <a href={`http://localhost:5000${val}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium break-all">View Attached File</a>
                          : val !== null && val !== undefined ? String(val) : <span className="text-gray-400 italic">Not provided</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
