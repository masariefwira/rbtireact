import React from 'react';
import './Home.css';
import SearchBar from './Search';
import HomepageAlt from './HomepageAlt';
import { Link } from 'react-router-dom';

const Home = () => {
  const url = 'http://localhost:8080/api/buku/search';

  const [search, setSearch] = React.useState('');
  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const [data, setData] = React.useState([]);
  const handleSearch = () => {
    const body = { query: search };
    if (search.length < 3) {
      return;
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.data == null) {
          setData([]);
        } else {
          setData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <React.Fragment>
      <div className="homepage">
        <div className="homepage-container">
          <h1>
            List buku <br /> RBTI
          </h1>
          <SearchBar inputHandler={handleInput} query={search} />
          {/* <HomepageTable></HomepageTable> */}
          {data.length > 0 ? <HomepageAlt buku={data}></HomepageAlt> : null}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
