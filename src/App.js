

// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './components/card';
import DropdownMenu from './components/Dropdown';
import addIcon from './icons_FEtask/add.svg';
import menuIcon from './icons_FEtask/3 dot menu.svg';
import backlogIcon from './icons_FEtask/Backlog.svg';
import todoIcon from './icons_FEtask/To-do.svg';
import inProgressIcon from './icons_FEtask/in-progress.svg';
import doneIcon from './icons_FEtask/Done.svg';
import cancelledIcon from './icons_FEtask/Cancelled.svg';
import lowPriorityIcon from './icons_FEtask/Img - Low Priority.svg';
import mediumPriorityIcon from './icons_FEtask/Img - Medium Priority.svg';
import highPriorityIcon from './icons_FEtask/Img - High Priority.svg';
import urgentPriorityIcon from './icons_FEtask/SVG - Urgent Priority grey.svg';
import urgentPriorityColorIcon from './icons_FEtask/SVG - Urgent Priority colour.svg';
import noPriorityIcon from './icons_FEtask/No-priority.svg';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState(null);
  const [orderingOption, setOrderingOption] = useState(null);
  const [userAvatars, setUserAvatars] = useState({});

  // Fetch data from API
  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(data => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Load view state from localStorage
  useEffect(() => {
    const savedGroupingOption = localStorage.getItem('groupingOption');
    const savedOrderingOption = localStorage.getItem('orderingOption');
    const savedUserAvatars = JSON.parse(localStorage.getItem('userAvatars') || '{}');

    setGroupingOption(savedGroupingOption || 'Status');
    setOrderingOption(savedOrderingOption || 'Priority');
    setUserAvatars(savedUserAvatars);
  }, []);

  // Save view state to localStorage whenever it changes
  useEffect(() => {
    if (groupingOption && orderingOption) {
      localStorage.setItem('groupingOption', groupingOption);
      localStorage.setItem('orderingOption', orderingOption);
    }
  }, [groupingOption, orderingOption]);

  // Generate user avatars with initials and random colors
  useEffect(() => {
    if (users.length > 0) {
      const avatars = { ...userAvatars };
      users.forEach(user => {
        if (!avatars[user.id]) {
          const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          avatars[user.id] = { initials, color };
        }
      });
      setUserAvatars(avatars);
      localStorage.setItem('userAvatars', JSON.stringify(avatars));
    }
  }, [users]);

  // Map users by id for easy lookup
  const usersMap = users.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {});

  if (!groupingOption || !orderingOption) {
    // Don't render until groupingOption and orderingOption are loaded
    return null;
  }

  // Define possible group keys based on groupingOption
  let groupKeys = [];
  if (groupingOption === 'Status') {
    groupKeys = ['Backlog', 'Todo', 'In progress', 'Done', 'Cancelled'];
  } else if (groupingOption === 'Priority') {
    groupKeys = ['No Priority', 'Low', 'Medium', 'High', 'Urgent', 'Critical', 'Others'];
  } else if (groupingOption === 'Assignee') {
    groupKeys = users.map(user => user.name);
    groupKeys.push('Unassigned');
  }

  // Initialize groupedTickets with empty arrays
  let groupedTickets = {};
  groupKeys.forEach(groupKey => {
    groupedTickets[groupKey] = [];
  });

  // Group tickets based on groupingOption
  tickets.forEach(ticket => {
    let groupKey = '';
    if (groupingOption === 'Status') {
      groupKey = ticket.status;
    } else if (groupingOption === 'Assignee') {
      const user = usersMap[ticket.userId];
      groupKey = user ? user.name : 'Unassigned';
    } else if (groupingOption === 'Priority') {
      // Map priority numbers to labels
      const priorityLabels = {
        '0': 'No Priority',
        '1': 'Low',
        '2': 'Medium',
        '3': 'High',
        '4': 'Urgent',
        '5': 'Critical',
      };
      groupKey = priorityLabels[ticket.priority.toString()] || 'Others';
    } else {
      groupKey = 'Others';
    }

    if (!groupedTickets[groupKey]) {
      groupedTickets[groupKey] = [];
    }
    groupedTickets[groupKey].push(ticket);
  });

  // Sort tickets within each group based on orderingOption
  const sortedGroupedTickets = {};
  groupKeys.forEach(groupKey => {
    let sortedTickets = [...groupedTickets[groupKey]];
    if (orderingOption === 'Priority') {
      // Sort by priority (ascending order)
      sortedTickets.sort((a, b) => a.priority - b.priority);
    } else if (orderingOption === 'Title') {
      // Sort by title (alphabetical order)
      sortedTickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    sortedGroupedTickets[groupKey] = sortedTickets;
  });

  // Map status to icons
  const statusIcons = {
    'Backlog': backlogIcon,
    'Todo': todoIcon,
    'In progress': inProgressIcon,
    'Done': doneIcon,
    'Cancelled': cancelledIcon,
  };

  // Map priority labels to icons
  const priorityIcons = {
    'No Priority': noPriorityIcon,
    'Low': lowPriorityIcon,
    'Medium': mediumPriorityIcon,
    'High': highPriorityIcon,
    'Urgent': urgentPriorityIcon,
    'Critical': urgentPriorityColorIcon,
  };

  return (
    <div className="App" style={{ backgroundColor: "#f4f5f9", width: '100vw', minHeight: '100vh', margin: '0' }}>
      {/* Header with DropdownMenu */}
      <div style={{ display: 'flex', backgroundColor: "#ffffff", width: '100%', height: "70px", alignItems: 'center' }}>
        <div style={{ paddingLeft: '40px' }}>
          <DropdownMenu
            groupingOption={groupingOption}
            orderingOption={orderingOption}
            onGroupingChange={handleGroupingChange}
            onOrderingChange={handleOrderingChange}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: '20px', paddingLeft: '20px', paddingRight: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {groupKeys.map(groupKey => (
            <div key={groupKey} style={{ marginRight: '25px', marginBottom: '20px', width: '300px', marginLeft: '25px' }}>
              {/* Group Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Group Icon */}
                  {groupingOption === 'Status' && statusIcons[groupKey] && (
                    <img src={statusIcons[groupKey]} alt={groupKey} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                  )}
                  {groupingOption === 'Priority' && priorityIcons[groupKey] && (
                    <img src={priorityIcons[groupKey]} alt={groupKey} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                  )}
                  {groupingOption === 'Assignee' && (
                    <>
                      {users.find(u => u.name === groupKey) ? (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: userAvatars[users.find(u => u.name === groupKey).id]?.color || '#ccc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '5px',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '12px',
                        }}>
                          {userAvatars[users.find(u => u.name === groupKey).id]?.initials || ''}
                        </div>
                      ) : (
                        <div style={{ width: '20px', height: '20px', marginRight: '5px' }}></div>
                      )}
                    </>
                  )}
                  <h3 style={{ margin: 0 }}>{groupKey}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* Task Count */}
                  <span style={{ marginRight: '10px', fontSize: '14px', color: '#666' }}>{sortedGroupedTickets[groupKey].length}</span>
                  <img src={addIcon} alt="Add" style={{ width: '20px', height: '20px', marginRight: '10px', cursor: 'pointer' }} />
                  <img src={menuIcon} alt="Menu" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
              </div>
              {/* Tickets */}
              {sortedGroupedTickets[groupKey].map(ticket => (
                <Card
                  key={ticket.id}
                  ticket={ticket}
                  user={usersMap[ticket.userId]}
                  groupingOption={groupingOption}
                  userAvatars={userAvatars}
                />
              ))}
              {/* Show message if no tickets */}
              {sortedGroupedTickets[groupKey].length === 0 && (
                <p style={{ color: '#888', fontStyle: 'italic' }}>No tickets</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Handle grouping and ordering option changes
  function handleGroupingChange(newGroupingOption) {
    setGroupingOption(newGroupingOption);
  }

  function handleOrderingChange(newOrderingOption) {
    setOrderingOption(newOrderingOption);
  }
}

export default App;
