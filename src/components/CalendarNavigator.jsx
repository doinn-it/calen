import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import { SHORT_DATE_FORMAT } from './constants';

const CalendarNavigatorStyled = styled.div`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  float: right;
  button {
    border-color: #585858;
    outline: none;
    background: #fff;
    height: 40px;
    margin: 0 2px;
    width: 40px;
    svg {
      stroke: #585858;
    }
  }
  button:active, button:focus {
    border-color: #000;
    background: #fcfcfc;
  }
  .calendar-navigation__date-range {
    text-transform: capitalize
  }
`;

const CalendarNavigator = (props) => {
  const formatPeriodString = () => {
    const { from, to } = props.period;

    if (props.daysQuantity <= 1) {
      return `${from.format(SHORT_DATE_FORMAT)}`;
    }

    if (!from.isSame(to, 'year')) {
      return `${from.format(SHORT_DATE_FORMAT)} - ${to.format(SHORT_DATE_FORMAT)}`;
    }

    if (!from.isSame(to, 'month')) {
      return `${from.format('MMM')} - ${to.format(SHORT_DATE_FORMAT)}`;
    }

    return `${to.format(SHORT_DATE_FORMAT)}`;
  };

  const formatTitle = () => {
    const periodString = formatPeriodString();
    let prefix = '';
    let suffix = '';

    if (props.prefix) {
      prefix = `${props.prefix} `;
    }

    if (props.suffix) {
      suffix = ` ${props.suffix}`;
    }

    return prefix + periodString + suffix;
  };

  const prev = () => {
    const to = moment(props.period.from).subtract(1, 'days');
    const from = moment(to).subtract(props.daysQuantity - 1, 'days');
    const period = { from, to };
    props.onPeriodChange(period);
    return period;
  };

  const next = () => {
    const from = moment(props.period.to).add(1, 'days');
    const to = moment(from).add(props.daysQuantity - 1, 'days');
    const period = { from, to };
    props.onPeriodChange(period);
    return period;
  };

  return (
    <CalendarNavigatorStyled className="calendar-navigator__wrapper">
      <div className="calendar-navigator">
        <span className="calendar-navigation__date-range">{formatTitle()}</span>
        <button className="calendar-navigation__button previous" onClick={prev}>
          <svg width="8px" height="10px" viewBox="0 0 50 80">
            <polyline
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="45.63,75.8 0.375,38.087 45.63,0.375 "
            />
          </svg>
        </button>
        <button className="calendar-navigation__button next" onClick={next}>
          <svg width="8px" height="10px" viewBox="0 0 50 80">
            <polyline
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0.375,0.375 45.63,38.087 0.375,75.8 "
            />
          </svg>
        </button>
      </div>
    </CalendarNavigatorStyled>
  );
};

CalendarNavigator.defaultProps = {
  prefix: null,
  suffix: null,
};

CalendarNavigator.propTypes = {
  period: PropTypes.shape({
    from: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(moment),
    ]),
    to: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(moment),
    ]),
  }).isRequired,
  daysQuantity: PropTypes.number.isRequired,
  onPeriodChange: PropTypes.func.isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
};

export default CalendarNavigator;
