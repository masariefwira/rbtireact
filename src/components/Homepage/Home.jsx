import React from 'react';
import HomepageTable from './Homepage';
import './Home.css';

const Home = () => {
  return (
    <React.Fragment>
      <div className="homepage">
        <div className="homepage-container">
          <h1>
            List buku <br /> RBTI
          </h1>
          <HomepageTable></HomepageTable>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
