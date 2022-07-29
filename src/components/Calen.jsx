import React from 'react';
import PropTypes from 'prop-types';
import momentjs from 'moment';
import { extendMoment } from 'moment-range';
import { DEFAULT_DATE_FORMAT } from './constants';
import Calendar from './Calendar';
import CalendarNavigator from './CalendarNavigator';

const moment = extendMoment(momentjs);
const Calen = (props) => {
  const [stateDaysQuantity, setStateDaysQuantity] = React.useState(props.daysQuantity || 7);
  const [statePeriod, setStatePeriod] = React.useState(null);
  const [stateDay, setStateDay] = React.useState(null);
  const breakPoints = {
    sm: window.matchMedia('(min-width: 576px)'),
    md: window.matchMedia('(min-width: 768px)'),
    lg: window.matchMedia('(min-width: 992px)'),
    xl: window.matchMedia('(min-width: 1200px)'),
  };

  const setActiveDay = (day) => {
    setStateDay(day);
    const { onDayChange } = props;
    if (onDayChange) {
      onDayChange(day);
    }
  };

  const handlePeriodChange = (period) => {
    const day = moment(props.date);
    const today = moment();
    const range = moment.range(period.from, period.to);
    let date = period.from.format(DEFAULT_DATE_FORMAT);
    if (range.contains(today)) {
      date = today.format(DEFAULT_DATE_FORMAT);
    }

    setStatePeriod(period);
    const { onPeriodChange } = props;
    if (onPeriodChange) {
      onPeriodChange(period);
    }

    if (range.contains(moment(day))) {
      date = moment(day).format(DEFAULT_DATE_FORMAT);
    }
    setActiveDay(date);
  };

  const setPeriod = (quantity) => {
    const { date } = props;
    const period = {
      from: moment().startOf('isoWeek'),
      to: moment().startOf('isoWeek').add(quantity, 'days'),
    };
    if (statePeriod) {
      const { from } = statePeriod;
      period.from = from.startOf('isoWeek');
      period.to = from.clone().startOf('isoWeek').add(quantity, 'days');
    } else if (date) {
      period.from = moment(date).startOf('isoWeek');
      period.to = moment(date).startOf('isoWeek').add(quantity, 'days');
    }
    setStatePeriod(period);
    handlePeriodChange(period);
  };

  const setDaysQuantity = (quantity) => {
    setStateDaysQuantity(quantity);
    const { onDaysQuantityChange } = props;
    if (onDaysQuantityChange) {
      onDaysQuantityChange(quantity);
    }
    setPeriod(quantity - 1);
  };

  const resetDaysQuantityOnResize = () => {
    const {
      xl, lg, md, sm,
    } = breakPoints;

    xl.addListener(resetDaysQuantityOnResize);
    lg.addListener(resetDaysQuantityOnResize);
    md.addListener(resetDaysQuantityOnResize);
    sm.addListener(resetDaysQuantityOnResize);

    let quantity = stateDaysQuantity;
    if (xl.matches) {
      quantity = 7;
    } else if (lg.matches) {
      quantity = 5;
    } else if (md.matches) {
      quantity = 4;
    } else if (sm.matches) {
      quantity = 2;
    } else {
      quantity = 1;
    }
    setDaysQuantity(props.scrollEnabled ? props.daysQuantity : quantity);
  };

  const setUpDaysQuantity = () => {
    const quantity = props.daysQuantity;
    if (!quantity) {
      resetDaysQuantityOnResize();
    } else {
      setDaysQuantity(quantity);
    }
  };

  const removeBreakPointsEvents = () => {
    breakPoints.xl.removeListener(resetDaysQuantityOnResize);
    breakPoints.lg.removeListener(resetDaysQuantityOnResize);
    breakPoints.md.removeListener(resetDaysQuantityOnResize);
    breakPoints.sm.removeListener(resetDaysQuantityOnResize);
  };

  React.useEffect(() => {
    try {
      require(`moment/locale/${props.locale}`);
    } catch (e) {
      if (props.locale !== 'en') {
        console.log(new Error('Locale not found'));
      }
    }
    setUpDaysQuantity();

    return removeBreakPointsEvents();
  }, []);

  const handleDayAddEventClick = (day) => {
    props.onDayAddEventClick(day);
  };

  const handleDayClick = (day) => {
    setActiveDay(day);
  };

  if (!statePeriod) {
    return null;
  }

  return (
    <div>
      <CalendarNavigator
        period={statePeriod}
        daysQuantity={stateDaysQuantity}
        onPeriodChange={handlePeriodChange}
      />
      <Calendar
        period={statePeriod}
        day={stateDay}
        data={props.data}
        scrollEnabled={props.scrollEnabled}
        onDayClick={handleDayClick}
        onDayAddEventClick={
            props.onDayAddEventClick ? handleDayAddEventClick : null
          }
      />
    </div>
  );
};

Calen.defaultProps = {
  date: moment(),
  locale: null,
  data: {},
  daysQuantity: 0,
  scrollEnabled: false,
  onDayChange: null,
  onDayAddEventClick: null,
  onPeriodChange: null,
  onDaysQuantityChange: null,
};

Calen.propTypes = {
  locale: PropTypes.string,
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
  ]),
  data: PropTypes.object,
  daysQuantity: PropTypes.number,
  scrollEnabled: PropTypes.bool,
  onDayChange: PropTypes.func,
  onDayAddEventClick: PropTypes.func,
  onPeriodChange: PropTypes.func,
  onDaysQuantityChange: PropTypes.func,
};

export default Calen;
