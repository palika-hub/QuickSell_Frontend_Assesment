

// DropdownMenu.js
import React, { useState, useEffect, useRef } from 'react';
import displayIcon from "../icons_FEtask/Display.svg";
import downArrow from "../icons_FEtask/down.svg";

const DropdownMenu = ({ groupingOption, orderingOption, onGroupingChange, onOrderingChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Function to handle clicks outside the dropdown
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Common styles
  const buttonStyle = {
    backgroundColor: '#fefefe',
    width: '120px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderColor: '#f0f0f0',
    borderStyle: 'solid',
    borderRadius: '5px',
    borderWidth: "2px",
    cursor: 'pointer',
    fontFamily: 'serif',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const arrowStyle = {
    width: "15px",
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    marginLeft: '20px',
  };

  const dropdownContentStyle = {
    marginTop: '10px',
    width: "280px",
    borderRadius: '5px',
    backgroundColor: "#f8f9fb",
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    padding: '15px',
    boxShadow: '0px 8px 16px rgba(0,0,0,0.1)',
    border: '1px solid #ddd',
  };

  const labelStyle = {
    fontFamily: 'serif',
    color: "#b6b6b8",
    marginBottom: '5px',
  };

  const selectStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    marginLeft: '80px',
    backgroundColor: "#fefefe",
  };

  return (
    <div
      className="dropdown"
      style={{ position: 'relative', display: 'inline-block' }}
      ref={dropdownRef}
    >
      {/* Button with icon and "Display" text */}
      <div
        className="dropbtn"
        style={buttonStyle}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={displayIcon} style={{ width: "20px" }} alt="Display Icon" />
        <p style={{ marginLeft: "-10px", paddingRight: "15px" }}>Display</p>
        <img src={downArrow} style={arrowStyle} alt="Down Arrow" />
      </div>

      {/* Dropdown content */}
      {isOpen && (
        <div
          className="dropdownContent"
          style={dropdownContentStyle}
        >
          {/* Grouping Option */}
          <div
            className="dropdownRow"
            style={{ width: '100%', marginBottom: '15px', display: "flex", alignItems: 'center', justifyContent: 'space-between' }}
          >
            <label style={labelStyle}>Grouping</label>
            <select
              style={selectStyle}
              value={groupingOption}
              onChange={(e) => {
                onGroupingChange(e.target.value);
              }}
            >
              <option value="Status">Status</option>
              <option value="Assignee">User</option>
              <option value="Priority">Priority</option>
            </select>
          </div>

          {/* Ordering Option */}
          <div
            className="dropdownRow"
            style={{ width: '100%', display: "flex", alignItems: 'center', justifyContent: 'space-between' }}
          >
            <label style={labelStyle}>Ordering</label>
            <select
              style={selectStyle}
              value={orderingOption}
              onChange={(e) => {
                onOrderingChange(e.target.value);
              }}
            >
              <option value="Priority">Priority</option>
              <option value="Title">Title</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
