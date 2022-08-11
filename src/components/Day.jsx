import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import moment from 'moment';

const DayStyled = styled.div`
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background: #fff;
  border: 1px solid #585858;
  color: #585858;
  list-style: none;
  padding: 10px;
  transition: padding 0.3s ease-in-out, background-color 0.3s ease-in-out;
  width: 100%;
  .day-header {
    text-align: right;
    .day-week-name {
      font-size: 0.8em;
    }
    .day-date {
      font-size: 1.2em;
      text-transform: capitalize;
    }
  }
  .day-header::after {
    content: "";
    clear: both;
    display: block;
  }
  .day-event {
    // display: flex;
    min-height: 70px;
    text-align: left;
    width: 100%;
  }
  .day-event-list {
    display: block;
    flex: 1;
    margin-top: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .day-event-list-minimalist {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #585858;
  }
  ${props =>
    props.today &&
    css`
      border-bottom: 1px solid tomato;
    `}
  ${props =>
    props.active &&
    css`
      padding-top: 20px;
      padding-bottom: 20px;
      background: #585858;
      color: #fff;
      .day-event-list-minimalist {
        background-color: #fff;
      }
    `}
`;

const Day = ({
  date, events, active, variant, isPast, eventMinimalist,
}) => {
  const isToday = moment(date).isSame(new Date(), 'd');
  let dayClass = 'day';
  const weekFormat = variant === 'default' ? 'dddd' : 'ddd';
  let formatWeekDay = moment(date).format(weekFormat);
  if (active) {
    dayClass += ' active';
  }
  if (isToday) {
    dayClass += ' today';
    formatWeekDay = moment().calendar(null).split(' ');
    formatWeekDay = formatWeekDay[0];
  }

  const getEvents = () => {
    if (events.length === 0) {
      return null;
    }

    if (isPast || eventMinimalist) {
      return <div className="day-event-list-minimalist" />;
    }
    return events.map(event => (
      <div className="day-event-list" key={event.id}>
        {event.name}
      </div>
    ));
  };

  const defaultVariant = () => (
    <React.Fragment>
      <div className="day-header">
        <div className="day-date">{moment(date).format('MMM DD')}</div>
        <div className="day-week-name">{formatWeekDay}</div>
      </div>
      <div className="day-event">
        {events.map(event => (
          <div className="day-event-list" key={event.id}>
            {event.name}
          </div>
        ))}
      </div>
    </React.Fragment>
  );

  const dayVariant = () => (
    <React.Fragment>
      <div className="day-header">
        <div className="day-week-name">{formatWeekDay}</div>
        <div className="day-date">{moment(date).format('DD')}</div>
        <div className="day-event">{getEvents()}</div>
      </div>
    </React.Fragment>
  );

  const byVariant = () => {
    switch (variant) {
      case 'day':
        return dayVariant();

      default:
        return defaultVariant();
    }
  };

  return (
    <DayStyled className={dayClass} today={isToday} dayClass active={active}>
      {byVariant()}
    </DayStyled>
  );
};

Day.defaultProps = {
  active: false,
  variant: 'default',
  isPast: false,
  eventMinimalist: false,
};

Day.propTypes = {
  date: PropTypes.string.isRequired,
  events: PropTypes.array.isRequired,
  active: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'day']),
  isPast: PropTypes.bool,
  eventMinimalist: PropTypes.bool,
};

export default Day;
