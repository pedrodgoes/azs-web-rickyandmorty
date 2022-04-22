import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/react-hooks';
import InfiniteScroll from 'react-infinite-scroll-component';

import Title from '../shared/Title';
import Loader from '../shared/Loader';
import { GET_EPISODES } from '../../queries';
import { EpisodesIcon } from '../shared/Icons';

import { Wrapper, IconWrapper, InputWrapper } from './styles';
import Episode from './Episode';

const Episodes = ({ episodes }) => {
  const [search, setSearch] = useState('');

  const {
    results,
    info: { next },
  } = episodes;
  const [nextLink, setNextLink] = useState(next);
  const [allEpisodes, setAllEpisodes] = useState(results);
  const [getEpisodes, { data }] = useLazyQuery(GET_EPISODES);

  useEffect(() => {
    if (!data || !data.episodes) return;
    const {
      episodes: {
        results: newResults,
        info: { next: newNextLink },
      },
    } = data;

    setNextLink(newNextLink);
    setAllEpisodes([...allEpisodes, ...newResults]);
  }, [data]);

  const renderEpisodes = () => {
    return allEpisodes
      .filter(val => {
        if (val.name.toLowerCase().includes(search.toLowerCase())) {
          return val;
        }
      })
      .map((episode, key) => <Episode key={key} episode={episode} />);
  };

  const loadMoreData = () => {
    getEpisodes({ variables: { page: nextLink } });
  };

  return (
    <Wrapper>
      <Title>Episodes</Title>
      <IconWrapper>
        <EpisodesIcon />
      </IconWrapper>
      <input
        style={{
          background: 'transparent',
          padding: '2px',
          borderRadius: '5px',
          height: '7%',
          border: '1px solid',
          color: 'red',
        }}
        type="text"
        placeholder="search..."
        onChange={e => {
          setSearch(e.target.value);
        }}
      />
      <div id="scrollableDiv" style={{ height: '100%', overflowY: 'scroll', width: '100%' }}>
        <InfiniteScroll
          dataLength={allEpisodes?.length}
          next={loadMoreData}
          hasMore={nextLink}
          height="50vh"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
          loader={<Loader />}
        >
          {renderEpisodes()}
        </InfiniteScroll>
      </div>
    </Wrapper>
  );
};

Episodes.propTypes = {
  episodes: PropTypes.object,
};

export default Episodes;
