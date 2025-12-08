import FeaturesHighlight from './highlights';
import FeaturesOverview from './overview';

const Features = ({ data }) => {
  return (
    <>
      <FeaturesOverview data={data} />
      <FeaturesHighlight />
    </>
  );
};

export default Features;
