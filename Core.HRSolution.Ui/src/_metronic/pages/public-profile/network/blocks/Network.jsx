import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeenIcon } from '@/_metronic/components';
import { CardConnection, CardConnectionRow } from '@/_metronic/partials/cards';
const Network = () => {
  const [activeView, setActiveView] = useState('cards');
  const items = [{
    name: 'Jenny Klabber',
    info: 'Pinnacle Innovate',
    avatar: {
      className: 'size-20 relative',
      image: '300-1.png',
      imageClass: 'rounded-full',
      badgeClass: 'flex size-2.5 bg-success rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2'
    },
    email: 'kevin@pinnacle.com',
    team: {
      size: 'size-7',
      group: [{
        filename: '300-4.png'
      }, {
        filename: '300-1.png'
      }, {
        filename: '300-2.png'
      }],
      more: {
        number: 10,
        variant: 'text-success-inverse ring-success-light bg-success size-7'
      }
    },
    statistics: [{
      total: '92',
      description: 'Purchases'
    }, {
      total: '$69',
      description: 'Avg. Price'
    }, {
      total: '$6,240',
      description: 'Total spent'
    }],
    connected: true
  }, {
    name: 'Sarah Johnson',
    info: 'InnovateX',
    avatar: {
      className: 'flex items-center justify-center relative text-2.5xl text-info size-20 ring-1 ring-info-clarity bg-info-light rounded-full',
      fallback: 'S',
      badgeClass: 'flex size-2.5 bg-success rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2'
    },
    email: 'sarahj@innx.com',
    team: {
      size: 'size-7',
      group: [{
        filename: '300-5.png'
      }, {
        filename: '300-6.png'
      }, {
        filename: '300-7.png'
      }, {
        filename: '300-11.png'
      }]
    },
    statistics: [{
      total: '123',
      description: 'Purchases'
    }, {
      total: '$30',
      description: 'Avg. Price'
    }, {
      total: '$3,713',
      description: 'Total spent'
    }],
    connected: false
  }, {
    name: 'Kevin Wang',
    info: 'Pinnacle Innovate',
    avatar: {
      className: 'flex items-center justify-center relative text-2.5xl text-danger size-20 ring-1 ring-danger-clarity bg-danger-light rounded-full',
      fallback: 'K',
      badgeClass: 'flex size-2.5 bg-success rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2'
    },
    email: 'kevin@pinnacle.com',
    team: {
      size: 'size-7',
      group: [{
        filename: '300-29.png'
      }, {
        filename: '300-33.png'
      }, {
        filename: '300-23.png'
      }, {
        filename: '300-31.png'
      }]
    },
    statistics: [{
      total: '30',
      description: 'Purchases'
    }, {
      total: '$150',
      description: 'Avg. Price'
    }, {
      total: '$4,500',
      description: 'Total spent'
    }],
    connected: true
  }, {
    name: 'Brian Davis',
    info: 'Vortex Tech',
    avatar: {
      className: 'size-20 relative',
      image: '300-9.png',
      imageClass: 'rounded-full',
      badgeClass: 'flex size-2.5 bg-success rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2'
    },
    email: 'brian@vortextech.com',
    team: {
      size: 'size-7',
      group: [{
        filename: '300-14.png'
      }, {
        filename: '300-3.png'
      }, {
        filename: '300-19.png'
      }, {
        filename: '300-15.png'
      }]
    },
    statistics: [{
      total: '87',
      description: 'Purchases'
    }, {
      total: '$22',
      description: 'Avg. Price'
    }, {
      total: '$1958',
      description: 'Total spent'
    }],
    connected: true
  }, {
    name: 'Megan Taylor',
    info: 'Catalyst',
    avatar: {
      className: 'flex items-center justify-center relative text-2.5xl text-success size-20 ring-1 ring-success-clarity bg-success-light rounded-full',
      fallback: 'M',
      badgeClass: 'flex size-2.5 bg-gray-400 rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2'
    },
    email: 'megan@catalyst.com',
    team: {
      size: 'size-7',
      group: [{
        filename: '300-5.png'
      }, {
        filename: '300-26.png'
      }, {
        filename: '300-6.png'
      }, {
        filename: '300-1.png'
      }]
    },
    statistics: [{
      total: '45',
      description: 'Purchases'
    }, {
      total: '$300',
      description: 'Avg. Price'
    }, {
      total: '$13,500',
      description: 'Total spent'
    }],
    connected: false
  }, {
    name: 'Alex Martinez',
    info: 'Precision Solutions',
    avatar: {
      className: 'size-20 relative',
      image: '300-8.png',
      imageClass: 'rounded-full',
      badgeClass: 'flex size-2.5 bg-success rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2'
    },
    email: 'alex@kteam.com',
    team: {
      size: 'size-7',
      group: [{
        filename: '300-4.png'
      }, {
        filename: '300-5.png'
      }, {
        filename: '300-11.png'
      }],
      more: {
        number: 10,
        variant: 'text-success-inverse ring-success-light bg-success size-7'
      }
    },
    statistics: [{
      total: '63',
      description: 'Purchases'
    }, {
      total: '$65',
      description: 'Avg. Price'
    }, {
      total: '$4,095',
      description: 'Total spent'
    }],
    connected: true
  }];
  const renderItem = (item, index) => {
    return <CardConnection name={item.name} info={item.info} avatar={item.avatar} email={item.email} team={item.team} statistics={item.statistics} connected={item.connected} key={index} />;
  };
  const renderData = (data, index) => {
    return <CardConnectionRow name={data.name} info={data.info} avatar={data.avatar} email={data.email} team={data.team} statistics={data.statistics} connected={data.connected} key={index} />;
  };
  return <div className="flex flex-col items-stretch gap-5 lg:gap-7.5">
      <div className="flex flex-wrap items-center gap-5 justify-between">
        <h3 className="text-lg text-gray-900 font-semibold">{items.length} Connections</h3>

        <div className="btn-tabs" data-tabs="true">
          <a href="#" className={`btn btn-icon btn-sm ${activeView === 'cards' ? 'active' : ''}`} data-tab-toggle="#network_cards" onClick={() => {
          setActiveView('cards');
        }}>
            <KeenIcon icon="category" />
          </a>
          <a href="#" className={`btn btn-icon btn-sm ${activeView === 'list' ? 'active' : ''}`} data-tab-toggle="#network_list" onClick={() => {
          setActiveView('list');
        }}>
            <KeenIcon icon="row-horizontal" />
          </a>
        </div>
      </div>

      {activeView === 'cards' && <div id="network_cards">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7.5">
            {items.map((item, index) => {
          return renderItem(item, index);
        })}
          </div>

          <div className="flex grow justify-center pt-5 lg:pt-7.5">
            <Link to="/account/members/team-info" className="btn btn-link">
              Show more Connections
            </Link>
          </div>
        </div>}

      {activeView === 'list' && <div id="network_list">
          <div className="flex flex-col gap-5 lg:gap-7.5">
            {items.map((data, index) => {
          return renderData(data, index);
        })}
          </div>

          <div className="flex grow justify-center pt-5 lg:pt-7.5">
            <Link to="/account/members/team-info" className="btn btn-link">
              Show more Connections
            </Link>
          </div>
        </div>}
    </div>;
};
export { Network };