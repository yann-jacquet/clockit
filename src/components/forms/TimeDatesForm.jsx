import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { parseISO, isAfter } from 'date-fns';

const TimeDatesForm = ({ initValues, handleBlur, timeTrackingId }) => {
  const [values, setValues] = useState(initValues);
  const [errors, setErrors] = useState('');

  const handleChange = (e) => {
    const splitedInputName = e.target.name.split('-');
    const side = splitedInputName[1];

    setValues({ ...values, [side]: e.target.value });
  };

  const handleDateBlur = (e) => {
    const isEndAfterStart = isAfter(
      parseISO(values.endTimestamp),
      parseISO(values.startTimestamp),
    );

    if (!isEndAfterStart) {
      setValues(initValues);
      setErrors('The end time can not be before the start time');
    } else setErrors('');

    if (handleBlur) handleBlur(e);
  };

  return (
    <form>
      {errors ? <span>{errors}</span> : null}
      <input
        name={`${timeTrackingId}-startTimestamp`}
        type="datetime-local"
        value={values.startTimestamp}
        onChange={handleChange}
        onBlur={handleDateBlur}
      />
      <input
        name={`${timeTrackingId}-endTimestamp`}
        type="datetime-local"
        value={values.endTimestamp}
        onChange={handleChange}
        onBlur={handleDateBlur}
      />
    </form>
  );
};

TimeDatesForm.propTypes = {
  initValues: PropTypes.shape({
    startTimestamp: PropTypes.string,
    endTimestamp: PropTypes.string,
  }).isRequired,
  handleBlur: PropTypes.func.isRequired,
  timeTrackingId: PropTypes.string.isRequired,
};

export default TimeDatesForm;
