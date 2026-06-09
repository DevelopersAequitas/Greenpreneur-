import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, Handshake, Calendar, 
  LogOut, Loader2, ChevronRight, Menu, X, FileText, PlusCircle, Award, Users
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('nominations');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [editFile, setEditFile] = useState<File | null>(null);
  const [nominationFilter, setNominationFilter] = useState<string>('all');
  const [nominationSort, setNominationSort] = useState<string>('newest');
  const [membershipPaymentFilter, setMembershipPaymentFilter] = useState<string>('all');
  const [membershipSort, setMembershipSort] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewedKeys, setViewedKeys] = useState<string[]>([]);

  // Load viewed keys from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_viewed_keys');
      if (stored) {
        setViewedKeys(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading viewed keys:', err);
    }
  }, []);

  const markAsRead = (key: string) => {
    if (!viewedKeys.includes(key)) {
      const updated = [...viewedKeys, key];
      setViewedKeys(updated);
      localStorage.setItem('admin_viewed_keys', JSON.stringify(updated));
    }
  };

  const handleMarkAllRead = () => {
    const keysToAdd = processedData.map(row => `${activeTab}-${row.id}`);
    const updated = Array.from(new Set([...viewedKeys, ...keysToAdd]));
    setViewedKeys(updated);
    localStorage.setItem('admin_viewed_keys', JSON.stringify(updated));
  };

  useEffect(() => {
    setSelectedIds([]);
    setSearchQuery(''); // Reset search query on tab change
    setMembershipPaymentFilter('all');
    setMembershipSort('newest');
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Filter, sort and search tab records
  let processedData = [...data];

  // 1. General search query filter (applies to all tabs)
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    processedData = processedData.filter(row => {
      return Object.entries(row).some(([key, val]) => {
        if (val === null || val === undefined) return false;
        if (['id', 'voting_url', 'profile_picture', 'photo_url', 'business_logo'].includes(key) || key.endsWith('_at')) return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }

  if (activeTab === 'nominations') {
    // 2. Status Filtering
    if (nominationFilter === 'winner') {
      processedData = processedData.filter(row => row.status === 'winner');
    } else if (nominationFilter === 'not-winner') {
      processedData = processedData.filter(row => row.status !== 'winner');
    } else if (nominationFilter === 'approved') {
      processedData = processedData.filter(row => row.status === 'approved');
    } else if (nominationFilter === 'pending') {
      processedData = processedData.filter(row => row.status === 'pending');
    } else if (nominationFilter === 'rejected') {
      processedData = processedData.filter(row => row.status === 'rejected');
    }

    // 3. Sorting
    processedData.sort((a, b) => {
      if (nominationSort === 'newest') {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      } else if (nominationSort === 'oldest') {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      } else if (nominationSort === 'votes-desc') {
        return (b.public_votes || 0) - (a.public_votes || 0);
      } else if (nominationSort === 'votes-asc') {
        return (a.public_votes || 0) - (b.public_votes || 0);
      }
      return 0;
    });
  }

  if (activeTab === 'membership' || activeTab === 'community-members') {
    // 2. Payment Status Filtering
    if (membershipPaymentFilter === 'paid') {
      processedData = processedData.filter(row => row.payment_status === 'paid');
    } else if (membershipPaymentFilter === 'pending') {
      processedData = processedData.filter(row => row.payment_status === 'pending');
    }

    // 3. Sorting
    processedData.sort((a, b) => {
      if (membershipSort === 'newest') {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      } else if (membershipSort === 'oldest') {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      }
      return 0;
    });
  }

  const exportToCSV = () => {
    if (!processedData || processedData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const dataToExport = selectedIds.length > 0 ? processedData.filter(row => selectedIds.includes(activeTab === 'winners' ? `${row.source}-${row.id}` : String(row.id))) : processedData;

    // 1. Get headers
    let headers: string[] = [];
    if (activeTab === 'winners') {
      headers = ['name', 'company', 'category', 'city', 'award_year', 'track', 'source'];
    } else {
      headers = Object.keys(processedData[0]).filter(k => !['id', 'inquiry_type'].includes(k));
    }

    // 2. Build CSV rows
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.map(h => `"${h.replace(/"/g, '""').toUpperCase()}"`).join(','));

    // Add data rows
    for (const row of dataToExport) {
      const values = headers.map(header => {
        const val = row[header];
        let valStr = '';
        if (val !== null && val !== undefined) {
          valStr = String(val);
        }
        return `"${valStr.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    // 3. Create blob and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `${activeTab}_export_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (window.confirm(`Are you sure you want to set the status of ${selectedIds.length} selected nominations to ${status}?`)) {
      try {
        const token = localStorage.getItem('adminToken');
        const numericIds = selectedIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        const res = await fetch(`http://${window.location.hostname}:5000/api/admin/nominations/bulk-status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ids: numericIds, status })
        });
        const result = await res.json();
        if (result.success) {
          alert('Selected nominations updated successfully!');
          setSelectedIds([]);
          fetchData('nominations');
        } else {
          alert('Bulk update failed: ' + result.message);
        }
      } catch (err) {
        alert('Bulk update request failed');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected records?`)) {
      try {
        const token = localStorage.getItem('adminToken');
        const numericIds = selectedIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        const res = await fetch(`http://${window.location.hostname}:5000/api/admin/bulk-delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ids: numericIds, type: activeTab })
        });
        const result = await res.json();
        if (result.success) {
          alert('Selected records deleted successfully!');
          setSelectedIds([]);
          fetchData(activeTab);
        } else {
          alert('Bulk delete failed: ' + result.message);
        }
      } catch (err) {
        alert('Bulk delete request failed');
      }
    }
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
      else if (tabId === 'winners') endpoint = 'winners';
      else if (tabId === 'events') endpoint = 'event-registrations';
      else if (tabId === 'sponsorships') endpoint = 'sponsorships';
      else if (tabId === 'membership') endpoint = 'community-applications';
      else if (tabId === 'community-members') endpoint = 'community-applications';
      else {
        // It's one of the 13 forms
        endpoint = `inquiries?type=${tabId}`;
      }

      const response = await fetch(`http://${window.location.hostname}:5000/api/admin/${endpoint}`, {
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
    { id: 'winners', label: 'Winners List', icon: <Award size={20} /> },
    { id: 'add-winner', label: 'Add New Winner', icon: <PlusCircle size={20} /> },
    { id: 'events', label: 'Event Passes', icon: <Calendar size={20} /> },
    { id: 'sponsorships', label: 'Sponsorships (Main)', icon: <Handshake size={20} /> },
    { id: 'community-members', label: 'Community Members', icon: <Users size={20} /> },
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

  useEffect(() => {
    if (selectedRecord) {
      setEditForm({
        nominee_name: selectedRecord.nominee_name || '',
        business_name: selectedRecord.business_name || '',
        description: selectedRecord.description || '',
        city: selectedRecord.city || '',
        phone: selectedRecord.phone || '',
        email: selectedRecord.email || '',
      });
      setEditFile(null);
      setIsEditing(false);
      markAsRead(`${activeTab}-${selectedRecord.id}`);
    }
  }, [selectedRecord]);

  const handleSaveNominationChanges = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('nominee_name', editForm.nominee_name);
      formData.append('business_name', editForm.business_name);
      formData.append('description', editForm.description);
      formData.append('city', editForm.city);
      formData.append('phone', editForm.phone);
      formData.append('email', editForm.email);
      if (editFile) {
        formData.append('profilePicture', editFile);
      }

      const res = await fetch(`http://${window.location.hostname}:5000/api/admin/nominations/${selectedRecord.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        alert('Nomination details updated successfully!');
        setIsEditing(false);
        setSelectedRecord(null);
        fetchData('nominations');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      alert('Failed to save changes');
    }
  };

  const renderTable = () => {
    if (activeTab === 'winners') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <h2 className="text-xl font-bold text-gray-800">Current Winners</h2>
              {/* Search Bar for Winners */}
              <div className="relative flex-1 sm:w-64 max-w-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search winners..."
                  className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs focus:ring-primary focus:border-primary outline-none shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
              {selectedIds.length > 0 ? (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                  <span className="text-xs font-bold text-red-800">{selectedIds.length} Selected</span>
                  <button
                    onClick={async () => {
                      if (window.confirm(`Are you sure you want to remove the ${selectedIds.length} selected winners?`)) {
                        try {
                          const token = localStorage.getItem('adminToken');
                          const winnersToDelete = data.filter(row => selectedIds.includes(`${row.source}-${row.id}`)).map(row => ({ id: row.id, source: row.source }));
                          const res = await fetch(`http://${window.location.hostname}:5000/api/admin/bulk-delete`, {
                            method: 'POST',
                            headers: { 
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}` 
                            },
                            body: JSON.stringify({ ids: winnersToDelete.map(w => w.id), type: 'winners', winners: winnersToDelete })
                          });
                          const result = await res.json();
                          if (result.success) {
                            setSelectedIds([]);
                            fetchData('winners');
                          } else {
                            alert('Bulk delete failed');
                          }
                        } catch (err) {
                          alert('Request failed');
                        }
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2.5 rounded text-[10px] uppercase transition-colors"
                  >
                    Delete Selected
                  </button>
                </div>
              ) : null}
              <button
                onClick={exportToCSV}
                className="bg-green-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-xs flex items-center gap-1.5"
              >
                Export {selectedIds.length > 0 ? 'Selected' : 'CSV'}
              </button>
              <button
                onClick={() => setActiveTab('add-winner')}
                className="bg-green-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-xs flex items-center gap-1.5"
              >
                <PlusCircle size={16} /> Add Winner
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={processedData.length > 0 && selectedIds.length === processedData.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(processedData.map(row => `${row.source}-${row.id}`));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="rounded border-gray-300 text-green-800 focus:ring-green-700 h-4 w-4"
                    />
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Company</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Category</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">City</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Year</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Track</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Source</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processedData.map((row) => (
                  <tr key={`${row.source}-${row.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(`${row.source}-${row.id}`)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, `${row.source}-${row.id}`]);
                          } else {
                            setSelectedIds(prev => prev.filter(id => id !== `${row.source}-${row.id}`));
                          }
                        }}
                        className="rounded border-gray-300 text-green-800 focus:ring-green-700 h-4 w-4"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{row.name}</td>
                    <td className="px-6 py-4 text-gray-700">{row.company || '-'}</td>
                    <td className="px-6 py-4 text-gray-700">{row.category}</td>
                    <td className="px-6 py-4 text-gray-700">{row.city || '-'}</td>
                    <td className="px-6 py-4 text-gray-700">{row.award_year}</td>
                    <td className="px-6 py-4 text-gray-700 capitalize">{row.track}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${row.source === 'nomination' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                        {row.source === 'nomination' ? 'Nomination' : 'Legacy / Direct'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <button
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to remove ${row.name} from the winners list?`)) {
                            try {
                              const token = localStorage.getItem('adminToken');
                              const res = await fetch(`http://${window.location.hostname}:5000/api/admin/winners/${row.id}?source=${row.source}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                              });
                              const result = await res.json();
                              if (result.success) {
                                fetchData('winners');
                              } else {
                                alert('Failed to delete: ' + result.message);
                              }
                            } catch (err) {
                              alert('Delete request failed');
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800 font-semibold text-xs border border-red-200 hover:border-red-400 px-3 py-1 rounded bg-red-50/50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'add-winner') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Winner</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            try {
              const token = localStorage.getItem('adminToken');
              const res = await fetch(`http://${window.location.hostname}:5000/api/admin/winners`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
              });
              const result = await res.json();
              if (result.success) {
                alert('Winner added successfully!');
                setActiveTab('winners');
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

    if (processedData.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-500">No records found matching filters.</p>
            {activeTab === 'nominations' && (
              <button 
                onClick={() => { setNominationFilter('all'); setNominationSort('newest'); }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      );
    }

    // Dynamic table based on data keys
    const headers = Object.keys(processedData[0]).filter(k => !['id', 'updated_at', 'inquiry_type'].includes(k));

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header Section with Search and Actions */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <h2 className="text-lg font-bold text-gray-800 capitalize">{activeTab.replace(/-/g, ' ')} Records</h2>
            
            {/* Search Input Box */}
            <div className="relative flex-1 sm:w-64 max-w-xs min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab.replace(/-/g, ' ')}...`}
                className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs focus:ring-primary focus:border-primary outline-none shadow-sm text-gray-700 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto justify-end">
            {selectedIds.length > 0 ? (
              activeTab === 'nominations' ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                  <span className="text-xs font-bold text-green-800">{selectedIds.length} Selected</span>
                  <button
                    onClick={() => handleBulkStatusUpdate('winner')}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 px-2.5 rounded text-[10px] uppercase transition-colors"
                  >
                    🏆 Make Winners
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('approved')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2.5 rounded text-[10px] uppercase transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2.5 rounded text-[10px] uppercase transition-colors"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                  <span className="text-xs font-bold text-red-800">{selectedIds.length} Selected</span>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2.5 rounded text-[10px] uppercase transition-colors"
                  >
                    Delete Selected
                  </button>
                </div>
              )
            ) : null}
            <button
              onClick={exportToCSV}
              className="bg-green-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-xs flex items-center gap-1.5"
            >
              Export {selectedIds.length > 0 ? 'Selected' : 'CSV'}
            </button>
          </div>
        </div>

        {/* Nominations Filters Bar */}
        {activeTab === 'nominations' && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/20 flex flex-wrap gap-4 items-center">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status:</span>
              <select
                value={nominationFilter}
                onChange={(e) => setNominationFilter(e.target.value)}
                className="border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:ring-primary focus:border-primary outline-none bg-white min-w-[130px] shadow-sm text-gray-700"
              >
                <option value="all">All Statuses</option>
                <option value="winner">Winner Only</option>
                <option value="not-winner">Not Winner Only</option>
                <option value="approved">Approved Only</option>
                <option value="pending">Pending Only</option>
                <option value="rejected">Rejected Only</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By:</span>
              <select
                value={nominationSort}
                onChange={(e) => setNominationSort(e.target.value)}
                className="border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:ring-primary focus:border-primary outline-none bg-white min-w-[150px] shadow-sm text-gray-700"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="votes-desc">Highest Votes</option>
                <option value="votes-asc">Lowest Votes</option>
              </select>
            </div>

            {/* Mark All as Read Button */}
            <button
              onClick={handleMarkAllRead}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors text-xs border border-gray-200 flex items-center gap-1.5"
            >
              ✓ Mark Current as Read
            </button>
            
            <div className="ml-auto text-xs text-gray-500 font-medium">
              Showing {processedData.length} entries
            </div>
          </div>
        )}

        {/* Membership Filters Bar */}
        {(activeTab === 'membership' || activeTab === 'community-members') && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/20 flex flex-wrap gap-4 items-center">
            {/* Payment Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment:</span>
              <select
                value={membershipPaymentFilter}
                onChange={(e) => setMembershipPaymentFilter(e.target.value)}
                className="border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:ring-primary focus:border-primary outline-none bg-white min-w-[130px] shadow-sm text-gray-700"
              >
                <option value="all">All Payment Statuses</option>
                <option value="paid">Paid Only</option>
                <option value="pending">Pending Only</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By:</span>
              <select
                value={membershipSort}
                onChange={(e) => setMembershipSort(e.target.value)}
                className="border border-gray-200 rounded-lg p-2 text-xs font-semibold focus:ring-primary focus:border-primary outline-none bg-white min-w-[150px] shadow-sm text-gray-700"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Mark All as Read Button */}
            <button
              onClick={handleMarkAllRead}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors text-xs border border-gray-200 flex items-center gap-1.5"
            >
              ✓ Mark Current as Read
            </button>
            
            <div className="ml-auto text-xs text-gray-500 font-medium">
              Showing {processedData.length} entries
            </div>
          </div>
        )}

        {/* Table Display Container */}
        <div className="overflow-x-auto">
          {activeTab === 'nominations' ? (
            /* Premium Custom Table for Nominations */
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={processedData.length > 0 && selectedIds.length === processedData.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(processedData.map(row => String(row.id)));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="rounded border-gray-300 text-green-800 focus:ring-green-700 h-4 w-4"
                    />
                  </th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs font-bold text-gray-500">Nominee Details</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs font-bold text-gray-500">Company & City</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs font-bold text-gray-500">Category</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs font-bold text-gray-500">Votes & Score</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs font-bold text-gray-500">Payment Status</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs font-bold text-gray-500">Status</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs font-bold text-gray-500">Submitted At</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs font-bold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processedData.map((row, i) => {
                  const isUnread = !viewedKeys.includes(`nominations-${row.id}`);
                  
                  return (
                    <tr key={i} className={`hover:bg-gray-50 transition-colors ${row.status === 'winner' ? 'bg-amber-50/20' : ''} ${isUnread ? 'bg-blue-50/20' : ''}`}>
                      <td className="px-6 py-4 w-10">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(String(row.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(prev => [...prev, String(row.id)]);
                            } else {
                              setSelectedIds(prev => prev.filter(id => id !== String(row.id)));
                            }
                          }}
                          className="rounded border-gray-300 text-green-800 focus:ring-green-700 h-4 w-4"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedRecord(row)}
                              className="text-primary font-bold hover:underline text-left text-sm flex items-center gap-1.5"
                            >
                              {row.status === 'winner' && <span title="Winner">🏆</span>}
                              <span>{row.nominee_name}</span>
                            </button>
                            {isUnread && (
                              <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ml-1.5 shadow-sm shadow-emerald-500/20 animate-pulse" title="Unread Nomination (New)">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              row.track === 'rated' 
                                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {row.track}
                            </span>
                            <span className="text-xs text-gray-500">{row.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-sm">{row.business_name || '-'}</span>
                          <span className="text-xs text-gray-500">{row.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium whitespace-normal max-w-[200px]">
                        {row.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                            ⭐ {row.public_votes || 0} <span className="text-xs text-gray-400 font-normal">votes</span>
                          </span>
                          <span className="text-xs text-gray-500">
                            Jury: {row.jury_score !== null && row.jury_score !== undefined ? `${row.jury_score}/100` : 'Not graded'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border text-center w-max ${
                            row.payment_status === 'paid'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : row.payment_status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : row.payment_status === 'failed'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-gray-50 text-gray-500 border-gray-200'
                          }`}>
                            {row.payment_status === 'not_applicable' ? 'N/A' : row.payment_status}
                          </span>
                          {row.package && (
                            <span className="text-xs text-gray-500 capitalize">
                              {row.package.replace(/_/g, ' ')} (₹{row.package_amount})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          row.status === 'winner'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : row.status === 'approved'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : row.status === 'rejected'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : row.status === 'vetting'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {row.status === 'winner' ? '🏆 Winner' : row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                        {row.created_at ? new Date(row.created_at).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedRecord(row)}
                          className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-1.5 px-3 rounded-lg text-xs transition-colors border border-gray-200"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* Generic Dynamic Table for other forms and pipeline records */
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={processedData.length > 0 && selectedIds.length === processedData.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(processedData.map(row => String(row.id)));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="rounded border-gray-300 text-green-800 focus:ring-green-700 h-4 w-4"
                    />
                  </th>
                  {headers.map(h => (
                    <th key={h} className="px-6 py-4 uppercase tracking-wider text-xs font-bold text-gray-500">{h.replace(/_/g, ' ')}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processedData.map((row, i) => {
                  const isUnread = !viewedKeys.includes(`${activeTab}-${row.id}`);
                  
                  return (
                    <tr key={i} className={`hover:bg-gray-50 transition-colors ${isUnread ? 'bg-blue-50/20 font-medium' : ''}`}>
                      <td className="px-6 py-4 w-10">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(String(row.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(prev => [...prev, String(row.id)]);
                            } else {
                              setSelectedIds(prev => prev.filter(id => id !== String(row.id)));
                            }
                          }}
                          className="rounded border-gray-300 text-green-800 focus:ring-green-700 h-4 w-4"
                        />
                      </td>
                      {headers.map((h, colIndex) => (
                        <td key={h} className="px-6 py-4 text-gray-700">
                          {colIndex === 0 ? (
                            <button
                              onClick={() => setSelectedRecord(row)}
                              className="text-primary font-bold hover:underline text-left flex flex-wrap items-center gap-1.5"
                            >
                              <span>{row[h] || 'View'}</span>
                              {isUnread && (
                                <span className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse ml-1.5 shadow-sm shadow-emerald-500/20" title="Unread Inquiry">
                                  NEW
                                </span>
                              )}
                            </button>
                          ) : h === 'status' ? (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
                              row[h] === 'winner' || row[h] === 'approved' || row[h] === 'onboarded'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : row[h] === 'under_review' || row[h] === 'vetting'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : row[h] === 'rejected'
                                    ? 'bg-red-100 text-red-800 border-red-200'
                                    : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {row[h] === 'winner' ? '🏆 Winner' : row[h]}
                            </span>
                          ) : h === 'payment_status' ? (
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border text-center uppercase w-max ${
                              row[h] === 'paid'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : row[h] === 'pending'
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  : row[h] === 'failed'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                              {row[h]}
                            </span>
                          ) : h === 'created_at' 
                            ? (row[h] ? new Date(row[h]).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              }) : '-')
                            : typeof row[h] === 'string' && row[h].startsWith('/uploads')
                              ? <a href={`http://${window.location.hostname}:5000${row[h]}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium border border-primary px-3 py-1 rounded bg-primary/10 transition-colors">View File</a>
                              : typeof row[h] === 'string' && row[h].startsWith('http')
                                ? <a href={row[h]} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[200px] inline-block font-semibold">Link</a>
                                : row[h] ? String(row[h]) : '-'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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
              {isEditing && activeTab === 'nominations' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nominee Name</label>
                    <input
                      type="text"
                      value={editForm.nominee_name}
                      onChange={(e) => setEditForm({ ...editForm, nominee_name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Business Name</label>
                    <input
                      type="text"
                      value={editForm.business_name}
                      onChange={(e) => setEditForm({ ...editForm, business_name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Change Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setEditFile(e.target.files[0]);
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-primary focus:border-primary file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary-dark"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description / Green Work Impact</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-3 mt-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold uppercase transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNominationChanges}
                      className="px-5 py-2.5 bg-green-800 hover:bg-green-700 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(selectedRecord).map(([key, val]) => (
                    <div key={key} className={['description', 'remarks', 'impact_text', 'why_join'].includes(key) ? 'md:col-span-2' : ''}>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <div className="text-sm text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                        {typeof val === 'string' && val.startsWith('http') 
                          ? <a href={val} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium break-all">{val}</a>
                          : typeof val === 'string' && val.startsWith('/uploads')
                            ? <a href={`http://${window.location.hostname}:5000${val}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium break-all">View Attached File</a>
                            : val !== null && val !== undefined ? String(val) : <span className="text-gray-400 italic">Not provided</span>}
                      </div>
                    </div>
                  ))}

                  {activeTab === 'nominations' && (
                    <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-4 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Manage Nomination Status
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {['pending', 'vetting', 'approved', 'rejected', 'winner'].map((st) => (
                            <button
                              key={st}
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem('adminToken');
                                  const res = await fetch(`http://${window.location.hostname}:5000/api/admin/nominations/${selectedRecord.id}/status`, {
                                    method: 'PATCH',
                                    headers: { 
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}` 
                                    },
                                    body: JSON.stringify({ status: st })
                                  });
                                  const result = await res.json();
                                  if (result.success) {
                                    alert(`Nomination status updated to ${st}!`);
                                    setSelectedRecord(null);
                                    fetchData('nominations');
                                  } else {
                                    alert('Error: ' + result.message);
                                  }
                                } catch (err) {
                                  alert('Failed to update status');
                                }
                              }}
                              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-colors ${
                                selectedRecord.status === st
                                  ? 'bg-green-800 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {st === 'winner' ? '🏆 Make Winner' : st}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-end self-end">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-2.5 bg-[#B38728] hover:bg-[#a07620] text-white rounded-lg text-xs font-bold uppercase transition-colors"
                        >
                          Edit Details / Photo
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'membership' && (
                    <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Manage Application Status
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['applied', 'under_review', 'approved', 'rejected', 'onboarded'].map((st) => (
                          <button
                            key={st}
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('adminToken');
                                const res = await fetch(`http://${window.location.hostname}:5000/api/admin/community-applications/${selectedRecord.id}/status`, {
                                  method: 'PATCH',
                                  headers: { 
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}` 
                                  },
                                  body: JSON.stringify({ status: st })
                                });
                                const result = await res.json();
                                if (result.success) {
                                  alert(`Status updated to ${st}!`);
                                  setSelectedRecord(null);
                                  fetchData('membership');
                                } else {
                                  alert('Error: ' + result.message);
                                }
                              } catch (err) {
                                alert('Failed to update status');
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-colors ${
                              selectedRecord.status === st
                                ? 'bg-green-800 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {st.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
