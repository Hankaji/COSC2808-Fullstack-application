import HomePanel from './HomePanel';
import HomeRightSide from './HomeRightSide';
import Layout from '../../components/Layout';

const HomePage = () => {
  return (
    <Layout stickyRightSideCmp={<HomeRightSide />}>
      <HomePanel />
    </Layout>
  );
};

export default HomePage;
