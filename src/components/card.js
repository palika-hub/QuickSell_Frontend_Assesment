

// Card.js
import React from 'react';
import backlogIcon from "../icons_FEtask/Backlog.svg";
import todoIcon from "../icons_FEtask/To-do.svg";
import inProgressIcon from "../icons_FEtask/in-progress.svg";
import doneIcon from "../icons_FEtask/Done.svg";
import cancelledIcon from "../icons_FEtask/Cancelled.svg";
import lowPriorityIcon from "../icons_FEtask/Img - Low Priority.svg";
import mediumPriorityIcon from "../icons_FEtask/Img - Medium Priority.svg";
import highPriorityIcon from "../icons_FEtask/Img - High Priority.svg";
import urgentPriorityIcon from "../icons_FEtask/SVG - Urgent Priority grey.svg";
import noPriorityIcon from "../icons_FEtask/No-priority.svg";

function Card({ ticket, user, groupingOption, userAvatars }) {
  // Map status to icons
  const statusIcons = {
    'Backlog': backlogIcon,
    'Todo': todoIcon,
    'In progress': inProgressIcon,
    'Done': doneIcon,
    'Cancelled': cancelledIcon,
  };

  const statusIcon = statusIcons[ticket.status] || backlogIcon;

  // Map priority levels to icons
  const priorityIcons = {
    '0': noPriorityIcon, // No Priority
    '1': lowPriorityIcon, // Low
    '2': mediumPriorityIcon, // Medium
    '3': highPriorityIcon, // High
    '4': urgentPriorityIcon, // Urgent
    '5': urgentPriorityIcon, // Critical
  };

  const priorityIcon = priorityIcons[ticket.priority.toString()] || noPriorityIcon;

  // Determine user availability (online/offline)
  const isUserOnline = user ? user.available : false;

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: "10px",
      borderColor: '#e3e3e5',
      borderStyle: "solid",
      borderWidth: "1px",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      alignItems: 'center',
      padding: '10px',
      marginBottom: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      {/* Header with Ticket ID and User Profile */}
      <div className='firstline' style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '10px',
      }}>
        <p style={{ color: '#838383', fontWeight: 'bold', margin: 0 }}>{ticket.id}</p>
        {groupingOption !== 'Assignee' && user && (
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: userAvatars[user.id]?.color || '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px',
            }}>
              {userAvatars[user.id]?.initials || ''}
            </div>
            {/* Online/offline status indicator */}
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isUserOnline ? '#4caf50' : '#f44336',
                position: 'absolute',
                bottom: '0',
                right: '0',
                border: '2px solid #fff',
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Ticket Title with Status Icon */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
      }}>
        {groupingOption !== 'Status' && (
          <img src={statusIcon} style={{ width: '14px', height: '14px', marginRight: '10px' }} alt="Status" />
        )}
        <b><p style={{ color: '#292929', fontSize: '14px', margin: 0 }}>{ticket.title}</p></b>
      </div>

      {/* Priority Icon */}
      {groupingOption !== 'Priority' && (
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: "20px",
            height: '20px',
            borderStyle: 'solid',
            borderColor: '#f3f3f3',
            borderRadius: "2px",
            borderWidth: "1px",
            marginRight: '10px',
          }}>
            <img src={priorityIcon} style={{ width: '14px', height: '14px' }} alt="Priority" />
          </div>
          {/* Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '20px',
            borderStyle: 'solid',
            borderColor: '#f3f3f3',
            borderRadius: "2px",
            borderWidth: "1px",
            padding: '0 5px',
          }}>
            <div style={{
              backgroundColor: '#c0c0c8',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              marginRight: '5px',
            }}></div>
            <p style={{
              color: '#6e6d72',
              fontSize: '12px',
              fontFamily: 'serif',
              margin: 0,
            }}>{ticket.tag.join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
