import PropTypes from 'prop-types';
import DoubleSectionProgressBar from './ProgressBar';

const SequenceProgressBar = ({ completed, total, dropped }) => (
  <DoubleSectionProgressBar
    total={total}
    primaryCount={completed}
    secondaryCount={dropped}
  />
);

SequenceProgressBar.propTypes = {
  total: PropTypes.number.isRequired,
  completed: PropTypes.number.isRequired,
  dropped: PropTypes.number.isRequired,
};

export default SequenceProgressBar;
