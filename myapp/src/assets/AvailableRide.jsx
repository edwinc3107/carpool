import React from 'react';
import styled from 'styled-components';
import { MapPin, Calendar, Users, User } from 'lucide-react'; // optional icon library

const Card = ({ from, to, date, distance, seats, host,button }) => {
  return (
    <StyledWrapper>
      <div className="card shadow text-gray-800 p-5 flex flex-col gap-4">
        {/* Route */}
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-green-600" />
          <span className="font-semibold">{from} → {to}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>{date}</span>
        </div>

        {/* Distance */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 12h18M12 3l9 9-9 9" />
          </svg>
          <span>{distance} km</span>
        </div>

        {/* Seats */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          <span>{seats} seats</span>
        </div>

        {/* Host */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-auto">
          <User size={16} />
          <span className="italic"> Host: {host}</span>
        </div>
        <div>
            {button}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 300px;
    min-height: 300px;
    background: white;
    border-radius: 0px;
    transition: all 0.3s ease;
  }

  .shadow {
    box-shadow:
      inset 0 -3em 3em rgba(0, 0, 0, 0.05),
      0 0 0 1px rgb(230, 230, 230),
      0.2em 0.2em 0.8em rgba(0, 0, 0, 0.1);
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgb(200, 200, 200);
  }
`;

export default Card;